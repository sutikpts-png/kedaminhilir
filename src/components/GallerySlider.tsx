'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function GallerySlider({ latestFoto, latestVideo }: { latestFoto: any[], latestVideo: any[] }) {
  return (
    <>
      <div className="mb-12">
        <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center"><i className="fas fa-camera mr-2 text-yellow-500"></i> Galeri Foto</h4>
        {(!latestFoto || latestFoto.length === 0) ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-400">Belum ada foto.</p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {latestFoto.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="relative group rounded-xl overflow-hidden shadow-sm aspect-square bg-gray-100 h-full">
                  <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-semibold truncate">{item.judul}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div>
        <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center"><i className="fas fa-video mr-2 text-yellow-500"></i> Galeri Video</h4>
        {(!latestVideo || latestVideo.length === 0) ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-400">Belum ada video.</p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {latestVideo.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white p-2 h-full flex flex-col">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden flex-shrink-0">
                    {item.gambar_url.includes('youtube.com') || item.gambar_url.includes('youtu.be') ? (
                      <iframe 
                        className="w-full h-full" 
                        src={item.gambar_url.includes('youtu.be') ? item.gambar_url.replace('youtu.be/', 'youtube.com/embed/') : item.gambar_url.replace('watch?v=', 'embed/')} 
                        allowFullScreen>
                      </iframe>
                    ) : (
                      <video src={item.gambar_url} controls className="w-full h-full object-contain"></video>
                    )}
                  </div>
                  <div className="p-3 flex-grow">
                    <p className="text-gray-900 font-bold text-sm line-clamp-2">{item.judul}</p>
                    {item.deskripsi && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.deskripsi}</p>}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  );
}
