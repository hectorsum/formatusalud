import type { Metadata } from "next";
import { Lato } from "next/font/google"; // Import Lato
import "./globals.css";

// Configure Lato
const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"], // Include multiple weights
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "FormTuSalud - Tu Salud, Tu Elección",
  description: "Reserva tu cita médica con los mejores especialistas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${lato.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
