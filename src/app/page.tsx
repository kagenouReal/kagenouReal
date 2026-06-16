"use client";
import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ScrollProgressBar from '../components/ScrollProgressBar';
import Navbar from '../components/Navbar';
import CursorGlow from '../components/CursorGlow';
import Marquee from '../components/Marquee';
import BackToTop from '../components/BackToTop';
import DynamicBackground from '../components/DynamicBackground';

export default function Page() {
  useEffect(() => {
    console.log(
      "%c Portfolio Loaded Successfully %c v1.0.0 ",
      "background: #8b9d77; color: #fff; padding: 2px 4px; border-radius: 3px 0 0 3px; font-weight: bold;",
      "background: #1E293B; color: #fff; padding: 2px 4px; border-radius: 0 3px 3px 0;"
    );
  }, []);

  return (
    <main className="min-h-screen bg-bg-main relative transition-colors duration-500 overflow-hidden">
      <DynamicBackground />
      <CursorGlow />
      <ScrollProgressBar />
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}
