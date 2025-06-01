import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { askNexora } from '../lib/openai';
import { useVoiceInput } from '../lib/voice';
import { isOffline, offlineFallbackMessage } from '../lib/offline';

export default function ChatPage() {
  const { t, language, setLanguage } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { startListening } = useVoiceInput(setInput, setListening);

  useEffect(() => {
    const savedMessages = localStorage.getItem('nexora_chat');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{ from: 'bot', text: t('greeting') }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nexora_chat', JSON.stringify(messages));
  }, [messages]);

  const translateText = async (text) => {
    if (language === 'en') return text;
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: 'system',
              content: `Translate the following text to ${language === 'si' ? 'Sinhala' : 'Tamil'}:`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3
        })
      });

      const data = await res.json();
      return data.choices?.[0]?.message?.content || text;
    } catch {
      return text;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    if (isOffline()) {
      setMessages([...newMessages, { from: 'bot', text: offlineFallbackMessage() }]);
      return;
    }

    setIsTyping(true);
    const reply = await askNexora(input);
    const translated = await translateText(reply);
    setIsTyping(false);
    setMessages([...newMessages, { from: 'bot', text: translated }]);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-100 text-black'} min-h-screen p-6 transition-all duration-300`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t('copilot_title')}</h1>
        <div className="flex items-center gap-2">
          <select
            className="bg-transparent border border-gray-700 rounded px-2 py-1 text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">🇬🇧 English</option>
            <option value="si">🇱🇰 Sinhala</option>
            <option value="ta">🇱🇰 Tamil</option>
          </select>
          <button onClick={() => setDarkMode(!darkMode)} className="text-sm border px-3 py-1 rounded">
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-4 h-[70vh] overflow-y-auto mb-4 border border-gray-700 transition-all duration-300`}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.from === 'user' ? 'text-right' : 'text-left'} transition-all duration-300`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-lg max-w-[80%] transition-all duration-300 ${
                msg.from === 'user'
                  ? 'bg-blue-600 text-white' : `${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-800'}`
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {listening && (
          <div className="text-center text-pink-400 animate-pulse">🎙 Listening...</div>
        )}
        {isTyping && (
          <div className="text-left text-yellow-400 animate-bounce">Nexora is typing...</div>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-grow p-3 rounded ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border border-gray-700 focus:outline-none`}
          placeholder={t('ask_something')}
        />
        <button
          onClick={() => startListening()}
          className={`px-4 py-2 rounded transition-colors duration-300 ${listening ? 'bg-pink-600' : 'bg-purple-600'} hover:opacity-80`}
        >🎙</button>
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition-colors duration-300"
        >
          {t('send')}
        </button>
      </div>
    </div>
  );
}

