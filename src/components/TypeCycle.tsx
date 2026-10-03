"use client";

import { useEffect, useState } from "react";

/**
 * Types and erases a rotating list of words with a blinking caret. The slot is
 * sized to the longest word so the surrounding headline never reflows.
 */
export function TypeCycle({ words, className = "" }: { words: string[]; className?: string }) {
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let length = words[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = words[index];
      if (deleting) {
        length--;
        setText(word.slice(0, length));
        if (length === 0) {
          deleting = false;
          index = (index + 1) % words.length;
          timer = setTimeout(tick, 320);
        } else {
          timer = setTimeout(tick, 45);
        }
      } else {
        const nextWord = words[index];
        length++;
        setText(nextWord.slice(0, length));
        if (length === nextWord.length) {
          deleting = true;
          timer = setTimeout(tick, 2400);
        } else {
          // Slightly uneven rhythm reads as a human typing.
          timer = setTimeout(tick, 70 + Math.random() * 70);
        }
      }
    };

    timer = setTimeout(tick, 2600);
    return () => clearTimeout(timer);
  }, [words]);

  return (
    <span aria-hidden="true" className={`inline-grid align-baseline ${className}`}>
      {words.map((w) => (
        <span key={w} className="invisible col-start-1 row-start-1 pr-[0.12em]">
          {w}
        </span>
      ))}
      <span className="col-start-1 row-start-1 whitespace-nowrap">
        {text}
        <span className="type-caret" />
      </span>
    </span>
  );
}
