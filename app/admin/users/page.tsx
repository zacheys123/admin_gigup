// app/admin/users/page.tsx
"use client";

import React, { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { useThemeColors } from "@/hooks/useTheme";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Search,
  Filter,
  Users,
  Shield,
  AlertCircle,
  Ban,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  MoreVertical,
  Download,
  RefreshCw,
  UserX,
  UserCheck,
  MessageSquare,
  Trash2,
  Edit,
  Mail,
  Lock,
  Unlock,
  AlertTriangle,
  BarChart3,
  FileText,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { toast } from "@/lib/toast";
import { useAuth } from "@clerk/nextjs";

// Define tab types
interface TabType {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  color: string;
} // Add this type guard function
const isValidTier = (
  tier: string
): tier is "free" | "pro" | "premium" | "elite" => {
  return ["free", "pro", "premium", "elite"].includes(tier);
};

const UserManagementPage = () => {
  const { colors, mounted } = useThemeColors();
  const { isAdmin, adminRole } = useAdminCheck();
  const { userId: adminId } = useAuth();

  // States
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    tier: "all", // Change from "" to "all"
    roleType: "all", // Change from "" to "all"
    isBanned: undefined as boolean | undefined,
    isSuspended: undefined as boolean | undefined,
    minReports: undefined as number | undefined,
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [actionDialog, setActionDialog] = useState<{
    type: "ban" | "suspend" | "warn" | "note" | "delete" | null;
    userId?: string;
    userName?: string;
  }>({ type: null });
  const [actionData, setActionData] = useState({
    reason: "",
    duration: "7",
    notifyUser: true,
    note: "",
  });

  // Fetch data
  const userStats = useQuery(api.admin.users.getUserStats);
  // Then update your usersData query:
  const usersData = useQuery(api.admin.users.getUsersForAdmin, {
    filters: {
      search: searchQuery || undefined,
      isBanned: filters.isBanned,
      isSuspended: filters.isSuspended,
      tier:
        filters.tier !== "all" && isValidTier(filters.tier)
          ? filters.tier
          : undefined,
      roleType: filters.roleType !== "all" ? filters.roleType : undefined,
      minReports: filters.minReports,
      sortBy: "lastActive",
      sortOrder: "desc",
      limit: 50,
    },
  });

  // Mutations
  const banUser = useMutation(api.admin.users.banUser);
  const suspendUser = useMutation(api.admin.users.suspendUser);
  const unbanUser = useMutation(api.admin.users.unbanUser);
  const addWarning = useMutation(api.admin.users.addWarning);
  const addAdminNote = useMutation(api.admin.users.addAdminNote);
  const deleteUser = useMutation(api.admin.users.adminDeleteUser);

  // Define tabs based on user stats
  const tabs: TabType[] = [
    {
      id: "all",
      label: "All Users",
      icon: <Users className="h-4 w-4" />,
      count: userStats?.total || 0,
      color: "bg-blue-500",
    },
    {
      id: "active",
      label: "Active",
      icon: <CheckCircle className="h-4 w-4" />,
      count: userStats?.active || 0,
      color: "bg-green-500",
    },
    {
      id: "musicians",
      label: "Musicians",
      icon: <TrendingUp className="h-4 w-4" />,
      count: userStats?.musicians || 0,
      color: "bg-purple-500",
    },
    {
      id: "clients",
      label: "Clients",
      icon: <Users className="h-4 w-4" />,
      count: userStats?.clients || 0,
      color: "bg-amber-500",
    },
    {
      id: "bookers",
      label: "Bookers",
      icon: <BarChart3 className="h-4 w-4" />,
      count: userStats?.bookers || 0,
      color: "bg-indigo-500",
    },
    {
      id: "banned",
      label: "Banned",
      icon: <Ban className="h-4 w-4" />,
      count: userStats?.banned || 0,
      color: "bg-red-500",
    },
    {
      id: "suspended",
      label: "Suspended",
      icon: <Clock className="h-4 w-4" />,
      count: userStats?.suspended || 0,
      color: "bg-orange-500",
    },
    {
      id: "reported",
      label: "Reported",
      icon: <AlertCircle className="h-4 w-4" />,
      count: userStats?.reported || 0,
      color: "bg-rose-500",
    },
    {
      id: "pro",
      label: "Pro Users",
      icon: <Shield className="h-4 w-4" />,
      count: userStats?.proUsers || 0,
      color: "bg-emerald-500",
    },
  ];

  // Filter users based on active tab
  const getFilteredUsers = () => {
    if (!usersData?.users) return [];

    let filtered = [...usersData.users];

    switch (activeTab) {
      case "active":
        filtered = filtered.filter(
          (user) => !user.isBanned && !user.isSuspended
        );
        break;
      case "musicians":
        filtered = filtered.filter((user) => user.isMusician);
        break;
      case "clients":
        filtered = filtered.filter((user) => user.isClient && !user.isBooker);
        break;
      case "bookers":
        filtered = filtered.filter((user) => user.isBooker);
        break;
      case "banned":
        filtered = filtered.filter((user) => user.isBanned);
        break;
      case "suspended":
        filtered = filtered.filter((user) => user.isSuspended);
        break;
      case "reported":
        filtered = filtered.filter((user) => (user.reportedCount || 0) > 0);
        break;
      case "pro":
        filtered = filtered.filter((user) => user.tier === "pro");
        break;
    }

    return filtered;
  };

  const handleAction = async () => {
    if (!actionDialog.userId || !adminId || !actionDialog.type) return;

    try {
      switch (actionDialog.type) {
        case "ban":
          await banUser({
            adminId,
            userId: actionDialog.userId,
            reason: actionData.reason,
            durationDays: parseInt(actionData.duration),
            notifyUser: actionData.notifyUser,
          });
          toast.success(`${actionDialog.userName} has been banned.`);

          break;

        case "suspend":
          await suspendUser({
            adminId,
            userId: actionDialog.userId,
            reason: actionData.reason,
            durationDays: parseInt(actionData.duration),
            notifyUser: actionData.notifyUser,
          });
          toast.success(`${actionDialog.userName} has been suspended.`);
          break;

        case "warn":
          await addWarning({
            adminId,
            userId: actionDialog.userId,
            warning: actionData.reason,
            notifyUser: actionData.notifyUser,
          });
          toast.success(`Warning sent to ${actionDialog.userName}.`);
          break;

        case "note":
          await addAdminNote({
            adminId,
            userId: actionDialog.userId,
            note: actionData.note,
          });
          toast.success(`Note added to ${actionDialog.userName}'s profile.`);

          break;

        case "delete":
          await deleteUser({
            adminId,
            userId: actionDialog.userId,
            reason: actionData.reason,
          });
          toast.success(`${actionDialog.userName}'s account has been deleted.`);

          break;
      }

      // Reset and close dialog
      setActionDialog({ type: null });
      setActionData({
        reason: "",
        duration: "7",
        notifyUser: true,
        note: "",
      });
    } catch (error) {
      toast.error(
        "An error occurred while performing the action.Failed to perform action. Please try again."
      );
    }
  };

  const handleUnban = async (userId: string, userName: string) => {
    if (!adminId) return;

    try {
      await unbanUser({ adminId, userId });
      toast.success(`${userName} has been unbanned.`);
    } catch (error) {
      toast.error("Failed to unban user.");
    }
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "MMM d, yyyy HH:mm");
  };

  const getUserBadges = (user: any) => {
    const badges = [];

    if (user.isBanned) badges.push({ label: "Banned", color: "bg-red-500" });
    if (user.isSuspended)
      badges.push({ label: "Suspended", color: "bg-orange-500" });
    if (user.tier === "pro")
      badges.push({ label: "Pro", color: "bg-emerald-500" });
    if (user.isMusician)
      badges.push({ label: "Musician", color: "bg-purple-500" });
    if (user.isClient) badges.push({ label: "Client", color: "bg-amber-500" });
    if (user.isBooker) badges.push({ label: "Booker", color: "bg-indigo-500" });
    if (user.reportedCount > 0)
      badges.push({
        label: `Reports: ${user.reportedCount}`,
        color: "bg-rose-500",
      });

    return badges;
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  const filteredUsers = getFilteredUsers();

  return (
    <div className={cn("min-h-screen p-6", colors.background)}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage users, handle reports, and enforce platform policies
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        {/* Stats Overview */}
        // In the Stats Overview section, update to show all tiers:
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {userStats &&
            [
              { key: "total", label: "Total Users" },
              { key: "active", label: "Active Users" },
              { key: "freeUsers", label: "Free Users" },
              { key: "proUsers", label: "Pro Users" },
              { key: "premiumUsers", label: "Premium Users" },
              { key: "eliteUsers", label: "Elite Users" },
              { key: "banned", label: "Banned" },
              { key: "suspended", label: "Suspended" },
              { key: "musicians", label: "Musicians" },
              { key: "clients", label: "Clients" },
              { key: "bookers", label: "Bookers" },
              { key: "reported", label: "Reported" },
              { key: "recentSignups", label: "Recent Signups" },
            ]
              .filter(
                ({ key }) =>
                  userStats[key as keyof typeof userStats] !== undefined
              )
              .map(({ key, label }) => (
                <div
                  key={key}
                  className={cn(
                    "p-4 rounded-xl border",
                    colors.border,
                    colors.backgroundMuted
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {label}
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {userStats[key as keyof typeof userStats]}
                      </p>
                    </div>
                    {key === "recentSignups" && (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    )}
                    {key === "banned" && (
                      <Ban className="h-5 w-5 text-red-500" />
                    )}
                    {key === "active" && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={filters.tier}
              onValueChange={(value) => setFilters({ ...filters, tier: value })}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="plite">Elite</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.roleType}
              onValueChange={(value) =>
                setFilters({ ...filters, roleType: value })
              }
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="guitarist">Guitarist</SelectItem>
                <SelectItem value="drummer">Drummer</SelectItem>
                <SelectItem value="pianist">Pianist</SelectItem>
                <SelectItem value="vocalist">Vocalist</SelectItem>
                <SelectItem value="dj">DJ</SelectItem>
                <SelectItem value="mc">MC</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  tier: "all", // Change from "" to "all"
                  roleType: "all", // Change from "" to "all"
                  isBanned: undefined,
                  isSuspended: undefined,
                  minReports: undefined,
                })
              }
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 h-auto bg-transparent p-0 gap-2">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-xl",
                "data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/10 data-[state=active]:to-red-500/10",
                "data-[state=active]:border data-[state=active]:border-orange-500/30",
                colors.border,
                "hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={cn("p-2 rounded-lg", tab.color)}>
                  {tab.icon}
                </div>
                <span className="font-medium">{tab.label}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div
            className={cn(
              "rounded-xl border",
              colors.border,
              colors.background
            )}
          >
            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUsers.length} user
                    {selectedUsers.length > 1 ? "s" : ""} selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setActionDialog({
                        type: "warn",
                        userName: `${selectedUsers.length} users`,
                      })
                    }
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Warn Selected
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setActionDialog({
                        type: "ban",
                        userName: `${selectedUsers.length} users`,
                      })
                    }
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Ban Selected
                  </Button>
                </div>
              </div>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn("border-b", colors.border)}>
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers(
                              filteredUsers.map((u) => u.clerkId)
                            );
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      User
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Role & Tier
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Reports
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Last Active
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={cn(
                        "border-b hover:bg-gray-50 dark:hover:bg-gray-800/50",
                        colors.border
                      )}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.clerkId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([
                                ...selectedUsers,
                                user.clerkId,
                              ]);
                            } else {
                              setSelectedUsers(
                                selectedUsers.filter(
                                  (id) => id !== user.clerkId
                                )
                              );
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.picture || "/default-avatar.png"}
                            alt={user.username}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <div className="font-medium">
                              {user.firstname} {user.lastname}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username}
                            </div>
                            <div className="text-xs text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {getUserBadges(user).map((badge, index) => (
                            <Badge
                              key={index}
                              className={cn("text-xs", badge.color)}
                            >
                              {badge.label}
                            </Badge>
                          ))}
                        </div>
                        {user.roleType && (
                          <div className="text-xs text-gray-500 mt-1">
                            {user.roleType}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {user.isBanned ? (
                          <Badge variant="destructive" className="gap-1">
                            <Ban className="h-3 w-3" />
                            Banned
                          </Badge>
                        ) : user.isSuspended ? (
                          <Badge
                            variant="outline"
                            className="bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20 gap-1"
                          >
                            <Clock className="h-3 w-3" />
                            Suspended
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20 gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {user?.reportedCount && user?.reportedCount > 0 ? (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <span className="font-medium text-red-600 dark:text-red-400">
                                {user.reportedCount}
                              </span>
                            </>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                        {user.lastActive
                          ? formatDate(user.lastActive)
                          : "Never"}
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Email User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                setActionDialog({
                                  type: "note",
                                  userId: user.clerkId,
                                  userName: user.username,
                                })
                              }
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Add Note
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setActionDialog({
                                  type: "warn",
                                  userId: user.clerkId,
                                  userName: user.username,
                                })
                              }
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Issue Warning
                            </DropdownMenuItem>
                            {user.isBanned ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUnban(user.clerkId, user.username)
                                }
                              >
                                <Unlock className="h-4 w-4 mr-2" />
                                Unban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  setActionDialog({
                                    type: "suspend",
                                    userId: user.clerkId,
                                    userName: user.username,
                                  })
                                }
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            {!user.isBanned && (
                              <DropdownMenuItem
                                onClick={() =>
                                  setActionDialog({
                                    type: "ban",
                                    userId: user.clerkId,
                                    userName: user.username,
                                  })
                                }
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Ban User
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                setActionDialog({
                                  type: "delete",
                                  userId: user.clerkId,
                                  userName: user.username,
                                })
                              }
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No users found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? "No users match your search criteria."
                    : "No users in this category."}
                </p>
              </div>
            )}

            {/* Pagination */}
            {usersData?.hasMore && (
              <div className="p-4 border-t flex items-center justify-center">
                <Button variant="outline">Load More Users</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Dialogs */}
      <Dialog
        open={actionDialog.type !== null}
        onOpenChange={(open) => !open && setActionDialog({ type: null })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === "ban" && "Ban User"}
              {actionDialog.type === "suspend" && "Suspend User"}
              {actionDialog.type === "warn" && "Issue Warning"}
              {actionDialog.type === "note" && "Add Admin Note"}
              {actionDialog.type === "delete" && "Delete User Account"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "ban" &&
                `You are about to ban ${actionDialog.userName}. This action will prevent them from accessing the platform.`}
              {actionDialog.type === "suspend" &&
                `You are about to suspend ${actionDialog.userName} temporarily.`}
              {actionDialog.type === "warn" &&
                `Send a warning to ${actionDialog.userName}.`}
              {actionDialog.type === "note" &&
                `Add a private admin note for ${actionDialog.userName}.`}
              {actionDialog.type === "delete" &&
                `⚠️ This will permanently delete ${actionDialog.userName}'s account and all associated data. This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {(actionDialog.type === "ban" ||
              actionDialog.type === "suspend" ||
              actionDialog.type === "warn" ||
              actionDialog.type === "delete") && (
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter the reason for this action..."
                  value={actionData.reason}
                  onChange={(e) =>
                    setActionData({ ...actionData, reason: e.target.value })
                  }
                  rows={3}
                />
              </div>
            )}

            {actionDialog.type === "note" && (
              <div className="space-y-2">
                <Label htmlFor="note">Note *</Label>
                <Textarea
                  id="note"
                  placeholder="Enter your admin note..."
                  value={actionData.note}
                  onChange={(e) =>
                    setActionData({ ...actionData, note: e.target.value })
                  }
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  This note will only be visible to admins.
                </p>
              </div>
            )}

            {(actionDialog.type === "ban" ||
              actionDialog.type === "suspend") && (
              <div className="space-y-2">
                <Label htmlFor="duration">
                  {actionDialog.type === "ban"
                    ? "Ban Duration"
                    : "Suspension Duration"}
                </Label>
                <Select
                  value={actionData.duration}
                  onValueChange={(value) =>
                    setActionData({ ...actionData, duration: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="permanent">Permanent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {actionDialog.type !== "note" && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notify"
                  checked={actionData.notifyUser}
                  onChange={(e) =>
                    setActionData({
                      ...actionData,
                      notifyUser: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="notify">Notify user about this action</Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ type: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              variant={
                actionDialog.type === "delete" ? "destructive" : "default"
              }
              disabled={
                (actionDialog.type === "ban" && !actionData.reason) ||
                (actionDialog.type === "suspend" && !actionData.reason) ||
                (actionDialog.type === "warn" && !actionData.reason) ||
                (actionDialog.type === "note" && !actionData.note) ||
                (actionDialog.type === "delete" && !actionData.reason)
              }
            >
              {actionDialog.type === "ban" && "Ban User"}
              {actionDialog.type === "suspend" && "Suspend User"}
              {actionDialog.type === "warn" && "Send Warning"}
              {actionDialog.type === "note" && "Add Note"}
              {actionDialog.type === "delete" && "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
