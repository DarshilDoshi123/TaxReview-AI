import React from 'react';
import { motion } from 'framer-motion';

export const variantsMap = {
  'fade-up': {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-down': {
    hidden: { opacity: 0, y: -24 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-left': {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  'fade-right': {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 },
  },
  'scale-in': {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
};

const AnimatedSection = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}) => {
  const selectedVariant = variantsMap[variant] || variantsMap['fade-up'];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      variants={selectedVariant}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedStaggerContainer = ({
  children,
  staggerChildren = 0.1,
  delayChildren = 0,
  className = '',
  ...props
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedStaggerItem = ({
  children,
  variant = 'fade-up',
  className = '',
  ...props
}) => {
  const selectedVariant = variantsMap[variant] || variantsMap['fade-up'];

  return (
    <motion.div
      variants={selectedVariant}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
