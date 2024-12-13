'use client'; // Explicitly mark this as a Client Component
import Layout from "@/components/HeaderWithSidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Next.js App with Material-UI</title>
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
