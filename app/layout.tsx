import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navbar/navigation";

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
        <Navigation />
        {children}
        <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 UniAsesorías. Todos los derechos reservados.</p>
            <p className="text-sm mt-2">Plataforma de gestión académica para universidades</p>
          </div>
        </div>
      </footer>
      </body>
    </html>
  );
}
