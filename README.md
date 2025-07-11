# 💕 Our Love Story - 3 Month Anniversary Website 💕

A magical, retro Ghibli-inspired interactive website created to celebrate your 3-month anniversary with your girlfriend. This website features a beautiful Totoro-themed game world, interactive photo gallery, and special message section.

## ✨ Features

- The main menu displays a Totoro image (image/totoro.png) above the title for extra cuteness.

### 🎮 Interactive Game World
- **Retro-style character movement** - Use arrow keys or WASD to move your character
- **Ghibli-themed collectibles** - Gather acorns, spirits, and leaves throughout the magical world
- **Animated environment** - Trees, flowers, clouds, butterflies, Totoro friends, and Catbus
- **Health bar system** - Track your love points as you explore
- **Ambient effects** - Floating leaves and spirit particles create a magical atmosphere

### 📸 Photo Gallery
- **8 photo slots** - Click on any slot to add your special memories
- **Easy photo upload** - Simply click and select images from your device
- **Interactive photo viewer** - Click on uploaded photos to view them in a beautiful modal
- **Photo navigation** - Use arrow keys or navigation buttons to browse through photos
- **Responsive design** - Photos look great on any device

### 💌 Special Message Section
- **Editable message** - Type your personal anniversary message
- **Live preview** - See your message as you type
- **Save functionality** - Your message is automatically saved locally
- **Print option** - Print your message in a beautiful format
- **Pre-written template** - Includes a romantic starting message you can customize

## 🎨 Design Features

- **Totoro-inspired aesthetic** - Soft colors, magical animations, and whimsical Ghibli elements
- **Responsive design** - Works perfectly on desktop, tablet, and mobile
- **Smooth animations** - Floating spirits, swaying trees, fluttering butterflies, and Totoro breathing
- **Interactive elements** - Hover effects, click animations, and visual feedback
- **Pixel art fonts** - Authentic retro gaming feel
- **Loading screen** - Beautiful Totoro animation with rain effects

## 🚀 How to Use

### Getting Started
1. Open `index.html` in your web browser
2. Wait for the loading screen to complete (or press any key to skip)
3. Navigate through the main menu to explore different sections

### Adding Photos
1. Click on "Photo Memories" from the main menu
2. Click on any photo slot (marked with a "+" symbol)
3. Select an image file from your device
4. Your photo will appear in the slot
5. Click on any uploaded photo to view it in full screen

### Customizing Your Message
1. Click on "Special Message" from the main menu
2. Edit the pre-written message or write your own
3. Use the "Save Message" button to save your changes
4. Use the "Print Message" button to print a beautiful version
5. Your message is automatically saved and will persist between sessions

### Playing the Game
1. Click "Start Journey" from the main menu
2. Use arrow keys or WASD to move your character
3. Collect acorns (🌰), spirits (✨), and leaves (🍃) to earn love points
4. Interact with Totoro friends and watch the Catbus drive by
5. Try to collect all items for a magical victory celebration!

## 🎯 Controls

### Game Controls
- **Arrow Keys** or **WASD** - Move character
- **Space** or **Up Arrow** - Jump
- **Mouse** - Click on collectibles

### Navigation
- **Menu buttons** - Navigate between sections
- **Back buttons** - Return to main menu
- **Keyboard shortcuts** - Various shortcuts throughout the experience

## 🎁 Easter Eggs

- **Konami Code** - Try entering the classic Konami code (↑↑↓↓←→←→BA) for a special surprise!
- **Hidden animations** - Look for subtle ambient effects throughout the experience
- **Totoro interactions** - Watch for special Totoro friend animations
- **Victory celebration** - Complete the game to unlock a magical celebration
- **Ambient spirits** - Keep an eye out for floating spirit particles

## 🛠️ Customization

### Changing Colors
Edit the CSS variables in `styles.css` to customize the color scheme:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #ff6b6b;
}
```

### Adding More Photos
To add more photo slots, edit the `gallery-grid` section in `index.html`:
```html
<div class="photo-slot" onclick="addPhoto(this)">
    <div class="photo-placeholder">
        <span>+</span>
        <p>Click to add photo</p>
    </div>
</div>
```

### Modifying the Message
The default message is in the `message-text` textarea in `index.html`. You can:
- Change the pre-written text
- Modify the styling in the print function
- Add more formatting options

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ Internet Explorer (limited support)

## 💾 Data Storage

- **Photos** - Stored temporarily in browser memory (not saved permanently)
- **Message** - Saved locally in browser storage (persists between sessions)
- **Game progress** - Resets each time you reload the page

## 🎨 Technical Details

- **Pure HTML/CSS/JavaScript** - No external dependencies required
- **Responsive design** - Works on all screen sizes
- **Local storage** - Saves your message automatically
- **File upload** - Handles image files locally
- **Print functionality** - Creates beautiful printed versions

## 💝 Tips for the Perfect Experience

1. **Add meaningful photos** - Choose photos that represent special moments in your relationship
2. **Personalize the message** - Make it specific to your relationship and memories
3. **Explore the game** - Take time to enjoy the interactive elements
4. **Try the easter eggs** - Discover hidden features for extra fun
5. **Share the experience** - Sit together and explore the website as a couple

## 🎉 Special Features for Your Anniversary

- **3 Month Anniversary theme** - Specifically designed for your milestone
- **Romantic atmosphere** - Every element is crafted with love in mind
- **Interactive storytelling** - Tell your love story through photos and words
- **Memorable experience** - Create a lasting digital memory of your celebration
- **Ghibli magic** - Totoro-inspired elements make it extra special

---

**Made with 💕 and ✨ for your special day!**

*This website is designed to be a beautiful, interactive way to celebrate your love and create lasting memories together.* 