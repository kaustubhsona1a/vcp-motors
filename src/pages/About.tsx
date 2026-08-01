import { Star, X, ChevronLeft, ChevronRight, Maximize2, MapPin, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { MOCK_REVIEWS } from '../data/mockData';
import React, { useState } from 'react';

export default function About() {
  const { siteConfig } = useVehicles();
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const deliveries = siteConfig.clientDeliveries || [];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deliveries.length === 0) return;
    setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % deliveries.length : 0));
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deliveries.length === 0) return;
    setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + deliveries.length) % deliveries.length : 0));
  };

  return (
    <div className="bg-transparent text-gray-800 font-sans min-h-screen">
      {/* Client Deliveries Section */}
      <section className="py-16 sm:py-20 bg-transparent relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16 animate-fade-in">
            <span className="text-[#0057D9] tracking-[0.25em] uppercase text-xs font-bold mb-3 block font-mono">
              MOMENTS OF JOY
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight uppercase mb-4">
              HAPPY CUSTOMERS & HANDOVERS
            </h2>
            <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Candid snapshots of key handovers and happy car owners at V C P MOTORS. Building trust, one vehicle at a time!
            </p>
          </div>

          {/* Modern Photo Wall */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {deliveries.map((img, i) => {
              const captions = [
                "🔑 Key Handover Moment",
                "✨ Happy Customer",
                "🚗 Driving Home Confidence",
                "🌟 Exceptional Deal Delivery",
                "🤝 Trusted Used Car Sale",
                "🔥 Pure Customer Satisfaction"
              ];

              const currentCaption = captions[i % captions.length];

              return (
                <div 
                  key={i} 
                  id={`patron-card-${i}`}
                  onClick={() => setActivePhotoIndex(i)}
                  className="group relative bg-white p-4 rounded-2xl border border-gray-200 hover:border-[#0057D9] shadow-sm hover:shadow-md transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between hover:-translate-y-1"
                >
                  {/* Photo Canvas Frame */}
                  <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/3] w-full">
                    <img 
                      src={img} 
                      alt={`Client Delivery ${i + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out"
                      onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800" }}
                    />
                    
                    {/* Minimal VERIFIED badge */}
                    <div className="absolute top-3 right-3 bg-[#0057D9] text-white font-mono text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm select-none">
                      ✓ DELIVERED
                    </div>
                  </div>

                  {/* Metadata & Caption */}
                  <div className="pt-4 px-1 flex flex-col justify-between flex-grow">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 font-semibold tracking-widest uppercase block mb-1">
                        DELIVERY #{i + 1}
                      </span>
                      <p className="font-sans text-[#111827] text-sm md:text-base font-semibold tracking-wide select-none">
                        {currentCaption}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] font-mono text-gray-500 select-none">
                      <span>V C P MOTORS</span>
                      <span className="text-gray-600 font-medium">VASHI, NAVI MUMBAI</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activePhotoIndex !== null && (
        <div 
          id="patron-lightbox-backdrop"
          onClick={() => setActivePhotoIndex(null)}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4 md:p-8"
        >
          <div className="absolute top-5 inset-x-0 px-6 flex justify-between items-center text-gray-300 font-mono text-xs z-10 max-w-7xl mx-auto">
            <div>
              <span className="text-white font-bold">V C P MOTORS</span>
              <span className="mx-2 font-light">|</span>
              <span>DELIVERY {activePhotoIndex + 1} OF {deliveries.length}</span>
            </div>
            
            <button 
              onClick={() => setActivePhotoIndex(null)}
              className="p-3 bg-gray-800 border border-gray-700 rounded-full text-white hover:bg-gray-700 transition-all flex items-center justify-center cursor-pointer shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-full max-w-5xl aspect-[16/10] md:max-h-[70vh] flex items-center justify-center group/lightbox my-auto">
            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 p-4 rounded-2xl bg-black/60 border border-white/20 hover:bg-black/90 text-white transition-all transform z-20 cursor-pointer hidden md:flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img 
              src={deliveries[activePhotoIndex]} 
              alt="Handover Celebration"
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full max-h-[70vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
              onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format=crop&q=80&w=800" }}
            />

            <button
              onClick={handleNextPhoto}
              className="absolute right-4 p-4 rounded-2xl bg-black/60 border border-white/20 hover:bg-black/90 text-white transition-all transform z-20 cursor-pointer hidden md:flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 text-center max-w-xl z-10 px-4">
            <p className="text-blue-400 font-mono text-[10px] tracking-[0.2em] uppercase font-bold">V C P MOTORS DELIVERIES</p>
            <h4 className="text-white font-sans text-xl font-bold mt-1">Vehicle Handover Celebration</h4>
            <p className="text-gray-300 text-xs mt-2 font-normal leading-relaxed">
              Every photograph captures a customer receiving delivery of their pre-owned car from V C P MOTORS in Sector 26, Vashi, Navi Mumbai.
            </p>
          </div>
        </div>
      )}

      {/* Our Story & Core Pillars Section */}
      <section className="py-20 bg-transparent border-t border-gray-200/80 relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center lg:text-left max-w-3xl">
            <span className="text-[#0057D9] tracking-[0.25em] uppercase text-xs font-bold mb-3 block font-mono">
              ABOUT V C P MOTORS
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight uppercase">
              PREMIUM PRE-OWNED DEALERSHIP IN NAVI MUMBAI
            </h2>
            <div className="h-1 w-20 bg-[#0057D9] mt-6 hidden lg:block rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="border-l-4 border-[#0057D9] pl-6 md:pl-8 space-y-4">
                <p className="text-lg md:text-xl text-[#111827] font-sans leading-relaxed font-bold">
                  "V C P MOTORS is your trusted partner for buying and selling quality pre-owned cars on a commission basis in Vashi, Navi Mumbai."
                </p>
              </div>

              <div className="space-y-5 text-gray-700 font-normal text-base md:text-lg leading-relaxed">
                <p>
                  Located at Sector 26, Vashi, V C P MOTORS specializes in curated, high-quality pre-owned vehicles. We bring transparency, competitive pricing, and honest guidance to every car buyer and seller.
                </p>
                <p className="text-[#0057D9] font-sans text-lg font-semibold py-1">
                  Honest Deals. Quality Inventory. Total Transparency.
                </p>
                <p>
                  Whether you are looking to purchase a reliable pre-owned car or sell your current car on a commission basis, we handle the evaluation, paperwork, and RC transfer seamlessly. Every vehicle in our showroom is thoroughly inspected to ensure top mechanical and physical condition.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-md border border-gray-200 p-8 rounded-2xl shadow-sm space-y-3">
                <span className="font-mono text-xs text-[#0057D9] font-bold uppercase tracking-wider block">OUR MISSION</span>
                <p className="text-gray-700 font-normal text-base leading-relaxed">
                  To provide car buyers and sellers in Navi Mumbai with complete peace of mind through certified vehicles, honest pricing, and hassle-free documentation.
                </p>
              </div>
            </div>

            {/* Right Panel: Pillars Box */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
              <div className="bg-white/90 backdrop-blur-md border border-gray-200 p-8 rounded-3xl space-y-6 shadow-sm">
                <h3 className="text-[#111827] font-sans text-lg font-bold tracking-wide border-b border-gray-200 pb-4">
                  The V C P MOTORS Promise
                </h3>

                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-[#0057D9]" />
                    </div>
                    <div>
                      <h4 className="text-[#111827] font-bold text-xs uppercase tracking-wider font-mono">Multi-Point Inspection</h4>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        Thorough mechanical, electrical and cosmetic verification for every car listed.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-[#0057D9]" />
                    </div>
                    <div>
                      <h4 className="text-[#111827] font-bold text-xs uppercase tracking-wider font-mono">Commission Sales</h4>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        Fair, transparent commission-based buying & selling for pre-owned car owners and buyers.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-[#0057D9]" />
                    </div>
                    <div>
                      <h4 className="text-[#111827] font-bold text-xs uppercase tracking-wider font-mono">RC Transfer Support</h4>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        Full assistance with official RTO documentation, transfer paperwork and clearances.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-transparent border-t border-gray-200/80 font-sans relative z-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <span className="text-[#0057D9] tracking-[0.2em] uppercase text-xs font-bold mb-3 block font-mono">Customer Feedback</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight mb-4">Google Customer Ratings</h2>
            <div className="w-20 h-1 bg-[#0057D9] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_REVIEWS.map((review, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-md border border-gray-200 hover:border-blue-300 p-8 rounded-2xl flex flex-col h-full transition-all duration-300 shadow-sm justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-current text-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed text-sm mb-6">"{review.text}"</p>
                </div>
                <div className="flex items-center pt-4 border-t border-gray-200 gap-3 font-mono">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#0057D9] flex items-center justify-center font-bold text-sm border border-blue-200">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[#111827] font-bold text-xs tracking-wide">{review.name}</h4>
                    <p className="text-[10px] text-gray-500">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
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

      {/* CTA Section */}
      <section className="py-20 bg-transparent text-center border-t border-gray-200/80 relative z-10">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111827] mb-4 tracking-tight">Visit V C P MOTORS Today</h2>
          <p className="text-gray-600 mb-8 font-medium text-base sm:text-lg">Shop No. 1, 2, 3 & 4, Vivek Sahani, Sector 26A, Kopri Village, Kopripada, Sector 26, Vashi, Navi Mumbai</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-xs tracking-wider uppercase font-mono font-bold">
            <Link to="/inventory" className="bg-[#0057D9] hover:bg-[#2563EB] text-white px-8 py-4 transition-all duration-300 rounded-xl shadow-md">
              Browse Used Car Inventory
            </Link>
            <a href="tel:+919820885886" className="bg-white hover:bg-gray-50 text-[#0057D9] border-2 border-[#0057D9] px-8 py-4 transition-all duration-300 rounded-xl shadow-sm">
              Call +91 98208 85886
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

