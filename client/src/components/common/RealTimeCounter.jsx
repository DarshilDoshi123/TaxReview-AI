import React, { useState, useEffect, useRef } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';

const RealTimeCounter = ({
  initialValue = 50000,
  prefix = '',
  suffix = '',
  intervalMs = 3000,
  minIncrement = 1,
  maxIncrement = 3,
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [value, setValue] = useState(initialValue);
  const prevValueRef = useRef(0);

  useEffect(() => {
    if (!isInView) return;

    const timer = setInterval(() => {
      const inc = Math.floor(Math.random() * (maxIncrement - minIncrement + 1)) + minIncrement;
      setValue((prev) => {
        prevValueRef.current = prev;
        return Math.max(10, prev + inc);
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isInView, intervalMs, minIncrement, maxIncrement]);

  return (
    <span ref={ref} className={className}>
      {isInView ? (
        <CountUp
          start={prevValueRef.current}
          end={value}
          duration={1.2}
          prefix={prefix}
          suffix={suffix}
          separator=","
          preserveValue={true}
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
};

export default RealTimeCounter;
