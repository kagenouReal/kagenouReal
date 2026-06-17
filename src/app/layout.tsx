import '../index.css';

export const metadata = {
title: 'About Kagenou',
description: 'My Portfolio',
};

export const viewport = {
themeColor: [
{ media: '(prefers-color-scheme: light)', color: '#faf7f3' },
{ media: '(prefers-color-scheme: dark)', color: '#080808' },
],
width: 'device-width',
initialScale: 1,
viewportFit: 'cover',
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (
<html lang="en">
<head>
<script dangerouslySetInnerHTML={{ __html: `
(function() {
try {
const theme = localStorage.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
if (theme === 'dark') document.documentElement.classList.add('dark');
else document.documentElement.classList.remove('dark');
} catch (e) {}
})()
` }} />
</head>
<body>{children}</body>
</html>
);
}
