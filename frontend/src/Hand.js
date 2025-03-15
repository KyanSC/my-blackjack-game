import React from "react";
import Card from "./Card";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Hand component that displays a collection of cards in a poker-style layout
 * @param {Object} props - Component props
 * @param {Array} props.cards - Array of card objects to display
 * @param {boolean} props.isDealer - Indicates if the hand belongs to the dealer
 * @param {boolean} props.hideFirstCard - Indicates if the first card should be hidden
 */
function Hand({ cards = [], isDealer = false, hideFirstCard = false }) {
  // Calculate dimensions based on viewport
  const getCardDimensions = () => {
    const vw = Math.min(document.documentElement.clientWidth, window.innerWidth);
    const vh = Math.min(document.documentElement.clientHeight, window.innerHeight);
    const isPortrait = vh > vw;
    
    // Base card size on viewport width for portrait, height for landscape
    const baseSize = isPortrait ? vw * 0.2 : vh * 0.25;
    return {
      width: baseSize,
      height: baseSize * 1.4, // Standard card ratio
    };
  };

  // Calculate overlap based on screen size and number of cards
  const getOverlap = () => {
    const vw = Math.min(document.documentElement.clientWidth, window.innerWidth);
    const baseOverlap = vw < 480 ? 0.6 : vw < 768 ? 0.7 : 0.8;
    return baseOverlap;
  };

  const { width, height } = getCardDimensions();
  const overlap = getOverlap();

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      minHeight: height,
      width: "100%",
      padding: "0.5rem",
    }}>
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={`${card.rank}-${card.suit}`}
            initial={{ scale: 0, x: -100, y: -100 }}
            animate={{ 
              scale: 1,
              x: index * (width * overlap - width),
              y: 0,
            }}
            exit={{ scale: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: index * 0.1,
            }}
            style={{
              position: "absolute",
              left: "50%",
              transformOrigin: "center",
            }}
          >
            <Card
              rank={card.rank}
              suit={card.suit}
              hidden={hideFirstCard && index === 0}
              width={width}
              height={height}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      {cards.length === 0 && (
        <div style={{ opacity: 0.5, fontSize: "min(4vw, 1rem)" }}>
          {isDealer ? "Dealer's hand" : "Your hand"}
        </div>
      )}
    </div>
  );
}

export default Hand;
