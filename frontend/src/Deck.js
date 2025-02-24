import { motion } from "framer-motion";
import React from "react";

const Deck = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 0.6 }}
      style={{
        width: "80px",
        height: "120px",
        backgroundColor: "#222",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "18px",
        fontWeight: "bold",
        position: "absolute",
        top: "50px",
        left: "50%",
        transform: "translateX(-50%)"
      }}
    >
      Deck
    </motion.div>
  );
};

export default Deck;