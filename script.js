const images = [
    "images/img1.jpg","images/img2.jpg","images/img3.jpg","images/img4.jpg",
    "images/img5.jpg","images/img6.jpg","images/img7.jpg","images/img8.jpg",
    "images/img9.jpg","images/img10.jpg","images/img11.jpg","images/img12.jpg",
    "images/img13.jpg","images/img14.jpg","images/img15.jpg","images/img16.jpg",
    "images/img17.jpg","images/img18.jpg"
];

let cards = [...images, ...images]
    .map((img, i) => ({ id: i, img, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);

const heart = document.getElementById("heart");
let flipped = [];

const heartLayout = [
    { row: 0, cols: [2, 3, 5, 6] },
    { row: 1, cols: [1, 2, 3, 4, 5, 6, 7] },
    { row: 2, cols: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
    { row: 3, cols: [1, 2, 3, 4, 5, 6, 7] },
    { row: 4, cols: [2, 3, 4, 5, 6] },
    { row: 5, cols: [3, 4, 5] },
    { row: 6, cols: [4] }
];

function renderCards() {
    heart.innerHTML = "";
    const spacing = 95; // 90px + 5px gap
    let cardIdx = 0;

    heartLayout.forEach(rowInfo => {
        rowInfo.cols.forEach(col => {
            const card = cards[cardIdx];
            const div = document.createElement("div");
            div.className = "card";
            div.dataset.index = cardIdx;
            div.style.left = `${col * spacing}px`;
            div.style.top = `${rowInfo.row * spacing}px`;

            if (card.flipped) div.classList.add("flipped");
            if (card.matched) div.classList.add("matched");

            div.innerHTML = `
                <div class="back"></div>
                <div class="front"><img src="${card.img}" /></div>
            `;
            heart.appendChild(div);
            cardIdx++;
        });
    });
}

heart.addEventListener("click", (e) => {
    const cardDiv = e.target.closest(".card");
    if (!cardDiv || flipped.length === 2) return;

    const idx = +cardDiv.dataset.index;
    if (cards[idx].flipped || cards[idx].matched) return;

    // Flip action
    cards[idx].flipped = true;
    flipped.push(idx);
    
    // Instead of calling renderCards(), just flip the DIV
    cardDiv.classList.add("flipped"); 

    if (flipped.length === 2) {
        const [a, b] = flipped;
        const elA = document.querySelector(`[data-index="${a}"]`);
        const elB = document.querySelector(`[data-index="${b}"]`);

        if (cards[a].img === cards[b].img) {
            cards[a].matched = cards[b].matched = true;
            elA.classList.add("matched-glow");
            elB.classList.add("matched-glow");
            flipped = [];
            checkAllMatched();
        } else {
            elA.classList.add("wrong-glow");
            elB.classList.add("wrong-glow");
            setTimeout(() => {
                cards[a].flipped = cards[b].flipped = false;
                elA.classList.remove("flipped", "wrong-glow"); // Remove flip class
                elB.classList.remove("flipped", "wrong-glow"); // Remove flip class
                flipped = [];
                // After unflipping, check in case last pair was just matched earlier
                checkAllMatched();
            }, 1500);
        }
    }
});

function checkAllMatched() {
    if (cards.every(c => c.matched)) {
        showContinueButton();
    }
}

function showContinueButton() {
    if (document.getElementById('continueBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'continueBtn';
    btn.textContent = 'Continue';
    btn.style.position = 'absolute';
    btn.style.left = '50%';
    btn.style.transform = 'translateX(-50%)';
    btn.style.bottom = '24px';
    btn.style.padding = '12px 24px';
    btn.style.fontSize = '18px';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = 999;
    btn.style.borderRadius = '8px';
    btn.style.border = 'none';
    btn.style.background = '#ff6b81';
    btn.style.color = '#fff';

    btn.addEventListener('click', () => {
        window.location.href = 'index3.html';
    });

    // Append to the main game area if present, otherwise body
    const gameArea = document.querySelector('.game-area') || document.body;
    gameArea.appendChild(btn);
}

renderCards();

// Console helper: call `unlockMatches('SECRET')` to auto-match all pairs and show Continue.
// Example: unlockMatches('LOVE2026')
window.unlockMatches = function(code) {
    const SECRET = 'LOVE2026';
    if (code !== SECRET) {
        console.warn('unlockMatches: invalid code');
        return false;
    }
    // Mark all cards as flipped+matched
    cards.forEach(c => { c.flipped = true; c.matched = true; });
    // Re-render and show continue
    renderCards();
    checkAllMatched();
    console.log('All pairs unlocked.');
    return true;
};