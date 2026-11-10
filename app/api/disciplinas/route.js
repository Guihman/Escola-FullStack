import db from "../../db/banco";
import { NextResponse } from "next/server";

function validar(dados) {
    if (!dados.nome?.trim()) {
        return "Informe o nome da disciplina.";
    }
    if (
        dados.pontuacao_minima === "" ||
        dados.pontuacao_minima === null ||
        dados.pontuacao_minima === undefined ||
        Number.isNaN(Number(dados.pontuacao_minima)) ||
        Number(dados.pontuacao_minima) < 0
    ) {
        return "Informe uma pontuação mínima válida (0 ou maior).";
    }
    return null;
}

export async function GET() {
    try {
        const disciplinas = db.prepare(
            "SELECT * FROM disciplinas ORDER BY nome"
        ).all();

        return NextResponse.json(disciplinas);
    } catch (error) {
        console.error("Erro ao buscar disciplinas:", error);

        return NextResponse.json(
            { erro: "Erro ao buscar disciplinas." },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const dados = await request.json();

        const erroValidacao = validar(dados);
        if (erroValidacao) {
            return NextResponse.json({ erro: erroValidacao }, { status: 400 });
        }

        const sql = db.prepare(`
            INSERT INTO disciplinas (nome, pontuacao_minima)
            VALUES (?, ?)
        `);

        sql.run(dados.nome.trim(), Number(dados.pontuacao_minima));

        return NextResponse.json(
            { mensagem: "Disciplina salva com sucesso!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao salvar disciplina:", error);

        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return NextResponse.json(
                { erro: "Já existe uma disciplina com esse nome." },
                { status: 409 }
            );
        }

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { erro: "Os dados enviados não estão em um formato JSON válido." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { erro: "Erro interno ao salvar a disciplina." },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const dados = await request.json();

        if (!dados.id_disciplina) {
            return NextResponse.json(
                { erro: "Informe o ID da disciplina." },
                { status: 400 }
            );
        }

        const erroValidacao = validar(dados);
        if (erroValidacao) {
            return NextResponse.json({ erro: erroValidacao }, { status: 400 });
        }

        const sql = db.prepare(`
            UPDATE disciplinas
            SET nome = ?, pontuacao_minima = ?
            WHERE id_disciplina = ?
        `);

        const resultado = sql.run(
            dados.nome.trim(),
            Number(dados.pontuacao_minima),
            dados.id_disciplina
        );

        if (resultado.changes === 0) {
            return NextResponse.json(
                { erro: "Disciplina não encontrada." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            mensagem: "Disciplina atualizada com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao editar disciplina:", error);

        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return NextResponse.json(
                { erro: "Já existe uma disciplina com esse nome." },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { erro: "Erro ao editar a disciplina." },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const dados = await request.json();

        if (!dados.id_disciplina) {
            return NextResponse.json(
                { erro: "Informe o ID da disciplina." },
                { status: 400 }
            );
        }

        const sql = db.prepare(
            "DELETE FROM disciplinas WHERE id_disciplina = ?"
        );

        const resultado = sql.run(dados.id_disciplina);

        if (resultado.changes === 0) {
            return NextResponse.json(
                { erro: "Disciplina não encontrada." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            mensagem: "Disciplina excluída com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao excluir disciplina:", error);

        if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
            return NextResponse.json(
                {
                    erro: "Não é possível excluir: existem professores vinculados a esta disciplina."
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { erro: "Erro ao excluir a disciplina." },
            { status: 500 }
        );
    }
}
