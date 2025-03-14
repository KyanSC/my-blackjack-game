import React from "react";
import Card from "./Card";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Hand component that displays a collection of cards in a poker-style layout
 * @param {Object} props - Component props
 * @param {Array} props.cards - Array of card objects to display
 */
function Hand({ cards }) {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      justifyContent: "center",
      padding: "1rem",
      minHeight: "200px"
    }}>
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={`${card.rank}-${card.suit}-${index}`}
            initial={{ opacity: 0, x: -100, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              delay: index * 0.3,
              duration: 0.5,
              type: "spring",
              stiffness: 120,
              damping: 12
            }}
            style={{
              transform: `rotate(${(index - (cards.length - 1) / 2) * 5}deg)`,
              transformOrigin: "bottom center",
              transition: "transform 0.3s ease",
              marginLeft: index > 0 ? "-2rem" : "0",
              zIndex: index
            }}
          >
            <Card rank={card.rank} suit={card.suit} hidden={card.hidden} />
          </motion.div>
        ))}
      </AnimatePresence>
      {cards.length === 0 && (
        <div style={{
          width: "100%",
          height: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: "1.2rem",
          fontStyle: "italic"
        }}>
          No cards
        </div>
      )}
    </div>
  );
}

export default Hand;
