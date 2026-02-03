
import React, { useState, useCallback, useRef } from 'react';
import { Heart, Stars, PartyPopper, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameState, Position } from './types';
import { audioService } from './services/audioService';
import BackgroundHearts from './components/BackgroundHearts';

const valentineImg = new URL('./valentine.jpg', import.meta.url).href;
// This URL is a high-quality placeholder. 
const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1516589174184-c68526514283?q=80&w=1000&auto=format&fit=crop";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.ASKING);
  const [noButtonPos, setNoButtonPos] = useState<Position | null>(null);
  const [noClicks, setNoClicks] = useState(0);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const handleNoClick = useCallback(() => {
    audioService.playBuzzer();
    setNoClicks(prev => prev + 1);

    const padding = 120;
    const maxX = window.innerWidth - padding;
    const maxY = window.innerHeight - padding;

    const newX = Math.max(20, Math.random() * maxX);
    const newY = Math.max(20, Math.random() * maxY);

    setNoButtonPos({ x: newX, y: newY });
  }, []);

  const handleYesClick = useCallback(() => {
    setGameState(GameState.ACCEPTED);
    audioService.playPartyHonker();

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 100, zIndex: 50 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 70 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-[#fffafa] overflow-hidden">
      <BackgroundHearts />

      <div className="z-10 text-center max-w-3xl w-full">
        {gameState === GameState.ASKING ? (
          <div className="space-y-12 animate-in fade-in zoom-in duration-1000">
            <div className="relative inline-block">
              <Heart className="w-16 h-16 text-red-600 animate-pulse fill-red-600/10" />
              <Stars className="absolute -top-4 -right-4 w-8 h-8 text-rose-300 animate-bounce" />
            </div>

            <h1 className="text-6xl md:text-8xl font-romantic text-stone-800 leading-tight">
              Vismaya will you be my <br />
              <span className="text-red-600 italic">Valentine?</span>
            </h1>

            <div className="flex flex-col items-center gap-16">
              <button
                onClick={handleYesClick}
                className="group relative px-16 py-8 bg-red-600 hover:bg-red-700 text-white rounded-full text-4xl font-bold shadow-[0_15px_50px_-10px_rgba(220,38,38,0.4)] transition-all hover:scale-110 active:scale-95 flex items-center gap-4 overflow-hidden"
              >
                <span className="relative z-10 tracking-[0.2em] uppercase">Yes</span>
                <HeartHandshake className="relative z-10 w-10 h-10 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>

              <button
                ref={noButtonRef}
                onClick={handleNoClick}
                onMouseEnter={handleNoClick}
                style={noButtonPos ? {
                  position: 'fixed',
                  left: `${noButtonPos.x}px`,
                  top: `${noButtonPos.y}px`,
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  zIndex: 100
                } : {}}
                className={`
                  text-stone-400 font-medium px-4 py-2 rounded text-xs hover:text-stone-600 transition-colors
                  ${noButtonPos ? 'bg-white shadow-lg border border-rose-50' : 'opacity-40'}
                `}
              >
                No :(
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in zoom-in slide-in-from-bottom-12 duration-1000 flex flex-col items-center">
            <h1 className="text-7xl md:text-9xl font-romantic text-stone-900 drop-shadow-sm flex items-center gap-4">
              I love you honey!! <Heart className="inline text-red-500 fill-red-500" size={60} />
            </h1>

            <div className="relative group mx-auto w-full max-w-sm">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-100 to-rose-100 rounded-[3rem] blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000"></div>

              <div className="relative p-3 bg-white shadow-2xl rounded-2xl border border-stone-100 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-50">
                  <img
                    src={valentineImg}
                    alt="Us"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback if valentine.jpg is not present
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL;
                    }}
                  />
                </div>
                <div className="pt-6 pb-2 text-center">
                  <p className="font-romantic text-2xl text-stone-400 italic">2025</p>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8">
                <PartyPopper className="w-20 h-20 text-red-500 drop-shadow-lg animate-bounce" />
              </div>
            </div>

            <div className="space-y-6 pt-12">
              <p className="text-4xl font-romantic text-rose-600 italic tracking-wide">
                "Forever yours - Aryan"
              </p>
              <p className="text-lg text-stone-500 max-w-lg mx-auto leading-relaxed font-light">
                Thank you for saying yes. Every moment with you is a gift :)
              </p>
            </div>

            <button
              onClick={() => {
                setGameState(GameState.ASKING);
                setNoClicks(0);
                setNoButtonPos(null);
              }}
              className="mt-16 text-stone-300 text-[10px] hover:text-stone-400 transition-colors tracking-[0.3em] uppercase border-b border-stone-100 hover:border-stone-200 pb-1"
            >
              Back to Start
            </button>
          </div>
        )}
      </div>

      <div className="fixed inset-6 border border-red-50/50 pointer-events-none rounded-[3rem] z-50"></div>
    </div>
  );
};

export default App;
