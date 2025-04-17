import AuthInitializer from "@/components/auth/AuthInitializer";
import Navbar from "@/components/layout/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import CartInitializer from "@/components/cart/CartInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beshara Store",
  description: "A modern e-commerce platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthInitializer />
          <Navbar />
          <CartInitializer />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
