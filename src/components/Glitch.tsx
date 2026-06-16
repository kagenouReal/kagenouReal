import { useState, useEffect } from 'react';

export default function Glitch({ text }: { text: string }) {
  const [on, setOn] = useState(false);
  
  useEffect(() => {
    const id = setInterval(() => { 
      setOn(true); 
      setTimeout(() => setOn(false), 120); 
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block">
      <span 
        className="transition-all"
        style={{ 
          position: on ? "absolute" : "relative", 
          left: on ? "-2px" : 0, 
          color: on ? "var(--color-brand)" : "inherit", 
          opacity: on ? 0.65 : 1, 
          clipPath: on ? "inset(20% 0 50% 0)" : "none" 
        }}
      >
        {text}
      </span>
      {on && (
        <span 
          className="absolute left-[3px] top-0 text-brand-soft opacity-45"
          style={{ clipPath: "inset(60% 0 8% 0)", color: "var(--color-brand-soft)" }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
