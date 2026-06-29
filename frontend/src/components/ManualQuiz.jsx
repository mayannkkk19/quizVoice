import { useState } from 'react';
import { QUIZ_QUESTIONS } from '../utils/fitQuizSchema';

export default function ManualQuiz({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brandSizes, setBrandSizes] = useState({});

  const question = QUIZ_QUESTIONS[currentStep];

  const handleNext = () => {
    if (question.id === 'pastBrands') {
      if (selectedBrands.length === 0) {
        // Skip brand sizes if no brands chosen, jump to fitFrustration (Step 9)
        setCurrentStep(9);
        return;
      }
    }
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final compilation
      onComplete({ ...formData, pastBrands: selectedBrands, brandSizes });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      if (currentStep === 9 && selectedBrands.length === 0) {
        setCurrentStep(7); // Jump back to pastBrands step
        return;
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const updateField = (val) => {
    setFormData({ ...formData, [question.id]: val });
  };

  const toggleBrand = (brand) => {
    const updated = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updated);
  };

  return (
  <div className="w-full max-w-md bg-zinc-950 rounded-3xl p-8 border border-zinc-800 shadow-2xl shadow-black/80 text-zinc-100">
    {/* Progress Bar Container */}
    <div className="w-full bg-zinc-900 h-2 rounded-full mb-6 overflow-hidden border border-zinc-800/40">
      <div 
        className="bg-emerald-400 h-full shadow-[0_0_12px_rgba(52,211,153,0.4)] transition-all duration-300" 
        style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
      />
    </div>

    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
      Question {currentStep + 1} of {QUIZ_QUESTIONS.length}
    </span>
    <h2 className="text-xl font-black text-white tracking-tight mb-6">{question.label}</h2>

    {/* Render Options Dynamic Arena */}
    <div className="min-h-[220px] mb-6 flex flex-col justify-center">
      
      {/* Dropdown Input Architecture */}
      {question.type === "dropdown" && (
        <select 
          className="w-full p-4 border border-zinc-800 rounded-2xl focus:border-emerald-500 outline-none bg-zinc-900 text-zinc-200 font-semibold transition-all"
          value={formData[question.id] || ""}
          onChange={(e) => updateField(e.target.value)}
        >
          <option value="" className="bg-zinc-950 text-zinc-500">Select an option</option>
          {question.options.map(opt => (
            <option key={opt} value={opt} className="bg-zinc-950 text-zinc-200">{opt}</option>
          ))}
        </select>
      )}

      {/* Numerical Input Type */}
      {question.type === "number" && (
        <div className="space-y-4">
          <input 
            type="number"
            placeholder={question.placeholder}
            className="w-full p-4 border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-500 rounded-2xl focus:border-emerald-500 outline-none font-medium transition-all"
            value={formData[question.id] || ""}
            onChange={(e) => updateField(e.target.value)}
          />
          <button 
            onClick={handleNext} 
            className="text-xs font-bold text-zinc-500 hover:text-emerald-400 uppercase tracking-wider block text-center w-full transition-colors duration-150"
          >
            Or skip this step
          </button>
        </div>
      )}

      {/* Radio Choice Selectors */}
      {question.type === "radio" && (
        <div className="space-y-3">
          {question.options.map(opt => (
            <button
              key={opt}
              onClick={() => updateField(opt)}
              className={`w-full p-4 text-left border rounded-2xl font-bold transition-all duration-150 ${
                formData[question.id] === opt 
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Multi-Select Interactive Grid */}
      {question.type === "multi-select" && (
        <div className="grid grid-cols-2 gap-2.5">
          {question.options.map(brand => (
            <button
              key={brand}
              onClick={() => toggleBrand(brand)}
              className={`p-3 text-xs border rounded-xl font-bold transition-all duration-150 ${
                selectedBrands.includes(brand) 
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' 
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      )}

      {/* Conditional Mapping Framework */}
      {question.type === "conditional" && (
        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
          {selectedBrands.map(brand => (
            <div key={brand} className="flex items-center justify-between border-b border-zinc-900 pb-3 last:border-0">
              <span className="font-bold text-zinc-300 text-sm">{brand}</span>
              <input 
                type="text" 
                placeholder="e.g., 32 or M"
                className="p-2.5 border border-zinc-800 bg-zinc-900 text-white placeholder-zinc-600 rounded-xl w-28 text-center text-xs font-semibold focus:outline-none focus:border-emerald-500 transition-all"
                value={brandSizes[brand] || ""}
                onChange={(e) => setBrandSizes({ ...brandSizes, [brand]: e.target.value })}
              />
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Universal Navigation Footfooter */}
    <div className="flex items-center justify-between pt-5 border-t border-zinc-900">
      <button 
        onClick={handleBack} 
        disabled={currentStep === 0}
        className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500 disabled:opacity-20 disabled:pointer-events-none hover:text-white transition-colors duration-150"
      >
        Back
      </button>
      <button 
        onClick={handleNext}
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl shadow-lg shadow-emerald-950/20 text-xs uppercase tracking-wider transition-all duration-150"
      >
        {currentStep === QUIZ_QUESTIONS.length - 1 ? 'Finish Profile' : 'Next'}
      </button>
    </div>
  </div>
);
}