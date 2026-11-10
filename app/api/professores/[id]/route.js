import { NextResponse } from "next/server";
import db from "../../../db/banco";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    const professor = db
      .prepare("SELECT * FROM professores WHERE id_professor = ?")
      .get(id);

    if (!professor) {
      return NextResponse.json(
        { erro: "Professor não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(professor);
  } catch (erro) {
    return NextResponse.json(
      { erro: "Erro ao buscar professor" },
      { status: 500 }
    );
  }
}
