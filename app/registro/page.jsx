'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Registro() {
  const [usuario, setUsuario] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleRegistro = (e) => {
    e.preventDefault();
    // Lógica para envio de dados/API pode ser adicionada aqui

    // Redireciona para a tela de login
    router.push('/login');
  };

  const irParaRegistro = () => {
    router.push('/registro');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Cadastro de Usuário</h2>
      <form onSubmit={handleRegistro}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="usuario">Usuário: </label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="nome">Nome: </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="senha">Senha: </label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px 15px', marginRight: '10px' }}>
          Salvar Registro
        </button>
        
        <button type="button" onClick={irParaRegistro} style={{ padding: '10px 15px' }}>
          Ir para Registro
        </button>
      </form>
    </div>
  );
}