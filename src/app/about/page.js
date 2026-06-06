import Desktop from "./Desktop";

export const metadata = {
  title: "About",
  description: "Dump your unfinished thoughts, shower ideas, and browser tabs. ShitBucket is the place for things that don't have a home yet.",
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ShitBucket",
    "operatingSystem": "Web",
    "applicationCategory": "ProductivityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "A minimalist tool to dump your ideas, let them brew, and find what actually matters.",
    "screenshot": "https://shitbucket.io/screenshot_1.jpeg",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Desktop />
    </>
  );
}
