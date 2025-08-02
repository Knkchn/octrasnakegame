class OctraSnake {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('gameOverlay');
        this.shareOverlay = document.getElementById('shareOverlay');
        this.startButton = document.getElementById('startButton');
        this.playAgainButton = document.getElementById('playAgainButton');
        this.shareButton = document.getElementById('shareButton');
        this.mainMenuButton = document.getElementById('mainMenuButton');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.finalScoreElement = document.getElementById('finalScore');
        this.shareHighScoreElement = document.getElementById('shareHighScore');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayMessage = document.getElementById('overlayMessage');

        // Background music
        this.bgMusic = document.getElementById('bgMusic');
        this.musicEnabled = true;
        this.soundButton = document.getElementById('soundButton');

        // Game settings - Fixed grid size to match canvas
        this.gridSize = 20;
        this.tileCountX = 30; // 600px / 20px = 30 tiles
        this.tileCountY = 20; // 400px / 20px = 20 tiles
        this.snake = [{x: 10, y: 10}];
        this.food = null;
        this.bomb = null;
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = localStorage.getItem('octraSnakeHighScore') || 0;
        this.difficulty = 'medium'; // Default difficulty
        this.gameSpeed = 100; // Will be set based on difficulty
        this.isGameRunning = false;
        this.gameLoop = null;
        this.lastTime = 0;

        // Smooth animation variables
        this.animationProgress = 0;
        this.isAnimating = false;
        this.targetPositions = [];
        this.currentPositions = [];

        // Bomb system
        this.bombTimer = 0;
        this.bombInterval = 5000; // 5 seconds between bombs
        this.bombDuration = 3000; // 3 seconds bomb stays on screen
        this.bombStartTime = 0;
        this.bombActive = false;

        // Sound effects
        this.sounds = {
            eat: null,
            gameOver: null,
            button: null,
            bomb: null,
            bombHit: null
        };
        this.soundEnabled = true;

        // Colors (Octra blue theme)
        this.colors = {
            snake: '#00bfff',
            snakeHead: '#0080ff',
            food: '#ff6b6b',
            background: '#0a0a0a',
            grid: '#1a1a2e'
        };

        // Load images
        this.mascotImage = new Image();
        this.mascotImage.src = 'octramaskot.jpeg';
        this.logoImage = new Image();
        this.logoImage.src = 'octralogo.jpg';

        this.init();
    }

    init() {
        this.updateHighScore();
        this.setupEventListeners();
        this.initSounds();
        this.drawGrid();
        this.updateSoundButton(); // Initialize sound button
        
        // Debug music status
        console.log('Music element:', this.bgMusic);
        console.log('Music ready state:', this.bgMusic.readyState);
        console.log('Music paused:', this.bgMusic.paused);
        
        this.showStartScreen();
    }

    initSounds() {
        // Create simple sound effects using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Eat sound (high frequency beep)
            this.sounds.eat = () => {
                if (!this.soundEnabled) return;
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            };

            // Game over sound (low frequency)
            this.sounds.gameOver = () => {
                if (!this.soundEnabled) return;
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            };

            // Button click sound
            this.sounds.button = () => {
                if (!this.soundEnabled) return;
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.05);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.05);
            };

            // Bomb spawn sound (warning sound)
            this.sounds.bomb = () => {
                if (!this.soundEnabled) return;
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            };

            // Bomb hit sound (explosion)
            this.sounds.bombHit = () => {
                if (!this.soundEnabled) return;
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.4);
                gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
            };
        } catch (error) {
            console.log('Audio not supported:', error);
        }
    }

    toggleMusic() {
        if (this.musicEnabled) {
            this.bgMusic.pause();
            this.musicEnabled = false;
        } else {
            this.bgMusic.play().catch(e => console.log('Music play failed:', e));
            this.musicEnabled = true;
        }
    }

    startMusic() {
        if (this.musicEnabled) {
            this.bgMusic.volume = 0.3; // Set volume to 30%
            console.log('Attempting to start music...');
            
            // Try to play music immediately
            this.bgMusic.play().then(() => {
                console.log('Music started successfully');
            }).catch(e => {
                console.log('Music play failed - waiting for user interaction:', e);
                // Music will start on first user interaction
            });
        }
    }

    // Function to start music on first user interaction
    initMusicOnInteraction() {
        if (this.musicEnabled && this.bgMusic.paused) {
            console.log('Starting music on user interaction...');
            this.bgMusic.play().then(() => {
                console.log('Music started on user interaction');
            }).catch(e => {
                console.log('Music play failed on interaction:', e);
            });
        }
    }

    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    updateSoundButton() {
        const soundIcon = this.soundButton.querySelector('.sound-icon');
        if (this.musicEnabled) {
            soundIcon.textContent = '🔊';
            this.soundButton.classList.remove('muted');
        } else {
            soundIcon.textContent = '🔇';
            this.soundButton.classList.add('muted');
        }
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.isGameRunning) {
                if (e.code === 'Space') {
                    this.initMusicOnInteraction(); // Start music on space key
                    this.startGame();
                }
                return;
            }

            switch(e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    if (this.dy !== 1) {
                        this.dx = 0;
                        this.dy = -1;
                    }
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    if (this.dy !== -1) {
                        this.dx = 0;
                        this.dy = 1;
                    }
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    if (this.dx !== 1) {
                        this.dx = -1;
                        this.dy = 0;
                    }
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    if (this.dx !== -1) {
                        this.dx = 1;
                        this.dy = 0;
                    }
                    break;
            }
        });

        // Start button
        this.startButton.addEventListener('click', () => {
            if (this.sounds.button) this.sounds.button();
            this.initMusicOnInteraction(); // Start music on first click
            this.startGame();
        });

        // Play again button
        this.playAgainButton.addEventListener('click', () => {
            if (this.sounds.button) this.sounds.button();
            this.initMusicOnInteraction(); // Start music on click
            this.hideShareOverlay();
            this.startGame();
        });

        // Main menu button
        this.mainMenuButton.addEventListener('click', () => {
            if (this.sounds.button) this.sounds.button();
            this.hideShareOverlay();
            this.showStartScreen();
        });

        // Share button
        this.shareButton.addEventListener('click', () => {
            if (this.sounds.button) this.sounds.button();
            this.shareScore();
        });

        // Difficulty buttons
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (this.sounds.button) this.sounds.button();
                this.initMusicOnInteraction(); // Start music on difficulty selection
                // Remove active class from all buttons
                difficultyButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                // Set difficulty
                this.difficulty = button.dataset.difficulty;
            });
        });

        // Sound button
        this.soundButton.addEventListener('click', () => {
            this.toggleMusic();
            this.updateSoundButton();
        });

        // Touch controls (mobile)
        let touchStartX = 0;
        let touchStartY = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!this.isGameRunning) {
                this.initMusicOnInteraction(); // Start music on touch
                this.startGame();
                return;
            }

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal movement
                if (deltaX > 0 && this.dx !== -1) {
                    this.dx = 1;
                    this.dy = 0;
                } else if (deltaX < 0 && this.dx !== 1) {
                    this.dx = -1;
                    this.dy = 0;
                }
            } else {
                // Vertical movement
                if (deltaY > 0 && this.dy !== -1) {
                    this.dx = 0;
                    this.dy = 1;
                } else if (deltaY < 0 && this.dy !== 1) {
                    this.dx = 0;
                    this.dy = -1;
                }
            }
        });
    }

    getGameSpeed() {
        switch(this.difficulty) {
            case 'medium':
                return 100; // Current speed
            case 'fast':
                return 70; // Faster
            case 'super':
                return 50; // Super fast
            default:
                return 100;
        }
    }

    startGame() {
        this.isGameRunning = true;
        this.snake = [{x: 10, y: 10}];
        this.dx = 1; // Start moving right automatically
        this.dy = 0;
        this.score = 0;
        this.gameSpeed = this.getGameSpeed();
        this.lastTime = 0;
        this.animationProgress = 0;
        this.isAnimating = false;
        
        // Reset bomb system
        this.bomb = null;
        this.bombTimer = 0;
        this.bombActive = false;
        
        // Start background music
        this.startMusic();
        
        this.updateScore();
        this.generateFood();
        this.hideOverlay();
        this.hideShareOverlay();
        this.gameLoop = requestAnimationFrame((timestamp) => this.gameStep(timestamp));
    }

    gameStep(timestamp) {
        if (!this.isGameRunning) return;

        // Always update animation - adjust speed based on difficulty
        if (this.isAnimating) {
            let animationSpeed = 0.15; // Default speed for medium
            
            // Increase animation speed for faster difficulties
            if (this.difficulty === 'fast') {
                animationSpeed = 0.25; // Faster animation for fast mode
            } else if (this.difficulty === 'super') {
                animationSpeed = 0.35; // Even faster animation for super mode
            }
            
            this.animationProgress += animationSpeed;
            if (this.animationProgress >= 1) {
                this.animationProgress = 0;
                this.isAnimating = false;
            }
        }

        // Game logic update
        if (timestamp - this.lastTime > this.gameSpeed) {
            this.lastTime = timestamp;

            // Update bomb timer
            this.bombTimer += this.gameSpeed;
            
            // Spawn bomb every 5 seconds
            if (this.bombTimer >= this.bombInterval && !this.bombActive) {
                this.generateBomb();
                this.bombTimer = 0;
            }
            
            // Remove bomb after duration
            if (this.bombActive && timestamp - this.bombStartTime > this.bombDuration) {
                this.bomb = null;
                this.bombActive = false;
            }

            // Move snake
            const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};

            // Handle edge wrapping - ALL edges work the same way
            if (head.x < 0) {
                head.x = this.tileCountX - 1;
            } else if (head.x >= this.tileCountX) {
                head.x = 0;
            }
            
            if (head.y < 0) {
                head.y = this.tileCountY - 1;
            } else if (head.y >= this.tileCountY) {
                head.y = 0;
            }

            // Collision check - only check self collision, no wall collision
            if (this.checkCollision(head)) {
                if (this.sounds.gameOver) this.sounds.gameOver();
                this.gameOver();
                return;
            }

            // Store current positions for smooth animation
            this.currentPositions = this.snake.map(segment => ({x: segment.x, y: segment.y}));
            
            this.snake.unshift(head);

            // Food eating check
            if (this.food && head.x === this.food.x && head.y === this.food.y) {
                this.score += 10;
                this.updateScore();
                this.generateFood();
                this.increaseSpeed();
                if (this.sounds.eat) this.sounds.eat();
                // Don't remove tail - snake grows
            } else {
                this.snake.pop();
            }

            // Bomb eating check
            if (this.bomb && head.x === this.bomb.x && head.y === this.bomb.y) {
                this.score = Math.max(0, this.score - 10); // Don't go below 0
                this.updateScore();
                
                // Shorten snake by 1 unit when eating bomb
                if (this.snake.length > 1) {
                    this.snake.pop(); // Remove last segment
                }
                
                this.bomb = null;
                this.bombActive = false;
                if (this.sounds.bombHit) this.sounds.bombHit();
                this.showRedEffect();
            }

            // Set target positions for smooth animation
            this.targetPositions = this.snake.map(segment => ({x: segment.x, y: segment.y}));
            this.isAnimating = true;
            this.animationProgress = 0;
        }

        this.draw();
        this.gameLoop = requestAnimationFrame((timestamp) => this.gameStep(timestamp));
    }

    checkCollision(head) {
        // Only check self collision, no wall collision
        if (this.dx !== 0 || this.dy !== 0) {
            // Check if head collides with any snake segment
            for (let i = 0; i < this.snake.length; i++) {
                const segment = this.snake[i];
                if (head.x === segment.x && head.y === segment.y) {
                    return true;
                }
            }
        }
        return false;
    }

    generateFood() {
        // Simple and reliable food generation
        let attempts = 0;
        const maxAttempts = 100;
        
        while (attempts < maxAttempts) {
            const newX = Math.floor(Math.random() * this.tileCountX);
            const newY = Math.floor(Math.random() * this.tileCountY);
            
            // Check if this position is free
            let isFree = true;
            for (let segment of this.snake) {
                if (segment.x === newX && segment.y === newY) {
                    isFree = false;
                    break;
                }
            }
            
            if (isFree) {
                this.food = {x: newX, y: newY};
                return;
            }
            
            attempts++;
        }
        
        // If we couldn't find a free position, try to find any position
        for (let x = 0; x < this.tileCountX; x++) {
            for (let y = 0; y < this.tileCountY; y++) {
                let isFree = true;
                for (let segment of this.snake) {
                    if (segment.x === x && segment.y === y) {
                        isFree = false;
                        break;
                    }
                }
                if (isFree) {
                    this.food = {x: x, y: y};
                    return;
                }
            }
        }
        
        // If still no position found, place food at (0,0)
        this.food = {x: 0, y: 0};
    }

    generateBomb() {
        // Generate bomb at random position
        let attempts = 0;
        const maxAttempts = 100;
        
        while (attempts < maxAttempts) {
            const newX = Math.floor(Math.random() * this.tileCountX);
            const newY = Math.floor(Math.random() * this.tileCountY);
            
            // Check if this position is free
            let isFree = true;
            
            // Check snake collision
            for (let segment of this.snake) {
                if (segment.x === newX && segment.y === newY) {
                    isFree = false;
                    break;
                }
            }
            
            // Check food collision
            if (this.food && this.food.x === newX && this.food.y === newY) {
                isFree = false;
            }
            
            if (isFree) {
                this.bomb = {x: newX, y: newY};
                this.bombActive = true;
                this.bombStartTime = performance.now();
                if (this.sounds.bomb) this.sounds.bomb();
                return;
            }
            
            attempts++;
        }
        
        // If we couldn't find a free position, don't spawn bomb
        this.bombActive = false;
    }

    showRedEffect() {
        // Create a red flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 0, 0, 0.3);
            pointer-events: none;
            z-index: 9999;
            animation: redFlash 0.5s ease-out;
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes redFlash {
                0% { opacity: 0; }
                50% { opacity: 1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(flash);
        
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(flash);
            document.head.removeChild(style);
        }, 500);
    }

    increaseSpeed() {
        const minSpeed = this.difficulty === 'super' ? 30 : this.difficulty === 'fast' ? 40 : 50;
        if (this.gameSpeed > minSpeed) {
            this.gameSpeed -= 2;
        }
    }

    gameOver() {
        this.isGameRunning = false;
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }
        
        // Stop background music
        this.stopMusic();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('octraSnakeHighScore', this.highScore);
            this.updateHighScore();
        }

        this.showShareScreen();
    }

    showShareScreen() {
        // Update share screen elements
        this.finalScoreElement.textContent = this.score;
        this.shareHighScoreElement.textContent = this.highScore;
        
        // Show share overlay
        this.shareOverlay.classList.remove('hidden');
    }

    generateShareText() {
        const score = this.score;
        const highScore = this.highScore;
        
        let text = `Just scored ${score} points in Octra Snake! 🐍🎮`;
        
        if (score === highScore && score > 0) {
            text += ` New high score! 🏆`;
        } else if (score > 0) {
            text += ` Can you beat my score?`;
        }
        
        text += ` @octra #OctraSnake #Gaming`;
        
        return text;
    }

    shareScore() {
        const shareText = this.generateShareText();
        const shareUrl = 'https://x.com/intent/tweet?text=' + encodeURIComponent(shareText);
        
        // Open X platform in new tab with pre-filled tweet
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    draw() {
        // Clear background
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.drawGrid();

        // Draw snake with smooth animation
        if (this.isAnimating && this.currentPositions.length > 0) {
            // Draw interpolated positions
            for (let i = 0; i < this.snake.length; i++) {
                const current = this.currentPositions[i] || this.snake[i];
                const target = this.targetPositions[i] || this.snake[i];
                
                // Interpolate position with proper edge wrapping
                let x = current.x + (target.x - current.x) * this.animationProgress;
                let y = current.y + (target.y - current.y) * this.animationProgress;
                
                // Handle edge wrapping in animation - use shortest path
                if (Math.abs(target.x - current.x) > this.tileCountX / 2) {
                    // Edge crossing detected, use shortest path
                    if (target.x > current.x) {
                        x = current.x + (target.x - this.tileCountX - current.x) * this.animationProgress;
                    } else {
                        x = current.x + (target.x + this.tileCountX - current.x) * this.animationProgress;
                    }
                }
                
                if (Math.abs(target.y - current.y) > this.tileCountY / 2) {
                    // Edge crossing detected, use shortest path
                    if (target.y > current.y) {
                        y = current.y + (target.y - this.tileCountY - current.y) * this.animationProgress;
                    } else {
                        y = current.y + (target.y + this.tileCountY - current.y) * this.animationProgress;
                    }
                }
                
                // Wrap coordinates
                if (x < 0) x += this.tileCountX;
                if (x >= this.tileCountX) x -= this.tileCountX;
                if (y < 0) y += this.tileCountY;
                if (y >= this.tileCountY) y -= this.tileCountY;
                
                if (i === 0) {
                    this.drawSnakeHead({x: x, y: y});
                } else {
                    this.drawSnakeSegment({x: x, y: y});
                }
            }
        } else {
            // Draw normal positions
            this.snake.forEach((segment, index) => {
                if (index === 0) {
                    this.drawSnakeHead(segment);
                } else {
                    this.drawSnakeSegment(segment);
                }
            });
        }

        // Draw food only if it exists
        if (this.food) {
            this.drawFood();
        }

        // Draw bomb only if it exists
        if (this.bomb) {
            this.drawBomb();
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 0.5;
        
        // Draw vertical lines
        for (let i = 0; i <= this.tileCountX; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let i = 0; i <= this.tileCountY; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }

    drawSnakeHead(segment) {
        const x = segment.x * this.gridSize;
        const y = segment.y * this.gridSize;
        const size = this.gridSize;

        // Draw head background
        this.ctx.fillStyle = this.colors.snakeHead;
        this.ctx.fillRect(x + 1, y + 1, size - 2, size - 2);

        // Glow effect
        this.ctx.shadowColor = this.colors.snakeHead;
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
        this.ctx.shadowBlur = 0;

        // Draw mascot image on head
        if (this.mascotImage.complete) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.8;
            this.ctx.drawImage(this.mascotImage, x + 2, y + 2, size - 4, size - 4);
            this.ctx.restore();
        }
    }

    drawSnakeSegment(segment) {
        const x = segment.x * this.gridSize;
        const y = segment.y * this.gridSize;
        const size = this.gridSize;

        this.ctx.fillStyle = this.colors.snake;
        this.ctx.fillRect(x + 1, y + 1, size - 2, size - 2);

        // Glow effect
        this.ctx.shadowColor = this.colors.snake;
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
        this.ctx.shadowBlur = 0;
    }

    drawFood() {
        const x = this.food.x * this.gridSize;
        const y = this.food.y * this.gridSize;
        const size = this.gridSize;

        // Draw food background
        this.ctx.fillStyle = this.colors.food;
        this.ctx.beginPath();
        this.ctx.arc(
            x + size / 2,
            y + size / 2,
            size / 2 - 2,
            0,
            2 * Math.PI
        );
        this.ctx.fill();

        // Glow effect
        this.ctx.shadowColor = this.colors.food;
        this.ctx.shadowBlur = 15;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Draw Octra logo on food
        if (this.logoImage.complete) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.9;
            this.ctx.drawImage(this.logoImage, x + 2, y + 2, size - 4, size - 4);
            this.ctx.restore();
        }
    }

    drawBomb() {
        const x = this.bomb.x * this.gridSize;
        const y = this.bomb.y * this.gridSize;
        const size = this.gridSize;

        // Draw bomb background (black circle)
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(
            x + size / 2,
            y + size / 2,
            size / 2 - 2,
            0,
            2 * Math.PI
        );
        this.ctx.fill();

        // Draw bomb fuse (red line)
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x + size / 2, y + 2);
        this.ctx.lineTo(x + size / 2, y - 5);
        this.ctx.stroke();

        // Draw bomb glow effect
        this.ctx.shadowColor = '#ff0000';
        this.ctx.shadowBlur = 20;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        // Draw bomb emoji
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('💣', x + size / 2, y + size / 2 + 5);
    }

    showStartScreen() {
        this.overlayTitle.textContent = "Welcome to Octra Snake!";
        this.overlayMessage.textContent = "Press SPACE to start";
        this.startButton.textContent = "PLAY";
        this.overlay.classList.remove('hidden');
    }

    hideOverlay() {
        this.overlay.classList.add('hidden');
    }

    hideShareOverlay() {
        this.shareOverlay.classList.add('hidden');
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    updateHighScore() {
        this.highScoreElement.textContent = this.highScore;
    }
}

// Start the game
document.addEventListener('DOMContentLoaded', () => {
    new OctraSnake();
}); 