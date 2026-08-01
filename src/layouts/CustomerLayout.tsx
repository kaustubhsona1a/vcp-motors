import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Youtube, Twitter, Menu, X, Star, Upload, Image, Check, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { useVehicles, sanitizeHeroImage } from '../context/VehicleContext';
import { useAuth } from '../context/AuthContext';

let globalVideoFinished = false;

export default function CustomerLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  const { siteConfig } = useVehicles();
  const { loginAsDealer } = useAuth();
  const isHomePage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [logoError, setLogoError] = useState(false);

  const desktopVideoRef = React.useRef<HTMLVideoElement>(null);
  const mobileVideoRef = React.useRef<HTMLVideoElement>(null);
  const hasPlayedRef = React.useRef(false);
  const [isFading, setIsFading] = React.useState(false);

  const handleVideoEnded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    globalVideoFinished = true;
    setIsFading(false);
    video.pause();
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (globalVideoFinished && video.duration && !isNaN(video.duration)) {
      video.currentTime = video.duration;
    }
  };

  React.useEffect(() => {
    if (isHomePage) {
      if (globalVideoFinished) {
        if (desktopVideoRef.current && !isNaN(desktopVideoRef.current.duration)) {
          desktopVideoRef.current.pause();
          desktopVideoRef.current.currentTime = desktopVideoRef.current.duration;
        }
        if (mobileVideoRef.current && !isNaN(mobileVideoRef.current.duration)) {
          mobileVideoRef.current.pause();
          mobileVideoRef.current.currentTime = mobileVideoRef.current.duration;
        }
        return;
      }

      if (scrollY > 5) {
        if (!hasPlayedRef.current) {
          hasPlayedRef.current = true;
          desktopVideoRef.current?.play().catch(() => {});
          mobileVideoRef.current?.play().catch(() => {});
        }
      }
    }
  }, [scrollY, isHomePage]);

  // Custom multi-tap tracker for dealer console access on mobile (esp. iPhone Safari)
  const tapCountRef = React.useRef(0);
  const lastTapTimeRef = React.useRef(0);
  const isTouchRef = React.useRef(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleSecretLogin = () => {
    setNotification('Opening Dealer Login Terminal...');
    setTimeout(() => {
      navigate('/dealer-management');
      setNotification('');
    }, 800);
  };

  const registerTap = () => {
    const now = Date.now();
    const lastTapTime = lastTapTimeRef.current;
    const currentTapCount = tapCountRef.current;

    if (now - lastTapTime < 800) {
      const nextCount = currentTapCount + 1;
      if (nextCount >= 3) {
        handleSecretLogin();
        tapCountRef.current = 0;
      } else {
        tapCountRef.current = nextCount;
      }
    } else {
      tapCountRef.current = 1;
    }
    lastTapTimeRef.current = now;
  };

  const handleCopyrightClick = (e: React.MouseEvent) => {
    if (isTouchRef.current) {
      // Handled by touch event, reset flag and skip click to avoid double registering
      isTouchRef.current = false;
      return;
    }
    registerTap();
  };

  const handleCopyrightTouch = (e: React.TouchEvent) => {
    isTouchRef.current = true;
    registerTap();
  };

  const showVideo = false;
  const showMobileVideo = false;

  const heroDesktopImage = siteConfig.homeHeroImage || "";
  const heroMobileImage = siteConfig.homeHeroMobileImage || heroDesktopImage;

  return (
    <div className="min-h-screen flex flex-col font-sans text-zinc-800 relative bg-transparent">
      {/* Dynamic secret greeting/bypass notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] bg-zinc-900 text-white font-semibold text-xs tracking-widest uppercase font-mono px-8 py-5 rounded-full shadow-2xl border border-zinc-800 flex items-center space-x-3 transition-all animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{notification}</span>
        </div>
      )}

      {/* Global Background - White & Blue luxury light aesthetic */}
      <div className="fixed top-0 bottom-0 left-0 right-0 z-0 bg-black overflow-hidden pointer-events-none">
        {/* Desktop Showcase Backdrop */}
        {showVideo && siteConfig.homeHeroVideo ? (
          <video 
            ref={desktopVideoRef}
            src={siteConfig.homeHeroVideo}
            className={`hidden md:block absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${
              isHomePage 
                ? (isScrolled ? 'opacity-70 filter blur-[3px]' : (isFading ? 'opacity-0' : 'opacity-100')) 
                : 'opacity-70 filter blur-[3px]'
            }`}
            muted
            playsInline
            onEnded={handleVideoEnded}
            onLoadedMetadata={handleLoadedMetadata}
          />
        ) : heroDesktopImage ? (
          <img 
            src={heroDesktopImage}
            alt="Showroom Desktop Backdrop"
            className={`hidden md:block absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${
              isHomePage 
                ? (isScrolled ? 'opacity-70 filter blur-[3px]' : (isFading ? 'opacity-0' : 'opacity-100')) 
                : 'opacity-70 filter blur-[3px]'
            }`}
          />
        ) : (
          <div className="hidden md:block absolute inset-0 w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
        )}
        
        {/* Mobile-specific Showcase Backdrop */}
        {showMobileVideo && (siteConfig.homeHeroMobileVideo || siteConfig.homeHeroVideo) ? (
          <video 
            ref={mobileVideoRef}
            src={siteConfig.homeHeroMobileVideo || siteConfig.homeHeroVideo}
            className={`block md:hidden absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${
              isHomePage 
                ? (isScrolled ? 'opacity-70 filter blur-[3px]' : (isFading ? 'opacity-0' : 'opacity-100')) 
                : 'opacity-70 filter blur-[3px]'
            }`}
            muted
            playsInline
            onEnded={handleVideoEnded}
            onLoadedMetadata={handleLoadedMetadata}
          />
        ) : heroMobileImage ? (
          <img 
            src={heroMobileImage}
            alt="Showroom Mobile Backdrop"
            className={`block md:hidden absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out ${
              isHomePage 
                ? (isScrolled ? 'opacity-70 filter blur-[3px]' : (isFading ? 'opacity-0' : 'opacity-100')) 
                : 'opacity-70 filter blur-[3px]'
            }`}
          />
        ) : (
          <div className="block md:hidden absolute inset-0 w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-black" />
        )}
        {/* Clear overlay without dark tint on home page hero */}
        <div className={`absolute inset-0 transition-all duration-700 pointer-events-none ${
          isHomePage 
            ? (isScrolled ? 'bg-[#F8FAFC]/55 backdrop-blur-sm' : 'bg-transparent') 
            : 'bg-[#F8FAFC]/55 backdrop-blur-sm'
        }`} />
      </div>

      <div className="relative z-10 flex flex-col flex-grow min-h-screen">
        {/* Main Navbar - Dark Translucent Header with glass blur */}
        <nav className="sticky top-0 z-50 transition-all duration-300 bg-slate-900/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg text-white">
          <div className="container mx-auto max-w-7xl px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center w-full">
            
            {/* Left Side: V C P MOTORS Brand Header */}
            <Link to="/" className="flex items-center shrink min-w-0 select-none group mr-2 sm:mr-4">
              <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
                {siteConfig.logo && !logoError ? (
                  <img 
                    src={siteConfig.logo} 
                    alt="V C P MOTORS" 
                    onError={() => setLogoError(true)}
                    className="h-12 xs:h-14 sm:h-16 md:h-20 w-auto object-contain max-w-[120px] xs:max-w-[160px] sm:max-w-[240px] md:max-w-[300px] rounded-md shrink-0" 
                  />
                ) : (
                  <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-[#0057D9] flex items-center justify-center text-white font-black text-base sm:text-xl shadow-md group-hover:bg-[#2563EB] transition-colors shrink-0">
                    VCP
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-xs xs:text-sm sm:text-base md:text-lg tracking-wider leading-none uppercase font-sans text-white truncate">
                    V C P MOTORS
                  </span>
                  <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold mt-1 text-blue-400 truncate">
                    PREMIUM PRE-OWNED
                  </span>
                </div>
              </div>
            </Link>

            {/* Right/Middle Side: Desktop Navigation & Contact Actions */}
            <div className="flex items-center space-x-2 sm:space-x-6 shrink-0">
              
              {/* Desktop Contact & Socials */}
              <div className="hidden md:flex items-center space-x-4">
                <a href="tel:+919820885886" className="flex items-center text-xs font-bold tracking-wider transition-all font-mono px-3 py-2 rounded-lg border bg-slate-800/80 hover:bg-slate-700/80 text-white border-slate-700/80 hover:border-slate-600">
                  <Phone className="w-4 h-4 mr-2 text-blue-400" />
                  <span>+91 98208 85886</span>
                </a>
                <div className="flex items-center space-x-3.5 border-l pl-4 border-slate-800">
                  <a href="https://wa.me/919820885886" target="_blank" rel="noreferrer" className="hover:scale-110 active:scale-95 transition-all duration-300" title="WhatsApp Assistant">
                     <MessageCircle className="w-4 h-4" style={{ stroke: '#25D366', fill: 'rgba(37, 211, 102, 0.2)' }} />
                  </a>
                  <a href="https://www.instagram.com/vcp_motors_2015?utm_source=qr" target="_blank" rel="noreferrer" className="hover:scale-110 active:scale-95 transition-all duration-300 text-pink-500 hover:text-pink-400" title="Instagram Profile">
                     <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://maps.app.goo.gl/3maGM2ZiA6mpDdJJ9" target="_blank" rel="noreferrer" className="flex items-center hover:scale-105 active:scale-95 transition-all duration-300 text-gray-300 hover:text-white" title="Vashi, Navi Mumbai Showroom">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="hidden lg:inline text-[10px] tracking-wider uppercase font-mono pl-1.5 font-bold text-blue-300">Vashi, Navi Mumbai</span>
                  </a>
                </div>
              </div>

              {/* Mobile Contact & Socials Bar */}
              <div className="flex md:hidden items-center space-x-1 xs:space-x-1.5">
                <a href="tel:+919820885886" className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg transition-all text-white bg-slate-800/80 hover:bg-slate-700/80 flex items-center justify-center shrink-0" title="Call Us">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                </a>
                <a href="https://wa.me/919820885886" target="_blank" rel="noreferrer" className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg hover:scale-105 transition-all bg-slate-800/80 flex items-center justify-center shrink-0" title="WhatsApp Chat">
                  <MessageCircle className="w-3.5 h-3.5" style={{ stroke: '#25D366', fill: 'rgba(37, 211, 102, 0.2)' }} />
                </a>
                <a href="https://www.instagram.com/vcp_motors_2015?utm_source=qr" target="_blank" rel="noreferrer" className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg hover:scale-105 transition-all bg-slate-800/80 text-pink-400 flex items-center justify-center shrink-0" title="Instagram Profile">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a href="https://maps.app.goo.gl/3maGM2ZiA6mpDdJJ9" target="_blank" rel="noreferrer" className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg hover:scale-105 transition-all bg-slate-800/80 flex items-center justify-center shrink-0" title="Showroom Location">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                </a>
                <button 
                  className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-white flex items-center justify-center focus:outline-none transition-colors ml-0.5 shrink-0" 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6 text-[13px] font-bold tracking-wider uppercase font-sans">
                <Link to="/" className={`transition-all duration-200 py-1 ${
                  location.pathname === '/' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}>Home</Link>
                <Link to="/inventory" className={`transition-all duration-200 py-1 ${
                  location.pathname.startsWith('/inventory') 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}>Showroom</Link>
                <Link to="/sell" className={`transition-all duration-200 py-1 ${
                  location.pathname === '/sell' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}>Sell Your Car</Link>
                <Link to="/about" className={`transition-all duration-200 py-1 ${
                  location.pathname === '/about' 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}>About</Link>
                <a href="#contact" className="transition-all duration-200 text-gray-300 hover:text-white">Contact</a>
              </div>

            </div>

          </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-lg border-b border-gray-200 px-6 py-6 flex flex-col space-y-4 font-bold tracking-wider uppercase text-xs shadow-xl z-50">
            <Link to="/" onClick={closeMenu} className="text-gray-800 hover:text-[#0057D9] py-2 border-b border-gray-100">Home</Link>
            <Link to="/inventory" onClick={closeMenu} className="text-gray-800 hover:text-[#0057D9] py-2 border-b border-gray-100">Showroom Collection</Link>
            <Link to="/sell" onClick={closeMenu} className="text-gray-800 hover:text-[#0057D9] py-2 border-b border-gray-100">Sell Your Car</Link>
            <Link to="/about" onClick={closeMenu} className="text-gray-800 hover:text-[#0057D9] py-2 border-b border-gray-100">About V C P MOTORS</Link>
            <a href="#contact" onClick={closeMenu} className="text-gray-800 hover:text-[#0057D9] py-2">Contact Showroom</a>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer / Contact Section */}
      <footer id="contact" className="bg-white/95 backdrop-blur-md border-t border-gray-200 text-gray-800 pt-20 pb-12 px-4 mt-20 relative overflow-hidden shadow-sm">
        {/* Subtle light ambient glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50/60 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <div className="space-y-5 md:col-span-1">
            <div className="flex items-center mb-2">
              {siteConfig.logo ? (
                <img src={siteConfig.logo} alt="V C P MOTORS" className="h-10 w-auto object-contain mr-3 max-w-[150px]" />
              ) : (
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#0057D9] text-white flex items-center justify-center font-extrabold text-base shadow">
                    VCP
                  </div>
                  <h1 className="text-xl font-extrabold tracking-tight uppercase text-[#111827] font-sans">
                    V C P MOTORS
                  </h1>
                </div>
              )}
            </div>
            <p className="text-sm tracking-wide leading-relaxed text-gray-600 font-normal">
              Trusted Used Cars. Honest Deals. Complete Peace Of Mind.<br/>
              V C P MOTORS is a trusted premium pre-owned car dealership located in Vashi, Navi Mumbai. We specialize in buying and selling quality used cars on a commission basis.
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-[#111827] tracking-wider text-xs font-bold uppercase border-b border-gray-200 pb-2 font-mono">Quick Navigation</h3>
            <ul className="space-y-3 text-xs tracking-wider uppercase font-semibold font-mono text-gray-600">
              <li><Link to="/inventory" className="hover:text-[#0057D9] transition-colors duration-200 flex items-center"><ChevronRight className="w-3.5 h-3.5 text-[#0057D9] mr-1.5" /> Browse Inventory</Link></li>
              <li><Link to="/sell" className="hover:text-[#0057D9] transition-colors duration-200 flex items-center"><ChevronRight className="w-3.5 h-3.5 text-[#0057D9] mr-1.5" /> Sell Your Car</Link></li>
              <li><Link to="/about" className="hover:text-[#0057D9] transition-colors duration-200 flex items-center"><ChevronRight className="w-3.5 h-3.5 text-[#0057D9] mr-1.5" /> About V C P MOTORS</Link></li>
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-[#111827] tracking-wider text-xs font-bold uppercase border-b border-gray-200 pb-2 font-mono">Showroom Location & Contact</h3>
            <ul className="space-y-3.5 text-sm tracking-wide text-gray-600 font-normal">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-[#0057D9] mr-3 shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/3maGM2ZiA6mpDdJJ9" target="_blank" rel="noreferrer" className="hover:text-[#0057D9] transition-colors duration-200 leading-relaxed text-xs">
                  Shop No. 1, 2, 3 & 4, Vivek Sahani, Sector 26A, Kopri Village, Kopripada, Sector 26, Vashi, Navi Mumbai, Maharashtra 400703
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-[#0057D9] mr-3 shrink-0" />
                <a href="tel:+919820885886" className="text-[#111827] hover:text-[#0057D9] transition-colors duration-200 font-mono text-xs font-bold">+91 98208 85886</a>
              </li>
              <li className="flex items-center">
                <MessageCircle className="w-4 h-4 text-[#25D366] mr-3 shrink-0" />
                <a href="https://wa.me/919820885886" target="_blank" rel="noreferrer" className="text-[#111827] hover:text-[#0057D9] transition-colors duration-200 font-mono text-xs font-bold">WhatsApp Us</a>
              </li>
              <li className="flex items-center">
                <Instagram className="w-4 h-4 text-pink-600 mr-3 shrink-0" />
                <a href="https://www.instagram.com/vcp_motors_2015?utm_source=qr" target="_blank" rel="noreferrer" className="text-[#111827] hover:text-[#0057D9] transition-colors duration-200 font-mono text-xs font-bold">@vcp_motors_2015</a>
              </li>
              <li className="flex items-center">
                <Youtube className="w-4 h-4 text-red-600 mr-3 shrink-0" />
                <a href="https://youtube.com/@sahilkhan-fw2zh?si=hmOwclBPVCK41tip" target="_blank" rel="noreferrer" className="text-[#111827] hover:text-[#0057D9] transition-colors duration-200 font-mono text-xs font-bold">YouTube Channel</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl mt-16 pt-6 border-t border-gray-200 text-[11px] tracking-wider uppercase text-gray-500 flex flex-col md:flex-row justify-between items-center font-mono">
          <p 
            onClick={handleCopyrightClick}
            onTouchStart={handleCopyrightTouch}
            role="button"
            tabIndex={0}
            className="select-none text-gray-500 cursor-pointer touch-manipulation hover:text-[#0057D9] outline-none transition-colors"
          >
            &copy; {new Date().getFullYear()} V C P MOTORS. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-gray-500">
            <a href="#" className="hover:text-[#0057D9]">Privacy Policy</a>
            <a href="#" className="hover:text-[#0057D9]">Terms of Dealership</a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
