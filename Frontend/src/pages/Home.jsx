import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CoreFeatures from "../components/CoreFeatures";
import StatsSection from "../components/StatsSection";
import Footer from "../components/Footer";

// Import Assets
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
    name: "Harvinder Singh",
    role: "Head of Operations",
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
    name: "Navneet Kaur Bhatia",
    role: "Head of Admin",
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
  return (
    <div className="min-h-screen bg-slate-50/30">
      <Navbar activePage="about" />

      <main className="overflow-hidden">
        {/* Core Main Sections */}
        <Hero />
        <CoreFeatures />
        <StatsSection />

        {/* Story & Mission Section */}
        <section className="wg-container py-12 relative">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,rgba(47,128,237,0.04),transparent_50%)]" />
          
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
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98, y: -1 }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-[0_4px_25px_rgba(11,31,58,0.025)] hover:shadow-[0_12px_30px_rgba(11,31,58,0.065)] transition-all duration-300"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-50/50 blur-3xl group-hover:bg-blue-100/60 transition-colors duration-300" />
              
              <div className="relative z-10">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-wg-blue font-bold shadow-sm text-sm">
                  01
                </span>

                <h2 className="wg-heading mt-5 text-2xl font-bold text-wg-navy">
                  Our Story
                </h2>

                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                  WheelGenie was founded by a team of automotive enthusiasts and tech innovators who recognized the complexities and friction inherent in traditional car transactions. Whether dealing with opaque bidding systems, inaccurate pricing data, or stressful negotiations, the process was ripe for a change.
                </p>

                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                  We built WheelGenie to centralize and transparently manage vehicle buying, selling, and valuation—all backed by state-of-the-art AI technology.
                </p>
              </div>
            </motion.div>

            {/* Our Mission Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98, y: -1 }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-8 shadow-[0_4px_25px_rgba(11,31,58,0.025)] hover:shadow-[0_12px_30px_rgba(11,31,58,0.065)] transition-all duration-300"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-50/50 blur-3xl group-hover:bg-green-100/60 transition-colors duration-300" />

              <div className="relative z-10">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-wg-green font-bold shadow-sm text-sm">
                  02
                </span>

                <h2 className="wg-heading mt-5 text-2xl font-bold text-wg-navy">
                  Our Mission
                </h2>

                <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                  Our mission is to reshape the automotive world by delivering unparalleled convenience, transparency, and expert guidance directly to you. We aim to replace uncertainty with security, providing a transparent bidding process and accurate AI valuations.
                </p>

                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                  With accurate calculations, quality listings, and verified operations, we ensure every transaction is rewarding, reliable, and completely smooth.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* CEO Message Section (Matches Reference Image 1) */}
        <section className="wg-container py-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid overflow-hidden rounded-3xl border border-slate-200/50 bg-[#061C37] shadow-[0_20px_50px_rgba(6,28,55,0.15)] lg:grid-cols-[1.1fr_0.9fr]"
          >
            {/* CEO Message Text */}
            <div className="flex flex-col justify-center px-8 py-12 text-white sm:px-12 lg:py-16">
              
              <h2 className="wg-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[40px]">
                A Message from
                <br />
                Harminder Singh,
                <br />
                Founder & CEO
              </h2>

              <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-slate-300 font-medium max-w-[530px]">
                <p className="text-white font-semibold text-lg">
                  Welcome to WheelGenie!
                </p>

                <p>
                  As an automotive enthusiast, I've experienced the challenges of buying, selling, and maintaining vehicles. That's why I founded WheelGenie—to revolutionize the vehicle experience.
                </p>

                <p>
                  With our transparent bidding process, we're changing how vehicles are bought and sold. Our commitment to quality ensures you're getting the best. And our expert mechanics are here to guide you.
                </p>

                <p>
                  Join us as we reshape the automotive world. Welcome to WheelGenie, where vehicles meet convenience and expertise.
                </p>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <span className="block text-base font-semibold text-white">
                  Harminder Singh
                </span>

                <span className="block text-sm text-slate-400">
                  Founder & CEO, WheelGenie
                </span>
              </div>
            </div>

            {/* CEO Image Container with Curved Accents */}
            <div className="relative flex min-h-[350px] sm:min-h-[420px] lg:min-h-full items-end justify-center bg-white p-6 lg:p-0">
              
              {/* Floating Orange Decorative Accent (Matches curved shape in image) */}
              <div className="absolute right-[12%] top-[12%] h-[140px] w-[140px] rounded-full border-t-[20px] border-r-[20px] border-orange-500 opacity-90 blur-[0.5px]" />
              
              {/* Backing decorative glow */}
              <div className="absolute right-[8%] top-[15%] h-[100px] w-[100px] rounded-full bg-orange-400/20 blur-xl" />

              {/* CEO Portrait with rounded borders and clean card frame styling */}
              <img
                src={ceoImage}
                alt="Harminder Singh"
                className="relative z-10 h-auto w-full max-w-[250px] sm:max-w-[310px] lg:max-w-[360px] object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.15)] rounded-2xl border-4 border-slate-100 bg-slate-50/50 mb-3 sm:mb-4 lg:mb-0"
              />
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
                  style={{
                    "--hover-glow": member.glowColor,
                  }}
                  className={`
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200/50
                    bg-white
                    p-6
                    text-center
                    shadow-[0_4px_18px_rgba(11,31,58,0.015)]
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:bg-white
                    hover:shadow-[0_12px_28px_var(--hover-glow)]
                    ${member.borderColor}
                  `}
                >
                  {/* Decorative corner element */}
                  <div className="absolute top-0 right-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full bg-slate-50/50 group-hover:bg-blue-50/30 transition-colors duration-300" />

                  {/* Profile Image Frame with hover scale */}
                  <div className="relative mx-auto h-[160px] w-[160px] overflow-hidden rounded-full border-4 border-slate-100 bg-slate-50 shadow-inner group-hover:scale-105 group-hover:border-white transition-all duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Member Name */}
                  <h3 className="wg-heading mt-5 text-lg font-bold leading-snug text-wg-navy group-hover:text-wg-blue transition-colors duration-200">
                    {member.name}
                  </h3>

                  {/* Member Role */}
                  <p className="mt-1 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {member.role}
                  </p>

                  {/* Divider */}
                  <div className="my-4 mx-auto w-12 border-t border-slate-100 group-hover:w-16 transition-all duration-300" />

                  {/* Hover effect light glow */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-wg-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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