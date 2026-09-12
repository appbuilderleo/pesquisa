import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const res = await query("SELECT * FROM surveys WHERE id = $1", [params.id]);
  if (res.rows.length === 0) {
    return NextResponse.json({ error: "Entrevista não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ survey: res.rows[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  await query("DELETE FROM surveys WHERE id = $1", [params.id]);
  return NextResponse.json({ success: true });
}
