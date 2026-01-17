import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/lib/cartContext";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revollution Perfumes | Official Store",
  description:
    "Revollution – premium perfumes crafted to define your signature scent.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f5f9ff] text-[#0b1020]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
