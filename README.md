![Skribix Logo](skribixlogo.png)


Skribix focuses on hand-drawn sketch recognition. It leverages machine learning and deep learning techniques to classify sketches into various object categories. The project is designed to provide an easy-to-use interface for training and testing models on sketch datasets. </br>

Make your sketches here - [**Skribix - Handdrawn sketch recognition**](http://34.131.175.227/)

## Versioning
- **skribix_v1:** Utilizes 250 classes of images for image recognition.
- **skribix_v2:** A scaled-down version with 15 handpicked classes of images for improved accuracy and performance.

## Features
- Classification of hand-drawn sketches into multiple object categories.
- Implementation of various machine learning algorithms:
  - KNN
  - SVM
  - Decision Trees
  - Naive Bayes
  - ANN
  - CNN
- Robust feature extraction techniques for enhanced accuracy.
- Easy-to-use interface for training and testing models.
- Modular structure for extensibility.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/Sahil-1918912/Skribix.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Skribix-2
    ```
3. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Project Structure

```bash
    skribix/
    ├── backend_api   
    │   ├── api.ipynb
    │   ├── api.py
    │   └── test.ipynb         
    ├── frontend   
    │   ├── public
    │   └── src
    │        ├── assets
    │        │      └── react.svg
    │        ├── App.css
    │        ├── App.jsx
    │        ├── DrawingTool.jsx
    │        ├── index.css
    │        └── main.jsx
    ├── skribix_v1 
    │   ├── feature extraction   
    │   └── models  
    ├── skribix_v2   
    │   ├── ann model  
    │   ├── bayesian_model
    │   ├── best model
    │   ├── clustering
    │   ├── cnn model 
    │   ├── edge_detection
    │   ├── feature extraction
    │   ├── feature_extraction_smooth
    │   ├── ImageDataGenerator
    │   ├── knn
    │   ├── knn model
    │   ├── sketches
    │   └── svm model
    ├── web page 
    │   └── index.html               
    ├── .gitignore         
    ├── LICENSE                  
    ├── README.md
    └── requirements.txt
```

## Usage
### Backend
1. Start the backend API:
    ```bash
    python backend_api/api.py
    ```
2. Test the backend using the provided Jupyter Notebook:
    ```bash
    jupyter notebook backend_api/test.ipynb
    ```

### Frontend
1. Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2. Install frontend dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

### Training Models
1. Train a model using one of the supported algorithms:
    ```bash
    python skribix_v2/<algorithm_directory>/train.py --data <path_to_dataset>
    ```
   Replace `<algorithm_directory>` with the desired algorithm directory.

### Testing Models
1. Test a trained model:
    ```bash
    python skribix_v2/<algorithm_directory>/test.py --model <path_to_model> --data <path_to_test_data>
    ```
    Replace `<algorithm_directory>` with the desired algorithm directory.

## Models Used
- PCA + Naive Bayes
- PCA + KNN
- ANN (Artificial Neural Network)
- CNN (Convolutional Neural Network)
- K-Means + KNN
- Mean-Shift Clustering + KNN
- GMM + KNN
- SVM 
- K-Means + SVM
- PCA + SVM

## Dataset
You can use publicly available sketch datasets such as:
1. [**How Do Humans Sketch Objects?**](https://cybertron.cg.tu-berlin.de/eitz/projects/classifysketch/)

2. **Hand-picked Dataset**: `skribix_v2/sketches` </br>
Custom Feature Extraction: The project includes cutomized features extracted manuall and stored in `.npy` file format. These files contain preprocessed data specifically tailored for training and testing particular models. </br>
`.npy` file directories - 
- `skribix_v2/feature extraction`
- `skribix_v2/feature_extraction_smooth`
- `skribix_v2/edge_detection`
- `skribix_v2/IMageDataGenerator`

## References
- [**How Do Humans Sketch Objects?**](https://cybertron.cg.tu-berlin.de/eitz/projects/classifysketch/)
- [**2012_siggraph_classifysketch_paper**](https://cybertron.cg.tu-berlin.de/eitz/pdf/2012_siggraph_classifysketch.pdf)
- Scikit-learn documentation for machine learning algorithms.
- TensorFlow for deep learning models.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
