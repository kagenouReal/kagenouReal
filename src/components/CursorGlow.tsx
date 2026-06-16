import { useState, useEffect } from 'react';

export default function CursorGlow() {
  const [cursor, setCursor] = useState({ x: -500, y: -500 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    
    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  return (
    <div 
      className="fixed pointer-events-none z-[1] rounded-full transition-[left,top] duration-75 ease-out"
      style={{ 
        left: cursor.x - 200, 
        top: cursor.y - 200, 
        width: 400, 
        height: 400, 
        background: `radial-gradient(circle, var(--color-brand-glow) 0%, transparent 65%)`, 
        opacity: visible ? 1 : 0 
      }} 
    />
  );
}
