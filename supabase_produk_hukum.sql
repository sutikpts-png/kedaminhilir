-- SQL Script untuk membuat tabel produk_hukum
-- Jalankan di SQL Editor Supabase

CREATE TABLE IF NOT EXISTS public.produk_hukum (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL,
    nomor_surat TEXT,
    tahun TEXT,
    file_url TEXT,
    tanggal_publikasi TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atur RLS (Row Level Security) agar tabel bisa diakses publik (Read-only)
ALTER TABLE public.produk_hukum ENABLE ROW LEVEL SECURITY;

-- Kebijakan (Policy) agar siapa saja bisa melihat produk hukum
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.produk_hukum FOR SELECT 
USING ( true );

-- Kebijakan (Policy) agar admin (authenticated) bisa insert, update, delete
-- (Jika Anda memiliki auth, jika tidak, Anda bisa membuka akses publik penuh untuk sementara)
CREATE POLICY "Enable insert for authenticated users only" 
ON public.produk_hukum FOR INSERT 
WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Enable update for authenticated users only" 
ON public.produk_hukum FOR UPDATE 
USING ( auth.role() = 'authenticated' );

CREATE POLICY "Enable delete for authenticated users only" 
ON public.produk_hukum FOR DELETE 
USING ( auth.role() = 'authenticated' );

-- JANGAN LUPA: 
-- Anda juga harus membuat BUCKET di menu Storage Supabase dengan nama: "dokumen"
-- Dan pastikan bucket "dokumen" tersebut di set "Public" agar file PDF bisa didownload.
