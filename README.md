# 🐍 Octra Snake Game

A modern and stylish Snake game developed for the Octra project with advanced features and dynamic gameplay.

## 🎮 Game Features

### Core Mechanics
* **Smooth Movement**: Fluid snake animation with interpolation
* **Edge Wrapping**: Snake can pass through walls and appear on opposite side
* **Food Collection**: Collect Octra logos to grow and score points
* **Bomb System**: Avoid bombs that appear randomly and reduce score
* **Auto Start**: Snake starts moving automatically when game begins

### Visual Design
* **Octra Theme**: Blue color palette (#00bfff, #0080ff)
* **Custom Assets**: Octra logo and mascot integration
* **Glow Effects**: Modern visual effects and animations
* **Responsive Design**: Works perfectly on mobile and desktop devices

### Game Modes
* **3 Difficulty Levels**:
  - **Medium**: Standard speed (100ms)
  - **Fast**: 30% faster (70ms)
  - **Super**: 50% faster (50ms)
* **Dynamic Speed**: Game speeds up as you eat food
* **Smooth Animation**: Optimized animation speed for each difficulty

### Audio System
* **Sound Effects**: 
  - Food eating sound
  - Game over sound
  - Button click sound
  - Bomb spawn warning
  - Bomb explosion sound
* **Web Audio API**: Modern browser audio support

### Social Features
* **X (Twitter) Sharing**: Share scores directly to X platform
* **Score System**: High score recording with local storage
* **Share Preview**: See what will be shared before posting

## 🎯 How to Play

### Controls
* **Keyboard**: ↑ ↓ ← → or WASD keys
* **Mobile**: Swipe gestures on touch screen
* **Start**: SPACE key or "PLAY" button

### Game Rules
1. **Collect Food**: Eat Octra logos to grow and score 10 points
2. **Avoid Bombs**: Bombs appear every 5 seconds and reduce score by 10 points
3. **Don't Hit Yourself**: Collision with your own body ends the game
4. **Edge Wrapping**: You can pass through walls
5. **Speed Increases**: Game gets faster as you eat more food

### Bomb System
* **Spawn Rate**: Every 5 seconds
* **Duration**: 3 seconds on screen
* **Effect**: -10 points when eaten
* **Visual**: Red flash effect and explosion sound
* **Warning**: Low frequency sound when bomb spawns

## 🚀 Live Demo

Play the game now: [Octra Snake Game](https://knkchn.github.io/octrasnakegame/)

## 🛠️ Technologies

* **HTML5 Canvas**: Game graphics and rendering
* **Vanilla JavaScript**: Game logic and mechanics
* **CSS3**: Modern animations, effects, and responsive design
* **Web Audio API**: Sound effects and audio system
* **Local Storage**: Score persistence
* **GitHub Pages**: Hosting and deployment

## 📱 Features

### Visual Features
* **Octra Blue Theme**: #00bfff primary, #0080ff secondary
* **Custom Graphics**: Octra logo and mascot integration
* **Glow Effects**: Modern visual enhancements
* **Smooth Animations**: Interpolated movement system
* **Grid Background**: Clean game board design

### Game Mechanics
* **Dynamic Speed System**: Adjusts based on difficulty and food eaten
* **Collision Detection**: Self-collision and food/bomb detection
* **Score Tracking**: Real-time score updates
* **High Score Recording**: Persistent local storage
* **Bomb System**: Random bomb spawning with visual/sound effects

### User Experience
* **Difficulty Selection**: Choose from 3 speed levels
* **Start Screen**: Welcome screen with instructions
* **Game Over Screen**: Score display and sharing options
* **Main Menu Return**: Easy navigation back to difficulty selection
* **Mobile Compatible**: Touch controls and responsive design

## 🎨 Theme Colors

* **Primary**: #00bfff (Octra Blue)
* **Secondary**: #0080ff (Dark Blue)
* **Food**: #ff6b6b (Red)
* **Bomb**: #000000 (Black) with red fuse
* **Background**: #0a0a0a (Black)
* **Grid**: #1a1a2e (Dark Blue)

## 📁 Project Structure

```
octrasnakegame/
├── index.html          # Main HTML file with game interface
├── style.css           # CSS styles and animations
├── game.js             # Game logic and mechanics
├── octralogo.jpg       # Octra logo for food items
├── octramaskot.jpeg    # Octra mascot for snake head
└── README.md           # Project documentation
```

## 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Knkchn/octrasnakegame.git
   ```

2. **Navigate to project directory**:
   ```bash
   cd octrasnakegame
   ```

3. **Open in browser**:
   - Open `index.html` in your web browser
   - Or use a local server for best experience

## 🌐 Deployment

### GitHub Pages (Recommended)
The game is already deployed on GitHub Pages:
- **Live URL**: https://knkchn.github.io/octrasnakegame/
- **Repository**: https://github.com/Knkchn/octrasnakegame

### Manual Deployment
1. Go to repository settings
2. Select "Pages" tab
3. Choose "main" branch as source
4. Click Save

## 🎮 Game Controls

### Desktop Controls
* **Arrow Keys**: Move snake in all directions
* **WASD Keys**: Alternative movement controls
* **SPACE**: Start game from menu
* **Mouse**: Click buttons for menu navigation

### Mobile Controls
* **Swipe Gestures**: Swipe in direction to move snake
* **Touch**: Tap buttons for menu navigation
* **Responsive**: Optimized for all screen sizes

## 🏆 Scoring System

* **Food Collection**: +10 points per Octra logo
* **Bomb Avoidance**: -10 points if bomb is eaten
* **High Score**: Automatically saved to local storage
* **Score Sharing**: Share results on X platform

## 🔧 Technical Features

### Performance Optimizations
* **RequestAnimationFrame**: Smooth 60fps animations
* **Interpolation**: Fluid movement between grid cells
* **Efficient Rendering**: Optimized canvas drawing
* **Memory Management**: Proper cleanup and resource management

### Browser Compatibility
* **Modern Browsers**: Chrome, Firefox, Safari, Edge
* **Mobile Browsers**: iOS Safari, Chrome Mobile
* **Audio Support**: Web Audio API compatible browsers
* **Local Storage**: Score persistence across sessions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

* **Octra Project Team**: For the theme and assets
* **Modern Web Technologies**: HTML5, CSS3, JavaScript
* **Game Development Community**: For inspiration and feedback
* **GitHub**: For hosting and deployment platform

---

**Developed by Knkchn** 🎮✨

**Octra Snake** - Classic game experience with modern web technologies and dynamic gameplay features! 