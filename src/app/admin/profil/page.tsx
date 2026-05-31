'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function EditProfil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    sejarah: '',
    visi: '',
    misi: '',
    wilayah: '',
    struktur_organisasi_url: ''
  });

  useEffect(() => {
    async function fetchProfil() {
      const { data, error } = await supabase.from('profil').select('*').single();
      if (data) {
        setFormData({
          sejarah: data.sejarah || '',
          visi: data.visi || '',
          misi: data.misi || '',
          wilayah: data.wilayah || '',
          struktur_organisasi_url: data.struktur_organisasi_url || ''
        });
      } else if (error && error.code !== 'PGRST116') {
        // Not found error (PGRST116) is fine, it means empty table
        setMessage({ text: 'Gagal mengambil data profil', type: 'error' });
      }
      setLoading(false);
    }
    fetchProfil();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    // Check if row exists
    const { data: existingData } = await supabase.from('profil').select('id').single();

    let result;
    if (existingData) {
      result = await supabase.from('profil').update(formData).eq('id', existingData.id);
    } else {
      result = await supabase.from('profil').insert([formData]);
    }

    if (result.error) {
      setMessage({ text: 'Gagal menyimpan profil: ' + result.error.message, type: 'error' });
    } else {
      setMessage({ text: 'Profil berhasil disimpan!', type: 'success' });
      router.refresh();
    }
    setSaving(false);
  };

  if (loading) return <div>Memuat data profil...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengelolaan Profil Kelurahan</h1>
          <p className="text-gray-600 text-sm mt-1">Data ini akan ditampilkan pada Halaman Utama &gt; Profil Kelurahan.</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sejarah Kelurahan</label>
            <p className="text-xs text-gray-500 mb-2">Gunakan tag HTML dasar jika perlu (misal: &lt;p&gt;, &lt;br&gt;, &lt;b&gt;).</p>
            <textarea 
              name="sejarah" required rows={5}
              value={formData.sejarah} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Visi</label>
            <textarea 
              name="visi" required rows={2}
              value={formData.visi} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Misi</label>
            <p className="text-xs text-gray-500 mb-2">Pisahkan setiap misi dengan enter atau HTML list &lt;ol&gt; &lt;li&gt;.</p>
            <textarea 
              name="misi" required rows={5}
              value={formData.misi} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data Batas Wilayah</label>
            <textarea 
              name="wilayah" required rows={3}
              value={formData.wilayah} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Link URL Gambar Struktur Organisasi (Opsional)</label>
            <p className="text-xs text-gray-500 mb-2">Upload gambar struktur ke web luar (seperti Imgur) lalu paste linknya di sini.</p>
            <input 
              type="url" name="struktur_organisasi_url" 
              value={formData.struktur_organisasi_url} onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="submit" 
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
