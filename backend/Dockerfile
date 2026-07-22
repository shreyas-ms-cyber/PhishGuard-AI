# Use Python 3.12 from official Docker image
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies needed for building some Python packages
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (to leverage Docker cache)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Start the app with gunicorn
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "app.main:app"]
