import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // /auth/* 는 OAuth callback 등 locale 무관 라우트라 next-intl 미들웨어에서 제외.
  matcher: ["/((?!api|_next|_vercel|auth|.*\\..*).*)"],
};
