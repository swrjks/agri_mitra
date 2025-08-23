from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models", "crop_recommendation")
MODEL_PATH = os.path.join(MODEL_DIR, "rf_model.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        features = np.array([[
            data.get("nitrogen", 0),
            data.get("phosphorous", 0),
            data.get("potassium", 0),
            data.get("temperature", 0),
            data.get("humidity", 0),
            data.get("ph", 0),
            data.get("rainfall", 0),
        ]])
        prediction_num = model.predict(features)[0]
        prediction_label = label_encoder.inverse_transform([prediction_num])[0]
        return jsonify({"recommended_crop": prediction_label})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
