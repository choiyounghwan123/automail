# crawler_service.py
import time
from concurrent.futures.thread import ThreadPoolExecutor
import requests
from bs4 import BeautifulSoup
import logging
import json
from kafka import KafkaProducer
from config import Config

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("crawler.log"), logging.StreamHandler()]
)

logger = logging.getLogger(__name__)
print(Config.KAFKA_BOOTSTRAP_SERVERS)
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
            content = soup.find('div', class_='artclView').get_text(strip=True)
            return content
        except requests.RequestException as e:
            logger.error(f"Failed to fetch {link}, attempt {attempt+1}/{retries}: {str(e)}")
            if attempt < retries - 1:
                time.sleep(backoff * (attempt + 1))
            else:
                return "Failed to fetch content"

def crawl_notice(notice):
    is_new = bool(notice.find("span", class_="newArtcl"))
    if not is_new:
        return None

    title = notice.find("strong").text.strip() if notice.find("strong") else "No Title"
    link = notice.get("href", "")
    full_link = f"https://bce.pusan.ac.kr{link}" if link.startswith("/") else link

    content = fetch_content(full_link)

    notice_data = {
        "title": title,
        "link": full_link,
        "content": content,
        "crawled_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }

    try:
        producer.send("notices", value=notice_data)  # Kafka로 전송
        logger.info(f"Sent notice to Kafka: {title}")
    except Exception as e:
        logger.error(f"Failed to send to Kafka: {str(e)}")

    return notice_data

def crawl_notices():
    try:
        response = requests.get(Config.NOTICE_URL, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        notices = soup.select("a.artclLinkView")

        notice_list = []
        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = [executor.submit(crawl_notice, notice) for notice in notices]
            for future in futures:
                result = future.result()
                if result:
                    notice_list.append(result)
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