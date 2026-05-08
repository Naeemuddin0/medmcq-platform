FROM selenium/standalone-chrome:latest

USER root
# Install Python
RUN apt-get update && apt-get install -y python3-pip && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN python3 -m pip install --break-system-packages -r requirements.txt

# Copy test code
COPY . .

# Environment variables
ENV BASE_URL=http://medmcq-web:3000

# Execute tests
CMD ["pytest", "test_medmcq.py", "--junitxml=results.xml"]
