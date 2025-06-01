// /lib/voice.js

export function useVoiceInput(setInput) {
    const startListening = () => {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Voice recognition not supported in this browser.');
        return;
      }
  
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
  
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
  
      recognition.onerror = (e) => {
        console.error('Voice recognition error:', e);
      };
  
      recognition.start();
    };
  
    return { startListening };
  }
  
  // /lib/offline.js
  
  export function isOffline() {
    return !navigator.onLine;
  }
  
  export function offlineFallbackMessage() {
    return "⚠️ You appear to be offline or experiencing a Vexora storm. I’ll answer with cached guidance if possible.";
  }
  