# Use the official Python slim image for a smaller footprint
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies required for OCR (tesseract) and PDF processing
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file first to leverage Docker layer caching
COPY requirements.txt .

# Disable embeddings by default in the container to save memory (e.g., on Render).
# Local dev (docker-compose) overrides this to false.
ENV DISABLE_EMBEDDINGS=true

# Pre-install CPU-only PyTorch to prevent downloading 5GB of Nvidia CUDA binaries!
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Install Python dependencies without storing the massive cache wheels
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY ./app ./app

# Expose the port FastAPI will run on
EXPOSE 8000

# Start the application using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
