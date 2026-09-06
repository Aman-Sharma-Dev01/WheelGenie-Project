
import { useState } from "react";
import { motion } from "framer-motion";
import { useResponsive } from "../context/ResponsiveContext";
import { Lightbulb, Shield, BookOpen, Rocket } from "lucide-react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CoreFeatures from "../components/CoreFeatures";
import StatsSection from "../components/StatsSection";
import Footer from "../components/Footer";

// Import Assets
import carImage from "../assets/car.png";
import ceoImage from "../assets/ceoimage.png";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";

// Team Data
const teamMembers = [
  {
    name: "Meenakshi Sharma",
    role: "Head of Marketing & Sales",
    image: img1,
    accent: "blue",
    glowColor: "rgba(47, 128, 237, 0.25)",
    borderColor: "hover:border-wg-blue/50",
  },
  {
    name: "Navneet Kaur Bhatia",
    role: "Head of Admin",
    image: img2,
    accent: "green",
    glowColor: "rgba(39, 174, 96, 0.25)",
    borderColor: "hover:border-wg-green/50",
  },
  {
    name: "Rinku Gandhi",
    role: "Head of Finance",
    image: img3,
    accent: "purple",
    glowColor: "rgba(124, 58, 237, 0.25)",
    borderColor: "hover:border-wg-purple/50",
  },
  {
    name: "Harvinder Singh",
    role: "Head of Operations",
    image: img4,
    accent: "navy",
    glowColor: "rgba(11, 31, 58, 0.25)",
    borderColor: "hover:border-wg-navy/50",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};


export default function Home() {
  const { isDesktop } = useResponsive();

  const [hoveredMember, setHoveredMember] = useState(null);
  const [activeMember, setActiveMember] = useState(null);

  const [activeCard, setActiveCard] = useState(null);
  const [glassCard, setGlassCard] = useState(null);

  const handleCardClick = (name) => {
    if (!isDesktop) {
      setActiveMember((prev) => (prev === name ? null : name));
    }

    // Trigger flip
    setActiveCard(name);

    // Remove glass while flipping
    setGlassCard(null);

    // Show glass after flip
    setTimeout(() => {
      setGlassCard(name);
    }, 400);
  };

  const handleMouseEnter = (name) => {
    if (isDesktop) {
      setHoveredMember(name);
    }
  };

  const handleMouseLeave = () => {
    if (isDesktop) {
      setHoveredMember(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30">
      <Navbar activePage="about" />

      <main className="overflow-hidden">
        {/* Core Main Sections */}
        <Hero />
        <CoreFeatures />
        <StatsSection />




{/* Story & Mission Section */}
<section className="wg-container py-16 relative">

  {/* Connector Line in desktop */}
  <div className="pointer-events-none absolute left-1/2 top-[42%] z-0 hidden h-[2px] w-[120px] -translate-x-1/2 -translate-y-1/2 md:block">
    <svg
      width="100%"
      height="10"
      viewBox="0 0 120 10"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0,5 C40,5 40,5 60,5 C80,5 80,5 120,5"
        stroke="#2F80ED"
        strokeWidth="2"
        strokeDasharray="4 4"
      />
      <circle
        cx="114"
        cy="5"
        r="4"
        fill="#27AE60"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  </div>

  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="grid gap-8 md:grid-cols-2 relative z-10"
  >

    {/* =====================================================
        OUR STORY
    ====================================================== */}

    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => handleCardClick("story")}
      animate={{
        rotateY:
          activeCard === "story"
            ? [0, 88, 0]
            : 0,
      }}
      transition={{
        rotateY: {
          duration: 0.7,
          times: [0, 0.5, 1],
          ease: [0.45, 0, 0.55, 1],
        },
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1200px",
      }}
      className={`
        group relative rounded-3xl
        p-8 pb-10
        flex flex-col justify-between
        min-h-[500px]
        cursor-pointer
        overflow-visible

        border
        transition-all duration-500 ease-out

        ${
          glassCard === "story"
            ? `
              border-[#155DFC]/70
              bg-[rgba(21,93,252,0.10)]
              backdrop-blur-2xl
              shadow-[0_25px_70px_rgba(21,93,252,0.20)]
            `
            : `
              border-blue-100
              bg-white/80
              shadow-[0_8px_30px_rgba(47,128,237,0.06)]
            `
        }
      `}
    >

      {/* =====================================================
          GLASSMORPHISM LIGHT — STORY
      ====================================================== */}

      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: glassCard === "story" ? 1 : 0,
        }}
        transition={{
          duration: 0.5,
          delay: glassCard === "story" ? 0.05 : 0,
        }}
      >

        {/* Large flowing glass light */}
        <motion.div
          className="absolute -left-1/3 -top-1/2 h-[180%] w-[65%] rotate-[25deg] rounded-full blur-3xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(21,93,252,0.22), transparent)",
          }}
          animate={
            glassCard === "story"
              ? {
                  x: ["-30%", "220%"],
                }
              : {
                  x: "-30%",
                }
          }
          transition={{
            duration: 2.2,
            ease: "easeInOut",
          }}
        />

        {/* Corner glow */}
        <div
          className="absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
          style={{
            background: "rgba(21,93,252,0.20)",
          }}
        />

        {/* Bottom glow */}
        <div
          className="absolute -bottom-32 left-1/4 h-64 w-64 rounded-full blur-3xl"
          style={{
            background: "rgba(21,93,252,0.10)",
          }}
        />

        {/* Glass reflection */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/55 via-transparent to-[#155DFC]/10" />

        {/* Inner glass border */}
        <div
          className="absolute inset-[1px] rounded-[23px] border pointer-events-none"
          style={{
            borderColor: "rgba(21,93,252,0.20)",
          }}
        />
      </motion.div>


      {/* =====================================================
          STORY CONTENT
      ====================================================== */}

      <div className="relative z-10">

        {/* Header */}
        <div className="flex justify-between items-start">

          <div>

            {/* Badge */}
            <motion.span
              animate={{
                scale: glassCard === "story" ? [1, 1.08, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#155DFC] text-white font-bold text-sm shadow-[0_4px_14px_rgba(21,93,252,0.30)]"
            >
              01
            </motion.span>

            {/* Subtitle */}
            <div className="mt-4 flex flex-col">

              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#155DFC]">
                Our Story
              </span>

              <motion.span
                animate={{
                  width: glassCard === "story" ? 48 : 32,
                }}
                transition={{ duration: 0.4 }}
                className="mt-1.5 h-[2px] bg-[#155DFC]"
              />

            </div>

            <h2 className="wg-heading mt-3 text-3xl font-extrabold tracking-tight text-wg-navy">
              Our Story
            </h2>

          </div>


          {/* Car */}
          <div className="relative h-[110px] w-[140px] shrink-0 self-start mt-2">

            <div className="absolute inset-0 flex items-center justify-center">

              <motion.div
                animate={{
                  scale: glassCard === "story" ? 1.06 : 1,
                  opacity: glassCard === "story" ? 1 : 0.9,
                }}
                transition={{ duration: 0.5 }}
                className="h-[96px] w-[96px] rounded-full border border-blue-100 flex items-center justify-center"
              >
                <div className="h-[74px] w-[74px] rounded-full border border-blue-50 bg-blue-50/20" />
              </motion.div>

            </div>

            <motion.img
              src={carImage}
              alt="Blue Car Illustration"
              animate={{
                y: glassCard === "story" ? [0, -5, 0] : 0,
              }}
              transition={{
                duration: 1.8,
                repeat: glassCard === "story" ? Infinity : 0,
                ease: "easeInOut",
              }}
              className="absolute left-1/2 top-1/2 h-auto w-full max-w-[125px] -translate-x-1/2 -translate-y-1/2 object-contain"
              style={{
                filter:
                  "hue-rotate(190deg) saturate(2.4) brightness(0.85)",
                filterDropShadow:
                  "0 8px 12px rgba(21,93,252,0.18)",
              }}
            />

          </div>

        </div>


        {/* Body */}
        <div className="mt-6 space-y-3.5 text-[14px] leading-relaxed text-slate-500 font-medium">

          <p>
            Founded by a group of automotive enthusiasts and technology experts,
            Wheel Genie was born out of a shared frustration with the traditional
            vehicle buying, selling, and maintenance processes.
          </p>

          <p>
            We knew there had to be a better way – a way that empowers individuals
            with knowledge, simplifies transactions, and connects them with
            trustworthy professionals.
          </p>

        </div>

      </div>


      {/* =====================================================
          STORY HIGHLIGHT
      ====================================================== */}

      <motion.div
        animate={{
          backgroundColor:
            glassCard === "story"
              ? "rgba(21,93,252,0.12)"
              : "rgba(239,246,255,0.25)",
          borderColor:
            glassCard === "story"
              ? "rgba(21,93,252,0.25)"
              : "rgba(191,219,254,0.50)",
        }}
        transition={{ duration: 0.5 }}
        className="mt-8 rounded-2xl border p-4.5 flex gap-3.5 items-start relative z-10 backdrop-blur-xl"
      >

        <Lightbulb
          size={20}
          className="text-[#155DFC] shrink-0 mt-0.5"
        />

        <p className="text-[13.5px] leading-relaxed text-slate-600 font-medium">

          We built WheelGenie to centralize and transparently manage{" "}

          <span className="font-semibold text-[#155DFC]">
            vehicle buying, selling, and valuation
          </span>

          —all backed by{" "}

          <span className="font-semibold text-[#155DFC]">
            state-of-the-art AI technology.
          </span>

        </p>

      </motion.div>


      {/* Floating Indicator */}
      <motion.div
        animate={{
          scale: glassCard === "story" ? [1, 1.12, 1] : 1,
          boxShadow:
            glassCard === "story"
              ? "0 0 25px rgba(21,93,252,0.45)"
              : "0 4px 10px rgba(0,0,0,0.12)",
        }}
        transition={{
          duration: 0.8,
          repeat: glassCard === "story" ? Infinity : 0,
          repeatType: "reverse",
        }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-10 w-10 bg-[#155DFC] rounded-full flex items-center justify-center text-white border-4 border-white z-20"
      >
        <BookOpen size={16} />
      </motion.div>

    </motion.div>


    {/* =====================================================
        OUR MISSION
    ====================================================== */}

    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => handleCardClick("mission")}
      animate={{
        rotateY:
          activeCard === "mission"
            ? [0, 88, 0]
            : 0,
      }}
      transition={{
        rotateY: {
          duration: 0.7,
          times: [0, 0.5, 1],
          ease: [0.45, 0, 0.55, 1],
        },
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1200px",
      }}
      className={`
        group relative rounded-3xl
        p-8 pb-10
        flex flex-col justify-between
        min-h-[500px]
        cursor-pointer
        overflow-visible
        border
        transition-all duration-500 ease-out

        ${
          glassCard === "mission"
            ? `
              border-[#00A63E]/70
              bg-[rgba(0,166,62,0.10)]
              backdrop-blur-2xl
              shadow-[0_25px_70px_rgba(0,166,62,0.20)]
            `
            : `
              border-green-100
              bg-white/80
              shadow-[0_8px_30px_rgba(39,174,96,0.06)]
            `
        }
      `}
    >

      {/* =====================================================
          GLASSMORPHISM LIGHT — MISSION
      ====================================================== */}

      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: glassCard === "mission" ? 1 : 0,
        }}
        transition={{
          duration: 0.5,
          delay: glassCard === "mission" ? 0.05 : 0,
        }}
      >

        {/* Flowing green light */}
        <motion.div
          className="absolute -left-1/3 -top-1/2 h-[180%] w-[65%] rotate-[25deg] rounded-full blur-3xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,166,62,0.22), transparent)",
          }}
          animate={
            glassCard === "mission"
              ? {
                  x: ["-30%", "220%"],
                }
              : {
                  x: "-30%",
                }
          }
          transition={{
            duration: 2.2,
            ease: "easeInOut",
          }}
        />

        {/* Corner glow */}
        <div
          className="absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
          style={{
            background: "rgba(0,166,62,0.20)",
          }}
        />

        {/* Bottom glow */}
        <div
          className="absolute -bottom-32 left-1/4 h-64 w-64 rounded-full blur-3xl"
          style={{
            background: "rgba(0,166,62,0.10)",
          }}
        />

        {/* Glass reflection */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/55 via-transparent to-[#00A63E]/10" />

        {/* Inner glass border */}
        <div
          className="absolute inset-[1px] rounded-[23px] border pointer-events-none"
          style={{
            borderColor: "rgba(0,166,62,0.20)",
          }}
        />

      </motion.div>


      {/* =====================================================
          MISSION CONTENT
      ====================================================== */}

      <div className="relative z-10">

        <div className="flex justify-between items-start">

          <div>

            {/* Badge */}
            <motion.span
              animate={{
                scale: glassCard === "mission" ? [1, 1.08, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00A63E] text-white font-bold text-sm shadow-[0_4px_14px_rgba(0,166,62,0.30)]"
            >
              02
            </motion.span>


            {/* Subtitle */}
            <div className="mt-4 flex flex-col">

              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00A63E]">
                Our Mission
              </span>

              <motion.span
                animate={{
                  width: glassCard === "mission" ? 48 : 32,
                }}
                transition={{ duration: 0.4 }}
                className="mt-1.5 h-[2px] bg-[#00A63E]"
              />

            </div>


            <h2 className="wg-heading mt-3 text-3xl font-extrabold tracking-tight text-wg-navy">
              Our Mission
            </h2>

          </div>


          {/* Target Illustration */}
          <div className="relative h-[110px] w-[140px] shrink-0 self-start mt-2">

            <motion.div
              animate={{
                scale: glassCard === "mission" ? [1, 1.06, 1] : 1,
              }}
              transition={{
                duration: 1.8,
                repeat: glassCard === "mission" ? Infinity : 0,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >

              <svg
                width="105"
                height="105"
                viewBox="0 0 100 100"
                className="opacity-95"
              >

                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#E8F8F0"
                  strokeWidth="5"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="31"
                  fill="none"
                  stroke="#D1F2EB"
                  strokeWidth="4"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="rgba(0,166,62,0.05)"
                  stroke="#00A63E"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="10"
                  fill="#00A63E"
                />

                <path
                  d="M12,88 L43,57"
                  stroke="#00A63E"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <polygon
                  points="43,57 35,53 39,49"
                  fill="#00A63E"
                />

              </svg>

            </motion.div>

          </div>

        </div>


        {/* Body */}
        <div className="mt-6 space-y-3.5 text-[14px] leading-relaxed text-slate-500 font-medium">

          <p>
            Our mission is to transform the vehicle landscape in Canada.
            We believe that every transaction, whether buying, selling, or
            maintaining a vehicle, should be characterized by fairness,
            transparency, and convenience.
          </p>

          <p>
            We’re committed to providing an inclusive platform that caters
            to all types of vehicles and all levels of expertise, bridging
            the gap between enthusiasts and experts.
          </p>

        </div>

      </div>


      {/* =====================================================
          MISSION HIGHLIGHT
      ====================================================== */}

      <motion.div
        animate={{
          backgroundColor:
            glassCard === "mission"
              ? "rgba(0,166,62,0.12)"
              : "rgba(240,253,244,0.25)",
          borderColor:
            glassCard === "mission"
              ? "rgba(0,166,62,0.25)"
              : "rgba(187,247,208,0.50)",
        }}
        transition={{ duration: 0.5 }}
        className="mt-8 rounded-2xl border p-4.5 flex gap-3.5 items-start relative z-10 backdrop-blur-xl"
      >

        <Shield
          size={20}
          className="text-[#00A63E] shrink-0 mt-0.5"
        />

        <p className="text-[13.5px] leading-relaxed text-slate-600 font-medium">

          With accurate calculations, quality listings, and verified
          operations, we ensure every transaction is{" "}

          <span className="font-semibold text-[#00A63E]">
            rewarding, reliable, and completely smooth.
          </span>

        </p>

      </motion.div>


      {/* Floating Indicator */}
      <motion.div
        animate={{
          scale: glassCard === "mission" ? [1, 1.12, 1] : 1,
          boxShadow:
            glassCard === "mission"
              ? "0 0 25px rgba(0,166,62,0.45)"
              : "0 4px 10px rgba(0,0,0,0.12)",
        }}
        transition={{
          duration: 0.8,
          repeat: glassCard === "mission" ? Infinity : 0,
          repeatType: "reverse",
        }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-10 w-10 bg-[#00A63E] rounded-full flex items-center justify-center text-white border-4 border-white z-20"
      >
        <Rocket size={16} />
      </motion.div>

    </motion.div>

  </motion.div>
</section>



        {/* CEO Message Banner Section (Matches Shared Reference Image Bottom Banner Exactly) */}
        <section className="wg-container py-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid overflow-hidden rounded-3xl border border-slate-200/50 bg-[#041527] shadow-[0_20px_50px_rgba(4,21,39,0.15)] lg:grid-cols-[1.3fr_0.7fr]"
          >
            {/* Left Side: Dark Navy Quote & Message Block */}
            <div className="relative flex flex-col justify-center px-8 py-14 text-white sm:px-14 lg:py-16">
              
              {/* Highway Curves SVG Background Perspective Line Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.08] z-0">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Perspective Highway Lines */}
                  <path d="M 0,100 C 35,95 50,55 52,0" fill="none" stroke="white" strokeWidth="5" />
                  <path d="M 12,100 C 42,95 53,55 54,0" fill="none" stroke="#2F80ED" strokeWidth="3" />
                  <path d="M 28,100 C 50,95 58,55 58,0" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M 45,100 C 60,95 63,55 62,0" fill="none" stroke="white" strokeWidth="3" />
                  <path d="M 100,100 C 75,95 68,55 66,0" fill="none" stroke="white" strokeWidth="5" />
                </svg>
              </div>

              {/* Blue Quote Mark */}
              <div className="absolute top-6 left-6 text-[110px] font-serif text-[#2F80ED] leading-none select-none opacity-35 z-0">
                “
              </div>

              <div className="relative z-10 max-w-[580px]">
                {/* Big Quote Headline */}
                <h2 className="wg-heading text-2xl sm:text-3.5xl font-extrabold tracking-tight leading-tight text-white">
                  At WheelGenie, we don't just move cars. We move lives <span className="text-[#2F80ED]">forward.</span>
                </h2>

                <p className="mt-3 text-xs sm:text-[13px] font-semibold text-slate-400 uppercase tracking-widest">
                  Thank you for trusting us to be part of your journey.
                </p>

                {/* Section Separator */}
                <div className="my-6 border-b border-white/10" />

                {/* Welcome Message Text Block */}
                <div className="space-y-4 text-[14px] leading-relaxed text-slate-300 font-medium">
                  <p className="text-white font-semibold text-base">
                    Welcome to WheelGenie!
                  </p>

                  <p>
                    As an automotive enthusiast, I’ve experienced the challenges of buying, selling, and maintaining vehicles. That’s why I founded Wheel Genie—to revolutionize the vehicle experience.
                  </p>

                  <p>
                    With our transparent bidding process, we’re changing how vehicles are bought and sold. Our commitment to quality ensures you’re getting the best. And our expert mechanics are here to guide you.
                  </p>

                  <p>
                    Join us as we reshape the automotive world. Welcome to Wheel Genie, where vehicles meet convenience and expertise.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Light Card Layout with Portrait & Handwritten Signature */}
            <div className="relative flex flex-col items-center justify-center bg-slate-50/90 px-8 py-14 text-center lg:py-16">
              
              {/* Backing Orange Crescent Ornament */}
              <div className="absolute right-[5%] top-[10%] h-[120px] w-[120px] rounded-full border-t-[20px] border-r-[20px] border-orange-500 opacity-90 blur-[0.2px] select-none" />

              {/* CEO Portrait with slight frame border */}
              <div className="relative z-10 h-[190px] w-[190px] overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
                <img
                  src={ceoImage}
                  alt="Harminder Singh"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* CEO Details */}
              <div className="relative z-10 mt-6">
                <h3 className="wg-heading text-xl font-bold leading-snug text-wg-navy">
                  Harminder Singh
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Founder & CEO, WheelGenie
                </p>
              </div>

              {/* Handwritten signature using 'Great Vibes' Google Font */}
              <div 
                className="relative z-10 mt-5 text-[#2F80ED] select-none"
                style={{ 
                  fontFamily: "'Great Vibes', cursive", 
                  fontSize: "2.3rem",
                  fontWeight: "normal",
                  transform: "rotate(-4deg)"
                }}
              >
                Harminder Singh
              </div>

            </div>
          </motion.div>
        </section>

        {/* Team Section (Matches Reference Image 3) */}
        <section className="relative py-14 pb-20">
          <div className="wg-container">
            
            {/* Team Header */}
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-wg-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50">
                Our Team
              </span>

              <h2 className="wg-heading mt-4 text-3xl font-bold tracking-tight text-wg-navy sm:text-4xl">
                People Behind WheelGenie
              </h2>

              <p className="mx-auto mt-4 max-w-[700px] text-sm leading-relaxed text-slate-500 sm:text-base">
                Meet the ingenious creators at 'People Behind WheelGenie', driving innovation in automotive solutions, redefining driving experiences with their cutting-edge technologies and services.
              </p>
            </div>

            {/* Team Cards Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {teamMembers.map((member) => {
                const isHighlighted = isDesktop
                  ? hoveredMember === member.name
                  : activeMember === member.name;

                return (
                  <motion.div
                    key={member.name}
                    variants={itemVariants}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98, y: -2 }}
                    transition={{ duration: 0.3 }}
                    onTap={() => handleCardClick(member.name)}
                    onMouseEnter={() => handleMouseEnter(member.name)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      "--hover-glow": "rgba(1, 40, 78, 0.25)",
                    }}
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      p-4
                      sm:p-6
                      text-center
                      backdrop-blur-md
                      transition-all
                      duration-300
                      ease-in-out
                      cursor-pointer
                      ${
                        isHighlighted
                          ? "bg-[#01284E] border-[#01284E] shadow-[0_12px_28px_rgba(1,40,78,0.25)]"
                          : "bg-white border-slate-200/50 shadow-[0_4px_18px_rgba(11,31,58,0.015)]"
                      }
                    `}
                  >
                    {/* Decorative corner element */}
                    <div className={`absolute top-0 right-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full transition-colors duration-300 ${
                      isHighlighted
                        ? "bg-white/5"
                        : "bg-slate-50/50"
                    }`} />

                    {/* Profile Image Frame with hover scale */}
                    <div className={`relative mx-auto h-[130px] w-[130px] sm:h-[160px] sm:w-[160px] overflow-hidden rounded-full border-4 bg-slate-50 shadow-inner group-hover:scale-105 transition-all duration-300 ${
                      isHighlighted
                        ? "border-white"
                        : "border-slate-100"
                    }`}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Member Name */}
                    <h3 className={`wg-heading mt-4 sm:mt-5 text-base sm:text-lg font-bold leading-snug transition-colors duration-200 ${
                      isHighlighted
                        ? "text-white"
                        : "text-wg-navy"
                    }`}>
                      {member.name}
                    </h3>

                    {/* Member Role */}
                    <p className={`mt-1 text-xs font-medium uppercase tracking-wide transition-colors duration-200 ${
                      isHighlighted
                        ? "text-[#AAB8C8]"
                        : "text-slate-500"
                    }`}>
                      {member.role}
                    </p>

                    {/* Divider */}
                    <div className={`my-3 sm:my-4 mx-auto w-12 border-t transition-all duration-300 ${
                      isHighlighted
                        ? "border-[#AAB8C8]/40 w-16"
                        : "border-slate-100"
                    }`} />

                    {/* Hover effect light glow */}
                    <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-wg-blue to-transparent transition-opacity duration-300 ${
                      isHighlighted
                        ? "opacity-100"
                        : "opacity-0"
                    }`} />
                  </motion.div>
                );
              })}
            </motion.div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}