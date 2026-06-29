import { useState, useEffect, useRef } from 'react';
import { QUIZ_QUESTIONS } from '../utils/fitQuizSchema';

export default function VoiceQuiz({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceData, setVoiceData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationSpeech, setConfirmationSpeech] = useState("");

  const recognitionRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const currentQuestion = QUIZ_QUESTIONS[stepIndex];

  // 3. Audio Listener Engine
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { console.log(e); }
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };
    
    recognition.onend = () => setIsListening(false);
    
    recognition.onerror = (event) => {
      console.error("Mic Error Code:", event.error);
      setIsListening(false);
    };

    recognition.onresult = async (event) => {
      const speechToText = event.results[0][0].transcript;
      
      if (!speechToText || speechToText.trim().length === 0) {
        console.log("Empty audio transcript ignored. Restarting mic...");
        speakText("Sorry, I didn't hear anything. Could you say that again?");
        return;
      }

      setTranscript(speechToText);
      await sendToBackend(speechToText);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 1. Text-to-Speech Engine with Speaking State tracking
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); 
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      isSpeakingRef.current = true;
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
      console.log("AI finished speaking naturally. Starting mic for Q:", currentQuestion?.id);
      startSpeechRecognition();
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!currentQuestion) return;
    const greeting = stepIndex === 0 
      ? "Welcome to Jackie Jeans. Let's find your perfect fit. First question: What is your height?"
      : `${confirmationSpeech} Next question: ${currentQuestion.label}`;
    
    speakText(greeting);

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  // 2. Interactive Interruption Function (Force Start Mic)
  const handleForceStartMic = () => {
    console.log("User pushed to talk. Interrupting AI stylist immediately.");
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
    startSpeechRecognition();
  };

  // 4. API Communication Processing Block
  const sendToBackend = async (spokenText) => {
    setIsLoading(true);
    try {
      const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      console.log(`Processing Q#${currentQuestion.idNum || currentQuestion.id} with text:`, spokenText);
      
      const response = await fetch(`${BACKEND_URL}/api/parse-voice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentQuestionId: currentQuestion.id, // Reverted to standard string ID matching backend controller expectations
          transcript: spokenText
        })
      });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      
      const parsedResult = await response.json();
      console.log("Response Payload from Backend Engine:", parsedResult);

      if (!parsedResult.value && !parsedResult.skipped) {
        setIsLoading(false);
        setConfirmationSpeech(parsedResult.confirmationSpeech || "Sorry, let's try that question again.");
        speakText(parsedResult.confirmationSpeech || "Let's try that question again.");
        return; 
      }

      // Compute fresh dataset slice explicitly to pass state accurately
      const updatedData = { ...voiceData, [parsedResult.field]: parsedResult.value };
      setVoiceData(updatedData);
      setConfirmationSpeech(parsedResult.confirmationSpeech || "Got it.");

      if (stepIndex < QUIZ_QUESTIONS.length - 1) {
        setIsLoading(false);
        setStepIndex(prevIndex => prevIndex + 1); 
      } else {
        setIsLoading(false);
        const finalPhrase = "Perfect! I've mapped your exact profile. Handing you off to our showroom floor now.";
        speakText(finalPhrase);
        setTimeout(() => onComplete(updatedData), 3500); // FIXED: Passing direct snapshot updates safely
      }
    } catch (err) {
      console.error("Network communication exception:", err);
      setIsLoading(false);
      speakText("Sorry, my connection timed out. Could you say that one more time?");
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-950 text-white rounded-3xl p-8 border border-zinc-800 shadow-2xl flex flex-col items-center">
      <div className="text-emerald-400 font-bold tracking-widest text-xs uppercase mb-8 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full bg-emerald-400 ${isListening ? 'animate-ping' : ''}`} />
        Jackie AI Stylist Mode
      </div>

      <div className="h-24 flex items-center justify-center gap-1.5 mb-8">
        {[...Array(7)].map((_, i) => (
          <div 
            key={i} 
            className={`w-1.5 rounded-full bg-emerald-400 transition-all duration-300 ${
              isListening ? 'animate-pulse h-12' : isLoading ? 'animate-bounce h-8 bg-amber-400' : 'h-3 bg-zinc-700'
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>

      <div className="text-center min-h-[100px] mb-6 w-full">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Jackie</p>
        <p className="text-lg font-medium text-zinc-100 px-2">{currentQuestion ? currentQuestion.label : "Processing..."}</p>
      </div>

      {transcript && (
        <div className="bg-zinc-900/60 rounded-2xl p-4 w-full text-center border border-zinc-800 mb-6">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">You Said</p>
          <p className="text-emerald-300 font-medium text-sm">"{transcript}"</p>
        </div>
      )}

      {/* Dynamic Contextual Hint Suggestions */}
      {currentQuestion && (
        <div className="w-full mb-6">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center mb-2.5">
            💡 Suggested Responses
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {currentQuestion.options && currentQuestion.options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setTranscript(opt);
                  sendToBackend(opt);
                }}
                className="text-xs bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 border border-zinc-800/80 px-3 py-1.5 rounded-xl font-medium transition-all duration-150"
              >
                "{opt}"
              </button>
            ))}

            {!currentQuestion.options && currentQuestion.placeholder && (
              <div className="text-xs text-zinc-500 italic bg-zinc-900/40 px-4 py-2 rounded-xl border border-zinc-900/60 font-medium">
                Try saying: <span className="text-zinc-400 not-italic">"My {currentQuestion.id} is {currentQuestion.placeholder}"</span>
              </div>
            )}

            {currentQuestion.isOptional && (
              <button
                onClick={() => {
                  setTranscript("Skip this question");
                  sendToBackend("Skip this question");
                }}
                className="text-[11px] bg-zinc-900/30 hover:bg-zinc-950 text-zinc-500 hover:text-amber-400 border border-zinc-800/40 border-dashed px-3 py-1.5 rounded-xl font-bold transition-all duration-150"
              >
                "Skip this step"
              </button>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleForceStartMic}
        disabled={isLoading}
        className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg text-sm tracking-wide ${
          isListening 
            ? 'bg-zinc-800 text-emerald-400 border border-zinc-700' 
            : isLoading 
              ? 'bg-amber-500 text-black animate-pulse' 
              : 'bg-emerald-500 hover:bg-emerald-400 text-black'
        }`}
      >
        {isListening ? '🎙️ Listening... Speak Now' : isLoading ? '⚡ Processing answers...' : 'Tap to Speak / Interrupt AI'}
      </button>
    </div>
  );
}