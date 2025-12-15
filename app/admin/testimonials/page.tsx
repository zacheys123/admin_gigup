"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import {
  Star,
  Filter,
  Check,
  X,
  TrendingUp,
  BarChart,
  Users,
  DollarSign,
  Sparkles,
  Target,
  Award,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { useThemeColors } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export default function TestimonialManager() {
  const { colors, isDarkMode, mounted } = useThemeColors();
  const testimonials =
    useQuery(api.controllers.testimonials.getAllTestimonials) || [];
  const eligibleTestimonials =
    useQuery(api.controllers.testimonials.getEligibleForFeaturing) || [];
  const analytics = useQuery(
    api.controllers.testimonials.getFeaturingAnalytics
  );

  const toggleFeature = useMutation(
    api.controllers.testimonials.toggleFeatureTestimonial
  );

  const [filter, setFilter] = useState("all");

  const handleToggleFeature = async (
    testimonialId: string,
    currentlyFeatured: boolean
  ) => {
    await toggleFeature({
      testimonialId: testimonialId as Id<"testimonials">,
      featured: !currentlyFeatured,
    });
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === "all") return true;
    if (filter === "featured") return t.featured;
    if (filter === "eligible")
      return eligibleTestimonials.some((e) => e._id === t._id);
    return t.userRole.toLowerCase().includes(filter.toLowerCase());
  });

  // Stats helper function
  const getFeaturedStats = () => {
    const total = analytics?.total || 0;
    const featured = analytics?.featured || 0;
    const rate = total ? (featured / total) * 100 : 0;
    const avgRating = analytics?.avgRatingFeatured || 0;

    return {
      total,
      featured,
      rate: rate.toFixed(1),
      avgRating: avgRating.toFixed(1),
      eligible: eligibleTestimonials.length,
    };
  };

  const stats = getFeaturedStats();

  // Get card variant based on filter
  const getCardVariant = (testimonial: any, eligibleItem: any) => {
    if (testimonial.featured) {
      return {
        bg: isDarkMode
          ? "bg-gradient-to-r from-orange-900/20 to-amber-900/10"
          : "bg-gradient-to-r from-amber-50 to-orange-50",
        border: isDarkMode ? "border-orange-700/30" : "border-amber-200",
        badge: "bg-gradient-to-r from-orange-500 to-amber-500",
        badgeText: "text-white",
      };
    } else if (eligibleItem) {
      return {
        bg: isDarkMode
          ? "bg-gradient-to-r from-amber-900/10 to-yellow-900/5"
          : "bg-gradient-to-r from-amber-50/50 to-yellow-50/30",
        border: isDarkMode ? "border-amber-700/20" : "border-amber-100",
        badge: isDarkMode ? "bg-amber-900/30" : "bg-amber-100",
        badgeText: isDarkMode ? "text-amber-300" : "text-amber-800",
      };
    }
    return {
      bg: isDarkMode ? "bg-gray-800/50" : "bg-white",
      border: isDarkMode ? "border-gray-700" : "border-gray-200",
      badge: "",
      badgeText: "",
    };
  };

  if (!mounted) {
    return (
      <div className={cn("min-h-screen", colors.background)}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="relative">
              <div
                className={cn(
                  "w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4",
                  isDarkMode
                    ? "border-gray-700 border-t-orange-500"
                    : "border-gray-300 border-t-orange-400"
                )}
              ></div>
              <Sparkles
                className={cn(
                  "w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                  isDarkMode ? "text-orange-400" : "text-orange-500"
                )}
              />
            </div>
            <div className={cn("text-lg font-medium", colors.text)}>
              Loading Testimonial Manager
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen p-6", colors.background)}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={cn("text-3xl font-bold", colors.text)}>
              Testimonial Manager
            </h1>
            <p className={cn("mt-2", colors.textMuted)}>
              Feature testimonials from top performers to boost platform
              credibility
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className={cn("w-5 h-5", colors.primary)} />
            <span className={cn("text-sm font-medium", colors.primary)}>
              {stats.featured} Featured • {stats.rate}% Rate
            </span>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={cn("border", colors.border)}>
            <CardHeader className="pb-2">
              <CardTitle
                className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  colors.textMuted
                )}
              >
                <Users className="w-4 h-4" />
                Total Testimonials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-3xl font-bold", colors.text)}>
                {stats.total}
              </div>
              <div className={cn("text-sm mt-1", colors.textMuted)}>
                Across all users
              </div>
            </CardContent>
          </Card>

          <Card className={cn("border", colors.border)}>
            <CardHeader className="pb-2">
              <CardTitle
                className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  colors.textMuted
                )}
              >
                <Star className="w-4 h-4" />
                Featured
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-3xl font-bold", colors.primary)}>
                {stats.featured}
              </div>
              <div className={cn("text-sm mt-1", colors.textMuted)}>
                Avg. rating: {stats.avgRating}
              </div>
            </CardContent>
          </Card>

          <Card className={cn("border", colors.border)}>
            <CardHeader className="pb-2">
              <CardTitle
                className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  colors.textMuted
                )}
              >
                <TrendingUp className="w-4 h-4" />
                Eligible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "text-3xl font-bold text-amber-600 dark:text-amber-400"
                )}
              >
                {stats.eligible}
              </div>
              <div className={cn("text-sm mt-1", colors.textMuted)}>
                4+ stars, 1+ bookings
              </div>
            </CardContent>
          </Card>

          <Card className={cn("border", colors.border)}>
            <CardHeader className="pb-2">
              <CardTitle
                className={cn(
                  "text-sm font-medium flex items-center gap-2",
                  colors.textMuted
                )}
              >
                <BarChart className="w-4 h-4" />
                Featuring Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-3xl font-bold", colors.text)}>
                {stats.rate}%
              </div>
              <div className={cn("text-sm mt-1", colors.textMuted)}>
                of total testimonials
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featuring Criteria */}
        <Card className={cn("border", colors.border)}>
          <CardHeader>
            <CardTitle className={cn("flex items-center gap-2", colors.text)}>
              <Target className="w-5 h-5" />
              Featuring Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: <Star className="w-4 h-4" />,
                  label: "Minimum Rating",
                  value: "4+ Stars",
                  color: "text-amber-600 dark:text-amber-400",
                },
                {
                  icon: <Calendar className="w-4 h-4" />,
                  label: "Bookings",
                  value: "1+ Bookings",
                  color: "text-green-600 dark:text-green-400",
                },
                {
                  icon: <Award className="w-4 h-4" />,
                  label: "Content Length",
                  value: "50+ chars",
                  color: "text-blue-600 dark:text-blue-400",
                },
                {
                  icon: <TrendingDown className="w-4 h-4" />,
                  label: "Max Featured",
                  value: "6 Active",
                  color: "text-purple-600 dark:text-purple-400",
                },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div
                    className={cn(
                      "text-sm font-medium flex items-center gap-2",
                      colors.textMuted
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </div>
                  <div className={cn("text-2xl font-bold", item.color)}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            size="sm"
            className={cn(
              filter === "all"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                : ""
            )}
          >
            All ({testimonials.length})
          </Button>
          <Button
            variant={filter === "featured" ? "default" : "outline"}
            onClick={() => setFilter("featured")}
            size="sm"
            className={cn(
              "gap-2",
              filter === "featured"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                : ""
            )}
          >
            <Star className="w-3 h-3" />
            Featured ({testimonials.filter((t) => t.featured).length})
          </Button>
          <Button
            variant={filter === "eligible" ? "default" : "outline"}
            onClick={() => setFilter("eligible")}
            size="sm"
            className={cn(
              "gap-2",
              filter === "eligible"
                ? isDarkMode
                  ? "bg-gradient-to-r from-amber-700 to-yellow-700 hover:from-amber-800 hover:to-yellow-800"
                  : "bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200"
                : isDarkMode
                  ? "border-amber-700/30 text-amber-300 hover:bg-amber-900/20"
                  : "border-amber-200 text-amber-700 hover:bg-amber-50"
            )}
          >
            <TrendingUp className="w-3 h-3" />
            Eligible ({eligibleTestimonials.length})
          </Button>
          <Button
            variant={filter === "5star" ? "default" : "outline"}
            onClick={() => setFilter("5star")}
            size="sm"
            className="gap-2"
          >
            <Star className="w-3 h-3" />5 Stars (
            {testimonials.filter((t) => t.rating === 5).length})
          </Button>
        </div>

        {/* Testimonials List */}
        <div className="space-y-4">
          {filteredTestimonials.map((testimonial) => {
            const eligibleItem = eligibleTestimonials.find(
              (e) => e._id === testimonial._id
            );
            const variant = getCardVariant(testimonial, eligibleItem);

            return (
              <div
                key={testimonial._id}
                className={cn(
                  "p-4 rounded-lg border backdrop-blur-sm transition-all duration-200 hover:shadow-lg",
                  variant.bg,
                  variant.border
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4",
                              i < testimonial.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : isDarkMode
                                  ? "text-gray-600"
                                  : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>

                      {/* User Info */}
                      <span className={cn("font-semibold", colors.text)}>
                        {testimonial.userName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm px-2 py-1 rounded",
                            isDarkMode
                              ? "bg-gray-700/50 text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {testimonial.userRole}
                        </span>
                        <span className={cn("text-sm", colors.textMuted)}>
                          {testimonial.userCity}
                        </span>
                      </div>

                      {/* Badges */}
                      {testimonial.featured && (
                        <span
                          className={cn(
                            "px-3 py-1 text-xs font-bold rounded-full",
                            variant.badge,
                            variant.badgeText
                          )}
                        >
                          ⭐ Featured
                        </span>
                      )}
                      {eligibleItem && !testimonial.featured && (
                        <span
                          className={cn(
                            "px-3 py-1 text-xs font-bold rounded-full",
                            isDarkMode
                              ? "bg-amber-900/30 text-amber-300 border border-amber-700/30"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          )}
                        >
                          🎯 Eligible (Score:{" "}
                          {eligibleItem.featuringScore.toFixed(0)})
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={cn(
                        "text-lg italic mb-4 px-2 border-l-4",
                        testimonial.featured
                          ? isDarkMode
                            ? "border-orange-500/50 text-orange-200"
                            : "border-amber-300 text-amber-800"
                          : isDarkMode
                            ? "border-gray-600 text-gray-300"
                            : "border-gray-300 text-gray-700"
                      )}
                    >
                      "{testimonial.content}"
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex items-center gap-1 px-3 py-1.5 rounded-lg",
                            isDarkMode ? "bg-gray-700/50" : "bg-gray-100"
                          )}
                        >
                          <DollarSign className="w-3 h-3" />
                          <span className={cn("font-medium", colors.text)}>
                            {testimonial.stats.bookings} bookings
                          </span>
                        </div>
                        <div
                          className={cn(
                            "flex items-center gap-1 px-3 py-1.5 rounded-lg",
                            isDarkMode ? "bg-gray-700/50" : "bg-gray-100"
                          )}
                        >
                          <span className={cn("font-medium", colors.text)}>
                            Earned: ${testimonial.stats.earnings}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "text-sm px-3 py-1.5 rounded-lg",
                            isDarkMode
                              ? "bg-gray-700/50 text-gray-400"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          Joined: {testimonial.stats.joinedDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="ml-4 flex-shrink-0">
                    <Button
                      variant={testimonial.featured ? "destructive" : "default"}
                      size="sm"
                      onClick={() =>
                        handleToggleFeature(
                          testimonial._id,
                          testimonial.featured
                        )
                      }
                      className={cn(
                        "gap-2 font-medium transition-all",
                        testimonial.featured
                          ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                          : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                      )}
                    >
                      {testimonial.featured ? (
                        <>
                          <X className="w-3 h-3" />
                          Unfeature
                        </>
                      ) : (
                        <>
                          <Star className="w-3 h-3" />
                          Feature
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTestimonials.length === 0 && (
          <div
            className={cn(
              "text-center py-12 rounded-lg border",
              colors.card,
              colors.border
            )}
          >
            <Star
              className={cn(
                "w-12 h-12 mx-auto mb-4",
                isDarkMode ? "text-gray-600" : "text-gray-300"
              )}
            />
            <h3 className={cn("text-xl font-semibold mb-2", colors.text)}>
              No testimonials found
            </h3>
            <p className={cn("text-sm", colors.textMuted)}>
              {filter === "all"
                ? "No testimonials have been submitted yet."
                : `No testimonials match the "${filter}" filter.`}
            </p>
          </div>
        )}

        {/* Footer Stats */}
        <div
          className={cn(
            "mt-8 pt-6 border-t flex items-center justify-between text-sm",
            colors.border
          )}
        >
          <div className={cn("flex items-center gap-4", colors.textMuted)}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Eligible: {stats.eligible}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>Featured: {stats.featured}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Featured Rate: {stats.rate}%</span>
            </div>
          </div>
          <div className={cn("text-sm", colors.textMuted)}>
            Last updated: Just now
          </div>
        </div>
      </div>
    </div>
  );
}
