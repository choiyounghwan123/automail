import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    KAFKA_BOOTSTRAP_SERVERS = "kafka:9092"
    NOTICE_URL = os.getenv("NOTICE_URL","https://bce.pusan.ac.kr/bce/50189/subview.do")
    CRAWL_INTERVAL = 3600