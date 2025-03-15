import React, { useState, useEffect } from "react";
import "./App.css";
import Hand from "./Hand";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
console.log('Backend URL:', BACKEND_URL);

// My main game component
function App() {
  // Setting up game states
  const [message, setMessage] = useState("");
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameState, setGameState] = useState("idle");
  const [isBlackjack, setIsBlackjack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Timer for blackjack celebration
  useEffect(() => {
    let timer;
    if (isBlackjack) {
      timer = setTimeout(() => {
        setIsBlackjack(false);
      }, 2500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isBlackjack]);

  // Start a new game
  const startGame = async () => {
    try {
      setIsLoading(true);
      setGameState("playing");
      setIsBlackjack(false);
      setMessage("");
      console.log('Making start game request to:', `${BACKEND_URL}/start`);
      const response = await fetch(`${BACKEND_URL}/start`);
      console.log('Start game response:', response.status);
      const data = await response.json();
      console.log('Start game data:', data);
      setPlayerHand(data.player_hand);
      setDealerHand(data.dealer_hand);
      
      if (data.message) {
        setMessage(data.message);
        if (data.message.toLowerCase().includes("blackjack")) {
          setIsBlackjack(true);
          setGameState("ended");
          if (data.message.includes("You win")) {
            showCelebration();
          }
        }
      }
    } catch (error) {
      console.error("Error starting game: ", error);
      setMessage(`Error starting game: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Player hits for another card
  const hit = async () => {
    if (gameState !== "playing" || isLoading) return;
    
    setIsLoading(true);
    try {
      console.log('Making hit request to:', `${BACKEND_URL}/hit`);
      const response = await fetch(`${BACKEND_URL}/hit`);
      console.log('Hit response:', response.status);
      const data = await response.json();
      console.log('Hit data:', data);
      setPlayerHand(data.player_hand);
      if (data.dealer_hand) {
        setDealerHand(data.dealer_hand);
        setGameState("ended");
        if (data.message.includes("win")) {
          showCelebration();
        }
      }
      if (data.message && (data.message.includes("Bust") || data.message.includes("21"))) {
        setGameState("ended");
      }
      setMessage(data.message);
    } catch (error) {
      console.error("Error during hit:", error);
      setMessage(`Error connecting to server: ${error.message}`);
    }
    setIsLoading(false);
  };

  // Player stands with current hand
  const stand = async () => {
    if (gameState !== "playing" || isLoading) return;
    
    try {
      setIsLoading(true);
      console.log('Making stand request to:', `${BACKEND_URL}/stand`);
      const response = await fetch(`${BACKEND_URL}/stand`);
      console.log('Stand response:', response.status);
      const data = await response.json();
      console.log('Stand data:', data);
      setDealerHand(data.dealer_hand);
      if (data.result) {
        setMessage(data.result);
        setGameState("ended");
        if (data.result.includes("You win")) {
          showCelebration();
        }
      }
    } catch (error) {
      console.error("Error during stand:", error);
      setMessage(`Error during stand: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // cool confetti celebration
  const showCelebration = () => {
    const colors = ['#FFE66D', '#4ECDC4', '#FF6B6B', '#45B7D1'];
    for (let i = 0; i < 100; i++) {
      createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }
  };

  // Creates a single confetti piece
  const createConfetti = (color) => {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.zIndex = '1000';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.borderRadius = '50%';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    document.body.appendChild(confetti);

    const animation = confetti.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${Math.random() * 300 - 150}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
      duration: 2000 + Math.random() * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => confetti.remove();
  };

  return (
    <div className="app-container" style={{
      height: "100vh",
      width: "100vw",
      background: "linear-gradient(135deg, #1A535C 0%, #4ECDC4 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 0,
      padding: 0,
      overflow: "hidden"
    }}>
      <div style={{
        width: "100%",
        padding: "0.5rem",
        backgroundColor: "rgba(26, 83, 92, 0.95)",
        backdropFilter: "blur(5px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      }}>
        <h1 style={{
          fontSize: "min(6vw, 2rem)",
          color: "#FFE66D",
          textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          margin: 0,
          textAlign: "center"
        }}>
          Blackjack
        </h1>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "0.5rem",
          width: "100%"
        }}>
          <motion.button
            whileHover={{ scale: gameState !== "playing" ? 1.05 : 1 }}
            whileTap={{ scale: gameState !== "playing" ? 0.95 : 1 }}
            onClick={startGame}
            disabled={gameState === "playing" || isLoading}
            style={{
              padding: "0.5rem",
              fontSize: "min(4vw, 1rem)",
              backgroundColor: gameState === "playing" ? "#666" : "#FF6B6B",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: gameState === "playing" || isLoading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
              opacity: isLoading ? 0.7 : 1,
              flex: 1,
              maxWidth: "33%"
            }}
          >
            {gameState === "playing" ? "..." : "New"}
          </motion.button>
          <motion.button
            whileHover={{ scale: gameState === "playing" ? 1.05 : 1 }}
            whileTap={{ scale: gameState === "playing" ? 0.95 : 1 }}
            onClick={hit}
            disabled={gameState !== "playing" || isLoading}
            style={{
              padding: "0.5rem",
              fontSize: "min(4vw, 1rem)",
              backgroundColor: gameState === "playing" ? "#4ECDC4" : "#666",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: gameState === "playing" && !isLoading ? "pointer" : "not-allowed",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
              opacity: isLoading ? 0.7 : 1,
              flex: 1,
              maxWidth: "33%"
            }}
          >
            Hit
          </motion.button>
          <motion.button
            whileHover={{ scale: gameState === "playing" ? 1.05 : 1 }}
            whileTap={{ scale: gameState === "playing" ? 0.95 : 1 }}
            onClick={stand}
            disabled={gameState !== "playing" || isLoading}
            style={{
              padding: "0.5rem",
              fontSize: "min(4vw, 1rem)",
              backgroundColor: gameState === "playing" ? "#45B7D1" : "#666",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: gameState === "playing" && !isLoading ? "pointer" : "not-allowed",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
              opacity: isLoading ? 0.7 : 1,
              flex: 1,
              maxWidth: "33%"
            }}
          >
            Stand
          </motion.button>
        </div>
      </div>

      <div style={{
        flex: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "0.5rem"
      }}>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "0.5rem",
              backgroundColor: "rgba(255,255,255,0.9)",
              borderRadius: "8px",
              marginBottom: "0.5rem",
              fontSize: "min(4vw, 1rem)",
              color: "#1A535C",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              width: "100%",
              textAlign: "center"
            }}>
            {message}
          </motion.div>
        )}

        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          overflow: "hidden"
        }}>
          <div style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "0.5rem",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column"
          }}>
            <h2 style={{
              color: "#FFE66D",
              textAlign: "center",
              margin: "0 0 0.5rem 0",
              fontSize: "min(4vw, 1rem)"
            }}>
              Player's Hand
            </h2>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <Hand cards={playerHand} />
            </div>
          </div>

          <div style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "16px",
            padding: "0.5rem",
            backdropFilter: "blur(10px)",
            display: "flex",
            flexDirection: "column"
          }}>
            <h2 style={{
              color: "#FFE66D",
              textAlign: "center",
              margin: "0 0 0.5rem 0",
              fontSize: "min(4vw, 1rem)"
            }}>
              Dealer's Hand
            </h2>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <Hand cards={dealerHand} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
