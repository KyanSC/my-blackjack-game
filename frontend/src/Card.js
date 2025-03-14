import React from "react";

/**
 * Card component that displays a playing card with animation
 * @param {Object} props - Component props
 * @param {string} props.rank - Card rank
 * @param {string} props.suit - Card suit
 * @param {boolean} props.hidden - Whether the card is hidden
 */
const Card = ({ rank, suit, hidden }) => {
  // Get suit symbol and color
  const getSuitSymbol = (suit) => {
    switch (suit) {
      case 'Hearts': return { symbol: '♥', color: '#E94F37' };
      case 'Diamonds': return { symbol: '♦', color: '#E94F37' };
      case 'Clubs': return { symbol: '♣', color: '#393E41' };
      case 'Spades': return { symbol: '♠', color: '#393E41' };
      default: return { symbol: '★', color: '#44BBA4' };
    }
  };

  // Format rank for display
  const getDisplayRank = (rank) => {
    switch (rank) {
      case 'A': return 'A';
      case 'K': return 'K';
      case 'Q': return 'Q';
      case 'J': return 'J';
      default: return rank;
    }
  };

  const { symbol, color } = getSuitSymbol(suit);
  const displayRank = getDisplayRank(rank);
  const isHidden = hidden || suit === "Hidden";

  return (
    <div
      style={{
        display: "inline-block",
        margin: "5px",
        position: "relative",
        width: "120px",
        height: "180px",
        backgroundColor: isHidden ? "#44BBA4" : "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        border: "1px solid rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}
    >
      {!isHidden ? (
        <div style={{
          width: "100%",
          height: "100%",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          {/* Top rank and suit */}
          <div style={{ color: color, fontSize: "24px", fontWeight: "bold" }}>
            {displayRank}
            <span style={{ marginLeft: "4px" }}>{symbol}</span>
          </div>

          {/* Center suit */}
          <div style={{ 
            color: color,
            fontSize: "60px",
            textAlign: "center",
            transform: "translateY(-10px)"
          }}>
            {symbol}
          </div>

          {/* Bottom rank and suit (inverted) */}
          <div style={{ 
            color: color,
            fontSize: "24px",
            fontWeight: "bold",
            alignSelf: "flex-end",
            transform: "rotate(180deg)"
          }}>
            {displayRank}
            <span style={{ marginLeft: "4px" }}>{symbol}</span>
          </div>
        </div>
      ) : (
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "60px",
          color: "#FFFFFF"
        }}>
          ★
        </div>
      )}
    </div>
  );
};

export default Card;
