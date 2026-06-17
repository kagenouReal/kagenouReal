"use client";
import React, { useState, useEffect } from 'react';
import { Hero, About, Skills, Projects, Contact } from '../components/Sections';
import { Navbar, Footer, BackToTop, SplashScreen } from '../components/Navigation';
import MusicSidebar from '../components/MusicSidebar';
import { CursorGlow, DynamicBackground, BackgroundGrid } from '../components/VisualEffects';
import { ScrollProgressBar, Marquee } from '../components/DisplayUtils';

export default function Page() {
const [isMusicOpen, setIsMusicOpen] = useState(false);
const [showContent, setShowContent] = useState(false);
const [splashFinished, setSplashFinished] = useState(false);

useEffect(() => {
console.log(
"%c Portfolio Loaded Successfully %c v1.0.0 ",
"background: #8b9d77; color: #fff; padding: 2px 4px; border-radius: 3px 0 0 3px; font-weight: bold;",
"background: #1E293B; color: #fff; padding: 2px 4px; border-radius: 0 3px 3px 0;"
);
}, []);

return (
<main className={`min-h-screen relative transition-colors duration-500 ${!splashFinished ? 'h-screen overflow-hidden' : ''}`}>
<SplashScreen onComplete={() => { setShowContent(true); setSplashFinished(true); }} />
<div className={!splashFinished ? 'pointer-events-none' : ''}>
<BackgroundGrid />
{splashFinished && (
<>
<DynamicBackground paused={isMusicOpen} />
<CursorGlow />
<ScrollProgressBar />
<Navbar onOpenMusic={() => setIsMusicOpen(true)} />

<div className={`transition-opacity duration-700 ${showContent ? "opacity-100" : "opacity-0"}`}>
<Hero />
<Marquee />
<About />
<Skills />
<Projects />
<Contact />
<Footer />
</div>

<BackToTop />
<MusicSidebar isOpen={isMusicOpen} onClose={() => setIsMusicOpen(false)} />
</>
)}
</div>
</main>
);
}