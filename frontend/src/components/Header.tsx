import React from 'react';
import { FaSearch } from 'react-icons/fa'; // Importando o ícone de lupa

interface HeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ search, setSearch }) => {
  return (
    <header className="bg-[#171616] flex flex-col gap-1 lg:flex-row md:flex-row justify-center items-center w-full p-4 shadow-md sticky top-0 z-50">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 w-full max-w-5xl justify-between items-center">
        <div className="relative w-full lg:w-[300px]">
          <input
            type="text"
            placeholder="Pesquisar tarefa..."
            className="p-2 pl-4 pr-10 w-full focus:border-[#69B9B6] focus:outline-none bg-[#2E2E2E] rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#757575]" />
        </div>

        <button className="px-4 py-2 bg-[#69B9B6] duration-300 hover:bg-[#599b99] text-white rounded-lg cursor-pointer w-full lg:w-auto">
          Adicionar Tarefa
        </button>
      </div>
    </header>
  );
}

export default Header;
