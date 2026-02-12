const welcomeMessage = document.querySelector('.welcome-message');
const startButton = document.querySelector('.start-button');
const giftContainer = document.querySelector('.gift-container');
const giftBox = document.querySelector('.gift-box');
const gallery = document.querySelector('.gallery');
const floatingHeartsContainer = document.querySelector('.floating-hearts');
const musicToggle = document.querySelector('.music-toggle');
let isOpen = false;
let isPlaying = false;

// Create audio element
const bgMusic = new Audio('assets/audio/background-music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.1;

// Event listener for start button
startButton.addEventListener('click', () => {
    welcomeMessage.classList.add('hide');
    setTimeout(() => {
        giftContainer.classList.add('show');
        createHeartBurst();
    }, 500);
});

// Event listener for gift box
giftBox.addEventListener('click', () => {
    if (!isOpen) {
        giftBox.classList.add('open');
        setTimeout(() => {
            gallery.classList.add('show');
            createHeartBurst();
            playConfetti();
        }, 1000);
        isOpen = true;
    }
});

// Music toggle
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    } else {
        bgMusic.play();
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

// function to create heart
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    
    // Random position
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '100vh';
    
    // Random size
    const size = Math.random() * 15 + 10;
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';
    
    // Random animation duration
    const duration = Math.random() * 3 + 2;
    heart.style.animation = `
        heartBeat ${duration}s infinite,
        float ${duration * 2}s linear
    `;
    
    // Random rotation
    heart.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    floatingHeartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, duration * 2000);
}

// function for burst effect
function createHeartBurst() {
    for(let i = 0; i < 30; i++) {
        setTimeout(createHeart, i * 100);
    }
}

// Create floating hearts periodicly
setInterval(() => {
    if (Math.random() > 0.7) {
        createHeart();
    }
}, 500);

// Fungsi untuk efek confetti
function playConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#ffffff', '#ff4081'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.opacity = Math.random();
        confetti.style.transition = 'all 1s ease';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.style.top = '100vh';
            confetti.style.transform = `rotate(${Math.random() * 360 + 720}deg)`;
        }, 50);
        
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Animasi untuk floating
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: rotate(45deg) translateY(0) translateX(0);
            opacity: 1;
        }
        100% {
            transform: rotate(45deg) translateY(-100vh) translateX(${Math.random() * 200 - 100}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Preload images
const images = document.querySelectorAll('img');
images.forEach(img => {
    const temp = new Image();
    temp.src = img.src;
});

// Add touch events for mobile
let touchStartY;
gallery.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

gallery.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;
    
    if (Math.abs(diff) > 5) {
        e.preventDefault();
        gallery.scrollTop += diff;
        touchStartY = touchY;
    }
});

// Add gallery item hover effect
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        createHeartBurst();
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Add resize handler
window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        gallery.style.height = '70vh';
    } else {
        gallery.style.height = '80vh';
    }
});


const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.querySelector('.modal-title');
const modalDescription = document.querySelector('.modal-description');
const modalQuote = document.querySelector('.modal-quote');
const closeModal = document.querySelector('.close-modal');

// Image content data
// const imageContent = {
//     'romantic-moment-1': {
//         title: 'Our First Date',
//         description: 'The moment our hearts first danced together, creating memories that would last a lifetime.',
//         quote: '"Every love story is beautiful, but ours is my favorite."'
//     },
//     'romantic-moment-2': {
//         title: 'Beautiful Sunset Together',
//         description: 'Watching the sun paint the sky in shades of love, while our hearts grew closer.',
//         quote: '"The best thing to hold onto in life is each other."'
//     },
//     'romantic-moment-3': {
//         title: 'Perfect Evening',
//         description: 'Under the moonlight, every moment with you becomes magical and unforgettable.',
//         quote: '"In your arms is where I belong."'
//     },
//     'romantic-moment-4': {
//         title: 'Sweet Memories',
//         description: 'Each smile, each laugh, each tender moment builds our beautiful story together.',
//         quote: '"You are my today and all of my tomorrows."'
//     },
//     'romantic-moment-5': {
//         title: 'Sweet Memories',
//         description: 'Each smile, each laugh, each tender moment builds our beautiful story together.',
//         quote: '"You are my today and all of my tomorrows."'
//     },
//     'romantic-moment-6': {
//         title: 'Sweet Memories',
//         description: 'Each smile, each laugh, each tender moment builds our beautiful story together.',
//         quote: '"You are my today and all of my tomorrows."'
//     },

// };

// Update gallery item click listeners
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        const imageId = `romantic-moment-${index + 1}`;
        const content = imageContent[imageId];
        
        modalImage.src = item.querySelector('img').src;
        modalImage.alt = item.querySelector('img').alt;
        modalTitle.textContent = content.title;
        modalDescription.textContent = content.description;
        modalQuote.textContent = content.quote;
        
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        createHeartBurst();
    });
});

// Close modal events
closeModal.addEventListener('click', closeModalFunction);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFunction();
    }
});

function closeModalFunction() {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Close modal with escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModalFunction();
    }
});