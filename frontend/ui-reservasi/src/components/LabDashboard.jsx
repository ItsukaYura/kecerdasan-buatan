import React, { useState, useEffect } from 'react';

export default function LabDashboard({ labName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tanggal default: hari ini, format YYYY-MM-DD (sesuai yang dibutuhkan backend)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  useEffect(() => {
    setLoading(true);

    // --- BAGIAN YANG DISESUAIKAN ---
    // GANTI URL INI dengan domain Railway kamu (tanpa tanda / di akhir)
    const apiUrl = import.meta.env.VITE_API_URL || 'https://kecerdasan-buatan-production.up.railway.app';

    const headers = {};
    if (import.meta.env.VITE_API_TOKEN) {
      headers['Authorization'] = `Bearer ${import.meta.env.VITE_API_TOKEN}`;
    }

    fetch(`${apiUrl}/api/lab/${encodeURIComponent(labName)}?tanggal=${selectedDate}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal fetch lab:', err);
        setData(null);
        setLoading(false);
      });
  }, [labName, selectedDate]);

  const statusColor = data?.status === 'Tersedia' ? 'bg-green-100 text-green-700'
    : data?.status === 'Penuh' ? 'bg-red-100 text-red-700'
    : 'bg-yellow-100 text-yellow-700';

  return (
    <div className="flex-1 bg-[#FAFBFF] p-10 overflow-y-auto h-full flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white p-8 rounded-3xl shadow-sm border border-gray-200 mt-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{labName}</h2>
            {data && <p className="text-sm text-gray-400 mt-1">{data.tanggal_format}</p>}
          </div>
          {data && (
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${statusColor}`}>
              {data.status}
            </span>
          )}
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-3 mb-6">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Pilih Tanggal
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-800 font-medium outline-none focus:ring-2 ring-blue-200"
          />
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold text-sm transition-colors"
          >
            Hari Ini
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-lg font-semibold">
            Memuat data...
          </div>
        ) : !data ? (
          <div className="text-center py-12 text-red-400 text-lg font-semibold">
            Gagal memuat data.
          </div>
        ) : (
          <>
            {data.bookings.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-medium">
                Belum ada booking pada tanggal ini.
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daftar Booking</p>
                {data.bookings.map((b, i) => (
                  <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">NIM/NIDN</p>
                        <p className="font-bold text-lg text-gray-800">{b.nim_nidn}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Waktu</p>
                        <p className="font-bold text-lg text-gray-800">{b.jam_mulai} - {b.jam_selesai}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Kegiatan</p>
                        <p className="font-bold text-lg text-gray-800">{b.nama_kegiatan}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data.slot_tersedia && data.slot_tersedia.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Slot Kosong</p>
                <div className="flex flex-wrap gap-2">
                  {data.slot_tersedia.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}