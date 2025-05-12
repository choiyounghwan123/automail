import os.path
import time
import uuid
from concurrent.futures.thread import ThreadPoolExecutor
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
import logging
import json
from kafka import KafkaProducer
from config import Config

save_dir = 'images'
os.makedirs(save_dir, exist_ok=True)  # ✅ 폴더 먼저 만들

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("crawler.log"), logging.StreamHandler()]
)

logger = logging.getLogger(__name__)
producer = KafkaProducer(
    bootstrap_servers=Config.KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

def fetch_content(link, retries=3, backoff=2):
    for attempt in range(retries):
        try:
            response = requests.get(link, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
            img_tags = soup.find_all("img")

            saved_paths = []  # 저장된 경로들을 담을 리스트

            for i,img in enumerate(img_tags):
                if img.has_attr('src'):
                    img_url = img['src']
                    response = requests.get(img_url)

                    if response.status_code == 200:
                        path = urlparse(img_url).path
                        ext = os.path.splitext(path)[1]
                        filename = f'image_{uuid.uuid4().hex}{ext}'
                        save_path = os.path.join(save_dir, filename)

                        with open(f'images/{filename}', 'wb') as f:
                            f.write(response.content)
                        saved_paths.append(save_path)
                        print(save_path)
                        print(f"{filename} 저장완료")
                    else:
                        print(f'{img_url}')

            content = soup.find('div', class_='artclView').get_text(strip=True)
            return content,saved_paths
        except requests.RequestException as e:
            logger.error(f"Failed to fetch {link}, attempt {attempt+1}/{retries}: {str(e)}")
            if attempt < retries - 1:
                time.sleep(backoff * (attempt + 1))
            else:
                return "Failed to fetch content"

def load_last_titles():
    try:
        with open("last_titles.txt", "r", encoding="utf-8") as f:
            return set(line.strip() for line in f if line.strip())
    except FileNotFoundError:
        return set()

def save_titles(titles):
    with open("last_titles.txt", "w", encoding="utf-8") as f:
        for title in titles:
            f.write(f"{title}\n")

def crawl_notice(notice, last_titles):
    is_new = bool(notice.find("span", class_="newArtcl"))
    if not is_new:
        return None

    title = notice.find("strong").text.strip() if notice.find("strong") else "No Title"
    if title in last_titles:
        return None  # 중복이면 스킵

    link = notice.get("href", "")
    full_link = f"https://bce.pusan.ac.kr{link}" if link.startswith("/") else link
    content,saved_paths = fetch_content(full_link)

    notice_data = {
        "title": title,
        "link": full_link,
        "content": content,
        "crawled_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "images": saved_paths if saved_paths else None
    }

    try:
        producer.send("notices", value=notice_data)
        logger.info(f"Sent notice to Kafka: {title}")
    except Exception as e:
        logger.error(f"Failed to send to Kafka: {str(e)}")
        return None

    return notice_data

def crawl_notices():
    last_titles = load_last_titles()
    try:
        response = requests.get(Config.NOTICE_URL, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        notices = soup.select("a.artclLinkView")

        notice_list = []
        new_titles = set(last_titles)  # 기존 제목 유지
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(crawl_notice, notice, last_titles) for notice in notices]
            for future in futures:
                result = future.result()
                if result:
                    notice_list.append(result)
                    new_titles.add(result["title"])
        save_titles(new_titles)  # 새로운 제목 저장
        return notice_list
    except requests.RequestException as e:
        logger.error(f"Crawling failed: {str(e)}")
        return []

def run_crawler():
    while True:
        crawl_notices()
        time.sleep(Config.CRAWL_INTERVAL)  # 1시간 주기

if __name__ == "__main__":
    run_crawler()