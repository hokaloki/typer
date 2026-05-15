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

  // Sync refs immediately during render to ensure handleKey always has latest context
  if (stateRef.current.targetText !== targetText) {
    stateRef.current.targetText = targetText;
    // Note: reset() is called by the component if text changes significantly
  }

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

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

  const handleKey = useCallback((key: string) => {
    const state = stateRef.current;
    if (state.isFinished) return;

    // Read latest from state to be safe, but use ref as primary source of truth
    const currentInput = state.userInput;
    const target = state.targetText;

    if (state.isWaiting) {
      if (key.length === 1 || key === "Enter") {
        const now = Date.now();
        state.isWaiting = false;
        state.startTime = now;
        setIsWaiting(false);
        setStartTime(now);
        
        // If they pressed a key to start, and it doesn't match the first char,
        // we only skip it if it's a generic trigger like Space or Enter.
        // Otherwise, we fall through to process it as a (possibly wrong) first character.
        if (key !== target[0] && (key === " " || key === "Enter")) {
          return;
        }
      } else {
        // Ignore modifiers like Shift, Alt, etc.
        return;
      }
    }

    const expected = target[currentInput.length];
    
    // Safety check: don't process if we're past the end
    if (currentInput.length >= target.length) return;

    if (key === expected) {
      const nextInput = currentInput + key;
      state.userInput = nextInput;
      setUserInput(nextInput);
      setIsError(false);

      if (nextInput.length === target.length) {
        const now = Date.now();
        state.isFinished = true;
        setEndTime(now);
        setIsFinished(true);
        
        const effectiveStartTime = state.startTime || now;
        const wpmVal = calculateWpm(nextInput.length, effectiveStartTime, now);
        const accuracyVal = calculateAccuracy(nextInput.length, nextInput.length + state.errors);
        
        onCompleteRef.current?.({
          wpm: wpmVal,
          accuracy: accuracyVal,
          errorCount: state.errors,
          duration: Math.floor((now - effectiveStartTime) / 1000)
        });
      }
    } else {
      // Only count errors for character-producing keys that aren't the expected one
      // We ignore non-character keys like Shift, Ctrl, etc. (handled by length check)
      if (key.length === 1) {
        state.errors += 1;
        setErrors(state.errors);
        setIsError(true);
      }
    }
  }, [calculateWpm, calculateAccuracy]); // stable dependencies

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
