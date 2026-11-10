"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../components/header";
import styles from "./editdisciplina.module.css";
import Link from "next/link";

export default function EditarDisciplinaPage() {
    const router = useRouter();
    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [pontuacaoMinima, setPontuacaoMinima] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (id) {
            buscarDisciplina(id);
        } else {
            setCarregando(false);
        }
    }, [id]);

    async function buscarDisciplina(idDisciplina) {
        try {
            setCarregando(true);

            const resposta = await fetch(`/api/disciplinas/${idDisciplina}`);

            if (!resposta.ok) {
                alert("Disciplina não encontrada!");
                router.push("/listdisciplinas");
                return;
            }

            const dados = await resposta.json();

            setNome(dados.nome || "");
            setPontuacaoMinima(dados.pontuacao_minima ?? "");
        } catch (erro) {
            console.error("Erro ao carregar disciplina:", erro);
            alert("Erro ao carregar dados da disciplina.");
        } finally {
            setCarregando(false);
        }
    }

    async function salvarDisciplina(event) {
        event.preventDefault();

        try {
            setSalvando(true);

            const resposta = await fetch("/api/disciplinas", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_disciplina: id,
                    nome,
                    pontuacao_minima: pontuacaoMinima,
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.erro || "Não foi possível atualizar a disciplina.");
                return;
            }

            alert(dados.mensagem || "Disciplina atualizada com sucesso!");
            router.push("/listdisciplinas");
        } catch (erro) {
            console.error("Erro ao salvar disciplina:", erro);
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

                        <h1>Editar Disciplina</h1>

                        <p className={styles.descricao}>
                            Atualize as informações da disciplina.
                        </p>

                        {carregando ? (
                            <p className={styles.mensagem}>
                                Carregando informações da disciplina...
                            </p>
                        ) : (
                            <form
                                onSubmit={salvarDisciplina}
                                className={styles.formulario}
                            >
                                <div className={styles.campo}>
                                    <label htmlFor="nome">
                                        Nome da disciplina
                                    </label>
                                    <input
                                        id="nome"
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Ex.: Matemática"
                                        required
                                    />
                                </div>

                                <div className={styles.campo}>
                                    <label htmlFor="pontuacaoMinima">
                                        Pontuação mínima para passar
                                    </label>
                                    <input
                                        id="pontuacaoMinima"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={pontuacaoMinima}
                                        onChange={(e) =>
                                            setPontuacaoMinima(e.target.value)
                                        }
                                        placeholder="Ex.: 6"
                                        required
                                    />
                                </div>

                                <div className={styles.acoes}>
                                    <Link
                                        href="/listdisciplinas"
                                        className={styles.btnVoltar}
                                    >
                                        Voltar
                                    </Link>

                                    <button
                                        type="submit"
                                        className={styles.btnSalvar}
                                        disabled={salvando}
                                    >
                                        {salvando
                                            ? "Salvando..."
                                            : "Salvar alterações"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}
