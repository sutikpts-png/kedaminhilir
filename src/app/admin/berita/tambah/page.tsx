'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function TambahBerita() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Pengumuman',
    konten: '',
    gambar_url: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    // Generate simple slug
    const slug = formData.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    let finalGambarUrl = formData.gambar_url;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('gambar')
        .upload(fileName, file);

      if (uploadError) {
        alert('Gagal mengupload gambar: ' + uploadError.message + '\n\nPastikan bucket "gambar" sudah dibuat dan public di Supabase!');
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('gambar').getPublicUrl(fileName);
      finalGambarUrl = data.publicUrl;
    }

    const { error } = await supabase.from('berita').insert([
      { ...formData, slug, gambar_url: finalGambarUrl }
    ]);

    setLoading(false);

    if (error) {
      alert('Gagal menambah berita: ' + error.message);
    } else {
      router.push('/admin/berita');
      router.refresh();
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/berita" className="text-gray-500 hover:text-green-700">
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Berita Baru</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Berita</label>
            <input 
              type="text" name="judul" required 
              value={formData.judul} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
            <select 
              name="kategori" required 
              value={formData.kategori} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="Kegiatan">Kegiatan</option>
              <option value="Pengumuman">Pengumuman</option>
              <option value="Infrastruktur">Infrastruktur</option>
              <option value="Sosial">Sosial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Gambar (Opsional)</label>
            <input 
              type="file" accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                } else {
                  setFile(null);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Konten Berita</label>
            <textarea 
              name="konten" required rows={8}
              value={formData.konten} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none" 
            ></textarea>
          </div>
          <div className="flex justify-end pt-4">
            <button 
              type="submit" disabled={loading}
              className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Berita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
