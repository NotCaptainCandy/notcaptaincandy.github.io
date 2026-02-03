
import React, { useEffect, useState } from 'react';

const BackgroundHearts: React.FC = () => {
  const [hearts, setHearts] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => [...prev.slice(-20), Date.now()]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(id => (
        <HeartParticle key={id} />
      ))}
    </div>
  );
};

const HeartParticle: React.FC = () => {
  const left = Math.random() * 100;
  const size = 15 + Math.random() * 25;
  const duration = 10 + Math.random() * 15;
  const color = ['text-pink-200', 'text-red-200', 'text-pink-300'][Math.floor(Math.random() * 3)];

  return (
    <div
      className={`heart-particle ${color}`}
      style={{
        left: `${left}%`,
        fontSize: `${size}px`,
        animationDuration: `${duration}s`,
      }}
    >
      ❤
    </div>
  );
};

export default BackgroundHearts;
