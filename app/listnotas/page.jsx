'use client';

import Header from "../components/header";
import styles from "./listnotas.module.css";

export default function ListNotas() {
    return (
        <>
            <Header />

            <main className={styles.main}>
                <section className={styles.container}>
                    <div className={styles.painel}>
                        <p className={styles.status}>
                            SISTEMA ONLINE ● BOLETIM ACADÊMICO
                        </p>

                        <h2>Lista de Notas</h2>

                        <div className={styles.tabelaWrapper}>
                            <table className={styles.tabela}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome do Aluno</th>
                                        <th>T1</th>
                                        <th>T2</th>
                                        <th>N1</th>
                                        <th>N2</th>
                                        <th>N3</th>
                                        <th className={styles.colAcoes} colSpan={2}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>01</td>
                                        <td className={styles.nome}>Guilherme</td>
                                        <td>8.5</td>
                                        <td>9.0</td>
                                        <td>7.5</td>
                                        <td>8.0</td>
                                        <td>9.5</td>
                                        <td>
                                            <button className={styles.btnEditar}>Editar</button>
                                        </td>
                                        <td>
                                            <button className={styles.btnDeletar}>Deletar</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}