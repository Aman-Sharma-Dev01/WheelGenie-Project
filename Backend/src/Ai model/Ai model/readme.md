# CatBoost Buyback Prediction API
FastAPI server for predicting vehicle buyback values using a trained CatBoost model.
# 1. Project Structure
Keep both files in the same folder:

project/
├── main.py
├── catboost_pricing_model.cbm
└── README.md

# 2. Requirements
Make sure Python is installed:
python --version


Install the required packages:
pip install fastapi uvicorn catboost pandas pydantic numpy

# 3. Run the API
Open the terminal in the project folder and run:
python main.py


You should see:
Uvicorn running on http://0.0.0.0:8000



