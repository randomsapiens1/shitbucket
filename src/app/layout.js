import "./globals.css";

export const metadata = {
  title: "shitbucket",
  description: "dump your ideas",
  manifest: "/manifest.json",
  icons: {
    icon: "/app-logo.png",
    apple: "/app-logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "shitbucket",
  },
};

export const viewport = {
  themeColor: "#0c0c0c",
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
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/logo-shitBucket.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}