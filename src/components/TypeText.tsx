import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface TypeTextProps {
  text: string | string[];
  as?: keyof React.JSX.IntrinsicElements;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string;
  cursorClassName?: string;
  cursorBlinkDuration?: number;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

export const TypeText: React.FC<TypeTextProps> = ({
  text,
  as: Tag = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);

  const containerRef = useRef<HTMLElement | null>(null);
  const sentences = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getNextDelay = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!isVisible) return;
    let timer: ReturnType<typeof setTimeout>;
    const currentSentence = sentences[sentenceIndex];
    const targetText = reverseMode
      ? currentSentence.split('').reverse().join('')
      : currentSentence;

    const step = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (sentenceIndex === sentences.length - 1 && !loop) return;
          if (onSentenceComplete) onSentenceComplete(sentences[sentenceIndex], sentenceIndex);
          setSentenceIndex((prev) => (prev + 1) % sentences.length);
          setCharIndex(0);
          timer = setTimeout(() => {}, pauseDuration);
        } else {
          timer = setTimeout(() => {
            setDisplayedText((prev) => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else if (charIndex < targetText.length) {
        timer = setTimeout(() => {
          setDisplayedText((prev) => prev + targetText[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, variableSpeed ? getNextDelay() : typingSpeed);
      } else if (sentences.length >= 1) {
        if (!loop && sentenceIndex === sentences.length - 1) return;
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    };

    if (charIndex !== 0 || isDeleting || displayedText !== '') {
      step();
    } else {
      timer = setTimeout(step, initialDelay);
    }

    return () => clearTimeout(timer);
  }, [
    charIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    sentences,
    sentenceIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete,
    getNextDelay,
  ]);

  const hideCursor = hideCursorWhileTyping && (charIndex < sentences[sentenceIndex].length || isDeleting);
  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap tracking-tight ${className}`}
    >
      <span
        className="inline"
        style={{
          color: (textColors.length === 0 ? 'inherit' : textColors[sentenceIndex % textColors.length]) || 'inherit',
        }}
      >
        {displayedText}
      </span>
      {showCursor && (
        <span
          className={`ml-1 inline-block ${hideCursor ? 'hidden' : ''} ${cursorClassName}`}
          style={{
            animation: `cursorBlink ${cursorBlinkDuration * 2}s infinite ease-in-out`,
          }}
        >
          {cursorCharacter}
        </span>
      )}
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </Component>
  );
};
