import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className = '' }: LayoutProps) {
  return (
    <div className="page-container">
      <Navbar />
      <main className={`page-content ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
