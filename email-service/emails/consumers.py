import json
import logging

import pika

logging.basicConfig(level=logging.INFO)

def callback(ch, method, properties, body):
    try:
        message = json.loads(body.decode('utf-8'))
        email = message.get("email")

        if email:
            print(f"📩 Received email verification request for: {email}")
    except json.JSONDecodeError:
        print("JSON 파싱 오류 발생")

def start_consumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    queue_name = "email_verification_queue"

    channel.queue_declare(queue=queue_name, durable=True)
    print(" [*] Waiting for messages. To exit press CTRL+C")

    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
    channel.start_consuming()


