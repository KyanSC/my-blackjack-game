import React from "react";

/**
 * Card component that displays a playing card with animation
 * @param {Object} props - Component props
 * @param {string} props.rank - Card rank
 * @param {string} props.suit - Card suit
 * @param {boolean} props.hidden - Whether the card is hidden
 * @param {number} props.width - Card width
 * @param {number} props.height - Card height
 */
const Card = ({ rank, suit, hidden = false, width = 100, height = 140 }) => {
  // Get suit symbol and color
  const getSuitSymbol = (suit) => {
    const symbols = {
      'hearts': { symbol: '♥', color: '#ff0000' },
      'diamonds': { symbol: '♦', color: '#ff0000' },
      'clubs': { symbol: '♣', color: '#000000' },
      'spades': { symbol: '♠', color: '#000000' }
    };
    return symbols[suit] || { symbol: '?', color: '#000000' };
  };

  // Format rank for display
  const getDisplayRank = (rank) => {
    const specialRanks = {
      '1': 'A',
      '11': 'J',
      '12': 'Q',
      '13': 'K'
    };
    return specialRanks[rank] || rank;
  };

  const { symbol, color } = getSuitSymbol(suit);
  const displayRank = getDisplayRank(rank);

  const fontSize = Math.min(width * 0.3, height * 0.2);

  if (hidden) {
    return (
      <div style={{
        width: `${width}px`,
        height: `${height}px`,
        background: 'linear-gradient(45deg, #1a237e, #3949ab)',
        borderRadius: `${Math.min(width, height) * 0.1}px`,
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: `${fontSize}px`,
        fontWeight: 'bold',
        border: '2px solid white',
      }}>
        ?
      </div>
    );
  }

  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      background: 'white',
      borderRadius: `${Math.min(width, height) * 0.1}px`,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      padding: `${Math.min(width, height) * 0.1}px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: color,
      fontSize: `${fontSize}px`,
      fontWeight: 'bold',
      border: '2px solid #ddd',
      position: 'relative',
      userSelect: 'none',
    }}>
      <div style={{ alignSelf: 'flex-start' }}>
        {displayRank}
        <div>{symbol}</div>
      </div>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: `${fontSize * 1.5}px`,
      }}>
        {symbol}
      </div>
      <div style={{
        alignSelf: 'flex-end',
        transform: 'rotate(180deg)',
      }}>
        {displayRank}
        <div>{symbol}</div>
      </div>
    </div>
  );
};

export default Card;
