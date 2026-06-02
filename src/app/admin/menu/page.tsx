'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminMenu() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    // Fetch all menus, ordered by urutan
    const { data, error } = await supabase
      .from('menu_navigasi')
      .select('*')
      .order('parent_id', { ascending: true, nullsFirst: true })
      .order('urutan', { ascending: true });
    
    if (data) {
      // Reorganize into parent-child structure for display
      const parentMenus = data.filter(m => !m.parent_id);
      const childMenus = data.filter(m => m.parent_id);
      
      const structuredMenus = parentMenus.map(parent => ({
        ...parent,
        children: childMenus.filter(child => child.parent_id === parent.id).sort((a, b) => a.urutan - b.urutan)
      })).sort((a, b) => a.urutan - b.urutan);

      setMenus(structuredMenus);
    }
    setLoading(false);
  }

  async function hapusMenu(id: string) {
    if (confirm('Yakin ingin menghapus menu ini? (Sub-menu juga akan terhapus)')) {
      await supabase.from('menu_navigasi').delete().eq('id', id);
      fetchMenus();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Menu Navigasi</h1>
        <Link href="/admin/menu/tambah" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          <i className="fas fa-plus mr-2"></i> Tambah Menu
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Memuat data...</div>
        ) : menus.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Belum ada menu yang ditambahkan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold">Nama <span className="text-blue-500 ml-1">▲</span></th>
                  <th scope="col" className="px-6 py-4 font-bold">Link <span className="text-gray-300 ml-1">◆</span></th>
                  <th scope="col" className="px-6 py-4 font-bold text-center">Aktif <span className="text-gray-300 ml-1">◆</span></th>
                  <th scope="col" className="px-6 py-4 font-bold text-center">Urutan <span className="text-gray-300 ml-1">◆</span></th>
                  <th scope="col" className="px-6 py-4 font-bold">Class <span className="text-gray-300 ml-1">◆</span></th>
                  <th scope="col" className="px-6 py-4 font-bold">Icon <span className="text-gray-300 ml-1">◆</span></th>
                  <th scope="col" className="px-6 py-4 font-bold text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((parent) => {
                  const hasChildren = parent.children && parent.children.length > 0;
                  return (
                    <React.Fragment key={parent.id}>
                      <tr className="bg-white border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-6 py-3 font-medium text-gray-900">{parent.nama}</td>
                        <td className="px-6 py-3 text-gray-500">{parent.link}</td>
                        <td className="px-6 py-3 text-center text-gray-700">Y</td>
                        <td className="px-6 py-3 text-center text-gray-700">{parent.urutan}</td>
                        <td className="px-6 py-3 text-gray-500">{hasChildren ? 'dropdown' : ''}</td>
                        <td className="px-6 py-3 text-gray-500">{hasChildren ? 'fa fa-angle-down' : ''}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Link 
                              href={`/admin/menu/edit/${parent.id}`}
                              className="bg-gray-100 text-gray-700 w-8 h-8 rounded border border-gray-200 hover:bg-gray-200 flex items-center justify-center transition"
                              title="Edit"
                            >
                              <i className="fas fa-edit text-xs"></i>
                            </Link>
                            <button 
                              onClick={() => hapusMenu(parent.id)}
                              className="bg-gray-100 text-gray-700 w-8 h-8 rounded border border-gray-200 hover:bg-red-100 hover:text-red-600 hover:border-red-200 flex items-center justify-center transition"
                              title="Hapus"
                            >
                              <i className="fas fa-times text-xs"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* Render Children */}
                      {hasChildren && parent.children.map((child: any) => (
                        <tr key={child.id} className="bg-gray-50/50 border-b border-gray-100 hover:bg-gray-50 transition">
                          <td className="px-6 py-3 font-medium text-gray-600 pl-10 flex items-center gap-2">
                            <i className="fas fa-level-up-alt rotate-90 text-gray-300 text-xs"></i> {child.nama}
                          </td>
                          <td className="px-6 py-3 text-gray-500">{child.link}</td>
                          <td className="px-6 py-3 text-center text-gray-700">Y</td>
                          <td className="px-6 py-3 text-center text-gray-700">{child.urutan}</td>
                          <td className="px-6 py-3 text-gray-500"></td>
                          <td className="px-6 py-3 text-gray-500"></td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Link 
                                href={`/admin/menu/edit/${child.id}`}
                                className="bg-gray-100 text-gray-700 w-8 h-8 rounded border border-gray-200 hover:bg-gray-200 flex items-center justify-center transition"
                                title="Edit"
                              >
                                <i className="fas fa-edit text-xs"></i>
                              </Link>
                              <button 
                                onClick={() => hapusMenu(child.id)}
                                className="bg-gray-100 text-gray-700 w-8 h-8 rounded border border-gray-200 hover:bg-red-100 hover:text-red-600 hover:border-red-200 flex items-center justify-center transition"
                                title="Hapus"
                              >
                                <i className="fas fa-times text-xs"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
