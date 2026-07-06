// Landing Page for FarmConnect
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { Button } from '../components/index.js';
import { 
  FaLeaf, 
  FaTruck, 
  FaStar, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaArrowRight,
  FaChevronRight,
  FaCheck
} from 'react-icons/fa';
import { 
  FiShoppingBag, 
  FiMenu, 
  FiX, 
  FiTrendingUp, 
  FiAward
} from 'react-icons/fi';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('consumer');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll event for dynamic navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const roleRoutes = {
    FARMER: '/farmer/dashboard',
    PUBLIC: '/public/marketplace',
    ADMIN: '/admin/dashboard',
    DELIVERY_AGENT: '/delivery/dashboard',
  };

  const dashboardRoute = user ? (roleRoutes[user.role] || '/login') : '/login';

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Content for tabs (Consumers, Farmers, Delivery Agents)
  const tabContent = {
    consumer: {
      title: 'Eat Fresh, Support Local',
      subtitle: 'For Consumers',
      description: 'Get direct access to harvested-to-order organic fruits, vegetables, grains, and dairy. Experience superior taste while empowering local farming families.',
      image: '/fresh_harvest.png',
      features: [
        'Sourced directly from verified local farms',
        'Transparent pricing with zero middleman markups',
        'Eco-friendly direct-to-home delivery',
        'Safe payments and easy subscription models'
      ],
      ctaText: 'Explore Marketplace',
      ctaAction: () => {
        if (isAuthenticated && user?.role === 'PUBLIC') {
          navigate('/public/marketplace');
        } else {
          navigate('/login');
        }
      }
    },
    farmer: {
      title: 'Your Farm, Your Prices, Your Rules',
      subtitle: 'For Farmers',
      description: 'Eliminate exploitative agents. List your fresh produce directly, set your own fair prices, manage inventory seamlessly, and receive secure direct payments.',
      image: '/landing_hero.png', // Fallback to hero
      features: [
        'Direct connection to thousands of city buyers',
        'Complete freedom to price your own products',
        'Predictable revenue via subscription orders',
        'Detailed sales analytics and demand forecasting'
      ],
      ctaText: 'Start Selling Today',
      ctaAction: () => {
        if (isAuthenticated && user?.role === 'FARMER') {
          navigate('/farmer/dashboard');
        } else {
          navigate('/register?role=FARMER');
        }
      }
    },
    delivery: {
      title: 'Deliver Freshness, Earn Respect',
      subtitle: 'For Delivery Agents',
      description: 'Join our green logistics team. Transport fresh produce from countryside farms to urban doorsteps. Enjoy optimized routing and flexible working hours.',
      image: '/fresh_harvest.png',
      features: [
        'Smart routes minimized for distance and fuel',
        'Guaranteed regular deliveries and payouts',
        'Eco-friendly delivery guidelines & support',
        'Flexible schedules built around your availability'
      ],
      ctaText: 'Apply as Delivery Agent',
      ctaAction: () => {
        if (isAuthenticated && user?.role === 'DELIVERY_AGENT') {
          navigate('/delivery/dashboard');
        } else {
          navigate('/register?role=DELIVERY_AGENT');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-gray-800 font-sans selection:bg-primary-200 selection:text-primary-900 scroll-smooth">
      
      {/* 1. Header (Navbar) */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300">
        <div className={`max-w-6xl mx-auto rounded-full transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border border-primary-100/50 py-2 px-6 sm:px-8' 
            : 'bg-white/60 backdrop-blur-sm border border-white/40 py-3 px-6 sm:px-8'
        }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="text-2xl animate-pulse">🌾</span>
              <span className="text-xl font-black text-primary-950 tracking-tight">
                Farm<span className="text-secondary-600">Connect</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-primary-800 hover:text-primary-950 font-bold text-sm px-4 py-2 hover:bg-primary-50/50 rounded-full transition-all"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-primary-800 hover:text-primary-950 font-bold text-sm px-4 py-2 hover:bg-primary-50/50 rounded-full transition-all"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="text-primary-800 hover:text-primary-950 font-bold text-sm px-4 py-2 hover:bg-primary-50/50 rounded-full transition-all"
              >
                Our Mission
              </button>
            

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <button 
                  onClick={() => navigate(dashboardRoute)} 
                  className="bg-gradient-to-r from-primary-600 to-emerald-700 hover:from-primary-700 hover:to-emerald-800 text-white rounded-full font-bold shadow-md hover:shadow-lg px-6 py-2 text-sm transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  Dashboard <FaArrowRight className="text-xs" />
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-primary-800 hover:text-primary-950 font-bold text-sm px-4 py-2 hover:bg-primary-50/50 rounded-full transition-all">
                    Sign In
                  </Link>
                  <button 
                    onClick={() => navigate('/register')} 
                    className="bg-gradient-to-r from-primary-600 to-emerald-700 hover:from-primary-700 hover:to-emerald-800 text-white rounded-full font-bold shadow-md hover:shadow-lg px-6 py-2 text-sm transition-all transform hover:scale-105 active:scale-95"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-primary-900 hover:text-primary-700 focus:outline-none p-2 rounded-full hover:bg-primary-50"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-md border border-primary-100 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 max-w-6xl mx-auto">
            <div className="px-5 pt-3 pb-6 space-y-3">
              <button 
                onClick={() => scrollToSection('features')} 
                className="block w-full text-left px-4 py-2.5 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              >
                🌾 Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="block w-full text-left px-4 py-2.5 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              >
                🚜 How it Works
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="block w-full text-left px-4 py-2.5 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
              >
                🌳 Our Mission
              </button>
              <hr className="border-gray-100 my-2" />
              <div className="flex flex-col gap-2 pt-1">
                {isAuthenticated ? (
                  <button 
                    onClick={() => navigate(dashboardRoute)} 
                    className="w-full text-center bg-gradient-to-r from-primary-600 to-emerald-700 hover:from-primary-700 hover:to-emerald-800 text-white rounded-full font-bold shadow-md py-3 text-sm transition-all"
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <>
                    <Link to="/login" className="w-full text-center py-2.5 text-primary-800 hover:bg-primary-50 rounded-full font-bold text-sm transition-all">
                      Sign In
                    </Link>
                    <button 
                      onClick={() => navigate('/register')} 
                      className="w-full text-center bg-gradient-to-r from-primary-600 to-emerald-700 hover:from-primary-700 hover:to-emerald-800 text-white rounded-full font-bold shadow-md py-3 text-sm transition-all"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-br from-primary-50 via-white to-secondary-50/30">
        
        {/* Decorative Background Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-100/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-1.5 text-primary-800 text-sm font-semibold shadow-sm">
                <FaLeaf className="animate-pulse text-primary-600" /> 
                <span>100% Direct Farm-to-Fork Platform</span>
              </div>

              {/* Catchy Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Empowering <span className="text-primary-700 bg-clip-text">Farmers</span>,<br />
                Connecting <span className="text-secondary-600 underline decoration-wavy decoration-primary-300">Freshness</span>.
              </h1>

              {/* Sub-headline */}
              <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                FarmConnect bridges the gap between rural agricultural communities and urban homes. Enjoy fresh, organically sourced harvests while ensuring local farmers receive 100% of their hard-earned prices.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                {isAuthenticated ? (
                  <Button 
                    onClick={() => navigate(dashboardRoute)} 
                    variant="primary" 
                    size="lg"
                    className="rounded-full shadow-lg transform hover:scale-105 active:scale-95 px-8 py-3.5"
                  >
                    Go to Your Dashboard <FaArrowRight />
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={() => navigate('/register')} 
                      variant="primary" 
                      size="lg"
                      className="rounded-full shadow-lg transform hover:scale-105 active:scale-95 px-8 py-3.5"
                    >
                      Get Started Now <FaArrowRight />
                    </Button>
                    <button 
                      onClick={() => scrollToSection('features')} 
                      className="flex items-center gap-2 text-primary-800 hover:text-primary-600 font-semibold text-lg px-6 py-3 rounded-full hover:bg-primary-50 transition-all"
                    >
                      Learn More <FaArrowRight className="rotate-90 sm:rotate-0" />
                    </button>
                  </>
                )}
              </div>

              {/* Platform Core Purposes Summary */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-primary-600 text-lg">🌾</span>
                  <span className="text-sm font-semibold text-gray-700">Direct Trade</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-600 text-lg">🚜</span>
                  <span className="text-sm font-semibold text-gray-700">Fresh Crops</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-600 text-lg">🛵</span>
                  <span className="text-sm font-semibold text-gray-700">Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Modern Image with Glass Cards Overlay */}
            <div className="lg:col-span-5 relative mt-10 lg:mt-0">
              
              {/* Main Image container with decorative frame */}
              <div className="relative mx-auto max-w-[450px] lg:max-w-none">
                {/* Background decorative square outline */}
                <div className="absolute -inset-4 border-2 border-dashed border-primary-300 rounded-3xl -rotate-3 -z-10"></div>
                
                {/* Nature theme leaf badge */}
                <div className="absolute -top-6 -left-6 bg-amber-500 text-white rounded-full p-4 shadow-xl -rotate-12 z-20 hidden sm:block">
                  <span className="text-2xl font-bold font-sans">100%</span>
                  <div className="text-xs font-semibold uppercase tracking-widest text-amber-100">Organic</div>
                </div>

                {/* Hero Image */}
                <div className="overflow-hidden rounded-3xl shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img 
                    src="/landing_hero.png" 
                    alt="Lush green organic farm Sunrise" 
                    className="w-full h-[380px] md:h-[450px] object-cover object-center transform hover:scale-105 transition-transform duration-700" 
                  />
                </div>

                {/* Floating Glassmorphic Card 1 */}
                <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-primary-50 flex items-center gap-3 max-w-[220px] transition-transform hover:scale-105 z-20">
                  <div className="bg-primary-100 p-3 rounded-xl text-primary-700">
                    <FiShoppingBag className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Harvest Fresh</h4>
                    <p className="text-xs text-gray-500">Picked to order</p>
                  </div>
                </div>

                {/* Floating Glassmorphic Card 2 */}
                <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-secondary-50 flex items-center gap-3 max-w-[200px] transition-transform hover:scale-105 z-20 hidden sm:flex">
                  <div className="bg-secondary-100 p-3 rounded-xl text-secondary-700">
                    <FaTruck className="text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Eco Delivery</h4>
                    <p className="text-xs text-gray-500">Low CO2 footprint</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Core Value Propositions Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-primary-700 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              <FaLeaf className="text-sm animate-pulse" /> Platform Ecosystem
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              A Sustainable & Fair Agriculture Marketplace
            </p>
            <p className="text-lg text-gray-500 mt-4">
              We leverage technology to establish transparency, minimize logistics waste, and support sustainable farming practices.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-primary-50/50 hover:bg-primary-50 rounded-3xl p-8 border border-primary-100/50 hover:border-primary-200 transition-all hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="bg-primary-600 text-white rounded-2xl p-4 w-14 h-14 flex items-center justify-center shadow-md mb-6 transform group-hover:rotate-12 transition-transform">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-primary-950 mb-3">Direct from Farms</h3>
              <p className="text-gray-600 leading-relaxed">
                Skip the distributors, cold-storage wholesalers, and retail markups. Your order goes directly to the field, meaning fruits and veggies arrive fresher and last much longer in your kitchen.
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary-700 font-bold text-sm">
                <span>Direct Marketplace</span>
                <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-secondary-50/40 hover:bg-secondary-50 rounded-3xl p-8 border border-secondary-100/50 hover:border-secondary-200 transition-all hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-100/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="bg-secondary-600 text-white rounded-2xl p-4 w-14 h-14 flex items-center justify-center shadow-md mb-6 transform group-hover:rotate-12 transition-transform">
                <FiAward className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Fair Trade Pricing</h3>
              <p className="text-gray-650 leading-relaxed">
                By allowing farmers to define their own prices, we protect them from corporate bidding wars. Every purchase directly sustains rural economies, empowering farmers to invest in crop quality.
              </p>
              <div className="mt-6 flex items-center gap-2 text-secondary-700 font-bold text-sm">
                <span>Fair Economics</span>
                <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-primary-50/50 hover:bg-primary-50 rounded-3xl p-8 border border-primary-100/50 hover:border-primary-200 transition-all hover:-translate-y-2 hover:shadow-xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/40 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="bg-primary-700 text-white rounded-2xl p-4 w-14 h-14 flex items-center justify-center shadow-md mb-6 transform group-hover:rotate-12 transition-transform">
                <FaTruck className="text-xl" />
              </div>
              <h3 className="text-xl font-bold text-primary-950 mb-3">Eco-Friendly Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Our smart routing system bundles neighborhood orders, drastically reducing travel distances for delivery agents. It saves fuel, lowers emissions, and guarantees quick farm-to-door delivery.
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary-800 font-bold text-sm">
                <span>Smart Logistics</span>
                <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Interactive How It Works Section (Tab Switcher) */}
      <section id="how-it-works" className="py-24 bg-neutral-100 border-y border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-base text-primary-700 font-bold uppercase tracking-widest mb-2">Operation Guide</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">How FarmConnect Works</p>
            <p className="text-lg text-gray-500 mt-3">Select your role to explore how our specialized ecosystem supports you at every step.</p>
          </div>

          {/* Interactive Role Switcher Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-white border border-gray-200 rounded-full shadow-md max-w-full overflow-x-auto">
              <button 
                onClick={() => setActiveTab('consumer')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  activeTab === 'consumer' 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                }`}
              >
                🌾 For Consumers
              </button>
              <button 
                onClick={() => setActiveTab('farmer')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  activeTab === 'farmer' 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                }`}
              >
                🚜 For Farmers
              </button>
              <button 
                onClick={() => setActiveTab('delivery')}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  activeTab === 'delivery' 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50/50'
                }`}
              >
                🛵 Delivery Agents
              </button>
            </div>
          </div>

          {/* Tab Display Panel */}
          <div className="bg-white rounded-3xl shadow-xl border border-primary-50/50 overflow-hidden transition-all duration-500">
            <div className="grid lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
              
              {/* Tab Text Content */}
              <div className="lg:col-span-7 space-y-6">
                <span className="text-secondary-600 font-bold tracking-widest text-sm uppercase">
                  {tabContent[activeTab].subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {tabContent[activeTab].title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {tabContent[activeTab].description}
                </p>

                {/* Features Checklists */}
                <ul className="space-y-3.5">
                  {tabContent[activeTab].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 bg-primary-100 text-primary-700 rounded-full p-1 mt-0.5">
                        <FaCheck className="text-xs" />
                      </span>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="pt-4">
                  <Button 
                    onClick={tabContent[activeTab].ctaAction} 
                    variant="primary" 
                    size="lg"
                    className="rounded-full shadow-lg px-8 hover:scale-105 transition-all"
                  >
                    {tabContent[activeTab].ctaText} <FaArrowRight className="text-xs ml-1" />
                  </Button>
                </div>
              </div>

              {/* Tab Image Content */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0">
                <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-100 max-h-[350px]">
                  <img 
                    src={tabContent[activeTab].image} 
                    alt={tabContent[activeTab].title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                {/* Decorative absolute element */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary-200/50 rounded-full blur-2xl -z-10"></div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. About / Mission Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-primary-900 via-primary-950 to-primary-900 text-white relative overflow-hidden">
        
        {/* Soft decorative background circles */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full -z-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-amber-400 font-extrabold uppercase tracking-widest text-sm flex items-center justify-center gap-2">
              <FaLeaf className="animate-pulse text-amber-400 text-xs" /> Our Core Mission
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">What FarmConnect is For</h2>
            <p className="text-primary-200 text-lg">
              FarmConnect (UzhavarPro) is built to revolutionize the agricultural supply chain by creating a direct, transparent connection between local farms and urban communities.
            </p>
          </div>

          {/* Grid explanation of what the website is for overall */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side: narrative */}
            <div className="space-y-6 text-left">
              <h3 className="text-2xl font-bold text-amber-300">Empowering Farmers, Enriching Consumers</h3>
              <p className="text-primary-100 text-base leading-relaxed">
                Traditionally, small-scale farmers sell harvests to layers of intermediaries, receiving only a small fraction of retail pricing. Meanwhile, buyers pay high markups in grocery stores for produce that spent days in transit and cold storage.
              </p>
              <p className="text-primary-100 text-base leading-relaxed">
                <strong>FarmConnect eliminates this gap.</strong> We provide farmers with direct digital storefronts to list their fresh harvests. Consumers receive organic vegetables, fruits, and dairy harvested-to-order, while supporting sustainable farming families.
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <span className="bg-amber-400 text-primary-950 rounded-full p-1.5 font-bold text-xs">✓</span>
                  <span className="font-semibold text-white text-sm">Direct Marketplace</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-amber-400 text-primary-950 rounded-full p-1.5 font-bold text-xs">✓</span>
                  <span className="font-semibold text-white text-sm">Fair Farm Income</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-amber-400 text-primary-950 rounded-full p-1.5 font-bold text-xs">✓</span>
                  <span className="font-semibold text-white text-sm">Eco-Friendly Delivery</span>
                </div>
              </div>
            </div>

            {/* Right side: platform highlights */}
            <div className="space-y-6">
              
              {/* Box 1 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4 hover:bg-white/10 transition-all text-left">
                <div className="text-3xl mt-1">🚜</div>
                <div>
                  <h4 className="font-bold text-lg text-white">For Farmers: Pricing Control</h4>
                  <p className="text-sm text-primary-200 mt-1">
                    Farmers upload their products, set their own fair rates, manage inventories, and get paid directly. No pricing manipulation by third-party agents.
                  </p>
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4 hover:bg-white/10 transition-all text-left">
                <div className="text-3xl mt-1">🛒</div>
                <div>
                  <h4 className="font-bold text-lg text-white">For Consumers: Freshness & Quality</h4>
                  <p className="text-sm text-primary-200 mt-1">
                    Buyers enjoy chemical-free, seasonal, and freshly harvested farm-fresh products delivered straight to their doorstep at transparent rates.
                  </p>
                </div>
              </div>

              {/* Box 3 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4 hover:bg-white/10 transition-all text-left">
                <div className="text-3xl mt-1">🛵</div>
                <div>
                  <h4 className="font-bold text-lg text-white">For Delivery: Safe & Green Logistics</h4>
                  <p className="text-sm text-primary-200 mt-1">
                    Local delivery agents earn regular payouts by executing direct farm-to-table drop-offs using our smart route optimization system.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>



      {/* 7. Call To Action (CTA) Section */}
      <section className="relative py-24 overflow-hidden">
        
        {/* Curving green background banner */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-8 relative z-10">
          <span className="text-amber-400 font-extrabold uppercase tracking-widest text-sm">Join the FarmConnect Family</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">Ready to Taste True Freshness?</h2>
          <p className="text-3xl sm:text-2xl tracking-tight leading-tight">
            Create your account today. Whether you want to buy organic farm produce, sell your crops, or deliver fresh orders, there is a place for you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Button 
                onClick={() => navigate(dashboardRoute)} 
                variant="secondary" 
                size="lg"
                className="rounded-full shadow-xl bg-amber-500 hover:bg-amber-600 text-white border-0 font-bold px-8 py-4 text-lg transform hover:scale-105 active:scale-95"
              >
                Go to Dashboard <FaArrowRight className="ml-1" />
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/register')} 
                  variant="secondary" 
                  size="lg"
                  className="rounded-full shadow-xl bg-amber-500 hover:bg-amber-600 text-white border-0 font-bold px-8 py-4 text-lg transform hover:scale-105 active:scale-95"
                >
                  Create Free Account <FaArrowRight className="ml-1" />
                </Button>
                <Link 
                  to="/login" 
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full border border-white/20 text-lg transition-all"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-primary-950 text-gray-400 py-16 border-t border-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
            
            {/* Brand column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🌾</span>
                <span className="text-xl font-bold text-black tracking-tight">FarmConnect</span>
              </div>
              <p className="text-sm text-black leading-relaxed">
                Empowering farmers with tools to direct-sell, ensuring fresh, local, and chemical-free vegetables, fruits, and grains are accessible to urban markets.
              </p>
              
              {/* Social icons */}
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="bg-primary-900 hover:bg-primary-800 text-white rounded-full p-2.5 transition-colors shadow-sm" aria-label="Facebook">
                  <FaFacebookF className="text-sm" />
                </a>
                <a href="#" className="bg-primary-900 hover:bg-primary-800 text-white rounded-full p-2.5 transition-colors shadow-sm" aria-label="Twitter">
                  <FaTwitter className="text-sm" />
                </a>
                <a href="#" className="bg-primary-900 hover:bg-primary-800 text-white rounded-full p-2.5 transition-colors shadow-sm" aria-label="Instagram">
                  <FaInstagram className="text-sm" />
                </a>
                <a href="#" className="bg-primary-900 hover:bg-primary-800 text-white rounded-full p-2.5 transition-colors shadow-sm" aria-label="LinkedIn">
                  <FaLinkedinIn className="text-sm" />
                </a>
              </div>
            </div>

            {/* Quick links columns */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-black font-semibold text-sm uppercase tracking-wider">Features</h4>
              <ul className="space-y-2.5 text-sm">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-primary-400 text-left">Marketplace</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-primary-400 text-left">Direct Selling</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-primary-400 text-left">Eco Logistics</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-primary-400 text-left">Our Mission</button></li>
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-black font-semibold text-sm uppercase tracking-wider">Roles</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/register?role=PUBLIC" className="hover:text-primary-400">Join as Consumer</Link></li>
                <li><Link to="/register?role=FARMER" className="hover:text-primary-400">Join as Farmer</Link></li>
                <li><Link to="/register?role=DELIVERY_AGENT" className="hover:text-primary-400">Join as Delivery Agent</Link></li>
                <li><Link to="/login" className="hover:text-primary-400">Login Portal</Link></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-black font-semibold text-sm uppercase tracking-wider">Join our Fresh Newsletter</h4>
              <p className="text-sm text-black-400">
                Receive recipes, soil health stories, and exclusive community discounts once a month.
              </p>
              
              {/* Newsletter Form */}
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 bg-primary-900 border border-primary-800 rounded-full p-1 max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent text-white border-0 text-sm px-4 py-2 flex-grow focus:ring-0 focus:outline-none placeholder-gray-500"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold px-4 py-2 rounded-full text-xs transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>

          </div>

          {/* Bottom Copyright Area */}
          <div className="mt-12 pt-8 border-t border-primary-900 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} FarmConnect (UzhavarPro). All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400">Privacy Policy</a>
              <a href="#" className="hover:text-primary-400">Terms of Service</a>
              <a href="#" className="hover:text-primary-400">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
