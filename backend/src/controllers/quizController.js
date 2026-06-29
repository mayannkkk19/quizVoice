import { GoogleGenAI } from '@google/genai';
import { QUIZ_QUESTIONS } from '../utils/fitQuizSchema.js';

// Initializes implicitly using process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const parseVoiceInput = async (req, res) => {
  try {
    const { currentQuestionId, transcript } = req.body;

    if (!currentQuestionId || !transcript) {
      return res.status(400).json({ error: "Missing currentQuestionId or transcript." });
    }

    const questionMeta = QUIZ_QUESTIONS[currentQuestionId];
    if (!questionMeta) {
      return res.status(404).json({ error: "Invalid question ID." });
    }

    const systemPrompt = `
      You are an AI data parser backend for Jackie Jeans. The user was asked the question: "${questionMeta.label}".
      Their raw spoken response is: "${transcript}".
      
      Your objective is to extract the pure data value following these structural constraints:
      - Field ID to output: "${questionMeta.id}"
      - Expected data type format: ${questionMeta.type}
      
      Parsing Logic:
      1. If the user explicitly asks to skip, bypass, says "I don't know", or hesitates to answer (highly relevant if type is optional_number), set "skipped": true and "value": null.
      2. For human heights (e.g., "five foot ten", "five eleven"), format strictly as feet and inches: 5'10"
      3. For sizes, extract just the raw numerical value or standardized category selection.
      4. For past brands multi-select, output a string array of matched brands.
      
      You must respond strictly with a valid JSON string containing exactly these fields:
      {
        "field": "${questionMeta.id}",
        "value": <extracted_value_or_null>,
        "skipped": true/false,
        "confirmationSpeech": "A single brief, organic confirmation sentence a retail stylist would say to acknowledge their input (e.g., 'Awesome, 5 foot 10 inches.', or 'Got it, let's skip the weight.')"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    // Extract text block directly from Gemini response
    const jsonOutput = JSON.parse(response.text);
    return res.status(200).json(jsonOutput);

  } catch (error) {
    console.error("Gemini Parsing Engine Error:", error);
    return res.status(500).json({ error: "Failed to parse voice transcript smoothly." });
  }
};