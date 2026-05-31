'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function PengaturanWeb() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    telepon: '',
    email: '',
    nama_kelurahan: '',
    nama_kecamatan_kabupaten: '',
    logo_url: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image_url: '',
    alamat: '',
    jam_operasional: '',
    link_facebook: '',
    link_instagram: '',
    link_youtube: '',
    link_gmaps: '',
    gmaps_iframe: ''
  });

  useEffect(() => {
    fetchPengaturan();
  }, []);

  async function fetchPengaturan() {
    const { data, error } = await supabase
      .from('pengaturan_web')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (data) {
      setFormData(data);
    } else {
      console.error("Error fetching pengaturan:", error);
    }
    setFetching(false);
  }

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = formData.hero_image_url;
    let finalLogoUrl = formData.logo_url;

    // Upload Hero Image
    if (heroFile) {
      const fileExt = heroFile.name.split('.').pop();
      const fileName = `hero-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('gambar')
        .upload(fileName, heroFile);

      if (uploadError) {
        alert('Gagal mengupload gambar hero: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('gambar').getPublicUrl(fileName);
      finalImageUrl = data.publicUrl;
    }

    // Upload Logo Image
    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('gambar')
        .upload(fileName, logoFile);

      if (uploadError) {
        alert('Gagal mengupload gambar logo: ' + uploadError.message);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from('gambar').getPublicUrl(fileName);
      finalLogoUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from('pengaturan_web')
      .update({ ...formData, hero_image_url: finalImageUrl, logo_url: finalLogoUrl })
      .eq('id', 1);

    setLoading(false);

    if (error) {
      alert('Gagal menyimpan pengaturan: ' + error.message);
    } else {
      alert('Pengaturan berhasil disimpan!');
      fetchPengaturan(); // Refresh data to show new image URL if changed
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-gray-500">Memuat data pengaturan...</div>;
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Website</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* HEADER & KONTAK UMUM */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-green-800 mb-4 border-b pb-2">Header & Identitas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kelurahan</label>
              <input type="text" name="nama_kelurahan" required value={formData.nama_kelurahan} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Kecamatan & Kabupaten</label>
              <input type="text" name="nama_kecamatan_kabupaten" required value={formData.nama_kecamatan_kabupaten} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nomor Telepon</label>
              <input type="text" name="telepon" required value={formData.telepon} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
          </div>
          
          <div className="mt-5 border-t border-gray-100 pt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Logo Website (Format PNG Transparan Disarankan)</label>
            {formData.logo_url && (
              <div className="mb-2">
                <img src={formData.logo_url} alt="Logo Preview" className="h-16 w-auto object-contain bg-gray-100 rounded border p-1" />
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => { if (e.target.files) setLogoFile(e.target.files[0]); else setLogoFile(null); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah logo saat ini.</p>
          </div>
        </div>

        {/* HERO BANNER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-green-800 mb-4 border-b pb-2">Hero Banner (Halaman Utama)</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Hero (Mendukung HTML dasar seperti &lt;br/&gt; atau &lt;span&gt;)</label>
              <textarea name="hero_title" required rows={2} value={formData.hero_title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Sub-judul Hero</label>
              <textarea name="hero_subtitle" required rows={2} value={formData.hero_subtitle} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Background Image Hero</label>
              {formData.hero_image_url && (
                <div className="mb-2">
                  <img src={formData.hero_image_url} alt="Hero Preview" className="h-32 object-cover rounded border" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => { if (e.target.files) setHeroFile(e.target.files[0]); else setHeroFile(null); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
              <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah background image saat ini.</p>
            </div>
          </div>
        </div>

        {/* FOOTER & SOSMED */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-green-800 mb-4 border-b pb-2">Footer & Media Sosial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
              <textarea name="alamat" required rows={2} value={formData.alamat} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Jam Operasional</label>
              <input type="text" name="jam_operasional" required value={formData.jam_operasional} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link Facebook</label>
              <input type="text" name="link_facebook" value={formData.link_facebook} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link Instagram</label>
              <input type="text" name="link_instagram" value={formData.link_instagram} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Link YouTube</label>
              <input type="text" name="link_youtube" value={formData.link_youtube} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
          </div>
          
          <div className="space-y-5 border-t pt-5 border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL Google Maps (Opsional)</label>
              <input type="text" name="link_gmaps" value={formData.link_gmaps} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Iframe URL Google Maps (Untuk Footer)</label>
              <input type="text" name="gmaps_iframe" required value={formData.gmaps_iframe} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm" />
              <p className="text-xs text-gray-500 mt-1">Copy isi dari atribut src="..." saat Anda meng-embed Google Maps.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition">
            {loading ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  );
}
