'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function PengelolaanKontak() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    alamat: '',
    telepon: '',
    email: '',
    jam_operasional: '',
    link_facebook: '',
    link_instagram: '',
    link_youtube: '',
    gmaps_iframe: '',
    link_gmaps: ''
  });

  useEffect(() => {
    async function fetchKontak() {
      // Kita mengambil data dari tabel pengaturan_web agar 100% sinkron
      const { data, error } = await supabase.from('pengaturan_web').select('*').eq('id', 1).single();
      if (data) {
        setFormData({
          alamat: data.alamat || '',
          telepon: data.telepon || '',
          email: data.email || '',
          jam_operasional: data.jam_operasional || '',
          link_facebook: data.link_facebook || '',
          link_instagram: data.link_instagram || '',
          link_youtube: data.link_youtube || '',
          gmaps_iframe: data.gmaps_iframe || '',
          link_gmaps: data.link_gmaps || ''
        });
      }
      setLoading(false);
    }
    fetchKontak();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    // Update ke tabel pengaturan_web (semua info kontak ada di sini)
    const { error } = await supabase.from('pengaturan_web').update(formData).eq('id', 1);

    if (error) {
      setMessage({ text: 'Gagal menyimpan kontak: ' + error.message, type: 'error' });
    } else {
      setMessage({ text: 'Informasi Kontak berhasil disimpan! Halaman frontend sudah sinkron.', type: 'success' });
      router.refresh();
    }
    setSaving(false);
  };

  if (loading) return <div>Memuat data kontak...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pengelolaan Informasi Kontak</h1>
        <p className="text-gray-600 text-sm mt-1">Ubah informasi kontak di bawah ini. Data akan langsung terupdate di halaman Kontak, Header, dan Footer website.</p>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Kantor Lengkap</label>
              <textarea 
                name="alamat" required rows={2}
                value={formData.alamat} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
              <input 
                type="text" name="telepon" required
                value={formData.telepon} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input 
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Jam Layanan / Operasional</label>
              <input 
                type="text" name="jam_operasional" required
                value={formData.jam_operasional} onChange={handleChange}
                placeholder="Senin - Jumat: 08.00 - 15.00 WIB"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>
            
            <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Media Sosial</h3>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link Facebook</label>
              <input 
                type="text" name="link_facebook"
                value={formData.link_facebook} onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link Instagram</label>
              <input 
                type="text" name="link_instagram"
                value={formData.link_instagram} onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link YouTube</label>
              <input 
                type="text" name="link_youtube"
                value={formData.link_youtube} onChange={handleChange}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>
            
            <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Google Maps</h3>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link Buka di Google Maps</label>
              <input 
                type="text" name="link_gmaps"
                value={formData.link_gmaps} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Iframe URL (embed src="...")</label>
              <input 
                type="text" name="gmaps_iframe" required
                value={formData.gmaps_iframe} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={saving}
              className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Informasi Kontak'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
