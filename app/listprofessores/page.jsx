'use client';

import { useState, useEffect } from "react";
import Header from "../components/header";
import styles from "./listprofessores.module.css";
import { useRouter } from "next/navigation";

export default function ListProfessores() {
    const [professores, setProfessores] = useState([]);
    const router = useRouter();

    useEffect(() => {
        buscarProfessores();
    }, []);

    async function buscarProfessores() {
        const resposta = await fetch("/api/professores");
        const dados = await resposta.json();

        setProfessores(Array.isArray(dados) ? dados : []);
    }

    function editarProfessor(id) {
        router.push(`/editprofessor/${id}`);
    }

    async function excluirProfessor(id) {
        if (!confirm("Deseja realmente excluir este professor?")) return;

        const resposta = await fetch("/api/professores", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id_professor: id })
        });

        const dados = await resposta.json();
        alert(dados.mensagem || dados.erro);
        buscarProfessores();
    }

    return (
        <>
            <Header />

            <main className={styles.main}>
                <section className={styles.container}>
                    <div className={styles.painel}>
                        <p className={styles.status}>
                            SISTEMA ONLINE ● PROFESSORES
                        </p>

                        <h2>Lista de Professores</h2>

                        <div className={styles.tabelaWrapper}>
                            <table className={styles.tabela}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>NIF</th>
                                        <th>Dias de aula</th>
                                        <th>Disciplina</th>
                                        <th>Aulas/semana</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {professores.map((professor) => (
                                        <tr key={professor.id_professor}>
                                            <td>{professor.id_professor}</td>
                                            <td className={styles.nome}>
                                                {professor.nome}
                                            </td>
                                            <td>{professor.nif}</td>
                                            <td>{professor.dias_aula}</td>
                                            <td>{professor.disciplina_nome}</td>
                                            <td>{professor.total_aulas}</td>

                                            <td className={styles.colAcoes}>
                                                <button
                                                    className={styles.btnEditar}
                                                    onClick={() =>
                                                        editarProfessor(
                                                            professor.id_professor
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className={styles.btnDeletar}
                                                    onClick={() =>
                                                        excluirProfessor(
                                                            professor.id_professor
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
