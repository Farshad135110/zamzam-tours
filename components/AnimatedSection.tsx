import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeInUp, fadeIn, fadeInLeft, fadeInRight, scaleIn } from '../src/utils/animations';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
  delay?: number;
  className?: string;
}

const animationVariants = {
  fadeIn,
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn
};

export default function AnimatedSection({
  children,
  animation = 'fadeInUp',
  delay = 0,
  className = ''
}: AnimatedSectionProps) {
  const variant = animationVariants[animation];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
      variants={variant}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      style={{ width: '100%', willChange: 'transform, opacity' }}
    >
      <div className={className}>
        {children}
      </div>
    </motion.div>
  );
}
