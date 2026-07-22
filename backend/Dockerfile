FROM python:3.12-slim

WORKDIR /app

# Install dnsutils and set DNS
RUN apt-get update && apt-get install -y \
    gcc \
    dnsutils \
    && rm -rf /var/lib/apt/lists/*

# Use Google DNS for resolution
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "app.main:app"]
