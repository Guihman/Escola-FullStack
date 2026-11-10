import db from "../../db/banco";
import { NextResponse } from "next/server";

function validar(dados) {
    if (!dados.nome?.trim()) {
        return "Informe o nome do professor.";
    }
    if (!String(dados.nif ?? "").trim()) {
        return "Informe a matrícula (NIF) do professor.";
    }
    if (!dados.dias_aula?.trim()) {
        return "Selecione pelo menos um dia em que o professor ministra aula.";
    }
    if (!dados.disciplina_id) {
        return "Selecione a disciplina responsável.";
    }
    if (
        dados.total_aulas === "" ||
        dados.total_aulas === null ||
        dados.total_aulas === undefined ||
        !Number.isInteger(Number(dados.total_aulas)) ||
        Number(dados.total_aulas) < 0
    ) {
        return "Informe um total de aulas na semana válido (número inteiro, 0 ou maior).";
    }
    return null;
}

function tratarErroBanco(error, acao) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return NextResponse.json(
            { erro: "Já existe um professor cadastrado com essa matrícula (NIF)." },
            { status: 409 }
        );
    }

    if (error.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
        return NextResponse.json(
            { erro: "A disciplina informada não existe." },
            { status: 400 }
        );
    }

    if (error instanceof SyntaxError) {
        return NextResponse.json(
            { erro: "Os dados enviados não estão em um formato JSON válido." },
            { status: 400 }
        );
    }

    return NextResponse.json(
        { erro: `Erro interno ao ${acao} o professor.` },
        { status: 500 }
    );
}

export async function GET() {
    try {
        const professores = db.prepare(`
            SELECT professores.*, disciplinas.nome AS disciplina_nome
            FROM professores
            INNER JOIN disciplinas
            ON professores.disciplina_id = disciplinas.id_disciplina
            ORDER BY professores.nome
        `).all();

        return NextResponse.json(professores);
    } catch (error) {
        console.error("Erro ao buscar professores:", error);

        return NextResponse.json(
            { erro: "Erro ao buscar professores." },
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
            INSERT INTO professores (nome, nif, dias_aula, disciplina_id, total_aulas)
            VALUES (?, ?, ?, ?, ?)
        `);

        sql.run(
            dados.nome.trim(),
            String(dados.nif).trim(),
            dados.dias_aula.trim(),
            Number(dados.disciplina_id),
            Number(dados.total_aulas)
        );

        return NextResponse.json(
            { mensagem: "Professor salvo com sucesso!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erro ao salvar professor:", error);
        return tratarErroBanco(error, "salvar");
    }
}

export async function PUT(request) {
    try {
        const dados = await request.json();

        if (!dados.id_professor) {
            return NextResponse.json(
                { erro: "Informe o ID do professor." },
                { status: 400 }
            );
        }

        const erroValidacao = validar(dados);
        if (erroValidacao) {
            return NextResponse.json({ erro: erroValidacao }, { status: 400 });
        }

        const sql = db.prepare(`
            UPDATE professores
            SET nome = ?, nif = ?, dias_aula = ?, disciplina_id = ?, total_aulas = ?
            WHERE id_professor = ?
        `);

        const resultado = sql.run(
            dados.nome.trim(),
            String(dados.nif).trim(),
            dados.dias_aula.trim(),
            Number(dados.disciplina_id),
            Number(dados.total_aulas),
            dados.id_professor
        );

        if (resultado.changes === 0) {
            return NextResponse.json(
                { erro: "Professor não encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            mensagem: "Professor atualizado com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao editar professor:", error);
        return tratarErroBanco(error, "editar");
    }
}

export async function DELETE(request) {
    try {
        const dados = await request.json();

        if (!dados.id_professor) {
            return NextResponse.json(
                { erro: "Informe o ID do professor." },
                { status: 400 }
            );
        }

        const sql = db.prepare(
            "DELETE FROM professores WHERE id_professor = ?"
        );

        const resultado = sql.run(dados.id_professor);

        if (resultado.changes === 0) {
            return NextResponse.json(
                { erro: "Professor não encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            mensagem: "Professor excluído com sucesso!"
        });
    } catch (error) {
        console.error("Erro ao excluir professor:", error);

        return NextResponse.json(
            { erro: "Erro ao excluir o professor." },
            { status: 500 }
        );
    }
}
