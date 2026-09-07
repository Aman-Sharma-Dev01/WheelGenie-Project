import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import car1 from '../assets/cars/car1_white_sedan.png';
import car2 from '../assets/cars/car2_gray_suv.png';
import car3 from '../assets/cars/car3_white_coupe.png';
import car4 from '../assets/cars/car4_executive_sedan.png';
import car5 from '../assets/cars/car5_red_sports.png';

export const carAssets = [
  { id: 1, name: 'Executive Luxury Sedan', src: car1 },
  { id: 2, name: 'Premium Dynamic SUV', src: car2 },
  { id: 3, name: 'Grand Tourer Coupe', src: car3 },
  { id: 4, name: 'Prestige Flagship Sedan', src: car4 },
  { id: 5, name: 'High-Performance Sport Sedan', src: car5 },
];

export default function AnimatedCarShowcase({ className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const currentCar = carAssets[currentIndex];

  const handleCarExit = () => {
    // Quick 200ms transition before next car enters
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % carAssets.length);
      setAnimKey((prev) => prev + 1);
    }, 200);
  };

  return (
    <div
      className={`relative w-full h-[220px] sm:h-[280px] lg:h-[320px] overflow-hidden flex items-center justify-center pointer-events-none ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={animKey}
          initial={{ x: '-130%', opacity: 0 }}
          animate={{
            x: '135%',
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: 4.2,
            ease: 'easeInOut',
            times: [0, 0.04, 0.5, 0.96, 1],
          }}
          onAnimationComplete={handleCarExit}
          className="absolute left-0 w-full flex flex-col items-center justify-center will-change-transform pointer-events-none"
        >
          {/* Pure Transparent Car Sprite */}
          <div className="relative w-[320px] sm:w-[460px] lg:w-[520px] flex flex-col items-center">
            <img
              src={currentCar.src}
              alt={currentCar.name}
              className="w-full h-auto object-contain select-none"
              loading="eager"
            />

            {/* Subtle soft contact shadow under wheels */}
            <div className="w-[82%] h-2.5 bg-slate-900/20 blur-md rounded-full -mt-2" />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
