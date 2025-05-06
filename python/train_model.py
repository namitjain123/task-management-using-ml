import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.feature_extraction.text import TfidfVectorizer  # Import vectorizer
from preprocess_data import preprocess_data
from sklearn.model_selection import train_test_split

def train_models():
    # Load and preprocess the data
    features, labels, vectorizer = preprocess_data('../task-manager-backend/data/tasks.csv')
    
    # Split data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)
    
    # Initialize and train RandomForest model
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    rf_model.fit(X_train, y_train)
    
    # Initialize and train LogisticRegression model
    lr_model = LogisticRegression(random_state=42, max_iter=200)  # Added max_iter for convergence
    lr_model.fit(X_train, y_train)
    
    # Evaluate RandomForest model
    rf_predictions = rf_model.predict(X_test)
    print("Random Forest Model Evaluation:")
    print(classification_report(y_test, rf_predictions, zero_division=1))
    
    # Save the trained RandomForest model and vectorizer together
    rf_model.feature_names_in_ = list(features.columns)  # Save column names
    joblib.dump({"model": rf_model, "vectorizer": vectorizer}, '../data/task_priority_rf_model_with_vectorizer.pkl')

    
    # Evaluate Logistic Regression model
    lr_predictions = lr_model.predict(X_test)
    print("Logistic Regression Model Evaluation:")
    print(classification_report(y_test, lr_predictions, zero_division=1))  # Corrected to use lr_predictions
    
    # Save the trained Logistic Regression model
    # Save the trained Logistic Regression model and vectorizer
    lr_model.feature_names_in_ = list(features.columns)  # Save feature names
    joblib.dump({"model": lr_model, "vectorizer": vectorizer}, '../data/task_priority_lr_model_with_vectorizer.pkl')


train_models()
