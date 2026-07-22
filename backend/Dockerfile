FROM python:3.12-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Use Google DNS for Python's socket resolution
ENV DNS_SERVER=8.8.8.8

CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "app.main:app"]
