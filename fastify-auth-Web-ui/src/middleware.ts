import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { env } from "./lib/env";

// This function can be marked `async` if using `await` inside
export const middleware = async (request: NextRequest) => {
  const secret = new TextEncoder().encode(env.APP_SECRET);

  const cookiestoken = request.cookies.get("FAT")?.value;

  const publicRoutes = ["/auth/login", "/auth/register"];

  try {
    if (cookiestoken) {
      const abcd = await jwtVerify(cookiestoken, secret);

      console.log(abcd);

      // Redirect authenticated users away from public routes
      if (publicRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return NextResponse.next();
    } else {
      // Redirect unauthenticated users to login if they try to access protected routes
      if (!publicRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      return NextResponse.next();
    }
  } catch (error) {
    // const checkRes = NextResponse.redirect(new URL("/auth/login", request.url));

    // checkRes.cookies.delete("FAT");

    console.log(error);

    // return checkRes;
  }
};

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/auth/login", "/auth/register"],
};
