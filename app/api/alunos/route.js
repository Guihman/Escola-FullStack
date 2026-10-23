
import db from "../../db/banco";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const alunos = db.prepare(
            "SELECT * FROM alunos ORDER BY nome"
        ).all();

        return NextResponse.json(alunos);
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);

        return NextResponse.json(
            { erro: "Erro ao buscar alunos." },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const dados = await request.json();

        // Verifica se os campos obrigatórios foram preenchidos
        if (
            !dados.nome?.trim() ||
            dados.idade === "" ||
            dados.idade === null ||
            dados.idade === undefined ||
            !dados.serie?.trim() ||
            dados.ra === "" ||
            dados.ra === null ||
            dados.ra === undefined
        ) {
            return NextResponse.json(
                { erro: "Preencha todos os campos obrigatórios." },
                { status: 400 }
            );
        }

        const sql = db.prepare(`
            INSERT INTO alunos (nome, idade, serie, ra)
            VALUES (?, ?, ?, ?)
        `);

        sql.run(
            dados.nome.trim(),
            Number(dados.idade),
            dados.serie.trim(),
            Number(dados.ra)
        );

        return NextResponse.json(
            { mensagem: "Aluno salvo com sucesso!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao salvar aluno:", error);

        if (error.code === "SQLITE_CONSTRAINT_NOTNULL") {
            return NextResponse.json(
                {
                    erro: "Um campo obrigatório não foi preenchido. Confira os dados enviados e as colunas obrigatórias do banco."
                },
                { status: 400 }
            );
        }

        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return NextResponse.json(
                { erro: "Já existe um aluno cadastrado com esse RA." },
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
            { erro: "Erro interno ao salvar o aluno." },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const dados = await request.json();

        if (
            !dados.id_aluno ||
            !dados.nome?.trim() ||
            dados.idade === "" ||
            dados.idade === null ||
            dados.idade === undefined ||
            !dados.serie?.trim() ||
            dados.ra === "" ||
            dados.ra === null ||
            dados.ra === undefined
        ) {
            return NextResponse.json(
                { erro: "Informe o ID e preencha todos os campos obrigatórios." },
                { status: 400 }
            );
        }

        const sql = db.prepare(`
            UPDATE alunos
            SET nome = ?, idade = ?, serie = ?, ra = ?
            WHERE id_aluno = ?
        `);

        const resultado = sql.run(
            dados.nome.trim(),
            Number(dados.idade),
            dados.serie.trim(),
            Number(dados.ra),
            dados.id_aluno
        );

        if (resultado.changes === 0) {
            return NextResponse.json(
                { erro: "Aluno não encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            mensagem: "Aluno atualizado com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao editar aluno:", error);

        return NextResponse.json(
            { erro: "Erro ao editar o aluno." },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const dados = await request.json();

        if (!dados.id_aluno) {
            return NextResponse.json(
                { erro: "Informe o ID do aluno." },
                { status: 400 }
            );
        }

        const sql = db.prepare(
            "DELETE FROM alunos WHERE id_aluno = ?"
        );

        const resultado = sql.run(dados.id_aluno);

        if (resultado.changes === 0) {
            return NextResponse.json(
                { erro: "Aluno não encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            mensagem: "Aluno excluído com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao excluir aluno:", error);

        return NextResponse.json(
            { erro: "Erro ao excluir o aluno." },
            { status: 500 }
        );
    }
}
