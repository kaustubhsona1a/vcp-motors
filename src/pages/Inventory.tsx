import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/mockData';
import { Search, Filter, Car, Gauge, Fuel, Cog, Instagram } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

export default function Inventory() {
  const { vehicles, loading } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const BUDGET_OPTIONS = [
    1000000,  // Below 10L
    1500000,  // Under 15L
    2000000,  // Under 20L
    2500000,  // Under 25L
    3000000,  // Under 30L
    3500000,  // Under 35L
    4000500,  // Under 40L
    4500000,  // Under 45L
    5000000,  // Under 50L
    100000000 // 50 Lakh+ / Any
  ];
  const [budgetIndex, setBudgetIndex] = useState(BUDGET_OPTIONS.length - 1);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [maxMileage, setMaxMileage] = useState<number | null>(null);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const filteredCars = useMemo(() => {
    let result = vehicles.filter(car => car.status === 'Available');
    
    // Search filter
    if (searchTerm) {
      result = result.filter(car => 
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Budget filter
    if (budgetIndex < BUDGET_OPTIONS.length - 1) {
      const currentMaxBudget = BUDGET_OPTIONS[budgetIndex];
      result = result.filter(car => car.price <= currentMaxBudget);
    }

    // Owners filter
    if (selectedOwners.length > 0) {
      result = result.filter(car => {
        if (!car.ownership) return false;
        const carStr = car.ownership.toLowerCase().trim();
        return selectedOwners.some(sel => {
          const selStr = sel.toLowerCase().trim();
          const selShort = selStr.replace(' owner', '').trim();
          const carShort = carStr.replace(' owner', '').trim();
          return carStr === selStr || carShort === selShort || carStr.includes(selShort) || selStr.includes(carShort);
        });
      });
    }

    // Transmission filter
    if (selectedTransmissions.length > 0) {
      result = result.filter(car => selectedTransmissions.includes(car.transmission));
    }

    // Mileage filter
    if (maxMileage !== null) {
      result = result.filter(car => car.mileage <= maxMileage);
    }
    
    // Fuel type filter
    if (selectedFuelTypes.length > 0) {
      result = result.filter(car => selectedFuelTypes.includes(car.fuelType));
    }
    
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'mileage') {
      result.sort((a, b) => a.mileage - b.mileage);
    }
    
    return result;
  }, [vehicles, searchTerm, sortBy, budgetIndex, selectedOwners, selectedTransmissions, maxMileage, selectedFuelTypes]);

  const toggleOwner = (owner: string) => {
    setSelectedOwners(prev => prev.includes(owner) ? prev.filter(o => o !== owner) : [...prev, owner]);
  };

  const toggleTransmission = (transmission: string) => {
    setSelectedTransmissions(prev => prev.includes(transmission) ? prev.filter(t => t !== transmission) : [...prev, transmission]);
  };

  const toggleFuel = (fuel: string) => {
    setSelectedFuelTypes(prev => prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]);
  };

  const resetFilters = () => {
    setBudgetIndex(BUDGET_OPTIONS.length - 1);
    setSelectedOwners([]);
    setSelectedTransmissions([]);
    setMaxMileage(null);
    setSelectedFuelTypes([]);
    setSearchTerm('');
    setSortBy('newest');
  };

  const ALL_OWNERS = ['1st Owner', '2nd Owner', '3rd Owner', '4th+ Owner', '1st', '2nd', '3rd', '4th+']; // Match formats
  const ALL_TRANSMISSIONS = ['Automatic', 'Manual'];
  const ALL_FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'];

  return (
    <div className="min-h-screen bg-transparent text-gray-900 py-8 md:py-12 font-sans z-10 relative">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-gray-300 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-950 tracking-tight uppercase">
              Pre-Owned Car Collection
            </h1>
            <p className="text-gray-800 mt-2 tracking-wide text-xs md:text-sm font-semibold">
              Explore <span className="text-[#0057D9] font-black">{filteredCars.length}</span> Verified Quality Pre-Owned Cars at <span className="text-gray-950 font-extrabold">V C P MOTORS, Vashi, Navi Mumbai</span>
            </p>
          </div>
          
          <div className="w-full md:w-auto font-mono text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" 
                placeholder="SEARCH MAKE OR MODEL..." 
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-400 rounded-xl text-xs font-bold tracking-wider uppercase text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-[#0057D9] focus:ring-2 focus:ring-[#0057D9]/20 transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 font-mono">
          <button 
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center justify-between w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 font-extrabold tracking-wider text-xs uppercase hover:border-[#0057D9] transition-colors shadow-md"
          >
            <div className="flex items-center"><Filter className="w-4 h-4 mr-3 text-[#0057D9]" /> Filters and Sort</div>
            <span className="text-xs text-gray-700 font-bold uppercase">{isMobileFiltersOpen ? 'Close' : 'Expand'}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`w-full lg:w-72 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="p-6 border border-gray-300 bg-white rounded-2xl shadow-xl sticky top-28">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-300">
                <h3 className="font-extrabold tracking-wider text-gray-950 flex items-center uppercase text-xs font-mono"><Filter className="w-4 h-4 mr-2 text-[#0057D9]" /> Filters & Sort</h3>
                <button onClick={resetFilters} className="text-xs tracking-wider uppercase text-gray-700 hover:text-[#0057D9] transition-colors font-black font-mono bg-gray-100 hover:bg-blue-50 px-2.5 py-1 rounded-md">Reset</button>
              </div>
              
              <div className="space-y-6 text-gray-900">
                {/* Sort By */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-900 mb-2.5 font-black font-mono border-b border-gray-200 pb-1">
                    Sort By
                  </h4>
                  <div className="relative">
                    <select 
                      className="w-full bg-gray-50 border border-gray-400 text-xs tracking-wider text-gray-950 font-bold uppercase rounded-xl px-3.5 py-3 outline-none focus:border-[#0057D9] transition-colors block shadow-sm font-mono cursor-pointer"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="mileage">KM: Low to High</option>
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs uppercase tracking-wider text-gray-900 font-black font-mono">Max Budget</h4>
                    <span className="text-xs text-[#0057D9] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 tracking-wider font-extrabold font-mono">
                      {budgetIndex === 0
                        ? 'Below ₹ 10 Lakh'
                        : budgetIndex === BUDGET_OPTIONS.length - 1
                          ? '50 Lakh+'
                          : `Under ₹ ${(BUDGET_OPTIONS[budgetIndex] / 100000).toFixed(0)} Lakh`}
                    </span>
                  </div>
                  <div className="px-1">
                    <input 
                      type="range" 
                      min="0" 
                      max={BUDGET_OPTIONS.length - 1} 
                      step="1"
                      value={budgetIndex} 
                      onChange={(e) => setBudgetIndex(parseInt(e.target.value))}
                      className="w-full accent-[#0057D9] h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Owners */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-900 mb-3 font-black font-mono border-b border-gray-200 pb-1.5">
                    Ownership
                  </h4>
                  <div className="space-y-2.5">
                    {['1st Owner', '2nd Owner', '3rd Owner'].map(owner => {
                      const isSelected = selectedOwners.includes(owner);
                      return (
                        <label key={owner} className="flex items-center space-x-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-400 text-[#0057D9] focus:ring-[#0057D9] cursor-pointer" 
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                setSelectedOwners(prev => prev.filter(o => o !== owner));
                              } else {
                                setSelectedOwners(prev => [...prev, owner]);
                              }
                            }}
                          />
                          <span className={`text-xs tracking-wide transition-colors ${isSelected ? 'text-[#0057D9] font-black' : 'text-gray-900 font-bold group-hover:text-[#0057D9]'}`}>{owner}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-900 mb-3 font-black font-mono border-b border-gray-200 pb-1.5">
                    Transmission
                  </h4>
                  <div className="space-y-2.5">
                    {ALL_TRANSMISSIONS.map(trans => {
                      const isSelected = selectedTransmissions.includes(trans);
                      return (
                        <label key={trans} className="flex items-center space-x-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-400 text-[#0057D9] focus:ring-[#0057D9] cursor-pointer" 
                            checked={isSelected}
                            onChange={() => toggleTransmission(trans)}
                          />
                          <span className={`text-xs tracking-wide transition-colors ${isSelected ? 'text-[#0057D9] font-black' : 'text-gray-900 font-bold group-hover:text-[#0057D9]'}`}>{trans}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Mileage slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs uppercase tracking-wider text-gray-900 font-black font-mono">Max Mileage</h4>
                    <span className="text-xs text-[#0057D9] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 tracking-wider font-extrabold font-mono">
                      {maxMileage === null ? 'Any' : `${maxMileage.toLocaleString()} KM`}
                    </span>
                  </div>
                  <div className="px-1">
                    <input 
                      type="range" 
                      min="0" 
                      max="300000" 
                      step="5000"
                      value={maxMileage === null ? 300000 : maxMileage} 
                      onChange={(e) => setMaxMileage(parseInt(e.target.value))}
                      className="w-full accent-[#0057D9] h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Fuel Types */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-900 mb-3 font-black font-mono border-b border-gray-200 pb-1.5">
                    Fuel Type
                  </h4>
                  <div className="space-y-2.5">
                    {ALL_FUELS.map(fuel => {
                      const isSelected = selectedFuelTypes.includes(fuel);
                      return (
                        <label key={fuel} className="flex items-center space-x-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-400 text-[#0057D9] focus:ring-[#0057D9] cursor-pointer" 
                            checked={isSelected}
                            onChange={() => toggleFuel(fuel)}
                          />
                          <span className={`text-xs tracking-wide transition-colors ${isSelected ? 'text-[#0057D9] font-black' : 'text-gray-900 font-bold group-hover:text-[#0057D9]'}`}>{fuel}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Listing Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {loading ? (
                [1, 2, 3, 4].map((num) => (
                  <div key={num} className="bg-white border border-gray-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-[380px] sm:h-[460px] animate-pulse flex flex-col justify-between shadow-md">
                    <div className="w-full h-40 sm:h-56 bg-gray-200 rounded-lg sm:rounded-xl mb-4 sm:mb-6"></div>
                    <div className="space-y-3 flex-grow">
                      <div className="h-5 w-2/3 bg-gray-200 rounded-md"></div>
                      <div className="h-3 w-1/3 bg-gray-200 rounded-md"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded-md mt-3"></div>
                    </div>
                    <div className="h-9 sm:h-10 w-full bg-gray-200 rounded-lg sm:rounded-xl mt-4 sm:mt-6"></div>
                  </div>
                ))
              ) : filteredCars.length > 0 ? (
                filteredCars.map((car) => {
                  return (
                    <Link key={car.id} to={`/inventory/${car.id}`} className="group block h-full">
                      <div className="bg-white border border-gray-300 hover:border-[#0057D9] hover:shadow-2xl transition-all duration-300 ease-out flex flex-col h-full overflow-hidden rounded-xl sm:rounded-2xl shadow-md hover:-translate-y-1">
                        <div className="relative aspect-[16/10] sm:aspect-video md:aspect-auto md:h-64 overflow-hidden bg-gray-900/10 animate-fade-in">
                          {car.images?.[0] ? (
                            <img src={car.images[0]} alt={`${car.make} ${car.model}`} loading="lazy" className="w-full h-full object-contain bg-slate-900/5 transition-transform duration-500 ease-out group-hover:scale-[1.05]" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-200 p-3 font-mono text-center">
                              <Car className="w-8 h-8 sm:w-10 sm:h-10 mb-1.5 text-[#0057D9]" />
                              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">V C P MOTORS</span>
                              <span className="text-[9px] sm:text-[10px] text-gray-300 mt-0.5 font-bold">Photo Coming Soon</span>
                            </div>
                          )}
                          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-slate-950/90 text-white border border-slate-700/80 px-2.5 py-1 sm:px-3 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-black tracking-widest font-mono shadow-md">
                            {car.year}
                          </div>
                          {car.instagramReel && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(car.instagramReel, '_blank', 'noopener,noreferrer');
                              }}
                              className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white border border-white/30 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-md sm:rounded-lg text-[8px] sm:text-[9px] font-black tracking-widest font-mono shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1 sm:gap-1.5 z-10"
                            >
                              <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> WATCH REEL
                            </button>
                          )}
                        </div>
                        <div className="p-4 sm:p-6 md:p-7 flex-grow flex flex-col justify-between text-gray-900 bg-white">
                          <div>
                            <div className="mb-3 text-center">
                              <h3 className="text-xl sm:text-2xl font-black text-gray-950 group-hover:text-[#0057D9] transition-colors mb-1 font-sans tracking-tight">
                                {car.make} <span className="font-extrabold text-gray-800">{car.model}</span>
                              </h3>
                              <p className="inline-block text-[10px] sm:text-xs tracking-wider uppercase text-gray-800 font-mono font-extrabold bg-gray-100 px-2.5 py-0.5 rounded-md border border-gray-200 mt-0.5">{car.variant}</p>
                            </div>
                            <div className="text-2xl sm:text-3xl font-black text-center text-[#0057D9] mb-4 pb-4 border-b border-gray-200 font-mono tracking-tight">
                              {formatPrice(car.price)}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex flex-wrap justify-center gap-2 text-xs font-bold text-gray-900 mb-5 font-sans">
                              <div className="flex items-center bg-slate-100 text-slate-900 border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-2xs"><Gauge className="w-3.5 h-3.5 mr-1.5 text-[#0057D9] shrink-0" /> {car.mileage.toLocaleString()} KM</div>
                              <div className="flex items-center bg-slate-100 text-slate-900 border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-2xs"><Fuel className="w-3.5 h-3.5 mr-1.5 text-[#0057D9] shrink-0" /> {car.fuelType}</div>
                              <div className="flex items-center bg-slate-100 text-slate-900 border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-2xs"><Cog className="w-3.5 h-3.5 mr-1.5 text-[#0057D9] shrink-0" /> {car.transmission}</div>
                            </div>
                            
                            <div className="w-full uppercase tracking-wider text-white text-xs font-black text-center py-3 bg-[#0057D9] group-hover:bg-[#0042A5] transition-all duration-300 rounded-xl font-mono shadow-md">
                              Explore Specs & Details ↗
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full border border-gray-300 bg-white rounded-2xl py-16 px-6 text-center font-mono uppercase text-xs tracking-widest text-gray-800 font-bold shadow-md">
                  No matching vehicles found in the showroom inventory.
                </div>
              )}
            </div>
            
            {filteredCars.length > 0 && (
              <div className="mt-12 flex justify-center border-t border-gray-300 pt-8">
                 <div className="flex items-center space-x-4">
                     <button className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-400 text-xs tracking-wider uppercase disabled:opacity-50 font-bold font-mono bg-white" disabled>Previous</button>
                     <span className="text-gray-900 text-xs tracking-widest font-mono font-black">1 / 1</span>
                     <button className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-400 text-xs tracking-wider uppercase disabled:opacity-50 font-bold font-mono bg-white" disabled>Next</button>
                 </div>
              </div>
            )}
            
            {filteredCars.length === 0 && (
              <div className="text-center py-24 border border-gray-300 bg-white rounded-2xl flex flex-col items-center shadow-md">
                <div className="w-16 h-16 border border-gray-300 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Car className="w-7 h-7 text-[#0057D9]" />
                </div>
                <h3 className="text-xl font-black text-gray-950 mb-1">No Vehicles Found</h3>
                <p className="text-gray-700 uppercase tracking-widest text-xs font-mono font-bold">Please refine your filter selection</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
