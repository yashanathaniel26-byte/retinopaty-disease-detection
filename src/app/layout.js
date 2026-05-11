import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./hero-animations.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RetinaScan - AI Retinal Analysis",
  description: "Advanced AI-powered retinal analysis system for comprehensive eye disease detection and screening",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.16.3/dist/ort.min.js" async></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
