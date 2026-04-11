# Sentiment Analysis Web App

A full-stack machine learning web application that predicts whether text sentiment is **Positive**, **Neutral**, or **Negative** using a custom scikit-learn model pipeline.

## Features

- **FastAPI Backend**: A high-performance Python backend server taking advantage of Pydantic and async requests.
- **Pre-trained ML Pipeline**: Integrates directly with a provided `.pkl` scikit-learn model.
- **Premium Frontend**: The beautiful UI requires no complex frontend framework. It features modern glassmorphism design, vibrant UI elements, real-time character counting, and smooth animating probability bars natively via HTML/CSS/JS.

## Setup & Local Development

### 1. Requirements

Ensure you have Python installed. Inside your terminal, install the dependencies:
```bash
pip install -r requirements.txt
```

### 2. Run the App

Start the backend server on port 8000. It also automatically serves the frontend static files!
```bash
python -m uvicorn app:app --port 8000 --reload
```

### 3. Usage

Simply open a web browser and navigate to:
[http://127.0.0.1:8000](http://127.0.0.1:8000)

Start typing into the textbox and hit the **Analyze Sentiment** button to see your model at work!
