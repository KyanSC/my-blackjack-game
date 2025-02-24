import React from "react";
import Card from "./Card";

const Hand = ({ cards }) => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "-30px",  // Cards will overlap slightly like real card hands
      position: "relative",
      marginTop: "20px"
    }}>
      {cards.map((card, index) => (
        <Card key={index} card={card} delay={index * 0.3} />
      ))}
    </div>
  );
};

export default Hand;
