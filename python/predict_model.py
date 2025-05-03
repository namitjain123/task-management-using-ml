import joblib

def predict_task_priority(task_desc, tags, model_type='rf'):
    # Load the saved model and vectorizer
    model = joblib.load(f'data/task_priority_{model_type}_model.pkl')
    vectorizer = joblib.load('data/vectorizer.pkl')
    
    # Vectorize the task description
    task_desc_vec = vectorizer.transform([task_desc])
    
    # Prepare feature vector (task description vector + tags + days left)
    days_left = (pd.to_datetime('today') - pd.to_datetime('today')).days  # Example for today
    features = [task_desc_vec.toarray(), [tags], [days_left]]
    
    # Make prediction
    prediction = model.predict(features)
    return prediction[0]
