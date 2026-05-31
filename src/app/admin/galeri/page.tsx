'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminGaleri() {
  const [galeri, setGaleri] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    fetchGaleri();
  }, []);

  async function fetchGaleri() {
    const { data, error } = await supabase
      .from('galeri')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setGaleri(data);
    setLoading(false);
  }

  async function hapusGaleri(id: string) {
    if (confirm('Yakin ingin menghapus media ini?')) {
      await supabase.from('galeri').delete().eq('id', id);
      fetchGaleri();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Galeri</h1>
        <Link href="/admin/galeri/tambah" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          <i className="fas fa-plus mr-2"></i> Tambah Media
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Memuat data...</div>
        ) : galeri.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Belum ada media di galeri.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galeri.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden group relative">
                <div className="relative cursor-pointer" onClick={() => setSelectedItem(item)}>
                  {item.kategori === 'Video' || item.gambar_url.match(/\.(mp4|webm|ogg)$/i) ? (
                    <div className="w-full h-40 relative bg-black">
                      <video src={item.gambar_url} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white/30 backdrop-blur rounded-full flex items-center justify-center text-white pointer-events-none">
                          <i className="fas fa-play text-xs"></i>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img src={item.gambar_url} alt={item.judul} className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300" />
                  )}
                </div>
                <div className="p-3 bg-white relative z-10">
                  <p className="text-xs font-bold text-green-700 mb-1">{item.kategori}</p>
                  <p className="text-sm font-semibold text-gray-900 truncate" title={item.judul}>{item.judul}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <Link 
                    href={`/admin/galeri/edit/${item.id}`}
                    className="bg-blue-500 text-white w-8 h-8 rounded-full shadow hover:bg-blue-600 flex items-center justify-center"
                  >
                    <i className="fas fa-edit text-xs"></i>
                  </Link>
                  <button 
                    onClick={() => hapusGaleri(item.id)}
                    className="bg-red-500 text-white w-8 h-8 rounded-full shadow hover:bg-red-600 flex items-center justify-center"
                  >
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10" onClick={() => setSelectedItem(null)}>
          <button 
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur transition z-10 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setSelectedItem(null); }}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          
          <div className="relative max-w-5xl w-full max-h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {selectedItem.kategori === 'Video' || selectedItem.gambar_url?.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={selectedItem.gambar_url} className="w-full max-h-[80vh] rounded-lg shadow-2xl bg-black" controls autoPlay playsInline />
            ) : (
              <img src={selectedItem.gambar_url} alt={selectedItem.judul} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
            )}
            
            <div className="mt-6 text-center text-white max-w-2xl">
              <span className="text-[10px] font-bold text-green-400 border border-green-400 px-2 py-0.5 rounded uppercase mb-2 inline-block">{selectedItem.kategori}</span>
              <h3 className="text-xl md:text-2xl font-bold">{selectedItem.judul}</h3>
              {selectedItem.deskripsi && <p className="text-gray-300 text-sm mt-2">{selectedItem.deskripsi}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
