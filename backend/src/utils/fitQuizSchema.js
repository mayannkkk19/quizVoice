export const QUIZ_QUESTIONS = {
  1: { id: "height", label: "What is your height?", type: "dropdown" },
  2: { id: "weight", label: "What is your weight?", type: "optional_number" },
  3: { id: "waist", label: "Waist measurement in inches", type: "dropdown" },
  4: { id: "hip", label: "Hip measurement in inches", type: "dropdown" },
  5: { id: "waistFit", label: "How do you like jeans to fit at the waist?", type: "single_select", options: ["snug", "slightly relaxed", "relaxed"] },
  6: { id: "waistbandRise", label: "Where should the waistband sit?", type: "single_select", options: ["high rise", "mid rise", "low rise"] },
  7: { id: "thighFit", label: "How should jeans fit through the thighs?", type: "single_select", options: ["fitted", "relaxed", "loose"] },
  8: { id: "pastBrands", label: "Which denim brands have you bought before?", type: "multi_select" },
  9: { id: "brandSizes", label: "What size did you buy in those brands?", type: "conditional_record" },
  10: { id: "fitFrustration", label: "Biggest fit frustration when buying jeans?", type: "single_select_or_other" }
};