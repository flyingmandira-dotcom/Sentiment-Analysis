import pickle
import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model during startup
try:
    with open('sentiment_pipeline.pkl', 'rb') as f:
        model = pickle.load(f)
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str
    probabilities: dict

SENTIMENT_MAP = {
    0: "Negative",
    1: "Neutral",
    2: "Positive"
}

@app.post("/api/analyze", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    if not model:
        raise HTTPException(status_code=500, detail="Sentiment model failed to load on server startup.")
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    try:
        # Predict the class
        prediction = model.predict([request.text])[0]
        
        # Determine probabilities if supported
        probabilities = {}
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba([request.text])[0]
            probabilities = {
                "Negative": float(probs[0]),
                "Neutral": float(probs[1]),
                "Positive": float(probs[2])
            }
            
        sentiment_label = SENTIMENT_MAP.get(int(prediction), "Unknown")
        
        return SentimentResponse(
            sentiment=sentiment_label,
            probabilities=probabilities
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mount static files to serve the frontend
static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
app.mount("/", StaticFiles(directory="static", html=True), name="static")

