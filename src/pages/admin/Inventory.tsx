import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, Vehicle } from '../../data/mockData';
import { Search, Plus, Edit, Trash2, Car, AlertTriangle, X } from 'lucide-react';
import { useVehicles } from '../../context/VehicleContext';

export default function AdminInventory() {
  const { vehicles, updateVehicle, removeVehicle } = useVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  
  // Confirmation state for deleting a listing
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const confirmDelete = () => {
    if (vehicleToDelete) {
      removeVehicle(vehicleToDelete.id);
      setVehicleToDelete(null);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = (v.make + ' ' + v.model + ' ' + (v.registration || '')).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wider uppercase font-sans">Inventory Management</h1>
          <p className="text-zinc-400 text-xs mt-1.5 font-mono uppercase tracking-wider font-medium">Manage all vehicles in your premium dealership.</p>
        </div>
        <Link to="/dealer-management/inventory/add" className="inline-flex items-center px-6 py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-sans border border-transparent rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Link>
      </div>

      <div className="bg-[#0C0E12]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 bg-zinc-900/40">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search vehicles by make, model, or registry code..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-white transition-all font-mono"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="bg-zinc-950/80 border border-white/10 text-zinc-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-white transition-all font-mono uppercase tracking-wider cursor-pointer"
          >
            <option className="bg-zinc-950 text-white">All Statuses</option>
            <option className="bg-zinc-950 text-white">Available</option>
            <option className="bg-zinc-950 text-white">Sold</option>
            <option className="bg-zinc-950 text-white">Booked</option>
          </select>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-900/60 text-zinc-400 text-[10px] uppercase font-bold tracking-widest font-mono border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Reg. No</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-250 font-mono">
              {filteredVehicles.map(car => (
                <tr key={car.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {car.images?.[0] ? (
                        <img src={car.images[0]} alt="" className="w-16 h-12 object-cover rounded-lg border border-white/10 shadow-sm" />
                      ) : (
                        <div className="w-16 h-12 rounded-lg border border-white/10 bg-zinc-900 flex items-center justify-center text-zinc-500">
                          <Car className="w-5 h-5 text-[#0057D9]" />
                        </div>
                      )}
                      <div>
                        <p className="font-sans font-bold text-white text-sm">{car.make} {car.model}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-wider">{car.year} • {car.fuelType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300 font-bold">{car.registration || 'N/A'}</td>
                  <td className="px-6 py-4 font-sans font-bold text-white text-sm">{formatPrice(car.price)}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={car.status}
                      onChange={(e) => updateVehicle(car.id, { status: e.target.value as any })}
                      className={`px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider border outline-none cursor-pointer bg-zinc-950 focus:border-white transition-all ${
                        car.status === 'Available' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                        car.status === 'Sold' ? 'border-zinc-700 text-zinc-400 bg-zinc-900' :
                        'border-amber-500/30 text-amber-300 bg-amber-500/10'
                      }`}
                    >
                      <option value="Available" className="bg-zinc-950 text-white">Available</option>
                      <option value="Booked" className="bg-zinc-950 text-zinc-300">Booked</option>
                      <option value="Sold" className="bg-zinc-950 text-zinc-400">Sold</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/dealer-management/inventory/edit/${car.id}`} className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-white/10 border border-white/10 rounded-xl transition-all" title="Edit Vehicle">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => setVehicleToDelete(car)} 
                        className="p-2 text-zinc-400 hover:text-red-400 bg-zinc-900 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl transition-all"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Grid Layout */}
        <div className="block md:hidden divide-y divide-white/5">
          {filteredVehicles.map(car => (
            <div key={car.id} className="p-3.5 flex flex-col space-y-3">
              <div className="flex space-x-3 items-start">
                {car.images?.[0] ? (
                  <img 
                    src={car.images[0]} 
                    alt="" 
                    className="w-16 h-14 object-cover rounded-lg border border-white/10 shrink-0 shadow-sm" 
                  />
                ) : (
                  <div className="w-16 h-14 rounded-lg border border-white/10 bg-zinc-900 flex items-center justify-center text-zinc-500 shrink-0">
                    <Car className="w-5 h-5 text-[#0057D9]" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-sans font-extrabold text-white text-xs sm:text-sm truncate">{car.make} {car.model}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-mono uppercase tracking-wider">{car.year} • {car.fuelType}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="text-[9px] font-mono text-zinc-500">{car.registration || "N/A"}</span>
                    <span className="text-xs font-sans font-bold text-white">{formatPrice(car.price)}</span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons row */}
              <div className="flex items-center justify-between gap-2.5 pt-2.5 border-t border-white/5">
                <div className="flex-1">
                  <select 
                    value={car.status}
                    onChange={(e) => updateVehicle(car.id, { status: e.target.value as any })}
                    className={`w-full py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-widest border outline-none cursor-pointer bg-zinc-950 focus:border-white transition-all font-mono ${
                      car.status === 'Available' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                      car.status === 'Sold' ? 'border-zinc-700 text-zinc-400 bg-zinc-900' :
                      'border-amber-500/30 text-amber-300 bg-amber-500/10'
                    }`}
                  >
                    <option value="Available" className="bg-zinc-950 text-white">Available</option>
                    <option value="Booked" className="bg-zinc-950 text-zinc-300">Booked</option>
                    <option value="Sold" className="bg-zinc-950 text-zinc-400">Sold</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <Link to={`/dealer-management/inventory/edit/${car.id}`} className="p-2 text-zinc-300 hover:text-white bg-zinc-900 hover:bg-white/10 border border-white/10 rounded-xl transition-all" title="Edit Car">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => setVehicleToDelete(car)} 
                    className="p-2 text-zinc-300 hover:text-red-400 bg-zinc-900 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 rounded-xl transition-all" 
                    title="Delete Car"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="p-12 text-center text-zinc-500 font-mono text-xs uppercase tracking-wider">No luxury vehicles found matching criteria.</div>
        )}
      </div>

      {/* Confirmation Modal for Deleting Vehicle */}
      {vehicleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0C0E12] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-3 text-red-400 font-extrabold uppercase text-sm tracking-wider font-sans">
                <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <span>Confirm Deletion</span>
              </div>
              <button 
                onClick={() => setVehicleToDelete(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold font-sans text-white">
                Do you surely want to delete this listing?
              </p>
              <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                You are about to remove <strong className="text-white font-sans">{vehicleToDelete.make} {vehicleToDelete.model} ({vehicleToDelete.year})</strong> from the dealer inventory. This action cannot be reversed.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10 font-mono text-xs">
              <button
                type="button"
                onClick={() => setVehicleToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all uppercase tracking-wider font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all uppercase tracking-wider shadow-lg shadow-red-600/30"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

