"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  where
} from 'firebase/firestore';

interface FirestoreTimestamp {
  toDate(): Date;
}

interface UserSubscription {
  id: string;
  email: string;
  displayName: string;
  subscription?: {
    status: string;
    plan: string;
    activatedAt: unknown;
    expiresAt: unknown;
    couponCode: string;
  };
}

interface Coupon {
  id: string;
  code: string;
  isUsed: boolean;
  usedBy?: string;
  usedByEmail?: string;
  usedByName?: string;
  usedAt?: unknown;
  createdAt: unknown;
  expiresAt: Date;
}

const ADMIN_EMAIL = "aditdevelop@gmail.com"; // Ganti dengan email admin Anda

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserSubscription[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newCouponCount, setNewCouponCount] = useState(5);
  const [activeTab, setActiveTab] = useState<'users' | 'coupons'>('users');

  // Check if user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
      fetchCoupons();
    } else if (!authLoading && user && !isAdmin) {
      // Redirect non-admin users
      window.location.href = '/';
    }
  }, [user, isAdmin, authLoading]);

  const fetchUsers = async () => {
    if (!db) return;
    
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('lastUpdated', 'desc'));
      const snapshot = await getDocs(q);
      
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserSubscription[];
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    if (!db) return;
    
    try {
      setCouponsLoading(true);
      const couponsRef = collection(db, 'coupons');
      const q = query(couponsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const couponsList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const couponData = docSnap.data();
          let usedByName = '';
          
          // If coupon is used, fetch user details
          if (couponData.isUsed && couponData.usedBy && db) {
            try {
              const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', couponData.usedByEmail)));
              if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                usedByName = userData.displayName || '';
              }
            } catch (error) {
              console.error('Error fetching user details for coupon:', error);
            }
          }
          
          return {
            id: docSnap.id,
            ...couponData,
            usedByName,
            expiresAt: couponData.expiresAt?.toDate() || new Date(),
            createdAt: couponData.createdAt?.toDate() || new Date(),
            usedAt: couponData.usedAt?.toDate()
          };
        })
      ) as Coupon[];
      
      setCoupons(couponsList);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setCouponsLoading(false);
    }
  };

  const generateCoupons = async () => {
    if (!isAdmin || !db) return;
    
    try {
      setGenerating(true);
      const couponsRef = collection(db, 'coupons');
      
      // Generate multiple coupons
      const promises = [];
      for (let i = 0; i < newCouponCount; i++) {
        const couponCode = generateCouponCode();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // 30 days validity
        
        promises.push(
          addDoc(couponsRef, {
            code: couponCode,
            isUsed: false,
            createdAt: serverTimestamp(),
            expiresAt: expiryDate
          })
        );
      }
      
      await Promise.all(promises);
      await fetchCoupons(); // Reload coupons
      setNewCouponCount(5); // Reset count
    } catch (error) {
      console.error('Error generating coupons:', error);
    } finally {
      setGenerating(false);
    }
  };

  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'YT';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const deleteCoupon = async (couponId: string) => {
    if (!isAdmin || !db) return;
    
    if (confirm('Apakah Anda yakin ingin menghapus kupon ini?')) {
      try {
        await deleteDoc(doc(db, 'coupons', couponId));
        await fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return '-';
    
    // Check if it's a Firestore timestamp
    const isFirestoreTimestamp = (obj: unknown): obj is FirestoreTimestamp => {
      return typeof obj === 'object' && obj !== null && 'toDate' in obj;
    };
    
    const date = isFirestoreTimestamp(timestamp) ? timestamp.toDate() : new Date(timestamp as string);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasValidTimestamp = (timestamp: unknown): boolean => {
    return timestamp !== null && timestamp !== undefined;
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized if not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600 mb-6">Anda tidak memiliki akses ke halaman admin.</p>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors block w-full"
            >
              Kembali ke Beranda
            </button>
            {!user && (
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors block w-full"
              >
                Login Dulu
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Kelola users dan kupon YouTube Analytics</p>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ← Kembali ke App
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-2xl mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'border-b-2 border-emerald-500 text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Users & Langganan
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'coupons'
                  ? 'border-b-2 border-emerald-500 text-emerald-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Manajemen Kupon
            </button>
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            {/* Users Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Langganan Aktif</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.subscription?.status === 'active').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Langganan Berakhir</p>
                    <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.subscription?.status === 'expired').length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Daftar Users</h2>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat users...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status Langganan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kode Kupon
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal Aktivasi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Berakhir
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user, index) => (
                        <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.displayName || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.subscription?.status === 'active' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Aktif
                              </span>
                            ) : user.subscription?.status === 'expired' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Berakhir
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Tidak Ada
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.subscription?.couponCode ? (
                              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                                {user.subscription.couponCode}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.subscription?.activatedAt ? formatDate(user.subscription.activatedAt) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.subscription?.expiresAt ? formatDate(user.subscription.expiresAt) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {users.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Belum ada users yang terdaftar.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <>
            {/* Generate Coupons */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Kupon Baru</h2>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Kupon
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newCouponCount}
                    onChange={(e) => setNewCouponCount(parseInt(e.target.value) || 1)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div className="flex-1">
                  <button
                    onClick={generateCoupons}
                    disabled={generating}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {generating ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                          <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Generate Kupon
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Coupons Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Kupon</p>
                    <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kupon Terpakai</p>
                    <p className="text-2xl font-bold text-gray-900">{coupons.filter(c => c.isUsed).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kupon Tersedia</p>
                    <p className="text-2xl font-bold text-gray-900">{coupons.filter(c => !c.isUsed).length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupons Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Daftar Kupon</h2>
              </div>
              
              {couponsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Memuat kupon...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kode Kupon
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Digunakan Oleh
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal Dibuat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Berakhir
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {coupons.map((coupon, index) => (
                        <tr key={coupon.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                              {coupon.code}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {coupon.isUsed ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Terpakai
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Tersedia
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {coupon.isUsed ? (
                              <div>
                                <div className="font-medium">{coupon.usedByName || 'Unknown User'}</div>
                                <div className="text-xs text-gray-500">{coupon.usedByEmail}</div>
                                {hasValidTimestamp(coupon.usedAt) && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    {formatDate(coupon.usedAt)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(coupon.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(coupon.expiresAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {!coupon.isUsed && (
                              <button
                                onClick={() => deleteCoupon(coupon.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                Hapus
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {coupons.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Belum ada kupon yang dibuat.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
