// Game variables
var canvas;
var context;
var player;
var coins;
var score;
var playerImage;
var coinImage;
var doorImage;
var level;
var doorVisible;

// Initialize the game
function init() {
    canvas = document.getElementById('game-canvas');
    context = canvas.getContext('2d');

    // Load images
    playerImage = new Image();
    playerImage.src = './public/newgroot.png';

    coinImage = new Image();
    coinImage.src = './public/coin8b.png';

    doorImage = new Image();
    doorImage.src = './public/door8b.png';

    // Set initial game state
    player = {
        x: 50,
        y: canvas.height - 220,
        width: 100,
        height: 200,
        speed: 5,
        isJumping: false,
        jumpCount: 0,
        jumpHeight: 100
    };

    coins = [];
    score = 0;
    level = 1;
    doorVisible = false;

    // Start the game loop
    setInterval(update, 20);
}

// Game loop
function update() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    drawPlayer();

    // Draw the coins
    drawCoins();

    // Draw the door
    drawDoor();

    // Check for collision with coins
    checkCollision();

    // Check if player reached the door
    checkDoorCollision();

    // Handle player jump
    handleJump();

    // Update the score
    document.getElementById('score').textContent = 'Score: ' + score;
}

// Draw the player
function drawPlayer() {
    context.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Draw the coins
function drawCoins() {
    coins.forEach(function (coin) {
        context.drawImage(coinImage, coin.x, coin.y, 40, 40);
    });
}

// Draw the door
function drawDoor() {
    if (doorVisible) {
        context.drawImage(doorImage, canvas.width - 80, canvas.height - 120, 60, 90);
    }
}

// Generate a new coin
function generateCoin() {
    var coin = {
        x: Math.random() * (canvas.width - 20),
        y: Math.random() * (canvas.height - 20)
    };
    coins.push(coin);
}

// Check collision between player and coins
function checkCollision() {
    coins.forEach(function (coin, index) {
        if (
            player.x < coin.x + 20 &&
            player.x + player.width > coin.x &&
            player.y < coin.y + 20 &&
            player.y + player.height > coin.y
        ) {
            coins.splice(index, 1); // Remove the collected coin
            score += 10; // Increase the score

            if (score % 10 === 0) {
                generateCoin(); // Generate a new coin
            }
        }
    });
}

// Check collision between player and door
function checkDoorCollision() {
    if (
        player.x < canvas.width - 80 + 60 &&
        player.x + player.width > canvas.width - 80 &&
        player.y < canvas.height - 120 + 90 &&
        player.y + player.height > canvas.height - 120 &&
        doorVisible
    ) {
        // Player reached the door
        if (doorVisible) {
            // Increase the level
            level++;

            // Reset the score and door visibility
            score = 0;
            doorVisible = true;

            // Clear the coins array
            coins = [];

            // Generate initial coins for the new level
            generateInitialCoins();
        }
    }
}

// Handle player jump
function handleJump() {
    if (player.isJumping) {
        player.y -= player.speed;
        player.jumpCount += player.speed;

        if (player.jumpCount >= player.jumpHeight) {
            player.isJumping = false;
        }
    } else {
        if (player.y < canvas.height - player.height) {
            player.y += player.speed;
        }
    }
}

// Generate initial coins
function generateInitialCoins() {
    for (var i = 0; i < 5; i++) {
        generateCoin();
    }
}

// Handle keydown events
function handleKeyDown(event) {
    if (event.keyCode === 32) {
        // Spacebar
        if (!player.isJumping) {
            player.isJumping = true;
            player.jumpCount = 0;
        }
    } else if (event.keyCode === 37) {
        // Left arrow key
        player.x -= player.speed;
    } else if (event.keyCode === 39) {
        // Right arrow key
        player.x += player.speed;
    }
}

// Attach event listener for keydown events
document.addEventListener('keydown', handleKeyDown);

// Start the game
init();
generateInitialCoins();