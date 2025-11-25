import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/navbar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ascesority",
  description: "Asesorías para estudiantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
