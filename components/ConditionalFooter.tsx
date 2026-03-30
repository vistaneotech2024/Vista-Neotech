 'use client';
 
 import { usePathname } from 'next/navigation';
 import { Footer, type FooterProps } from '@/components/Footer';
 
 export function ConditionalFooter(props: FooterProps) {
   const pathname = usePathname();
 
   if (pathname?.startsWith('/admin')) return null;
 
   return <Footer {...props} />;
 }
