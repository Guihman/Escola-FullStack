'use client';
import Header from "../components/header";

export default function ListAlunos(){
    return(
        <>
            <Header/>
            <h2>Lista de Alunos</h2>
            <table>
                <thead>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th>Série</th>
                    <th>Ra</th>
                </thead>
                <tbody>
                    <tr>
                        <td>01</td>
                        <td>Guilherme</td>
                        <td>18</td>
                        <td>3B</td>
                        <td>909030</td>
                        <td><button>Editar</button></td>
                        <td><button>Deletar</button></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}