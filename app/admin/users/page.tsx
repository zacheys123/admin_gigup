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
  ChevronRight,
  Crown,
  Star,
  Zap,
  Sparkles,
  Filter as FilterIcon,
  X,
  Settings,
  User,
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
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "@/lib/toast";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

// Define tab types
interface TabType {
  id: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  gradient: string;
}

// Type guard function
const isValidTier = (
  tier: string
): tier is "free" | "pro" | "premium" | "elite" => {
  return ["free", "pro", "premium", "elite"].includes(tier);
};

const UserManagementPage = () => {
  const { colors, mounted, isDarkMode } = useThemeColors();
  const { isAdmin, adminRole } = useAdminCheck();
  const { userId: adminId } = useAuth();

  // States
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    tier: "all",
    roleType: "all",
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
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  const userStats = useQuery(api.admin.users.getUserStats);
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

  // Define tabs with modern gradients
  const tabs: TabType[] = [
    {
      id: "all",
      label: "All Users",
      icon: <Users className="h-4 w-4" />,
      count: userStats?.total || 0,
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      id: "active",
      label: "Active",
      icon: <CheckCircle className="h-4 w-4" />,
      count: userStats?.active || 0,
      color: "from-emerald-500 to-green-500",
      gradient: "bg-gradient-to-r from-emerald-500 to-green-500",
    },
    {
      id: "musicians",
      label: "Musicians",
      icon: <TrendingUp className="h-4 w-4" />,
      count: userStats?.musicians || 0,
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
    },
    {
      id: "clients",
      label: "Clients",
      icon: <User className="h-4 w-4" />,
      count: userStats?.clients || 0,
      color: "from-amber-500 to-orange-500",
      gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
    },
    {
      id: "bookers",
      label: "Bookers",
      icon: <BarChart3 className="h-4 w-4" />,
      count: userStats?.bookers || 0,
      color: "from-indigo-500 to-violet-500",
      gradient: "bg-gradient-to-r from-indigo-500 to-violet-500",
    },
    {
      id: "banned",
      label: "Banned",
      icon: <Ban className="h-4 w-4" />,
      count: userStats?.banned || 0,
      color: "from-red-500 to-rose-500",
      gradient: "bg-gradient-to-r from-red-500 to-rose-500",
    },
    {
      id: "suspended",
      label: "Suspended",
      icon: <Clock className="h-4 w-4" />,
      count: userStats?.suspended || 0,
      color: "from-orange-500 to-amber-500",
      gradient: "bg-gradient-to-r from-orange-500 to-amber-500",
    },
    {
      id: "reported",
      label: "Reported",
      icon: <AlertCircle className="h-4 w-4" />,
      count: userStats?.reported || 0,
      color: "from-rose-500 to-pink-500",
      gradient: "bg-gradient-to-r from-rose-500 to-pink-500",
    },
    {
      id: "pro",
      label: "Premium",
      icon: <Crown className="h-4 w-4" />,
      count: userStats?.proUsers || 0,
      color: "from-emerald-500 to-teal-500",
      gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
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

      setActionDialog({ type: null });
      setActionData({
        reason: "",
        duration: "7",
        notifyUser: true,
        note: "",
      });
    } catch (error) {
      toast.error("Failed to perform action. Please try again.");
    }
  };

  const handleUnbanOrUnsuspend = async (user: any) => {
    if (!adminId) return;

    try {
      await unbanUser({ adminId, userId: user.clerkId });
      toast.success(
        `${user.username} has been ${user.isSuspended ? "unsuspended" : "unbanned"}.`
      );
    } catch (error) {
      toast.error(
        `Failed to ${user.isSuspended ? "unsuspend" : "unban"} user.`
      );
    }
  };

  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getUserBadges = (user: any) => {
    const badges = [];

    if (user.isBanned)
      badges.push({
        label: "Banned",
        color: "bg-gradient-to-r from-red-500 to-rose-500",
        icon: <Ban className="h-3 w-3" />,
      });
    if (user.isSuspended)
      badges.push({
        label: "Suspended",
        color: "bg-gradient-to-r from-orange-500 to-amber-500",
        icon: <Clock className="h-3 w-3" />,
      });
    if (user.tier === "pro")
      badges.push({
        label: "Pro",
        color: "bg-gradient-to-r from-emerald-500 to-teal-500",
        icon: <Crown className="h-3 w-3" />,
      });
    if (user.tier === "premium")
      badges.push({
        label: "Premium",
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
        icon: <Star className="h-3 w-3" />,
      });
    if (user.tier === "elite")
      badges.push({
        label: "Elite",
        color: "bg-gradient-to-r from-amber-500 to-orange-500",
        icon: <Sparkles className="h-3 w-3" />,
      });
    if (user.isMusician)
      badges.push({
        label: "Musician",
        color: "bg-gradient-to-r from-blue-500 to-cyan-500",
        icon: <TrendingUp className="h-3 w-3" />,
      });
    if (user.isClient)
      badges.push({
        label: "Client",
        color: "bg-gradient-to-r from-indigo-500 to-violet-500",
        icon: <User className="h-3 w-3" />,
      });
    if (user.isBooker)
      badges.push({
        label: "Booker",
        color: "bg-gradient-to-r from-violet-500 to-purple-500",
        icon: <BarChart3 className="h-3 w-3" />,
      });
    if (user.reportedCount > 0)
      badges.push({
        label: `${user.reportedCount} reports`,
        color: "bg-gradient-to-r from-rose-500 to-pink-500",
        icon: <AlertCircle className="h-3 w-3" />,
      });

    return badges;
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-to-r from-orange-500 to-red-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-xl opacity-20" />
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4 relative" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Access Restricted
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Admin privileges required
          </p>
        </div>
      </div>
    );
  }

  const filteredUsers = getFilteredUsers();

  return (
    <div className={cn("min-h-screen", colors.background)}>
      {/* Modern Glass Header */}
      <div
        className={cn(
          "sticky top-0 z-40 border-b",
          colors.border,
          "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60"
        )}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur" />
                  <div className="relative p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                    User Management
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Monitor and manage platform users
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  // Refresh logic
                  window.location.reload();
                }}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full gap-2 border-gray-300 dark:border-gray-700 hover:border-orange-500"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="h-4 w-4" />
                Filters
                {Object.values(filters).some(
                  (v) => v !== "all" && v !== undefined
                ) && (
                  <span className="px-1.5 py-0.5 text-xs bg-orange-500 text-white rounded-full">
                    {
                      Object.values(filters).filter(
                        (v) => v !== "all" && v !== undefined
                      ).length
                    }
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* Stats Overview - Modern Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              key: "total",
              label: "Total Users",
              icon: <Users className="h-5 w-5" />,
              gradient: "from-blue-500 to-cyan-500",
              change: "+12%",
            },
            {
              key: "active",
              label: "Active Now",
              icon: <CheckCircle className="h-5 w-5" />,
              gradient: "from-emerald-500 to-green-500",
              change: "+5%",
            },
            {
              key: "proUsers",
              label: "Premium Users",
              icon: <Crown className="h-5 w-5" />,
              gradient: "from-purple-500 to-pink-500",
              change: "+23%",
            },
            {
              key: "reported",
              label: "Flagged Users",
              icon: <AlertCircle className="h-5 w-5" />,
              gradient: "from-rose-500 to-pink-500",
              change: "-3%",
            },
          ].map(({ key, label, icon, gradient, change }) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-2xl p-5 border relative overflow-hidden group cursor-pointer",
                colors.border,
                "bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300"
              )}
            >
              <div
                className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${gradient})` }}
              />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={cn(
                      "p-2.5 rounded-xl bg-gradient-to-br",
                      gradient,
                      "shadow-lg"
                    )}
                  >
                    {icon}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold px-2 py-1 rounded-full",
                      change.startsWith("+")
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                    )}
                  >
                    {change}
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {userStats?.[key as keyof typeof userStats] || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search Bar - Modern Design */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search users, emails, or usernames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "pl-12 pr-4 py-3 rounded-2xl border-2 text-base",
                colors.border,
                "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                "mb-6 p-5 rounded-2xl border",
                colors.border,
                "bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2">
                    Account Tier
                  </Label>
                  <Select
                    value={filters.tier}
                    onValueChange={(value) =>
                      setFilters({ ...filters, tier: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="All Tiers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="elite">Elite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2">Role Type</Label>
                  <Select
                    value={filters.roleType}
                    onValueChange={(value) =>
                      setFilters({ ...filters, roleType: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="All Roles" />
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
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2">
                    Account Status
                  </Label>
                  <Select
                    value={filters.isBanned?.toString() || "all"}
                    onValueChange={(value) =>
                      setFilters({
                        ...filters,
                        isBanned:
                          value === "all" ? undefined : value === "true",
                        isSuspended: value === "suspended" ? true : undefined,
                      })
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="false">Active Only</SelectItem>
                      <SelectItem value="true">Banned Only</SelectItem>
                      <SelectItem value="suspended">Suspended Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modern Tabs */}
        <div className="mb-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 dark:via-gray-900 to-transparent" />
              <TabsList
                className={cn(
                  "relative flex overflow-x-auto space-x-1 p-1 rounded-2xl bg-white dark:bg-gray-900 border",
                  colors.border
                )}
              >
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      "flex-1 min-w-[120px] py-3 rounded-xl transition-all duration-300 relative",
                      "data-[state=active]:shadow-lg data-[state=active]:scale-[1.02]",
                      activeTab === tab.id
                        ? "text-white"
                        : cn(
                            colors.text,
                            "hover:bg-gray-100 dark:hover:bg-gray-800"
                          )
                    )}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className={cn(
                          "absolute inset-0 rounded-xl",
                          tab.gradient
                        )}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          "p-1.5 rounded-lg",
                          activeTab === tab.id
                            ? "bg-white/20"
                            : cn("bg-gray-100 dark:bg-gray-800", tab.color)
                        )}
                      >
                        {tab.icon}
                      </div>
                      <span className="text-sm font-medium">{tab.label}</span>
                      <span
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-full",
                          activeTab === tab.id
                            ? "bg-white/30"
                            : "bg-gray-200 dark:bg-gray-800"
                        )}
                      >
                        {tab.count}
                      </span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              {/* Users Grid - Modern Card Layout */}
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-2xl opacity-20" />
                    <Users className="h-16 w-16 text-gray-400 relative" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {searchQuery
                      ? "No users match your search criteria. Try adjusting your filters."
                      : "No users in this category. Check other tabs."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUsers.map((user) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "group rounded-2xl border p-5 cursor-pointer",
                        colors.border,
                        "bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300",
                        selectedUsers.includes(user.clerkId) &&
                          "ring-2 ring-orange-500"
                      )}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity" />
                            <img
                              src={user.picture || "/default-avatar.png"}
                              alt={user.username}
                              className="relative h-12 w-12 rounded-full ring-2 ring-white dark:ring-gray-800"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {user.firstname} {user.lastname}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username}
                            </p>
                          </div>
                        </div>
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
                          className="rounded-lg border-gray-300 dark:border-gray-700 focus:ring-orange-500"
                        />
                      </div>

                      {/* User Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getUserBadges(user).map((badge, index) => (
                          <Badge
                            key={index}
                            className={cn(
                              "px-2 py-1 text-xs font-medium text-white",
                              badge.color,
                              "flex items-center gap-1"
                            )}
                          >
                            {badge.icon}
                            {badge.label}
                          </Badge>
                        ))}
                      </div>

                      {/* User Info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Last Active
                          </span>
                          <span className="font-medium">
                            {user.lastActive
                              ? formatDate(user.lastActive)
                              : "Never"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Reports
                          </span>
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 text-rose-500" />
                            <span
                              className={cn(
                                "font-medium",
                                user.reportedCount && user?.reportedCount > 0
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-gray-600 dark:text-gray-400"
                              )}
                            >
                              {user.reportedCount || 0}
                            </span>
                          </div>
                        </div>
                        {user.roleType && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Role
                            </span>
                            <span className="font-medium">{user.roleType}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full"
                          onClick={() => {
                            window.open(`/profile/${user.username}`, "_blank");
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-56 rounded-xl"
                          >
                            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
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
                            {user.isBanned || user.isSuspended ? (
                              <DropdownMenuItem
                                onClick={() => handleUnbanOrUnsuspend(user)}
                              >
                                {user.isBanned ? (
                                  <>
                                    <Unlock className="h-4 w-4 mr-2" />
                                    Unban User
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Unsuspend User
                                  </>
                                )}
                              </DropdownMenuItem>
                            ) : (
                              <>
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
                              </>
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
                              className="text-rose-600 focus:text-rose-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Load More */}
              {usersData?.hasMore && (
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    className="rounded-full px-8 py-2 border-gray-300 dark:border-gray-700 hover:border-orange-500"
                  >
                    Load More Users
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modern Action Dialog */}
      <Dialog
        open={actionDialog.type !== null}
        onOpenChange={(open) => !open && setActionDialog({ type: null })}
      >
        <DialogContent
          className={cn(
            "sm:max-w-lg rounded-2xl border",
            colors.border,
            "bg-white dark:bg-gray-900"
          )}
        >
          <DialogHeader>
            <div className="relative">
              <div
                className={cn(
                  "absolute -top-2 -left-2 w-12 h-12 rounded-xl blur opacity-20",
                  actionDialog.type === "ban"
                    ? "bg-red-500"
                    : actionDialog.type === "suspend"
                      ? "bg-orange-500"
                      : actionDialog.type === "delete"
                        ? "bg-rose-500"
                        : "bg-blue-500"
                )}
              />
              <DialogTitle className="relative text-2xl font-bold">
                {actionDialog.type === "ban" && "🚫 Ban User"}
                {actionDialog.type === "suspend" && "⏸️ Suspend User"}
                {actionDialog.type === "warn" && "⚠️ Issue Warning"}
                {actionDialog.type === "note" && "📝 Add Admin Note"}
                {actionDialog.type === "delete" && "🗑️ Delete Account"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {actionDialog.type === "ban" &&
                `You are about to ban ${actionDialog.userName}. This action will prevent them from accessing the platform.`}
              {actionDialog.type === "suspend" &&
                `You are about to suspend ${actionDialog.userName} temporarily.`}
              {actionDialog.type === "warn" &&
                `Send a warning to ${actionDialog.userName}.`}
              {actionDialog.type === "note" &&
                `Add a private admin note for ${actionDialog.userName}.`}
              {actionDialog.type === "delete" &&
                `⚠️ This action cannot be undone. All user data will be permanently deleted.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {(actionDialog.type === "ban" ||
              actionDialog.type === "suspend" ||
              actionDialog.type === "warn" ||
              actionDialog.type === "delete") && (
              <div className="space-y-3">
                <Label htmlFor="reason" className="font-medium">
                  Reason <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  placeholder="Explain why this action is necessary..."
                  value={actionData.reason}
                  onChange={(e) =>
                    setActionData({ ...actionData, reason: e.target.value })
                  }
                  rows={3}
                  className="rounded-xl border-gray-300 dark:border-gray-700 focus:border-orange-500"
                />
              </div>
            )}

            {actionDialog.type === "note" && (
              <div className="space-y-3">
                <Label htmlFor="note" className="font-medium">
                  Note <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="note"
                  placeholder="Enter your private admin note..."
                  value={actionData.note}
                  onChange={(e) =>
                    setActionData({ ...actionData, note: e.target.value })
                  }
                  rows={4}
                  className="rounded-xl border-gray-300 dark:border-gray-700 focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This note will only be visible to administrators.
                </p>
              </div>
            )}

            {(actionDialog.type === "ban" ||
              actionDialog.type === "suspend") && (
              <div className="space-y-3">
                <Label htmlFor="duration" className="font-medium">
                  {actionDialog.type === "ban"
                    ? "⏰ Ban Duration"
                    : "⏳ Suspension Duration"}
                </Label>
                <Select
                  value={actionData.duration}
                  onValueChange={(value) =>
                    setActionData({ ...actionData, duration: value })
                  }
                >
                  <SelectTrigger className="rounded-xl">
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
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
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
                  className="h-5 w-5 rounded border-gray-300 dark:border-gray-700 text-orange-500 focus:ring-orange-500"
                />
                <Label htmlFor="notify" className="text-sm">
                  Send notification to user about this action
                </Label>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setActionDialog({ type: null })}
              className="rounded-xl flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              variant={
                actionDialog.type === "delete" ? "destructive" : "default"
              }
              className={cn(
                "rounded-xl flex-1",
                actionDialog.type === "ban" &&
                  "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600",
                actionDialog.type === "suspend" &&
                  "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600",
                actionDialog.type === "warn" &&
                  "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600",
                actionDialog.type === "delete" &&
                  "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600"
              )}
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
              {actionDialog.type === "delete" && "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
