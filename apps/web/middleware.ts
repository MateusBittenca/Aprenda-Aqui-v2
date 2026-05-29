export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/trilhas/:path*",
    "/ranking/:path*",
    "/comunidade",
    "/licoes/:path*",
    "/perfil/:path*",
    "/configuracoes",
  ],
};
