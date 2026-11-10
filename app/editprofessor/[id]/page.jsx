"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../components/header";
import styles from "./editprofessor.module.css";
import Link from "next/link";

const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default function EditarProfessorPage() {
    const router = useRouter();
    const { id } = useParams();

    const [nome, setNome] = useState("");
    const [nif, setNif] = useState("");
    const [diasAula, setDiasAula] = useState([]);
    const [disciplinaId, setDisciplinaId] = useState("");
    const [totalAulas, setTotalAulas] = useState("");
    const [disciplinas, setDisciplinas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (id) {
            carregarDados(id);
        } else {
            setCarregando(false);
        }
    }, [id]);

    async function carregarDados(idProfessor) {
        try {
            setCarregando(true);

            const [respProfessor, respDisciplinas] = await Promise.all([
                fetch(`/api/professores/${idProfessor}`),
                fetch("/api/disciplinas"),
            ]);

            if (!respProfessor.ok) {
                alert("Professor não encontrado!");
                router.push("/listprofessores");
                return;
            }

            const dados = await respProfessor.json();
            const listaDisciplinas = await respDisciplinas.json();

            setDisciplinas(Array.isArray(listaDisciplinas) ? listaDisciplinas : []);
            setNome(dados.nome || "");
            setNif(dados.nif || "");
            setDiasAula(
                (dados.dias_aula || "")
                    .split(",")
                    .map((d) => d.trim())
                    .filter(Boolean)
            );
            setDisciplinaId(String(dados.disciplina_id ?? ""));
            setTotalAulas(dados.total_aulas ?? "");
        } catch (erro) {
            console.error("Erro ao carregar professor:", erro);
            alert("Erro ao carregar dados do professor.");
        } finally {
            setCarregando(false);
        }
    }

    function alternarDia(dia) {
        setDiasAula((atuais) =>
            atuais.includes(dia)
                ? atuais.filter((d) => d !== dia)
                : [...atuais, dia]
        );
    }

    async function salvarProfessor(event) {
        event.preventDefault();

        if (diasAula.length === 0) {
            alert("Selecione pelo menos um dia de aula.");
            return;
        }

        try {
            setSalvando(true);

            const dias = DIAS_SEMANA.filter((d) => diasAula.includes(d)).join(", ");

            const resposta = await fetch("/api/professores", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_professor: id,
                    nome,
                    nif,
                    dias_aula: dias,
                    disciplina_id: disciplinaId,
                    total_aulas: totalAulas,
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                alert(dados.erro || "Não foi possível atualizar o professor.");
                return;
            }

            alert(dados.mensagem || "Professor atualizado com sucesso!");
            router.push("/listprofessores");
        } catch (erro) {
            console.error("Erro ao salvar professor:", erro);
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

                        <h1>Editar Professor</h1>

                        <p className={styles.descricao}>
                            Atualize as informações cadastrais do professor.
                        </p>

                        {carregando ? (
                            <p className={styles.mensagem}>
                                Carregando informações do professor...
                            </p>
                        ) : (
                            <form
                                onSubmit={salvarProfessor}
                                className={styles.formulario}
                            >
                                <div className={styles.campo}>
                                    <label htmlFor="nome">Nome do professor</label>
                                    <input
                                        id="nome"
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Digite o nome do professor"
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
                                        placeholder="Digite a matrícula"
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

                                <div className={styles.linha}>
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
                                            placeholder="Ex.: 20"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.acoes}>
                                    <Link
                                        href="/listprofessores"
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
