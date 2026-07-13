import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Read the incoming x-www-form-urlencoded string
    const textBody = await request.text();

    // Forward it directly to WordPress
    const res = await fetch("https://samaproductionme.com/wp-admin/admin-ajax.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: textBody,
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying contact form:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch from WP" }, { status: 500 });
  }
}
