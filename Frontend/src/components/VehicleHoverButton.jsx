import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import hotwheel from "../assets/hotwheel.png";

export default function VehicleHoverButton({ href, className, variant, children }) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 120, height: 44 });
  const [isTouchDevice] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(pointer: coarse)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (!buttonRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(buttonRef.current);
    return () => observer.disconnect();
  }, []);

  // Pre-calculate path coordinates
  const w = dimensions.width || 120;
  const h = dimensions.height || 44;

  const steps = 50;
  const xKeyframes = [];
  const yKeyframes = [];
  const rotateKeyframes = [];
  const opacityKeyframes = [];
  const scaleKeyframes = [];

  // A and B horizontal/vertical semi-axes of the elliptical arc over the top of the button
  const A = w / 2 + 12;
  const B = h / 2 + 15;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 to 1
    const theta = Math.PI - Math.PI * t; // Sweep angle from Math.PI (left) to 0 (right)

    const x = A * Math.cos(theta);
    const y = -B * Math.sin(theta); // Negative to sweep over the top of the button

    // Tangent vectors with respect to time t
    const dx = A * Math.sin(Math.PI * t);
    const dy = -B * Math.cos(Math.PI * t);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Opacity: fade in first 15%, fade out last 15%
    let opacity = 1;
    if (t < 0.15) {
      opacity = t / 0.15;
    } else if (t > 0.85) {
      opacity = (1 - t) / 0.15;
    }

    // Perspective scale: slightly smaller at the top/back peak (t=0.5, y=-B)
    const baseScale = 1.0 - 0.22 * Math.sin(Math.PI * t); // scale ranges from 1.0 (sides) to 0.78 (top peak)
    
    // Scale down to 0 at the start/end during fade
    let scaleFactor = 1;
    if (t < 0.15) {
      scaleFactor = t / 0.15;
    } else if (t > 0.85) {
      scaleFactor = (1 - t) / 0.15;
    }
    const scale = baseScale * (0.3 + 0.7 * scaleFactor);

    xKeyframes.push(x);
    yKeyframes.push(y);
    rotateKeyframes.push(angle);
    opacityKeyframes.push(opacity);
    scaleKeyframes.push(scale);
  }

  // Custom button glow styles on hover
  const glowStyle =
    variant === "signup"
      ? "shadow-[0_0_20px_rgba(47,128,237,0.35)] border-wg-blue/40"
      : "shadow-[0_0_20px_rgba(11,31,58,0.15)] border-slate-300";

  return (
    <div
      className="relative"
      onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        ref={buttonRef}
        href={href}
        className={`${className} relative z-10 transition-all ${
          isHovered ? glowStyle : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </a>

      <AnimatePresence>
        {isHovered && !isTouchDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              perspective: "500px",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                transformStyle: "preserve-3d",
                rotateX: 52, // 3D Tilt perspective angle
              }}
            >
              {/* Shadow Element underneath the car */}
              <motion.div
                className="absolute bg-black/20 blur-[2px] rounded-full"
                animate={{
                  x: xKeyframes.map((x) => x - 3), // slightly offset for visual depth
                  y: yKeyframes.map((y) => y + 4),
                  scale: scaleKeyframes.map((s) => s * 0.85),
                  opacity: opacityKeyframes,
                }}
                transition={{
                  duration: 1.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                style={{
                  width: 44,
                  height: 18,
                  left: "50%",
                  top: "50%",
                  marginLeft: -22,
                  marginTop: -9,
                }}
              />

              {/* The Car Element */}
              <motion.div
                className="absolute"
                animate={{
                  x: xKeyframes,
                  y: yKeyframes,
                  scale: scaleKeyframes,
                  opacity: opacityKeyframes,
                }}
                transition={{
                  duration: 1.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
                style={{
                  width: 52,
                  height: 35,
                  left: "50%",
                  top: "50%",
                  marginLeft: -26,
                  marginTop: -17.5,
                  transformStyle: "preserve-3d",
                  zIndex: 20, // keep in front of the button
                }}
              >
                <motion.div
                  animate={{
                    rotate: rotateKeyframes,
                  }}
                  transition={{
                    duration: 1.8,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  className="w-full h-full"
                >
                  <img
                    src={hotwheel}
                    alt="Hotwheel car"
                    className="w-full h-full object-contain"
                    style={{
                      filter:
                        variant === "signup"
                          ? "hue-rotate(135deg) saturate(1.8) brightness(0.95) drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                          : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
