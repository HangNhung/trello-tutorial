import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

export default clerkMiddleware((auth, request) => {
  const { userId, orgId, redirectToSignIn } = auth();
  if (userId && isPublicRoute(request)) {
    let path = "/select-org";
    if (orgId) {
      path = `/organization/${orgId}`;
    }

    const orgSelection = new URL(path, request.url);
    return NextResponse.redirect(orgSelection);
  }

  // Handle users who aren't authenticated
  if (!userId && !isPublicRoute(request)) {
    return redirectToSignIn({ returnBackUrl: request.url });
  }

  // Redirect users who are authenticated but not in an org to the org selection page
  if (userId && !orgId && request.nextUrl.pathname !== "/select-org") {
    const orgSelection = new URL("/select-org", request.url);
    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
