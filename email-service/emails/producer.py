import pika
import json

def send_completion_message(email):
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    chaneel = connection.channel()
    chaneel.queue_declare(queue="spring_response_queue",durable=True)

    message = {"email": email}
    chaneel.basic_publish(exchange='', routing_key='spring_response_queue', body=json.dumps(message))
    connection.close()