import { motion } from "framer-motion";
import React from "react";

const Card = ({ card, delay }) => {
  // Map rank and suit to image file names (assuming you're storing local images)
  const getCardImage = (rank, suit) => {
    const suitShort = suit.toLowerCase().charAt(0); // "hearts" → "h"
    const rankShort = rank === "10" ? "10" : rank.charAt(0).toUpperCase(); // "Ace" → "A"
    return `/cards/${rankShort}${suitShort}.png`; // Example: "/cards/3d.png" for 3 of Diamonds
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      style={{
        display: "inline-block",
        margin: "5px",
        position: "relative",
        width: "80px",
        height: "120px"
      }}
    >
      <img 
        src={getCardImage(card.rank, card.suit)} 
        alt={`${card.rank} of ${card.suit}`} 
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.2)"
        }}
      />
    </motion.div>
  );
};

export default Card;
