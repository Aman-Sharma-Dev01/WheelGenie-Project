import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Zap,
  Users,
  Car,
  Tag,
  Headphones,
  Handshake,
  User,
  Mail,
  Phone,
  Paperclip,
  ArrowRight,
  ExternalLink,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Lock,
  X,
  Send,
  Bot,
  MapPin,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import AnimatedCarShowcase from '../components/AnimatedCarShowcase';
import robotMascotImg from '../assets/contact_robot_head.jpg';

const topics = [
  {
    id: 'buying',
     name: "Buying a Car",
    icon: Car,
    iconBg: "bg-blue-50 text-blue-600 border-blue-100",
    hoverBg: "bg-blue-500",
    desc: "Get help finding your next vehicle.",
    cta: "Get Assistance",
  },
  {
    id: 'selling',
    name: "Selling a Car",
    icon: Tag,
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    hoverBg: "bg-emerald-500",
    desc: "Need help listing your vehicle?",
    cta: "Contact Sales",
  },
  {
    id: 'support',
    name: "Account Support",
    icon: Headphones,
    iconBg: "bg-purple-50 text-purple-600 border-purple-100",
    hoverBg: "bg-purple-500",
    desc: "Help with your account, bookings or issues.",
    cta: "Get Support",
  },
  {
    id: 'partnerships',
    name: "Partnerships",
    icon: Handshake,
    iconBg: "bg-orange-50 text-orange-600 border-orange-100",
    hoverBg: "bg-orange-500",
    desc: "Let's work together for a bigger road ahead.",
    cta: "Talk to Us",
  },
];

const faqsData = [
  {
    question: 'How quickly will I receive a response?',
    answer:
      'Our team responds within 2–4 hours during standard business hours (Mon–Fri, 9:00 AM – 6:00 PM PST). For urgent requests, you can also reach us via phone or our 24/7 AI chat assistant.',
  },
  {
    question: 'Can I speak with someone about buying a vehicle?',
    answer:
      'Absolutely! Our automotive specialists are ready to guide you through verified listings, schedule test drives, review inspection reports, and walk you through paperworks.',
  },
  {
    question: 'How can I list my car on Wheel Genie?',
    answer:
      'Listing your vehicle is simple: sign into your account, visit "Sell Your Car", enter your vehicle details and photos, and receive an instant AI market valuation and listing suggestion.',
  },
  {
    question: 'Do you help with vehicle financing?',
    answer:
      'Yes, Wheel Genie partners with leading verified financial institutions across Canada to offer competitive financing rates, pre-approval checks, and flexible payment plans.',
  },
  {
    question: 'How can I report an issue with my account?',
    answer:
      'Select "Account Support" in the topic dropdown above, provide details in the message box, and our dedicated trust and security team will resolve it promptly.',
  },
];

export default function Contact() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Track synced user ID
  const [syncedUserId, setSyncedUserId] = useState(null);

  // Form State
  const [formData, setFormData] = useState(() => {
    const nameParts = (user?.name || '').trim().split(' ');
    return {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phone || '',
      topic: '',
      message: '',
    };
  });

  // Sync user details if user loads asynchronously
  if (user && user._id !== syncedUserId) {
    setSyncedUserId(user._id);
    const nameParts = (user.name || '').trim().split(' ');
    setFormData((prev) => ({
      ...prev,
      firstName: prev.firstName || nameParts[0] || '',
      lastName: prev.lastName || nameParts.slice(1).join(' ') || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.phone || '',
    }));
  }

  const [attachment, setAttachment] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Auth Gate Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('send a message to our support team');

  // Interactive AI Chat Modal State
  const [showAiChatModal, setShowAiChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi there! I am the WheelGenie AI assistant. How can I help you find or sell your car today?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // File Input Ref
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleTopicSelect = (topicName) => {
    setFormData((prev) => ({ ...prev, topic: topicName }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > 500) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (!file) return;

    // Check size <= 5MB
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5MB limit.');
      return;
    }

    // Check type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Only PDF, JPG, or PNG files are supported.');
      return;
    }

    setAttachment(file);
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerAuthGate = (reason = 'send a message to our support team') => {
    setAuthModalReason(reason);
    setShowAuthModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // MANDATORY AUTHENTICATION CHECK
    if (!isAuthenticated) {
      triggerAuthGate('send a message to our support team');
      return;
    }

    // Form Validation
    if (!formData.firstName.trim()) {
      setFormError('Please enter your first name.');
      return;
    }
    if (!formData.lastName.trim()) {
      setFormError('Please enter your last name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!formData.topic) {
      setFormError('Please select a topic.');
      return;
    }
    if (!formData.message.trim()) {
      setFormError('Please write your message.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API delivery
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        firstName: user?.name ? user.name.split(' ')[0] : '',
        lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : '',
        email: user?.email || '',
        phone: user?.phone || '',
        topic: '',
        message: '',
      });
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1000);
  };

  const handleStartChatting = () => {
    if (!isAuthenticated) {
      triggerAuthGate('access 24/7 AI chat with Wheel Genie');
      return;
    }
    setShowAiChatModal(true);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    // AI automated reply
    setTimeout(() => {
      let botReply = "Thank you for reaching out! A WheelGenie specialist will follow up shortly, or you can check our FAQs below.";
      const lower = userText.toLowerCase();
      if (lower.includes('buy') || lower.includes('car')) {
        botReply = "Great! You can browse hundreds of verified vehicles in our Buy section, or tell me the make and model you are looking for.";
      } else if (lower.includes('sell') || lower.includes('value')) {
        botReply = "Looking to sell? Our AI Valuation Calculator can provide an instant estimate in under 2 minutes!";
      } else if (lower.includes('contact') || lower.includes('call') || lower.includes('phone')) {
        botReply = "You can call our team directly at +1 (403) 973 6444, Monday to Friday from 9:00 AM to 6:00 PM PST.";
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFBFD] text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      <Navbar activePage="contact" />

      {/* =================================================================== */}
      {/* 1. HERO SECTION                                                     */}
      {/* =================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-[#FAFBFD] pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-slate-100">
        <div className="wg-container">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center"
            >
              {/* Pill Subtitle */}
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full border border-slate-200/80">
                  CONTACT US
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.12] font-['Poppins',sans-serif]">
                Let’s Get You <br className="hidden sm:inline" />
                <span className="text-wg-blue text-[#2F80ED]">Moving.</span>
              </h1>

              {/* Subheading */}
              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Questions about buying, selling, or finding the right vehicle?
                Our team is here to help.
              </p>

              {/* Feature Badges Row */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
                {/* 24/7 Support */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-wg-blue flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-[#2F80ED]" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 leading-tight">24/7 Support</h2>
                    <p className="text-[11px] text-slate-500">We’re always here</p>
                  </div>
                </div>

                {/* Fast Response */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-wg-blue flex items-center justify-center shrink-0">
                    <Zap size={20} className="text-[#2F80ED]" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 leading-tight">Fast Response</h2>
                    <p className="text-[11px] text-slate-500">Get answers quickly</p>
                  </div>
                </div>

                {/* Real People */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-wg-blue flex items-center justify-center shrink-0">
                    <Users size={20} className="text-[#2F80ED]" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 leading-tight">Real People</h2>
                    <p className="text-[11px] text-slate-500">Talk to experts</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Column: Animated 5-Car Driving Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-6 xl:col-span-5 relative"
            >
              <AnimatedCarShowcase />
            </motion.div>

          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 2. HOW CAN WE HELP? (Topic Selection Cards)                         */}
      {/* =================================================================== */}
      <section className="py-14 bg-white border-b border-slate-100">
        <div className="wg-container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              HOW CAN WE HELP?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 font-['Poppins',sans-serif]">
              Choose a topic so we can direct you better
            </h2>
          </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {topics.map((t) => {
    const IconComp = t.icon;
    const isSelected = formData.topic === t.name;

    return (
      <button
        key={t.id}
        type="button"
        onClick={() => handleTopicSelect(t.name)}
        className="text-left cursor-pointer group h-[200px]"
      >
        {/* 3D container */}
        <div
          className="
            relative w-full h-full
            [perspective:1000px]
          "
        >
          {/* Flipping card */}
          <div
            className={`
              relative w-full h-full
              transition-transform duration-700
              [transform-style:preserve-3d]
              group-hover:[transform:rotateY(180deg)]
            `}
          >
            {/* ================= FRONT ================= */}
            <div
              className={`
                absolute inset-0
                p-6 rounded-2xl border
                flex flex-col justify-between
                [backface-visibility:hidden]
                transition-all duration-200
                ${
                  isSelected
                    ? "border-wg-blue bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                    : "border-slate-200/90 bg-white shadow-sm"
                }
              `}
            >
              <div>
                {/* Icon */}
                <div
                  className={`
                    w-12 h-12 rounded-xl
                    flex items-center justify-center
                    mb-4 border
                    ${t.iconBg}
                  `}
                >
                  <IconComp size={22} />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900">
                  {t.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {t.desc}
                </p>
              </div>

              {/* CTA */}
              <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-wg-blue">
                <span>{t.cta}</span>

                <ArrowRight
                  size={14}
                  className="
                    transition-transform duration-300
                    group-hover:translate-x-1
                  "
                />
              </div>
            </div>
  {/* ================= BACK ================= */}
<div
  className={`
    absolute inset-0
    p-6 rounded-2xl
    flex flex-col justify-between
    overflow-hidden
    text-white

    ${t.hoverBg}

    backdrop-blur-xl
    backdrop-saturate-150

    border border-white/30
    shadow-2xl

    [backface-visibility:hidden]
    [transform:rotateY(180deg)]
  `}
>
  {/* Glass overlay */}
  <div className="absolute inset-0 bg-white/10 pointer-events-none" />

  {/* Soft glass glow */}
  <div
    className="
      absolute
      -top-10
      -right-10
      w-32
      h-32
      rounded-full
      bg-white/20
      blur-3xl
      pointer-events-none
    "
  />

  {/* Content */}
  <div className="relative z-10">
    {/* Glass Icon */}
    <div
      className="
        w-12 h-12
        rounded-xl
        flex items-center justify-center
        mb-4

        bg-white/20
        backdrop-blur-md
        border border-white/40

        shadow-lg
      "
    >
      <IconComp
        size={22}
        className="text-white"
      />
    </div>

    {/* Title */}
    <h3 className="text-base font-bold text-white">
      {t.name}
    </h3>

    {/* Description */}
    <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
      {t.desc}
    </p>
  </div>

  {/* CTA */}
  <div
    className="
      relative z-10
      mt-5
      flex items-center gap-1
      text-xs font-semibold
      text-white
    "
  >
    <span>{t.cta}</span>

    <ArrowRight
      size={14}
      className="
        transition-transform duration-300
        group-hover:translate-x-1
      "
    />
  </div>
</div>
          </div>
        </div>
      </button>
    );
  })}
</div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. MAIN CONTACT GRID: Form (Left) & Get In Touch (Right)             */}
      {/* =================================================================== */}
      <section className="relative py-14 sm:py-20 overflow-hidden" id="contact-form" ref={formRef}>
        {/* Subtle surrounding atmospheric glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#B75EFF]/10 blur-[150px] -z-10" />
        <div className="pointer-events-none absolute top-1/3 right-1/4 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-[#2F80ED]/10 blur-[150px] -z-10" />

        <div className="wg-container relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: Contact Form Card                                */}
            {/* ------------------------------------------------------------- */}
            <div className="
    lg:col-span-7
    relative
    overflow-hidden
    rounded-3xl
    p-6 sm:p-9

    bg-white/95
    backdrop-blur-xl
    border border-slate-200/90
    shadow-[0_8px_30px_rgba(11,31,58,0.03)]

    transition-all
    duration-500
    ease-out

    hover:border-[#B75EFF]/40
    hover:shadow-[0_20px_50px_rgba(183,94,255,0.15)]

    group
  ">
      {/* Purple glass glow */}
  <div
    className="
      absolute
      -top-32
      -right-24
      w-[360px]
      h-[360px]
      rounded-full
      bg-[#B75EFF]/30
      blur-[100px]
      opacity-0
      group-hover:opacity-100
      transition-opacity
      duration-700
      pointer-events-none
    "
  />

  {/* Second soft glow */}
  <div
    className="
      absolute
      -bottom-40
      -left-24
      w-[320px]
      h-[320px]
      rounded-full
      bg-[#B75EFF]/20
      blur-[100px]
      opacity-0
      group-hover:opacity-100
      transition-opacity
      duration-700
      pointer-events-none
    "
  />

  {/* Glass reflection */}
  <div
    className="
      absolute
      inset-0
      rounded-3xl
      bg-gradient-to-br
      from-white/30
      via-transparent
      to-[#B75EFF]/10
      opacity-0
      group-hover:opacity-100
      transition-opacity
      duration-500
      pointer-events-none
    "
  />

  {/* Glass inner border */}
  <div
    className="
      absolute
      inset-[1px]
      rounded-[23px]
      border border-white/0
      group-hover:border-white/30
      transition-all
      duration-500
      pointer-events-none
    "
  />
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  SEND A MESSAGE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-['Poppins',sans-serif]">
                  Let’s talk about your journey
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Fill out the form and our team will get back to you shortly.
                </p>
              </div>

              {/* Authentication Status Notice */}
              {!isAuthenticated ? (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                  <Lock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs text-amber-900 leading-relaxed">
                    <span className="font-bold">Sign In Required:</span> You must be logged in to contact our team and submit inquiries.
                    <div className="mt-2 flex gap-3">
                      <Link
                        to="/login"
                        state={{ from: location }}
                        className="font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
                      >
                        Log In now →
                      </Link>
                      <span className="text-amber-400">|</span>
                      <Link
                        to="/signup"
                        state={{ from: location }}
                        className="font-semibold text-blue-700 hover:underline"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 px-3.5 py-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Signed in as <strong>{user?.name}</strong> ({user?.email})</span>
                  </div>
                  <span className="text-[11px] bg-emerald-100/80 text-emerald-700 px-2 py-0.5 rounded font-medium">
                    Verified User
                  </span>
                </div>
              )}

              {/* Success Confirmation Notification */}
              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-bold">Message Sent Successfully!</h3>
                        <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                          Thank you for contacting WheelGenie. A specialist has received your message and will reply to your email address shortly.
                        </p>
                        <button
                          type="button"
                          onClick={() => setSubmitSuccess(false)}
                          className="mt-3 text-xs font-semibold text-emerald-800 underline hover:no-underline cursor-pointer"
                        >
                          Send another message
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              {formError && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle size={16} className="shrink-0 text-red-500" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Names Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-wg-blue focus:ring-2 focus:ring-blue-500/15 text-sm bg-slate-50/40 hover:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-wg-blue focus:ring-2 focus:ring-blue-500/15 text-sm bg-slate-50/40 hover:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-wg-blue focus:ring-2 focus:ring-blue-500/15 text-sm bg-slate-50/40 hover:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (xxx) xxx-xxxx"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-wg-blue focus:ring-2 focus:ring-blue-500/15 text-sm bg-slate-50/40 hover:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* How can we help? Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    How can we help? <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-wg-blue focus:ring-2 focus:ring-blue-500/15 text-sm bg-slate-50/40 hover:bg-white transition-colors text-slate-700 cursor-pointer"
                  >
                    <option value="">Select a topic</option>
                    <option value="Buying a Car">Buying a Car</option>
                    <option value="Selling a Car">Selling a Car</option>
                    <option value="Account Support">Account Support</option>
                    <option value="Partnerships">Partnerships</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                {/* Tell us more textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Tell us more <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {formData.message.length}/500
                    </span>
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Write your message here..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-wg-blue focus:ring-2 focus:ring-blue-500/15 text-sm bg-slate-50/40 hover:bg-white transition-colors resize-none"
                  />
                </div>

                {/* Attachment Bar & Submit Button Row */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  
                  {/* File Attachment Area */}
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />

                    {!attachment ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (!isAuthenticated) {
                            triggerAuthGate('add an attachment to your message');
                            return;
                          }
                          fileInputRef.current?.click();
                        }}
                        className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-dashed border-slate-300 hover:border-slate-400 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer w-full sm:w-auto"
                      >
                        <Paperclip size={15} className="text-slate-500" />
                        <span>Add an attachment (optional)</span>
                        <span className="text-[10px] text-slate-400 block sm:inline">
                          PDF, JPG or PNG (Max 5MB)
                        </span>
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 text-xs border border-blue-200">
                        <Paperclip size={14} />
                        <span className="max-w-[160px] truncate font-medium">{attachment.name}</span>
                        <span className="text-[10px] text-blue-500">
                          ({(attachment.size / (1024 * 1024)).toFixed(1)}MB)
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveAttachment}
                          className="p-1 hover:bg-blue-100 rounded-md text-blue-600 transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}

                    {fileError && (
                      <p className="text-[11px] text-red-500 mt-1">{fileError}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#16355E] text-white text-sm font-semibold shadow-md shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
      

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: Get In Touch & Map Card                         */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  GET IN TOUCH
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-['Poppins',sans-serif]">
                  Talk to us your way
                </h2>

                <div className="mt-8 space-y-6">
                  
                  {/* Call Us */}
                  <div className="flex items-start gap-4 group">
                    <a
                      href="tel:+14039736444"
                      className="w-11 h-11 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center shrink-0 group-hover:bg-wg-blue transition-colors shadow-sm"
                    >
                      <Phone size={18} />
                    </a>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Call Us</h3>
                      <a
                        href="tel:+14039736444"
                        className="text-sm font-bold text-slate-900 hover:text-wg-blue transition-colors block mt-0.5"
                      >
                        +1 (403) 973 6444
                      </a>
                      <p className="text-xs text-slate-500 mt-0.5">Mon – Fri, 9:00 AM – 6:00 PM (PST)</p>
                    </div>
                  </div>

                  {/* Email Us */}
                  <div className="flex items-start gap-4 group">
                    <a
                      href="mailto:admin@wheelgenie.ca"
                      className="w-11 h-11 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center shrink-0 group-hover:bg-wg-blue transition-colors shadow-sm"
                    >
                      <Mail size={18} />
                    </a>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Us</h3>
                      <a
                        href="mailto:admin@wheelgenie.ca"
                        className="text-sm font-bold text-slate-900 hover:text-wg-blue transition-colors block mt-0.5"
                      >
                        admin@wheelgenie.ca
                      </a>
                      <p className="text-xs text-slate-500 mt-0.5">We reply within 24 hours</p>
                    </div>
                  </div>

                  {/* Visit Us */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center shrink-0 group-hover:bg-wg-blue transition-colors shadow-sm">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Visit Us</h3>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        2600 – 1066 West Hastings Street
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Vancouver BC V6E 3X1 Canada</p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-4 group">
                    <div className="w-11 h-11 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center shrink-0 group-hover:bg-wg-blue transition-colors shadow-sm">
                      <Clock size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Hours</h3>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">
                        09:00 AM – 06:00 PM (PST)
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Monday to Friday</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Map Preview Card */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-inner group">
                  
                  {/* Stylized Vancouver Harbor Map Canvas / Graphic */}
                  <div className="h-44 w-full bg-[#e8ecf4] relative overflow-hidden flex items-center justify-center">
                    {/* Visual Vector Street & Water Grid Pattern */}
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #cbd5e1 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                      }}
                    />

                    {/* Harbor Water Representation */}
                    <div className="absolute -top-10 -left-10 w-48 h-28 bg-blue-200/60 rounded-full blur-xl pointer-events-none" />
                    <div className="absolute -bottom-8 -right-8 w-56 h-28 bg-blue-300/40 rounded-full blur-xl pointer-events-none" />

                    {/* Floating Location Card */}
                    <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200/70 flex items-start gap-2 max-w-[210px]">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={12} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-900 leading-tight">Wheel Genie</h4>
                        <p className="text-[9px] text-slate-500 leading-tight mt-0.5">
                          2600 - 1066 West Hastings St, Vancouver, BC V6E 3X1
                        </p>
                      </div>
                    </div>

                    {/* Open in Maps Button */}
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=1066+West+Hastings+Street+Vancouver+BC+V6E+3X1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 hover:bg-white text-slate-900 text-xs font-bold shadow-md hover:shadow-lg transition-all border border-slate-200/80 cursor-pointer"
                    >
                      <span>Open in Maps</span>
                      <ExternalLink size={12} className="text-slate-500" />
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. FAQ & AI CHAT SECTION                                            */}
      {/* =================================================================== */}
      <section className="py-14 sm:py-20 bg-slate-50/60 border-t border-slate-200/70">
        <div className="wg-container">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left FAQ Accordion */}
            <div className="lg:col-span-7">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                COMMON QUESTIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-['Poppins',sans-serif]">
                Frequently Asked Questions
              </h2>

              <div className="mt-8 space-y-3">
                {faqsData.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-sm transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                      >
                        <span className="text-sm font-semibold text-slate-900">
                          {faq.question}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* View All FAQs Button */}
              <div className="mt-6">
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-wg-blue transition-colors"
                >
                  <span>View All FAQs</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Right: AI Support Mascot Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl p-7 bg-gradient-to-br from-blue-50/90 via-sky-50/60 to-indigo-50/80 border border-blue-100/90 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[380px]">
                
                {/* Text Content */}
                <div className="relative z-10 max-w-[260px]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-wg-blue font-semibold">
                    STILL NEED HELP?
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1 font-['Poppins',sans-serif]">
                    Chat with Wheel Genie
                  </h2>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Get instant answers from our AI assistant or connect with our support team.
                  </p>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleStartChatting}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#16355E] text-white text-xs font-semibold shadow-md shadow-slate-900/10 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>Start Chatting</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Robot Mascot & Speech Bubble Graphics */}
                <div className="absolute right-0 bottom-0 pointer-events-none select-none">
                  
                  {/* Floating Speech Bubble */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-12 right-16 bg-white px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200/80 text-[11px] text-slate-800 font-medium whitespace-nowrap z-20"
                  >
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <span>Hi!</span>
                    </div>
                    <span className="text-[10px] text-slate-500">How can I help you?</span>
                    {/* Speech pointer */}
                    <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-slate-200/80 rotate-45" />
                  </motion.div>

                  {/* 3D Robot Mascot Image */}
                  <motion.img
                    src={robotMascotImg}
                    alt="WheelGenie AI Assistant Mascot"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-48 sm:w-56 h-auto object-contain drop-shadow-xl translate-y-3"
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. AUTHENTICATION REQUIRED MODAL                                    */}
      {/* =================================================================== */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative"
            >
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-wg-blue flex items-center justify-center mb-4">
                <Lock size={26} className="text-[#2F80ED]" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 font-['Poppins',sans-serif]">
                Login or Sign Up Required
              </h2>
              
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                To {authModalReason}, it is mandatory to have a registered WheelGenie account.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="w-full py-3 rounded-xl bg-wg-blue hover:bg-blue-600 text-white font-semibold text-sm text-center shadow-md shadow-blue-500/20 transition-colors block"
                >
                  Log In to Continue
                </Link>

                <Link
                  to="/signup"
                  state={{ from: location }}
                  className="w-full py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm text-center transition-colors block"
                >
                  Create an Account (Sign Up)
                </Link>
              </div>

              <p className="text-[11px] text-slate-400 text-center mt-4">
                Once logged in, you will be brought directly back to this page.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* 6. INTERACTIVE AI CHAT MODAL                                        */}
      {/* =================================================================== */}
      <AnimatePresence>
        {showAiChatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-lg w-full h-[520px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="px-5 py-4 bg-[#0B1F3A] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                    <Bot size={18} className="text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">WheelGenie AI Assistant</h3>
                    <span className="text-[10px] text-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online & Ready
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiChatModal(false)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-wg-blue text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Footer */}
              <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-wg-blue"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-wg-blue hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Send size={13} />
                  <span>Send</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
