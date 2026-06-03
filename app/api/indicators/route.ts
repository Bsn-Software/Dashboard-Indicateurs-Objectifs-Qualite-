import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/excel-parser";

export const revalidate = 0; // Disable cache to always fetch fresh data, or set to a number of seconds (e.g., 3600 for 1 hour)

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("API Error fetching dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Impossible de récupérer les données du tableau de bord.", details: error.message },
      { status: 500 }
    );
  }
}
