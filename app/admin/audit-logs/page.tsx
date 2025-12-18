// app/admin/audit-logs/page.tsx
"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useThemeColors } from "@/hooks/useTheme";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import {
  Search,
  Filter,
  Calendar,
  User,
  Shield,
  Clock,
  Download,
  RefreshCw,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

const AuditLogsPage = () => {
  const { colors, mounted } = useThemeColors();
  const { isAdmin } = useAdminCheck();

  const [filters, setFilters] = useState({
    action: "",
    adminId: "",
    targetUserId: "",
    startDate: "",
    endDate: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const auditLogs = useQuery(api.admin.auditlogs.getAuditLogs, {
    action: filters.action || undefined,
    adminId: filters.adminId || undefined,
    targetUserId: filters.targetUserId || undefined,
    limit: 100,
  });

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p>Admin access required</p>
        </div>
      </div>
    );
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "user_deleted":
        return "bg-red-500";
      case "user_banned":
        return "bg-red-400";
      case "user_suspended":
        return "bg-orange-500";
      case "user_unbanned":
        return "bg-green-500";
      case "warning_added":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className={cn("p-6", colors.background)}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          Audit Logs
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track all administrative actions on the platform
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select
              value={filters.action}
              onValueChange={(value) =>
                setFilters({ ...filters, action: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="user_banned">User Banned</SelectItem>
                <SelectItem value="user_suspended">User Suspended</SelectItem>
                <SelectItem value="user_unbanned">User Unbanned</SelectItem>
                <SelectItem value="warning_added">Warning Added</SelectItem>
                <SelectItem value="user_deleted">User Deleted</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  action: "",
                  adminId: "",
                  targetUserId: "",
                  startDate: "",
                  endDate: "",
                })
              }
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={cn("p-4 rounded-xl border", colors.border)}>
          <div className="text-sm text-gray-500">Total Logs</div>
          <div className="text-2xl font-bold">{auditLogs?.total || 0}</div>
        </div>
        <div className={cn("p-4 rounded-xl border", colors.border)}>
          <div className="text-sm text-gray-500">Bans</div>
          <div className="text-2xl font-bold text-red-500">
            {auditLogs?.logs?.filter((l) => l.action === "user_banned")
              .length || 0}
          </div>
        </div>
        <div className={cn("p-4 rounded-xl border", colors.border)}>
          <div className="text-sm text-gray-500">Suspensions</div>
          <div className="text-2xl font-bold text-orange-500">
            {auditLogs?.logs?.filter((l) => l.action === "user_suspended")
              .length || 0}
          </div>
        </div>
        <div className={cn("p-4 rounded-xl border", colors.border)}>
          <div className="text-sm text-gray-500">Today</div>
          <div className="text-2xl font-bold">
            {auditLogs?.logs?.filter((l) => {
              const today = new Date().setHours(0, 0, 0, 0);
              return l.timestamp >= today;
            }).length || 0}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className={cn("rounded-xl border overflow-hidden", colors.border)}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn("border-b", colors.border)}>
                <th className="text-left p-4">Action</th>
                <th className="text-left p-4">Admin</th>
                <th className="text-left p-4">Target User</th>
                <th className="text-left p-4">Reason</th>
                <th className="text-left p-4">Time</th>
                <th className="text-left p-4">Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs?.logs?.map((log) => (
                <tr
                  key={log._id}
                  className={cn(
                    "border-b hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    colors.border
                  )}
                >
                  <td className="p-4">
                    <Badge
                      className={cn(getActionColor(log.action), "text-white")}
                    >
                      {formatAction(log.action)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">
                        {log.adminName || log.adminId}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">@{log.targetUsername}</div>
                    <div className="text-xs text-gray-500">
                      {log.targetUserId}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm max-w-xs truncate">
                      {log.reason || "No reason provided"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {format(new Date(log.timestamp), "MMM d, yyyy HH:mm")}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Show details modal
                        alert(log.details || "No details available");
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {(!auditLogs?.logs || auditLogs.logs.length === 0) && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No audit logs found</h3>
            <p className="text-gray-500">
              Administrative actions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogsPage;
