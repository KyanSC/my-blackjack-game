import React from "react";
import Card from "./Card";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Hand component that displays a collection of cards in a poker-style layout
 * @param {Object} props - Component props
 * @param {Array} props.cards - Array of card objects to display
 */
function Hand({ cards }) {
  // Calculate overlap based on screen width
  const getOverlap = () => {
    if (window.innerWidth <= 480) return "-2.5rem";  // More overlap on phones
    if (window.innerWidth <= 768) return "-3rem";    // Tablet
    return "-2rem";                                  // Desktop
  };

  // Calculate rotation based on screen width
  const getRotation = (index) => {
    const baseRotation = (index - (cards.length - 1) / 2);
    if (window.innerWidth <= 480) return baseRotation * 3;  // Less rotation on phones
    if (window.innerWidth <= 768) return baseRotation * 4;  // Tablet
    return baseRotation * 5;                                // Desktop
  };

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "0.5rem",
      justifyContent: "center",
      padding: "0.5rem",
      minHeight: "150px",
      width: "100%",
      overflow: "visible"
    }}>
      <AnimatePresence>
        {cards.map((card, index) => (
          <motion.div
            key={`${card.rank}-${card.suit}-${index}`}
            initial={{ opacity: 0, x: -50, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              delay: index * 0.2,
              duration: 0.4,
              type: "spring",
              stiffness: 120,
              damping: 12
            }}
            style={{
              transform: `rotate(${getRotation(index)}deg)`,
              transformOrigin: "bottom center",
              transition: "transform 0.3s ease",
              marginLeft: index > 0 ? getOverlap() : "0",
              zIndex: index,
              scale: window.innerWidth <= 480 ? 0.8 : 1  // Slightly smaller cards on phones
            }}
          >
            <Card rank={card.rank} suit={card.suit} hidden={card.hidden} />
          </motion.div>
        ))}
      </AnimatePresence>
      {cards.length === 0 && (
        <div style={{
          width: "100%",
          height: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: "clamp(1rem, 4vw, 1.2rem)",
          fontStyle: "italic"
        }}>
          No cards
        </div>
      )}
    </div>
  );
}

export default Hand;
