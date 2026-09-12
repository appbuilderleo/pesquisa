import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STOKA — Validação de Mercado",
  description: "Formulário de entrevista digital para validação de mercado do Projeto STOKA",
  openGraph: {
    title: "STOKA — Validação de Mercado",
    description: "Formulário de entrevista digital para validação de mercado do Projeto STOKA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="font-sans min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
