import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import './style.css';

function LoaderOverlay() {
  const location = useLocation();
  const pathname = location.pathname;
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="loader-overlay-container">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <img
          src="/assets/loader/loader.gif"
          alt="Loading..."
          className="w-24 h-24 object-contain"
        />
      </div>
    </div>
  );
}

export function PageLoaderProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LoaderOverlay />
    </>
  );
}
