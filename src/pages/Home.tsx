import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Banknote, FileText, Star, MapPin, Phone, Car, Gauge, Fuel, Cog, Settings2, Compass, ExternalLink, Instagram, Video, ChevronDown } from 'lucide-react';
import { formatPrice, MOCK_REVIEWS } from '../data/mockData';
import { useVehicles } from '../context/VehicleContext';
import { Helmet } from 'react-helmet-async';

const CARD_THEMES = [
  {
    glow: "hover:border-white/50 hover:shadow-lg hover:shadow-white/5",
    textHover: "group-hover:text-white",
    price: "text-white",
    badge: "text-white border-white/20 bg-white/10 shadow-sm backdrop-blur-md",
    btn: "group-hover:border-white group-hover:text-zinc-950 group-hover:bg-white group-hover:shadow-sm",
    icon: "text-white",
    border: "border-white/10 hover:border-white/30"
  },
  {
    glow: "hover:border-zinc-300/50 hover:shadow-lg hover:shadow-zinc-300/5",
    textHover: "group-hover:text-zinc-200",
    price: "text-white",
    badge: "text-zinc-300 border-zinc-300/20 bg-white/10 shadow-sm backdrop-blur-md",
    btn: "group-hover:border-zinc-300 group-hover:text-zinc-950 group-hover:bg-zinc-200 group-hover:shadow-sm",
    icon: "text-zinc-300",
    border: "border-white/10 hover:border-zinc-300/30"
  },
  {
    glow: "hover:border-zinc-400/50 hover:shadow-lg hover:shadow-zinc-400/5",
    textHover: "group-hover:text-zinc-300",
    price: "text-white",
    badge: "text-zinc-400 border-zinc-400/20 bg-white/10 shadow-sm backdrop-blur-md",
    btn: "group-hover:border-zinc-400 group-hover:text-zinc-950 group-hover:bg-zinc-300 group-hover:shadow-sm",
    icon: "text-zinc-400",
    border: "border-white/10 hover:border-zinc-400/30"
  },
  {
    glow: "hover:border-zinc-500/50 hover:shadow-lg hover:shadow-zinc-500/5",
    textHover: "group-hover:text-zinc-400",
    price: "text-white",
    badge: "text-zinc-500 border-zinc-500/20 bg-white/10 shadow-sm backdrop-blur-md",
    btn: "group-hover:border-zinc-500 group-hover:text-zinc-950 group-hover:bg-zinc-400 group-hover:shadow-sm",
    icon: "text-zinc-500",
    border: "border-white/10 hover:border-zinc-500/30"
  }
];

export default function Home() {
  const { vehicles, siteConfig, loading } = useVehicles();
  const featuredCars = vehicles.filter(v => v.status === 'Available').slice(0, 3);
  
  const siteUrl = "https://maps.app.goo.gl/3maGM2ZiA6mpDdJJ9";
  const defaultDesc = "V C P MOTORS - Premium Pre-Owned Car Dealer in Vashi, Navi Mumbai. Trusted Used Cars, Honest Deals, Complete Peace Of Mind. Buying & Selling of Used Cars on Commission Basis.";

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-gray-800 font-sans">
      <Helmet>
        <title>V C P MOTORS | Premium Pre-Owned Cars Navi Mumbai</title>
        <meta name="description" content={defaultDesc} />
        <meta property="og:title" content="V C P MOTORS | Premium Pre-Owned Cars Navi Mumbai" />
        <meta property="og:description" content={defaultDesc} />
        <meta property="og:image" content={siteConfig.homeHeroImage} />
        <meta property="og:url" content={siteUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero Space - Hero CTAs */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-start pt-44 sm:pt-60 md:pt-80 pb-12 px-4 text-center z-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center w-full text-center mt-6 sm:mt-12">
          <div className="relative z-30 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xs sm:max-w-md mx-auto">
            <Link 
              to="/inventory" 
              className="flex items-center justify-center w-40 sm:w-48 px-4 py-2 sm:px-6 sm:py-2.5 bg-[#0057D9] hover:bg-[#2563EB] text-white border-2 border-[#0057D9] hover:border-[#2563EB] font-bold tracking-wider uppercase text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5 font-mono box-border text-center"
            >
              Browse Inventory
            </Link>

            <a 
              href="#contact" 
              className="flex items-center justify-center w-40 sm:w-48 px-4 py-2 sm:px-6 sm:py-2.5 bg-slate-900/60 hover:bg-slate-900/80 text-white border-2 border-white/80 backdrop-blur-md font-bold tracking-wider uppercase text-[10px] sm:text-xs rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 font-mono box-border text-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20 bg-transparent relative z-10 border-y border-gray-200/80">
         <div className="container mx-auto max-w-7xl px-4">
           <div className="text-center max-w-3xl mx-auto mb-16">
             <span className="text-[#0057D9] tracking-[0.2em] uppercase text-xs font-bold mb-3 block font-mono">Certified Quality Standards</span>
             <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">Uncompromising Assurance</h2>
           </div>
 
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { icon: ShieldCheck, title: "Rigorous Inspection", desc: "Every car in our inventory undergoes a multi-point mechanical, structural and aesthetic evaluation." },
               { icon: Banknote, title: "Transparent Pricing", desc: "Accurate, honest, and upfront pricing guarantees fair deals without hidden costs or pressure." },
               { icon: Car, title: "Commission Sales", desc: "Specialized used car commission buying and selling with complete transparency for both buyers and sellers." },
               { icon: FileText, title: "RC Transfer Help", desc: "Complete assistance and oversight of ownership paperwork, RTO clearances, and seamless RC transfer." }
             ].map((feature, i) => (
               <div key={i} className="bg-white/90 backdrop-blur-md border border-gray-200 hover:border-[#0057D9] transition-all duration-300 p-4 sm:p-8 rounded-xl sm:rounded-2xl flex flex-col items-center text-center shadow-sm hover:shadow-md">
                 <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-50 border border-blue-100 flex items-center justify-center mb-3 sm:mb-6 rounded-xl sm:rounded-2xl shadow-inner">
                   <feature.icon className="w-5 h-5 sm:w-7 sm:h-7 text-[#0057D9]" />
                 </div>
                 <h3 className="text-xs sm:text-sm font-bold tracking-wider text-[#111827] mb-1.5 sm:mb-3 uppercase font-sans">{feature.title}</h3>
                 <p className="text-[#4B5563] text-xs sm:text-sm leading-relaxed font-normal">{feature.desc}</p>
               </div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Testimonials */}
       <section className="py-20 bg-transparent relative z-10">
         <div className="container mx-auto max-w-7xl px-4">
           <div className="text-center mb-16">
             <span className="text-[#0057D9] tracking-[0.2em] uppercase text-xs font-bold mb-3 block font-mono">Customer Feedback</span>
             <h2 className="text-3xl font-extrabold text-[#111827] tracking-tight">Client Testimonials</h2>
             <div className="w-20 h-1 bg-[#0057D9] mx-auto mt-4 rounded-full"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {MOCK_REVIEWS.map((review) => (
               <div key={review.id} className="bg-white/90 backdrop-blur-md border border-gray-200 hover:border-blue-300 p-4 sm:p-8 rounded-xl sm:rounded-2xl flex flex-col justify-between h-full transition-all duration-300 shadow-sm">
                 <div>
                   <div className="flex mb-4 space-x-1">
                     {[...Array(review.rating)].map((_, idx) => (
                       <Star key={idx} className="w-4 h-4 fill-current text-amber-500" />
                     ))}
                   </div>
                   <p className="text-gray-700 italic text-sm leading-relaxed mb-6 flex-grow">"{review.text}"</p>
                 </div>
                 <div className="border-t border-gray-200 pt-4 flex justify-between items-center font-mono">
                   <div>
                     <p className="font-sans font-bold text-[#111827] uppercase tracking-wider text-xs mb-0.5">{review.name}</p>
                     <p className="text-[10px] text-gray-500 tracking-wider">{review.date}</p>
                   </div>
                   <span className="text-[10px] bg-blue-100 text-[#0057D9] font-bold px-2.5 py-1 rounded-md border border-blue-200">Verified Deal</span>
                 </div>
               </div>
             ))}
          </div>

          <div className="mt-14 flex justify-center">
            <a 
              href="https://share.google/Sr6C4yGwcvrin3zrK" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-between gap-4 px-8 py-4 bg-[#0057D9] hover:bg-[#2563EB] text-white rounded-xl text-xs font-bold tracking-wider uppercase font-mono transition-all duration-300 shadow-md max-w-md"
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 fill-current text-amber-300" />
                <span>View All Google Reviews</span>
              </div>
              <span className="text-sm">→</span>
            </a>
          </div>

        </div>
      </section>

      {/* Showroom Contact & Location Section */}
      <section className="py-20 bg-transparent border-t border-gray-200/80 relative z-10">
        <div className="w-full max-w-5xl mx-auto px-4 text-center">
          <span className="text-[#0057D9] tracking-[0.2em] uppercase text-xs font-bold mb-3 block font-mono">Our Location</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-12 tracking-tight">Visit V C P MOTORS In-Person</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-gray-200 hover:border-[#0057D9] transition-all duration-300 shadow-sm text-gray-800">
              <div className="bg-blue-50 p-4 rounded-full mb-6 border border-blue-100">
                <MapPin className="w-8 h-8 text-[#0057D9]" />
              </div>
              <h3 className="tracking-wider text-xs uppercase text-gray-500 mb-3 font-mono font-bold">Dealership Address</h3>
              <p className="text-[#111827] text-sm leading-relaxed tracking-wide font-semibold">
                Shop No. 1, 2, 3 & 4,<br/>
                Vivek Sahani, Sector 26A,<br/>
                Kopri Village, Kopripada, Sector 26,<br/>
                Vashi, Navi Mumbai, Maharashtra 400703
              </p>
              <a 
                href="https://maps.app.goo.gl/3maGM2ZiA6mpDdJJ9" 
                target="_blank" 
                rel="noreferrer" 
                className="mt-6 text-[#0057D9] hover:text-[#2563EB] text-xs tracking-wider uppercase font-bold font-mono border-b-2 border-[#0057D9] pb-1 transition-all inline-flex items-center gap-1.5"
              >
                <span>Get Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            
            <div className="flex flex-col items-center bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-gray-200 hover:border-[#0057D9] transition-all duration-300 shadow-sm text-gray-800">
              <div className="bg-blue-50 p-4 rounded-full mb-6 border border-blue-100">
                <Phone className="w-8 h-8 text-[#0057D9]" />
              </div>
              <h3 className="tracking-wider text-xs uppercase text-gray-500 mb-3 font-mono font-bold">Direct Phone Contact</h3>
              <a href="tel:+919820885886" className="text-[#0057D9] text-2xl tracking-wide hover:text-[#2563EB] transition-all font-mono font-extrabold my-auto">+91 98208 85886</a>
              <a 
                href="tel:+919820885886" 
                className="mt-6 text-[#0057D9] hover:text-[#2563EB] text-xs tracking-wider uppercase font-bold font-mono border-b-2 border-[#0057D9] pb-1 transition-all"
              >
                Call Dealership Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
