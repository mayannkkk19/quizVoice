import { GoogleGenAI } from '@google/genai';
import { QUIZ_QUESTIONS } from '../utils/fitQuizSchema.js';

// Initializes implicitly using process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const parseVoiceTranscript = async (req, res) => {
  try {
    const { currentQuestionId, transcript } = req.body;

    // 1. Updated Schema to explicitly include a 'skipped' boolean flag
    const quizResponseSchema = {
      type: "OBJECT",
      properties: {
        field: { 
          type: "STRING", 
          description: "The technical state key being updated (e.g., 'height', 'weight', 'fitPreference')." 
        },
        value: { 
          type: ["STRING", "NULL"],
          description: "The verified measurement or preference value extracted. Must be null if the user wants to skip or if the text is entirely unclear." 
        },
        skipped: {
          type: "BOOLEAN",
          description: "Set to true ONLY if the user explicitly expresses a desire to bypass, skip, pass, or refuse to answer this optional question. Otherwise, false."
        },
        confirmationSpeech: { 
          type: "STRING", 
          description: "A short conversational phrase confirming the action taken (e.g., 'No problem, skipping that.', or 'Awesome, 170 pounds.')." 
        }
      },
      required: ["field", "value", "skipped", "confirmationSpeech"]
    };

    // 2. Clear contextual instructions for handling intent mapping
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: `The user was asked question ID: "${currentQuestionId}". Their spoken input transcript is: "${transcript}". Process the intent.`,
      config: {
        systemInstruction: "You are an intelligent data-extraction engine for Jackie Jeans. You must comprehend user intent. " +
                          "CORE INTENT RULES:\n" +
                          "1. IF THE USER WANTS TO SKIP: If the transcript contains words like 'skip', 'skip it', 'pass', 'I don't know', 'next question', or 'I don't want to answer', " +
                          "YOU MUST set 'skipped': true, 'value': null, and 'confirmationSpeech' to a friendly skipping confirmation.\n" +
                          "2. IF THE USER PROVIDES DATA: If they say 'I weigh 160 pounds' or just '160', set 'skipped': false, extract the data into 'value', and confirm it.\n" +
                          "3. IF THE USER IS UNCLEAR/GARBAGE AUDIO: If the audio is completely unreadable or irrelevant, set 'skipped': false, 'value': null, and ask them to repeat.",
        responseMimeType: "application/json",
        responseSchema: quizResponseSchema,
        temperature: 0.1 // Slightly bumped to allow conversational intent mapping while keeping data tight
      }
    });

    let cleanText = response.text.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    const extractedData = JSON.parse(cleanText);
    return res.status(200).json(extractedData);

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    return res.status(500).json({ error: "Failed to parse speech metrics accurately." });
  }
};