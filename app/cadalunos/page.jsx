
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import styles from "./cadaluno.module.css";

export default function CadAlunos() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [serie, setSerie] = useState("");
    const [ra, setRa] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function cadastraAluno(event) {
        event.preventDefault();

        if (carregando) return;

        setCarregando(true);

        try {
            const resposta = await fetch("/api/alunos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    idade,
                    serie: serie.trim(),
                    ra
                })
            });

            // Evita erro caso a API retorne uma resposta que não seja JSON
            const texto = await resposta.text();
            let dados;

            try {
                dados = JSON.parse(texto);
            } catch {
                throw new Error(
                    "O servidor retornou uma resposta inválida. Confira o terminal."
                );
            }

            if (!resposta.ok) {
                throw new Error(
                    dados.erro || "Não foi possível cadastrar o aluno."
                );
            }

            alert(dados.mensagem || "Aluno cadastrado com sucesso!");

            setNome("");
            setIdade("");
            setSerie("");
            setRa("");

            router.push("/listalunos");
        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert(error.message || "Erro ao cadastrar o aluno.");
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
                            SISTEMA ONLINE ● CADASTRO DE ESTUDANTES
                        </p>

                        <h2>Cadastro de Alunos</h2>

                        <form
                            className={styles.form}
                            onSubmit={cadastraAluno}
                        >
                            <div className={styles.campo}>
                                <label htmlFor="nome">
                                    Nome Completo
                                </label>
                                <input
                                    id="nome"
                                    type="text"
                                    value={nome}
                                    onChange={(e) =>
                                        setNome(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="idade">Idade</label>
                                <input
                                    id="idade"
                                    type="number"
                                    min="1"
                                    value={idade}
                                    onChange={(e) =>
                                        setIdade(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="serie">Série</label>
                                <input
                                    id="serie"
                                    type="text"
                                    value={serie}
                                    onChange={(e) =>
                                        setSerie(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="ra">RA</label>
                                <input
                                    id="ra"
                                    type="number"
                                    value={ra}
                                    onChange={(e) =>
                                        setRa(e.target.value)
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
                                    : "SALVAR ALUNO"}
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}
