"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface PricingCardProps {
  onActivateCode: () => void;
}

export default function PricingCard({ onActivateCode }: PricingCardProps) {
  const { user } = useAuth();
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const whatsappNumber = "+6285941927516";
  const messageTemplate = `Halo, saya ingin berlangganan YouTube Analytics Tools seharga Rp 20.000

Detail akun saya:
- Email: ${user?.email || 'belum login'}
- Nama: ${user?.displayName || 'belum ada nama'}

Mohon kirimkan kode kupon untuk mengaktifkan semua fitur. Terima kasih!`;

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(messageTemplate);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setShowWhatsAppModal(false);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-8 backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            YouTube Analytics Pro
          </h2>
          
          <p className="text-gray-600 mb-6 text-lg">
            Buka wawasan powerful untuk channel YouTube Anda
          </p>
          
          <div className="mb-8">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Rp 20.000
              </span>
              <span className="text-gray-600 text-lg">/ bulan</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Ditagih bulanan, batal kapan saja</p>
          </div>

          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-center gap-3 group">
              <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                Analisis channel tak terbatas
              </span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                Export ke Excel & CSV
              </span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                Analytics & chart lanjutan
              </span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                Cache hingga 100 video terbaru
              </span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
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
            <div className="space-y-4">
              <button
                onClick={() => setShowWhatsAppModal(true)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Dapatkan kode kupon Anda
              </button>
              
              <button
                onClick={onActivateCode}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 border border-gray-300 hover:border-gray-400 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Aktifkan kode kupon
              </button>
            </div>
          )}
        </div>
        
      </div>

      {/* Step-by-step pembelian - Panel terpisah */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 mt-6 shadow-lg">
        <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          Cara Berlangganan (3 Langkah Mudah)
        </h3>
        
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex items-start gap-4 group hover:bg-white/40 p-4 rounded-xl transition-all duration-200">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-800 mb-2 text-lg">Klik &quot;Dapatkan kode kupon&quot;</h4>
              <p className="text-emerald-700 leading-relaxed">
                Otomatis membuka WhatsApp dengan template pesan yang sudah disiapkan. 
                Data akun Anda akan otomatis terisi dalam pesan.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4 group hover:bg-white/40 p-4 rounded-xl transition-all duration-200">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-800 mb-2 text-lg">Transfer Rp 20.000</h4>
              <p className="text-emerald-700 leading-relaxed">
                Admin akan memberikan nomor rekening via WhatsApp. Transfer sesuai nominal 
                dan kirim bukti transfer untuk verifikasi cepat.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4 group hover:bg-white/40 p-4 rounded-xl transition-all duration-200">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-emerald-800 mb-2 text-lg">Aktifkan kode kupon</h4>
              <p className="text-emerald-700 leading-relaxed">
                Setelah transfer diverifikasi, admin akan mengirim kode kupon. 
                Masukkan kode tersebut untuk mengaktifkan semua fitur PRO.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/60 rounded-xl border border-emerald-300">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-emerald-800 mb-1">
                Informasi Penting:
              </p>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Waktu aktivasi: Maksimal 30 menit setelah transfer diterima</li>
                <li>• Berlaku 30 hari dari tanggal aktivasi</li>
                <li>• Dukungan WhatsApp prioritas 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Confirmation Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Konfirmasi Pembelian</h3>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Anda akan diarahkan ke WhatsApp untuk mengirim permintaan berlangganan.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-3">
                <strong className="text-gray-900">Pratinjau pesan:</strong>
              </p>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-700 whitespace-pre-line font-mono">
                  {messageTemplate}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors border border-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
              >
                Lanjutkan ke WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
