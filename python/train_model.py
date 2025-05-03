import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from python.preprocess_data import preprocess_data

def train_models():
    # Load and preprocess the data
    features, labels, vectorizer = preprocess_data('data/tasks.csv')
    
    # Split data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)
    
    # Initialize and train RandomForest model
    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    
    # Initialize and train LogisticRegression model
    lr_model = LogisticRegression(random_state=42)
    lr_model.fit(X_train, y_train)
    
    # Evaluate RandomForest model
    rf_predictions = rf_model.predict(X_test)
    print("Random Forest Model Evaluation:")
    print(classification_report(y_test, rf_predictions))
    
    # Save the trained RandomForest model
    joblib.dump(rf_model, 'data/task_priority_rf_model.pkl')
    
    # Evaluate Logistic Regression model
    lr_predictions = lr_model.predict(X_test)
    print("Logistic Regression Model Evaluation:")
    print(classification_report(y_test, lr_predictions))
    
    # Save the trained Logistic Regression model
    joblib.dump(lr_model, 'data/task_priority_lr_model.pkl')

train_models()
