import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';

const AnimatedCounter = ({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // Parse numerical value from string if end contains letters/commas
  const numericVal = typeof end === 'number' ? end : parseFloat(String(end).replace(/[^0-9.]/g, '')) || 0;

  return (
    <span ref={ref} className={className}>
      {isInView ? (
        <CountUp
          key={`${isInView}-${numericVal}`}
          start={0}
          end={numericVal}
          duration={duration}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          separator=","
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
};

export default AnimatedCounter;
