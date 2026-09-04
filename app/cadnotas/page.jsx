'use client';

import { useState } from "react";
import Header from "../components/header";
import styles from "./cadnotas.module.css";

export default function CadNotas() {
    const [nomeAluno, setNomeAluno] = useState('');
    const [t1, setT1] = useState('');
    const [t2, setT2] = useState('');
    const [n1, setN1] = useState('');
    const [n2, setN2] = useState('');
    const [n3, setN3] = useState('');

    return (
        <>
            <Header />

            <main className={styles.main}>
                <section className={styles.container}>
                    <div className={styles.painel}>
                        <p className={styles.status}>
                            SISTEMA ONLINE ● CADASTRO DE NOTAS
                        </p>

                        <h2>Cadastro de Notas</h2>

                        <form className={styles.form}>
                            <div className={styles.campo}>
                                <label htmlFor="nomeAluno">Nome do Aluno</label>
                                <input
                                    id="nomeAluno"
                                    type="text"
                                    value={nomeAluno}
                                    onChange={(e) => setNomeAluno(e.target.value)}
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="t1">T1 (Trabalho 1)</label>
                                <input
                                    id="t1"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={t1}
                                    onChange={(e) => setT1(e.target.value)}
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="t2">T2 (Trabalho 2)</label>
                                <input
                                    id="t2"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={t2}
                                    onChange={(e) => setT2(e.target.value)}
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="n1">N1 (Nota 1)</label>
                                <input
                                    id="n1"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={n1}
                                    onChange={(e) => setN1(e.target.value)}
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="n2">N2 (Nota 2)</label>
                                <input
                                    id="n2"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={n2}
                                    onChange={(e) => setN2(e.target.value)}
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="n3">N3 (Nota 3)</label>
                                <input
                                    id="n3"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="10"
                                    value={n3}
                                    onChange={(e) => setN3(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.botao}
                            >
                                Salvar Notas
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}