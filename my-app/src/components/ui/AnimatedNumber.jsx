import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({ value, duration = 600 }) {
  const [displayValue, setDisplayValue] = useState(value);
  const startValue = useRef(value);
  const startTime = useRef(null);

  useEffect(() => {
    startValue.current = displayValue;
    startTime.current = null;

    const animate = (time) => {
      if (!startTime.current) startTime.current = time;
      const progress = Math.min((time - startTime.current) / duration, 1);

      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = Math.round(
        startValue.current +
          (value - startValue.current) * eased
      );

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className="tabular-nums">{displayValue}</span>
  );
}
