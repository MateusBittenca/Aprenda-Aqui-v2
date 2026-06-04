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
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;
    const isTeacher = role === "TEACHER";
    const isProfessorRoute = pathname.startsWith("/professor");

    // Professor: só bloqueia se o papel for explicitamente STUDENT
    if (isProfessorRoute && role === "STUDENT") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const isStudentRoute = studentRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isStudentRoute && isTeacher) {
      return NextResponse.redirect(new URL("/professor/trilhas", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
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
