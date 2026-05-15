import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateWpm, calculateAccuracy, KEY_TO_FINGER, Finger } from '../lib/typingUtils';

export function useTypingTest(targetText: string, onComplete?: (stats: any) => void) {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentChar = targetText[userInput.length] || "";
  const activeFinger: Finger | undefined = KEY_TO_FINGER[currentChar];

  const startTimeRef = useRef<number | null>(null);
  const errorsRef = useRef(0);
  const isFinishedRef = useRef(false);
  const isWaitingRef = useRef(true);
  const userInputRef = useRef("");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  const reset = useCallback(() => {
    setUserInput("");
    userInputRef.current = "";
    setStartTime(null);
    setEndTime(null);
    setErrors(0);
    setIsFinished(false);
    setIsWaiting(true);
    startTimeRef.current = null;
    errorsRef.current = 0;
    isFinishedRef.current = false;
    isWaitingRef.current = true;
  }, []);

  const handleKey = useCallback((key: string) => {
    if (isFinishedRef.current) return;

    if (isWaitingRef.current) {
      if (key === " " || key === "Enter") {
        setIsWaiting(false);
        isWaitingRef.current = false;
        const now = Date.now();
        startTimeRef.current = now;
        setStartTime(now);
      }
      return;
    }

    const expected = targetText[userInputRef.current.length];
    
    if (key === expected) {
      const nextInputValue = userInputRef.current + key;
      userInputRef.current = nextInputValue; // Sync update
      setUserInput(nextInputValue); // Trigger rerender

      if (nextInputValue.length === targetText.length) {
        const now = Date.now();
        setEndTime(now);
        setIsFinished(true);
        isFinishedRef.current = true;
        
        const finalStartTime = startTimeRef.current || now;
        const wpmVal = calculateWpm(nextInputValue.length, finalStartTime, now);
        const accuracyVal = calculateAccuracy(nextInputValue.length, nextInputValue.length + errorsRef.current);
        
        onCompleteRef.current?.({
          wpm: wpmVal,
          accuracy: accuracyVal,
          errorCount: errorsRef.current,
          duration: Math.floor((now - finalStartTime) / 1000)
        });
      }
    } else {
      // It's an error if it's a single character key
      if (key.length === 1) {
        errorsRef.current += 1;
        setErrors(errorsRef.current);
      }
    }
  }, [targetText]);

  return {
    userInput,
    currentChar,
    activeFinger,
    isFinished,
    isWaiting,
    errors,
    startTime,
    handleKey,
    reset,
    wpm: startTime ? calculateWpm(userInput.length, startTime, endTime || Date.now()) : 0,
    accuracy: calculateAccuracy(userInput.length, userInput.length + errors)
  };
}
