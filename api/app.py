import os
import json
import warnings
from flask import Flask, jsonify, request, abort, send_file
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv, find_dotenv
from gtts import gTTS
from inference import inference

# Ignore UserWarning
warnings.filterwarnings("ignore", category=UserWarning)

load_dotenv(find_dotenv())
PORT = os.getenv("PORT") or 5000

app = Flask(__name__)

CORS(app)


# Sanity check route
@app.route("/ping", methods=["GET"])
def index():
    return jsonify("pong!")


@app.route("/dictionaries", methods=["GET"])
def get_dictionaries():
    with open("datasets/pinyins.json", "r") as f:
        pinyins = json.load(f)
        pinyins = list(pinyins.keys())
    with open("datasets/tones.json", "r") as f:
        tones = json.load(f)
        tones = list(tones.keys())
    with open("datasets/characterDict.json", "r") as f:
        characters = json.load(f)
    print("Ditionaries loaded and ready to be sent...")
    return jsonify({"pinyins": pinyins, "tones": tones, "characterDict": characters})


@app.route('/inference', methods=['POST'])
def inference_api():
    # Save user input
    user_filename = "storage/audio.wav"
    user_input = request.files["file"]
    user_input.save(user_filename)
    # Generate target audio
    target_filename = "storage/target.mp3"
    target = request.form
    target_character = target["character"]
    target_audio = gTTS(text=target_character, lang='zh-cn', slow=False)
    target_audio.save(target_filename)
    # Run inference
    pinyin, tone, score = inference(user_filename, target_filename)

    return jsonify({
        "pinyin": pinyin,
        "tone": tone,
        "score": score
    })

@app.route('/reference', methods=['GET'])
def reference_api():
    character = request.args.get("character")

    # Create reference audio
    reference_filename = "storage/reference.mp3"
    reference_audio = gTTS(text=character, lang='zh-cn', slow=False)
    reference_audio.save(reference_filename)

    return send_file(reference_filename, mimetype="audio/mpeg")

if __name__ == "__main__":
    print("Starting server...")
    app.run(debug=True, port=PORT)
