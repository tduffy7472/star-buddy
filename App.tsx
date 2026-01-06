
import React, { useState, useRef, useEffect } from 'react';
import StarBackground from './components/StarBackground';
import ConstellationCard from './components/ConstellationCard';
import { getConstellationDetails, chatWithStarBuddy } from './services/geminiService';
import { Constellation, ChatMessage } from './types';

const POPULAR_CONSTELLATIONS = [
  { name: 'Orion', icon: 'fa-user-ninja', color: 'from-blue-500 to-indigo-600' },
  { name: 'Ursa Major', icon: 'fa-paw', color: 'from-purple-500 to-pink-600' },
  { name: 'Cassiopeia', icon: 'fa-crown', color: 'from-yellow-400 to-orange-500' },
  { name: 'Leo', icon: 'fa-cat', color: 'from-red-400 to-red-600' },
  { name: 'Cygnus', icon: 'fa-feather', color: 'from-cyan-400 to-blue-500' },
  { name: 'Pegasus', icon: 'fa-horse', color: 'from-indigo-400 to-purple-500' }
];

const App: React.FC = () => {
  const [selectedConstellation, setSelectedConstellation] = useState<Constellation | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Star Buddy! 🤖✨ Ask me anything about the night sky!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatOpen]);

  const handleSelectConstellation = async (name: string) => {
    setLoading(true);
    setLoadingPhase('Consulting the star charts...');
    
    // We add a slight delay to let the UI breathe
    setTimeout(() => setLoadingPhase('Painting the constellation...'), 1500);

    const details = await getConstellationDetails(name);
    if (details) {
      setSelectedConstellation(details);
    }
    setLoading(false);
    setLoadingPhase('');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await chatWithStarBuddy(history, userMessage);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm a bit lost in space! Try again? 🚀" }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-purple-500 selection:text-white">
      <StarBackground />
      
      {/* Navigation / Header */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <i className="fa-solid fa-user-astronaut text-2xl text-white"></i>
          </div>
          <h1 className="text-2xl font-black tracking-tight neon-glow">STAR BUDDY</h1>
        </div>
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transition-all border border-white/20"
        >
          <i className="fa-solid fa-message text-xl"></i>
        </button>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <header className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            See the <br/>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Star Pictures
            </span>
          </h2>
          <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
            Choose a group of stars to see its magical shape and hear its story!
          </p>
        </header>

        {/* Constellation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {POPULAR_CONSTELLATIONS.map((c) => (
            <button
              key={c.name}
              onClick={() => handleSelectConstellation(c.name)}
              disabled={loading}
              className={`group relative p-8 rounded-[32px] overflow-hidden transition-all transform hover:-translate-y-2 active:scale-95 bg-gradient-to-br ${c.color} shadow-xl hover:shadow-2xl`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                <i className={`fa-solid ${c.icon} text-9xl`}></i>
              </div>
              <div className="relative z-10 flex flex-col h-full items-start justify-end gap-2">
                <i className={`fa-solid ${c.icon} text-3xl mb-4 bg-white/20 p-4 rounded-2xl`}></i>
                <h3 className="text-3xl font-bold">{c.name}</h3>
                <span className="text-sm font-medium opacity-80 uppercase tracking-widest">Tap to See Shape</span>
              </div>
            </button>
          ))}
        </div>

        {/* Fun Footer Promo */}
        <div className="mt-24 p-12 cosmic-card text-center border-blue-500/20">
          <div className="mb-6 inline-block bg-blue-500/20 p-4 rounded-full">
            <i className="fa-solid fa-rocket text-4xl text-blue-400 animate-bounce"></i>
          </div>
          <h3 className="text-3xl font-bold mb-4">Want to find your own?</h3>
          <p className="text-blue-200/70 mb-8 max-w-xl mx-auto">
            Ask Star Buddy about other constellations like Andromeda, Scorpius, or Taurus!
          </p>
          <button 
            onClick={() => setChatOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95"
          >
            Ask a Question
          </button>
        </div>
      </main>

      {/* Modals & Overlays */}
      {selectedConstellation && (
        <ConstellationCard 
          data={selectedConstellation} 
          onClose={() => setSelectedConstellation(null)} 
        />
      )}

      {loading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-xl">
          <div className="text-center space-y-6">
            <div className="relative">
               <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
               <i className="fa-solid fa-star text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></i>
            </div>
            <p className="text-2xl font-black tracking-widest uppercase text-white drop-shadow-lg">{loadingPhase || 'Traveling to the Stars...'}</p>
          </div>
        </div>
      )}

      {/* Chat Bot Interface */}
      <div 
        className={`fixed bottom-0 right-0 md:right-8 md:bottom-8 z-50 w-full md:w-[400px] h-[600px] max-h-[90vh] transition-all duration-500 ease-in-out transform ${
          chatOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="h-full cosmic-card flex flex-col shadow-2xl border-white/20 overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-robot text-xl"></i>
              <span className="font-bold">Star Buddy</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="hover:text-white/70">
              <i className="fa-solid fa-chevron-down"></i>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white/10 text-blue-50 rounded-bl-none border border-white/10'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me something about space!"
              className="flex-1 bg-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            <button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center transition-all"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
