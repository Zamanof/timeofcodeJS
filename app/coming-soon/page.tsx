'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Martian_Mono } from 'next/font/google';

const martianMono = Martian_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="flex flex-col items-center mx-4"
  >
    <motion.div 
      className={`${martianMono.className} text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent`}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
    >
      {value.toString().padStart(2, '0')}
    </motion.div>
    <div className={`${martianMono.className} text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 font-medium`}>{label}</div>
  </motion.div>
);

const AnimatedLogo = () => {
  const bracketVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 }
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={`${martianMono.className} flex items-center justify-center space-x-2 text-6xl md:text-7xl font-bold`}
      initial="initial"
      animate="animate"
    >
      <motion.span 
        variants={bracketVariants} 
        transition={{ duration: 0.5 }}
        className="text-blue-600 dark:text-blue-400"
      >
        &lt;
      </motion.span>
      <motion.div className="flex">
        <motion.span 
          variants={textVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-black dark:text-white"
        >
          Time
        </motion.span>
        <motion.span 
          variants={textVariants}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-gray-400 dark:text-gray-500 mx-2"
        >
          of
        </motion.span>
        <motion.span 
          variants={textVariants}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-black dark:text-white"
        >
          Code
        </motion.span>
      </motion.div>
      <motion.span 
        variants={bracketVariants}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-blue-600 dark:text-blue-400"
      >
        /&gt;
      </motion.span>
    </motion.div>
  );
};

export default function Page() {
  const [mounted, setMounted] = React.useState(false);
  const [countdown, setCountdown] = React.useState({
    days: 3,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  React.useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f7fa] dark:bg-[#131516] flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <AnimatedLogo />
        </motion.div>

        {/* Main Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full overflow-x-auto scrollbar-none"
        >
          <div className={`${martianMono.className} text-2xl md:text-3xl font-bold text-black dark:text-white mb-7 text-center tracking-wider whitespace-nowrap min-w-max mx-auto`}>
            Your time. Your code. Your future.
          </div>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex justify-center items-center mb-8"
        >
          <CountdownUnit value={countdown.days} label="Days" />
          <div className={`${martianMono.className} text-4xl font-bold text-gray-400`}>:</div>
          <CountdownUnit value={countdown.hours} label="Hours" />
          <div className={`${martianMono.className} text-4xl font-bold text-gray-400`}>:</div>
          <CountdownUnit value={countdown.minutes} label="Minutes" />
          <div className={`${martianMono.className} text-4xl font-bold text-gray-400`}>:</div>
          <CountdownUnit value={countdown.seconds} label="Seconds" />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className={`${martianMono.className} text-xl text-gray-600 dark:text-gray-400 text-center max-w-lg mb-8 font-normal`}
        >
          Sizə möhtəşəm məzmun təqdim etmək üçün çox çalışırıq. Bizi izləməyə davam edin!
        </motion.div>

        {/* Background Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute -z-10 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl"
        />
      </div>
    </div>
  );
} 