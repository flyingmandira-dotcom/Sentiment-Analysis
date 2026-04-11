import pickle
import sys

try:
    with open('sentiment_pipeline.pkl', 'rb') as f:
        model = pickle.load(f)
    print("Model type:", type(model))
    
    # Try predicting
    sample_text = ["This is a great product!"]
    try:
        prediction = model.predict(sample_text)
        print("Prediction for single string in list:", prediction)
    except Exception as e:
        print("Error predicting with list:", e)
        
    try:
        if hasattr(model, "predict_proba"):
            proba = model.predict_proba(sample_text)
            print("Probabilities:", proba)
    except Exception as e:
        print("Error getting proba:", e)

except Exception as e:
    print("Failed to load model:", e)
