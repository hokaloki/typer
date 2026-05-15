import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateWpm, calculateAccuracy, KEY_TO_FINGER, Finger } from '../lib/typingUtils';

export function useTypingTest(targetText: string, onComplete?: (stats: any) => void) {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isError, setIsError] = useState(false);

  // Auto-reset when target text changes
  useEffect(() => {
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setErrors(0);
    setIsFinished(false);
    setIsWaiting(true);
    setIsError(false);
  }, [targetText]);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleKeyInternal = useCallback((key: string) => {
    if (isFinished) return;

    if (isWaiting) {
      if (key === " " || key === "Enter") {
        setIsWaiting(false);
        setStartTime(Date.now());
      }
      return;
    }

    const expected = targetText[userInput.length];
    
    if (key === expected) {
      setIsError(false);
      const nextInput = userInput + key;
      setUserInput(nextInput);

      if (nextInput.length === targetText.length) {
        const now = Date.now();
        setEndTime(now);
        setIsFinished(true);
        
        const effectiveStartTime = startTime || now;
        const wpmVal = calculateWpm(nextInput.length, effectiveStartTime, now);
        const accuracyVal = calculateAccuracy(nextInput.length, nextInput.length + errors);
        
        onCompleteRef.current?.({
          wpm: wpmVal,
          accuracy: accuracyVal,
          errorCount: errors,
          duration: Math.floor((now - effectiveStartTime) / 1000)
        });
      }
    } else {
      if (key.length === 1 && key !== "Enter") {
        setIsError(true);
        setErrors(prev => prev + 1);
      }
    }
  }, [isFinished, isWaiting, targetText, userInput, startTime, errors]);

  const handleKeyRef = useRef(handleKeyInternal);
  handleKeyRef.current = handleKeyInternal;

  const handleKey = useCallback((key: string) => {
    handleKeyRef.current(key);
  }, []);

  const reset = useCallback(() => {
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setErrors(0);
    setIsFinished(false);
    setIsWaiting(true);
    setIsError(false);
  }, []);

  return {
    userInput,
    currentChar: targetText[userInput.length] || "",
    activeFinger: KEY_TO_FINGER[targetText[userInput.length] || ""],
    isFinished,
    isWaiting,
    isError,
    errors,
    startTime,
    handleKey,
    reset,
    wpm: startTime ? calculateWpm(userInput.length, startTime, endTime || Date.now()) : 0,
    accuracy: calculateAccuracy(userInput.length, userInput.length + errors)
  };
}
