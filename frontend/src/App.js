import React, { useState } from "react";
import "./App.css";
import Deck from "./Deck";
import Hand from "./Hand";

function App() {
  const [message, setMessage] = useState("");
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);

  const startGame = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/start");
      const data = await response.json();
      setPlayerHand(data.player_hand);
      setDealerHand(data.dealer_hand);
      setMessage("Game started");
    } catch (error) {
      console.error("Error starting game: ", error);
      setMessage("Error starting game");
    }
  };

  const hit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/hit");
      const data = await response.json();
      setPlayerHand(data.player_hand);
      if (data.message) {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error during hit:", error);
      setMessage("Error during hit.");
    }
  };

  const stand = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/stand");
      const data = await response.json();
      setDealerHand(data.dealer_hand);
      if (data.result) {
        setMessage(data.result);
      }
    } catch (error) {
      console.error("Error during stand:", error);
      setMessage("Error during stand.");
    }
  };

  return (
    <div className="app-container">
      <Deck />
      <h1 className="title">Blackjack Game</h1>
      <div className="button-container">
        <button onClick={startGame}>Start Game</button>
        <button onClick={hit}>Hit</button>
        <button onClick={stand}>Stand</button>
      </div>
      <p className="message">{message}</p>
      <div className="hand-container">
        <div className="player-hand">
          <h2>Player's Hand</h2>
          <Hand cards={playerHand} />
        </div>
        <div className="dealer-hand">
          <h2>Dealer's Hand</h2>
          <Hand cards={dealerHand} />
        </div>
      </div>
    </div>
  );
}

export default App;
