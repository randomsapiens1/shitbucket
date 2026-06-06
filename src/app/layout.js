import SWRegistration from "@/components/ui/SWRegistration";
import { Analytics } from "@vercel/analytics/react";
import { PHProvider } from "./providers";
import "./globals.css";

export const metadata = {
  title: "shitbucket",
  description: "dump your ideas",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo-shitBucket-day.png",
    apple: "/logo-shitBucket-day.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "shitbucket",
  },
};

export const viewport = {
  themeColor: "#FFF8EE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=VT323&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900&family=IBM+Plex+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/logo-shitBucket-day.png" />
      </head>
      <body>
        <PHProvider>
          {children}
          <Analytics />
          <SWRegistration />
        </PHProvider>
      </body>
    </html>
  );
}
