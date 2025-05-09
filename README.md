
# Tree: Structuring Family Histories for Disease Risk Assessment



##  Key Features

-  Predicts risk of 3 common hereditary diseases.
-  Accepts both personal and family history data.
-  Interactive frontend built with modern UI components.
-  Local-only: all data is processed and stored on the user's machine.
-  Real-time predictions via pre-trained ML models (RandomForest).



## Machine Learning Models

| Disease         | Dataset Used                         | Accuracy | Model                  |
|----------------|--------------------------------------|----------|------------------------|
| Breast Cancer   | sklearn.datasets.load_breast_cancer | ~96%     | RandomForestClassifier |
| Diabetes        | Pima Indians dataset                | ~77%     | RandomForestClassifier |
| Heart Disease   | UCI Heart Disease dataset           | ~85%     | RandomForestClassifier |

- All predictions are performed by `tree_model.py`.
- Data exchange between backend and model uses Node.js `child_process`.


## 📖 License

MIT License © 2025 Amanullah Sayed
"""

