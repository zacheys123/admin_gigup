import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/banned",
  "/unauthorized",
  "/contact",
  "/faq",
  "/terms",
  "/privacy",
  "/api/webhooks/clerk",
  "/test-clerk", // Remove after testing
];

// Define admin routes that require additional checks
const ADMIN_ROUTES = ["/admin(.*)", "/dashboard(.*)"];

const isPublicRoute = createRouteMatcher(PUBLIC_ROUTES);
const isAdminRoute = createRouteMatcher(ADMIN_ROUTES);

export default clerkMiddleware(async (auth, request) => {
  const { userId, redirectToSignIn } = await auth();
  const path = request.nextUrl.pathname;

  console.log("🛡️ Middleware protecting:", path, {
    userId: userId ? `user_${userId.substring(0, 8)}...` : "none",
    isPublic: isPublicRoute(request),
    isAdmin: isAdminRoute(request),
  });

  // Skip middleware for public routes
  if (isPublicRoute(request)) {
    console.log("✅ Public route - allowing access");

    // Redirect authenticated users away from auth pages to admin
    if (
      userId &&
      (path.startsWith("/sign-in") || path.startsWith("/sign-up"))
    ) {
      console.log("🔄 Redirecting authenticated user from auth pages to admin");
      return Response.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  // PROTECT ALL OTHER ROUTES
  if (!userId) {
    console.log("❌ No user ID - redirecting to sign in");
    return redirectToSignIn();
  }

  // ADMIN ROUTE PROTECTION
  if (isAdminRoute(request)) {
    console.log("🔐 Admin route detected - user will be verified in component");

    // Note: We allow access here, but the actual admin check happens in the component
    // This prevents redirect loops while still protecting the route
  }

  console.log("✅ Authenticated user - allowing access to:", path);
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
