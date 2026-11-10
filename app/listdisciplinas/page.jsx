'use client';

import { useState, useEffect } from "react";
import Header from "../components/header";
import styles from "./listdisciplinas.module.css";
import { useRouter } from "next/navigation";

export default function ListDisciplinas() {
    const [disciplinas, setDisciplinas] = useState([]);
    const router = useRouter();

    useEffect(() => {
        buscarDisciplinas();
    }, []);

    async function buscarDisciplinas() {
        const resposta = await fetch("/api/disciplinas");
        const dados = await resposta.json();

        setDisciplinas(Array.isArray(dados) ? dados : []);
    }

    function editarDisciplina(id) {
        router.push(`/editdisciplina/${id}`);
    }

    async function excluirDisciplina(id) {
        if (!confirm("Deseja realmente excluir esta disciplina?")) return;

        const resposta = await fetch("/api/disciplinas", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_disciplina: id })
        });

        const dados = await resposta.json();
        alert(dados.mensagem || dados.erro);
        buscarDisciplinas();
    }

    return (
        <>
            <Header />

            <main className={styles.main}>
                <section className={styles.container}>
                    <div className={styles.painel}>
                        <p className={styles.status}>
                            SISTEMA ONLINE ● DISCIPLINAS
                        </p>

                        <h2>Lista de Disciplinas</h2>

                        <div className={styles.tabelaWrapper}>
                            <table className={styles.tabela}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Disciplina</th>
                                        <th>Pontuação mínima</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {disciplinas.map((disciplina) => (
                                        <tr key={disciplina.id_disciplina}>
                                            <td>{disciplina.id_disciplina}</td>
                                            <td className={styles.nome}>
                                                {disciplina.nome}
                                            </td>
                                            <td>{disciplina.pontuacao_minima}</td>

                                            <td className={styles.colAcoes}>
                                                <button
                                                    className={styles.btnEditar}
                                                    onClick={() =>
                                                        editarDisciplina(
                                                            disciplina.id_disciplina
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className={styles.btnDeletar}
                                                    onClick={() =>
                                                        excluirDisciplina(
                                                            disciplina.id_disciplina
                                                        )
                                                    }
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
