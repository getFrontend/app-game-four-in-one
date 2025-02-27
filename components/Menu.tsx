import { logoImg } from '@/constants';
import Image from 'next/image';
import React from 'react';

interface MenuProps {
  setGameMode: (mode: string) => void;
}

const Menu: React.FC<MenuProps> = ({ setGameMode }) => {
  return (
    <div className="flex flex-col items-center">
      <Image src={logoImg} width={200} height={200} alt="Game logo" />
      <h1 className="text-4xl font-bold text-blue-500 my-6">Connect Four</h1>
      <p className="text-xl text-gray-600 mb-8">Play against a friend or challenge the AI!</p>
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Select Game Mode</h2>
        
        <div className="flex flex-col space-y-4">
          <button 
            className="cursor-pointer bg-blue-500 text-white py-3 px-6 rounded-full font-medium hover:bg-blue-600 transition"
            onClick={() => setGameMode('1P')}
          >
            1 PLAYER (VS AI)
          </button>
          
          <button 
            className="cursor-pointer bg-yellow-500 text-white py-3 px-6 rounded-full font-medium hover:bg-yellow-600 transition"
            onClick={() => setGameMode('2P')}
          >
            2 PLAYERS
          </button>
          
          <button 
            className="cursor-pointer bg-purple-500 text-white py-3 px-6 rounded-full font-medium hover:bg-purple-600 transition"
            onClick={() => setGameMode('AI')}
          >
            AI VS AI
          </button>
        </div>
        
        <div className="mt-6">
          <p className="text-gray-600 text-sm">
            <span className="font-bold">About the AI:</span> The computer opponent uses the minimax algorithm 
            with alpha-beta pruning, searching up to 7 moves ahead and recognizing strategic patterns. 
            Can you outsmart it?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Menu;