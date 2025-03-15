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

  // Get card dimensions based on screen size
  const getCardDimensions = () => {
    if (window.innerWidth <= 480) {
      return { width: "80px", height: "120px", fontSize: "16px", centerSize: "40px" };
    }
    if (window.innerWidth <= 768) {
      return { width: "100px", height: "150px", fontSize: "20px", centerSize: "50px" };
    }
    return { width: "120px", height: "180px", fontSize: "24px", centerSize: "60px" };
  };

  const { symbol, color } = getSuitSymbol(suit);
  const displayRank = getDisplayRank(rank);
  const isHidden = hidden || suit === "Hidden";
  const dimensions = getCardDimensions();

  return (
    <div
      style={{
        display: "inline-block",
        margin: "2px",
        position: "relative",
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: isHidden ? "#44BBA4" : "#FFFFFF",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        border: "1px solid rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}
    >
      {!isHidden ? (
        <div style={{
          width: "100%",
          height: "100%",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          {/* Top rank and suit */}
          <div style={{ color: color, fontSize: dimensions.fontSize, fontWeight: "bold" }}>
            {displayRank}
            <span style={{ marginLeft: "2px" }}>{symbol}</span>
          </div>

          {/* Center suit */}
          <div style={{ 
            color: color,
            fontSize: dimensions.centerSize,
            textAlign: "center",
            transform: "translateY(-5px)"
          }}>
            {symbol}
          </div>

          {/* Bottom rank and suit (inverted) */}
          <div style={{ 
            color: color,
            fontSize: dimensions.fontSize,
            fontWeight: "bold",
            alignSelf: "flex-end",
            transform: "rotate(180deg)"
          }}>
            {displayRank}
            <span style={{ marginLeft: "2px" }}>{symbol}</span>
          </div>
        </div>
      ) : (
        <div style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: dimensions.centerSize,
          color: "#FFFFFF"
        }}>
          ★
        </div>
      )}
    </div>
  );
};

export default Card;
