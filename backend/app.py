from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS
import os
import json
import google.generativeai as genai
import re
from io import BytesIO
from PIL import Image

app = Flask(__name__)
CORS(app)

# ----------------------------
# Load API keys from config.json
# ----------------------------
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.json")
if not os.path.exists(CONFIG_PATH):
    raise FileNotFoundError("⚠️ config.json not found in backend/ folder")

with open(CONFIG_PATH, "r") as f:
    config = json.load(f)

DISEASE_API_KEY = config.get("DISEASE_API_KEY", "")
PRICING_API_KEY = config.get("PRICING_API_KEY", "")
SCHEMES_API_KEY = config.get("SCHEMES_API_KEY", "")

if not DISEASE_API_KEY.startswith("AIza"):
    raise ValueError("⚠️ Invalid or missing DISEASE_API_KEY in config.json")

# ----------------------------
# Crop Recommendation Model
# ----------------------------
MODEL_DIR = os.path.join(os.path.dirname(__file__), "models", "crop_recommendation")
MODEL_PATH = os.path.join(MODEL_DIR, "rf_model.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")

if not os.path.exists(MODEL_PATH) or not os.path.exists(ENCODER_PATH):
    raise FileNotFoundError("⚠️ rf_model.pkl or label_encoder.pkl missing in models/crop_recommendation/")

model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)

@app.route("/predict", methods=["POST"])
def predict():
    """
    Crop recommendation based on soil parameters
    """
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
        print("🔥 Exception in /predict:", e)
        return jsonify({"error": str(e)}), 500

# ----------------------------
# Crop Disease Detection (Gemini)
# ----------------------------
genai.configure(api_key=DISEASE_API_KEY)

DISEASE_PROMPT = """
You are an agronomist. Analyze the plant leaf image for disease.
Return ONLY valid JSON (no markdown, no backticks). Use this schema:
{
  "disease": "string",
  "confidence": 0.0,
  "severity": "mild|moderate|severe|none",
  "advice": "string",
  "precautions": "string"
}
If the leaf looks fine, set disease="Healthy", severity="none".
"""

def parse_json_or_fix(s: str) -> dict:
    """Try to parse Gemini output as JSON safely"""
    s = s.strip()
    try:
        return json.loads(s)
    except Exception:
        pass
    m = re.search(r"\{.*\}", s, flags=re.S)
    if m:
        try:
            return json.loads(m.group(0))
        except Exception:
            pass
    return {
        "disease": "Unknown",
        "confidence": 0.0,
        "severity": "none",
        "advice": s[:200],
        "precautions": "Re-run with a clearer photo of a single leaf."
    }

@app.route("/detect_disease", methods=["POST"])
def detect_disease():
    """
    Analyze uploaded crop leaf image for diseases using Gemini
    """
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        file = request.files["image"]

        # Convert to JPEG bytes
        img = Image.open(file.stream)
        buf = BytesIO()
        img.convert("RGB").save(buf, format="JPEG", quality=92)
        image_bytes = buf.getvalue()

        model = genai.GenerativeModel("gemini-1.5-flash")
        resp = model.generate_content([
            DISEASE_PROMPT,
            {"mime_type": "image/jpeg", "data": image_bytes}
        ])

        text = getattr(resp, "text", "") or ""
        parsed = parse_json_or_fix(text)

        # clamp confidence 0..1
        try:
            c = float(parsed.get("confidence", 0))
            parsed["confidence"] = min(1.0, max(0.0, round(c, 3)))
        except Exception:
            parsed["confidence"] = 0.0

        return jsonify(parsed)

    except Exception as e:
        print("🔥 Exception in /detect_disease:", e)
        return jsonify({"error": str(e)}), 500

# ----------------------------
# Placeholders for future APIs
# ----------------------------
@app.route("/get_price", methods=["GET"])
def get_price():
    return jsonify({
        "message": "Pricing API integration pending",
        "key_present": bool(PRICING_API_KEY)
    })

@app.route("/get_schemes", methods=["GET"])
def get_schemes():
    return jsonify({
        "message": "Schemes API integration pending",
        "key_present": bool(SCHEMES_API_KEY)
    })

# ----------------------------
# Run
# ----------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
