import { motion } from 'framer-motion';

import car1 from '../assets/cars/car1.png.png';
import car2 from '../assets/cars/car2.png.png';
import car3 from '../assets/cars/car3.png';
import car4 from '../assets/cars/car4.png.png';
import car5 from '../assets/cars/car5.png.png';
import car6 from '../assets/cars/car6.png.png';
import car7 from '../assets/cars/car7.png.png';

// Exactly 7 cars in order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
const carAssets = [
  { id: 1, name: 'Executive Luxury Sedan', src: car1 },
  { id: 2, name: 'Premium Dynamic SUV', src: car2 },
  { id: 3, name: 'Grand Tourer Performance Coupe', src: car3 },
  { id: 4, name: 'Prestige Flagship Sedan', src: car4 },
  { id: 5, name: 'High-Performance Sport Sedan', src: car5 },
  { id: 6, name: 'Modern Dynamic SUV', src: car6 },
  { id: 7, name: 'All-Terrain Adventure SUV', src: car7 },
];

// Duplicate the sequence once so when Group A exits, Group B is entering seamlessly.
// Translating from 0% to -50% creates a mathematically flawless, infinite, gapless loop.
const TRACK_CARS = [
  ...carAssets.map((car) => ({ ...car, trackKey: `grpA-${car.id}` })),
  ...carAssets.map((car) => ({ ...car, trackKey: `grpB-${car.id}` })),
];

export default function AnimatedCarShowcase({ className = '' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-tr from-blue-400/15 via-sky-300/10 to-transparent blur-2xl"
      />

      {/* Inner Circular Showcase Window (Dark Blue #051529 with #2F80ED Border) */}
      <div
        className="relative w-[290px] h-[290px] sm:w-[360px] sm:h-[360px] lg:w-[410px] lg:h-[410px] aspect-square rounded-full overflow-hidden border-2 border-[#2F80ED] bg-[#051529] shadow-[0_20px_50px_rgba(5,21,41,0.35),0_4px_16px_rgba(0,0,0,0.1)] flex items-end justify-start pointer-events-none select-none"
      >
        {/* Road horizon & ground surface inside the circle */}
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-black/50 via-[#0a2342]/30 to-transparent pointer-events-none" />

        {/* Soft radial atmospheric backlight for automotive pop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(47,128,237,0.22)_0%,transparent_65%)] pointer-events-none" />

        {/* Continuous 7-Car Infinite Conveyor Track */}
        <motion.div
          className="flex flex-nowrap items-end will-change-transform pointer-events-none pb-2 sm:pb-3 lg:pb-4"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            duration: 42, // ~6s smooth cruising per car across the window
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          {TRACK_CARS.map((car, index) => (
            <div
              key={car.trackKey}
              className="shrink-0 flex flex-col items-center mr-16 sm:mr-20 lg:mr-24"
            >
              {/* Vehicle Body with Micro-Suspension & Realistic Grounding */}
              <motion.div
                animate={{
                  y: [0, -1.2, 0.8, -1.0, 0],
                  rotate: [0, -0.2, 0.15, -0.1, 0],
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: (index % 7) * 0.22, // Staggered suspension so cars feel like living vehicles
                }}
                className="relative w-[360px] sm:w-[440px] lg:w-[500px] flex flex-col items-center"
              >
                {/* Photorealistic Sharp Vehicle Sprite */}
                <img
                  src={car.src}
                  alt={car.name}
                  className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-md"
                  loading="eager"
                  draggable={false}
                />

                {/* Realistic Multi-Layered Dynamic Ground Shadow following the vehicle */}
                <div className="w-[88%] flex flex-col items-center -mt-2.5 sm:-mt-3.5">
                  {/* Contact wheel shadow (darker, tighter under tires) */}
                  <motion.div
                    animate={{
                      scaleX: [0.98, 1.01, 0.98],
                      opacity: [0.75, 0.85, 0.75],
                    }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: (index % 7) * 0.22,
                    }}
                    className="w-[86%] h-3 sm:h-4 bg-slate-950/50 blur-[3px] rounded-full"
                  />
                  {/* Diffused chassis shadow (softer ambient spread on the road) */}
                  <div className="w-[96%] h-5 sm:h-7 bg-slate-900/25 blur-lg rounded-full -mt-1.5 sm:-mt-2" />
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
