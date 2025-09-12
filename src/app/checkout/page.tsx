"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const whatsappNumber = "+6285941927516";
  const messageTemplate = `Halo, saya ingin berlangganan YouTube Analytics Tools seharga Rp 20.000

Detail akun saya:
- Email: ${user?.email || 'belum login'}
- Nama: ${user?.displayName || 'belum ada nama'}

Mohon kirimkan kode kupon untuk mengaktifkan semua fitur. Terima kasih!`;

  const handleWhatsAppClick = () => {
    setIsRedirecting(true);
    const encodedMessage = encodeURIComponent(messageTemplate);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Redirect back to main page after a short delay
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white border border-amber-200 rounded-2xl p-8 max-w-md w-full shadow-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Diperlukan</h1>
            <p className="text-gray-600 mb-6">
              Anda perlu masuk terlebih dahulu untuk melakukan pembelian.
            </p>
            <button
              onClick={handleBackToHome}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
            <h1 className="text-xl font-bold text-gray-900">Detail Pembelian</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>
            
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">YouTube Analytics Pro</h3>
                <p className="text-sm text-gray-600">Langganan bulanan</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">Rp 20.000</div>
                <div className="text-sm text-gray-500">/ bulan</div>
              </div>
            </div>

            {/* Features included */}
            <div className="space-y-3 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Fitur yang Anda dapatkan:</h4>
              {[
                "Analisis channel tak terbatas",
                "Export ke Excel & CSV",
                "Analytics & chart lanjutan",
                "Cache hingga 100 video terbaru",
                "Dukungan WhatsApp prioritas"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* User Info */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Detail Akun:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900 font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nama:</span>
                  <span className="text-gray-900 font-medium">{user.displayName || 'Belum diatur'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Process */}
          <div className="space-y-6">
            {/* Step-by-step guide */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Cara Pembayaran</h2>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Hubungi WhatsApp</h3>
                    <p className="text-gray-600 mb-4">
                      Klik tombol di bawah untuk mengirim pesan otomatis ke admin dengan detail pembelian Anda.
                    </p>
                    <button
                      onClick={handleWhatsAppClick}
                      disabled={isRedirecting}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-500/25"
                    >
                      {isRedirecting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Mengalihkan...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                          Hubungi Admin WhatsApp
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Transfer Pembayaran</h3>
                    <p className="text-gray-600">
                      Admin akan memberikan nomor rekening. Transfer Rp 20.000 dan kirim bukti transfer untuk verifikasi cepat.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Dapatkan Kode Kupon</h3>
                    <p className="text-gray-600">
                      Setelah transfer diverifikasi, admin akan mengirim kode kupon untuk mengaktifkan fitur PRO.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold text-emerald-800 mb-2">Informasi Penting:</h3>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    <li>• Waktu aktivasi: Maksimal 30 menit setelah transfer diterima</li>
                    <li>• Berlaku 30 hari dari tanggal aktivasi</li>
                    <li>• Dukungan WhatsApp prioritas 24/7</li>
                    <li>• Tidak ada komitmen jangka panjang, bisa dibatalkan kapan saja</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
