import SWRegistration from "@/components/ui/SWRegistration";
import { Analytics } from "@vercel/analytics/react";
import { PHProvider } from "./providers";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://shitbucket.io"), // Replace with actual domain if known, or leave as placeholder
  title: {
    default: "ShitBucket — Dump your ideas, let them brew.",
    template: "%s | ShitBucket",
  },
  description: "The place for your unfinished thoughts, shower ideas, and browser tabs. Dump them, let them brew, and find what actually matters.",
  keywords: ["idea management", "thought bucket", "productivity tool", "minimalist notes", "shower thoughts", "organizer", "brain dump"],
  authors: [{ name: "ShitBucket Team" }],
  creator: "ShitBucket Team",
  publisher: "ShitBucket",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo-shitBucket-day.png",
    apple: "/logo-shitBucket-day.png",
  },
  openGraph: {
    title: "ShitBucket",
    description: "Dump your unfinished thoughts. Let them brew. Go for gold.",
    url: "https://shitbucket.io",
    siteName: "ShitBucket",
    images: [
      {
        url: "/screenshot_1.jpeg", // Using existing screenshot as OG image
        width: 1200,
        height: 630,
        alt: "ShitBucket Desktop Interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShitBucket",
    description: "Dump your unfinished thoughts. Let them brew. Go for gold.",
    images: ["/screenshot_1.jpeg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ShitBucket",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8EE" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1208" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zooming for accessibility
  userScalable: true,
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
