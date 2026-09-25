import db from "../../db/banco";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const notas = db.prepare(`
            SELECT 
                notas.id_nota,
                alunos.nome,
                alunos.ra,
                notas.t1,
                notas.t2,
                notas.n1,
                notas.n2,
                notas.n3
            FROM notas
            INNER JOIN alunos ON notas.aluno_id = alunos.id_aluno
            ORDER BY alunos.nome
        `).all();

        return NextResponse.json(notas);

    } catch (error) {
        console.error("Erro ao buscar notas ", error);
        return NextResponse.json(
            { erro: "Erro ao buscar notas" },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const dados = await request.json();

        const sql = db.prepare(`
            INSERT INTO notas 
            (aluno_id, t1, t2, n1, n2, n3) 
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        sql.run(
            dados.aluno_id,
            dados.t1,
            dados.t2,
            dados.n1,
            dados.n2,
            dados.n3
        );

        return NextResponse.json({
            mensagem: "Nota salva com sucesso!"
        });

    } catch (error) {
        console.error("Erro ao salvar ", error);

        return NextResponse.json(
            { erro: "Erro ao salvar nota" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const dados = await request.json();

        const sql = db.prepare(`
            UPDATE notas
            SET 
                aluno_id = ?,
                t1 = ?,
                t2 = ?,
                n1 = ?,
                n2 = ?,
                n3 = ?
            WHERE id_nota = ?
        `);

        sql.run(
            dados.aluno_id,
            dados.t1,
            dados.t2,
            dados.n1,
            dados.n2,
            dados.n3,
            dados.id_nota
        );

        return NextResponse.json({
            mensagem: "Nota atualizada com sucesso!"
        });

    } catch (error) {
        console.error("Erro ao editar nota ", error);

        return NextResponse.json(
            { erro: "Erro ao editar nota" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const dados = await request.json();

        const sql = db.prepare(`
            DELETE FROM notas 
            WHERE id_nota = ?
        `);

        sql.run(dados.id_nota);

        return NextResponse.json({
            mensagem: "Nota excluída com sucesso!"
        });

    } catch (error) {
        console.error("Erro ao excluir nota ", error);

        return NextResponse.json(
            { erro: "Erro ao excluir nota" },
            { status: 500 }
        );
    }
}