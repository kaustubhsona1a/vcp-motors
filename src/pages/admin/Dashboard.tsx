import { Plus, ListFilter, Settings, Car, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { useVehicles } from '../../context/VehicleContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { vehicles, leads } = useVehicles();

  const activeCars = vehicles.filter(v => v.status === 'Available').length;
  const soldCars = vehicles.filter(v => v.status === 'Sold').length;
  const totalCatalog = vehicles.length;

  return (
    <div className="space-y-10 animate-fadeIn font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wider uppercase font-sans">
          DEALER DASHBOARD
        </h1>
        <p className="text-zinc-400 text-xs mt-1.5 font-mono uppercase tracking-wider font-medium">
          DIRECT MANAGEMENT OPTIONS FOR VEHICLE LISTINGS AND STUDIO SITE SETTINGS.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3 sm:mb-4">
          QUICK ACTIONS
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
          
          {/* Card 1: Upload Car */}
          <div className="bg-[#0C0E12]/90 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white mb-3 sm:mb-5 shadow-inner">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="font-extrabold text-white text-sm sm:text-base tracking-wider uppercase font-sans mb-1 sm:mb-2">
                UPLOAD CAR
              </h3>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-sans font-normal">
                Add a new vehicle with specs, pricing, and high-res photos.
              </p>
            </div>
            
            <div className="pt-3 sm:pt-6 mt-3 sm:mt-4 border-t border-white/5">
              <Link 
                to="/dealer-management/inventory/add" 
                className="inline-flex items-center text-[11px] sm:text-xs font-mono uppercase font-bold tracking-widest text-zinc-300 hover:text-white transition-colors group-hover:translate-x-1 duration-200"
              >
                ADD VEHICLE <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1.5 sm:ml-2" />
              </Link>
            </div>
          </div>

          {/* Card 2: View Inventory */}
          <div className="bg-[#0C0E12]/90 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white mb-3 sm:mb-5 shadow-inner">
                <ListFilter className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="font-extrabold text-white text-sm sm:text-base tracking-wider uppercase font-sans mb-1 sm:mb-2">
                VIEW INVENTORY
              </h3>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-sans font-normal">
                Browse, edit details, update status, or remove current vehicles.
              </p>
            </div>
            
            <div className="pt-3 sm:pt-6 mt-3 sm:mt-4 border-t border-white/5">
              <Link 
                to="/dealer-management/inventory" 
                className="inline-flex items-center text-[11px] sm:text-xs font-mono uppercase font-bold tracking-widest text-zinc-300 hover:text-white transition-colors group-hover:translate-x-1 duration-200"
              >
                MANAGE LIST <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1.5 sm:ml-2" />
              </Link>
            </div>
          </div>

          {/* Card 3: Site Settings */}
          <div className="bg-[#0C0E12]/90 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 p-4 sm:p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white mb-3 sm:mb-5 shadow-inner">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h3 className="font-extrabold text-white text-sm sm:text-base tracking-wider uppercase font-sans mb-1 sm:mb-2">
                SITE SETTINGS
              </h3>
              <p className="text-zinc-400 text-[11px] sm:text-xs leading-relaxed font-sans font-normal">
                Upload cover photos, service photos, accessory photos, & logo.
              </p>
            </div>
            
            <div className="pt-3 sm:pt-6 mt-3 sm:mt-4 border-t border-white/5">
              <Link 
                to="/dealer-management/settings" 
                className="inline-flex items-center text-[11px] sm:text-xs font-mono uppercase font-bold tracking-widest text-zinc-300 hover:text-white transition-colors group-hover:translate-x-1 duration-200"
              >
                EDIT SETTINGS <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1.5 sm:ml-2" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Inventory Summary */}
      <div>
        <h2 className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-bold mb-3 sm:mb-4">
          INVENTORY SUMMARY
        </h2>

        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          
          <div className="bg-[#0C0E12]/90 backdrop-blur-md p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center shadow-lg">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-2 sm:mb-0 sm:mr-4 text-white shrink-0">
              <Car className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-bold">ACTIVE</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-0.5 font-sans">{activeCars}</p>
            </div>
          </div>

          <div className="bg-[#0C0E12]/90 backdrop-blur-md p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center shadow-lg">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-2 sm:mb-0 sm:mr-4 text-white shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-bold">SOLD</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-0.5 font-sans">{soldCars}</p>
            </div>
          </div>

          <div className="bg-[#0C0E12]/90 backdrop-blur-md p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center shadow-lg">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-2 sm:mb-0 sm:mr-4 text-white shrink-0">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300" />
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-bold">CATALOG</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-0.5 font-sans">{totalCatalog}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-[#0C0E12]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h2 className="font-extrabold text-white text-base tracking-wider uppercase font-sans">
              RECENT LEADS
            </h2>
            <p className="text-zinc-400 text-xs mt-0.5 font-mono uppercase tracking-wider">
              LATEST CUSTOMER INQUIRIES AND TEST DRIVE REQUESTS
            </p>
          </div>
          
          <Link 
            to="/dealer-management/leads" 
            className="inline-flex items-center text-xs font-mono uppercase font-bold tracking-widest text-zinc-300 hover:text-white transition-colors"
          >
            VIEW ALL ({leads.length}) <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <div>
          {leads.length === 0 ? (
            <div className="p-10 text-center text-zinc-500 font-mono text-xs uppercase tracking-wider">
              No customer inquiries recorded yet.
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-900/60 text-zinc-400 text-[10px] uppercase font-bold tracking-widest font-mono border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">NAME</th>
                      <th className="px-6 py-4">PHONE / EMAIL</th>
                      <th className="px-6 py-4">VEHICLE INTEREST</th>
                      <th className="px-6 py-4">STATUS</th>
                      <th className="px-6 py-4">DATE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300 font-mono">
                    {leads.slice(0, 5).map(lead => (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-sans font-bold text-white text-sm">{lead.name}</td>
                        <td className="px-6 py-4 text-zinc-300">
                          <div>{lead.phone}</div>
                          {lead.email && <div className="text-[10px] text-zinc-500 font-sans">{lead.email}</div>}
                        </td>
                        <td className="px-6 py-4 text-zinc-200 max-w-xs truncate">{lead.car}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                            lead.status === 'New Lead' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            lead.status === 'Contacted' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                            'bg-zinc-800/80 text-zinc-400 border-zinc-700/50'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-400 text-[11px]">{lead.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="block md:hidden divide-y divide-white/5 font-mono text-xs">
                {leads.slice(0, 5).map(lead => (
                  <div key={lead.id} className="p-4 flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="font-sans font-bold text-white text-sm">{lead.name}</span>
                      <span className="text-[10px] text-zinc-500">{lead.date}</span>
                    </div>
                    <div className="text-zinc-300 text-xs">📞 {lead.phone}</div>
                    <div className="text-zinc-400 text-[11px] truncate">🚘 {lead.car}</div>
                    <div className="pt-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                        lead.status === 'New Lead' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        lead.status === 'Contacted' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                        'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}


