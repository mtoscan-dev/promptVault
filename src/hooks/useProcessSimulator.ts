import { useState, useRef, useCallback, useEffect } from "react";

interface ProcessSimulatorOptions {
  minDuration?: number; // Minimum time in ms to ensure messages are seen
}

export function useProcessSimulator() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // We use refs for timing to avoid re-renders just for logic
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startProcess = useCallback(
    async <T>(
      messages: string[],
      processFunction: () => Promise<T>,
      options: ProcessSimulatorOptions = {},
    ): Promise<T> => {
      // Reset State
      setIsProcessing(true);
      setExecutionTime(null);
      startTimeRef.current = Date.now();

      const minDuration = options.minDuration ?? 1500;
      const stepInterval = Math.max(minDuration / messages.length, 300); // At least 300ms per message

      // clear any existing interval
      if (intervalRef.current) clearInterval(intervalRef.current);

      let msgIndex = 0;
      setCurrentMessage(messages[0]);

      intervalRef.current = setInterval(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        setCurrentMessage(messages[msgIndex]);
      }, stepInterval);

      try {
        // Enforce minimum duration
        const startTime = Date.now();
        const result = await processFunction();
        const elapsed = Date.now() - startTime;

        if (elapsed < minDuration) {
          await new Promise((resolve) =>
            setTimeout(resolve, minDuration - elapsed),
          );
        }

        return result;
      } finally {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const endTime = Date.now();
        const duration = (endTime - (startTimeRef.current || endTime)) / 1000;

        setExecutionTime(Number(duration.toFixed(1)));
        setIsProcessing(false);
        setCurrentMessage("");
      }
    },
    [],
  );

  return {
    isProcessing,
    currentMessage,
    executionTime,
    startProcess,
  };
}
