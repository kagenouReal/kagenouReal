//===============
export const PROFILE_IMAGE_URL = '/assets/card-profile.png';
export const BACKGROUND_VIDEO_URL = '/assets/background.mp4';
//===============
export interface ProjectItem {
id: string;
title: string;
description: string;
image_url: string;
live_url: string;
github_url: string;
technologies: string[];
key_features: string[];
}
//===============
export interface CertificateItem {
id: string;
title: string;
image_url: string;
}
//===============
export interface TechStackItem {
id: string;
name: string;
logo_url: string;
category: 'languages' | 'frameworks' | 'platforms' | 'skills';
}
//===============
const svgToDataUri = (svg: string) =>
`data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
//===============
export const PROJECTS_DATA: ProjectItem[] = [
{
id: 'pteroless',
title: 'Pteroless',
description:
'An experimental Pterodactyl-derived server panel with a local process runner, built for personal hosting and development on Linux.',
image_url:
'/assets/project/pteroless.png',
live_url: 'https://github.com/kagenouReal/Pteroless',
github_url: 'https://github.com/kagenouReal/Pteroless',
technologies: ['PHP', 'Laravel', 'React', 'TypeScript', 'Tailwind CSS'],
key_features: [
'Pterodactyl-derived server management panel',
'Local process runner for Linux hosts',
'Personal hosting and development workflow',
'Server-side process management',
],
},
{
id: 'kobeni-md',
title: 'Kobeni-MD',
description:
'A multi-device WhatsApp bot built with Node.js and Baileys, with modular plugins and automation-focused features.',
image_url:
'/assets/project/kobeni.png',
live_url: 'https://github.com/kagenouReal/Kobeni-MD',
github_url: 'https://github.com/kagenouReal/Kobeni-MD',
technologies: ['Node.js', 'JavaScript', 'Baileys', 'Cheerio', 'WhatsApp'],
key_features: [
'Multi-device WhatsApp sessions',
'Modular plugin system',
'Public/self access modes',
'Automation features',
],
},
{
id: 'zqwis-apis-backend',
title: 'Zqwis',
description:
'A Next.js and TypeScript project combining API utilities, scraping, WhatsApp integrations, scheduled jobs, and SQLite-backed tools.',
image_url:
'/assets/project/zqwis.png',
live_url: 'https://github.com/kagenouReal/Zqwis-Apis-Backend',
github_url: 'https://github.com/kagenouReal/Zqwis-Apis-Backend',
technologies: ['TypeScript', 'Next.js', 'Node.js', 'SQLite', 'Cheerio'],
key_features: [
'API and scraping utilities',
'SQLite data storage',
'WhatsApp integration via Baileys',
'Next.js + TypeScript',
],
},
];
//===============
export const CERTIFICATES_DATA: CertificateItem[] = [
{
id: 'cert-backend-dev',
title: 'Backend Systems & API Architecture',
image_url: '/assets/certificates/backapi-cert.png',
},
{
id: 'cert-automation-bots',
title: 'Bot Development & Automation',
image_url: '/assets/certificates/botauto-cert.png',
},
{
id: 'cert-reverse-engineering',
title: 'Web Scraping & Reverse Engineering',
image_url: '/assets/certificates/reverseweb-cert.png',
},
];
//===============
export const TECH_STACK_DATA: TechStackItem[] = [
{
id: 'nodejs',
name: 'Node.js',
category: 'frameworks',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#68A063" d="M64 8.5L12 38.5v60l52 30 52-30v-60L64 8.5zm39.6 83.2L64 114.3 24.4 91.7V46.1L64 23.5l39.6 22.6v45.6z"/>
<path fill="#68A063" d="M64 36.8L35.2 53.4v33.2L64 103.2l28.8-16.6V53.4L64 36.8zm16.5 43.5L64 90.1l-16.5-9.8V61.3L64 51.5l16.5 9.8v19z"/>
</svg>
`),
},
{
id: 'bun',
name: 'Bun',
category: 'frameworks',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path d="M21 76c0-25 19-45 43-45s43 20 43 45v21c0 9-7 16-16 16H37c-9 0-16-7-16-16V76z" fill="#FBF0DF" stroke="#F472B6" stroke-width="5"/>
<path d="M32 65c10-8 19-8 29 0M67 65c10-8 19-8 29 0" fill="none" stroke="#342A36" stroke-width="6" stroke-linecap="round"/>
<circle cx="47" cy="79" r="4" fill="#342A36"/>
<circle cx="81" cy="79" r="4" fill="#342A36"/>
<path d="M55 94c6 5 12 5 18 0" fill="none" stroke="#342A36" stroke-width="5" stroke-linecap="round"/>
</svg>
`),
},
{
id: 'express',
name: 'Express.js',
category: 'frameworks',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<rect x="12" y="18" width="104" height="92" rx="12" fill="#1A1A26"/>
<path d="M30 48h68M30 64h52M30 80h40" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
<path d="m78 72 12 12 12-12" fill="none" stroke="#EF4444" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`),
},
{
id: 'react',
name: 'React',
category: 'frameworks',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<g fill="none" stroke="#61DAFB" stroke-width="5">
<ellipse cx="64" cy="64" rx="52" ry="20"/>
<ellipse cx="64" cy="64" rx="52" ry="20" transform="rotate(60 64 64)"/>
<ellipse cx="64" cy="64" rx="52" ry="20" transform="rotate(120 64 64)"/>
</g>
<circle cx="64" cy="64" r="8" fill="#61DAFB"/>
</svg>
`),
},
{
id: 'tailwind-css',
name: 'Tailwind CSS',
category: 'frameworks',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#38BDF8" d="M64 24c-20 0-32 10-38 30 8-10 17-14 28-12 6 1 10 5 14 9 7 7 15 15 32 15 20 0 32-10 38-30-8 10-17 14-28 12-6-1-10-5-14-9-7-7-15-15-32-15z"/>
<path fill="#38BDF8" d="M44 62c-20 0-32 10-38 30 8-10 17-14 28-12 6 1 10 5 14 9 7 7 15 15 32 15 20 0 32-10 38-30-8 10-17 14-28 12-6-1-10-5-14-9-7-7-15-15-32-15z"/>
</svg>
`),
},
{
id: 'javascript',
name: 'JavaScript',
category: 'languages',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#F7DF1E" d="M12 12h104v104H12z"/>
<path fill="#000" d="M64 85.5c0 14.5-8.5 22.5-21 22.5-12.5 0-19.5-7.5-22.5-15l12.5-7.5c2 4 4.5 7.5 9.5 7.5 4.5 0 7.5-2.5 7.5-8.5V45h14v40.5zm36-3.5c3.5 6 8.5 10 16 10 6.5 0 11-3.5 11-8.5 0-6-5-8.5-13.5-12.5-12-5.5-20-11-20-23.5 0-11.5 9-20.5 23-20.5 10 0 17 4 21.5 12l-11 7c-2.5-4.5-5.5-6.5-10.5-6.5-5 0-8.5 3-8.5 7 0 5 4 7 11.5 10.5 14 6 22 11.5 22 25.5 0 14.5-11.5 23-25.5 23-14.5 0-23.5-7.5-28-17.5l13.5-7z"/>
</svg>
`),
},
{
id: 'typescript',
name: 'TypeScript',
category: 'languages',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#3178C6" d="M12 12h104v104H12z"/>
<path fill="#fff" d="M28 44h40v12H54v48H42V56H28V44zm44 42.5c3.5 6 8.5 9.5 16 9.5 6.5 0 11-3.5 11-8.5 0-6-5-8.5-13.5-12.5-12-5.5-20-11-20-23.5 0-11.5 9-20.5 23-20.5 10 0 17 4 21.5 12l-11 7c-2.5-4.5-5.5-6.5-10.5-6.5-5 0-8.5 3-8.5 7 0 5 4 7 11.5 10.5 14 6 22 11.5 22 25.5 0 14.5-11.5 23-25.5 23-14.5 0-23.5-7.5-28-17.5l13.5-7z"/>
</svg>
`),
},
{
id: 'go',
name: 'Golang',
category: 'languages',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<rect x="8" y="8" width="112" height="112" rx="16" fill="#102B38"/>
<path d="M16 40h96M12 60h94M18 80h88" stroke="#00ADD8" stroke-width="7" stroke-linecap="round" opacity=".75"/>
<text x="64" y="76" fill="#00ADD8" font-family="Arial,sans-serif" font-size="54" font-weight="700" text-anchor="middle">Go</text>
</svg>
`),
},
{
id: 'linux',
name: 'Linux',
category: 'platforms',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#FCC624" d="M64 8c-18 0-30 14-30 32 0 10 4 20 8 28-8 8-16 20-16 36 0 12 10 16 22 16 10 0 18-4 26-10 8 6 16 10 26 10 12 0 22-4 22-16 0-16-8-28-16-36 4-8 8-18 8-28 0-18-12-32-30-32z"/>
<ellipse cx="52" cy="34" rx="4" ry="6" fill="#000"/>
<ellipse cx="76" cy="34" rx="4" ry="6" fill="#000"/>
<polygon points="64,42 54,54 74,54" fill="#FFA500"/>
</svg>
`),
},
{
id: 'api',
name: 'API / REST',
category: 'platforms',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<rect x="16" y="16" width="96" height="96" rx="20" fill="#0284C7"/>
<path d="M36 48l16 16-16 16M60 80h32" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`),
},
{
id: 'backend-development',
name: 'Backend Development',
category: 'skills',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<rect x="20" y="22" width="88" height="84" rx="12" fill="#263238"/>
<path d="M20 48h88M20 76h88" stroke="#EF4444" stroke-width="5"/>
<circle cx="34" cy="35" r="4" fill="#fff"/><circle cx="48" cy="35" r="4" fill="#fff"/>
<path d="m40 60 12 8-12 8m22 0h26" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M40 91h48" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/>
</svg>
`),
},
{
id: 'bot-development',
name: 'Bot Development',
category: 'skills',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path d="M64 18v14" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
<circle cx="64" cy="14" r="7" fill="#EF4444"/>
<rect x="22" y="36" width="84" height="72" rx="16" fill="#EF4444"/>
<circle cx="48" cy="65" r="8" fill="#fff"/><circle cx="80" cy="65" r="8" fill="#fff"/>
<path d="M48 88h32M12 58v24m104-24v24" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
</svg>
`),
},
{
id: 'networking',
name: 'Networking',
category: 'skills',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path d="M64 36 32 88h64L64 36zm0 0v56M32 88l64-52M96 88 32 36" fill="none" stroke="#fff" stroke-width="6"/>
<circle cx="64" cy="30" r="15" fill="#EF4444" stroke="#fff" stroke-width="5"/>
<circle cx="28" cy="94" r="15" fill="#EF4444" stroke="#fff" stroke-width="5"/>
<circle cx="100" cy="94" r="15" fill="#EF4444" stroke="#fff" stroke-width="5"/>
</svg>
`),
},
{
id: 'server-development',
name: 'Server Development',
category: 'skills',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<rect x="24" y="14" width="80" height="100" rx="10" fill="#263238" stroke="#EF4444" stroke-width="6"/>
<path d="M24 47h80M24 80h80" stroke="#EF4444" stroke-width="5"/>
<circle cx="40" cy="31" r="5" fill="#fff"/><circle cx="40" cy="64" r="5" fill="#fff"/><circle cx="40" cy="97" r="5" fill="#fff"/>
<path d="M56 31h32m-32 33h32m-32 33h32" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
</svg>
`),
},
{
id: 'reverse-engineering',
name: 'Reverse Engineering',
category: 'skills',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<circle cx="54" cy="54" r="32" fill="none" stroke="#EF4444" stroke-width="10"/>
<path d="m78 78 28 28M39 54h30m-15-15v30" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
<path d="m49 50 6-8 6 8m-12 8 6 8 6-8" fill="none" stroke="#EF4444" stroke-width="4"/>
</svg>
`),
},
{
id: 'devops-infrastructure',
name: 'DevOps & Infrastructure',
category: 'skills',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path d="M35 91h59a20 20 0 0 0 1-40 32 32 0 0 0-61-6 23 23 0 0 0 1 46z" fill="#263238" stroke="#fff" stroke-width="6"/>
<path d="m45 68 13 13 26-29" fill="none" stroke="#EF4444" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`),
},
{
id: 'web-scraping',
name: 'Web Scraping',
category: 'skills',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<rect x="14" y="20" width="82" height="66" rx="8" fill="#263238" stroke="#fff" stroke-width="6"/>
<path d="M14 40h82M28 57h30m-30 14h22" stroke="#EF4444" stroke-width="6" stroke-linecap="round"/>
<circle cx="83" cy="83" r="22" fill="#12121A" stroke="#EF4444" stroke-width="8"/>
<path d="m99 99 17 17" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
</svg>
`),
},
{
id: 'automation',
name: 'Automation',
category: 'skills',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<circle cx="64" cy="64" r="48" fill="#38BDF8"/>
<path d="M64 32v16M64 80v16M32 64h16M80 64h16M42 42l12 12M74 74l12 12M42 86l12-12M74 54l12-12" stroke="#0F172A" stroke-width="8" stroke-linecap="round"/>
<circle cx="64" cy="64" r="14" fill="#0F172A"/>
</svg>
`),
},
{
id: 'nextjs',
name: 'Next.js',
category: 'frameworks',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<circle cx="64" cy="64" r="48" fill="#000"/>
<path d="M42 42v44M86 42v44M42 42l44 44" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
</svg>
`),
},
{
id: 'html',
name: 'HTML',
category: 'languages',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#E34F26" d="M18 16l8 84 38 12 38-12 8-84H18z"/>
<path fill="#fff" d="m42 43 22 7v11l-11-3 1 10 10 3v11l-20-6-2-32zm44 0-22 7v11l11-3-1 10-10 3v11l20-6 2-32z"/>
</svg>
`),
},
{
id: 'css',
name: 'CSS',
category: 'languages',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#1572B6" d="M18 16l8 84 38 12 38-12 8-84H18z"/>
<path fill="#fff" d="M64 28v70l28-9 6-63H64z"/>
<path fill="#fff" d="M38 43h52l-2 11H50l1 10h36l-4 28-19 6-19-6-1-15h11l1 7 8 2 8-2 1-10H41l-3-31z"/>
</svg>
`),
},
{
id: 'php',
name: 'PHP',
category: 'languages',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<ellipse cx="64" cy="64" rx="56" ry="32" fill="#777BB3"/>
<text x="64" y="72" fill="#fff" font-family="Arial,sans-serif" font-size="30" font-weight="700" text-anchor="middle">php</text>
</svg>
`),
},
{
id: 'laravel',
name: 'Laravel',
category: 'frameworks',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#FF2D20" d="M64 8 14 36v56l50 28 50-28V36L64 8zm0 14 36 20-14 8-36-20 14-8zM26 46l31 17v35L26 81V46zm45 52V63l31-17v35L71 98z"/>
</svg>
`),
},
{
id: 'flutter',
name: 'Flutter',
category: 'frameworks',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#54C5F8" d="M73 8h39L50 70 30 50 73 8zM73 68h39L73 108 53 88l20-20z"/>
<path fill="#01579B" d="m73 108 20-20 19 20-19 20-20-20z"/>
</svg>
`),
},
{
id: 'dart',
name: 'Dart',
category: 'languages',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#00C4B3" d="M22 22h43l55 55-22 29H48L22 80V22z"/>
<path fill="#0175C2" d="M22 22 8 50v43l27 27h63L22 44V22z"/>
<path fill="#29B6F6" d="M65 22h29l26 26v29L65 22z"/>
</svg>
`),
},
{
id: 'sqlite',
name: 'SQLite',
category: 'platforms',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path fill="#0F80CC" d="M20 30h75v68H20z"/>
<path fill="#fff" d="M31 44h53v8H31zm0 16h53v8H31zm0 16h35v8H31z"/>
<path fill="#003B57" d="M83 25c8-9 20-13 31-12-7 6-12 14-15 24-3 9-8 17-17 24 3-13 2-24 1-36z"/>
</svg>
`),
},
{
id: 'shell',
name: 'Shell',
category: 'languages',
logo_url: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
<path d="M28 12h48l28 28v76H28z" fill="#293137"/>
<path d="M76 12v28h28" fill="#46525A"/>
<path d="M42 59h10m-10 16h44m-44 16h32" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
<path d="m57 54 8 5-8 5" fill="none" stroke="#EF4444" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
<text x="41" y="50" fill="#EF4444" font-family="monospace" font-size="11" font-weight="700">#!/bin/sh</text>
</svg>
`),
},
];
//===============