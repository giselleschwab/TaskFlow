import React from 'react';

interface HeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  handleAddTask: (title: string) => void;
}

const Header: React.FC<HeaderProps> = ({ search, setSearch, handleAddTask }) => {
  return (
    <header className="flex justify-between items-center p-4 rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Pesquisar tarefa..."
        className="border p-2 rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        onClick={() => handleAddTask('Nova Tarefa')}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Adicionar Tarefa
      </button>
    </header>
  );
}

export default Header;
