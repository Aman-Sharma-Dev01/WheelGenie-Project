import { useState } from "react";
import { motion } from "framer-motion";
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
  const [activeMember, setActiveMember] = useState(null);

  const handleCardClick = (name) => {
    setActiveMember((prev) => (prev === name ? null : name));
  };

  return (
    <div className="min-h-screen bg-slate-50/30">
      <Navbar activePage="about" />

      <main className="overflow-hidden">
        {/* Core Main Sections */}
        <Hero />
        <CoreFeatures />
        <StatsSection />

        {/* Story & Mission Section (Matches Shared Reference Image Top Half) */}
        <section className="wg-container py-16 relative">
          
          {/* Connector Line in desktop */}
          <div className="pointer-events-none absolute left-1/2 top-[42%] z-0 hidden h-[2px] w-[120px] -translate-x-1/2 -translate-y-1/2 md:block">
            <svg width="100%" height="10" viewBox="0 0 120 10" fill="none" preserveAspectRatio="none">
              <path d="M0,5 C40,5 40,5 60,5 C80,5 80,5 120,5" stroke="#2F80ED" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="114" cy="5" r="4" fill="#27AE60" stroke="#white" strokeWidth="2" />
            </svg>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-8 md:grid-cols-2 relative z-10"
          >
            {/* Our Story Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98, y: -2 }}
              transition={{ duration: 0.3 }}
              className="group relative rounded-3xl border border-blue-100 bg-white/80 p-8 pb-10 shadow-[0_8px_30px_rgba(47,128,237,0.06)] hover:shadow-[0_20px_45px_rgba(47,128,237,0.15)] hover:border-blue-300/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[500px]"
            >
              {/* Glassmorphic border glow wrapper */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-50/50 blur-3xl group-hover:bg-blue-100/60 transition-colors duration-300" />
              </div>

              <div className="relative z-10">
                {/* Header elements */}
                <div className="flex justify-between items-start">
                  <div>
                    {/* Badge 01 */}
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-[0_4px_10px_rgba(47,128,237,0.2)]">
                      01
                    </span>

                    {/* Subtitle with line */}
                    <div className="mt-4 flex flex-col">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600">
                        Our Story
                      </span>
                      <span className="mt-1.5 h-[2px] w-8 bg-blue-600" />
                    </div>

                    <h2 className="wg-heading mt-3 text-3xl font-extrabold tracking-tight text-wg-navy">
                      Our Story
                    </h2>
                  </div>

                  {/* SUV Illustration Frame */}
                  <div className="relative h-[110px] w-[140px] shrink-0 self-start mt-2">
                    {/* Concentric Circles Background */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-[96px] w-[96px] rounded-full border border-blue-100 flex items-center justify-center">
                        <div className="h-[74px] w-[74px] rounded-full border border-blue-50 bg-blue-50/20" />
                      </div>
                    </div>
                    {/* Blue-filtered Car Image */}
                    <img
                      src={carImage}
                      alt="Blue Car Illustration"
                      className="absolute left-1/2 top-1/2 h-auto w-full max-w-[125px] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_8px_12px_rgba(47,128,237,0.15)]"
                      style={{ filter: "hue-rotate(190deg) saturate(2.4) brightness(0.85)" }}
                    />
                  </div>
                </div>

                {/* Body Text */}
                <div className="mt-6 space-y-3.5 text-[14px] leading-relaxed text-slate-500 font-medium">
                  <p>
                   Founded by a group of automotive enthusiasts and technology experts, Wheel Genie was born out of a shared frustration with the traditional vehicle buying, selling, and maintenance processes.
                  </p>
                  <p>
                   We knew there had to be a better way – a way that empowers individuals with knowledge, simplifies transactions, and connects them with trustworthy professionals.
                  </p>
                </div>
              </div>

              {/* Bottom Bulb Highlight Box */}
              <div className="mt-8 rounded-2xl border border-blue-100/50 bg-blue-50/25 p-4.5 flex gap-3.5 items-start relative z-10">
                <Lightbulb size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[13.5px] leading-relaxed text-slate-600 font-medium">
                  We built WheelGenie to centralize and transparently manage{" "}
                  <span className="font-semibold text-blue-700">vehicle buying, selling, and valuation</span>
                  —all backed by{" "}
                  <span className="font-semibold text-blue-700">state-of-the-art AI technology.</span>
                </p>
              </div>

              {/* Floating Bottom Indicator */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-white shadow-md z-20">
                <BookOpen size={16} />
              </div>
            </motion.div>

            {/* Our Mission Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98, y: -2 }}
              transition={{ duration: 0.3 }}
              className="group relative rounded-3xl border border-green-100 bg-white/80 p-8 pb-10 shadow-[0_8px_30px_rgba(39,174,96,0.06)] hover:shadow-[0_20px_45px_rgba(39,174,96,0.15)] hover:border-green-300/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[500px]"
            >
              {/* Glassmorphic border glow wrapper */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-50/50 blur-3xl group-hover:bg-green-100/60 transition-colors duration-300" />
              </div>

              <div className="relative z-10">
                {/* Header elements */}
                <div className="flex justify-between items-start">
                  <div>
                    {/* Badge 02 */}
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white font-bold text-sm shadow-[0_4px_10px_rgba(39,174,96,0.2)]">
                      02
                    </span>

                    {/* Subtitle with line */}
                    <div className="mt-4 flex flex-col">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-green-600">
                        Our Mission
                      </span>
                      <span className="mt-1.5 h-[2px] w-8 bg-green-600" />
                    </div>

                    <h2 className="wg-heading mt-3 text-3xl font-extrabold tracking-tight text-wg-navy">
                      Our Mission
                    </h2>
                  </div>

                  {/* Target Illustration Frame */}
                  <div className="relative h-[110px] w-[140px] shrink-0 self-start mt-2">
                    {/* Inline Target SVG Drawing */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="105" height="105" viewBox="0 0 100 100" className="opacity-95 drop-shadow-[0_6px_10px_rgba(39,174,96,0.1)]">
                        {/* Outer Concentric ring */}
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#E8F8F0" strokeWidth="5" />
                        <circle cx="50" cy="50" r="31" fill="none" stroke="#D1F2EB" strokeWidth="4" />
                        {/* Target Grid line */}
                        <circle cx="50" cy="50" r="20" fill="rgba(39, 174, 96, 0.05)" stroke="#27AE60" strokeWidth="2.5" strokeDasharray="3 3" />
                        {/* Bullseye */}
                        <circle cx="50" cy="50" r="10" fill="#27AE60" />
                        {/* Target Arrow */}
                        <path d="M12,88 L43,57" stroke="#27AE60" strokeWidth="3" strokeLinecap="round" />
                        <polygon points="43,57 35,53 39,49" fill="#27AE60" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Body Text */}
                <div className="mt-6 space-y-3.5 text-[14px] leading-relaxed text-slate-500 font-medium">
                  <p>
                   Our mission is to transform the vehicle landscape in Canada. We believe that every transaction, whether buying, selling, or maintaining a vehicle, should be characterized by fairness, transparency, and convenience.
                  </p>
                  <p>
We’re committed to providing an inclusive platform that caters to all types of vehicles and all levels of expertise, bridging the gap between enthusiasts and experts.
                  </p>
                </div>
              </div>

              {/* Bottom Shield Highlight Box */}
              <div className="mt-8 rounded-2xl border border-green-100/50 bg-green-50/25 p-4.5 flex gap-3.5 items-start relative z-10">
                <Shield size={20} className="text-green-600 shrink-0 mt-0.5" />
                <p className="text-[13.5px] leading-relaxed text-slate-600 font-medium">
                  With accurate calculations, quality listings, and verified operations, we ensure every transaction is{" "}
                  <span className="font-semibold text-green-700">rewarding, reliable, and completely smooth.</span>
                </p>
              </div>

              {/* Floating Bottom Indicator */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-10 w-10 bg-green-600 rounded-full flex items-center justify-center text-white border-4 border-white shadow-md z-20">
                <Rocket size={16} />
              </div>
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
              {teamMembers.map((member) => (
                <motion.div
                  key={member.name}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98, y: -2 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleCardClick(member.name)}
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
                      activeMember === member.name
                        ? "bg-[#01284E] border-[#01284E] shadow-[0_12px_28px_rgba(1,40,78,0.25)]"
                        : "bg-white border-slate-200/50 hover:bg-[#01284E] hover:border-[#01284E] shadow-[0_4px_18px_rgba(11,31,58,0.015)] hover:shadow-[0_12px_28px_rgba(1,40,78,0.25)]"
                    }
                  `}
                >
                  {/* Decorative corner element */}
                  <div className={`absolute top-0 right-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full transition-colors duration-300 ${
                    activeMember === member.name
                      ? "bg-white/5"
                      : "bg-slate-50/50 group-hover:bg-white/5"
                  }`} />

                  {/* Profile Image Frame with hover scale */}
                  <div className={`relative mx-auto h-[130px] w-[130px] sm:h-[160px] sm:w-[160px] overflow-hidden rounded-full border-4 bg-slate-50 shadow-inner group-hover:scale-105 transition-all duration-300 ${
                    activeMember === member.name
                      ? "border-white"
                      : "border-slate-100 group-hover:border-white"
                  }`}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Member Name */}
                  <h3 className={`wg-heading mt-4 sm:mt-5 text-base sm:text-lg font-bold leading-snug transition-colors duration-200 ${
                    activeMember === member.name
                      ? "text-white"
                      : "text-wg-navy group-hover:text-white"
                  }`}>
                    {member.name}
                  </h3>

                  {/* Member Role */}
                  <p className={`mt-1 text-xs font-medium uppercase tracking-wide transition-colors duration-200 ${
                    activeMember === member.name
                      ? "text-[#AAB8C8]"
                      : "text-slate-500 group-hover:text-[#AAB8C8]"
                  }`}>
                    {member.role}
                  </p>

                  {/* Divider */}
                  <div className={`my-3 sm:my-4 mx-auto w-12 border-t transition-all duration-300 ${
                    activeMember === member.name
                      ? "border-[#AAB8C8]/40 w-16"
                      : "border-slate-100 group-hover:border-[#AAB8C8]/40 group-hover:w-16"
                  }`} />

                  {/* Hover effect light glow */}
                  <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-wg-blue to-transparent transition-opacity duration-300 ${
                    activeMember === member.name
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`} />
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}