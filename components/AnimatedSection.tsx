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
      viewport={{ once: true, amount: 0.2 }}
      variants={variant}
      transition={{ delay }}
      style={{ width: '100%' }}
    >
      <div className={className}>
        {children}
      </div>
    </motion.div>
  );
}
