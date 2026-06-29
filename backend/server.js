import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { parseVoiceTranscript } from './src/controllers/quizController.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Your local Vite server
  'https://quiz-voice.vercel.app' // Your eventual production Vercel URL
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Primary Endpoint for AI Voice Processing
app.post('/api/parse-voice', parseVoiceTranscript);

// Catch-all fallbacks
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, () => {
  console.log(`🚀 Jackie Jeans Backend firing on port ${PORT}`);
});