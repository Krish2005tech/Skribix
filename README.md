# Skribix
Skribix focuses on hand-drawn sketch recognition. \
The dataset used in this project includes sketches of objects from various distinct categories, selected based on day-to-day functionality criteria.

## Versioning
**skribix_v1:** uses 250 classes of images for image recognition. \
**skribix_v2:** scaled down version, uses hand picked 15 classes of images for improvised results.


## Features
- Supports classification of hand-drawn sketches into multiple object categories.
- Implements various machine learning algorithms: KNN, SVM, Decision Trees, Naive Bayes, ANN and CNN.
- Robust feature extraction techniques for improved accuracy.
- Easy-to-use interface for training and testing models.

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/Sahil-1918912/Skribix.git
    ```
2. Navigate to the project directory:
    ```bash
    cd skribix_v2
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
    │   └── feature extraction   
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
1. Prepare your dataset of hand-drawn sketches.
2. Train the model using one of the supported algorithms:
    ```bash
    python train.py --algorithm <algorithm_name> --data <path_to_dataset>
    ```
3. Test the model:
    ```bash
    python test.py --model <path_to_model> --data <path_to_test_data>
    ```

## Algorithms Supported
- **K-Nearest Neighbors (KNN):** Simple and effective for small datasets.
- **Support Vector Machines (SVM):** Works well for high-dimensional spaces.
- **Decision Trees:** Interpretable and fast for classification tasks.
- **Naive Bayes:** Probabilistic classifier based on Bayes' theorem.
- **Perceptron:** A basic neural network model for binary classification.

## Dataset
You can use publicly available sketch datasets such as:
- [Quick, Draw! Dataset](https://quickdraw.withgoogle.com/data)
- Custom datasets in compatible formats.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m "Add feature-name"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Inspired by the [Quick, Draw! Dataset](https://quickdraw.withgoogle.com/data).
- Thanks to the contributors of open-source libraries used in this project.
- Special thanks to the PRML course for motivating this project.