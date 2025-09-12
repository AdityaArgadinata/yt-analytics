"use client";
import { useSubscription } from '@/hooks/useSubscription';
import { useState } from 'react';

export default function SubscriptionStatus() {
  const { subscription, loading } = useSubscription();
  const [isExpanded, setIsExpanded] = useState(false);

  if (loading) {
    return (
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl p-4 mb-6 shadow-lg shadow-gray-200/20 animate-pulse font-apple">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded-lg w-1/3"></div>
          </div>
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (subscription.status === 'none') {
    return null;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (subscription.status === 'active') {
    const daysRemaining = getDaysRemaining(subscription.expiresAt!);
    const isNearExpiry = daysRemaining <= 7;
    
    return (
      <div className="bg-white/95 backdrop-blur-xl border border-emerald-200/60 rounded-2xl mb-6 shadow-lg shadow-emerald-100/20 hover:shadow-emerald-200/30 transition-all duration-300 overflow-hidden font-apple">
        {/* Compact Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-emerald-50/30 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full border border-white"></div>
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-sm">Langganan Aktif</h3>
              <p className="text-emerald-600 text-xs font-medium">
                {daysRemaining} hari tersisa
                {isNearExpiry && <span className="text-amber-600 ml-1">⚠️</span>}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
              PRO
            </div>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Expanded Details - Show/Hide */}
        <div className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="px-4 pb-4 border-t border-emerald-100/50">
            {/* Subscription Details */}
            <div className="bg-emerald-50/50 rounded-xl p-4 mt-4 space-y-3 border border-emerald-100/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm">Paket Berlangganan</span>
                <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100 text-sm">
                  YouTube Analytics Pro
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm">Tanggal Berakhir</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {formatDate(subscription.expiresAt!)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm">Sisa Waktu</span>
                <span className={`font-bold px-3 py-1 rounded-lg text-sm ${
                  isNearExpiry 
                    ? 'text-amber-700 bg-amber-100 border border-amber-200' 
                    : 'text-emerald-700 bg-emerald-100 border border-emerald-200'
                }`}>
                  {daysRemaining} hari tersisa
                </span>
              </div>
              
              {subscription.couponCode && (
                <div className="pt-2 border-t border-emerald-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium text-sm">Kode Kupon</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="font-mono text-sm font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200 tracking-wider">
                        {subscription.couponCode}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Warning for near expiry */}
            {isNearExpiry && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-amber-800 text-sm font-medium">
                    Langganan Anda akan segera berakhir. Perpanjang sekarang untuk tetap menikmati fitur premium.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (subscription.status === 'expired') {
    return (
      <div className="bg-white/95 backdrop-blur-xl border border-red-200/60 rounded-2xl mb-6 shadow-lg shadow-red-100/20 hover:shadow-red-200/30 transition-all duration-300 overflow-hidden font-apple">
        {/* Compact Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-red-50/30 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full border border-white"></div>
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 text-sm">Langganan Berakhir</h3>
              <p className="text-red-600 text-xs font-medium">Status Tidak Aktif</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
              EXPIRED
            </div>
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Expanded Details - Show/Hide */}
        <div className={`transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="px-4 pb-4 border-t border-red-100/50">
            {/* Expiry Details */}
            <div className="bg-red-50/50 rounded-xl p-4 mt-4 space-y-3 border border-red-100/50">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm">Tanggal Berakhir</span>
                <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100 text-sm">
                  {formatDate(subscription.expiresAt!)}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium text-sm">Status Langganan</span>
                <span className="font-bold px-3 py-1 rounded-lg text-red-700 bg-red-100 border border-red-200 text-sm">
                  Tidak Aktif
                </span>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/50 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800 mb-1 text-sm">Perpanjang Langganan Anda</h4>
                  <p className="text-red-700 text-sm leading-relaxed">
                    Langganan Anda telah berakhir. Perpanjang sekarang untuk kembali menggunakan semua fitur premium YouTube Analytics Pro dan mendapatkan wawasan mendalam tentang performa channel Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
