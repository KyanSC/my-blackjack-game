# Kyan Santiago-Calling
# Blackjack backend server
# 2025-02-06

from fastapi import FastAPI
import random

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Ignore this

#Card Deck
suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
deck = [{"suit": suit, "rank": rank} for suit in suits for rank in ranks]

#Game State
player_hand = []
dealer_hand = []
game_over = False

def draw_card():
    return deck.pop(random.randint(0, len(deck) - 1))

def hand_value(hand):
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
    while value > 21 and aces:
        value -= 10
        aces -= 1
    return value

@app.get("/start")
def start_game():
    global player_hand, dealer_hand, deck, game_over
    deck = [{"suit": suit, "rank": rank} for suit in suits for rank in ranks]
    random.shuffle(deck)
    player_hand = [draw_card(), draw_card()]
    dealer_hand = [draw_card(), draw_card()]
    game_over = False
    return {
        "player_hand": player_hand, 
        "dealer_hand": [
            dealer_hand[0],
            {"suit": "Hidden", "rank": "Hidden"} #Hidden dealer card
        ]
    }

@app.get("/hit")
def hit(): 
    global game_over
    if game_over:
        return {"message": "Game over! Start a new game"}
    
    player_hand.append(draw_card())
    value = hand_value(player_hand)

    if value > 21:
        game_over = True
        return {"player_hand": player_hand, "dealer_hand": dealer_hand, "message": "Bust! You lose!"}
    
    return {"player_hand": player_hand, "message": "Nice hit!"}

@app.get("/stand")
def stand():
    global game_over
    while hand_value(dealer_hand) < 17:
        dealer_hand.append(draw_card())

    player_score = hand_value(player_hand)
    dealer_score = hand_value(dealer_hand)

    if dealer_score > 21 or player_score > dealer_score:
        result = "You win!"
    elif dealer_score == player_score:
        result = "Push!"
    else: 
        result = "Dealers wins!"

    game_over = True
    return {"player_hand": player_hand, "dealer_hand": dealer_hand, "result": result}


from fastapi import FastAPI

@app.get("/")
def read_root():
    return {"message": "Welcome to the Blackjack app!"}

