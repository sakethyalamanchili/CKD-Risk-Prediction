import { useState, useEffect } from "react";
import { Sun, Moon, Activity } from "lucide-react";
import PredictionForm from "./components/PredictionForm";
import ResultsDisplay from "./components/ResultsDisplay";
import { predictCKDStage } from "./utils/prediction";
import "./App.css";

function App() {
  const [prediction, setPrediction] = useState<{
    stage: number | null;
    probability: number | null;
    risk: string | null;
  }>({
    stage: null,
    probability: null,
    risk: null,
  });

  const [formData, setFormData] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark"); // Default to dark theme

  useEffect(() => {
    // Check for user's preferred color scheme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    // Use saved theme if available, otherwise use system preference or default to dark
    setTheme(savedTheme || (prefersDark ? "dark" : "dark"));
    
    // Listen for changes in system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "dark");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Update document class when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handlePredict = (data: Record<string, number>) => {
    setFormData(data);
    const result = predictCKDStage(data);
    setPrediction(result);
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`app-container ${theme}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Activity size={36} strokeWidth={1.5} />
          </div>
          <h1>CKD Risk Prediction</h1>
        </div>
        <p className="subtitle">
          Early Detection of Chronic Kidney Disease using AI in Precision Medicine.
        </p>
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      <main className="app-main">
        <div className="tabs">
          <button 
            className={`tab ${!showResults ? "active" : ""}`} 
            onClick={handleReset}
          >
            Patient Data
          </button>
          <button 
            className={`tab ${showResults ? "active" : ""}`} 
            disabled={!showResults}
          >
            Prediction Results
          </button>
        </div>

        <div className="content-container">
          {!showResults ? (
            <div className="card">
              <div className="card-header">
                <h2>Enter Patient Biomarkers</h2>
                <p>Fill in the patient's clinical data to predict CKD risk</p>
              </div>
              <div className="card-content">
                <PredictionForm onPredict={handlePredict} />
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-content">
                <ResultsDisplay prediction={prediction} formData={formData} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;