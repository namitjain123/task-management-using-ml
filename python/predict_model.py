import joblib
import sys
import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer

if len(sys.argv) < 4:
    print("Usage: python predict_model.py <task_desc> <tags> <model_type>")
    sys.exit(1)

task_desc = sys.argv[1]
tags = [tag.strip() for tag in sys.argv[2].split(',')]
model_type = sys.argv[3]


# Load model and vectorizer
if model_type == 'rf':
    data = joblib.load('../data/task_priority_rf_model_with_vectorizer.pkl')
elif model_type == 'lr':
    data = joblib.load('../data/task_priority_lr_model_with_vectorizer.pkl')
else:
    print("Invalid model type. Use 'rf' or 'lr'.")
    sys.exit(1)


model = data["model"]
vectorizer = data["vectorizer"]

# -----------------------------
# Preprocess Description
desc_vector = vectorizer.transform([task_desc])  # TF-IDF output

# Preprocess Tags - mimic training
# Simulate MultiLabelBinarizer based on training tag columns
tag_columns = [col for col in model.feature_names_in_ if not col.isdigit()]  # exclude TF-IDF digits
tag_df = pd.DataFrame(columns=tag_columns)
tag_df.loc[0] = [1 if tag in tags else 0 for tag in tag_columns]

# Combine features
import numpy as np
from scipy.sparse import hstack

input_combined = hstack([desc_vector, tag_df.astype(float).values])

# Predict
prediction = model.predict(input_combined)
priority_mapping = {0: "Low", 1: "Medium", 2: "High"}
predicted_priority = priority_mapping.get(prediction[0], "Low")  # Default to "Low" if not found
print(f"Predicted Priority: {predicted_priority}")
