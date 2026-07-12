import { NextResponse } from "next/server";
import { getFooterSocialLinks } from "../../../lib/wordpress";

export async function GET() {
  const links = await getFooterSocialLinks();
  return NextResponse.json(links);
}
