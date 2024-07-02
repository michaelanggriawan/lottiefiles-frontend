"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/app/lib/apollo.wrapper";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: '/' })
        .then((registration) => console.log('Service Worker registered with scope: ', registration.scope))
        .catch((error) => console.error('Service Worker registration failed:', error));
    }
  }, []);
  
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <ApolloWrapper>
        <body className={inter.className}>{children}</body>
      </ApolloWrapper>
    </html>
  );
}
