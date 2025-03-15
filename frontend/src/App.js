import React, { useState, useEffect } from "react";
import "./App.css";
import Hand from "./Hand";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Main App component that manages the Blackjack game state and user interactions
 * Handles game logic through API calls to the backend server
 */
function App() {
  // Game state management
  const [message, setMessage] = useState("");
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameState, setGameState] = useState("idle"); // idle, playing, ended
  const [isBlackjack, setIsBlackjack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Add effect to handle blackjack timer
  useEffect(() => {
    let timer;
    if (isBlackjack) {
      timer = setTimeout(() => {
        setIsBlackjack(false);
      }, 2500); // Show celebration for 2.5 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isBlackjack]);

  /**
   * Initializes a new game by dealing initial cards to player and dealer
   */
  const startGame = async () => {
    try {
      setIsLoading(true);
      setGameState("playing");
      setIsBlackjack(false);
      setMessage("");
      const response = await fetch("https://my-blackjack-game-production.up.railway.app/start");
      const data = await response.json();
      setPlayerHand(data.player_hand);
      setDealerHand(data.dealer_hand);
      
      if (data.message) {
        setMessage(data.message);
        if (data.message.toLowerCase().includes("blackjack")) {
          setIsBlackjack(true);
          setGameState("ended");
          // Show confetti animation for player blackjack
          if (data.message.includes("You win")) {
            showCelebration();
          }
        }
      }
    } catch (error) {
      console.error("Error starting game: ", error);
      setMessage("Error starting game");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Player draws another card from the deck
   * Game ends if player busts (over 21)
   */
  const hit = async () => {
    if (gameState !== "playing" || isLoading) return;
    
    setIsLoading(true);
    try {
        const response = await fetch('https://my-blackjack-game-production.up.railway.app/hit');
        const data = await response.json();
        setPlayerHand(data.player_hand);
        if (data.dealer_hand) {  // If dealer's hand is returned (game over)
            setDealerHand(data.dealer_hand);
            setGameState("ended");
            if (data.message.includes("win")) {
                showCelebration();
            }
        }
        // Also set game state to ended if player busts or gets 21
        if (data.message && (data.message.includes("Bust") || data.message.includes("21"))) {
            setGameState("ended");
        }
        setMessage(data.message);
    } catch (error) {
        setMessage("Error connecting to server");
    }
    setIsLoading(false);
  };

  /**
   * Player stands, dealer draws until 17 or higher
   * Determines winner and ends the game
   */
  const stand = async () => {
    if (gameState !== "playing" || isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await fetch("https://my-blackjack-game-production.up.railway.app/stand");
      const data = await response.json();
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
      setMessage("Error during stand.");
    } finally {
      setIsLoading(false);
    }
  };

  const showCelebration = () => {
    // Create confetti effect
    const colors = ['#FFE66D', '#4ECDC4', '#FF6B6B', '#45B7D1'];
    for (let i = 0; i < 100; i++) {
      createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }
  };

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
      background: "linear-gradient(135deg, #1A535C 0%, #4ECDC4 100%)",
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      overflow: "hidden"
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
              fontSize: "5rem",
              color: "#FFE66D",
              textShadow: "0 0 20px rgba(255,230,109,0.8)",
              zIndex: 1000,
              pointerEvents: "none",
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(5px)"
            }}
          >
            BLACKJACK! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      <h1 style={{
        fontSize: "3rem",
        color: "#FFE66D",
        textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
        marginBottom: "2rem"
      }}>
        Blackjack
      </h1>

      <div style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <motion.button
          whileHover={{ scale: gameState !== "playing" ? 1.05 : 1 }}
          whileTap={{ scale: gameState !== "playing" ? 0.95 : 1 }}
          onClick={startGame}
          disabled={gameState === "playing" || isLoading}
          style={{
            padding: "0.8rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: gameState === "playing" ? "#666" : "#FF6B6B",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: gameState === "playing" || isLoading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {gameState === "playing" ? "Game in Progress" : "Start Game"}
        </motion.button>
        <motion.button
          whileHover={{ scale: gameState === "playing" ? 1.05 : 1 }}
          whileTap={{ scale: gameState === "playing" ? 0.95 : 1 }}
          onClick={hit}
          disabled={gameState !== "playing" || isLoading}
          style={{
            padding: "0.8rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: gameState === "playing" ? "#4ECDC4" : "#666",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: gameState === "playing" && !isLoading ? "pointer" : "not-allowed",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
            opacity: isLoading ? 0.7 : 1
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
            padding: "0.8rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: gameState === "playing" ? "#45B7D1" : "#666",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: gameState === "playing" && !isLoading ? "pointer" : "not-allowed",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
            opacity: isLoading ? 0.7 : 1
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
            padding: "1rem 2rem",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "8px",
            marginBottom: "2rem",
            fontSize: "1.2rem",
            color: "#1A535C",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
          {message}
        </motion.div>
      )}

      <div style={{
        width: "100%",
        maxWidth: "1200px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
        gap: "2rem"
      }}>
        <div style={{
          flex: 1,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "2rem",
          backdropFilter: "blur(10px)"
        }}>
          <h2 style={{
            color: "#FFE66D",
            textAlign: "center",
            marginBottom: "1rem"
          }}>
            Player's Hand
          </h2>
          <Hand cards={playerHand} />
        </div>

        <div style={{
          flex: 1,
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "2rem",
          backdropFilter: "blur(10px)"
        }}>
          <h2 style={{
            color: "#FFE66D",
            textAlign: "center",
            marginBottom: "1rem"
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
