import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { AuthSync } from "@/components/AuthSync";
import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";

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
          {" "}
          <Toaster position="top-right" />
          <AuthSync />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
