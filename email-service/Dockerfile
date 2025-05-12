FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libmariadb-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/staticfiles

COPY ./requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . /app/

ENV PYTHONUNBUFFERED=1

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "email_service.wsgi:application"]
