import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { AuthSync } from "@/components/AuthSync";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gigup Admin",
  description: "Admin Dashboard for Gigup Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <AuthSync />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
