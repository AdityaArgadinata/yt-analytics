"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

interface CouponActivationProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CouponActivation({ onClose, onSuccess }: CouponActivationProps) {
  const { user } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleActivateCoupon = async () => {
    if (!user || !couponCode.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      // Check if user already has an active subscription
      const userRef = doc(db!, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.subscription?.status === 'active' && userData.subscription?.expiresAt > new Date()) {
          setError('Anda sudah memiliki langganan aktif!');
          setLoading(false);
          return;
        }
      }

      // Validate coupon against the coupons collection
      const couponsRef = collection(db!, 'coupons');
      const couponQuery = query(couponsRef, where('code', '==', couponCode.toUpperCase()));
      const couponSnapshot = await getDocs(couponQuery);
      
      if (couponSnapshot.empty) {
        setError('Kode kupon tidak valid atau tidak ditemukan');
        setLoading(false);
        return;
      }
      
      const couponDoc = couponSnapshot.docs[0];
      const couponData = couponDoc.data();
      
      // Check if coupon is already used
      if (couponData.isUsed) {
        setError('Kode kupon sudah pernah digunakan');
        setLoading(false);
        return;
      }
      
      // Check if coupon is expired
      const now = new Date();
      const expiresAt = couponData.expiresAt?.toDate();
      if (expiresAt && expiresAt < now) {
        setError('Kode kupon sudah kedaluwarsa');
        setLoading(false);
        return;
      }

      // Calculate expiry date (30 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      // Update coupon as used
      await updateDoc(doc(db!, 'coupons', couponDoc.id), {
        isUsed: true,
        usedBy: user.uid,
        usedByEmail: user.email,
        usedByName: user.displayName,
        usedAt: serverTimestamp()
      });

      // Update user subscription status
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        subscription: {
          status: 'active',
          plan: 'pro',
          activatedAt: serverTimestamp(),
          expiresAt: expiryDate,
          couponCode: couponCode.toUpperCase(),
        },
        lastUpdated: serverTimestamp(),
      }, { merge: true });

      onSuccess();
    } catch (err: unknown) {
      console.error('Error activating coupon:', err);
      setError('Gagal mengaktifkan kupon. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Aktifkan Kode Kupon</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-4">
            Masukkan kode kupon yang Anda terima via WhatsApp:
          </p>
          
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Contoh: YT123ABC"
            className="w-full px-4 py-4 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-center font-mono text-lg text-gray-900 placeholder:text-gray-400 transition-all"
            maxLength={10}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 border border-gray-300"
          >
            Batal
          </button>
          <button
            onClick={handleActivateCoupon}
            disabled={loading || !couponCode.trim()}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/25"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                  <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
                </svg>
                Mengaktifkan...
              </>
            ) : (
              'Aktifkan Kupon'
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-blue-600 text-xs">
            💡 <strong className="text-gray-900">Tips:</strong> Pastikan Anda sudah menghubungi WhatsApp untuk mendapatkan kode kupon yang valid.
          </p>
        </div>
      </div>
    </div>
  );
}
