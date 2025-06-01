import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Nexora Campus Copilot</h1>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded border border-gray-600"
        >
          <option value="en">English</option>
          <option value="si">සිංහල</option>
          <option value="ta">தமிழ்</option>
        </select>
      </header>

      {!showChat ? (
        <div className="text-center space-y-6">
          <p className="text-xl">{t('welcome')}</p>
          <button
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-500 text-lg"
            onClick={() => setShowChat(true)}
          >
            Enter Chatbot
          </button>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/events" className="block p-6 bg-gray-800 rounded-xl hover:bg-gray-700">
              <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
              <p>Check out what’s happening at NovaCore University.</p>
            </Link>

            <Link href="/faq" className="block p-6 bg-gray-800 rounded-xl hover:bg-gray-700">
              <h2 className="text-xl font-semibold mb-2">Campus FAQs</h2>
              <p>Need help with transcripts, leave requests, or other campus procedures?</p>
            </Link>
          </div>
        </div>
      ) : (
        <iframe
          src="/chat"
          className="w-full h-[80vh] border border-gray-800 rounded-xl"
          title="Nexora Chatbot"
        />
      )}
    </div>
  );
}
