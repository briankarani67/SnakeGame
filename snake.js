    const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        const scoreElement = document.getElementById("score");
        const speedSelect = document.getElementById("speedSelect");
        const overlay = document.getElementById("overlay");
        const startBtn = document.getElementById("startBtn");

        const gridSize = 20;
        let score, dx, dy, snake, food, gameActive, gameTimeout;

        // Reset all variables to starting values
        function init() {
            score = 0;
            dx = gridSize;
            dy = 0;
            // Place snake in middle
            snake = [{ x: 160, y: 160 }, { x: 140, y: 160 }, { x: 120, y: 160 }];
            scoreElement.innerText = score;
            createFood();
            clearCanvas();
            drawSnake();
            drawFood();
        }

        function handleButtonClick() {
            init(); // First, reset the snake's position and score
            overlay.style.display = "none"; 
            gameActive = true;
            main(); // Then start the movement loop
        }

        function main() {
            if (!gameActive) return;
            
            const currentSpeed = parseInt(speedSelect.value);

            gameTimeout = setTimeout(() => {
                clearCanvas();
                drawFood();
                advanceSnake();
                drawSnake();
                
                if (didGameEnd()) {
                    gameActive = false;
                    startBtn.innerText = "RESTART";
                    overlay.style.display = "flex";
                } else {
                    main();
                }
            }, currentSpeed);
        }

        function clearCanvas() {
            ctx.fillStyle = "#222";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function drawSnake() {
            snake.forEach((part, i) => {
                ctx.fillStyle = i === 0 ? "#4CAF50" : "#388E3C";
                ctx.fillRect(part.x, part.y, gridSize - 1, gridSize - 1);
            });
        }

        function advanceSnake() {
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) {
                score++;
                scoreElement.innerText = score;
                createFood();
            } else {
                snake.pop();
            }
        }

        function didGameEnd() {
            const hitWall = snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height;
            let hitSelf = false;
            for (let i = 4; i < snake.length; i++) {
                if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) hitSelf = true;
            }
            return hitWall || hitSelf;
        }

        function createFood() {
            food = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
                y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
            };
        }

        function drawFood() {
            ctx.fillStyle = "#FF5252";
            ctx.fillRect(food.x, food.y, gridSize - 1, gridSize - 1);
        }

        function changeDirection(direction) {
            if (!gameActive) return;
            const goingUp = dy === -gridSize;
            const goingDown = dy === gridSize;
            const goingRight = dx === gridSize;
            const goingLeft = dx === -gridSize;

            if (direction === 'LEFT' && !goingRight) { dx = -gridSize; dy = 0; }
            if (direction === 'UP' && !goingDown) { dx = 0; dy = -gridSize; }
            if (direction === 'RIGHT' && !goingLeft) { dx = gridSize; dy = 0; }
            if (direction === 'DOWN' && !goingUp) { dx = 0; dy = gridSize; }
        }

        window.addEventListener("keydown", e => {
            const keyMap = { 37: 'LEFT', 38: 'UP', 39: 'RIGHT', 40: 'DOWN' };
            if (keyMap[e.keyCode]) changeDirection(keyMap[e.keyCode]);
            if (e.keyCode === 32 && !gameActive) handleButtonClick();
        });

        // Setup board for the very first time visitor opens it
        init();