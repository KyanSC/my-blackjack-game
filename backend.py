# Kyan Santiago-Calling
# My Blackjack Game Backend
# 2025-02-06

from fastapi import FastAPI
import random

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

# Setting up CORS for frontend URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # For testing on my computer
        "https://blackjack-frontend-nf1ad9xdt-kyans-projects-4396b957.vercel.app",  
        "https://blackjack-kyan.vercel.app",
        "https://blackjack-game-kyan.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setting up the deck
suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
deck = [{"suit": suit, "rank": rank} for suit in suits for rank in ranks]

# Game variables
player_hand = []
dealer_hand = []
game_over = False

def draw_card():
    # Takes a random card from the deck
    return deck.pop(random.randint(0, len(deck) - 1))

def hand_value(hand):
    # Figures out the value of a hand
    value = 0
    aces = 0
    for card in hand:
        if card["rank"] in ['J', 'Q', 'K']:
            value += 10
        elif card["rank"] == 'A':
            value += 11
            aces += 1
        else:
            value += int(card["rank"])
    # Handle aces being 1 or 11
    while value > 21 and aces:
        value -= 10
        aces -= 1
    return value

def check_blackjack(hand):
    # Checks if it's a blackjack (21 with 2 cards)
    return len(hand) == 2 and hand_value(hand) == 21

@app.get("/start")
def start_game():
    # Starts a new game
    global player_hand, dealer_hand, deck, game_over
    deck = [{"suit": suit, "rank": rank} for suit in suits for rank in ranks]
    random.shuffle(deck)
    player_hand = [draw_card(), draw_card()]
    dealer_hand = [draw_card(), draw_card()]
    game_over = False

    # Check if anyone got blackjack
    player_blackjack = check_blackjack(player_hand)
    dealer_blackjack = check_blackjack(dealer_hand)

    if player_blackjack or dealer_blackjack:
        game_over = True
        response = {
            "player_hand": player_hand,
            "dealer_hand": dealer_hand,
        }
        if player_blackjack and dealer_blackjack:
            response["message"] = "Both have Blackjack! Push!"
        elif player_blackjack:
            response["message"] = "🎉 BLACKJACK! You win! 🎉"
        else:
            response["message"] = "Dealer has Blackjack! You lose!"
        return response

    return {
        "player_hand": player_hand,
        "dealer_hand": [
            dealer_hand[0],
            {"suit": "Hidden", "rank": "Hidden"}
        ]
    }

@app.get("/hit")
def hit():
    # Player takes another card
    global game_over
    if game_over:
        return {
            "player_hand": player_hand,
            "dealer_hand": dealer_hand,
            "message": "Game is over! Please start a new game."
        }
    
    player_hand.append(draw_card())
    value = hand_value(player_hand)

    if value > 21:
        game_over = True
        return {
            "player_hand": player_hand,
            "dealer_hand": dealer_hand,
            "message": "Bust! You lose!"
        }
    elif value == 21:
        game_over = True
        # Dealer plays out their hand
        while hand_value(dealer_hand) < 17:
            dealer_hand.append(draw_card())
        
        dealer_value = hand_value(dealer_hand)
        if dealer_value > 21:
            result = "You win! Dealer busts!"
        elif dealer_value == 21:
            result = "Push! Both got 21!"
        else:
            result = "You win with 21!"
            
        return {
            "player_hand": player_hand,
            "dealer_hand": dealer_hand,
            "message": result
        }
    
    return {"player_hand": player_hand, "message": f"Your hand is worth {value}"}

@app.get("/stand")
def stand():
    # Player stays with current hand
    global game_over
    if game_over:
        return {
            "player_hand": player_hand,
            "dealer_hand": dealer_hand,
            "result": "Game is over! Please start a new game."
        }

    while hand_value(dealer_hand) < 17:
        dealer_hand.append(draw_card())

    player_score = hand_value(player_hand)
    dealer_score = hand_value(dealer_hand)

    game_over = True

    if dealer_score > 21:
        result = "Dealer busts! You win! 🎉"
    elif player_score > dealer_score:
        result = "You win! 🎉"
    elif dealer_score == player_score:
        result = "Push! It's a tie!"
    else:
        result = "Dealer wins!"

    return {
        "player_hand": player_hand,
        "dealer_hand": dealer_hand,
        "result": result
    }

@app.get("/")
def read_root():
    # Welcome message
    return {"message": "Welcome to my Blackjack game!"}

