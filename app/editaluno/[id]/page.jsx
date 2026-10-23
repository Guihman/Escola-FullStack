
"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Header from "../../components/header";
import styles from "./editaluno.module.css";
import Link from "next/link";

export default function EditarAlunoPage({ params: paramsPromise }) {
    const router = useRouter();
    const routeParams = useParams();
    const searchParams = useSearchParams();

    const resolvedParams = paramsPromise
        ? use(paramsPromise)
        : null;

    const id =
        resolvedParams?.id ||
        routeParams?.id ||
        searchParams?.get("id");

    const [id_aluno, setIdAluno] = useState("");
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [serie, setSerie] = useState("");
    const [ra, setRa] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (id) {
            buscarAluno(id);
        } else {
            setCarregando(false);
        }
    }, [id]);

    async function buscarAluno(idAluno) {
        try {
            setCarregando(true);

            const resposta = await fetch(`/api/alunos/${idAluno}`);

            if (!resposta.ok) {
                alert("Aluno não encontrado!");
                router.push("/listalunos");
                return;
            }

            const dados = await resposta.json();

            setIdAluno(dados.id_aluno || "");
            setNome(dados.nome || "");
            setIdade(dados.idade ?? "");
            setSerie(dados.serie || "");
            setRa(dados.ra || "");
        } catch (erro) {
            console.error("Erro ao carregar aluno:", erro);
            alert("Erro ao carregar dados do aluno.");
        } finally {
            setCarregando(false);
        }
    }

    async function salvarAluno(event) {
        event.preventDefault();

        if (!id) {
            alert("ID do aluno não foi encontrado.");
            return;
        }

        try {
            setSalvando(true);

            const resposta = await fetch("/api/alunos", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_aluno,
                    nome,
                    idade,
                    serie,
                    ra,
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.erro || "Não foi possível atualizar o aluno.");
                return;
            }

            alert(dados.mensagem || "Aluno atualizado com sucesso!");
            router.push("/listalunos");
        } catch (erro) {
            console.error("Erro ao salvar aluno:", erro);
            alert("Erro ao salvar as alterações.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <Header />

            <main className={styles.main}>
                <div className={styles.container}>
                    <section className={styles.painel}>
                        <p className={styles.status}>GESTÃO ESCOLAR</p>

                        <h1>Editar Aluno</h1>

                        <p className={styles.descricao}>
                            Atualize as informações cadastrais do aluno.
                        </p>

                        {carregando ? (
                            <p className={styles.mensagem}>
                                Carregando informações do aluno...
                            </p>
                        ) : (
                            <>
                                {!id && (
                                    <p className={styles.erro}>
                                        ID do aluno não encontrado.
                                    </p>
                                )}

                                <form
                                    onSubmit={salvarAluno}
                                    className={styles.formulario}
                                >
                                    <input
                                        type="hidden"
                                        value={id_aluno}
                                        readOnly
                                    />

                                    <div className={styles.campo}>
                                        <label htmlFor="nome">Nome completo</label>
                                        <input
                                            id="nome"
                                            type="text"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            placeholder="Digite o nome do aluno"
                                            required
                                        />
                                    </div>

                                    <div className={styles.linha}>
                                        <div className={styles.campo}>
                                            <label htmlFor="idade">Idade</label>
                                            <input
                                                id="idade"
                                                type="number"
                                                min="1"
                                                value={idade}
                                                onChange={(e) => setIdade(e.target.value)}
                                                placeholder="Ex.: 16"
                                                required
                                            />
                                        </div>

                                        <div className={styles.campo}>
                                            <label htmlFor="serie">Série / Turma</label>
                                            <input
                                                id="serie"
                                                type="text"
                                                value={serie}
                                                onChange={(e) => setSerie(e.target.value)}
                                                placeholder="Ex.: 3º A"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.campo}>
                                        <label htmlFor="ra">Registro do Aluno (RA)</label>
                                        <input
                                            id="ra"
                                            type="text"
                                            value={ra}
                                            onChange={(e) => setRa(e.target.value)}
                                            placeholder="Digite o RA do aluno"
                                            required
                                        />
                                    </div>

                                    <div className={styles.acoes}>
                                        <Link
                                            href="/listalunos"
                                            className={styles.btnVoltar}
                                        >
                                            Voltar
                                        </Link>

                                        <button
                                            type="submit"
                                            className={styles.btnSalvar}
                                            disabled={salvando || !id}
                                        >
                                            {salvando
                                                ? "Salvando..."
                                                : "Salvar alterações"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}
