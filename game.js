class Paddle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.score = 0;
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction, canvasHeight) {
        this.y += this.speed * direction;
        // Keep paddle within canvas bounds
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvasHeight) this.y = canvasHeight - this.height;
    }
}

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 5;
        this.dx = this.speed;
        this.dy = this.speed;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    reset(canvasWidth, canvasHeight) {
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.dx = this.speed * (Math.random() > 0.5 ? 1 : -1);
        this.dy = this.speed * (Math.random() > 0.5 ? 1 : -1);
    }
}

// Game setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Create game objects
const paddleWidth = 10;
const paddleHeight = 60;
const ball = new Ball(canvas.width / 2, canvas.height / 2, 5);
const leftPaddle = new Paddle(10, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight);
const rightPaddle = new Paddle(canvas.width - paddleWidth - 10, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight);

// Key state tracking
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

// Event listeners for keyboard input
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

function handlePaddleMovement() {
    // Left paddle movement (W and S keys)
    if (keys.w) leftPaddle.move(-1, canvas.height);
    if (keys.s) leftPaddle.move(1, canvas.height);

    // Right paddle movement (Arrow keys)
    if (keys.ArrowUp) rightPaddle.move(-1, canvas.height);
    if (keys.ArrowDown) rightPaddle.move(1, canvas.height);
}

function checkCollision(ball, paddle) {
    return ball.x - ball.radius < paddle.x + paddle.width &&
           ball.x + ball.radius > paddle.x &&
           ball.y - ball.radius < paddle.y + paddle.height &&
           ball.y + ball.radius > paddle.y;
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '32px Arial';
    ctx.fillText(leftPaddle.score, canvas.width / 4, 50);
    ctx.fillText(rightPaddle.score, 3 * canvas.width / 4, 50);
}

function drawCenterLine() {
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.setLineDash([]);
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Handle paddle movement
    handlePaddleMovement();

    // Move ball
    ball.move();

    // Ball collision with top and bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if (checkCollision(ball, leftPaddle) || checkCollision(ball, rightPaddle)) {
        ball.dx = -ball.dx;
        // Increase speed slightly on paddle hits
        ball.dx *= 1.05;
        ball.dy *= 1.05;
    }

    // Scoring
    if (ball.x - ball.radius <= 0) {
        rightPaddle.score++;
        ball.reset(canvas.width, canvas.height);
    } else if (ball.x + ball.radius >= canvas.width) {
        leftPaddle.score++;
        ball.reset(canvas.width, canvas.height);
    }

    // Draw everything
    drawCenterLine();
    drawScore();
    leftPaddle.draw(ctx);
    rightPaddle.draw(ctx);
    ball.draw(ctx);

    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();