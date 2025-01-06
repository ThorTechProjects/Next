'use client'; // Explicitly mark this as a Client Component
import Layout from "@/components/HeaderWithSidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/ThorTech.ico" />
        <title>KLM Monthly Work</title>
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
