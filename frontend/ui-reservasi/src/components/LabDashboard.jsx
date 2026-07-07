import React, { useState, useEffect } from 'react';

export default function LabDashboard({ labName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/lab/${encodeURIComponent(labName)}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [labName]);

  if (loading) {
    return (
      <div className="flex-1 bg-[#FAFBFF] p-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium">Memuat data laboratorium...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="flex-1 p-10 text-center text-red-500 font-bold">Gagal memuat data.</div>;

  const statusConfig = {
    'Tersedia': 'bg-green-50 text-green-700 border-green-200',
    'Penuh': 'bg-red-50 text-red-700 border-red-200',
    'Maintenance': 'bg-yellow-50 text-yellow-700 border-yellow-200'
  };

  return (
    <div className="flex-1 bg-[#FAFBFF] p-10 overflow-y-auto h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{data.lab_name}</h2>
            <p className="text-gray-500 mt-1 font-medium">{data.tanggal_format}</p>
          </div>
          <span className={`px-5 py-2 rounded-full text-sm font-bold border ${statusConfig[data.status] || 'bg-gray-50'}`}>
            {data.status}
          </span>
        </div>

        {/* Bookings Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            📋 Daftar Reservasi
          </h3>
          
          {data.bookings.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
              Belum ada reservasi aktif saat ini.
            </div>
          ) : (
            <div className="grid gap-4">
              {data.bookings.map((b, i) => (
                <div key={i} className="group p-6 bg-gray-50 hover:bg-blue-50/50 transition-all duration-300 rounded-2xl border border-gray-100 hover:border-blue-100">
                  <div className="grid grid-cols-3 gap-6">
                    <InfoItem label="NIM/NIDN" value={b.nim_nidn} />
                    <InfoItem label="Waktu" value={`${b.jam_mulai} - ${b.jam_selesai}`} />
                    <InfoItem label="Kegiatan" value={b.nama_kegiatan} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Slots Section */}
        {data.slot_tersedia?.length > 0 && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🕑 Slot Tersedia</h3>
            <div className="flex flex-wrap gap-3">
              {data.slot_tersedia.map((s, i) => (
                <span key={i} className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-100 hover:scale-105 transition-transform cursor-default">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Komponen Pembantu agar kode lebih bersih
function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
      <p className="font-bold text-gray-800 text-lg">{value}</p>
    </div>
  );
}