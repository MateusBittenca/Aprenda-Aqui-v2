import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
  variable: "--font-nunito",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Aprenda Aqui! | Transformando código em aventura",
  description:
    "Domine as tecnologias mais requisitadas do mercado com uma metodologia prática, divertida e totalmente gamificada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${nunitoSans.variable} ${plusJakarta.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
