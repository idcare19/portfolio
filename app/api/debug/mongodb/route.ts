import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    
    // We need to typecast to any here because db might not have admin() strictly typed depending on mongoose version
    const db = mongoose.connection.db as any;
    let pingResult = null;
    
    if (db && typeof db.admin === 'function') {
      const adminDb = db.admin();
      pingResult = await adminDb.ping();
    } else {
      // Fallback ping method if admin() is not available
      pingResult = await mongoose.connection.db?.command({ ping: 1 });
    }

    return NextResponse.json({
      success: true,
      dbName: mongoose.connection.db?.databaseName || null,
      readyState: mongoose.connection.readyState,
      ping: pingResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        readyState: mongoose.connection.readyState,
      },
      { status: 500 }
    );
  }
}
