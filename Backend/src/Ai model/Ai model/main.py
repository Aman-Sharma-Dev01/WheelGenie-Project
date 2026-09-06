from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from catboost import CatBoostRegressor
import pandas as pd
import numpy as np

app = FastAPI()

# Enable CORS (Crucial for when you connect your Next.js/React frontend later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = CatBoostRegressor()
model.load_model("catboost_pricing_model.cbm")
EXPECTED_COLUMNS = ['make', 'model', 'variant', 'mileage', 'fuel', 'transmission', 'rto', 'location', 'age']
# Define the exact JSON structure Postman must send
class VehicleSpecs(BaseModel):
    make: str
    model: str
    variant: str
    fuel: str
    transmission: str
    location: str
    rto: str
    mileage: float
    age: float

# The core prediction math
def run_inference(car_dict: dict, years_ahead: float = 0.0, yearly_km: float = 12000.0) -> float:
    simulated_car = car_dict.copy()
    simulated_car['age'] += years_ahead
    simulated_car['mileage'] += (yearly_km * years_ahead)
    
    df = pd.DataFrame([simulated_car])[EXPECTED_COLUMNS]
    
    cat_cols = ['make', 'model', 'variant', 'fuel', 'transmission', 'location', 'rto']
    for col in cat_cols:
        df[col] = df[col].astype(str)
        
    log_pred = model.predict(df)[0]
    return float(np.expm1(log_pred))

# The API Endpoint
@app.post("/api/v1/predict-buyback")
def get_buyback_projections(specs: VehicleSpecs):
    try:
        car_dict = specs.dict()
        return {
            "status": "success",
            "vehicle": f"{specs.make} {specs.model} ({specs.variant})",
            "projections": {
                "current": round(run_inference(car_dict, years_ahead=0.0), 2),
                "months_6": round(run_inference(car_dict, years_ahead=0.5), 2),
                "year_1": round(run_inference(car_dict, years_ahead=1.0), 2),
                "years_3": round(run_inference(car_dict, years_ahead=3.0), 2),
                "years_5": round(run_inference(car_dict, years_ahead=5.0), 2)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)