from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)

# Placeholder for the image preprocessing function
def img_preprocessing(image):
    # You will define this function later
    pass

# Load the model (ensure the .h5 file is in the correct path)
model = tf.keras.models.load_model('model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    if 'image' not in data:
        return jsonify({'error': 'No image data provided'}), 400

    try:
        # Remove the data URL prefix (e.g. "data:image/png;base64,...")
        base64_data = data['image'].split(",")[1]
        image_bytes = base64.b64decode(base64_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

        # Resize and preprocess
        image = image.resize((256, 256))  # adjust as per model
        image_array = np.array(image)
        preprocessed_image = img_preprocessing(image_array)

        input_data = np.expand_dims(preprocessed_image, axis=0)

        predictions = model.predict(input_data)
        results = predictions.tolist()

        return jsonify({'predictions': results})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)