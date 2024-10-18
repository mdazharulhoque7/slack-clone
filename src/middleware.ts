import { convexAuthNextjsMiddleware, createRouteMatcher, isAuthenticatedNextjs, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(['/auth'])
 
export default convexAuthNextjsMiddleware((request, { convexAuth })=>{
    if(!isPublicPage(request) && !convexAuth.isAuthenticated()){
        return nextjsMiddlewareRedirect(request, '/auth')
    }
    // TODO: Redirect user away from "/auth" if authenticated.
    if(isPublicPage(request) && convexAuth.isAuthenticated()) {
      return nextjsMiddlewareRedirect(request, '/');
    };
});
 
export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// import {
//   convexAuthNextjsMiddleware,
//   createRouteMatcher,
//   nextjsMiddlewareRedirect,
// } from "@convex-dev/auth/nextjs/server";
 
// const isSignInPage = createRouteMatcher(["/auth"]);
// const isProtectedRoute = createRouteMatcher(["/(.*)"]);
 
// export default convexAuthNextjsMiddleware((request, { convexAuth }) => {
//   if (isSignInPage(request) && convexAuth.isAuthenticated()) {
//     return nextjsMiddlewareRedirect(request, "/");
//   }
//   if (isProtectedRoute(request) && !convexAuth.isAuthenticated()) {
//     return nextjsMiddlewareRedirect(request, "/auth");
//   }
// });
 
// export const config = {
//   // The following matcher runs middleware on all routes
//   // except static assets.
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };