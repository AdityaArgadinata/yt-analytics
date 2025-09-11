"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface Subscription {
  status: 'active' | 'expired' | 'none';
  plan?: string;
  expiresAt?: Date;
  couponCode?: string;
  activatedAt?: Date;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription>({ status: 'none' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) {
      setSubscription({ status: 'none' });
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const subData = userData.subscription;
        
        if (subData) {
          const expiresAt = subData.expiresAt?.toDate();
          const now = new Date();
          
          setSubscription({
            status: expiresAt && expiresAt > now ? 'active' : 'expired',
            plan: subData.plan,
            expiresAt,
            couponCode: subData.couponCode,
            activatedAt: subData.activatedAt?.toDate(),
          });
        } else {
          setSubscription({ status: 'none' });
        }
      } else {
        setSubscription({ status: 'none' });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { subscription, loading };
}
