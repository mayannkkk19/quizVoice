export const QUIZ_QUESTIONS = [
  { id: "height", idNum: 1, label: "What is your height?", type: "dropdown", options: ["5'0\"", "5'2\"", "5'4\"", "5'6\"", "5'8\"", "5'10\"", "6'0\"", "6'2\""] },
  { id: "weight", idNum: 2, label: "What is your weight? (Optional)", type: "number", placeholder: "e.g., 160" },
  { id: "waist", idNum: 3, label: "Waist measurement in inches (narrowest point)", type: "dropdown", options: Array.from({ length: 29 }, (_, i) => `${i + 24}"`) },
  { id: "hip", idNum: 4, label: "Hip measurement in inches (fullest point)", type: "dropdown", options: Array.from({ length: 29 }, (_, i) => `${i + 32}"`) },
  { id: "waistFit", idNum: 5, label: "How do you like jeans to fit at the waist?", type: "radio", options: ["Snug", "Slightly relaxed", "Relaxed"] },
  { id: "waistbandRise", idNum: 6, label: "Where should the waistband sit?", type: "radio", options: ["High rise", "Mid rise", "Low rise"] },
  { id: "thighFit", idNum: 7, label: "How should jeans fit through the thighs?", type: "radio", options: ["Fitted", "Relaxed", "Loose"] },
  { id: "pastBrands", idNum: 8, label: "Which denim brands have you bought before?", type: "multi-select", options: ["Levi's", "Zara", "H&M", "Diesel", "Wrangler", "Calvin Klein", "Nudie Jeans"] },
  { id: "brandSizes", idNum: 9, label: "What size did you buy in those brands?", type: "conditional" },
  { id: "fitFrustration", idNum: 10, label: "Biggest fit frustration when buying jeans?", type: "radio", options: ["Waist gap", "Hip tightness", "Wrong length", "Thigh fit", "Rise", "Other"] }
];