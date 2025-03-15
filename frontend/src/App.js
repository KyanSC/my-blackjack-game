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
      minHeight: "100vh",
      width: "100%",
      maxWidth: "100%",
      background: "linear-gradient(135deg, #1A535C 0%, #4ECDC4 100%)",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      margin: 0
    }}>
      <AnimatePresence>
        {isBlackjack && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.5, type: "spring" }}
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "clamp(2rem, 10vw, 5rem)",
              color: "#FFE66D",
              textShadow: "0 0 20px rgba(255,230,109,0.8)",
              zIndex: 1000,
              pointerEvents: "none",
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(5px)",
              textAlign: "center",
              padding: "1rem"
            }}
          >
            BLACKJACK! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      <h1 style={{
        fontSize: "clamp(2rem, 8vw, 3rem)",
        color: "#FFE66D",
        textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
        marginBottom: "1rem",
        textAlign: "center"
      }}>
        Blackjack
      </h1>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "1rem",
        justifyContent: "center",
        width: "100%",
        maxWidth: "100%",
        padding: "0 0.5rem",
        overflow: "visible"
      }}>
        <motion.button
          whileHover={{ scale: gameState !== "playing" ? 1.05 : 1 }}
          whileTap={{ scale: gameState !== "playing" ? 0.95 : 1 }}
          onClick={startGame}
          disabled={gameState === "playing" || isLoading}
          style={{
            padding: "0.8rem 1rem",
            fontSize: "clamp(0.9rem, 3.5vw, 1.2rem)",
            backgroundColor: gameState === "playing" ? "#666" : "#FF6B6B",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: gameState === "playing" || isLoading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
            opacity: isLoading ? 0.7 : 1,
            flex: "1",
            minWidth: "100px",
            maxWidth: "180px",
            whiteSpace: "nowrap"
          }}
        >
          {gameState === "playing" ? "In Progress" : "Start Game"}
        </motion.button>
        <motion.button
          whileHover={{ scale: gameState === "playing" ? 1.05 : 1 }}
          whileTap={{ scale: gameState === "playing" ? 0.95 : 1 }}
          onClick={hit}
          disabled={gameState !== "playing" || isLoading}
          style={{
            padding: "0.8rem 1rem",
            fontSize: "clamp(0.9rem, 3.5vw, 1.2rem)",
            backgroundColor: gameState === "playing" ? "#4ECDC4" : "#666",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: gameState === "playing" && !isLoading ? "pointer" : "not-allowed",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
            opacity: isLoading ? 0.7 : 1,
            flex: "1",
            minWidth: "100px",
            maxWidth: "180px"
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
            padding: "0.8rem 1rem",
            fontSize: "clamp(0.9rem, 3.5vw, 1.2rem)",
            backgroundColor: gameState === "playing" ? "#45B7D1" : "#666",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: gameState === "playing" && !isLoading ? "pointer" : "not-allowed",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
            opacity: isLoading ? 0.7 : 1,
            flex: "1",
            minWidth: "100px",
            maxWidth: "180px"
          }}
        >
          Stand
        </motion.button>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: "1rem",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "clamp(1rem, 4vw, 1.2rem)",
            color: "#1A535C",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            width: "90%",
            maxWidth: "600px",
            textAlign: "center"
          }}>
          {message}
        </motion.div>
      )}

      <div style={{
        width: "100%",
        maxWidth: "100%",
        display: "flex",
        flexDirection: window.innerWidth <= 768 ? "column" : "row",
        justifyContent: "space-around",
        alignItems: "center",
        gap: "1rem",
        padding: "0",
        overflow: "hidden"
      }}>
        <div style={{
          flex: 1,
          width: "100%",
          maxWidth: "100%",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "1rem",
          backdropFilter: "blur(10px)",
          overflow: "hidden"
        }}>
          <h2 style={{
            color: "#FFE66D",
            textAlign: "center",
            marginBottom: "1rem",
            fontSize: "clamp(1.2rem, 5vw, 1.5rem)"
          }}>
            Player's Hand
          </h2>
          <Hand cards={playerHand} />
        </div>

        <div style={{
          flex: 1,
          width: "100%",
          maxWidth: "100%",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "1rem",
          backdropFilter: "blur(10px)",
          overflow: "hidden"
        }}>
          <h2 style={{
            color: "#FFE66D",
            textAlign: "center",
            marginBottom: "1rem",
            fontSize: "clamp(1.2rem, 5vw, 1.5rem)"
          }}>
            Dealer's Hand
          </h2>
          <Hand cards={dealerHand} />
        </div>
      </div>
    </div>
  );
}

export default App;
