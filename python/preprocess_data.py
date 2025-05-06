# python/preprocess_data.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.preprocessing import LabelEncoder

def preprocess_data(file_path):
    data = pd.read_csv(file_path)

    # Vectorize Task Description using TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english', max_features=500)
    X_desc = vectorizer.fit_transform(data['Description'])

    # Split comma-separated tags and strip whitespace
    data['Tags'] = data['Tags'].apply(lambda x: [tag.strip() for tag in x.split(',')])

    # One-hot encode multi-label Tags
    mlb = MultiLabelBinarizer()
    X_tags = pd.DataFrame(mlb.fit_transform(data['Tags']), columns=mlb.classes_)

    # Encode Priority Labels (Low = 0, Medium = 1, High = 2)
    data['Priority'] = data['Priority'].map({'Low': 0, 'Medium': 1, 'High': 2})

    # Combine TF-IDF description with tag features
    features = pd.concat([pd.DataFrame(X_desc.toarray()), X_tags], axis=1)

    # Convert column names to strings
    features.columns = features.columns.astype(str)
    labels = data['Priority']

    return features, labels, vectorizer
