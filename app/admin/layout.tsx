"use client";

import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper";
import { AdminStatusManager } from "@/components/AdminStatusManager";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutWrapper>
      <AdminStatusManager />
      {children}
    </AdminLayoutWrapper>
  );
}
