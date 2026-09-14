import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import car1 from '../assets/cars/car1.png.png';
import car2 from '../assets/cars/car2.png.png';
import car3 from '../assets/cars/car3.png';
import car4 from '../assets/cars/car4.png.png';
import car5 from '../assets/cars/car5.png.png';
import car6 from '../assets/cars/car6.png.png';
import car7 from '../assets/cars/car7.png.png';

const carAssets = [
  { id: 1, name: 'High-Performance Sport Sedan', src: car5 },
  { id: 2, name: 'Premium Dynamic SUV', src: car2 },
  { id: 3, name: 'Grand Tourer Performance Coupe', src: car3 },
  { id: 4, name: 'Executive Luxury Sedan', src: car1 },
  { id: 5, name: 'Prestige Flagship Sedan', src: car4 },
  { id: 6, name: 'Modern Dynamic SUV', src: car6 },
  { id: 7, name: 'All-Terrain Adventure SUV', src: car7 },
];

export default function AnimatedCarShowcase({ className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDriving, setIsDriving] = useState(true);

  const currentCar = carAssets[currentIndex];

  const handleDriveComplete = () => {
    // Clean transition pause (700ms) before the next vehicle enters from the right
    setIsDriving(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % carAssets.length);
      setIsDriving(true);
    }, 700);
  };

  return (
    <div
      className={`relative w-full h-[220px] sm:h-[260px] lg:h-[300px] overflow-hidden flex items-end justify-center pointer-events-none select-none pb-3 sm:pb-5 ${className}`}
    >
      {/* Subtle invisible road horizon / soft ambient ground reflection */}
      <div className="absolute inset-x-0 bottom-4 sm:bottom-6 h-12 bg-gradient-to-t from-slate-200/20 via-blue-50/15 to-transparent pointer-events-none" />

      {/* Soft atmospheric blue backlight for WheelGenie identity */}
      <div className="absolute right-1/4 bottom-8 w-72 h-24 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {isDriving && (
          <motion.div
            key={currentIndex}
            initial={{ x: '125%' }}
            animate={{ x: '-125%' }}
            transition={{
              duration: 2.2,
              ease: [0.25, 0.1, 0.25, 1.0], // Natural automotive cruising momentum
            }}
            onAnimationComplete={handleDriveComplete}
            className="absolute bottom-3 sm:bottom-5 will-change-transform pointer-events-none flex flex-col items-center"
          >
            {/* Vehicle Body with Micro-Suspension & Realistic Grounding */}
            <motion.div
              animate={{
                y: [0, -1.2, 0.8, -1.0, 0],
                rotate: [0, -0.2, 0.15, -0.1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-[300px] sm:w-[390px] lg:w-[450px] flex flex-col items-center"
            >
              {/* Photorealistic Sharp Vehicle Sprite */}
              <img
                src={currentCar.src}
                alt={currentCar.name}
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
                loading="eager"
              />

              {/* Realistic Multi-Layered Dynamic Ground Shadow following the vehicle */}
              <div className="w-[88%] flex flex-col items-center -mt-2 sm:-mt-3">
                {/* Contact wheel shadow (darker, tighter under tires) */}
                <motion.div
                  animate={{
                    scaleX: [0.98, 1.01, 0.98],
                    opacity: [0.75, 0.85, 0.75],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-[84%] h-2 sm:h-2.5 bg-slate-950/40 blur-[3px] rounded-full"
                />
                {/* Diffused chassis shadow (softer ambient spread on the road) */}
                <div className="w-[94%] h-3.5 sm:h-4.5 bg-slate-900/15 blur-md rounded-full -mt-1 sm:-mt-1.5" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
