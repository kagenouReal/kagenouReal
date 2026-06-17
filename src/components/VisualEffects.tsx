import { useState, useEffect, useRef } from 'react';

export function CursorGlow() {
const [cursor, setCursor] = useState({ x: -500, y: -500 });
const [visible, setVisible] = useState(false);

useEffect(() => {
let frameId: number;
const updatePosition = (e: MouseEvent) => {
if (frameId) cancelAnimationFrame(frameId);
frameId = requestAnimationFrame(() => {
setCursor({ x: e.clientX, y: e.clientY });
if (!visible) setVisible(true);
});
};
const handleMouseLeave = () => setVisible(false);
window.addEventListener('mousemove', updatePosition, { passive: true });
document.addEventListener('mouseleave', handleMouseLeave);
return () => {
window.removeEventListener('mousemove', updatePosition);
document.removeEventListener('mouseleave', handleMouseLeave);
if (frameId) cancelAnimationFrame(frameId);
};
}, [visible]);

return (
<div 
className="fixed pointer-events-none z-[1] rounded-full will-change-transform"
style={{ 
transform: `translate3d(${cursor.x - 200}px, ${cursor.y - 200}px, 0)`,
width: 400, 
height: 400, 
background: `radial-gradient(circle, var(--color-brand-glow) 0%, transparent 65%)`, 
opacity: visible ? 1 : 0,
transition: 'opacity 0.3s ease-out'
}} 
/>
);
}

export function BackgroundGrid() {
return (
<div 
className="absolute inset-0 z-[-1] pointer-events-none w-full h-full"
style={{
backgroundImage: `
linear-gradient(var(--color-brand) 0.5px, transparent 0.5px),
linear-gradient(90deg, var(--color-brand) 0.5px, transparent 0.5px)
`,
backgroundSize: '40px 40px',
maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
opacity: 0.06
}}
/>
);
}

export function DynamicBackground({ paused }: { paused: boolean }) {
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
const canvas = canvasRef.current;
if (!canvas) return;
const ctx = canvas.getContext('2d', { alpha: true });
if (!ctx) return;

if (paused) return; // Stop animation if paused

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const isLowEnd = width < 768 || (typeof navigator !== 'undefined' && (navigator as any).hardwareConcurrency < 4);
const particles: { x: number; y: number; vx: number; vy: number }[] = [];
const count = isLowEnd ? 15 : 40;

for (let i = 0; i < count; i++) {
particles.push({
x: Math.random() * width,
y: Math.random() * height,
vx: (Math.random() - 0.5) * 0.3,
vy: (Math.random() - 0.5) * 0.3,
});
}

let animationFrameId: number;

const draw = () => {
ctx.clearRect(0, 0, width, height);
const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--color-brand').trim();
ctx.fillStyle = `${brandColor}30`;
ctx.lineWidth = 0.5;

for (let i = 0; i < particles.length; i++) {
const p = particles[i];
p.x += p.vx;
p.y += p.vy;

if (p.x < 0) p.x = width;
if (p.x > width) p.x = 0;
if (p.y < 0) p.y = height;
if (p.y > height) p.y = 0;

ctx.beginPath();
ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
ctx.fill();

if (!isLowEnd) {
for (let j = i + 1; j < particles.length; j++) {
const p2 = particles[j];
const dx = p.x - p2.x;
const dy = p.y - p2.y;
const distSq = dx * dx + dy * dy;
if (distSq < 15000) {
ctx.beginPath();
ctx.strokeStyle = `${brandColor}${Math.floor((1 - Math.sqrt(distSq) / 122) * 20).toString(16).padStart(2, '0')}`;
ctx.moveTo(p.x, p.y);
ctx.lineTo(p2.x, p2.y);
ctx.stroke();
}
}
}
}
animationFrameId = requestAnimationFrame(draw);
};

draw();
let resizeTimeout: any;
const handleResize = () => {
clearTimeout(resizeTimeout);
resizeTimeout = setTimeout(() => {
width = window.innerWidth;
height = window.innerHeight;
canvas.width = width;
canvas.height = height;
}, 200);
};
window.addEventListener('resize', handleResize);

return () => {
cancelAnimationFrame(animationFrameId);
window.removeEventListener('resize', handleResize);
};
}, [paused]);

return <canvas ref={canvasRef} className="fixed inset-0 z-[-1] pointer-events-none" />;
}

export function Glitch({ text }: { text: string }) {
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