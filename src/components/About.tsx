import SectionHeader from './SectionHeader';
import { GitHubCalendar } from 'react-github-calendar';
import { motion } from 'motion/react';

export default function About() {
const paragraphs = [
  "I'm a self-taught full-stack developer who enjoys building and experimenting with code. After leaving formal school at age 8, I went through a period of regret about stepping away from education. In 2024, I decided to turn that experience into motivation, fully dedicating myself to learning software development and treating technology as my main creative space.",

  "I work across both backend and frontend development, using technologies like Node.js, Flutter (Dart), Next.js, HTML, and CSS. A big part of my workflow involves building automation tools, web scraping, and analyzing third-party APIs to understand and extend their functionality. I also actively use AI tools such as ChatGPT, Gemini, Claude, and DeepSeek to speed up learning, improve problem-solving, and enhance productivity."
];

  const tools = ["Termux", "MT Manager", " Reqable", "Gemini", "Chatgpt", "Claude", "DeepSeek"];

  const info = [
    ["Name", "Irsyad Adam Hakimi"],
    ["Age", "16 years old / 16-11-2010"],
    ["Location", "Bachok, Kelantan — Malaysia"],
    ["Speaking", "Malaysia, Indonesia, English"],
    ["Focus", "Backend & Frontend — Automation"],
  ];
  return (
    <section id="about" className="py-20 px-6 md:px-10 max-w-[1000px] mx-auto z-10 relative">
      <SectionHeader num="1" tag="about" title="Who am I" />
      
      <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-10">
        <div>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-text-muted leading-[1.85] text-[0.9rem] mb-[1rem]">
              {p}
            </p>
          ))}

          <div className="flex flex-wrap gap-2 mt-6">
            {tools.map(tool => (
              <span 
                key={tool} 
                className="font-mono text-[0.63rem] py-1 px-2.5 rounded bg-border-subtle/50 text-text-muted border border-border-subtle tracking-[0.06em]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {info.map(([k, v]) => (
            <div 
              key={k} 
              className="flex justify-between items-center py-3 px-4 bg-card-bg border border-border-subtle rounded-lg transition-colors hover:bg-card-hover"
            >
              <span className="font-mono text-[0.67rem] text-text-muted opacity-80 tracking-[0.07em]">
                {k}
              </span>
              <span className="font-mono text-[0.7rem] text-text-main">
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
