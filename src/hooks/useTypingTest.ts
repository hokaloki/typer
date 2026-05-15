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

  // Use refs for logic that must be synchronous and latest
  const stateRef = useRef({
    userInput: "",
    startTime: null as number | null,
    isWaiting: true,
    isFinished: false,
    errors: 0,
    targetText: targetText
  });

  // Sync refs when state or props change
  useEffect(() => {
    stateRef.current.targetText = targetText;
  }, [targetText]);

  // Reset function that cleans both state and ref
  const reset = useCallback(() => {
    stateRef.current = {
      userInput: "",
      startTime: null,
      isWaiting: true,
      isFinished: false,
      errors: 0,
      targetText: targetText
    };
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

  const handleKey = useCallback((key: string) => {
    const { isFinished, isWaiting, userInput, startTime, errors, targetText } = stateRef.current;

    if (isFinished) return;

    // Auto-start on first key if it's not a control key
    if (isWaiting) {
      if (key.length === 1 || key === "Enter") {
        const now = Date.now();
        stateRef.current.isWaiting = false;
        stateRef.current.startTime = now;
        setIsWaiting(false);
        setStartTime(now);
        // Continue to check if this first key is correct
      } else {
        return;
      }
    }

    const { userInput: updatedUserInput, errors: updatedErrors, startTime: updatedStartTime } = stateRef.current;
    const expected = targetText[updatedUserInput.length];
    
    if (key === expected) {
      const nextInput = updatedUserInput + key;
      stateRef.current.userInput = nextInput;
      setUserInput(nextInput);
      setIsError(false);

      if (nextInput.length === targetText.length) {
        const now = Date.now();
        stateRef.current.isFinished = true;
        setEndTime(now);
        setIsFinished(true);
        
        const effectiveStartTime = updatedStartTime || now;
        const wpmVal = calculateWpm(nextInput.length, effectiveStartTime, now);
        const accuracyVal = calculateAccuracy(nextInput.length, nextInput.length + updatedErrors);
        
        onCompleteRef.current?.({
          wpm: wpmVal,
          accuracy: accuracyVal,
          errorCount: updatedErrors,
          duration: Math.floor((now - effectiveStartTime) / 1000)
        });
      }
    } else {
      // Ignore control keys for error counting
      if (key.length === 1 && key !== "Enter") {
        stateRef.current.errors += 1;
        setErrors(stateRef.current.errors);
        setIsError(true);
      }
    }
  }, []); // Truly stable handleKey

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
