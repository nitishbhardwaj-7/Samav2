import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ivyMode = localFont({
  src: "./fonts/IvyMode-Regular.ttf",
  variable: "--font-ivymode",
  display: "swap",
});

import Navbar from "../components/Navbar";
import AnimationProvider from "../components/AnimationProvider";

export const metadata: Metadata = {
  title: "Sama Production",
  description: "Spaces that speak for the brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ivyMode.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AnimationProvider>
          {children}
          <Navbar />
        </AnimationProvider>
      </body>
    </html>
  );
}
