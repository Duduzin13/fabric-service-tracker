// src/components/CadastroCliente.tsx
import React, { useState } from 'react';
import { saveToFirebase } from '@/lib/firebase';
import { toast } from "sonner";

const CadastroCliente: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveToFirebase('clientes', {
        nome,
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      toast.success('Cliente cadastrado com sucesso!');
      setNome('');
      setEmail('');
    } catch (error) {
      console.error('Erro ao cadastrar cliente: ', error);
      toast.error('Erro ao cadastrar cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Cadastrar</button>
    </form>
  );
};

export default CadastroCliente;
