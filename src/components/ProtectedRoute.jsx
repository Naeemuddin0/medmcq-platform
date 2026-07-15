'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading

    if (!session) {
      router.push('/login'); // Redirect to login if not authenticated
    } else if (allowedRoles && !allowedRoles.includes(session.user?.role)) {
      // Redirect to a different page or show an access denied message
      // if user's role is not in allowedRoles
      router.push('/access-denied'); 
    }
  }, [session, status, router, allowedRoles]);

  if (status === 'loading') {
    return <div className="px-6 py-16 text-center text-ink-muted dark:text-white/60">Loading...</div>;
  }

  if (!session || (allowedRoles && !allowedRoles.includes(session.user?.role))) {
    return null; // Don't render children if not authorized/authenticated
  }

  return <>{children}</>;
};

export default ProtectedRoute; 