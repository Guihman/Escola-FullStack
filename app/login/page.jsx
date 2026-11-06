'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Lógica para verificação/autenticação pode ser adicionada aqui

    // Redireciona para a tela principal
    router.push('/principal');
  };

  const irParaRegistro = () => {
    router.push('/registro');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
          Entrar no Sistema
        </button>

        <button type="button" onClick={irParaRegistro} style={{ padding: '10px 15px' }}>
          Registro
        </button>
      </form>
    </div>
  );
}