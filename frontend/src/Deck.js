import { motion } from "framer-motion";
import React from "react";

const Deck = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 0.6 }}
      style={{
        position: "absolute",
        top: "50px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <img 
        src="/cards/back.png" 
        alt="Deck" 
        style={{
          width: "200px",
          height: "240px",
          borderRadius: "8px",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.5)"
        }}
      />
    </motion.div>
  );
};

export default Deck;
