import { NextRequest, NextResponse } from "next/server";
import { getHostnameDataOrDefault } from "./lib/db";

export const config = {
  matcher: ["/", "/about", "/_sites/:path"],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = req.headers.get("host");

  // If localhost, assign the host value manually
  // If prod, get the custom domain/subdomain value by removing the root URL
  // (in the case of "subdomain-3.localhost:3000", "localhost:3000" is the root URL)
  // process.env.NODE_ENV === "production" indicates that the app is deployed to a production environment
  // process.env.VERCEL === "1" indicates that the app is deployed on Vercel
  const currentHost = ".bauzito.shop";

  const data = [
    {
      name: "This is Site 1",
      description: "Subdomain + custom domain",
      subdomain: "test1",
      customDomain: "bauzito.shop",
      // Default subdomain for Preview deployments and for local development
      defaultForPreview: true,
    },
    {
      name: "This is Site 2",
      description: "Subdomain only",
      subdomain: "test2",
    },
    {
      name: "This is Site 3",
      description: "Subdomain only",
      subdomain: "test3",
    },
  ];

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents.
  if (url.pathname.startsWith(`/_sites`)) {
    url.pathname = `/404`;
  } else {
    // console.log('URL 2', req.nextUrl.href)
    // rewrite to the current subdomain under the pages/sites folder
    url.pathname = `/_sites/${data[0].subdomain}${url.pathname}`;
  }

  return NextResponse.rewrite(url);
}
