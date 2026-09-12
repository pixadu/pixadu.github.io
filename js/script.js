// ======================================================
// LIGHTWEIGHT HERO SLIDER
// ======================================================

const featuredGames = [
    {title:"Minecraft", heading:"Build Explore Survive", description:"Build, explore and survive in an endless block world.", image:"images/minecraft.png", page:"minecraft.html"},
    {title:"GTA Vice City", heading:"Return To Vice City", description:"Experience the legendary open-world crime adventure.", image:"images/gta vice city.png", page:"gta.html"},
    {title:"Angry Birds", heading:"Destroy Pig Fortresses", description:"Launch birds and solve fun physics puzzles.", image:"images/angrybirdshero.png", page:"angrybirds.html"},
    {title:"Chess", heading:"Challenge Your Mind", description:"Play the world's most iconic strategy game.", image:"images/chess.jpg", page:"chess.html"},
    {title:"2048", heading:"Can You Reach 2048?", description:"Slide the tiles and beat your highest score.", image:"images/2048.jpg", page:"2048.html"},
    {title:"Subway Surfers", heading:"Escape the Inspector", description:"Run, dodge trains, collect coins and escape the inspector.", image:"images/subway-surfers.jpg", page:"subway.html"},
    {title:"Tekken 3", heading:"Enter The Fight", description:"Classic arcade fighting action, right in your browser.", image:"images/tekken3.jpg", page:"tekken3.html"}
];

const hero = document.querySelector(".hero-3d");
const heroImage = document.getElementById("heroSimpleImage");
const heroLabel = document.getElementById("heroSimpleLabel");
const title = document.getElementById("heroTitle");
const desc = document.getElementById("heroDescription");
const play = document.getElementById("heroPlayBtn");
const prev = document.getElementById("prevHero");
const next = document.getElementById("nextHero");
const dots = document.getElementById("heroDots");

let currentGame = 0;
let autoTimer = null;
let heroChanging = false;

function mod(n, m) {
    return ((n % m) + m) % m;
}

function renderHero(animate = false) {
    const game = featuredGames[currentGame];

    if (animate && heroImage && !heroChanging) {
        heroChanging = true;
        heroImage.classList.add("hero-simple-changing");

        setTimeout(() => {
            heroImage.src = game.image;
            heroImage.alt = game.title;
            heroImage.onload = () => {
                heroImage.classList.remove("hero-simple-changing");
                heroChanging = false;
            };
            // Prevent a cached-image edge case from leaving the image faded.
            setTimeout(() => {
                heroImage.classList.remove("hero-simple-changing");
                heroChanging = false;
            }, 400);
        }, 180);
    } else if (heroImage) {
        heroImage.src = game.image;
        heroImage.alt = game.title;
    }

    if (heroLabel) heroLabel.textContent = game.title;
    if (title) title.textContent = game.heading;
    if (desc) desc.textContent = game.description;
    if (play) play.href = game.page;

    if (dots) {
        dots.querySelectorAll(".hero-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === currentGame);
        });
    }
}

if (dots) {
    featuredGames.forEach((game, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "hero-dot";
        dot.setAttribute("aria-label", `Show ${game.title}`);
        dot.addEventListener("click", () => {
            currentGame = i;
            renderHero(true);
            resetAuto();
        });
        dots.appendChild(dot);
    });
}

function nextSlide() {
    currentGame = mod(currentGame + 1, featuredGames.length);
    renderHero(true);
}

function previousSlide() {
    currentGame = mod(currentGame - 1, featuredGames.length);
    renderHero(true);
}

function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
        nextSlide();
    }, 6500);
}

prev?.addEventListener("click", () => {
    previousSlide();
    resetAuto();
});

next?.addEventListener("click", () => {
    nextSlide();
    resetAuto();
});

hero?.addEventListener("mouseenter", () => clearInterval(autoTimer));
hero?.addEventListener("mouseleave", resetAuto);

renderHero(false);
resetAuto();

// ======================================================
// CURSOR GLOW
// ======================================================

const glow = document.querySelector(".cursor-glow");

if (glow) {
    let glowX = 0, glowY = 0, glowFrame = 0;
    document.addEventListener("mousemove", (e) => {
        glowX = e.clientX;
        glowY = e.clientY;
        if (glowFrame) return;
        glowFrame = requestAnimationFrame(() => {
            glow.style.left = glowX + "px";
            glow.style.top = glowY + "px";
            glowFrame = 0;
        });
    }, { passive: true });
}


// ======================================================
// SCROLL REVEAL
// ======================================================

const reveals = document.querySelectorAll(".reveal");

const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -120px 0px", threshold: 0.01 })
    : null;

if (revealObserver) {
    reveals.forEach(section => revealObserver.observe(section));
}

function revealSections() {
    // Fallback for older browsers, and for the initial loader pass.
    if (revealObserver) return;
    const windowHeight = window.innerHeight;
    reveals.forEach(section => {
        if (section.getBoundingClientRect().top < windowHeight - 120) {
            section.classList.add("active");
        }
    });
}


// ======================================================
// LIGHTWEIGHT LOADER
// Never wait for game assets or JavaScript features.
// ======================================================

const loader = document.getElementById("loader");
const loadingText = document.getElementById("loading-text");
const progress = document.querySelector("#loader .progress");

let loaderDone = false;

function setLoaderProgress(value) {
    if (progress) {
        progress.style.width = Math.min(100, Math.max(0, value)) + "%";
    }
}

function hideLoader() {
    if (loaderDone) return;
    loaderDone = true;

    setLoaderProgress(100);

    if (loader) {
        loader.classList.add("loader-hide");
        // Remove it after the fade so it cannot block clicks/rendering.
        setTimeout(() => {
            loader.style.display = "none";
        }, 450);
    }

    try {
        sessionStorage.setItem("pixelplay_loader", "true");
    } catch (e) {}
}

function finishLoader() {
    if (loadingText) loadingText.textContent = "Ready!";
    setLoaderProgress(100);
    setTimeout(hideLoader, 120);
}

// Make the page visible immediately; the loader is only cosmetic.
try {
    revealSections();
} catch (e) {}

setLoaderProgress(20);

if (loadingText) loadingText.textContent = "Loading Pixadu...";

setTimeout(() => {
    if (loaderDone) return;
    setLoaderProgress(55);
    if (loadingText) loadingText.textContent = "Preparing Games...";
}, 250);

setTimeout(() => {
    if (loaderDone) return;
    setLoaderProgress(85);
    if (loadingText) loadingText.textContent = "Almost Ready...";
}, 500);

// Normal path.
window.addEventListener("load", finishLoader, { once: true });

// Hard safety timeout: loader disappears even if another resource hangs.
setTimeout(finishLoader, 1800);

