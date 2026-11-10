'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/header";
import styles from "./cadprofessor.module.css";

const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default function CadProfessores() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [nif, setNif] = useState("");
    const [diasAula, setDiasAula] = useState([]);
    const [disciplinaId, setDisciplinaId] = useState("");
    const [totalAulas, setTotalAulas] = useState("");
    const [disciplinas, setDisciplinas] = useState([]);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        buscarDisciplinas();
    }, []);

    async function buscarDisciplinas() {
        try {
            const resposta = await fetch("/api/disciplinas");
            const dados = await resposta.json();

            setDisciplinas(Array.isArray(dados) ? dados : []);
        } catch (error) {
            console.error("Erro ao buscar disciplinas:", error);
        }
    }

    function alternarDia(dia) {
        setDiasAula((atuais) =>
            atuais.includes(dia)
                ? atuais.filter((d) => d !== dia)
                : [...atuais, dia]
        );
    }

    async function cadastraProfessor(event) {
        event.preventDefault();

        if (carregando) return;

        if (diasAula.length === 0) {
            alert("Selecione pelo menos um dia de aula.");
            return;
        }

        setCarregando(true);

        try {
            // Mantém a ordem da semana ao juntar os dias
            const dias = DIAS_SEMANA.filter((d) => diasAula.includes(d)).join(", ");

            const resposta = await fetch("/api/professores", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    nif: nif.trim(),
                    dias_aula: dias,
                    disciplina_id: disciplinaId,
                    total_aulas: totalAulas
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.erro || "Não foi possível cadastrar o professor."
                );
            }

            alert(dados.mensagem || "Professor cadastrado com sucesso!");

            setNome("");
            setNif("");
            setDiasAula([]);
            setDisciplinaId("");
            setTotalAulas("");

            router.push("/listprofessores");
        } catch (error) {
            console.error("Erro no cadastro:", error);
            alert(error.message || "Erro ao cadastrar o professor.");
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
                            SISTEMA ONLINE ● CADASTRO DE PROFESSORES
                        </p>

                        <h2>Cadastro de Professores</h2>

                        <form
                            className={styles.form}
                            onSubmit={cadastraProfessor}
                        >
                            <div className={styles.campo}>
                                <label htmlFor="nome">Nome do Professor</label>
                                <input
                                    id="nome"
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="nif">Matrícula (NIF)</label>
                                <input
                                    id="nif"
                                    type="text"
                                    value={nif}
                                    onChange={(e) => setNif(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.campo}>
                                <label>Dias que ministra aula</label>
                                <div className={styles.dias}>
                                    {DIAS_SEMANA.map((dia) => (
                                        <label key={dia} className={styles.dia}>
                                            <input
                                                type="checkbox"
                                                checked={diasAula.includes(dia)}
                                                onChange={() => alternarDia(dia)}
                                            />
                                            {dia}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="disciplina">
                                    Disciplina responsável
                                </label>
                                <select
                                    id="disciplina"
                                    value={disciplinaId}
                                    onChange={(e) =>
                                        setDisciplinaId(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    {disciplinas.map((disciplina) => (
                                        <option
                                            key={disciplina.id_disciplina}
                                            value={disciplina.id_disciplina}
                                        >
                                            {disciplina.nome}
                                        </option>
                                    ))}
                                </select>

                                {disciplinas.length === 0 && (
                                    <p className={styles.aviso}>
                                        Nenhuma disciplina cadastrada.{" "}
                                        <Link href="/caddisciplinas">
                                            Cadastre uma disciplina primeiro.
                                        </Link>
                                    </p>
                                )}
                            </div>

                            <div className={styles.campo}>
                                <label htmlFor="totalAulas">
                                    Total de aulas na semana
                                </label>
                                <input
                                    id="totalAulas"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={totalAulas}
                                    onChange={(e) =>
                                        setTotalAulas(e.target.value)
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
                                    : "SALVAR PROFESSOR"}
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}
