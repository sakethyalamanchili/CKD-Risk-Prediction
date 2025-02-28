import { useState } from "react";
import { AlertTriangle, ChevronDown, Info } from "lucide-react";
import FeatureImportanceChart from "./FeatureImportanceChart";

interface ResultsDisplayProps {
  prediction: {
    stage: number | null;
    probability: number | null;
    risk: string | null;
  };
  formData: Record<string, number>;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ prediction, formData }) => {
  const { stage, probability, risk } = prediction;
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const getRiskColor = () => {
    switch (risk) {
      case "Low":
        return "badge-green";
      case "Moderate":
        return "badge-yellow";
      case "High":
        return "badge-orange";
      case "Very High":
        return "badge-red";
      default:
        return "badge-gray";
    }
  };

  const getProgressColor = () => {
    switch (risk) {
      case "Low":
        return "progress-green";
      case "Moderate":
        return "progress-yellow";
      case "High":
        return "progress-orange";
      case "Very High":
        return "progress-red";
      default:
        return "";
    }
  };

  const getRiskIcon = () => {
    switch (risk) {
      case "Low":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--success-color)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case "Moderate":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--warning-color)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      case "High":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case "Very High":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--danger-color)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-light)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        );
    }
  };

  const getStageLabel = () => {
    switch (stage) {
      case 0:
        return "No CKD";
      case 1:
        return "Stage 1";
      case 2:
        return "Stage 2";
      case 3:
        return "Stage 3";
      case 4:
        return "Stage 4";
      case 5:
        return "Stage 5";
      default:
        return "Unknown";
    }
  };

  const getStageDescription = () => {
    switch (stage) {
      case 0:
        return "No kidney damage detected. Kidney function appears normal based on the biomarkers provided.";
      case 1:
        return "Kidney damage with normal or increased GFR (≥90 mL/min/1.73m²). At this stage, there are signs of kidney damage but with normal kidney function.";
      case 2:
        return "Kidney damage with mild decreased GFR (60-89 mL/min/1.73m²). This indicates mild kidney function reduction with evidence of kidney damage.";
      case 3:
        return "Moderately decreased GFR (30-59 mL/min/1.73m²). This stage represents a moderate reduction in kidney function and requires medical attention.";
      case 4:
        return "Severely decreased GFR (15-29 mL/min/1.73m²). This indicates severe kidney function reduction and requires close medical supervision.";
      case 5:
        return "Kidney failure (GFR <15 mL/min/1.73m²) or dialysis. This is end-stage renal disease requiring renal replacement therapy.";
      default:
        return "Unknown stage. Unable to determine kidney function status based on the provided data.";
    }
  };

  const getActionNeeded = () => {
    switch (stage) {
      case 0:
        return {
          label: "Regular Check-ups",
          className: "badge-green",
        };
      case 1:
      case 2:
        return {
          label: "Monitor Closely",
          className: "badge-blue",
        };
      case 3:
        return {
          label: "Consult Specialist",
          className: "badge-yellow",
        };
      case 4:
      case 5:
        return {
          label: "Urgent Care",
          className: "badge-red",
        };
      default:
        return {
          label: "Consult Doctor",
          className: "badge-gray",
        };
    }
  };

  const getRecommendations = () => {
    switch (stage) {
      case 0:
        return [
          "Maintain a healthy lifestyle with regular exercise",
          "Follow a balanced diet low in sodium and processed foods",
          "Stay well-hydrated with adequate water intake",
          "Limit alcohol consumption and avoid smoking",
          "Continue annual health check-ups to monitor kidney function",
        ];
      case 1:
      case 2:
        return [
          "Control blood pressure and blood sugar levels",
          "Limit dietary protein intake as advised by healthcare provider",
          "Reduce salt consumption to help control blood pressure",
          "Schedule regular kidney function tests every 6-12 months",
          "Consult with a nephrologist for personalized management plan",
        ];
      case 3:
        return [
          "Follow a strict diet and fluid management plan",
          "Review all medications with your healthcare provider",
          "Schedule regular nephrologist visits every 3-6 months",
          "Monitor for anemia, bone disease, and other complications",
          "Consider lifestyle modifications to support kidney health",
        ];
      case 4:
      case 5:
        return [
          "Prepare for potential renal replacement therapy",
          "Adhere to strict dietary restrictions as prescribed",
          "Schedule frequent nephrologist consultations (every 1-3 months)",
          "Manage associated conditions (anemia, bone disease, etc.)",
          "Discuss dialysis or transplant options with your healthcare team",
        ];
      default:
        return ["Consult with a healthcare provider for personalized recommendations"];
    }
  };

  const actionNeeded = getActionNeeded();

  return (
    <div className="results-container">
      <div className="results-header">
        <div>
          <h3 className="results-title">Prediction Result</h3>
          <p className="results-subtitle">Based on patient biomarkers</p>
        </div>
        <div>{getRiskIcon()}</div>
      </div>

      <div className="results-summary">
        <div className="results-grid">
          <div className="results-item">
            <p className="results-label">CKD Stage</p>
            <p className="results-value">{stage !== null ? getStageLabel() : "Unknown"}</p>
          </div>
          <div className="results-item">
            <p className="results-label">Risk Level</p>
            <p className="results-value">
              <span className={`badge ${getRiskColor()}`}>{risk || "Unknown"}</span>
            </p>
          </div>
          <div className="results-item">
            <p className="results-label">Probability</p>
            <div>
              <p className="results-value">
                {probability !== null ? `${(probability * 100).toFixed(1)}%` : "Unknown"}
              </p>
              {probability !== null && (
                <div className="progress-container">
                  <div
                    className={`progress-bar ${getProgressColor()}`}
                    style={{ width: `${Math.min(probability * 100, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
          <div className="results-item">
            <p className="results-label">Action</p>
            <p className="results-value">
              <span className={`badge ${actionNeeded.className}`}>{actionNeeded.label}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="accordion">
        <div className="accordion-item">
          <div
            className="accordion-header"
            onClick={() => toggleAccordion("description")}
          >
            <span className="accordion-title">Stage Description</span>
            <span className={`accordion-icon ${openAccordion === "description" ? "open" : ""}`}>
              <ChevronDown size={16} />
            </span>
          </div>
          {openAccordion === "description" && (
            <div className="accordion-content">
              <p className="section-content">{getStageDescription()}</p>
            </div>
          )}
        </div>

        <div className="accordion-item">
          <div
            className="accordion-header"
            onClick={() => toggleAccordion("features")}
          >
            <span className="accordion-title">Feature Importance</span>
            <span className={`accordion-icon ${openAccordion === "features" ? "open" : ""}`}>
              <ChevronDown size={16} />
            </span>
          </div>
          {openAccordion === "features" && (
            <div className="accordion-content">
              <div className="feature-chart-container">
                <FeatureImportanceChart formData={formData} />
              </div>
            </div>
          )}
        </div>

        <div className="accordion-item">
          <div
            className="accordion-header"
            onClick={() => toggleAccordion("recommendations")}
          >
            <span className="accordion-title">Recommendations</span>
            <span className={`accordion-icon ${openAccordion === "recommendations" ? "open" : ""}`}>
              <ChevronDown size={16} />
            </span>
          </div>
          {openAccordion === "recommendations" && (
            <div className="accordion-content">
              <ul className="recommendations-list">
                {getRecommendations().map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="alert">
        <div className="alert-icon">
          <AlertTriangle size={20} />
        </div>
        <div className="alert-content">
          <p className="alert-text">
            This is a screening tool only. Results should be confirmed by a healthcare professional.
            Do not make medical decisions based solely on this prediction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;