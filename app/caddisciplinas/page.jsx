'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import styles from "./caddisciplina.module.css";

export default function CadDisciplinas() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [pontuacaoMinima, setPontuacaoMinima] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function cadastraDisciplina(event) {
        event.preventDefault();

        if (carregando) return;

        setCarregando(true);

        try {
            const resposta = await fetch("/api/disciplinas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    pontuacao_minima: pontuacaoMinima
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.erro || "Não foi possível cadastrar a disciplina."
                );
            }

            alert(dados.mensagem || "Disciplina cadastrada com sucesso!");

            setNome("");
            setPontuacaoMinima("");

            router.push("/listdisciplinas");
        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert(error.message || "Erro ao cadastrar a disciplina.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <>
            <Header />

            <main className={styles.main}>
                <section className={styles.container}>
                    <div className={styles.painel}>
                        <p className={styles.status}>
                            SISTEMA ONLINE ● CADASTRO DE DISCIPLINAS
                        </p>

                        <h2>Cadastro de Disciplinas</h2>

                        <form
                            className={styles.form}
                            onSubmit={cadastraDisciplina}
                        >
                            <div className={styles.campo}>
                                <label htmlFor="nome">
                                    Nome da Disciplina
                                </label>
                                <input
                                    id="nome"
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="pontuacaoMinima">
                                    Pontuação Mínima para Passar
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
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.botao}
                                disabled={carregando}
                            >
                                {carregando
                                    ? "SALVANDO..."
                                    : "SALVAR DISCIPLINA"}
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}
