import { useState } from "react";
import { Info } from "lucide-react";

interface PredictionFormProps {
  onPredict: (formData: Record<string, number>) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict }) => {
  const [formData, setFormData] = useState({
    serumCreatinine: 1.0,
    estimatedGFR: 90,
    hemoglobinLevel: 14,
    ureaNitrogenLevel: 15,
    albuminLevel: 4.0,
    whiteBloodCellCount: 7.5,
    bloodGlucoseLevel: 100,
    age: 50,
    potassiumLevel: 4.0,
    sodiumLevel: 140,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number.parseFloat(value),
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number.parseFloat(value),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  // Define ranges and normal values for each parameter
  const parameterInfo = {
    serumCreatinine: { 
      min: 0.1, 
      max: 15, 
      normal: "0.7-1.3 mg/dL", 
      step: 0.1, 
      info: "Elevated in kidney disease" 
    },
    estimatedGFR: {
      min: 1,
      max: 150,
      normal: "90-120 mL/min/1.73m²",
      step: 1,
      info: "Lower values indicate reduced kidney function",
    },
    hemoglobinLevel: { 
      min: 5, 
      max: 20, 
      normal: "13.5-17.5 g/dL", 
      step: 0.1, 
      info: "May be reduced in kidney disease" 
    },
    ureaNitrogenLevel: { 
      min: 5, 
      max: 150, 
      normal: "7-20 mg/dL", 
      step: 1, 
      info: "Elevated in kidney disease" 
    },
    albuminLevel: { 
      min: 1, 
      max: 6, 
      normal: "3.5-5.0 g/dL", 
      step: 0.1, 
      info: "May be reduced in kidney disease" 
    },
    whiteBloodCellCount: {
      min: 2,
      max: 30,
      normal: "4.5-11.0 ×10³/µL",
      step: 0.1,
      info: "May be elevated in infection or inflammation",
    },
    bloodGlucoseLevel: { 
      min: 50, 
      max: 500, 
      normal: "70-100 mg/dL", 
      step: 1, 
      info: "Elevated in diabetes" 
    },
    age: { 
      min: 18, 
      max: 100, 
      normal: "N/A", 
      step: 1, 
      info: "Risk increases with age" 
    },
    potassiumLevel: { 
      min: 2.5, 
      max: 7, 
      normal: "3.5-5.0 mEq/L", 
      step: 0.1, 
      info: "May be abnormal in kidney disease" 
    },
    sodiumLevel: { 
      min: 120, 
      max: 160, 
      normal: "135-145 mEq/L", 
      step: 1, 
      info: "May be abnormal in kidney disease" 
    },
  };

  // Format display names
  const displayNames = {
    serumCreatinine: "Serum Creatinine (mg/dL)",
    estimatedGFR: "Estimated GFR (mL/min/1.73m²)",
    hemoglobinLevel: "Hemoglobin Level (g/dL)",
    ureaNitrogenLevel: "Urea Nitrogen Level (mg/dL)",
    albuminLevel: "Albumin Level (g/dL)",
    whiteBloodCellCount: "White Blood Cell Count (×10³/µL)",
    bloodGlucoseLevel: "Blood Glucose Level (mg/dL)",
    age: "Age (years)",
    potassiumLevel: "Potassium Level (mEq/L)",
    sodiumLevel: "Sodium Level (mEq/L)",
  };

  // Check if value is outside normal range
  const isOutsideNormalRange = (key: string, value: number) => {
    const info = parameterInfo[key as keyof typeof parameterInfo];
    if (key === 'age') return false; // Age doesn't have a "normal" range
    
    const normalRange = info.normal.split('-');
    if (normalRange.length !== 2) return false;
    
    const min = parseFloat(normalRange[0]);
    const max = parseFloat(normalRange[1]);
    
    return value < min || value > max;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        {Object.entries(formData).map(([key, value]) => {
          const info = parameterInfo[key as keyof typeof parameterInfo];
          const name = displayNames[key as keyof typeof displayNames];
          const isAbnormal = isOutsideNormalRange(key, value);

          return (
            <div key={key} className="form-group">
              <label className="form-label">
                {name}
                <div className="slider-container">
                  <input
                    type="range"
                    name={key}
                    min={info.min}
                    max={info.max}
                    step={info.step}
                    value={value}
                    onChange={handleSliderChange}
                    className="slider"
                  />
                </div>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    step={info.step}
                    min={info.min}
                    max={info.max}
                    className={`form-input ${isAbnormal ? 'border-red-400' : ''}`}
                    required
                  />
                  <span className="input-range">
                    ({info.min}-{info.max})
                  </span>
                </div>
              </label>
              <div className="info-text">
                <Info size={12} />
                <span>Normal range: {info.normal}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="form-submit">
        <button type="submit" className="btn btn-primary btn-block">
          Predict CKD Risk
        </button>
      </div>
    </form>
  );
};

export default PredictionForm;