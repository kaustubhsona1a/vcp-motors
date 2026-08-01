import React, { useState, FormEvent, useRef, DragEvent, ChangeEvent } from 'react';
import { useVehicles } from '../context/VehicleContext';
import { uploadImageToStorage } from '../lib/supabase';
import imageCompression from 'browser-image-compression';
import { Camera, Image as ImageIcon, Upload, X, Loader2 } from 'lucide-react';

export default function SellCar() {
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { addLead } = useVehicles();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    name: '',
    phone: '',
    ownership: 'First',
    notes: ''
  });

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      const filesArray = Array.from(e.dataTransfer.files).filter((file: any) => file.type.startsWith('image/')) as File[];
      addFiles(filesArray);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const filesArray = Array.from(e.target.files).filter((file: any) => file.type.startsWith('image/')) as File[];
      addFiles(filesArray);
    }
  };

  const addFiles = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Create local blob URLs for immediate premium preview rendering
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...urls]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    // Clean up memory leaks for Object URLs
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUploads = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      try {
        const path = `leads/l_${Date.now()}`;
        // Attempt regular storage upload
        const url = await uploadImageToStorage(file, path, 'vehicle-images');
        urls.push(url);
        console.log('[LEAD UPLOAD SUCCESS]', url);
      } catch (err) {
        console.warn('[LEAD STORAGE UPLOAD FAIL] Storage bucket upload rejected/policy restricted. Using high-efficiency local Base64 compression:', err);
        try {
          // Efficient compressed webp fallback
          const options = {
            maxSizeMB: 0.08, // Target ~80kb budget limit to conserve database text spaces safely
            maxWidthOrHeight: 800,
            useWebWorker: true,
            fileType: 'image/webp'
          };
          const compressedBlob = await imageCompression(file, options);
          const base64Url = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(compressedBlob);
          });
          urls.push(base64Url);
        } catch (compressErr) {
          console.error('[LEAD EMBED ERROR] Failed fallback base64 converter:', compressErr);
        }
      }
    }
    return urls;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      // 1. Process all selected images
      const uploadedImageUrls = await handleImageUploads(selectedFiles);
      
      // 2. Format details and message
      const formattedMessage = `${formData.year} ${formData.make} ${formData.model} (${Number(formData.mileage).toLocaleString()} KM)\nOwnership: ${formData.ownership} Owner${formData.notes ? `\n\nNotes from Owner:\n${formData.notes}` : ''}`;
      
      // 3. Submit lead via useVehicles context hook
      await addLead({
        name: formData.name,
        phone: formData.phone,
        car: formattedMessage,
        images: uploadedImageUrls
      });
      
      setSubmitted(true);
    } catch (err) {
      console.error('Lead submission failure:', err);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({ make: '', model: '', year: '', mileage: '', name: '', phone: '', ownership: 'First', notes: '' });
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-transparent py-12 font-sans text-gray-800 z-10 relative">
      <div className="container mx-auto max-w-3xl px-4">
        
        <div className="text-center mb-12">
          <span className="text-[#0057D9] tracking-[0.2em] uppercase text-xs font-extrabold mb-3 block font-mono bg-blue-50 px-4 py-1.5 rounded-full inline-block border border-blue-100">
            Sell or List Your Car
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-4 mt-2">
            Sell Your Car To V C P MOTORS
          </h1>
          <p className="text-sm md:text-base text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Get an accurate market evaluation and hassle-free selling experience. Submit your car details below for an instant evaluation and commission consultation in Vashi, Navi Mumbai.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-10 sm:p-14 text-center">
            <div className="w-16 h-16 bg-blue-50 border border-blue-200 text-[#0057D9] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-[#111827] mb-2">Details Submitted Successfully!</h2>
            <p className="text-gray-600 mb-8 text-xs sm:text-sm leading-relaxed font-medium">Our team at V C P MOTORS will review your vehicle details and contact you shortly.</p>
            <button onClick={resetForm} className="px-8 py-3.5 bg-[#0057D9] hover:bg-[#2563EB] text-white rounded-xl uppercase tracking-wider text-xs font-bold transition-all duration-300 font-mono shadow-md">
              Submit Another Vehicle
            </button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div>
                <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#0057D9] mb-5 border-b border-gray-200 pb-3 font-mono">
                  1. Vehicle Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="make" className="block text-xs font-bold tracking-wide uppercase text-gray-700 font-mono">Brand / Make</label>
                    <input id="make" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0057D9] focus:bg-white transition-all font-sans" placeholder="e.g. Maruti, Hyundai, Honda, BMW" required />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="model" className="block text-xs font-bold tracking-wide uppercase text-gray-700 font-mono">Model Name</label>
                    <input id="model" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0057D9] focus:bg-white transition-all font-sans" placeholder="e.g. Swift, Creta, City" required />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="year" className="block text-xs font-bold tracking-wide uppercase text-gray-700 font-mono">Registration Year</label>
                    <input id="year" type="number" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0057D9] focus:bg-white transition-all font-sans" placeholder="e.g. 2021" required />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="mileage" className="block text-xs font-bold tracking-wide uppercase text-gray-700 font-mono">Odometer Reading (KM)</label>
                    <input id="mileage" type="number" value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0057D9] focus:bg-white transition-all font-sans" placeholder="e.g. 25000" required />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold tracking-wide uppercase text-gray-700 font-mono">Ownership History</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                      {['First', 'Second', 'Third', 'Fourth+'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({...formData, ownership: opt})}
                          className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                            formData.ownership === opt 
                              ? 'bg-[#0057D9] border-[#0057D9] text-white shadow-md'
                              : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-[#0057D9] hover:text-[#0057D9]'
                          }`}
                        >
                          {opt} Owner
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#0057D9] mb-5 border-b border-gray-200 pb-3 font-mono">
                  2. Owner Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="block text-xs font-bold tracking-wide uppercase text-gray-700 font-mono">Your Full Name</label>
                    <input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0057D9] focus:bg-white transition-all font-sans" placeholder="Enter your full name" required />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-xs font-bold tracking-wide uppercase text-gray-700 font-mono">Phone / WhatsApp Number</label>
                    <input id="phone" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0057D9] focus:bg-white transition-all font-sans" placeholder="+91 98200 00000" required />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="notes" className="block text-xs font-bold tracking-wide uppercase text-gray-700 font-mono">Additional Notes / Features (Optional)</label>
                <textarea id="notes" rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-[#0057D9] focus:bg-white transition-all font-sans" placeholder="e.g. Insurance active, fresh tires, complete service record..." />
              </div>

              <div>
                <h3 className="text-xs font-extrabold tracking-wider uppercase text-[#0057D9] mb-5 border-b border-gray-200 pb-3 font-mono">
                  3. Car Photos (Optional)
                </h3>
                
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                    isDragActive 
                      ? 'border-[#0057D9] bg-blue-50/50' 
                      : 'border-gray-300 bg-gray-50 hover:border-[#0057D9] hover:bg-blue-50/20'
                  }`}
                >
                  <input 
                    ref={fileInputRef}
                    id="lead-photos"
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                  <Upload className="w-8 h-8 text-[#0057D9] mb-2" />
                  <p className="text-gray-800 text-xs font-bold uppercase tracking-wider font-mono">Drag & Drop Car Photos Here</p>
                  <p className="text-gray-500 text-[11px] font-mono uppercase tracking-wider mt-1">or click to upload from device</p>
                </div>

                {/* Previews Grid */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {previewUrls.map((url, index) => (
                      <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                        <img 
                          src={url} 
                          alt={`Upload Preview ${index + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition-all"
                          title="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full bg-[#0057D9] hover:bg-[#2563EB] disabled:bg-gray-300 disabled:text-gray-500 text-white py-4 rounded-xl uppercase tracking-wider text-xs font-bold transition-all duration-300 font-mono shadow-md flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Submitting Vehicle Details...
                  </>
                ) : (
                  "Submit Vehicle For Evaluation"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
