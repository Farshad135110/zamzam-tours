// Custom hook for authentication
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function useAuth(redirectTo: string = '/login') {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userStr = localStorage.getItem('user');

      if (!isLoggedIn || !userStr) {
        router.push(redirectTo);
        setIsLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const user = JSON.parse(userStr);
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          // Token invalid or expired
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
          router.push(redirectTo);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, redirectTo]);

  return { isAuthenticated, isLoading, user };
}
