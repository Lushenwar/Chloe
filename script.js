// Game State
let currentScreen = 'loading';
let loveScore = 100;
let playerPosition = { x: 50, y: 50 }; // Changed from 100 to 50 for better Y positioning
let collectedItems = 0;
let totalItems = 7; // Updated for new collectibles
let uploadedPhotos = [];
let currentPhotoIndex = 0;
let carouselInterval = null;
let carouselActive = true;
let currentLocation = 'main';
let gameParticles = [];
let gameCompleted = false;
let finalMessageUnlocked = false;
let isTeleporting = false;
let isCarouselSliding = false;
let loadingScreenExited = false;

// DOM Elements
const screens = {
    loading: document.getElementById('loading-screen'),
    menu: document.getElementById('main-menu'),
    game: document.getElementById('game-world'),
    gallery: document.getElementById('photo-gallery'),
    message: document.getElementById('special-message'),
    video: document.getElementById('video-section'),
    finalMessage: document.getElementById('final-message')
};

let player;
document.addEventListener('DOMContentLoaded', function() {
    player = document.querySelector('.character');
    if (player) {
        startMovementLoop();
    }
});

const loveScoreElement = document.getElementById('love-score');
const healthFill = document.querySelector('.health-fill');
const messageText = document.getElementById('message-text');
const messagePreview = document.getElementById('message-preview-content');
const photoInput = document.getElementById('photo-input');

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    // Start with loading screen
    showScreen('loading');
    
    // Change loading text to 'Ready' after 3 seconds
    setTimeout(function() {
        var loadingTitle = document.querySelector('.loading-title');
        if (loadingTitle) loadingTitle.textContent = 'Ready';
    }, 3000);
    
    // Add keyboard listener for loading screen
    document.addEventListener('keydown', function(e) {
        if (currentScreen === 'loading' && !loadingScreenExited) {
            loadingScreenExited = true;
            const loadingScreen = document.getElementById('loading-screen');
            const sparkle = document.getElementById('loading-sparkle');
            if (loadingScreen) loadingScreen.classList.add('loading-screen-exit');
            if (sparkle) sparkle.style.opacity = '1';
            if (sparkle) sparkle.classList.add('loading-sparkle');
            setTimeout(() => {
                showScreen('menu');
                if (loadingScreen) loadingScreen.classList.remove('loading-screen-exit');
                if (sparkle) sparkle.style.opacity = '0';
                loadingScreenExited = false;
            }, 1000);
        }
    });
    
    // Initialize message preview
    updateMessagePreview();
    
    // Add event listeners
    messageText.addEventListener('input', updateMessagePreview);
    
    // Initialize collectibles
    initializeCollectibles();
    
    // Start floating animations
    startFloatingAnimations();
    
    // Initialize map locations
    initializeMapLocations();
    
    // Start game particles
    startGameParticles();
    
    // Initialize photos from image folder
    initializePhotos();
    
    // Check if game was previously completed
    checkGameProgress();
});

// Character movement step size (percent of world)
const MOVE_STEP = 4;

// Movement Functions - Now move the character smoothly
function moveLeft() {
    playerPosition.x = Math.max(0, playerPosition.x - MOVE_STEP);
    updatePlayerPosition();
}

function moveRight() {
    playerPosition.x = Math.min(100, playerPosition.x + MOVE_STEP);
    updatePlayerPosition();
}

function moveUp() {
    playerPosition.y = Math.min(100, playerPosition.y + MOVE_STEP);
    updatePlayerPosition();
}

function moveDown() {
    playerPosition.y = Math.max(0, playerPosition.y - MOVE_STEP);
    updatePlayerPosition();
}

function jump() {
    // Optional: add a jump animation or effect
    // For now, move up quickly then back down
    let jumpHeight = 10;
    let originalY = playerPosition.y;
    playerPosition.y = Math.min(100, playerPosition.y + jumpHeight);
    updatePlayerPosition();
    setTimeout(() => {
        playerPosition.y = originalY;
        updatePlayerPosition();
    }, 300);
}

// Screen Management
function showScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
        currentScreen = screenName;
    }
    
    // Special handling for different screens
    if (screenName === 'game') {
        playerPosition = { x: 50, y: 50 };
        updatePlayerPosition();
        startGameLoop();
    } else if (screenName === 'menu') {
        stopGameLoop();
    } else if (screenName === 'snake-game') {
        showSnakeGame();
    }
    
    // Video audio control
    const video = document.getElementById('anniversary-video');
    if (video) {
        if (screenName === 'video') {
            video.muted = false;
            video.play().catch(()=>{});
        } else {
            video.pause();
            video.muted = true;
        }
    }
}

function showMainMenu() {
    showScreen('menu');
}

// Game Functions
function startGame() {
    showScreen('game');
    resetGame();
}

function resetGame() {
    loveScore = 100;
    playerPosition = { x: 50, y: 50 };
    collectedItems = 0;
    updateUI();
    resetCollectibles();
    resetPlayerPosition();
    createAmbientEffects();
}

function startGameLoop() {
    // Game loop for animations and interactions
    const gameLoop = setInterval(() => {
        if (currentScreen !== 'game') {
            clearInterval(gameLoop);
            return;
        }
        
        // Animate world elements
        animateWorldElements();
        
        // Check for collisions
        checkCollisions();
        
        // Check for proximity to locations
        checkCharacterLocationProximity();
        
    }, 100);
}

function stopGameLoop() {
    // Stop any ongoing game loops
}

function animateWorldElements() {
    // Butterfly movement
    const butterflies = document.querySelectorAll('.butterfly');
    butterflies.forEach((butterfly, index) => {
        const currentLeft = parseFloat(butterfly.style.left) || 60;
        let newLeft = currentLeft + (Math.sin(Date.now() * 0.001 + index) * 0.5);
        
        if (newLeft < 0) newLeft = 100;
        if (newLeft > 100) newLeft = 0;
        
        butterfly.style.left = newLeft + '%';
    });
    
    // Cloud movement
    const clouds = document.querySelectorAll('.cloud');
    clouds.forEach((cloud, index) => {
        const currentLeft = parseFloat(cloud.style.left) || 20;
        let newLeft = currentLeft + 0.02;
        
        if (newLeft > 100) newLeft = -10;
        
        cloud.style.left = newLeft + '%';
    });
    
    // Totoro friend interaction
    const totoroFriend = document.querySelector('.totoro-friend');
    if (totoroFriend && Math.random() < 0.01) { // 1% chance per frame
        totoroFriend.style.transform = 'scale(1.2)';
        setTimeout(() => {
            totoroFriend.style.transform = 'scale(1)';
        }, 500);
    }
    
    // Catbus movement
    const catbus = document.querySelector('.catbus');
    if (catbus) {
        const currentLeft = parseFloat(catbus.style.left) || 50;
        let newLeft = currentLeft + 0.1;
        
        if (newLeft > 100) newLeft = -10;
        
        catbus.style.left = newLeft + '%';
    }
}

function interact() {
    // Check if player is near a location
    const nearbyLocation = checkLocationProximity();
    if (nearbyLocation) {
        teleportToLocation(nearbyLocation);
    } else {
        // Create interaction particles
        createInteractionParticles();
    }
}

function updatePlayerPosition() {
    const world = document.getElementById('game-world');
    const worldRect = world.getBoundingClientRect();
    // Calculate pixel positions based on percentage
    const left = (playerPosition.x / 100) * worldRect.width;
    const bottom = (playerPosition.y / 100) * worldRect.height;
    player.style.left = left + 'px';
    player.style.bottom = bottom + 'px';
    player.style.transform = 'translateX(-50%)';
}

function resetPlayerPosition() {
    playerPosition = { x: 50, y: 50 };
    updatePlayerPosition();
    // Set initial transform for centering
    player.style.transform = 'translateX(-50%)';
}

// Collectibles
function initializeCollectibles() {
    const collectibles = document.querySelectorAll('.acorn-collectible, .spirit-collectible, .leaf-collectible');
    collectibles.forEach(collectible => {
        collectible.addEventListener('click', () => collectItem(collectible));
    });
}

function collectItem(collectible) {
    if (collectible.dataset.collected === 'false') {
        collectible.dataset.collected = 'true';
        collectible.classList.add('collected');
        collectedItems++;
        loveScore += 15;
        
        // Add collection effect
        createCollectionEffect(collectible);
        
        // Special effects based on item type
        const itemType = collectible.classList.contains('acorn-collectible') ? 'acorn' :
                        collectible.classList.contains('spirit-collectible') ? 'spirit' : 'leaf';
        
        createSpecialEffect(itemType, collectible);
        
        updateUI();
        
        // Check if all items collected
        if (collectedItems >= totalItems) {
            setTimeout(() => {
                createVictoryEffect();
            }, 500);
        }
    }
}

function createCollectionEffect(collectible) {
    const effect = document.createElement('div');
    effect.textContent = '+15';
    effect.style.cssText = `
        position: absolute;
        left: ${collectible.offsetLeft}px;
        top: ${collectible.offsetTop}px;
        color: #4ecdc4;
        font-size: 1.5rem;
        font-weight: bold;
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 1s ease-out forwards;
    `;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 1000);
}

function createSpecialEffect(itemType, collectible) {
    const effect = document.createElement('div');
    let emoji, color;
    
    switch(itemType) {
        case 'acorn':
            emoji = '🌰';
            color = '#8B4513';
            break;
        case 'spirit':
            emoji = '✨';
            color = '#FFD700';
            break;
        case 'leaf':
            emoji = '🍃';
            color = '#228B22';
            break;
    }
    
    effect.textContent = emoji;
    effect.style.cssText = `
        position: absolute;
        left: ${collectible.offsetLeft + 20}px;
        top: ${collectible.offsetTop - 20}px;
        color: ${color};
        font-size: 2rem;
        pointer-events: none;
        z-index: 1000;
        animation: specialFloat 2s ease-out forwards;
    `;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        effect.remove();
    }, 2000);
}

function createVictoryEffect() {
    // Mark game as completed
    gameCompleted = true;
    finalMessageUnlocked = true;
    localStorage.setItem('gameCompleted', 'true');
    localStorage.setItem('finalMessageUnlocked', 'true');
    
    // Unlock final message button
    unlockFinalMessage();
    
    // Create a magical victory celebration
    const victoryContainer = document.createElement('div');
    victoryContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10000;
    `;
    
    document.body.appendChild(victoryContainer);
    
    // Create multiple celebration elements
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const element = document.createElement('div');
            const emojis = ['✨', '🌸', '🍃', '🌰', '💖', '⭐', '🎉', '🏆', '💎'];
            element.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            element.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                font-size: 2rem;
                animation: victoryFloat 4s ease-out forwards;
            `;
            victoryContainer.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 4000);
        }, i * 100);
    }
    
    // Show victory message
    setTimeout(() => {
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255,255,255,0.95);
                padding: 2rem;
                border-radius: 20px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                z-index: 10001;
                pointer-events: auto;
            ">
                <h2 style="color: #667eea; margin-bottom: 1rem;">🎉 Congratulations! 🎉</h2>
                <p style="color: #333; margin-bottom: 1rem;">You've completed our magical journey!</p>
                <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">The final message has been unlocked! 💕</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="this.parentElement.parentElement.remove(); victoryContainer.remove(); showMainMenu();" style="
                        padding: 0.5rem 1rem;
                        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                        border: none;
                        border-radius: 8px;
                        color: white;
                        cursor: pointer;
                    ">Continue Adventure</button>
                    <button onclick="this.parentElement.parentElement.remove(); victoryContainer.remove(); showFinalMessage();" style="
                        padding: 0.5rem 1rem;
                        background: linear-gradient(45deg, #FFD700, #FFA500);
                        border: none;
                        border-radius: 8px;
                        color: white;
                        cursor: pointer;
                    ">Read Final Message</button>
                </div>
            </div>
        `;
        document.body.appendChild(message);
    }, 2000);
}

function createAmbientEffects() {
    // Create floating leaves
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every 3 seconds
            createFloatingLeaf();
        }
    }, 3000);
    
    // Create spirit particles
    setInterval(() => {
        if (Math.random() < 0.2) { // 20% chance every 4 seconds
            createSpiritParticle();
        }
    }, 4000);
}

function createFloatingLeaf() {
    const leaf = document.createElement('div');
    leaf.textContent = '🍃';
    leaf.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: -50px;
        font-size: 1.5rem;
        pointer-events: none;
        z-index: 5;
        animation: leafFall 8s linear forwards;
    `;
    
    document.querySelector('.world-container').appendChild(leaf);
    
    setTimeout(() => {
        leaf.remove();
    }, 8000);
}

function createSpiritParticle() {
    const spirit = document.createElement('div');
    spirit.textContent = '✨';
    spirit.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        font-size: 1rem;
        pointer-events: none;
        z-index: 5;
        animation: spiritGlow 4s ease-in-out infinite;
    `;
    
    document.querySelector('.world-container').appendChild(spirit);
    
    setTimeout(() => {
        spirit.remove();
    }, 4000);
}

function resetCollectibles() {
    const collectibles = document.querySelectorAll('.acorn-collectible, .spirit-collectible, .leaf-collectible');
    collectibles.forEach(collectible => {
        collectible.dataset.collected = 'false';
        collectible.classList.remove('collected');
    });
    collectedItems = 0;
}

function checkCollisions() {
    // Simple collision detection for collectibles
    const playerRect = player.getBoundingClientRect();
    const collectibles = document.querySelectorAll('.heart-collectible:not(.collected), .star-collectible:not(.collected)');
    
    collectibles.forEach(collectible => {
        const collectibleRect = collectible.getBoundingClientRect();
        
        if (playerRect.left < collectibleRect.right &&
            playerRect.right > collectibleRect.left &&
            playerRect.top < collectibleRect.bottom &&
            playerRect.bottom > collectibleRect.top) {
            
            collectItem(collectible);
        }
    });
}

// UI Updates
function updateUI() {
    // Removed loveScoreElement and loveScore update since Love Points are no longer displayed
    if (healthFill) healthFill.style.width = loveScore + '%';
}

// Photo Gallery Functions
function showGallery() {
    showScreen('gallery');
    
    // Load photos if not already loaded
    if (uploadedPhotos.length === 0) {
        loadPhotos();
    }
    
    // Initialize carousel with delay to ensure proper centering
    setTimeout(() => {
        if (uploadedPhotos.length > 0) {
            initializeCarousel();
            // Ensure the first photo is perfectly centered
            currentPhotoIndex = 0;
            updateCarousel();
        }
    }, 200);
}

function addPhoto(photoSlot) {
    photoInput.click();
    photoInput.onchange = function(event) {
        handlePhotoUpload(event, photoSlot);
    };
}

function handlePhotoUpload(event, photoSlot) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 13px;
            `;
            
            // Clear the placeholder
            photoSlot.innerHTML = '';
            photoSlot.appendChild(img);
            
            // Add to uploaded photos array
            uploadedPhotos.push({
                src: e.target.result,
                element: img
            });
            
            // Add click event for photo modal
            img.addEventListener('click', () => openPhotoModal(e.target.result));
            
            // Update carousel if on gallery screen
            if (currentScreen === 'gallery') {
                initializeCarousel();
            }
        };
        reader.readAsDataURL(file);
    }
}

// --- Carousel: Smooth Infinite Loop ---
let carouselAnimationFrame = null;
let carouselOffset = 0;
let carouselSpeed = 1.25; // px per frame for the photo album

function initializeCarousel() {
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;
    carouselTrack.innerHTML = '';
    // Render all photos twice for seamless looping
    for (let loop = 0; loop < 2; loop++) {
        for (let i = 0; i < uploadedPhotos.length; i++) {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            if (i === currentPhotoIndex && loop === 0) slide.classList.add('active');
            slide.innerHTML = `<img src="${uploadedPhotos[i].src}" alt="Memory ${i + 1}">`;
            carouselTrack.appendChild(slide);
        }
    }
    carouselOffset = 0;
    startSmoothCarouselLoop();
}

function startSmoothCarouselLoop() {
    cancelAnimationFrame(carouselAnimationFrame);
    const carouselTrack = document.getElementById('carousel-track');
    if (!carouselTrack) return;
    const slides = carouselTrack.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    const slideWidth = slides[0].offsetWidth + 64; // 32px margin each side
    function animate() {
        carouselOffset += carouselSpeed;
        if (carouselOffset >= slideWidth * uploadedPhotos.length) {
            carouselOffset = 0;
        }
        carouselTrack.style.transition = 'none';
        carouselTrack.style.transform = `translateX(${-carouselOffset}px)`;
        // Highlight the center slide
        const container = carouselTrack.parentElement;
        const containerRect = container.getBoundingClientRect();
        const center = containerRect.left + containerRect.width / 2;
        slides.forEach((slide, idx) => {
            const rect = slide.getBoundingClientRect();
            const slideCenter = rect.left + rect.width / 2;
            if (Math.abs(slideCenter - center) < slideWidth / 2) {
                slide.classList.add('active');
                slide.style.opacity = '1';
                slide.style.zIndex = '2';
                slide.style.transform = 'scale(1.05)';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0.3';
                slide.style.zIndex = '1';
                slide.style.transform = 'scale(0.95)';
            }
        });
        carouselAnimationFrame = requestAnimationFrame(animate);
    }
    animate();
}

function updateCarousel(slideDirection = 1) {
    const carouselTrack = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    if (!carouselTrack || slides.length === 0) return;
    slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        slide.style.opacity = '0.3';
        slide.style.zIndex = '1';
        slide.style.transform = 'scale(0.95)';
    });
    // The center slide is always the active one
    const centerIdx = Math.floor(slides.length / 2);
    const active = slides[centerIdx];
    if (active) {
        active.classList.add('active');
        active.style.opacity = '1';
        active.style.zIndex = '2';
        active.style.transform = 'scale(1.05)';
    }
    // Center the track so the active slide is in the middle
    let offset = 0;
    for (let i = 0; i < centerIdx; i++) {
        offset += slides[i].offsetWidth + 40;
    }
    const containerWidth = carouselTrack.parentElement.offsetWidth;
    const activeWidth = active ? active.offsetWidth : 420;
    const translateX = offset - (containerWidth - activeWidth) / 2;
    // Animate the transform for sliding
    if (!isCarouselSliding) {
        carouselTrack.style.transition = 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        carouselTrack.style.transform = `translateX(${-translateX}px)`;
    }
}

function openPhotoModal(src) {
    // Find the index of the current photo
    currentPhotoIndex = uploadedPhotos.findIndex(photo => photo.src === src);
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'photo-modal active';
    modal.innerHTML = `
        <div class="photo-modal-content">
            <img src="${src}" alt="Photo">
            <button class="photo-modal-close">×</button>
            ${uploadedPhotos.length > 1 ? `
                <button class="photo-modal-nav photo-modal-prev">‹</button>
                <button class="photo-modal-nav photo-modal-next">›</button>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePhotoModal();
        }
    });
    
    const closeBtn = modal.querySelector('.photo-modal-close');
    closeBtn.addEventListener('click', closePhotoModal);
    
    const prevBtn = modal.querySelector('.photo-modal-prev');
    const nextBtn = modal.querySelector('.photo-modal-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', showPreviousPhoto);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', showNextPhoto);
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', handlePhotoModalKeys);
}

function closePhotoModal() {
    const modal = document.querySelector('.photo-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    document.removeEventListener('keydown', handlePhotoModalKeys);
}

function showPreviousPhoto() {
    if (uploadedPhotos.length > 1) {
        currentPhotoIndex = (currentPhotoIndex - 1 + uploadedPhotos.length) % uploadedPhotos.length;
        updatePhotoModal();
    }
}

function showNextPhoto() {
    if (uploadedPhotos.length > 1) {
        currentPhotoIndex = (currentPhotoIndex + 1) % uploadedPhotos.length;
        updatePhotoModal();
    }
}

function updatePhotoModal() {
    const modal = document.querySelector('.photo-modal img');
    if (modal && uploadedPhotos[currentPhotoIndex]) {
        modal.src = uploadedPhotos[currentPhotoIndex].src;
    }
}

function handlePhotoModalKeys(e) {
    switch(e.key) {
        case 'Escape':
            closePhotoModal();
            break;
        case 'ArrowLeft':
            showPreviousPhoto();
            break;
        case 'ArrowRight':
            showNextPhoto();
            break;
    }
}

// Message Functions
function showMessage() {
    showScreen('message');
}

function showVideo() {
    showScreen('video');
    setTimeout(() => {
        const video = document.getElementById('anniversary-video');
        if (video) {
            video.muted = false;
            video.play().catch(()=>{});
        }
    }, 100);
}

function showFinalMessage() {
    if (snakeHighScore >= 20) {
        showScreen('finalMessage');
        updateFinalMessageDate();
    } else {
        alert('Get a high score of 20 in the Snake Game to unlock the final message!');
    }
}

function unlockFinalMessage() { /* no-op, handled by updateSnakeScore */ }
function checkGameProgress() {
    // Do not restore snakeHighScore from localStorage
    updateSnakeScore();
}

function updateFinalMessageDate() {
    const dateElement = document.querySelector('.date');
    if (dateElement) {
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateElement.textContent = `3 Month Anniversary - ${currentDate}`;
    }
}

// Video controls
function playVideo() {
    const video = document.getElementById('anniversary-video');
    if (video) {
        video.muted = false;
        video.play();
    }
}

function pauseVideo() {
    const video = document.getElementById('anniversary-video');
    if (video) {
        video.pause();
    }
}

function restartVideo() {
    const video = document.getElementById('anniversary-video');
    if (video) {
        video.currentTime = 0;
        video.muted = false;
        video.play();
    }
}

// Load photos from image folder
function loadPhotos() {
    // Use only the images in the /image folder
    const photoFiles = [
        'image/image1.JPG',
        'image/image2.jpg',
        'image/image3.jpg',
        'image/image4.JPG',
        'image/image5.jpg',
        'image/image6.jpg',
        'image/image7.JPG'
    ];
    uploadedPhotos = [];
    photoFiles.forEach((file) => {
        const img = new Image();
        img.onload = function() {
            uploadedPhotos.push({
                src: file,
                element: img
            });
            if (uploadedPhotos.length === photoFiles.length) {
                if (currentScreen === 'gallery') {
                    initializeCarousel();
                }
            }
        };
        img.onerror = function() {
            console.log(`Photo ${file} not found, skipping...`);
        };
        img.src = file;
    });
}

// Initialize photos from image folder
function initializePhotos() {
    const photoSlots = document.querySelectorAll('.photo-slot');
    uploadedPhotos = [];
    
    photoSlots.forEach((slot, index) => {
        const img = slot.querySelector('img');
        if (img) {
            uploadedPhotos.push({
                src: img.src,
                element: img
            });
        }
    });
    
    // Initialize carousel if on gallery screen
    if (currentScreen === 'gallery' && uploadedPhotos.length > 0) {
        initializeCarousel();
    }
}

function printFinalMessage() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Final Love Message - 3 Month Anniversary</title>
                <style>
                    body {
                        font-family: 'Georgia', serif;
                        font-size: 18px;
                        line-height: 1.8;
                        max-width: 600px;
                        margin: 50px auto;
                        padding: 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        min-height: 100vh;
                    }
                    .final-content {
                        background: rgba(255,255,255,0.1);
                        padding: 30px;
                        border-radius: 15px;
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255,255,255,0.2);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        font-size: 24px;
                        font-weight: bold;
                        color: #FFD700;
                    }
                    .message-text {
                        color: white;
                        text-align: justify;
                    }
                    .signature {
                        font-style: italic;
                        font-weight: bold;
                        text-align: right;
                        margin-top: 30px;
                        color: #FFD700;
                    }
                    .date {
                        text-align: center;
                        margin-top: 30px;
                        font-style: italic;
                        opacity: 0.8;
                    }
                </style>
            </head>
            <body>
                <div class="final-content">
                    <div class="header">💕 Final Love Message 💕</div>
                    <div class="message-text">
                        <p>My dearest love,</p>
                        
                        <p>You've just completed our magical journey together, and I couldn't be more proud of you. Every step you took, every item you collected, every moment you spent exploring our love story has brought us closer together.</p>
                        
                        <p>These three months with you have been the most incredible adventure of my life. You've shown me what true love means - it's in the little moments, the shared laughter, the quiet understanding, and the endless support we give each other.</p>
                        
                        <p>You are my best friend, my soulmate, my everything. Thank you for being the amazing person you are, for loving me unconditionally, and for making every day feel like a beautiful dream come true.</p>
                        
                        <p>I promise to love you more with each passing day, to be there for you always, and to continue this beautiful journey we've started together.</p>
                        
                        <p>Here's to many more months and years of love, laughter, and adventures together.</p>
                        
                        <p>I love you more than words can ever express.</p>
                        
                        <div class="signature">Forever and always yours,<br>[Your Name]</div>
                        
                        <div class="date">3 Month Anniversary - ${new Date().toLocaleDateString()}</div>
                    </div>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function shareMessage() {
    // Create a shareable version of the final message
    const shareText = `💕 My Final Love Message 💕\n\nMy dearest love, you've completed our magical journey together. These three months with you have been the most incredible adventure of my life. I love you more than words can ever express. Forever and always yours. 💕`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Final Love Message',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Love message copied to clipboard! 💕');
        });
    }
}

function updateMessagePreview() {
    if (messagePreview) {
        messagePreview.textContent = messageText.value;
    }
}

function saveMessage() {
    const message = messageText.value;
    localStorage.setItem('anniversaryMessage', message);
    
    // Show success effect
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved! ✓';
    saveBtn.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
    }, 2000);
}

function printMessage() {
    const message = messageText.value;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Our Love Story - Special Message</title>
                <style>
                    body {
                        font-family: 'Georgia', serif;
                        font-size: 18px;
                        line-height: 1.8;
                        max-width: 600px;
                        margin: 50px auto;
                        padding: 20px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        min-height: 100vh;
                    }
                    .message-content {
                        background: rgba(255,255,255,0.1);
                        padding: 30px;
                        border-radius: 15px;
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255,255,255,0.2);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .date {
                        text-align: center;
                        margin-top: 30px;
                        font-style: italic;
                        opacity: 0.8;
                    }
                </style>
            </head>
            <body>
                <div class="message-content">
                    <div class="header">💕 Our Love Story 💕</div>
                    <div style="white-space: pre-wrap;">${message}</div>
                    <div class="date">3rd Anniversary - ${new Date().toLocaleDateString()}</div>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Floating Animations
function startFloatingAnimations() {
    const floatingElements = document.querySelectorAll('.floating-heart, .floating-star, .floating-flower');
    
    floatingElements.forEach((element, index) => {
        // Set random initial positions
        element.style.left = Math.random() * 80 + 10 + '%';
        element.style.top = Math.random() * 80 + 10 + '%';
        
        // Add random animation delays
        element.style.animationDelay = (index * 2) + 's';
    });
}

// Keyboard Controls for character movement
window.addEventListener('keydown', function(e) {
    if (currentScreen === 'game') {
        switch(e.key) {
            case 'ArrowLeft': case 'a': case 'A': moveLeft(); break;
            case 'ArrowRight': case 'd': case 'D': moveRight(); break;
            case 'ArrowUp': case 'w': case 'W': moveUp(); break;
            case 'ArrowDown': case 's': case 'S': moveDown(); break;
            case ' ': case 'Spacebar': jump(); break;
        }
    }
});

// Load saved message on startup
window.addEventListener('load', function() {
    const savedMessage = localStorage.getItem('anniversaryMessage');
    if (savedMessage && messageText) {
        messageText.value = savedMessage;
        updateMessagePreview();
    }
});

// Add CSS for collection effect
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px);
        }
    }
`;
document.head.appendChild(style);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated!
        createEasterEgg();
        konamiCode = [];
    }
});

function createEasterEgg() {
    // Create a shower of hearts
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '💖';
            heart.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: -50px;
                font-size: 2rem;
                pointer-events: none;
                z-index: 10000;
                animation: fallDown 3s linear forwards;
            `;
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 3000);
        }, i * 100);
    }
    
    // Add falling animation
    const fallStyle = document.createElement('style');
    fallStyle.textContent = `
        @keyframes fallDown {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(fallStyle);
}

// Add some ambient sounds (visual feedback)
function playVisualSound() {
    // Create a ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        background: rgba(255,255,255,0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: ripple 1s ease-out forwards;
    `;
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 1000);
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        0% {
            width: 10px;
            height: 10px;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Map location functionality
function initializeMapLocations() {
    const locations = document.querySelectorAll('.location');
    locations.forEach(location => {
        location.addEventListener('click', () => {
            const locationType = location.dataset.location;
            teleportToLocation(locationType);
        });
    });
}

function checkLocationProximity() {
    const locations = document.querySelectorAll('.location');
    const playerRect = player.getBoundingClientRect();
    
    for (let location of locations) {
        const locationRect = location.getBoundingClientRect();
        const distanceX = Math.abs(playerRect.left - locationRect.left);
        const distanceY = Math.abs(playerRect.top - locationRect.top);
        
        // Check if player is within 80px both horizontally and vertically
        if (distanceX < 80 && distanceY < 80) {
            location.classList.add('active');
            return location.dataset.location;
        } else {
            location.classList.remove('active');
        }
    }
    return null;
}

function checkCharacterLocationProximity() {
    if (isTeleporting) return;
    const locations = document.querySelectorAll('.location');
    let found = false;
    locations.forEach(location => {
        const rect = location.getBoundingClientRect();
        const world = document.getElementById('game-world');
        const worldRect = world.getBoundingClientRect();
        const locX = ((rect.left + rect.width / 2) - worldRect.left) / worldRect.width * 100;
        const locY = 100 - (((rect.top + rect.height / 2) - worldRect.top) / worldRect.height * 100);
        if (Math.abs(playerPosition.x - locX) < 2 && Math.abs(playerPosition.y - locY) < 2) {
            location.classList.add('emoji-animate');
            found = true;
            triggerTeleportAnimation(location.dataset.location, location);
        } else {
            location.classList.remove('emoji-animate');
        }
    });
}

function triggerTeleportAnimation(locationType, locationElem) {
    isTeleporting = true;
    const charElem = document.querySelector('.character');
    if (charElem) {
        charElem.classList.add('teleport-spin');
    }
    if (locationElem) {
        locationElem.classList.add('emoji-animate-teleport');
    }
    setTimeout(() => {
        if (charElem) charElem.classList.remove('teleport-spin');
        if (locationElem) locationElem.classList.remove('emoji-animate-teleport');
        teleportToLocation(locationType);
        isTeleporting = false;
    }, 700);
}

function teleportToLocation(locationType) {
    if (locationType === 'snake') {
        showSnakeGame();
        return;
    }
    switch(locationType) {
        case 'gallery':
            showGallery();
            break;
        case 'message':
            showMessage();
            break;
        case 'menu':
            showMainMenu();
            break;
        case 'video':
            showVideo();
            break;
    }
}

function updateLocationIndicator(location) {
    const indicator = document.getElementById('current-location');
    if (indicator) {
        const locationNames = {
            'gallery': 'Photo Gallery',
            'message': 'Special Video',
            'menu': 'Main Menu',
            'main': 'Main Area'
        };
        indicator.textContent = locationNames[location] || 'Main Area';
    }
}

// Game particles system
function startGameParticles() {
    setInterval(() => {
        if (currentScreen === 'game' && Math.random() < 0.3) {
            createGameParticle();
        }
    }, 2000);
}

function createGameParticle() {
    const particle = document.createElement('div');
    const particles = ['✨', '🌸', '🍃', '💫', '⭐'];
    particle.textContent = particles[Math.floor(Math.random() * particles.length)];
    
    particle.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        bottom: 0;
        font-size: 1rem;
        pointer-events: none;
        z-index: 3;
        animation: gameParticle 3s ease-out forwards;
    `;
    
    document.querySelector('.game-particles').appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 3000);
}

function createMovementParticles(direction) {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.textContent = '✨';
            particle.style.cssText = `
                position: absolute;
                left: ${playerPosition}%;
                bottom: 100px;
                font-size: 0.8rem;
                pointer-events: none;
                z-index: 3;
                animation: gameParticle 1s ease-out forwards;
            `;
            
            document.querySelector('.game-particles').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }, i * 100);
    }
}

function createJumpParticles() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.textContent = '⭐';
            particle.style.cssText = `
                position: absolute;
                left: ${playerPosition + (Math.random() - 0.5) * 10}%;
                bottom: 100px;
                font-size: 1rem;
                pointer-events: none;
                z-index: 3;
                animation: gameParticle 1.5s ease-out forwards;
            `;
            
            document.querySelector('.game-particles').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1500);
        }, i * 150);
    }
}

function createInteractionParticles() {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.textContent = '⚡';
            particle.style.cssText = `
                position: absolute;
                left: ${playerPosition + (Math.random() - 0.5) * 20}%;
                bottom: 100px;
                font-size: 1.2rem;
                pointer-events: none;
                z-index: 3;
                animation: gameParticle 2s ease-out forwards;
            `;
            
            document.querySelector('.game-particles').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }, i * 100);
    }
}

function createTeleportParticles() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.textContent = '🌀';
            particle.style.cssText = `
                position: absolute;
                left: ${playerPosition + (Math.random() - 0.5) * 30}%;
                bottom: 100px;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 3;
                animation: gameParticle 2.5s ease-out forwards;
            `;
            
            document.querySelector('.game-particles').appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2500);
        }, i * 50);
    }
}

// Initialize everything when the page loads
window.addEventListener('load', function() {
    console.log('💕 Our Love Story - 3 Month Anniversary Edition 💕');
    console.log('Made with love and magic ✨');
    
    // Add some ambient effects
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every 5 seconds
            playVisualSound();
        }
    }, 5000);
}); 

// --- Snake Game Overlay Logic ---
let snakeScore = 0;
let snakeHighScore = 0;
let snake, snakeDir, snakeFood, snakeInterval, snakeDead;
const SNAKE_SIZE = 16;
const SNAKE_GRID = 20;
let snakeGameStarted = false;

function showSnakeGame() {
    document.getElementById('snake-overlay').style.display = 'flex';
    snakeGameStarted = false;
    snakeDead = false;
    drawSnakeStartScreen();
    // Show the Start Game button
    const startBtn = document.querySelector('.snake-start-btn');
    if (startBtn) startBtn.style.display = '';
}
function hideSnakeOverlay() {
    document.getElementById('snake-overlay').style.display = 'none';
    clearInterval(snakeInterval);
    snakeGameStarted = false;
    snakeDead = false;
    showMainMenu();
}
function startSnakeGame() {
    if (snakeGameStarted && !snakeDead) return; // Prevent starting if already running
    snake = [{x: 10, y: 10}];
    snakeDir = {x: 1, y: 0};
    snakeScore = 0;
    snakeDead = false;
    snakeGameStarted = true;
    snakeFood = spawnSnakeFood();
    updateSnakeScore();
    clearInterval(snakeInterval);
    snakeInterval = setInterval(updateSnake, 80);
    drawSnakeGame();
    // Hide the Start Game button
    const startBtn = document.querySelector('.snake-start-btn');
    if (startBtn) startBtn.style.display = 'none';
}
function drawSnakeStartScreen() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#7fff00';
    ctx.font = 'bold 24px VT323, monospace';
    ctx.textAlign = 'center';
    // Show the Start Game button
    const startBtn = document.querySelector('.snake-start-btn');
    if (startBtn) startBtn.style.display = '';
}
function updateSnake() {
    if (!snakeGameStarted || snakeDead) return;
    const head = {x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y};
    if (head.x < 0 || head.x >= SNAKE_GRID || head.y < 0 || head.y >= SNAKE_GRID) return snakeGameOver();
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) return snakeGameOver();
    }
    snake.unshift(head);
    if (head.x === snakeFood.x && head.y === snakeFood.y) {
        snakeScore++;
        if (snakeScore > snakeHighScore) {
            snakeHighScore = snakeScore;
            // Removed: localStorage.setItem('snakeHighScore', snakeHighScore);
        }
        updateSnakeScore();
        snakeFood = spawnSnakeFood();
    } else {
        snake.pop();
    }
    drawSnakeGame();
}
function drawSnakeGame() {
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#7fff00';
    snake.forEach((seg, i) => {
        ctx.globalAlpha = i === 0 ? 1 : 0.8;
        ctx.fillRect(seg.x * SNAKE_SIZE, seg.y * SNAKE_SIZE, SNAKE_SIZE, SNAKE_SIZE);
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.fillRect(snakeFood.x * SNAKE_SIZE, snakeFood.y * SNAKE_SIZE, SNAKE_SIZE, SNAKE_SIZE);
    ctx.strokeStyle = '#333';
    for (let i = 0; i <= SNAKE_GRID; i++) {
        ctx.beginPath();
        ctx.moveTo(i * SNAKE_SIZE, 0);
        ctx.lineTo(i * SNAKE_SIZE, SNAKE_SIZE * SNAKE_GRID);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * SNAKE_SIZE);
        ctx.lineTo(SNAKE_SIZE * SNAKE_GRID, i * SNAKE_SIZE);
        ctx.stroke();
    }
}
function spawnSnakeFood() {
    let pos;
    let tries = 0;
    do {
        pos = {
            x: Math.floor(Math.random() * SNAKE_GRID),
            y: Math.floor(Math.random() * SNAKE_GRID)
        };
        tries++;
        // Safety: break after too many tries (should never happen unless grid is full)
        if (tries > 1000) break;
    } while (snake.some(seg => seg.x === pos.x && seg.y === pos.y));
    return pos;
}
function snakeGameOver() {
    snakeDead = true;
    snakeGameStarted = false;
    clearInterval(snakeInterval);
    drawSnakeGame();
    const ctx = document.getElementById('snake-canvas').getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px VT323, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', 160, 160);
    ctx.font = '16px VT323, monospace';
    ctx.fillText('Press R to restart', 160, 190);
    // Only show the final message after dying, and only if high score is at least 20
    const startBtn = document.querySelector('.snake-start-btn');
    if (startBtn) startBtn.style.display = '';
    if (snakeHighScore >= 20) {
        setTimeout(() => {
            document.getElementById('snake-overlay').style.display = 'none';
            showFinalMessage();
        }, 800);
    }
}
function updateSnakeScore() {
    document.getElementById('snake-score').textContent = snakeScore;
    document.getElementById('snake-highscore').textContent = snakeHighScore;
    // Lock/unlock final message button
    const finalBtn = document.getElementById('final-message-btn');
    if (finalBtn) {
        if (snakeHighScore >= 20) {
            finalBtn.disabled = false;
            finalBtn.textContent = 'Final Message 💕';
            finalBtn.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
            finalBtn.style.animation = 'titleGlow 2s ease-in-out infinite alternate';
        } else {
            finalBtn.disabled = true;
            finalBtn.textContent = 'Final Message 🔒';
            finalBtn.style.background = '';
            finalBtn.style.animation = '';
        }
    }
}
document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('snake-overlay');
    if (!overlay || overlay.style.display === 'none') return;
    if (snakeDead && (e.key === 'r' || e.key === 'R')) {
        // Always restart the game immediately
        snakeGameStarted = false;
        snakeDead = false;
        startSnakeGame();
        return;
    }
    if (!snakeGameStarted && !snakeDead && (e.key === 's' || e.key === 'S')) {
        startSnakeGame();
        return;
    }
    if (!snakeGameStarted) return;
    if (e.key === 'ArrowUp' && snakeDir.y !== 1) {
        snakeDir = {x: 0, y: -1};
    } else if (e.key === 'ArrowDown' && snakeDir.y !== -1) {
        snakeDir = {x: 0, y: 1};
    } else if (e.key === 'ArrowLeft' && snakeDir.x !== 1) {
        snakeDir = {x: -1, y: 0};
    } else if (e.key === 'ArrowRight' && snakeDir.x !== -1) {
        snakeDir = {x: 1, y: 0};
    }
});
// --- End Snake Game Overlay Logic --- 