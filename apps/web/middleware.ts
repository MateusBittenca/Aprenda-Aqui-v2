import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const studentRoutes = [
  "/dashboard",
  "/trilhas",
  "/ranking",
  "/comunidade",
  "/licoes",
  "/perfil",
  "/configuracoes",
  "/loja",
  "/ajuda",
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;
    const isTeacher = role === "TEACHER";
    const isProfessorRoute = pathname.startsWith("/professor");

    if (isProfessorRoute && !isTeacher) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const isStudentRoute = studentRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isStudentRoute && isTeacher) {
      return NextResponse.redirect(new URL("/professor", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/professor")) {
          return !!token;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/trilhas/:path*",
    "/ranking/:path*",
    "/comunidade",
    "/licoes/:path*",
    "/perfil/:path*",
    "/configuracoes",
    "/loja/:path*",
    "/ajuda",
    "/professor/:path*",
  ],
};
