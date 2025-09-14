"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface PricingCardProps {
  onActivateCode: () => void;
}

export default function PricingCard({ onActivateCode }: PricingCardProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handlePurchaseClick = () => {
    if (!user) {
      // Redirect to login or show login modal
      alert('Silakan login terlebih dahulu untuk melakukan pembelian');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="font-apple">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mb-4 sm:mb-6 shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 sm:mb-3">
            YouTube Analytics Pro
          </h2>
          
          <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">
            Buka wawasan powerful untuk channel YouTube Anda
          </p>
          
          <div className="mb-6 sm:mb-8">
            <div className="flex items-baseline justify-center gap-1 sm:gap-2">
              <span className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Rp 20.000
              </span>
              <span className="text-gray-600 text-base sm:text-lg">/ bulan</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">Ditagih bulanan, batal kapan saja</p>
          </div>

                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-left">
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm sm:text-base">
                Analisis channel tak terbatas
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm sm:text-base">
                Export ke Excel & CSV
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm sm:text-base">
                Analytics & chart lanjutan
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm sm:text-base">
                Keyword & hashtag insights
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm sm:text-base">
                Cache hingga 100 video terbaru
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 group">
              <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm sm:text-base">
                Dukungan WhatsApp prioritas
              </span>
            </div>
          </div>

          {!user ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-amber-700 text-sm font-medium">
                  Masuk diperlukan untuk berlangganan
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={handlePurchaseClick}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 5.5M7 13h10m-10 0l4-8m6 8h.01M13 21a1 1 0 100-2 1 1 0 000 2zM21 21a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                Beli Sekarang
              </button>
              
              <button
                onClick={onActivateCode}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 border border-gray-300 hover:border-gray-400 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Aktivasi Code Kupon
              </button>
            </div>
          )}
        </div>
        
      </div>

      {/* Step-by-step pembelian - Panel terpisah */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 mt-4 sm:mt-6 shadow-lg">
        <h3 className="text-lg sm:text-xl font-bold text-emerald-800 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Cara Berlangganan (3 Langkah Mudah)
        </h3>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Step 1 */}
          <div className="flex items-start gap-3 sm:gap-4 group hover:bg-white/40 p-3 sm:p-4 rounded-xl transition-all duration-200">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-800 mb-1 sm:mb-2 text-base sm:text-lg">Klik &quot;Dapatkan kode kupon&quot;</h4>
              <p className="text-emerald-700 leading-relaxed text-sm sm:text-base">
                Otomatis membuka WhatsApp dengan template pesan yang sudah disiapkan. 
                Data akun Anda akan otomatis terisi dalam pesan.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 sm:gap-4 group hover:bg-white/40 p-3 sm:p-4 rounded-xl transition-all duration-200">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-800 mb-1 sm:mb-2 text-base sm:text-lg">Transfer Rp 20.000</h4>
              <p className="text-emerald-700 leading-relaxed text-sm sm:text-base">
                Admin akan memberikan nomor rekening via WhatsApp. Transfer sesuai nominal 
                dan kirim bukti transfer untuk verifikasi cepat.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 sm:gap-4 group hover:bg-white/40 p-3 sm:p-4 rounded-xl transition-all duration-200">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-800 mb-1 sm:mb-2 text-base sm:text-lg">Aktifkan kode kupon</h4>
              <p className="text-emerald-700 leading-relaxed text-sm sm:text-base">
                Setelah transfer diverifikasi, admin akan mengirim kode kupon. 
                Masukkan kode tersebut untuk mengaktifkan semua fitur PRO.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/60 rounded-xl border border-emerald-300">
          <div className="flex items-start gap-2 sm:gap-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-800 mb-1">
                Informasi Penting:
              </p>
              <ul className="text-xs sm:text-sm text-emerald-700 space-y-1">
                <li>• Waktu aktivasi: Maksimal 30 menit setelah transfer diterima</li>
                <li>• Berlaku 30 hari dari tanggal aktivasi</li>
                <li>• Dukungan WhatsApp prioritas 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
