import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Brain,
  FileText,
  Award,
  Zap,
  Star,
  BookOpen,
  Scan,
  Clock,
  Plus,
  User,
  UserPlus,
  Share,
  ChevronRight,
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaGithub, FaDiscord, FaFacebook } from "react-icons/fa";
import Hack4BengalLogo from '../assets/Hack4BengalLogo.png';
import AIStudioLogo from '../assets/AIStudioLogo.png';
import GeminiLogo from '../assets/GeminiLogo.png';
import VercelLogo from '../assets/VercelLogo.png';
import TailwindCSSLogo from '../assets/TailwindCSSLogo.png';
import TypeScriptLogo from '../assets/TypeScriptLogo.png';
import ViteLogo from '../assets/ViteLogo.png';
import ReactLogo from '../assets/ReactLogo.png';
import dashboardImg from "../assets/Dashboard.png"

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const calculateViewportHeight = () => {
      const vh = window.innerHeight;
      document.documentElement.style.setProperty("--vh", `${vh * 0.01}px`);
    };

    calculateViewportHeight();
    window.addEventListener("resize", calculateViewportHeight);
    window.addEventListener("orientationchange", calculateViewportHeight);

    return () => {
      window.removeEventListener("resize", calculateViewportHeight);
      window.removeEventListener("orientationchange", calculateViewportHeight);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !event.target) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const testimonials = [
    {
      initial: "JD",
      name: "Jane Doe",
      role: "High School English Teacher",
      text: "Assessly has transformed my teaching workflow. The AI evaluation tool saves me hours of grading time, and the test generation feature creates perfect assessments in minutes!",
      color: "blue",
    },
    {
      initial: "MS",
      name: "Michael Smith",
      role: "University Professor",
      text: "The OCR processing is a game-changer. I can scan handwritten assignments and have them evaluated instantly. My students get faster feedback, and I get my evenings back.",
      color: "indigo",
    },
    {
      initial: "LJ",
      name: "Lisa Johnson",
      role: "Middle School Math Teacher",
      text: "Creating tests used to take me hours. With Assessly, I can generate comprehensive assessments aligned with my curriculum in minutes. The AI evaluation is remarkably accurate.",
      color: "cyan",
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const navbarVariants = {
    transparent: {
      backgroundColor: "rgba(13, 17, 23, 0)",
      boxShadow: "none",
    },
    solid: {
      backgroundColor: "rgba(13, 17, 23, 0.9)",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
  };

  return (
    <div className="bg-[#0d1117] min-h-screen overflow-x-hidden text-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 z-[100]"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      <motion.div
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        variants={navbarVariants}
        animate={scrolled ? "solid" : "transparent"}
        initial="transparent"
      >
        <nav className="relative z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 md:py-5">
              <motion.a
                href="/"
                className="text-xl md:text-2xl font-bold transition-colors duration-300 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  Assessly
                </span>
              </motion.a>

              <div className="hidden md:flex space-x-8">
                <motion.a
                  href="#features"
                  className="hover:text-blue-400 transition duration-200 text-gray-200"
                  whileHover={{ y: -2, color: "#60a5fa" }}
                >
                  Features
                </motion.a>
                <motion.a
                  href="#how-it-works"
                  className="hover:text-blue-400 transition duration-200 text-gray-200"
                  whileHover={{ y: -2, color: "#60a5fa" }}
                >
                  How It Works
                </motion.a>
                <motion.a
                  href="#testimonials"
                  className="hover:text-blue-400 transition duration-200 text-gray-200"
                  whileHover={{ y: -2, color: "#60a5fa" }}
                >
                  Testimonials
                </motion.a>
              </div>

              <div className="hidden md:flex space-x-4">
                <motion.button
                  onClick={() => navigate('/signin')}
                  className="font-medium px-5 py-2 rounded-full transition duration-200 bg-[#161b22]/70 backdrop-blur-sm text-white hover:bg-[#161b22] border border-blue-500/30"
                  whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate('/signup')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full transition duration-200 shadow-sm"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(37, 99, 235, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </div>

              <motion.button
                className="md:hidden focus:outline-none text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="fixed inset-0 bg-[#0d1117]/95 z-40 md:hidden overflow-auto backdrop-blur-md"
                style={{ top: "60px" }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "calc(100vh - 60px)" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="container mx-auto px-4 pt-8 pb-6">
                  <motion.div
                    className="flex flex-col space-y-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.a
                      href="#features"
                      className="text-white hover:text-blue-400 transition duration-200 text-2xl font-medium flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                      variants={fadeIn}
                      whileHover={{ x: 10, color: "#60a5fa" }}
                    >
                      <div className="bg-blue-900/50 p-2 rounded-lg mr-3">
                        <Zap className="h-5 w-5 text-blue-400" />
                      </div>
                      Features
                    </motion.a>
                    <motion.a
                      href="#how-it-works"
                      className="text-white hover:text-blue-400 transition duration-200 text-2xl font-medium flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                      variants={fadeIn}
                      whileHover={{ x: 10, color: "#60a5fa" }}
                    >
                      <div className="bg-blue-900/50 p-2 rounded-lg mr-3">
                        <FileText className="h-5 w-5 text-blue-400" />
                      </div>
                      How It Works
                    </motion.a>
                    <motion.a
                      href="#testimonials"
                      className="text-white hover:text-blue-400 transition duration-200 text-2xl font-medium flex items-center"
                      onClick={() => setMobileMenuOpen(false)}
                      variants={fadeIn}
                      whileHover={{ x: 10, color: "#60a5fa" }}
                    >
                      <div className="bg-blue-900/50 p-2 rounded-lg mr-3">
                        <Star className="h-5 w-5 text-blue-400" />
                      </div>
                      Testimonials
                    </motion.a>
                    <div className="flex flex-col space-y-4 mt-8">
                      <motion.button
                        className="bg-[#161b22] hover:bg-[#21262d] text-white font-medium px-5 py-4 rounded-xl transition duration-200 text-center text-lg border border-blue-500/30 flex items-center justify-center"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/signin');
                        }}
                        variants={fadeIn}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="mr-2">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>
                        Login
                      </motion.button>
                      <motion.button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-4 rounded-xl transition duration-200 text-center text-lg flex items-center justify-center"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/signup');
                        }}
                        variants={fadeIn}
                        whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(37, 99, 235, 0.5)" }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="mr-2">
                          <UserPlus className="h-5 w-5 text-white" />
                        </div>
                        Sign Up
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.div>

      <div
        className="relative overflow-hidden bg-gradient-to-r from-[#0d1117] via-[#1a2036] to-[#0d1117] mask-b-from-20% mask-b-to-135%"
        ref={heroRef}
        style={{
          minHeight: `calc(var(--vh, 1vh) * 100)`,
          height: `auto`,
          paddingBottom: "6rem",
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMDI5NTciIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0wLTZoLTJWNmgydjR6bTAgMjRoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0tNi0yNGgtMnYtNGgydjR6bTAgNmgtMnYtNGgydjR6bTAgNmgtMnYtNGgydjR6bTAgNmgtMnYtNGgydjR6bTAgNmgtMnYtNGgydjR6bS02LTQyaC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptMCA2aC0ydi00aDJ2NHptLTYtNDJoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0wIDZoLTJ2LTRoMnY0em0tNi00MmgtMnYtNGgydjR6bTAgNmgtMnYtNGgydjR6bTAgNmgtMnYtNGgydjR6bTAgNmgtMnYtNGgydjR6bTAgNmgtMnYtNGgydjR6bTAgNmgtMnYtNGgydjR6bTAgNmgtMnYtNGgydjR6bTAgNmgtMnYtNGgydjR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

          <motion.div
            className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-blue-900 rounded-full mix-blend-multiply filter blur-[120px] opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-[25rem] h-[25rem] bg-blue-700 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/3 w-[28rem] h-[28rem] bg-cyan-800 rounded-full mix-blend-multiply filter blur-[110px] opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.4, 0.3],
            }}
            transition={{
              duration: 9,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path
                    d="M0 50 H100 M50 0 V100 M25 25 L75 75 M75 25 L25 75"
                    stroke="#0284c7"
                    strokeWidth="0.5"
                    fill="none"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
          </div>
        </div>

        <div className="relative h-full flex flex-col">
          <div className="flex-1 flex items-center justify-center pt-24 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="container mx-auto max-w-7xl">
              <div className="flex flex-col lg:flex-row items-center lg:items-start">
                <motion.div
                  className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 lg:pr-8 xl:pr-12 relative"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.div className="inline-block relative group mb-6" whileHover={{ scale: 1.05 }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-50"></div>
                    <div className="px-4 py-1.5 rounded-full bg-[#161b22]/70 text-white text-sm font-medium backdrop-blur-md border border-blue-500/50 shadow-xl relative z-10">
                      <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent font-semibold">
                        AI-Powered Teaching Assistant Tool
                      </span>
                    </div>
                  </motion.div>

                  <motion.h1
                    className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Your Personal <br className="hidden sm:block" />
                    <span className="relative">
                      <span className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 blur-xl opacity-30 rounded-lg"></span>
                      <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300">
                        Teaching Assistant Tool
                      </span>
                    </span>
                  </motion.h1>

                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                      A platform that simplifies teaching, guiding, taking tests, evaluating, and grading with just a few clicks.
                      Balance your personal and professional life easily.
                    </p>
                  </motion.div>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <motion.button
                      onClick={() => navigate('/signup')} // <-- Added navigation
                      className="relative group bg-blue-600 text-white font-semibold px-8 py-4 rounded-full transition duration-300 shadow-lg flex items-center justify-center text-lg overflow-hidden z-10 hover:bg-blue-700"
                      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(37, 99, 235, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center">
                        Get Started Today
                        <motion.span
                          className="ml-2 inline-block"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </motion.span>
                      </span>
                    </motion.button>

                    <motion.button
                      className="relative group bg-transparent border-2 border-blue-500 text-white font-semibold px-8 py-4 rounded-full transition duration-300 flex items-center justify-center text-lg backdrop-blur-sm overflow-hidden hover:bg-blue-900/30"
                      whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.8)" }}
                      whileTap={{ scale: 0.95 }}
                      // Add onClick if this should navigate somewhere, e.g., to a demo modal or page
                      // onClick={() => console.log('Watch Demo clicked')}
                    >
                      <span className="relative z-10 flex items-center">Watch Demo</span>
                    </motion.button>
                  </motion.div>

                  <motion.div
                    className="mt-12 hidden lg:flex gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <motion.div
                      className="flex items-center gap-2 bg-[#161b22]/70 backdrop-blur-md px-4 py-2 rounded-lg border border-blue-500/20 shadow-xl relative group"
                      whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.4)" }}
                    >
                      <Star className="text-blue-400 w-5 h-5 relative z-10" />
                      <span className="text-white text-sm font-medium relative z-10">Made for Educators Worldwide</span>
                    </motion.div>

                    <motion.div
                      className="flex items-center gap-2 bg-[#161b22]/70 backdrop-blur-md px-4 py-2 rounded-lg border border-blue-500/20 shadow-xl relative group"
                      whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.4)" }}
                    >
                      <Award className="text-blue-400 w-5 h-5 relative z-10" />
                      <span className="text-white text-sm font-medium relative z-10">AI-Powered Solutions</span>
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="w-full lg:w-1/2 px-4 sm:px-8 lg:px-4 lg:pt-12"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                  <div className="relative mx-auto max-w-lg lg:max-w-none lg:mt-8">
                    <motion.div
                      className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600 rounded-full opacity-20 blur-3xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-10 -right-10 w-48 h-48 bg-cyan-600 rounded-full opacity-20 blur-3xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                    />

                    <motion.div
                      className="relative rounded-xl overflow-hidden backdrop-blur-sm"
                      whileHover={{ scale: 1.02, rotateY: 5, rotateX: -5 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-cyan-900/20 backdrop-blur-sm"></div>

                      <div className="relative z-10 rounded-xl overflow-hidden">
                        <div className="relative p-1 rounded-xl overflow-hidden">
                          <motion.div
                            className="absolute inset-0"
                            animate={{
                              background: [
                                "linear-gradient(90deg, #2563eb, #0ea5e9, #2563eb)",
                                "linear-gradient(180deg, #2563eb, #0ea5e9, #2563eb)",
                                "linear-gradient(270deg, #2563eb, #0ea5e9, #2563eb)",
                                "linear-gradient(360deg, #2563eb, #0ea5e9, #2563eb)",
                                "linear-gradient(90deg, #2563eb, #0ea5e9, #2563eb)",
                              ],
                            }}
                            transition={{
                              duration: 8,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          >
                            <div className="absolute inset-0 rounded-xl"></div>
                          </motion.div>

                          <div className="relative rounded-lg overflow-hidden border-blue-500/20 group">
                            <img
                              src={dashboardImg || "/placeholder.svg?height=600&width=800"}
                              alt="Assessly Dashboard Preview"
                              className="rounded-lg shadow-2xl w-full h-auto transition-all duration-500 group-hover:scale-100"
                              loading="lazy"
                            />

                            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent opacity-60 rounded-lg"></div>

                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                              initial={{ left: "-100%" }}
                              whileHover={{ left: "100%" }}
                              transition={{ duration: 1.5, ease: "easeInOut" }}
                              style={{ width: "50%" }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute -top-16 right-0 bg-[#161b22]/80 rounded-lg shadow-xl p-3 z-10 max-w-[220px] backdrop-blur-sm border border-blue-500/30"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
                    >
                      <div className="flex items-start">
                        <div className="bg-gradient-to-br from-green-900 to-green-700 p-2 rounded-full mr-3 shadow-lg">
                          <CheckCircle className="h-5 w-5 text-green-300" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Assignment graded</p>
                          <p className="text-xs text-blue-300">24 submissions processed</p>
                          <div className="mt-1 w-full bg-blue-900/50 h-1 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1.5, delay: 1 }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute -bottom-14 left-0 bg-[#161b22]/80 rounded-lg shadow-xl p-3 z-10 backdrop-blur-sm border border-blue-500/30"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1 }}
                      whileHover={{ scale: 1.05, y: 5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
                    >
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-2 rounded-full mr-3 shadow-lg">
                          <Zap className="h-5 w-5 text-blue-300" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">Time saved this week</p>
                          <div className="flex items-center">
                            <motion.p
                              className="text-sm font-bold text-blue-400"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: 1.2 }}
                            >
                              12.5 hours
                            </motion.p>
                            <motion.span
                              className="ml-1 text-xs text-green-400 flex items-center"
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 1.4 }}
                            >
                              <svg
                                className="w-3 h-3 mr-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                                ></path>
                              </svg>
                              24%
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute top-1/2 -right-10 bg-[#161b22]/80 rounded-lg shadow-xl p-3 z-10 backdrop-blur-sm border border-blue-500/30"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                      whileHover={{ scale: 1.05, x: -5, boxShadow: "0 10px 25px -5px rgba(6, 182, 212, 0.3)" }}
                    >
                      <div className="flex items-center">
                        <div className="relative bg-gradient-to-br from-cyan-900 to-cyan-700 p-2 rounded-full mr-3 overflow-hidden shadow-lg">
                          <motion.div
                            className="absolute inset-0 bg-cyan-600 opacity-30"
                            animate={{
                              opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          />
                          <Brain className="h-5 w-5 text-cyan-300 relative z-10" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">AI Processing</p>
                          <div className="flex items-center">
                            <div className="w-16 h-1.5 bg-blue-900/50 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-cyan-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  repeatType: "reverse",
                                  ease: "easeInOut",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            className="lg:hidden flex flex-wrap justify-center gap-4 pb-12 px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.div
              className="bg-[#161b22]/70 backdrop-blur-md px-4 py-3 rounded-lg border border-blue-500/20 shadow-xl relative group"
              whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.4)" }}
            >
              <div className="flex items-center relative z-10">
                <Star className="text-blue-400 w-5 h-5 mr-2" />
                <span className="text-white text-sm font-medium">Made for Educators Worldwide</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-[#161b22]/70 backdrop-blur-md px-4 py-3 rounded-lg border border-blue-500/20 shadow-xl relative group"
              whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.4)" }}
            >
              <div className="flex items-center relative z-10">
                <Award className="text-blue-400 w-5 h-5 mr-2" />
                <span className="text-white text-sm font-medium">AI-Powered Solutions</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <section className="py-16 md:py-24 bg-gradient-to-r from-[#0d1117] to-[#1a2036]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
              Empowering Educators
            </span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <motion.div
              className="bg-[#161b22]/50 p-6 rounded-xl shadow-lg relative overflow-hidden group border border-blue-800/50 hover:border-blue-600/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                borderColor: "rgba(59, 130, 246, 0.5)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-blue-800/10 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-900/50 p-3 rounded-xl">
                    <Clock className="text-4xl text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white ml-4">Time Saved</h3>
                </div>
                <motion.p
                  className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  85%
                </motion.p>
                <p className="text-blue-200">Average reduction in grading time for teachers using Assessly</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-[#161b22]/50 p-6 rounded-xl shadow-lg relative overflow-hidden group border border-blue-800/50 hover:border-blue-600/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                borderColor: "rgba(59, 130, 246, 0.5)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/5 to-cyan-800/10 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-900/50 p-3 rounded-xl">
                    <BookOpen className="text-4xl text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white ml-4">Educators</h3>
                </div>
                <motion.p
                  className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  100+
                </motion.p>
                <p className="text-blue-200">Teachers actively using Assessly to enhance their teaching process</p>
              </div>
            </motion.div>

            <motion.div
              className="bg-[#161b22]/50 p-6 rounded-xl shadow-lg sm:col-span-2 lg:col-span-1 relative overflow-hidden group border border-blue-800/50 hover:border-blue-600/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                borderColor: "rgba(59, 130, 246, 0.5)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-blue-800/10 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-900/50 p-3 rounded-xl">
                    <Scan className="text-4xl text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white ml-4">Accuracy</h3>
                </div>
                <motion.p
                  className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  99%
                </motion.p>
                <p className="text-blue-200">Precision rate of our AI-powered OCR and grading assistance</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 text-center md:py-24" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-block px-4 py-1 rounded-full bg-blue-900 text-blue-300 font-medium text-sm mb-4"
              whileHover={{ scale: 1.05 }}
            >
              FEATURES
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                Why Teachers Love Us
              </span>
            </h2>
            <p className="text-blue-200 text-lg">
              Our platform is designed by educators, for educators, to make teaching more efficient and less stressful.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-2 sm:px-4 md:px-6">
            <motion.div
              className="p-6 md:p-8 rounded-2xl text-center bg-gradient-to-b from-[#1a2036] to-[#0d1117] shadow-md hover:shadow-xl transition duration-300 h-full border border-blue-800 hover:border-blue-600 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="flex justify-center mb-6 relative z-10"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-blue-600 p-4 rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-all duration-300 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-30"
                    transition={{ duration: 0.3 }}
                  />
                  <Brain className="h-8 w-8 text-white relative z-10" />
                </div>
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 relative z-10">AI-Powered Evaluation</h3>
              <p className="text-blue-200 relative z-10">
                Automatically evaluate handwritten and digital assignments with our advanced OCR technology
              </p>
              <div className="mt-6 pt-6 border-t border-blue-800 relative z-10">
                <motion.a
                  href="#"
                  className="text-blue-400 font-medium hover:text-blue-300 inline-flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  Learn more
                  <motion.span
                    className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              className="p-6 md:p-8 rounded-2xl text-center bg-gradient-to-b from-[#1a2036] to-[#0d1117] shadow-md hover:shadow-xl transition duration-300 h-full border border-blue-800 hover:border-blue-600 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="flex justify-center mb-6 relative z-10"
                whileHover={{ rotate: -5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-cyan-600 p-4 rounded-2xl shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-cyan-500 opacity-0 group-hover:opacity-30"
                    transition={{ duration: 0.3 }}
                  />
                  <FileText className="h-8 w-8 text-white relative z-10" />
                </div>
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 relative z-10">Test Generation</h3>
              <p className="text-blue-200 relative z-10">
                Create comprehensive tests and quizzes in minutes with our AI-powered generator
              </p>
              <div className="mt-6 pt-6 border-t border-blue-800 relative z-10">
                <motion.a
                  href="#"
                  className="text-cyan-400 font-medium hover:text-cyan-300 inline-flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  Learn more
                  <motion.span
                    className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              className="p-6 md:p-8 rounded-2xl text-center bg-gradient-to-b from-[#1a2036] to-[#0d1117] shadow-md hover:shadow-xl transition duration-300 h-full sm:col-span-2 md:col-span-1 border border-blue-800 hover:border-blue-600 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="flex justify-center mb-6 relative z-10"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-blue-600 p-4 rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-all duration-300 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-30"
                    transition={{ duration: 0.3 }}
                  />
                  <CheckCircle className="h-8 w-8 text-white relative z-10" />
                </div>
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3 relative z-10">OCR Processing</h3>
              <p className="text-blue-200 relative z-10">
                Scan and process handwritten answers with remarkable accuracy
              </p>
              <div className="mt-6 pt-6 border-t border-blue-800 relative z-10">
                <motion.a
                  href="#"
                  className="text-blue-400 font-medium hover:text-blue-300 inline-flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  Learn more
                  <motion.span
                    className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-r from-[#0d1117] to-[#1a2036]" id="how-it-works">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto mb-16 md:mb-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-block px-4 py-1 rounded-full bg-blue-900 text-blue-300 font-medium text-sm mb-4"
              whileHover={{ scale: 1.05 }}
            >
              HOW IT WORKS
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                Simple 3-Step Process
              </span>
            </h2>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600/10 via-blue-500/30 to-cyan-500/10 transform -translate-y-1/2 hidden md:block"></div>

            <div className="flex flex-col md:flex-row gap-16 md:gap-6 relative z-10">
              <motion.div
                className="flex-1 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600 rounded-full opacity-5 blur-3xl"></div>
                <div className="h-full flex flex-col items-center">
                  <motion.div
                    className="w-16 h-16 bg-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold mb-8 border border-blue-500/30"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(37, 99, 235, 0.3)" }}
                  >
                    1
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">Create</h3>
                    <p className="text-blue-200 text-lg">Design assignments with AI assistance</p>
                  </motion.div>

                  <motion.div
                    className="mt-8 w-24 h-24 bg-gradient-to-br from-blue-600/20 to-blue-400/5 rounded-full mx-auto relative overflow-hidden"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-300/5"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="h-10 w-10 text-blue-400/70" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="flex-1 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-600 rounded-full opacity-5 blur-3xl"></div>
                <div className="h-full flex flex-col items-center">
                  <motion.div
                    className="w-16 h-16 bg-cyan-600/20 backdrop-blur-sm rounded-full flex items-center justify-center text-cyan-400 text-2xl font-bold mb-8 border border-cyan-500/30"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(8, 145, 178, 0.3)" }}
                  >
                    2
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">Share</h3>
                    <p className="text-blue-200 text-lg">Distribute to students instantly</p>
                  </motion.div>

                  <motion.div
                    className="mt-8 w-24 h-24 bg-gradient-to-br from-cyan-600/20 to-cyan-400/5 rounded-full mx-auto relative overflow-hidden"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-cyan-300/5"
                      animate={{
                        rotate: [0, -360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Share className="h-10 w-10 text-cyan-400/70" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                className="flex-1 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -10 }}
              >
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600 rounded-full opacity-5 blur-3xl"></div>
                <div className="h-full flex flex-col items-center">
                  <motion.div
                    className="w-16 h-16 bg-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold mb-8 border border-blue-500/30"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(37, 99, 235, 0.3)" }}
                  >
                    3
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">Grade</h3>
                    <p className="text-blue-200 text-lg">AI evaluates submissions automatically</p>
                  </motion.div>

                  <motion.div
                    className="mt-8 w-24 h-24 bg-gradient-to-br from-blue-600/20 to-blue-400/5 rounded-full mx-auto relative overflow-hidden"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-300/5"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="h-10 w-10 text-blue-400/70" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col items-center space-y-8 md:hidden mt-8">
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                <ChevronRight className="h-6 w-6 text-blue-500/50 rotate-90" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
              >
                <ChevronRight className="h-6 w-6 text-cyan-500/50 rotate-90" />
              </motion.div>
            </div>
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              onClick={() => navigate('/signup')} // <-- Added navigation
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-full transition duration-200 backdrop-blur-sm"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(37, 99, 235, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Try Assessly Today
              <motion.svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </motion.svg>
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24" id="testimonials">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto mb-12 md:mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-block px-4 py-1 rounded-full bg-blue-900 text-blue-300 font-medium text-sm mb-4"
              whileHover={{ scale: 1.05 }}
            >
              TESTIMONIALS
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                What Educators Are Saying
              </span>
            </h2>
            <p className="text-blue-200 text-lg">Join satisfied teachers who have transformed their teaching process</p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-[#161b22]/30 p-8 rounded-2xl shadow-xl border border-blue-800"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <motion.div
                    className={`w-20 h-20 bg-${testimonials[activeTestimonial].color}-900/50 rounded-full flex items-center justify-center text-${testimonials[activeTestimonial].color}-300 text-2xl font-bold shrink-0`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {testimonials[activeTestimonial].initial}
                  </motion.div>
                  <div>
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    <motion.p
                      className="text-blue-100 text-lg italic mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      "{testimonials[activeTestimonial].text}"
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <h4 className="font-semibold text-lg text-white">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-blue-300">{testimonials[activeTestimonial].role}</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    activeTestimonial === index ? "bg-blue-600" : "bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-br from-[#eef2fa] via-[#f8fafc] to-[#e6ecfa] dark:from-[#181a20] dark:via-[#233554] dark:to-[#4f8cff]/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto mb-12 md:mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Powered By
            </h2>
            <p className="text-blue-700 dark:text-blue-200 text-base md:text-lg">
              Built with cutting-edge technologies to deliver the best experience to educators
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-center">
            <div className="flex flex-col items-center bg-white/80 dark:bg-[#181a20]/70 rounded-2xl shadow-xl border border-blue-100/40 dark:border-blue-900/40 p-6 transition-transform transition-shadow duration-200 hover:-translate-y-2 hover:shadow-blue-300/40 hover:shadow-2xl">
              <img src={Hack4BengalLogo} alt="Hack4Bengal 4.0" className="w-20 h-20 object-contain rounded-xl mb-3" />
              <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-blue-100 text-center">Hack4Bengal 4.0</span>
            </div>
            <div className="flex flex-col items-center bg-white/80 dark:bg-[#181a20]/70 rounded-2xl shadow-xl border border-blue-100/40 dark:border-blue-900/40 p-6 transition-transform transition-shadow duration-200 hover:-translate-y-2 hover:shadow-blue-300/40 hover:shadow-2xl">
              <img src={AIStudioLogo} alt="Google AI Studio" className="w-20 h-20 object-contain rounded-xl mb-3" />
              <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-blue-100 text-center">Google AI Studio</span>
            </div>
            <div className="flex flex-col items-center bg-white/80 dark:bg-[#181a20]/70 rounded-2xl shadow-xl border border-blue-100/40 dark:border-blue-900/40 p-6 transition-transform transition-shadow duration-200 hover:-translate-y-2 hover:shadow-blue-300/40 hover:shadow-2xl">
              <img src={GeminiLogo} alt="Gemini" className="w-20 h-20 object-contain rounded-xl mb-3" />
              <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-blue-100 text-center">Gemini</span>
            </div>
            <div className="flex flex-col items-center bg-white/80 dark:bg-[#181a20]/70 rounded-2xl shadow-xl border border-blue-100/40 dark:border-blue-900/40 p-6 transition-transform transition-shadow duration-200 hover:-translate-y-2 hover:shadow-blue-300/40 hover:shadow-2xl">
              <img src={VercelLogo} alt="Vercel" className="w-20 h-20 object-contain rounded-xl mb-3" />
              <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-blue-100 text-center">Vercel</span>
            </div>
            <div className="flex flex-col items-center bg-white/80 dark:bg-[#181a20]/70 rounded-2xl shadow-xl border border-blue-100/40 dark:border-blue-900/40 p-6 transition-transform transition-shadow duration-200 hover:-translate-y-2 hover:shadow-blue-300/40 hover:shadow-2xl">
              <img src={TailwindCSSLogo} alt="Tailwind CSS" className="w-20 h-20 object-contain rounded-xl mb-3" />
              <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-blue-100 text-center">Tailwind CSS</span>
            </div>
            <div className="flex flex-col items-center bg-white/80 dark:bg-[#181a20]/70 rounded-2xl shadow-xl border border-blue-100/40 dark:border-blue-900/40 p-6 transition-transform transition-shadow duration-200 hover:-translate-y-2 hover:shadow-blue-300/40 hover:shadow-2xl">
              <img src={TypeScriptLogo} alt="TypeScript" className="w-20 h-20 object-contain rounded-xl mb-3" />
              <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-blue-100 text-center">TypeScript</span>
            </div>
            <div className="flex flex-col items-center bg-white/80 dark:bg-[#181a20]/70 rounded-2xl shadow-xl border border-blue-100/40 dark:border-blue-900/40 p-6 transition-transform transition-shadow duration-200 hover:-translate-y-2 hover:shadow-blue-300/40 hover:shadow-2xl">
              <img src={ViteLogo} alt="Vite" className="w-20 h-20 object-contain rounded-xl mb-3" />
              <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-blue-100 text-center">Vite</span>
            </div>
            <div className="flex flex-col items-center bg-white/80 dark:bg-[#181a20]/70 rounded-2xl shadow-xl border border-blue-100/40 dark:border-blue-900/40 p-6 transition-transform transition-shadow duration-200 hover:-translate-y-2 hover:shadow-blue-300/40 hover:shadow-2xl">
              <img src={ReactLogo} alt="React" className="w-20 h-20 object-contain rounded-xl mb-3" />
              <span className="text-sm md:text-base font-semibold text-gray-800 dark:text-blue-100 text-center">React</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#1a2036] to-[#0d1117] py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-blue-900/60 text-blue-300 font-medium text-sm mb-4 backdrop-blur-sm border border-blue-500/30">
                LIMITED TIME OFFER
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">
              <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                Ready to Revolutionize Your Teaching?
              </span>
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join educators who have reclaimed their evenings and weekends while providing better feedback to students.
            </p>

            <motion.div
              className="bg-[#161b22]/50 p-6 rounded-xl border border-blue-500/30 backdrop-blur-sm mb-8 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-900/60 p-2 rounded-full mr-3">
                    <CheckCircle className="h-5 w-5 text-blue-300" />
                  </div>
                  <span className="text-white">Free to Use</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-900/60 p-2 rounded-full mr-3">
                    <CheckCircle className="h-5 w-5 text-blue-300" />
                  </div>
                  <span className="text-white">No credit card required</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => navigate('/signup')} // <-- Added navigation
                  className="bg-blue-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-blue-700 transition duration-200 shadow-md relative overflow-hidden group"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Start Free Today
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
                <motion.button
                  className="bg-transparent border-2 border-blue-400 text-blue-100 font-semibold px-8 py-4 rounded-full hover:bg-blue-900/30 transition duration-200 relative overflow-hidden group"
                  whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.8)" }}
                  whileTap={{ scale: 0.95 }}
                   // Add onClick if this should navigate somewhere, e.g., to a demo modal or page
                  // onClick={() => console.log('Watch Demo clicked')}
                >
                  <span className="relative z-10">Watch Demo</span>
                  <motion.div className="absolute inset-0 bg-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              className="text-blue-300 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join over 100+ educators already using Assessly
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-r from-[#0d1117] to-[#1a2036]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto mb-12 md:mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-block px-4 py-1 rounded-full bg-blue-900 text-blue-300 font-medium text-sm mb-4"
              whileHover={{ scale: 1.05 }}
            >
              FREQUENTLY ASKED QUESTIONS
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                Got Questions? We've Got Answers
              </span>
            </h2>
            <p className="text-blue-200 text-lg">
              Everything you need to know about Assessly and how it can transform your teaching experience
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                {
                  question: "How does the AI grading system work?",
                  answer:
                    "Our platform uses Gemini's advanced machine learning algorithms to analyze student responses against expected answers. It can process both digital and handwritten submissions through OCR technology, providing accurate grading and detailed feedback in seconds.",
                },
                {
                  question: "Is Assessly compatible with my existing LMS?",
                  answer:
                    "No as of now, but Assessly will be compatible with popular Learning Management Systems including Canvas, Blackboard, Moodle, and Google Classroom in Future. Our API will allow for easy data exchange and grade syncing.",
                },
                {
                  question: "How secure is my students' data?",
                  answer:
                    "We take data privacy extremely seriously. All student data is available only to the teacher. We shall never use student data for training our AI models without explicit consent.",
                },
                {
                  question: "Can I customize the submission criteria?",
                  answer:
                    "Assessly allows you to set custom data inputs, specific credential values, and assignment deadlines. You can also adjust various settings for submission and have your own submissions .csv file.",
                },
                {
                  question: "Do I need technical knowledge to use Assessly?",
                  answer:
                    "Not at all! Assessly is designed with educators in mind, featuring an intuitive interface that requires no technical expertise. Our easy UI will enable you to get started in minutes.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-[#161b22]/50 rounded-xl overflow-hidden border border-blue-800/50 hover:border-blue-600/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <motion.div
                    className="p-6 cursor-pointer"
                    initial={{ backgroundColor: "rgba(22, 27, 34, 0)" }}
                    whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.3)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-white">{faq.question}</h3>
                      <div className="bg-blue-900/50 p-1 rounded-full">
                        <motion.div
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Plus className="h-5 w-5 text-blue-400" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="mt-4 text-blue-200">{faq.answer}</div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-blue-300 mb-4">Still have questions?</p>
              <motion.a
                href="#"
                className="inline-flex items-center px-6 py-3 bg-blue-900/50 text-blue-300 font-medium rounded-full transition duration-200 border border-blue-500/30 hover:bg-blue-800/50"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(37, 99, 235, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                Contact our support team
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-[#0d1117] text-white py-12 border-t border-blue-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  Assessly
                </span>
              </h3>
              <p className="text-blue-300">AI-powered teaching assistant for modern educators</p>
              <div className="mt-6 flex space-x-4">
                <motion.a
                  href="#"
                  className="text-blue-400 hover:text-white transition"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTwitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </motion.a>
                <motion.a
                  href="#"
                  className="text-blue-400 hover:text-white transition"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaLinkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </motion.a>
                <motion.a
                  href="#"
                  className="text-blue-400 hover:text-white transition"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaGithub className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </motion.a>
                <motion.a
                  href="#"
                  className="text-blue-400 hover:text-white transition"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaDiscord className="h-5 w-5" />
                  <span className="sr-only">Discord</span>
                </motion.a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    Features
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    Pricing
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    Integrations
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    Updates
                  </a>
                </motion.li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    Documentation
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    Tutorials
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    Blog
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    Support
                  </a>
                </motion.li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    About
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    Careers
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    Privacy
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-blue-300 hover:text-white transition">
                    Terms
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          </div>
          <motion.div
            className="border-t border-blue-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-blue-300 text-sm">© {new Date().getFullYear()} Assessly. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <motion.a
                href="#"
                className="text-blue-400 hover:text-white transition"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="#"
                className="text-blue-400 hover:text-white transition"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="#"
                className="text-blue-400 hover:text-white transition"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-6 w-6" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;