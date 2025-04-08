# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import tensorflow as tf
# import numpy as np
# import base64
# import io
# from PIL import Image
# from joblib import dump, load
import os
import glob
import cv2
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import normalize
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import base64
import io
from PIL import Image
from joblib import dump, load
import base64
import io
import numpy as np
import cv2
from PIL import Image
from scipy.spatial.distance import cdist
from sklearn.preprocessing import StandardScaler




app = Flask(__name__)
CORS(app)

# # Placeholder for the image preprocessing function
# def img_preprocessing(image):
#     # You will define this function later
#     pass

# # Load the model (ensure the .h5 file is in the correct path)
# model = tf.keras.models.load_model('model.h5')


# ----------------------------
# Step 1: Image Preprocessing and Local Descriptor Extraction
# ----------------------------

def base64_to_image(base64_str,size=256):
    """
    Convert a base64 string to a PIL Image.
    
    Parameters:
    - base64_str (str): Base64-encoded image string.
    
    Returns:
    - img (PIL.Image): Decoded image.
    """
    image_bytes = base64.b64decode(base64_str)
    img = Image.open(io.BytesIO(image_bytes))
    # Display the image using OpenCV (for debugging purposes)
    img = np.array(img.convert('L'))  # Convert to grayscale
    img_resized = cv2.resize(img, (size, size))
    # cv2.imshow("Decoded Image", img_resized)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    return img_resized.astype(np.float32)

def compute_gradients(image):
    """
    Compute image gradients using the Sobel operator.
    (Gaussian derivatives can be used for more robustness.)
    """
    grad_x = cv2.Sobel(image, cv2.CV_32F, 1, 0, ksize=3)
    grad_y = cv2.Sobel(image, cv2.CV_32F, 0, 1, ksize=3)
    magnitude = np.sqrt(grad_x**2 + grad_y**2)
    orientation = np.arctan2(grad_y, grad_x)
    orientation = np.mod(orientation, np.pi)  # Map angles to [0, π)
    return magnitude, orientation

def extract_local_descriptors(image, grid_size=(28, 28), patch_size_ratio=0.125,
                              num_spatial_bins=4, num_orientation_bins=4):
    """
    For each patch (sampled on a grid) in the image, subdivide it into
    (num_spatial_bins x num_spatial_bins) cells and compute a histogram of 
    gradient orientations (with num_orientation_bins bins) for each cell.
    Concatenate the histograms from all cells to yield a 64-dimensional descriptor.
    Returns an array of descriptors (one per patch).
    """
    magnitude, orientation = compute_gradients(image)
    h, w = image.shape
    descriptors = []
    # Generate grid points (centers) for patches
    xs = np.linspace(0, w-1, grid_size[1], dtype=int)
    ys = np.linspace(0, h-1, grid_size[0], dtype=int)
    patch_size = int(patch_size_ratio * w)  # e.g., ~32 pixels for a 256x256 image
    half_patch = patch_size // 2

    for y in ys:
        for x in xs:
            # Define patch boundaries (with border checks)
            x1 = max(x - half_patch, 0)
            x2 = min(x + half_patch, w)
            y1 = max(y - half_patch, 0)
            y2 = min(y + half_patch, h)
            patch_mag = magnitude[y1:y2, x1:x2]
            patch_orient = orientation[y1:y2, x1:x2]
            # Determine cell sizes within the patch
            cell_h = (y2 - y1) // num_spatial_bins
            cell_w = (x2 - x1) // num_spatial_bins
            descriptor = []
            # Iterate over cells
            for i in range(num_spatial_bins):
                for j in range(num_spatial_bins):
                    cy1 = y1 + i * cell_h
                    cy2 = cy1 + cell_h
                    cx1 = x1 + j * cell_w
                    cx2 = cx1 + cell_w
                    # Extract cell region
                    cell_orient = patch_orient[cy1 - y1:cy2 - y1, cx1 - x1:cx2 - x1]
                    cell_mag = patch_mag[cy1 - y1:cy2 - y1, cx1 - x1:cx2 - x1]
                    # Compute histogram for cell
                    hist, _ = np.histogram(cell_orient, bins=num_orientation_bins, 
                                           range=(0, np.pi), weights=cell_mag)
                    descriptor.extend(hist)
            descriptor = np.array(descriptor, dtype=np.float32)
            norm_val = np.linalg.norm(descriptor)
            if norm_val > 0:
                descriptor /= norm_val
            descriptors.append(descriptor)
    return np.array(descriptors)  # Shape: (num_patches, 64)

# ----------------------------
# Step 3: Compute Global Image Feature (Histogram of Visual Words)
# ----------------------------

def quantize_descriptors(descriptors, vocabulary):
    """
    Quantize each 64-D descriptor to the nearest word in the vocabulary.
    Returns a normalized histogram (global feature vector) of dimension equal to vocab_size.
    """
    from scipy.spatial.distance import cdist
    distances = cdist(descriptors, vocabulary, metric='euclidean')
    assignments = np.argmin(distances, axis=1)
    vocab_size = vocabulary.shape[0]
    hist = np.zeros(vocab_size, dtype=np.float32)
    for idx in assignments:
        hist[idx] += 1
    if hist.sum() > 0:
        hist /= hist.sum()
    return hist

def soft_quantize_descriptors(descriptors, vocabulary, sigma=0.3):
    """
    For each descriptor, compute Gaussian weighted contributions to each vocabulary center,
    then sum up contributions into a histogram.
    """
    distances = cdist(descriptors, vocabulary, metric='euclidean')
    # Compute weights using a Gaussian kernel
    weights = np.exp(-distances*2 / (2 * sigma*2))
    # Normalize weights for each descriptor
    weights /= weights.sum(axis=1, keepdims=True)
    # Sum contributions over all descriptors to obtain histogram
    hist = weights.sum(axis=0)
    if hist.sum() > 0:
        hist /= hist.sum()
    return hist

def extract_image_feature(image, vocabulary):
    """
    For a given image, extract local descriptors and compute a global 500-D feature 
    vector by quantizing the descriptors with the visual vocabulary.
    """
    descriptors = extract_local_descriptors(image)
    feature_vector = soft_quantize_descriptors(descriptors, vocabulary)
    return feature_vector


# Load the vocabulary
vocab_path = "..\\skribix_v2\\feature extraction\\vocabulary.npy"

vocabulary = np.load(vocab_path)

knn_model_path = "..\\skribix_v2\\knn model\\knn_model.joblib"
# Load the Knn model
knn_model = joblib.load(knn_model_path)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    if 'image' not in data:
        return jsonify({'error': 'No image data provided'}), 400

    try:
        # Remove the data URL prefix (e.g. "data:image/png;base64,...")
        base64_data = data['image'].split(",")[1]
        # image_bytes = base64.b64decode(base64_data)
        # image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

        # # Resize and preprocess
        # image = image.resize((256, 256))  # adjust as per model
        # image_array = np.array(image)
        # preprocessed_image = img_preprocessing(image_array)

        # input_data = np.expand_dims(preprocessed_image, axis=0)

        sample_image = base64_to_image(base64_data)
        feature_vector = extract_image_feature(sample_image, vocabulary)

        # predictions = model.predict(input_data)
        # results = predictions.tolist()

        # return jsonify({'predictions': results})
        # scaler= StandardScaler()
        # # Scale the feature vector if needed
        # feature_vector = scaler.fit_transform([feature_vector])[0]
        print("Feature vector shape:", feature_vector)
        prediction = knn_model.predict([feature_vector])
        print(prediction)

        # return jsonify({'prediction': prediction.tolist()})
        return jsonify({'prediction': int(prediction[0])})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=7001)

#to run : 
#py .\api.py