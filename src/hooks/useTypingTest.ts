import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateWpm, calculateAccuracy, KEY_TO_FINGER, Finger } from '../lib/typingUtils';

export function useTypingTest(targetText: string, onComplete?: (stats: any) => void) {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentChar = targetText[userInput.length] || "";
  const activeFinger: Finger | undefined = KEY_TO_FINGER[currentChar];

  const reset = useCallback(() => {
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setErrors(0);
    setIsFinished(false);
  }, []);

  const handleKey = useCallback((key: string) => {
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const expected = targetText[userInput.length];
    
    if (key === expected) {
      const nextInput = userInput + key;
      setUserInput(nextInput);
      
      if (nextInput.length === targetText.length) {
        const now = Date.now();
        setEndTime(now);
        setIsFinished(true);
        
        const wpm = calculateWpm(nextInput.length, startTime || now, now);
        const accuracy = calculateAccuracy(nextInput.length, nextInput.length + errors);
        
        onComplete?.({
          wpm,
          accuracy,
          errorCount: errors,
          duration: Math.floor((now - (startTime || now)) / 1000)
        });
      }
    } else {
      if (key.length === 1) { // Only count printable char errors
        setErrors(prev => prev + 1);
      }
    }
  }, [userInput, targetText, startTime, isFinished, errors, onComplete]);

  return {
    userInput,
    currentChar,
    activeFinger,
    isFinished,
    errors,
    startTime,
    handleKey,
    reset,
    wpm: startTime ? calculateWpm(userInput.length, startTime, endTime || Date.now()) : 0,
    accuracy: calculateAccuracy(userInput.length, userInput.length + errors)
  };
}
