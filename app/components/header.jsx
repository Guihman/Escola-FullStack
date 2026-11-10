import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.logo}>Sistema Escolar - SESI</h1>
                <nav>
                    <ul className={styles.menu}>
                        <li><Link href='/'>Início</Link></li>
                        <li><Link href='/cadalunos'>Cadastro - Alunos</Link></li>
                        <li><Link href='/listalunos'>Lista - Alunos</Link></li>
                        <li><Link href='/cadnotas'>Cadastro - Notas</Link></li>
                        <li><Link href='/listnotas'>Lista - Notas</Link></li>
                        <li><Link href='/caddisciplinas'>Cadastro - Disciplinas</Link></li>
                        <li><Link href='/listdisciplinas'>Lista - Disciplinas</Link></li>
                        <li><Link href='/cadprofessores'>Cadastro - Professores</Link></li>
                        <li><Link href='/listprofessores'>Lista - Professores</Link></li>
                    </ul>
                </nav>
            </header>
        </>
    );
}