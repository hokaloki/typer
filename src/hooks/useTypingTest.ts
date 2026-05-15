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

  const startTimeRef = useRef<number | null>(null);
  const errorsRef = useRef(0);
  const isFinishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const reset = useCallback(() => {
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setErrors(0);
    setIsFinished(false);
    startTimeRef.current = null;
    errorsRef.current = 0;
    isFinishedRef.current = false;
  }, []);

  const handleKey = useCallback((key: string) => {
    if (isFinishedRef.current) return;

    let isCorrect = false;

    setUserInput(prev => {
      if (isFinishedRef.current) return prev;
      
      const expected = targetText[prev.length];
      if (key === expected) {
        isCorrect = true;
        const nextInput = prev + key;
        
        if (prev.length === 0 && !startTimeRef.current) {
          const now = Date.now();
          startTimeRef.current = now;
          setStartTime(now);
        }

        if (nextInput.length === targetText.length) {
          const now = Date.now();
          setEndTime(now);
          setIsFinished(true);
          isFinishedRef.current = true;
          
          const finalStartTime = startTimeRef.current || now;
          const wpmVal = calculateWpm(nextInput.length, finalStartTime, now);
          const accuracyVal = calculateAccuracy(nextInput.length, nextInput.length + errorsRef.current);
          
          onCompleteRef.current?.({
            wpm: wpmVal,
            accuracy: accuracyVal,
            errorCount: errorsRef.current,
            duration: Math.floor((now - finalStartTime) / 1000)
          });
        }
        return nextInput;
      }
      return prev;
    });

    if (!isCorrect && key.length === 1) {
      errorsRef.current += 1;
      setErrors(errorsRef.current);
    }
  }, [targetText]);

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
