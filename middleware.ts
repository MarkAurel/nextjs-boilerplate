import { NextRequest, NextResponse } from "next/server";
import { getHostnameDataOrDefault } from "./lib/db";

export const config = {
  matcher: ["/", "/about", "/_sites/:path"],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  let hostname = req.headers.get("host");

  // If in a production environment on Vercel, adjust the host value
  if (process.env.VERCEL_ENV === "production") {
    const customDomain = hostname.includes(".bauzito.shop");
    hostname = customDomain
      ? hostname.replace(`.bauzito.shop`, "")
      : hostname.replace(`.vercel.app`, "");
  }

  try {
    const data = await getHostnameDataOrDefault(currentHost);
    console.log(data);

    // Prevent security issues – users should not be able to canonically access
    // the pages/sites folder and its respective contents.
    if (url.pathname.startsWith(`/_sites`)) {
      url.pathname = `/404`;
    } else {
      // console.log('URL 2', req.nextUrl.href)
      // rewrite to the current subdomain under the pages/sites folder
      url.pathname = `/_sites/${data.subdomain}${url.pathname}`;
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
  }

  return NextResponse.rewrite(url);
}
