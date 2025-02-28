import React from 'react';

interface CellProps {
  rowIdx: number;
  colIdx: number;
  cell: string | null;
  handleColumnClick: (colIdx: number) => void;
  getAnimationStyle: (rowIdx: number, colIdx: number) => React.CSSProperties;
}

const Cell: React.FC<CellProps> = ({ rowIdx, colIdx, handleColumnClick, getAnimationStyle }) => {
  return (
    <div 
      key={`${rowIdx}-${colIdx}`} 
      className="w-12 h-12 p-1 relative sm:m-1"
      onClick={() => handleColumnClick(colIdx)}
    >
      <div 
        className="w-full h-full rounded-full absolute cursor-pointer"
        style={getAnimationStyle(rowIdx, colIdx)}
      />
    </div>
  );
};

export default Cell;