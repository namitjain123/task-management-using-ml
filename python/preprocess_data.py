# python/preprocess_data.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

def preprocess_data(file_path):
    data = pd.read_csv(file_path)
    
    # Vectorize Task Description using TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english', max_features=500)
    X_desc = vectorizer.fit_transform(data['Task Description'])
    
    # Encode Tags (Optional: One-Hot Encoding or Label Encoding)
    label_encoder = LabelEncoder()
    data['Tags'] = label_encoder.fit_transform(data['Tags'])
    
    # Encode Priority Labels (Low = 0, Medium = 1, High = 2)
    data['Priority'] = data['Priority'].map({'Low': 0, 'Medium': 1, 'High': 2})
    
    # Prepare Features and Labels
    features = pd.concat([pd.DataFrame(X_desc.toarray()), data[['Tags']]], axis=1)
    labels = data['Priority']
    
    return features, labels, vectorizer
