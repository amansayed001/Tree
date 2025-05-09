import pandas as pd
import numpy as np
import json
import sys
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_breast_cancer
import ssl

ssl._create_default_https_context = ssl._create_unverified_context


# Train Cancer Model
cancer_data = load_breast_cancer()
df_cancer = pd.DataFrame(cancer_data.data, columns=cancer_data.feature_names)
df_cancer["target"] = cancer_data.target

X_cancer = df_cancer.drop(columns=["target"])
y_cancer = df_cancer["target"]

X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_cancer, y_cancer, test_size=0.2, random_state=42)

cancer_model = RandomForestClassifier(random_state=42)
cancer_model.fit(X_train_c, y_train_c)

# Train Diabetes Model
url_diabetes = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
columns_diabetes = ["Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin",
                    "BMI", "DiabetesPedigreeFunction", "Age", "Outcome"]

df_diabetes = pd.read_csv(url_diabetes, header=None, names=columns_diabetes)

X_diabetes = df_diabetes.drop(columns=["Outcome"])
y_diabetes = df_diabetes["Outcome"]

X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(X_diabetes, y_diabetes, test_size=0.2, random_state=42)

diabetes_model = RandomForestClassifier(random_state=42)
diabetes_model.fit(X_train_d, y_train_d)

# Train Heart Disease Model
url_heart = "https://raw.githubusercontent.com/sharmaroshan/Heart-UCI-Dataset/refs/heads/master/heart.csv"
df_heart = pd.read_csv(url_heart)

X_heart = df_heart.drop(columns=["target"])
y_heart = df_heart["target"]

X_train_h, X_test_h, y_train_h, y_test_h = train_test_split(X_heart, y_heart, test_size=0.2, random_state=42)

heart_model = RandomForestClassifier(random_state=42)
heart_model.fit(X_train_h, y_train_h)

# Heart Risk Prediction
def predict_heart_risk(heart_input):
    input_df = pd.DataFrame([heart_input], columns=X_heart.columns)
    heart_prob = heart_model.predict_proba(input_df)[0][1] * 100
    return round(heart_prob, 2)

# Master Prediction Function
def predict_all_from_user_input(user_input):
    diabetes_input = [
        user_input["pregnancies"],
        user_input["glucose"],
        user_input["blood_pressure"],
        user_input["skin_thickness"],
        user_input["insulin"],
        user_input["bmi"],
        user_input["diabetes_pedigree_function"],
        user_input["age"]
    ]

    heart_input = [
        user_input["age"],
        1 if user_input["gender"].lower() == "male" else 0,
        user_input["chest_pain_type"],
        user_input["resting_bp"],
        user_input["cholesterol"],
        user_input["fasting_blood_sugar"],
        user_input["rest_ecg"],
        user_input["max_heart_rate"],
        user_input["exercise_induced_angina"],
        user_input["oldpeak"],
        user_input["slope"],
        user_input["num_major_vessels"],
        user_input["thal"]
    ]

    cancer_input = X_cancer.iloc[0].tolist()

    diabetes_prob = diabetes_model.predict_proba(pd.DataFrame([diabetes_input], columns=X_diabetes.columns))[0][1] * 100
    cancer_prob = cancer_model.predict_proba(pd.DataFrame([cancer_input], columns=X_cancer.columns))[0][1] * 100
    heart_prob = predict_heart_risk(heart_input)

    return json.dumps({
        "diabetes_risk": round(diabetes_prob, 2),
        "cancer_risk": round(cancer_prob, 2),
        "heart_disease_risk": round(heart_prob, 2)
    }, indent=2)

# Entry point for Node.js call
if __name__ == "__main__":
    user_input = json.loads(sys.argv[1])
    result = predict_all_from_user_input(user_input)
    print(result)
