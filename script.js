// ==========================================================================
// Block 1 of 12: Strict Mode, Early Utilities, Constants, State Variables, DOM Refs
// ==========================================================================
"use strict"; // Enforce stricter parsing and error handling
console.log("Executing Script: Initial Setup...");

// --- Early Utility Function (Define before potential use in HTML onerror) ---
function imageError(element, fallbackText = '?') {
    console.warn("Failed to load image:", element?.src);
    if (!element || !element.parentNode) return; // Exit if element or parent is missing
    const fallback = document.createElement('span');
    fallback.className = (element.className || '') + ' img-fallback'; // Use CSS class for styling
    fallback.style.width = element.offsetWidth > 0 ? `${element.offsetWidth}px` : '40px'; // Use original size if possible
    fallback.style.height = element.offsetHeight > 0 ? `${element.offsetHeight}px` : '40px';
    fallback.textContent = fallbackText;
    try {
        element.replaceWith(fallback); // Replace the broken image
    } catch (e) {
        console.error("Could not replace image element:", e);
        // Fallback scenario if replaceWith fails
        element.style.display = 'none'; // Hide the broken image
        if (element.parentNode) { // Check parent again just in case
             element.parentNode.insertBefore(fallback, element); // Insert fallback before hidden image
        }
    }
}


// --- Game Constants ---
console.log("Defining Constants...");
const TICK_INTERVAL_MS = 1000;
const FLASH_DURATION_MS = 400;
const STUDIO_FADE_DURATION_MS = 500;
const STUDIO_DISPLAY_DURATION_MS = 2500;
const INTRO_FADE_DURATION_MS = 500;
const INTRO_TITLE_DELAY_MS = 500;
const INTRO_PROMPT_DELAY_MS = 1200;
const CLICK_ANIMATION_DURATION_MS = 700;
const ACHIEVEMENT_NOTIFY_DURATION_MS = 4000;
const MESSAGE_DURATION_MS = 2000;
const ON_FIRE_DURATION_MS = 15000;
const ON_FIRE_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const METEOR_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const METEOR_FALL_DURATION_S = 15;
const METEOR_PARTICLE_INTERVAL_MS = 80;
const METEOR_PARTICLE_DURATION_MS = 750;
const INTRO_POTATO_INTERVAL_MS = 50;
const INTRO_POTATO_DENSITY = 10;
const INTRO_POTATO_LIMIT = 150;
const BASE_PRESTIGE_REQUIREMENT = 10_000_000_000; // 10 Billion Potatoes
const PRESTIGE_REQUIREMENT_MULTIPLIER = 2;
const PRESTIGE_BEYOND_FACTOR = 100;
const ON_FIRE_CLICK_THRESHOLD = 500;
const ON_FIRE_TIME_WINDOW_MS = 60000; // 1 minute
const TYPING_SPEED_MS = 45; // Milliseconds per character (slightly faster)
const NARRATOR_SHAKE_INTERVAL_MS = 70; // How often to change shake position
const NARRATOR_SHAKE_INTENSITY_PX = 2; // Max pixels to shift
const SAVE_KEY = 'potatoClickerSave_v7.3'; // Version includes tutorial flag

// --- Game State Variables ---
console.log("Initializing State Variables...");
let potatoCount = 0;
let totalPotatoesHarvested = 0;
let potatoesPerClick = 1;
let potatoesPerSecond = 0;
let prestigeLevel = 0;
let prestigeMultiplier = 1;
let currentPrestigeRequirement = BASE_PRESTIGE_REQUIREMENT;
let upgrades = []; // Holds runtime state for upgrades (level)
let achievements = {}; // { id: true } for unlocked
let totalClicks = 0;
let onFireStreakLevel = 0;
let isGameInitialized = false;
let isIntroSequenceActive = true; // Tracks the initial disclaimer/studio/menu phase
let isPrestiging = false;
let isDebugMenuUnlocked = false;
let gameLoopIntervalId = null;
let achievementNotificationTimeout = null;
let messageTimeout = null;
let cursorAnimationId = null;
let lastTimestamp = 0;
let clickTimestamps = [];
let isOnFireActive = false;
let onFireEndTime = 0;
let onFireCooldownEndTime = 0;
let meteorActive = false;
let nextMeteorTime = 0;
let meteorElement = null;
let meteorWrapperElement = null;
let meteorMessageElement = null;
let meteorTimeoutId = null;
let fireParticleInterval = null;
let introPotatoInterval = null;
let tickCounter = 0;
let playerName = "Farmer"; // Default name, will be loaded/prompted
let hasSeenStoryIntro = false; // Flag loaded from save
let isStoryIntroRunning = false; // Tracks if story sequence is active
let wasMusicPlayingBeforeStory = false; // For music pause/resume
let currentStoryStage = 0;
let currentCharIndex = 0;
let typingTimeout = null; // Stores timeout for typing next char
let narratorShakeInterval = null; // Stores interval for shaking icon
let isTutorialRunning = false; // Tracks if tutorial sequence is active
let currentTutorialStep = 0;
let tutorialSeen = false; // Tracks if tutorial has been completed

// --- DOM Elements ---
console.log("Selecting DOM elements...");
const preIntroOverlay = document.getElementById('pre-intro-overlay');
const preIntroButton = document.getElementById('pre-intro-button');
const preIntroFlash = document.getElementById('pre-intro-flash');
const studioIntroOverlay = document.getElementById('studio-intro-overlay');
const studioLogo = document.getElementById('studio-logo');
const introOverlay = document.getElementById('intro-overlay'); // Main menu overlay
const introPotatoContainer = document.getElementById('intro-potato-container');
const introTitleImage = document.getElementById('intro-title-image');
const introPromptText = document.getElementById('intro-prompt-text');
const introMenuButtons = document.getElementById('intro-menu-buttons');
const introStartButton = document.getElementById('intro-start-button');
const introSettingsButton = document.getElementById('intro-settings-button');
const introCreditsButton = document.getElementById('intro-credits-button');
const introUpdatesButton = document.getElementById('intro-updates-button');
const outerContainer = document.querySelector('.outer-container');
const backgroundMusic = document.getElementById('background-music');
const statsDisplay = document.getElementById('stats-display');
const prestigeStatsLine = document.getElementById('prestige-stats-line');
const prestigeLevelDisplay = document.getElementById('prestige-level');
const prestigeMultiplierDisplay = document.getElementById('prestige-multiplier');
const potatoCountDisplay = document.getElementById('potato-count');
const totalPotatoesDisplay = document.getElementById('total-potatoes');
const ppsDisplay = document.getElementById('pps');
const clickPowerDisplay = document.getElementById('click-power-stat');
const clickArea = document.getElementById('click-area');
const potatoContainer = document.getElementById('potato-container');
const cursorOrbitContainer = document.getElementById('cursor-orbit-container');
const potatoButton = document.getElementById('potato-button');
const mainPotatoImg = document.getElementById('main-potato-img');
const popularityCard = document.getElementById('popularity-card');
const popularityLevelDisplay = document.getElementById('popularity-level');
const popularityChatBubble = document.getElementById('popularity-chat-bubble');
const farmerIcon = document.getElementById('farmer-icon');
const messageBox = document.getElementById('message-box');
const clickUpgradesContainer = document.getElementById('click-upgrades-container');
const passiveUpgradesContainer = document.getElementById('passive-upgrades-container');
const achievementsGrid = document.getElementById('achievements-grid');
const prestigeReadinessText = document.getElementById('prestige-readiness-text');
const prestigeIconLarge = document.getElementById('prestige-icon-large');
const prestigeRequirementDisplay = document.getElementById('prestige-requirement');
const prestigeButton = document.getElementById('prestige-button');
const nextPrestigeLevelDisplay = document.getElementById('next-prestige-level');
const currentPrestigeBonusDisplay = document.getElementById('current-prestige-bonus');
const saveCodeArea = document.getElementById('save-code-area');
const loadCodeArea = document.getElementById('load-code-area');
const copySaveButton = document.getElementById('copy-save-button');
const achievementNotification = document.getElementById('achievement-notification');
const achNotifyIcon = document.getElementById('ach-notify-icon');
const achNotifyName = document.getElementById('ach-notify-name');
const debugMenuModal = document.getElementById('debug-menu-modal');
const debugClickInput = document.getElementById('debug-click-modifier');
const debugIncomeInput = document.getElementById('debug-income-modifier');
const debugPrestigeInput = document.getElementById('debug-prestige-level');
const debugPotatoInput = document.getElementById('debug-potato-count');
const prestigeAnimationOverlay = document.getElementById('prestige-animation-overlay');
const prestigeFlashOverlay = document.getElementById('prestige-flash-overlay');
const meteorMessageContainer = document.getElementById('meteor-message-container');
const meteorContainer = document.getElementById('meteor-container');
const settingsModal = document.getElementById('settings-modal');
const creditsModal = document.getElementById('credits-modal');
const updatesModal = document.getElementById('updates-modal');
const musicToggleButton = document.getElementById('music-toggle');
const nameInputOverlay = document.getElementById('name-input-overlay');
const playerNameInput = document.getElementById('player-name-input');
const submitNameButton = document.getElementById('submit-name-button');
const nameErrorMessage = document.querySelector('#name-input-overlay .name-error-message');
const storyIntroOverlay = document.getElementById('story-intro-overlay');
const storyBackground = document.getElementById('story-background');
const narratorIcon = document.getElementById('narrator-icon');
const narratorTextElement = document.getElementById('narrator-text');
const continueButton = document.getElementById('continue-button'); // Used for story AND tutorial
const replayStoryButton = document.getElementById('replay-story-button');
const narratorSound1 = document.getElementById('narrator-sound-1');
const narratorSound2 = document.getElementById('narrator-sound-2');
const narratorSound3 = document.getElementById('narrator-sound-3');
const narratorSounds = [narratorSound1, narratorSound2, narratorSound3].filter(el => el !== null);

console.log("DOM Elements Selected.");
// End of Block 1
// ==========================================================================
// Block 2 of 12: URLs & Data Definitions (Upgrades, Achievements, etc.)
// ==========================================================================
console.log("Defining URLs & Data Definitions...");
// --- URLs ---
const ORIGINAL_POTATO_URL = "https://media-hosting.imagekit.io/ba92ede10c404cff/unnamed-removebg-preview.png?Expires=1840549126&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=2Ey6QRBfNcH0iREjbWsx7EX4mZNUjkqElOhPYCfTf542XA8t9JYmQVnyXLqosqYeJlbwV0H1GaMUhzQEYjNi-8GJQp02hxsGfT~qE~TQ-mfVZFoN~QbRxu6Io-aRTyGFB-NbCXLkOiu5U-vHv9~rlUha9~x0fo7N65IxAmpVZ6TAou~-Bv~lS9VPaLeYPvRhTG5O1cgwsqC9ABY0ExkgFDCjRz7C5KzBR7sJp9s8lEg9ueXLisoajSfCkdsY1jzXHXqeiTzurlDgvbKB3d9AM1N8aVyYIkAQNLDLUzLjljDsFAWUQNb100psdCdToa7LpiTpnMOcCEFPulrlx24XUQ__";
const FIRE_POTATO_URL = "https://videos.openai.com/vg-assets/assets%2Ftask_01jt4syz1zf1tt23fb8h281482%2F1746065712_img_0.webp?st=2025-05-01T00%3A48%3A57Z&se=2025-05-07T01%3A48%3A57Z&sks=b&skt=2025-05-01T00%3A48%3A57Z&ske=2025-05-07T01%3A48%3A57Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=g0BEM2kbWTwqEvt1mmA9jdaAewO3ZD5%2FAiWytXPd4J8%3D&az=oaivgprodscus";
const FARMER_ICON_URL = "https://media-hosting.imagekit.io/8776979a80514431/Screenshot_2025-04-29_10.51.32_AM-removebg-preview%20(1).png?Expires=1840547940&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=oA8X3nkQWeN~J~InrQdm0mFvyeoUZrguY0qoeq9redNbhy~ASujVS~hKrCDOVhfBWIYuivoRyk4fcKA0KxdhBtxgZrsbMLsevyoEWjLQ0JTcSz0a3WSPCnVn0etGInnT5nc~5GaQtIYJ~CMoeJu07mRtZYtjq9YjByr7OBwprQPAdN8hiMrjr0p5mSs1KLYJ8IfEQV6fRrC5w2cpdT0l2CCg-P6c05n7EIJOR9UVNq5Jd1l8OX6jGwEjVXBvpfkKotvCIT1QsGMZ4M~gDaNRUYgDAtYeZGIQnMp2~Jru7knU~5q5BiadlfUoZe2FVtyId9tXqG7v6IHBT8StiYhUDQ__";
const PRO_FARMER_ICON_URL = "https://videos.openai.com/vg-assets/assets%2Ftask_01jt3a43kjfa5vxrvmbe5r54vw%2F1746015549_img_0.webp?st=2025-05-01T00%3A47%3A48Z&se=2025-05-07T01%3A47%3A48Z&sks=b&skt=2025-05-01T00%3A47%3A48Z&ske=2025-05-07T01%3A47%3A48Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=5ID8btmRYFDODdbSCwVD7bzxFl%2FARvv2TYnBkFD11xc%3D&az=oaivgprodscus";
const POTATOHAX_ICON_URL = "https://media-hosting.imagekit.io/d073b83b1f334fb4/1745986534_img_0.webp?Expires=1840594557&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=NsgBNhoJfvpqFmAsKE6ycQ5uEjhX~Kr00mkSlVHXoNgXp5OKdkdK7mVYBPZtk3VV9wA2gjHsTjKZDFNFT1HyX9qOi0lmucvLUlx5WNPoU-SFktBvO3umse6tibkgCbMfeFCs9lsKmupTGuI9FrGYgJme9ZhFXid7vYCs2RRJdjGImjKoyJ05s0GM7G03m1yhqfwtMSOrWGooCGfLNf6foUCT6fly586zUBRi3fX54k363j2CbQ0Rj-NY7B5MDLj2D37x8jxNO9M5jVmo8mM0XoNvDOV3v9o2TNm1BEObRyETcKHeYduQ1jkIkVYm6PiE5~nYtdXisjItKOejSzwSSA__";
const METEOR_IMAGE_URL = 'https://media-hosting.imagekit.io/5cc52edeef5143c3/Gemini_Generated_Image_a4f3hma4f3hma4f3-removebg-preview.png?Expires=1840630471&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=zzrwg827Twd1XhJaCfiPQo4ynTE35JTyOLO3NUqS3qFD2pWHpBtln6377TRKFijHH8BIYdh8IGvpwtviLkmArcyR7UvWNga6FAu9MJ38kkDYB3h0gxqAi4stezqm3ix7wDoUGeJw5wPhoYKFdULAt2UcPGzpc6CjyuJKkla1ACWPraMNJN5TUsexbj0ptrg0pDiPGpQc2KcdcNGv-5IJ4Zstbu-Q9JfmtaIoIgzjtMq6Jfmbsy1swAD7RwohN4IlXXidsBbYOUVTq4IZpFSpD4jkNS-2VWzKvR~Buy4gN2PHtzh96GeXAq~EHkuMQSiR6MwUNxMLf~0nBJlYG-huqA__';
const FIRE_TRAIL_IMAGE_URL = 'https://media-hosting.imagekit.io/a81b598c3d7a4e53/depositphotos_483114354-stock-illustration-pixel-fire-gui-vector-illustration-removebg-preview.png?Expires=1840668081&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=N1nZlIhKCwSvVZglpaTFRk81WVfEHuXTrBu6NnOrAtwN4HJ0OWjhC84WT0onKffIiINQGXOmwvSW0nqERAAIUr6DfUlFKTXzxDuwpGn2vbqD9NT9RjCbkns4OHtMVvdzPZFlGvsKJAhBlDSpBkydjSSp7ftVlddBqTtn9lsuQNVbloeoYdiAyw~hpUP2HCMeXAE7wJNiphMFHDkOgv8Qdau~Rs3Ubp41IgKLobAoPYyfzlX2-lwubo~qV2plMOycXrHUbcvefW2qG-Y5WyYn7IjhNH8yvtaSQQrd3oFPVaIG7b4l~p9TyPWqkop-tj8m0~9zQ9xP8NQKN~iuRnKnNg__';
const INTRO_POTATO_URL = "https://media-hosting.imagekit.io/5b5fe62b70b7452f/1745990189_img_0.webp?Expires=1840598214&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=YWM~4j83tFDepXce9MGPC5Y4MBBISSHTuGULjAD9hgj-87pMffy8aESDIjiHJzgAUTSKimTwf9cMaX9LLGgk49BDL~vrTrCLIQmNU9ZRz6PmhWmYTW8mP48iZmX0Wyqa5jC8CspksU3Lzwg79daOnA80pRyqAq59EqVWw8b0FXAQVlC5g6V4ZRSxPd-e9KvihMiPwI3auBghDvBaG8KR9cnIC-3xDrU4m08hSPWTA0EHMcC3lRru7QyGxzm4vSUip--ywhPUyLdstH3mzrslSyoutp4nfFmEgBrzAVK9ufBkt80EZ7gjiyOREc9igHRzQwO2yL56PZlXrBkH8WsjGw__";
const CURSOR_ICON_URL = "https://media-hosting.imagekit.io/1a37049a0cf84e3c/Gemini_Generated_Image_3ycz8h3ycz8h3ycz-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Ee5R0NP6RHluWlNNIQLOihRCiPXDGQy59lK~~UAqmIXLD1OGvBJZRZkVabtwVbwmNPQNDPFDSuvccFi2RtcIueRzROJLgjD2ITc4zPyAQDBzkDlEYcRypEP6zHHWYEyW4zolm-5sy2Miz1UYMXqN5nGibJu7AZaZugtwUrbjlIYbb0AX14HJ1KcVQE5eA6kFsQb4RD-1FFQ4-XgeUopZIgfPSrmqu04YATEypaBXdGHcuW1G3uYQKducB0XPkADCiHK7lRcUVPZT6ihVDrHsxPEe0zkXCZ213NhFxewE7Q1gGIhOkoouuXc0WuP1Z-Rv-0wzEDoS6jAd~ktuCXSh3g__";
const PRESTIGE_ICON_URL = "https://media-hosting.imagekit.io/a896b15a2bce45a2/1745985600_img_0.png?Expires=1840594557&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=klfqtUfzu1KV413HnOppkIbmgDGCq~zbvEb4jPP-MO1kDhuEJkugz~cDb5X7tbiG71GpD6MJkXysqiP2p4ysisYEDqL24gX0hRHpUpdvuup6KwkkCCfF9yzlvHUDOHUdnoxi5zui7s9OGpmw2Ga~hI3XVOi0-lQXdD6Q0s0DmwZOmS8xL9T97EMxN3UAlD6PPINb4uCQwJh28OPKWlKfq8~AMGRnlGEk9ATkounfM0nRuL626RnoJxkaqok-kRfv1Se-7MxxkVyy2bV9LQaoenAe757tqwg9FfawuOqH1Reh7bopusDl2yWwKfehm7xMDzoseFZplDOTNNihacDf-A__";
const GLOVES_ICON_URL = 'https://media-hosting.imagekit.io/14f1f14040c1413d/Gemini_Generated_Image_26saam26saam26sa-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=MVTI6ZaGqXZCVfksOqeDNZaPXp56EdIefC4takCaE2F1R2LqBW1U8EF5-x~egYrmWsLZm-gYPq4paQwS~TvTK~UxPEesncX5ibFnpN6YwosFS2GamGjljNzZ5cIWUH-YDnYsWyURzGx7GD13uyVRzYt~FcyJx6hytKGBcRQf99aGzPaDl8gQ0hGXys8-MQDD3PXWFfbFBOCXwmcv6IDZ8wOeD8C-3UHcrCjZMJGP7OKL37uZdo9C373FJYcBnq6qACR963YbDB4qPCW6IlyCmCQ8I7iZcjgbUzDMBTAFSbzmq81Mkjw2OyD~nvDtAE3N3-igbcnOJSMd21T~oqjM2Q__';
const SHOVEL_ICON_URL = 'https://media-hosting.imagekit.io/4ad520d9de234647/Gemini_Generated_Image_o1dpmro1dpmro1dp-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=iNR04UQbkuW~pquwlLyB1YvvoH6~Fd9s2AHgfWQW9AZG3UMHDkohXyQPWGD~O1kOem9UTRyDC0GvW~btsUWPWHV~49rzZ5y6h9TVemzHC-n29SALFycIMneLxnFQeEqJ~AzL7OELJk~I1MTsNBnrKvhgIWxxOBFPcvQIQmv21ja3E6pS6Vqq7FgYBRx89GWCKgC8NUe2X1wjTe3fy6YTLoPU8tVqOucyIWxd2wxazrS7fVCnRITMesTX4BtxPWvKKlJzqdZSxPHlOEDKjAi2qY5RKPs1zJsCcz9xV2zpaKbhGbhZ3mbq5rLl9F8vPnc~RW-8dJgSzL1H-Mpq5sMFxA__';
const FACTORY_ICON_URL = 'https://media-hosting.imagekit.io/0af60395e1fb4824/Gemini_Generated_Image_ekncpyekncpyeknc-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=HbvaM2Xx5fudR4MQl1ivHyWF51afluWfS~4DIFQ5JC2A1WW1xvoLCiTedbqEN6iKGYclw2rSTCqIPDb7INsHs9SSlhQIXUR6nWayAIJ~NJKI8Nf7f2Hz2ifA9kFITORXbzFBmFYFOu74-bFsppy39LoaAwawjAcOxGmi8JNEoC61bX6hVnU1T8lcF~ENOw4vF7yA~B-V5b~luyz5uHaiQzTzM36aRP11wInyLtGlnw4pYPquuxVJ-BcG1GarAp5SofKGqHmha7L3WZFp~hB52a83Az4ot2cOuCOdqtr4-u3H9-OZVx3KUVBi4X3EV-hhKKudxRSh6Ks~1eED4e8Ejg__';
const PLANET_ICON_URL = 'https://media-hosting.imagekit.io/1f7caf6be29340f5/Gemini_Generated_Image_4ogqwf4ogqwf4ogq-removebg-preview.png?Expires=1840548893&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=iHTYos556Hp8ILnDiAndu2EBHUAuj5QubB-MQZj4hCjcQe1qo3OHHRCzbl-sd4WNMTvb6YEtVmh0mr~jbDdh2Ez4FzxfNo6IrS3TwvfAgKCCU2L3wi-zMMAx4uFO4hQalPKFntUqjyhOdjOn8UXZh-4ceEQUfzvcjLQNeJW0pH9WQoxDPgaIaupycAeb8WJooghepLdbfVYo274HwIfnxrDoJSXWESfHYamuyfQAzT-ZiYfny6AT5SqMCzMYYCEUr0bz6GMucInmPkLETBUqq8GDkFHhDlSlmMAREMsDPec7L48bSJsQZTvtOlOw6Y~A3noF17RkesDeYn3mfJEplg__';
const GALAXY_ICON_URL = 'https://media-hosting.imagekit.io/30679537b55549a0/unnamed__11_-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=nu-rbFFN4VDHBIvafXo6x7SZhdqV4HtIr-HSuhGe8kkUiihBCqxLM46EJufpY-pXiSmpDFH56Og8s0nzB5QO6qAgSP~gmEUPBP6IDWa2gYVfgV4ICHnlUppgZr2GnaXWbR6DoxD9iv8T2pFnmdZlhQAV~ZMwVKSNUAwVaHOzGdaCbOqO9bofIf5qep9hwPEygfLMUTzCwEBemt0R88rAHVYKTECYUMMqS4EkBjcIblx61HQvaCTUdN~isfRu~01bRWiVaI~HVJSUhdv4kl3boiBXQo3KjZb6jVhGICZUnJUKVfPuKRQvMII8EB5tBaw8bMqoAorurO~uqN-y~EJGGA__';
const TROPHY_ICON_URL = 'https://videos.openai.com/vg-assets/assets%2Ftask_01jt2b580fe6atjbbx7kp93c03%2F1745983041_img_0.webp?st=2025-04-30T01%3A47%3A37Z&se=2025-05-06T02%3A47%3A37Z&sks=b&skt=2025-04-30T01%3A47%3A37Z&ske=2025-05-06T02%3A47%3A37Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=aOYE%2B9%2BJELyIg%2BNBx0H4AKJTRn8ykdWVGLUX0jRk7o8%3D&az=oaivgprodscus';
const CLICK_ICON_URL = 'https://videos.openai.com/vg-assets/assets%2Ftask_01jt2bb836fx7s599vj52ndd13%2F1745983236_img_0.webp?st=2025-04-30T01%3A47%3A50Z&se=2025-05-06T02%3A47%3A50Z&sks=b&skt=2025-04-30T01%3A47%3A50Z&ske=2025-05-06T02%3A47%3A50Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=5kEO9u3OhxwU2napa9ajqMdZTREKuA97Q8KeWaN0Sbg%3D&az=oaivgprodscus';
const FERTILIZER_ICON_URL = 'https://media-hosting.imagekit.io/266d1e8167904852/image-removebg-preview%20(2).png?Expires=1840676640&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=TqeI9Vk47kkMX6WTFHvmiUcRdddEYIWgz6rWRI0kOyRo2J-UJ~KxYdQ5tOvK4B5pUbj0mZsKrMKYpiYds5udBGqjkNOmUTj2j3DUG8yMolrEI6rITJwSCFqKm1RdcmyBVWsoEh0xxsuFuFj2lMeHOr22mvy4VQgvZhqCSlnyy5fIa7RClKlvFaTftXIa7Np-VY2B96A94-STNU7yKsG61sxaXbwX-bUZ5OBMjE9S80CsSNB0VAFb63WdumL4Yt1lPGKgpqkvRCd1N3WnVozshzAWmIC0E0YIaxEQEZS6dsfgyn5LapiYxNNUkryllxx25pDujtYOKEpmeEBTEl~SYw__';
const WATERCAN_ICON_URL = 'https://media-hosting.imagekit.io/fd0b543f57814615/image-removebg-preview%20(5).png?Expires=1840677044&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Sv4O0f7HXH2qMBF~lRotpDzCLq4ngGimyj0RUScv3uDCtg1akKbpGWIQzII2U9TulaF3GJWZclCDLmBX0R1utxZPy3xkj94Smz8ROE5r~cRDK6VxLqhSg0YgtBVqi4AldJhegwphfF4pG8v7BN0N3I3sONbNfsxfQUDtXaF1WJseuvZxeLkHHS9OrW0QMBdtk-StsgyDJrkLmh1fXwzIv0kQG7URpzgl3cXwZ0wG4bDGxIsv0dccWlIsf7tld7yXW~nkmLWqcndS3Lgvln1Ie2Oj-3xrfgehqNAqHkawK5plswBxkKMxmw2jglfzXaYClnjJPkX~quG8~doWhwLVAQ__';
const TRACTOR_ICON_URL = 'https://media-hosting.imagekit.io/e4a00c89ccad4311/screenshot_1746014913198.png?Expires=1840622914&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=mN39rtj9Yo3LuiqpIzATKrVbEzTdp~ZtEl9cSPNzMpFoKpaLnmd0vhL8vyYUQ0VfA6J814d48bXVoUpD5EN2v9SLINaisp~kUeyHbwsaIpiTzFvynxZbaosIVhjrIaFj4kRQo~YCNbmb0eVnFDbYkVJ6eccN8wcAGk5wsNF2fb~cFrwwzFECbwVZ7bI~2XkSjIVlKiL2b6QiFwFs6IB6~g7HC24skAYgoIyf89HGhhtVwHNQPblIt7U-6LkBxnW8kh5Ev~om0dsQtLMfuZSOH32AqGjAoH8liDVXIUJzIWW9sTUx-r3Z3Rp7SW7VQIynvFwRuiKghK0ZvpClN8ovXA__';
const FRIES_ICON_URL = 'https://media-hosting.imagekit.io/a26ce4e0a0de4fce/unnamed__13_-removebg-preview.png?Expires=1840630231&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Ptbg78uieL05vmOVFCav7AiWV1wS74IxbzCoQMjO-aUzEc~NWKDl-1Nw2fIi048D7IXJtUXUdihmQyShSRhwcPoBBWDY4yqkFoWYB5f6as62MEF15RVbGYuM9HGtlwZwTjYB-th4knwgR6Qq9wg8114-cktgTTm8CPq-IUH7WPixqw8~5GD~xr368c9idxWO-SNaAgqdoglPhlXux0bQKVFU5X7d~e92YqZi5tvMv~WsKYcxMIpi7zuCfboyDuptB07QB6O1Gl0Cr3t0PX4aglkBFNVyAOIcsbD7t5B500xsGl6UZBAA55XVRVbrMoMVBcrOdNI0R2Fa8l3lYASM8A__';
const GMP_ICON_URL = 'https://media-hosting.imagekit.io/ede721cb1ea347e9/image-removebg-preview%20(3).png?Expires=1840676877&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=t1MAZOs1N2wBEBKbDx4xMPiGYz2DLnlPf-wHC5fD43mJxfs8iBhKenlSDZIMafgS7WuC7uoNo2ZTOjIhHRKrsPBDxbn~aRGmPZKrpq11tUnWSlf1KzamDANBuDmCeHoRE17QgXh473WL6PjSmKeG~teDtHsgrvot14G-vgznazIIZFrPZxlinMGCiI0pjoaIVBLhPc~x44jBcHA7~7nzO4hZaQ0dLTGdpUgrq~~kdzSPHEfkG6rtHrHtA3wQBvKm-bi860rVyxdN3gsAgpI~UaEYvYiyVi3DegAuTDwqQDIOKyrFKa82stuqwQDWMIDB22nlajiEP2YQ3JcklUJIkw__';

// --- Upgrade Definitions ---
const upgradeDefinitions = [
    { id: 'farmhand-gloves', name: 'Gloves', description: '+1 PPC', baseCost: 10, costIncreaseFactor: 1.12, effectType: 'click', effectValue: 1, iconUrl: GLOVES_ICON_URL },
    { id: 'better-seeds', name: 'Seeds', description: '+3 PPC', baseCost: 75, costIncreaseFactor: 1.15, effectType: 'click', effectValue: 3, iconUrl: 'https://media-hosting.imagekit.io/27fd4976da254899/Gemini_Generated_Image_j0wn03j0wn03j0wn-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=fix1CKOhKcY97XdA4ScNqMFSqh2N4vCyTqAQzdf3RpyX1KZmfht5BXq9Z0a4AHRny1hPhfICo85iLY61w6CFgEPQnMwc8R5UeuuL~C0Bne4FCaxwTIN~j8VZkGuACMuyaCDvevZqjnyTcRV4K~C2BWhwQAGztRIBCeb-PTpKsXKj6fvxbmC1DhRqUwqtyTUWYmrhXKWXSVMy3d5NX-1q-cn6VQq8lWG0nMostcqtGrhRjf5iAiJ7XREQVyo6KF3bqlvKUEUjaXxHfwKSNrbsCvrOTyb~1eIFuEDtl58lNDawAqalDzAWVbhCW~-WxY6EqCLcf9rxPEUQAw3D4S7t-g__' },
    { id: 'sturdy-shovel', name: 'Shovel', description: '+10 PPC', baseCost: 500, costIncreaseFactor: 1.18, effectType: 'click', effectValue: 10, iconUrl: SHOVEL_ICON_URL },
    { id: 'fertilizer', name: 'Fertilizer', description: '+25 PPC', baseCost: 2500, costIncreaseFactor: 1.19, effectType: 'click', effectValue: 25, iconUrl: FERTILIZER_ICON_URL },
    { id: 'magic-wateringcan', name: 'Water Can', description: '+50 PPC', baseCost: 12000, costIncreaseFactor: 1.20, effectType: 'click', effectValue: 50, iconUrl: WATERCAN_ICON_URL },
    { id: 'enriched-soil', name: 'Soil', description: '+250 PPC', baseCost: 75000, costIncreaseFactor: 1.22, effectType: 'click', effectValue: 250, iconUrl: 'https://media-hosting.imagekit.io/c4269fd294504d45/Gemini_Generated_Image_e2faqde2faqde2fa-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=tPxXTU9psc2jl1~PGyio8ioYixDgs3lPEqddvPZEXHZNLm7dQaYuVHLZWuQmQW1JCIFQMDIR~88mW5zQkUr9zMOh8-JwP3aASG-LbJTlHoGqG~tYusi65G4rGrsMOgqpp7ZVTihp2TN2JYQrJ4UawT4Uc9dm34XDYFhSOlxWhAI8FwRQiqPl6~62aBts5BNadJrss6QwrMA864V~mSxwNt3d2UbM867ar34bVTNRpLwn0NlDm2lhMxhpL1Fwcf5PvATqa5Dov0u5gKJTRiEDxZnnkDi2mgCv4u2ggxwngfCxmDUkbkMRnpq9TLU0~CdlU2tlpd6an-85qMu7K4f1hg__' },
    { id: 'tractor', name: 'Tractor', description: '+1k PPC', baseCost: 400000, costIncreaseFactor: 1.23, effectType: 'click', effectValue: 1000, iconUrl: TRACTOR_ICON_URL },
    { id: 'potato-fries', name: 'Fries', description: '+5k PPC', baseCost: 2500000, costIncreaseFactor: 1.25, effectType: 'click', effectValue: 5000, iconUrl: FRIES_ICON_URL },
    { id: 'gmp', name: 'GMP', description: '+25k PPC', baseCost: 15000000, costIncreaseFactor: 1.27, effectType: 'click', effectValue: 25000, iconUrl: GMP_ICON_URL },
    { id: 'potato-farmer', name: 'Farmer', description: '+1 PPS', baseCost: 50, costIncreaseFactor: 1.15, effectType: 'passive', effectValue: 1, iconUrl: FARMER_ICON_URL },
    { id: 'potato-farm', name: 'Farm', description: '+5 PPS', baseCost: 300, costIncreaseFactor: 1.18, effectType: 'passive', effectValue: 5, iconUrl: 'https://media-hosting.imagekit.io/c4269fd294504d45/Gemini_Generated_Image_e2faqde2faqde2fa-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=tPxXTU9psc2jl1~PGyio8ioYixDgs3lPEqddvPZEXHZNLm7dQaYuVHLZWuQmQW1JCIFQMDIR~88mW5zQkUr9zMOh8-JwP3aASG-LbJTlHoGqG~tYusi65G4rGrsMOgqpp7ZVTihp2TN2JYQrJ4UawT4Uc9dm34XDYFhSOlxWhAI8FwRQiqPl6~62aBts5BNadJrss6QwrMA864V~mSxwNt3d2UbM867ar34bVTNRpLwn0NlDm2lhMxhpL1Fwcf5PvATqa5Dov0u5gKJTRiEDxZnnkDi2mgCv4u2ggxwngfCxmDUkbkMRnpq9TLU0~CdlU2tlpd6an-85qMu7K4f1hg__' },
    { id: 'potato-factory', name: 'Factory', description: '+25 PPS', baseCost: 2000, costIncreaseFactor: 1.20, effectType: 'passive', effectValue: 25, iconUrl: FACTORY_ICON_URL },
    { id: 'potato-bank', name: 'Bank', description: '+150 PPS', baseCost: 15000, costIncreaseFactor: 1.22, effectType: 'passive', effectValue: 150, iconUrl: 'https://media-hosting.imagekit.io/dce60b9af6604bca/unnamed__12_-removebg-preview%20(1).png?Expires=1840548290&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=dGrjJk51OglRVG9LYY~Yz736SGt8vPS0b8lIf2LNptfZSBWYLo68F-vhiPIkEubxWvHV~3yrw~iRLiMarKi6cC0a2~vSgbPzTPlgmepcn9~GGUe4V00omsTabL6suaVXBdQJnrgw-cP7KrlFHiyKPTtPzJ3SkjOXDEeMyYVUS4RE0kyXWbGWFUQlHL0t~EboNbGXDHvWUk~f9bMjxbT-WgeMyRZ5p44ALJE7aXobnBr42bSdGFI07fTALchgMaDLoPLcixdZBimhOAaa6ziZTbCR2xSrxtEpyNZIV-wQfxEtDkJGzLvAwmjtGI26FOsbt3Cku0Wns-6AsBNg5J7qVQ__' },
    { id: 'potato-country', name: 'Country', description: '+1k PPS', baseCost: 100000, costIncreaseFactor: 1.24, effectType: 'passive', effectValue: 1000, iconUrl: 'https://media-hosting.imagekit.io/d23abd0b651b4110/Gemini_Generated_Image_n08xjyn08xjyn08x-removebg-preview.png?Expires=1840548770&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=mDWjaFn54yOJ-wCEsCxotSjHy-hQBUawrfu3pfmUGR2kgpna5jUt0s3QYulv1NIfxeABI855tP6l3Xb96S-NiRawufECtJu93ACjD0ThnuPjXz2wEH0hEGrqorJS4XRlLL5iobP8w9ikzmiaF8U772NItHK3LiDD0QdsfF5kPpt8aBr2Vi9rR~bxTUbWD2yelY07Qxtlj0Ta7d9B5lasoePsoqw49GQA57RhNVzylKm9A0KA3UcfOQO9azQ-Ps69Sb0kHkkS8BN2crsRbDuyAht7947X0KrSDtwJrfqqI~arU~KSqGJIWl7wEb8uULk4~1PnD8W-uSTrendYdB0ZmQ__' },
    { id: 'potato-planet', name: 'Planet', description: '+7.5k PPS', baseCost: 750000, costIncreaseFactor: 1.26, effectType: 'passive', effectValue: 7500, iconUrl: PLANET_ICON_URL },
    { id: 'potato-solar-system', name: 'System', description: '+50k PPS', baseCost: 5000000, costIncreaseFactor: 1.28, effectType: 'passive', effectValue: 50000, iconUrl: 'https://media-hosting.imagekit.io/67d3c66f027f482d/Gemini_Generated_Image_vpq2pvvpq2pvvpq2-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=lCzViwnJD9I6uu37a-xXdfk1r2WKp0ViDnMWsAf5M299jOpej-QMiZgjXcHM6x~Aw3Xwvu9hB8XGWzwijsCWBXso2o8lgUUaEUW9juhfiYjHPaTVNsMrheYm-23V4QUxG1zk3qVOUKbhZmMGpiuNq31O-UZoMMTn7e~Gpk4YMTWknrKLCFPGGR-XwiDSNnwC20cGui-gRrFu-N1gEyN70kK4uGLijNUhB4iGKhESkq889Rs7R-R4IhQ9gdMfEqgyCydlQNxzJEd4BWosAJpIovwX41B8bJ2TqWtLAl64H1PxdYrawiNrQegs3toTWONbBUOU05u8Apa3~R~HtSJb1A__' },
    { id: 'potato-galaxy', name: 'Galaxy', description: '+400k PPS', baseCost: 40000000, costIncreaseFactor: 1.30, effectType: 'passive', effectValue: 400000, iconUrl: GALAXY_ICON_URL },
    { id: 'potato-universe', name: 'Universe', description: '+5M PPS', baseCost: 500000000, costIncreaseFactor: 1.32, effectType: 'passive', effectValue: 5000000, iconUrl: 'https://media-hosting.imagekit.io/224ec10f362b48b5/Gemini_Generated_Image_7xfkw27xfkw27xfk-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=i3Oml7cNo2MdG7FOzRRAti27dXr9Tsxk03-03rbIpxBL~4F9XSrgeyn55ggw-dKXUaZHWbDZe9P6AetizHRYssbQHK26olXXofrGuTPB4x6ztiWtB-rx~PxpjGaaj3YvEsd-lZMJ8atoElSmA6NQXo~InwaBZsvjYbtK6HL12VqQXXTIojsSJ8nA9xmJdtVCpzzBL9NcQUhLBUOkrA9Q~Tv8nircmMgOM~Iug93INUhZqA4IzCLgsUKbVLJfCZLZHQT~vpeu4RZl~mJuQrxJex6TvC6VVRQ-9vfPfZsOFk4yvgPMeCaerMtZFDglemyQrSLM1zDfUgj4~qqZDQhACw__' },
];
// --- Achievement Definitions ---
const achievementDefinitions = [
     { id: 'tph_1k', name: 'Spud Starter', description: 'Harvest 1K total potatoes', tier: 'bronze', icon: TROPHY_ICON_URL, condition: () => totalPotatoesHarvested >= 1000, progress: () => `${formatNumber(totalPotatoesHarvested)} / 1K` },
     { id: 'tph_100k', name: 'Potato Patch', description: 'Harvest 100K total potatoes', tier: 'silver', icon: TROPHY_ICON_URL, condition: () => totalPotatoesHarvested >= 100000, progress: () => `${formatNumber(totalPotatoesHarvested)} / 100K` },
     { id: 'tph_10m', name: 'Field of Dreams', description: 'Harvest 10M total potatoes', tier: 'gold', icon: TROPHY_ICON_URL, condition: () => totalPotatoesHarvested >= 10000000, progress: () => `${formatNumber(totalPotatoesHarvested)} / 10M` },
     { id: 'tph_1b', name: 'Billionaire Farmer', description: 'Harvest 1B total potatoes', tier: 'platinum', icon: TROPHY_ICON_URL, condition: () => totalPotatoesHarvested >= 1000000000, progress: () => `${formatNumber(totalPotatoesHarvested)} / 1B` },
     { id: 'tph_1t', name: 'Trillion Taters', description: 'Harvest 1T total potatoes', tier: 'platinum', icon: TROPHY_ICON_URL, condition: () => totalPotatoesHarvested >= 1e12, progress: () => `${formatNumber(totalPotatoesHarvested)} / 1T` },
     { id: 'clicks_100', name: 'Finger Workout', description: 'Click the potato 100 times', tier: 'bronze', icon: CLICK_ICON_URL, condition: () => totalClicks >= 100, progress: () => `${formatNumber(totalClicks)} / 100` },
     { id: 'clicks_1k', name: 'Click Enthusiast', description: 'Click the potato 1,000 times', tier: 'silver', icon: CLICK_ICON_URL, condition: () => totalClicks >= 1000, progress: () => `${formatNumber(totalClicks)} / 1K` },
     { id: 'clicks_10k', name: 'Carpal Tunnel Soon', description: 'Click the potato 10,000 times', tier: 'gold', icon: CLICK_ICON_URL, condition: () => totalClicks >= 10000, progress: () => `${formatNumber(totalClicks)} / 10K` },
     { id: 'buy_gloves', name: 'Getting Started', description: 'Buy Farmhand Gloves', tier: 'bronze', icon: GLOVES_ICON_URL, condition: () => (upgrades.find(u=>u.id==='farmhand-gloves')?.level || 0) > 0, progress: () => (upgrades.find(u=>u.id==='farmhand-gloves')?.level || 0) > 0 ? 'Owned' : 'Not Owned' },
     { id: 'buy_fertilizer', name: 'Growth Spurt', description: 'Buy Fertilizer', tier: 'bronze', icon: FERTILIZER_ICON_URL, condition: () => (upgrades.find(u=>u.id==='fertilizer')?.level || 0) > 0, progress: () => (upgrades.find(u=>u.id==='fertilizer')?.level || 0) > 0 ? 'Owned' : 'Not Owned' },
     { id: 'buy_tractor', name: 'Mechanization', description: 'Buy a Tractor', tier: 'silver', icon: TRACTOR_ICON_URL, condition: () => (upgrades.find(u=>u.id==='tractor')?.level || 0) > 0, progress: () => (upgrades.find(u=>u.id==='tractor')?.level || 0) > 0 ? 'Owned' : 'Not Owned' },
     { id: 'buy_fries', name: 'Ol Mcdonalds', description: 'Buy Potato Fries', tier: 'silver', icon: FRIES_ICON_URL, condition: () => (upgrades.find(u=>u.id==='potato-fries')?.level || 0) > 0, progress: () => (upgrades.find(u=>u.id==='potato-fries')?.level || 0) > 0 ? 'Owned' : 'Not Owned' },
     { id: 'buy_gmp', name: 'Yeah Science!', description: 'Buy the Genetically Modified Potato', tier: 'gold', icon: GMP_ICON_URL, condition: () => (upgrades.find(u=>u.id==='gmp')?.level || 0) > 0, progress: () => (upgrades.find(u=>u.id==='gmp')?.level || 0) > 0 ? 'Owned' : 'Not Owned' },
     { id: 'buy_farmer', name: 'Hired Help', description: 'Buy a Potato Farmer', tier: 'bronze', icon: FARMER_ICON_URL, condition: () => (upgrades.find(u=>u.id==='potato-farmer')?.level || 0) > 0, progress: () => (upgrades.find(u=>u.id==='potato-farmer')?.level || 0) > 0 ? 'Owned' : 'Not Owned' },
     { id: 'buy_factory', name: 'Industrialization', description: 'Buy a Potato Factory', tier: 'silver', icon: FACTORY_ICON_URL, condition: () => (upgrades.find(u=>u.id==='potato-factory')?.level || 0) > 0, progress: () => (upgrades.find(u=>u.id==='potato-factory')?.level || 0) > 0 ? 'Owned' : 'Not Owned' },
     { id: 'buy_planet', name: 'New Horizons', description: 'Buy a Potato Planet', tier: 'gold', icon: PLANET_ICON_URL, condition: () => (upgrades.find(u=>u.id==='potato-planet')?.level || 0) > 0, progress: () => (upgrades.find(u=>u.id==='potato-planet')?.level || 0) > 0 ? 'Owned' : 'Not Owned' },
     { id: 'buy_galaxy', name: 'Cosmic Crop', description: 'Buy a Potato Galaxy', tier: 'platinum', icon: GALAXY_ICON_URL, condition: () => (upgrades.find(u=>u.id==='potato-galaxy')?.level || 0) > 0, progress: () => (upgrades.find(u=>u.id==='potato-galaxy')?.level || 0) > 0 ? 'Owned' : 'Not Owned' },
     { id: 'level_gloves_25', name: 'Well-Worn Gloves', description: 'Level Gloves to 25', tier: 'bronze', icon: GLOVES_ICON_URL, condition: () => (upgrades.find(u=>u.id==='farmhand-gloves')?.level || 0) >= 25, progress: () => `Lvl ${upgrades.find(u=>u.id==='farmhand-gloves')?.level || 0} / 25` },
     { id: 'level_shovel_10', name: 'Dig Dug', description: 'Level Shovel to 10', tier: 'bronze', icon: SHOVEL_ICON_URL, condition: () => (upgrades.find(u=>u.id==='sturdy-shovel')?.level || 0) >= 10, progress: () => `Lvl ${upgrades.find(u=>u.id==='sturdy-shovel')?.level || 0} / 10` },
     { id: 'level_farmer_25', name: 'Farm Manager', description: 'Level Farmer to 25', tier: 'silver', icon: FARMER_ICON_URL, condition: () => (upgrades.find(u=>u.id==='potato-farmer')?.level || 0) >= 25, progress: () => `Lvl ${upgrades.find(u=>u.id==='potato-farmer')?.level || 0} / 25` },
     { id: 'level_factory_50', name: 'Potato Magnate', description: 'Level Factory to 50', tier: 'gold', icon: FACTORY_ICON_URL, condition: () => (upgrades.find(u=>u.id==='potato-factory')?.level || 0) >= 50, progress: () => `Lvl ${upgrades.find(u=>u.id==='potato-factory')?.level || 0} / 50` },
     { id: 'prestige_1', name: 'Rebirth', description: 'Prestige for the first time', tier: 'silver', icon: PRESTIGE_ICON_URL, condition: () => prestigeLevel >= 1, progress: () => `Level ${prestigeLevel}` },
     { id: 'prestige_5', name: 'Cycle of Spuds', description: 'Reach Prestige Level 5', tier: 'gold', icon: PRESTIGE_ICON_URL, condition: () => prestigeLevel >= 5, progress: () => `Level ${prestigeLevel} / 5` },
     { id: 'prestige_10', name: 'Potato Deity', description: 'Reach Prestige Level 10', tier: 'platinum', icon: PRESTIGE_ICON_URL, condition: () => prestigeLevel >= 10, progress: () => `Level ${prestigeLevel} / 10` },
     { id: 'fast_finger', name: 'Fast Finger', description: 'Activate the "On Fire" buff!', tier: 'silver', icon: 'https://media-hosting.imagekit.io/720a60ad3a514352/image-removebg-preview.png?Expires=1840673933&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=H3iMc1yR2pccAEKTsHNKTPMQOavO5QJH09~lT~-G1lAmWFsUsgEWKJXXVDLxdVv2NnBCNwQkvh5TQ5kOIGCpmYqmiktxR9cOYnxju-WFqfdrpbb6qanHeUIzjvOw037MGq0gkXmJBjKWN6DTCWOOYKzpgQp3L~LTJUDeTPrirnehK6FbhZhZtCxG4w6HKbMpwu0-ZQ9csHWBUgzPVGbP12ATVtmqBuA4ykqsaTOyEOPRd9ppq8Ukej3wy9dTrpT~OdV3-su3M5Ru0DRIUYGGfCQE6LhV2g-QnRrVblEuhbwB29VAoLB1vhV28tRdcpgsnEAMSHsUr-mIljObGdiD8w__', condition: () => achievements['fast_finger'] === true, progress: () => achievements['fast_finger'] ? 'Completed!' : 'Not Yet' },
     { id: 'meteor_clicker', name: 'Meteor Masher', description: 'Successfully click a falling potato meteor!', tier: 'silver', icon: METEOR_IMAGE_URL, condition: () => achievements['meteor_clicker'] === true, progress: () => achievements['meteor_clicker'] ? 'Completed!' : 'Not Yet' },
     { id: 'debug_unlock', name: 'Potato Hax', description: 'Unlock the debug menu.', tier: 'gold', icon: POTATOHAX_ICON_URL, condition: () => isDebugMenuUnlocked, progress: () => isDebugMenuUnlocked ? 'Unlocked' : 'Locked' },
];
// --- Popularity Tiers & Messages ---
const popularityTiers = [
    { threshold: 1e15, name: "Potato God", message: "WE ARE UNWORTHY!!!!" },
    { threshold: 1e12, name: "Galactic Grower", message: "The universe knows your name!" },
    { threshold: 1e9, name: "Planetary Farmer", message: "Your potatoes conquer worlds!" },
    { threshold: 1e7, name: "Crop King", message: "A true potato monarch!" },
    { threshold: 1e5, name: "Potato Pro", message: "Getting known around town." },
    { threshold: 1000, name: "Local Legend", message: "People are starting to notice!" },
    { threshold: 0, name: "Spud Start", message: "Just a humble beginning..." },
];
// --- Initialize Upgrade State ---
upgrades = upgradeDefinitions.map(def => ({ ...def, level: 0 }));
console.log("Upgrade definitions processed into state.");
// End of Block 2
// ==========================================================================
// Block 3 of 12: Utility Functions & Tab Switching
// ==========================================================================
// --- Utility Functions ---
console.log("Defining utility functions...");

function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    if (num < 1e3) return String(Math.floor(num));
    if (num < 1e6) return (num / 1e3).toFixed(1).replace('.0', '') + 'K';
    if (num < 1e9) return (num / 1e6).toFixed(1).replace('.0', '') + 'M';
    if (num < 1e12) return (num / 1e9).toFixed(1).replace('.0', '') + 'B';
    if (num < 1e15) return (num / 1e12).toFixed(1).replace('.0', '') + 'T';
    if (num < 1e18) return (num / 1e15).toFixed(1).replace('.0', '') + 'Qa';
    if (num < 1e21) return (num / 1e18).toFixed(1).replace('.0', '') + 'Qi';
    if (num < 1e24) return (num / 1e21).toFixed(1).replace('.0', '') + 'Sx';
    if (num < 1e27) return (num / 1e24).toFixed(1).replace('.0', '') + 'Sp';
    if (num < 1e30) return (num / 1e27).toFixed(1).replace('.0', '') + 'Oc';
    return num.toExponential(1).replace('+','');
}

function calculateCost(upgrade) {
     // Find the upgrade state from the 'upgrades' array, not definitions
     const upgradeState = upgrades.find(u => u.id === upgrade.id);
     if (!upgradeState || typeof upgradeState.baseCost !== 'number' || typeof upgradeState.costIncreaseFactor !== 'number') return Infinity;
     const level = Math.max(0, Math.floor(upgradeState.level || 0));
     return Math.floor(upgradeState.baseCost * Math.pow(upgradeState.costIncreaseFactor, level));
}

function calculatePrestigeRequirement(level) {
    return BASE_PRESTIGE_REQUIREMENT * Math.pow(PRESTIGE_REQUIREMENT_MULTIPLIER, Math.max(0, level));
}

function showMessage(text, duration = MESSAGE_DURATION_MS, isError = true) {
     if (!messageBox) return;
     messageBox.textContent = text;
     messageBox.style.color = isError ? '#f87171' : '#86efac'; // Red for error, Green for success
     clearTimeout(messageTimeout);
     if (duration > 0) {
         messageTimeout = setTimeout(() => {
              // Only clear the message if it's still the one we set
              if (messageBox.textContent === text) {
                   messageBox.textContent = '';
              }
         }, duration);
     }
}

function parseScientificInput(input) {
     if (typeof input !== 'string') return NaN;
     input = input.trim().toUpperCase().replace(/,/g, ''); // Clean input
     let multiplier = 1;
     // Check suffixes and adjust multiplier
     if (input.endsWith('K')) { multiplier = 1e3; input = input.slice(0, -1); }
     else if (input.endsWith('M')) { multiplier = 1e6; input = input.slice(0, -1); }
     else if (input.endsWith('B')) { multiplier = 1e9; input = input.slice(0, -1); }
     else if (input.endsWith('T')) { multiplier = 1e12; input = input.slice(0, -1); }
     else if (input.endsWith('QA')) { multiplier = 1e15; input = input.slice(0, -2); } // Quadrillion
     else if (input.endsWith('QI')) { multiplier = 1e18; input = input.slice(0, -2); } // Quintillion
     else if (input.endsWith('SX')) { multiplier = 1e21; input = input.slice(0, -2); } // Sextillion
     else if (input.endsWith('SP')) { multiplier = 1e24; input = input.slice(0, -2); } // Septillion
     else if (input.endsWith('OC')) { multiplier = 1e27; input = input.slice(0, -2); } // Octillion
     // Convert the remaining part to number
     const numberPart = Number(input);
     if (isNaN(numberPart)) return NaN; // Invalid number part
     return numberPart * multiplier;
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        // Add extra logging
        console.log(`Modal ${modalId} attempting to show. Current display: ${window.getComputedStyle(modal).display}, opacity: ${window.getComputedStyle(modal).opacity}, z-index: ${window.getComputedStyle(modal).zIndex}`);
    } else {
        console.error(`Modal with ID "${modalId}" not found.`);
    }
}

function closeModal(modalId) {
     const modal = document.getElementById(modalId);
     if (modal) {
         modal.classList.remove('show');
         console.log(`Closed modal: ${modalId}`);
     }
}

function getTierColor(tier) {
    switch(tier?.toLowerCase()) { // Use optional chaining and handle potential undefined
        case 'bronze': return '#cd7f32';
        case 'silver': return '#c0c0c0';
        case 'gold': return '#ffd700';
        case 'platinum': return '#e5e4e2'; // Light gray/platinum color
        default: return '#a16207'; // Default upgrade border color
    }
}

// --- Tab Switching Logic ---
function switchTab(tabId) {
     // Allow switching tabs even if game not initialized (for tutorial highlight)
     // Block during prestige or story intro
     if (isPrestiging || isStoryIntroRunning) return; // REMOVED tutorial pause check

     console.log(`Switching tab to: ${tabId}`);
     const middleTabs = ['clicks','income'];
     const rightTabs = ['achievements','prestige','save'];
     const allTabs = [...middleTabs, ...rightTabs];
     const rightZone = document.querySelector('.right-zone');

     // Deactivate all tabs and content
     allTabs.forEach(t => {
         document.getElementById('tab-btn-'+t)?.classList.remove('active');
         document.getElementById('tab-content-'+t)?.classList.remove('active');
     });

     // Activate the selected tab and content
     document.getElementById('tab-btn-'+tabId)?.classList.add('active');
     document.getElementById('tab-content-'+tabId)?.classList.add('active');

     // Handle right zone slide-out on desktop
     if (window.innerWidth > 1024) { // Only apply slide logic on larger screens
          if (rightTabs.includes(tabId)) {
               rightZone?.classList.add('open');
          } else {
               rightZone?.classList.remove('open');
          }
     } else {
          // On smaller screens, ensure the right zone is never in the 'open' state (CSS handles layout)
          rightZone?.classList.remove('open');
     }

     // Refresh achievement progress if that tab is opened AND game initialized
     if (tabId === 'achievements' && isGameInitialized) {
          updateAchievementProgress(); // Defined later
     }
}


console.log("Part 3 Finished.");
// End of Block 3
// ==========================================================================
// Block 4 of 12: Existing Intro Sequence Logic (Part 4 - With Menu Listener Fix)
// ==========================================================================
console.log("Part 4: Defining Existing Intro Sequence functions...");

/** Handles the click on the "I understand" button in the pre-intro */
function handlePreIntroClick() {
    console.log("[Intro Step 1] 'I understand' clicked.");
    if (!preIntroOverlay || !preIntroFlash) {
        console.error("handlePreIntroClick: Missing required elements (preIntroOverlay, preIntroFlash). Attempting fallback.");
        showStudioIntro();
        if(preIntroOverlay) preIntroOverlay.classList.add('hidden');
        return;
    }
    // Attempt to play background music on user interaction
    if (backgroundMusic && backgroundMusic.paused) {
         backgroundMusic.play().then(() => {
             console.log("Background music started successfully via handlePreIntroClick.");
             if(musicToggleButton) musicToggleButton.checked = true; // Sync toggle if successful
         })
         .catch(error => {
             console.error("Audio playback failed on pre-intro click:", error);
             if(musicToggleButton) musicToggleButton.checked = false; // Sync toggle if failed
         });
    } else if (musicToggleButton && backgroundMusic) {
        // Ensure toggle reflects current state if music was already playing/attempted
        musicToggleButton.checked = !backgroundMusic.paused;
    }
    preIntroOverlay.classList.add('hidden'); // Hide the disclaimer
    preIntroFlash.classList.add('flash'); // Trigger the first flash
    console.log("[Intro Step 1] Pre-intro hidden, first flash triggered.");
    // After the flash duration, remove flash class and show studio intro
    setTimeout(() => {
        console.log("[Intro Step 1] First flash finished.");
        if(preIntroFlash) preIntroFlash.classList.remove('flash');
        showStudioIntro(); // Proceed to next intro step
    }, FLASH_DURATION_MS);
}

/** Shows the studio intro screen */
function showStudioIntro() {
    console.log("[Intro Step 2] Showing studio intro.");
    if (!studioIntroOverlay || !studioLogo) {
        console.error("showStudioIntro: Missing required elements. Skipping to main intro.");
        startMainIntro(); return;
    }
    studioIntroOverlay.classList.add('visible'); // Make overlay visible
    studioLogo.classList.remove('animate'); // Reset animation state if needed
    void studioLogo.offsetWidth; // Force reflow to restart animation
    studioLogo.classList.add('animate'); // Start logo pop-in animation
    console.log("[Intro Step 2] Studio intro visible, logo animation started.");
    // Set timeout to hide the studio intro after its display duration
    setTimeout(hideStudioIntro, STUDIO_DISPLAY_DURATION_MS);
}

/** Hides the studio intro, flashes again, and transitions to the main intro */
function hideStudioIntro() {
    console.log("[Intro Step 3] Hiding studio intro.");
    if (!studioIntroOverlay || !preIntroFlash) {
        console.error("hideStudioIntro: Missing required elements. Skipping flash.");
        startMainIntro(); return;
    }
    studioIntroOverlay.classList.add('fade-out'); // Start fading out studio overlay
    console.log("[Intro Step 3] Studio intro fading out.");
    // After fade-out duration
    setTimeout(() => {
        console.log("[Intro Step 3] Studio intro fade-out finished.");
        studioIntroOverlay.classList.remove('visible', 'fade-out'); // Hide completely
        if (studioLogo) studioLogo.classList.remove('animate'); // Clean up animation class
        // Trigger the second flash
        preIntroFlash.classList.add('flash');
        console.log("[Intro Step 3] Second flash triggered.");
        // After the second flash duration, remove flash class and start main intro
        setTimeout(() => {
            console.log("[Intro Step 3] Second flash finished.");
            preIntroFlash.classList.remove('flash');
            startMainIntro(); // Proceed to main menu intro
        }, FLASH_DURATION_MS);
    }, STUDIO_FADE_DURATION_MS);
}

/** Starts the main (falling potato) intro */
function startMainIntro() {
    console.log("[Intro Step 4] Starting main intro (falling potatoes).");
    if (!introOverlay || !introPotatoContainer || !introTitleImage || !introPromptText) {
        console.error("startMainIntro: Missing required elements. Cannot proceed."); return;
    }
    introOverlay.classList.add('visible'); // Show the falling potato background/overlay
    console.log("[Intro Step 4] Main intro overlay visible.");
    // Start spawning falling potatoes
    clearInterval(introPotatoInterval); // Clear any existing interval
    introPotatoInterval = setInterval(() => {
        if (!introPotatoContainer) { clearInterval(introPotatoInterval); return; }
        if (introPotatoContainer.children.length < INTRO_POTATO_LIMIT) {
             for (let i = 0; i < INTRO_POTATO_DENSITY; i++) { createFallingPotato(); }
        }
    }, INTRO_POTATO_INTERVAL_MS);
    console.log("[Intro Step 4] Falling potato interval started.");
    // Animate title image after a delay
    setTimeout(() => {
        if (introTitleImage) {
            introTitleImage.classList.remove('animate-fade-out');
            introTitleImage.classList.add('animate-pop-in');
            console.log("[Intro Step 4] Title image pop-in triggered.");
        } else { console.warn("startMainIntro: Title image element not found."); }
    }, INTRO_TITLE_DELAY_MS);
    // Show "Click to Continue" prompt and make overlay clickable after another delay
    setTimeout(() => {
         console.log("[Intro Step 4] Timer fired for showing prompt text and adding overlay listener.");
         if (introPromptText) {
             introPromptText.style.display = 'block';
             void introPromptText.offsetWidth;
             introPromptText.classList.add('animate-fade-in');
             console.log("[Intro Step 4] Prompt text fade-in class added.");
         } else { console.error("startMainIntro: Prompt text element missing!"); }
         // Add click listener to the entire overlay to show the menu
         if (introOverlay) {
             introOverlay.removeEventListener('click', showIntroMenu);
             introOverlay.addEventListener('click', showIntroMenu, { once: true });
             introOverlay.style.cursor = 'pointer';
             console.log("[Intro Step 4] Click listener added to intro overlay.");
         } else { console.error("startMainIntro: Intro overlay element missing!"); }
    }, INTRO_PROMPT_DELAY_MS);
}

/** Creates a single falling potato for the intro animation */
function createFallingPotato() {
    if (!introPotatoContainer) return;
    try {
        const p = document.createElement('img');
        p.src = INTRO_POTATO_URL; p.className = 'intro-potato';
        p.style.left = `${Math.random() * 100}%`;
        const d = 3 + Math.random() * 2; p.style.animationDuration = `${d}s`;
        p.alt = ""; p.onerror = () => { if(p.parentNode) p.remove(); };
        introPotatoContainer.appendChild(p);
        setTimeout(() => { if (p.parentNode) p.remove(); }, d * 1000 + 200);
    } catch (e) { console.error("Error creating falling potato:", e); clearInterval(introPotatoInterval); introPotatoInterval = null; }
}

/** Shows the main intro menu buttons after clicking the falling potato screen */
function showIntroMenu(event) { // <<<--- CORRECTED LISTENER ATTACHMENT LOCATION
    if (event) event.stopPropagation();
    console.log("[Intro Step 5] Show Intro Menu triggered.");
    if (!introTitleImage || !introPromptText || !introMenuButtons || !introOverlay) { console.error("showIntroMenu Error: Missing required elements!"); return; }
    if (!introStartButton || !introSettingsButton || !introCreditsButton || !introUpdatesButton) { console.error("showIntroMenu Error: One or more intro menu BUTTON elements not found!"); }
    if (introMenuButtons.classList.contains('visible')) { console.warn("showIntroMenu called again, menu already visible."); return; }
    introOverlay.removeEventListener('click', showIntroMenu);
    introTitleImage.classList.remove('animate-pop-in');
    introTitleImage.classList.add('animate-fade-out');
    console.log("[Intro Step 5] Title image fade-out triggered.");
    introPromptText.style.display = 'none';
    introOverlay.style.cursor = 'default';
    console.log("[Intro Step 5] Prompt text hidden, cursor reset.");
    if (introMenuButtons) {
        introMenuButtons.classList.add('visible');
        console.log("[Intro Step 5] Added '.visible' class to introMenuButtons.");

        // --- Attach listeners AFTER buttons are made visible ---
        console.log("[Intro Step 5] Attaching listeners to menu buttons...");
        if (introStartButton) {
             console.log("   -> Attaching listener to Start Button");
             introStartButton.removeEventListener('click', triggerGameStartFlow);
             introStartButton.addEventListener('click', triggerGameStartFlow);
        } else { console.warn("   -> Start Button not found for listener."); }
        if (introSettingsButton) {
            console.log("   -> Attaching listener to Settings Button");
            introSettingsButton.removeEventListener('click', handleSettingsClick);
            introSettingsButton.addEventListener('click', handleSettingsClick);
        } else { console.warn("   -> Settings Button not found for listener."); }
        if (introCreditsButton) {
            console.log("   -> Attaching listener to Credits Button");
            introCreditsButton.removeEventListener('click', handleCreditsClick);
            introCreditsButton.addEventListener('click', handleCreditsClick);
        } else { console.warn("   -> Credits Button not found for listener."); }
        if (introUpdatesButton) {
            console.log("   -> Attaching listener to Updates Button");
            introUpdatesButton.removeEventListener('click', handleUpdatesClick);
            introUpdatesButton.addEventListener('click', handleUpdatesClick);
        } else { console.warn("   -> Updates Button not found for listener."); }
        console.log("[Intro Step 5] Menu button listeners attached.");
        // --- End Listener Attachment ---
    } else { console.error("showIntroMenu Error: Cannot show menu buttons - container missing!"); return; }
}

/** Modal Button Handlers & Music Toggle */
function handleSettingsClick() {
    console.log("Settings button clicked.");
    if (musicToggleButton && backgroundMusic) { musicToggleButton.checked = !backgroundMusic.paused && backgroundMusic.duration > 0 && !backgroundMusic.ended; }
    openModal('settings-modal');
}
function handleCreditsClick() { console.log("Credits button clicked."); openModal('credits-modal'); }
function handleUpdatesClick() { console.log("Update Log button clicked."); openModal('updates-modal'); }
function toggleMusic() {
    if (!backgroundMusic || !musicToggleButton) return;
    console.log(`Toggling music. Checkbox checked: ${musicToggleButton.checked}`);
    if (musicToggleButton.checked) {
        backgroundMusic.play().then(() => console.log("Music playing.")).catch(error => {
            console.error("Music toggle ON failed:", error); musicToggleButton.checked = false;
            showMessage("Could not play music (Browser limitations?).", 1500, true);
        });
    } else { backgroundMusic.pause(); console.log("Music paused."); }
}
console.log("Part 4: Existing Intro Sequence Logic Finished.");
// End of Block 4
// ==========================================================================
// Block 5 of 12: NEW - Name Input Logic
// ==========================================================================
console.log("Defining Name Input functions...");

/**
 * Shows the overlay to prompt the player for their name.
 */
function promptPlayerName() {
    console.log("Prompting player for name...");
    if (!nameInputOverlay || !playerNameInput || !submitNameButton || !nameErrorMessage) {
        console.error("Name input overlay elements missing! Skipping name prompt, using default.");
        // If elements are missing, proceed as if name was entered, using the default.
        // Decide whether to run story or initialize game based on 'hasSeenStoryIntro'
        // Note: This path assumes triggerGameStartFlow already loaded save state
        if (!hasSeenStoryIntro) {
            runStoryIntro(playerName); // Run story with default name
        } else {
            // Need to ensure game container is visible before initializing
            if (outerContainer) outerContainer.classList.add('visible');
            initializeGame(); // Start game directly
        }
        return;
    }

    // Show the overlay
    nameInputOverlay.style.display = 'flex'; // Use display style directly
    void nameInputOverlay.offsetWidth; // Trigger reflow
    nameInputOverlay.classList.add('visible'); // Add class for opacity transition
    playerNameInput.value = ''; // Clear any previous input
    playerNameInput.focus(); // Focus the input field
    nameErrorMessage.style.display = 'none'; // Hide error message initially

    // Ensure listeners are attached correctly
    submitNameButton.removeEventListener('click', handleNameSubmit); // Remove first
    submitNameButton.addEventListener('click', handleNameSubmit);
    playerNameInput.removeEventListener('keydown', handleNameInputKeydown); // Remove first
    playerNameInput.addEventListener('keydown', handleNameInputKeydown);

    console.log("Name input overlay displayed and listeners attached.");
}

/**
 * Handles the submission of the player's name.
 */
function handleNameSubmit() {
    if (!playerNameInput || !nameInputOverlay || !nameErrorMessage) return; // Safety check

    const enteredName = playerNameInput.value.trim();

    if (enteredName.length > 0 && enteredName.length <= 20) {
        playerName = enteredName; // Set the global player name
        console.log(`Player name set to: ${playerName}`);

        // Hide the overlay
        nameInputOverlay.classList.remove('visible');
        // Use setTimeout to set display none after transition
        setTimeout(() => {
             if (!nameInputOverlay.classList.contains('visible')) { // Check if still hidden
                  nameInputOverlay.style.display = 'none';
             }
        }, 500); // Match CSS opacity transition duration


        // Remove temporary listeners (optional, as overlay is hidden)
        // submitNameButton.onclick = null;
        // playerNameInput.onkeydown = null;

        // IMPORTANT: Now that name is set, proceed to run the story intro
        // This function is called ONLY when a name needs to be set (first time play)
        console.log("Name submitted, proceeding to run story intro.");
        runStoryIntro(playerName); // Always run story after getting name in this flow

    } else if (enteredName.length > 20) {
        nameErrorMessage.textContent = "Name too long! (Max 20 chars)";
        nameErrorMessage.style.display = 'block';
    } else {
        nameErrorMessage.textContent = "Please enter a name!";
        nameErrorMessage.style.display = 'block';
    }
}

/**
 * Handles the Enter key press within the name input field.
 * @param {KeyboardEvent} event The keyboard event.
 */
function handleNameInputKeydown(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission (if any)
        handleNameSubmit(); // Trigger the same logic as clicking the button
    }
}

// End of Block 5
// ==========================================================================
// Block 6 of 12: NEW - Story Intro Logic (MODIFIED for Music/Sound Variation & Tutorial)
// ==========================================================================
console.log("Defining Story Intro & Tutorial functions...");

// --- Story Stages Data ---
// Use a function to generate stages, allowing player name insertion
function getStoryStages(pName) {
    // Default to "Farmer" if name is somehow invalid
    const safePlayerName = pName && pName.trim() !== "" ? pName.trim() : "Farmer";

    // URLs for the story images
    const imgUrlDreaming = "https://videos.openai.com/vg-assets/assets%2Ftask_01jt9n8np5eebr1hjswsjdqfdz%2F1746228605_img_0.webp?st=2025-05-02T22%3A08%3A12Z&se=2025-05-08T23%3A08%3A12Z&sks=b&skt=2025-05-02T22%3A08%3A12Z&ske=2025-05-08T23%3A08%3A12Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=vaxWwAQwMr07K5ZeWcbnJe%2F6CUNgw3%2FtU2hnQXnaVRo%3D&az=oaivgprodscus";
    const imgUrlTv = "https://videos.openai.com/vg-assets/assets%2Ftask_01jt9q9360et3vmmbt54zzswdc%2F1746230717_img_0.webp?st=2025-05-02T23%3A02%3A55Z&se=2025-05-09T00%3A02%3A55Z&sks=b&skt=2025-05-02T23%3A02%3A55Z&ske=2025-05-09T00%3A02%3A55Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=D%2BXPZyYQd6EI6kSFPrX8xIyHT8PWBYibJMphClgec8g%3D&az=oaivgprodscus";
    const imgUrlBroke = "https://videos.openai.com/vg-assets/assets%2Ftask_01jt9qqz28ergtt5v1zg4fnfnp%2F1746231168_img_0.webp?st=2025-05-02T23%3A01%3A29Z&se=2025-05-09T00%3A01%3A29Z&sks=b&skt=2025-05-02T23%3A01%3A29Z&ske=2025-05-09T00%3A01%3A29Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=Z6Fy4MP09KB9YjVriTaU1W%2FgIBtny1WFBXs5lTUKrN8%3D&az=oaivgprodscus";
    const imgUrlIdea = "https://videos.openai.com/vg-assets/assets%2Ftask_01jt9rh156epwsczxvdne7aeqq%2F1746231988_img_0.webp?st=2025-05-02T23%3A24%3A55Z&se=2025-05-09T00%3A24%3A55Z&sks=b&skt=2025-05-02T23%3A24%3A55Z&ske=2025-05-09T00%3A24%3A55Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=KQPIv77zXND%2BQ9wd6AQ%2Fo7K8oKp6vmbdUb6lJsj7XFg%3D&az=oaivgprodscus";
    const imgUrlSelling = "https://videos.openai.com/vg-assets/assets%2Ftask_01jt9r8nh1fwvtg27m481d47xq%2F1746231723_img_0.webp?st=2025-05-02T23%3A02%3A32Z&se=2025-05-09T00%3A02%3A32Z&sks=b&skt=2025-05-02T23%3A02%3A32Z&ske=2025-05-09T00%3A02%3A32Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=zsFo51IP%2B2v42fV%2BqFvCA3l1ss6mbx2OvVjXUAsKN%2Fw%3D&az=oaivgprodscus";

    return [
        { text: `Ah, welcome, young ${safePlayerName}. I sense a great destiny stirs within your starchy heart... a dream, perhaps?`, imageUrl: imgUrlDreaming },
        { text: `Yes... a dream of the soil, of nurturing life, of becoming... a Farmer! A noble aspiration for a potato!`, imageUrl: imgUrlDreaming },
        { text: `One evening, glued to the ol' tuber-vision, a flicker of opportunity! A farm plot, ripe for the taking! Destiny calls!`, imageUrl: imgUrlTv },
        { text: `With tubers trembling, ${safePlayerName} seized the chance! The farm was theirs! But alas, the potato pouch was now emptier than a forgotten crisp packet. Penniless!`, imageUrl: imgUrlBroke },
        { text: `But despair is not for potatoes! A brilliant spark ignited! An idea rooted in their very being... what if... what IF...`, imageUrl: imgUrlIdea },
        { text: `...they sold the very potatoes they grew?! Genius! The townsfolk clamored, the coins clinked! ${safePlayerName}'s farm flourished! And that, my friend, is where your legend truly begins!`, imageUrl: imgUrlSelling }
    ];
}

/**
 * Starts and manages the story introduction sequence.
 * @param {string} playerNameForStory - The name to use in the story.
 */
function runStoryIntro(playerNameForStory) {
    console.log("Running Story Intro for player:", playerNameForStory);
    if (isStoryIntroRunning || !storyIntroOverlay || !narratorTextElement || !storyBackground || !continueButton || !narratorIcon) {
        console.error("Cannot run story intro: Already running or essential elements missing.");
        endStoryIntro(true); return; // Attempt fallback
    }

    // Pause Music
    wasMusicPlayingBeforeStory = false;
    if (backgroundMusic && !backgroundMusic.paused) {
        try { backgroundMusic.pause(); wasMusicPlayingBeforeStory = true; console.log("BG music paused for story."); }
        catch (e) { console.error("Error pausing BG music:", e); }
    }

    isStoryIntroRunning = true;
    currentStoryStage = 0;
    currentCharIndex = 0;
    narratorTextElement.textContent = '';
    continueButton.style.display = 'none';
    stopNarratorShake();

    // Pause game loop if running
    if (isGameInitialized && gameLoopIntervalId) {
        console.log("Pausing game loop for story intro.");
        clearInterval(gameLoopIntervalId); gameLoopIntervalId = null;
    }

    storyIntroOverlay.style.display = 'flex';
    void storyIntroOverlay.offsetWidth;
    storyIntroOverlay.classList.add('visible');

    // Attach listener for the continue button
    continueButton.removeEventListener('click', advanceStoryStage);
    continueButton.addEventListener('click', advanceStoryStage);

    // Play initial sound
    if (narratorSounds.length > 0) {
        try {
            const sound = narratorSounds[Math.floor(Math.random() * narratorSounds.length)];
            sound.volume = 0.5; sound.currentTime = 0;
            sound.play().catch(e => console.warn("Narrator sound play failed on initial stage:", e));
            console.log("Playing initial narrator sound:", sound.id);
        } catch(e) { console.warn("Error playing initial narrator sound", e)}
    }

    // Start the first stage
    loadStoryStage(currentStoryStage, playerNameForStory);
}

/**
 * Loads the content for a specific story stage.
 * @param {number} stageIndex - The index of the stage to load.
 * @param {string} nameForStory - Player's name.
 */
function loadStoryStage(stageIndex, nameForStory) {
    const stages = getStoryStages(nameForStory);
    if (stageIndex >= stages.length || stageIndex < 0) {
        console.log("Invalid stage index or story finished."); endStoryIntro(); return;
    }
    const stage = stages[stageIndex];
    console.log(`Loading Story Stage ${stageIndex}:`, stage.text.substring(0, 20) + "...");

    // Ensure background image container is visible for story
    if (storyBackground) {
         storyBackground.style.removeProperty('display'); // Remove potential display:none from tutorial
         storyBackground.style.backgroundColor = '#111'; // Restore dark fallback
         if(stage.imageUrl) {
             storyBackground.style.backgroundImage = `url('${stage.imageUrl}')`;
         } else {
             storyBackground.style.backgroundImage = 'none';
         }
    }

    narratorTextElement.textContent = '';
    currentCharIndex = 0;
    continueButton.style.display = 'none';
    stopNarratorShake();
    clearTimeout(typingTimeout);
    typeNarratorText(stage.text);
}

/**
 * Types out the narrator's text character by character. (Sound removed)
 * @param {string} fullText - The complete text for the current stage.
 */
function typeNarratorText(fullText) {
    if (currentCharIndex < fullText.length && isStoryIntroRunning) {
        narratorTextElement.textContent += fullText[currentCharIndex];
        // Start shaking if not already (and not a space character)
        if (fullText[currentCharIndex] !== ' ' && !narratorIcon.classList.contains('shaking')) {
            narratorIcon.classList.add('shaking');
            if (narratorShakeInterval === null) {
                narratorShakeInterval = setInterval(shakeNarratorIcon, NARRATOR_SHAKE_INTERVAL_MS);
            }
        }
        currentCharIndex++;
        typingTimeout = setTimeout(() => typeNarratorText(fullText), TYPING_SPEED_MS);
    } else if (isStoryIntroRunning) {
        console.log("Typing finished for stage", currentStoryStage);
        stopNarratorShake();
        if (continueButton) continueButton.style.display = 'block';
    } else {
        console.log("Typing interrupted by story ending.");
        stopNarratorShake(); clearTimeout(typingTimeout);
    }
}

/**
 * Applies random translation to the narrator icon for shaking effect.
 */
function shakeNarratorIcon() {
    if (!narratorIcon || !narratorIcon.classList.contains('shaking') || !isStoryIntroRunning) {
        stopNarratorShake(); return;
    }
    const offsetX = Math.floor(Math.random() * (NARRATOR_SHAKE_INTENSITY_PX * 2 + 1)) - NARRATOR_SHAKE_INTENSITY_PX;
    const offsetY = Math.floor(Math.random() * (NARRATOR_SHAKE_INTENSITY_PX * 2 + 1)) - NARRATOR_SHAKE_INTENSITY_PX;
    narratorIcon.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

/**
 * Stops the narrator icon shaking animation and clears the interval.
 */
function stopNarratorShake() {
    if (narratorIcon) {
        narratorIcon.classList.remove('shaking');
        narratorIcon.style.transform = 'translate(0, 0)';
    }
    if (narratorShakeInterval !== null) {
        clearInterval(narratorShakeInterval); narratorShakeInterval = null;
    }
}


/**
 * Advances to the next stage or ends the intro. (Sound added here)
 */
function advanceStoryStage() {
    stopNarratorShake();
    clearTimeout(typingTimeout);
    // Stop any currently playing narrator sounds before starting next
    narratorSounds.forEach(sound => { if (sound && !sound.paused) { try { sound.pause(); sound.currentTime = 0; } catch(e){} } });

    // Play sound on advancing stage (except for the very last click leading to endStoryIntro)
    const stages = getStoryStages(playerName); // Get stages to check length
    if (narratorSounds.length > 0 && currentStoryStage < stages.length -1) {
        try {
            const sound = narratorSounds[Math.floor(Math.random() * narratorSounds.length)];
            sound.volume = 0.5; sound.currentTime = 0;
            sound.play().catch(e => console.warn("Narrator sound play failed on advance:", e));
            console.log("Playing narrator sound:", sound.id);
        } catch(e) { console.warn("Error playing narrator sound on advance", e)}
    }

    currentStoryStage++;
    if (currentStoryStage < stages.length) {
        loadStoryStage(currentStoryStage, playerName);
    } else {
        endStoryIntro();
    }
}

/**
 * Cleans up and hides the story intro overlay, then starts the game or tutorial.
 * @param {boolean} forceStartGame - Immediately start the game, skipping save flag setting (used for fallbacks).
 */
function endStoryIntro(forceStartGame = false) {
    console.log("Ending Story Intro.");
    if (!isStoryIntroRunning && !forceStartGame) return;
    isStoryIntroRunning = false;
    clearTimeout(typingTimeout); stopNarratorShake();
    narratorSounds.forEach(sound => { if (sound && !sound.paused) { try { sound.pause(); sound.currentTime = 0; } catch(e){} } });
    if (storyIntroOverlay) {
        storyIntroOverlay.classList.remove('visible');
        setTimeout(() => { if (storyIntroOverlay && !storyIntroOverlay.classList.contains('visible')) { storyIntroOverlay.style.display = 'none'; } }, 500);
    }
    if (continueButton) {
        continueButton.style.display = 'none';
        // Remove listener specific to story advance
        continueButton.removeEventListener('click', advanceStoryStage);
    }

    let wasFirstStoryPlaythrough = false;
    if (!forceStartGame) {
        if (!hasSeenStoryIntro) { wasFirstStoryPlaythrough = true; }
        hasSeenStoryIntro = true; console.log("Setting hasSeenStoryIntro to true.");
    }

    // Resume Music if it was playing before
    if (wasMusicPlayingBeforeStory && backgroundMusic) {
        backgroundMusic.play().then(() => { console.log("BG music resumed."); if (musicToggleButton) musicToggleButton.checked = true; })
        .catch(e => { console.error("Error resuming BG music:", e); if (musicToggleButton) musicToggleButton.checked = false; });
    }
    wasMusicPlayingBeforeStory = false; // Reset flag

    // Decide whether to start tutorial or game
    if (wasFirstStoryPlaythrough && !tutorialSeen) {
        console.log("Starting tutorial.");
        // Make game container visible before starting tutorial
        if (outerContainer) {
             outerContainer.classList.add('visible');
             console.log("Made outerContainer visible for tutorial START.");
        } else {
             console.error("Cannot start tutorial: outerContainer not found! Initializing game directly.");
             initializeGame(); // Fallback if container missing
             return; // Stop here
        }
        startTutorial(); // Now call the tutorial function

    } else {
        console.log("Skipping tutorial or it was already seen. Initializing game...");
        if (!forceStartGame) saveGame(); // Save storySeen flag now (if not already saved)
        if (outerContainer) outerContainer.classList.add('visible'); // Ensure visible
        initializeGame(); // Initialize the main game
    }
}

// === Tutorial Functions ===

const tutorialSteps = [
    { text: "Welcome, Farmer! Let's learn the ropes. See that big potato? When it's clicked you get potatoes!", elementId: 'potato-button' },
    { text: "Each click harvests potatoes. Check your count up here.", elementId: 'stats-display' },
    { text: "You also earn potatoes passively over time (PPS).", elementId: 'tab-btn-income' },
    { text: "This is the Income tab. Here you buy upgrades that automatically harvest potatoes for you.", elementId: 'tab-content-income' }, // Highlight whole tab content
    { text: "Aim to buy the first 'Farmer' upgrade when you have enough potatoes!", elementId: 'passive-upgrades-container' }, // Highlight the container
    { text: "Now, click the 'Clicks' tab to improve your manual clicking power.", elementId: 'tab-btn-clicks' },
    { text: "Here you buy upgrades that make each of your clicks harvest more potatoes.", elementId: 'tab-content-clicks' },
    { text: "Keep an eye on the 'Trophies' tab for achievements you unlock!", elementId: 'tab-btn-achievements' },
    { text: "The 'Prestige' tab is for later... when you're truly powerful!", elementId: 'tab-btn-prestige' },
    { text: "And finally, use the 'Save' tab to save your progress or load a previous game.", elementId: 'tab-btn-save' },
    { text: "That's the basics! Click away and build your Potato Empire!", elementId: null } // Final step
];

let highlightedElement = null; // Keep track of the currently highlighted element

/**
 * Starts the tutorial sequence.
 * Assumes the outerContainer is made visible before this is called.
 */
function startTutorial() {
    console.log("Starting Tutorial...");
    // Prevent issues if already running or essential overlay missing
    if (isTutorialRunning || !storyIntroOverlay) return;

    isTutorialRunning = true;
    currentTutorialStep = 0;

    // Pause game loop if running (initializeGame will restart it later)
    if (isGameInitialized && gameLoopIntervalId) {
        console.log("Pausing game loop for tutorial.");
        clearInterval(gameLoopIntervalId);
        gameLoopIntervalId = null;
    }
    // Ensure music is paused (should be from story ending)
    if (backgroundMusic && !backgroundMusic.paused) {
        try { backgroundMusic.pause(); } catch(e){}
        console.log("Ensuring music is paused for tutorial.");
    }

    // Reuse story overlay elements, but modify appearance
    storyIntroOverlay.style.display = 'flex'; // Ensure it's flex for centering
    void storyIntroOverlay.offsetWidth; // Trigger reflow
    storyIntroOverlay.classList.add('visible'); // Make overlay visible (for text box)
    
    // ---> ADD THESE LINES <---
    // Make the main overlay transparent and reset z-index for tutorial
    if (storyIntroOverlay) { // Add safety check
        storyIntroOverlay.style.backgroundColor = 'transparent';
        storyIntroOverlay.style.zIndex = 'auto'; // Let browser determine stacking based on DOM order
        console.log("Set tutorial overlay background transparent and z-index auto.");
    }
    // ---> END ADDED LINES <---
    
    if (storyBackground) { // Check if the element exists
        // Remove or comment out these lines if you had them:
        // storyBackground.style.backgroundImage = 'none';
        // storyBackground.style.backgroundColor = 'transparent';
        // storyBackground.style.display = 'none';
           storyBackground.style.setProperty('display', 'none', 'important')
        console.log("Hid story background element for tutorial.");
    } else {
        console.warn("Story background element not found for tutorial modifications.");
    }

    // Use continue button for tutorial steps
    continueButton.removeEventListener('click', advanceTutorial); // Ensure previous story listener removed
    continueButton.addEventListener('click', advanceTutorial);

    // --- FIX FOR VISIBILITY ---
    // Render initial upgrades *after* main container is visible and *before* showing first step
    // (Outer container visibility set in endStoryIntro or triggerGameStartFlow before calling startTutorial)
    console.log("Rendering initial upgrades for tutorial...");
    renderUpgrades(); // <--- ENSURE THIS CALL IS PRESENT
    // --- END FIX FOR VISIBILITY ---

    showTutorialStep(currentTutorialStep); // Now show the first step
}


function showTutorialStep(index) {
    if (index >= tutorialSteps.length) {
        endTutorial();
        return;
    }

    const step = tutorialSteps[index];
    console.log(`Showing Tutorial Step ${index}: Highlighting ${step.elementId || 'nothing'}`);

    // Remove previous highlight
    removeHighlight();

    // Update text and ensure narrator box is visible
    if (narratorTextElement) narratorTextElement.textContent = step.text; // Display full text immediately
    if (!storyIntroOverlay.classList.contains('visible')) {
         storyIntroOverlay.style.display = 'flex';
         storyIntroOverlay.classList.add('visible'); // Ensure overlay (for text) is visible
    }
     // Ensure narrator icon is visible
    if(narratorIcon) narratorIcon.style.display = 'block';


    // Add new highlight if specified
    if (step.elementId) {
        highlightElement(step.elementId);
        // Special case: if highlighting a tab button, switch to that tab
        if (step.elementId.startsWith('tab-btn-')) {
             const tabId = step.elementId.replace('tab-btn-', '');
             switchTab(tabId); // Switch to the relevant tab
        }
    }

    // Update button text
    if (continueButton) {
         if (index === tutorialSteps.length - 1) {
             continueButton.textContent = "Let's Play!";
         } else {
             continueButton.textContent = "Next";
         }
         continueButton.style.display = 'block'; // Show button
    }


    // Play sound for the step and shake icon
    if (narratorSounds.length > 0) {
        try {
            narratorSounds.forEach(s => { if(s && !s.paused){ s.pause(); s.currentTime = 0; } });
            const sound = narratorSounds[Math.floor(Math.random() * narratorSounds.length)];
            sound.volume = 0.5; sound.currentTime = 0;
            sound.play().catch(e => {}); // Ignore play errors during tutorial
        } catch(e) {}
    }
    if (narratorIcon && !narratorIcon.classList.contains('shaking')) {
        narratorIcon.classList.add('shaking');
        if (narratorShakeInterval === null) {
            narratorShakeInterval = setInterval(shakeNarratorIcon, NARRATOR_SHAKE_INTERVAL_MS);
        }
   }
}

function advanceTutorial() {
    stopNarratorShake(); // Stop shake when advancing
    narratorSounds.forEach(s => { if(s && !s.paused){ try { s.pause(); s.currentTime = 0; } catch(e){} } }); // Stop sound
    currentTutorialStep++;
    showTutorialStep(currentTutorialStep);
}

function highlightElement(elementId) {
    // Ensure highlight removal happens first
    removeHighlight();

    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('tutorial-highlight');
        highlightedElement = element; // Store reference
        // Scroll into view if needed, use more robust options
        try {
           element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        } catch(e) {
            console.warn("Scrolling to highlighted element failed:", e);
            // Fallback scroll if needed
            // element.scrollIntoView();
        }
    } else {
        console.warn(`Tutorial highlight: Element ID "${elementId}" not found.`);
    }
}

function removeHighlight() {
    if (highlightedElement) {
        try {
             highlightedElement.classList.remove('tutorial-highlight');
        } catch (e) { /* Ignore if element detached */ }
        highlightedElement = null;
    }
    // Also remove from any element just in case reference was lost or element changed
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
}

function endTutorial() {
    console.log("Ending Tutorial.");
    isTutorialRunning = false;
    removeHighlight(); // Clean up highlight
    stopNarratorShake(); // Stop shaking
    narratorSounds.forEach(s => { if(s && !s.paused){ try { s.pause(); s.currentTime = 0; } catch(e){} } }); // Stop sound

    // Hide overlay
    if (storyIntroOverlay) {
        storyIntroOverlay.classList.remove('visible');
        
        // ---> ADD THESE LINES <---
        // Remove inline styles set during tutorial start to restore default CSS behavior
        storyIntroOverlay.style.removeProperty('background-color');
        storyIntroOverlay.style.removeProperty('z-index');
        console.log("Restored tutorial overlay background and z-index.");
        // ---> END ADDED LINES <---
        
        setTimeout(() => {
            // Check again before hiding, in case another process showed it
            if (storyIntroOverlay && !storyIntroOverlay.classList.contains('visible') && !isStoryIntroRunning) {
                storyIntroOverlay.style.display = 'none';
            }
        }, 500); // Match CSS transition
    }
    if (continueButton) {
        continueButton.removeEventListener('click', advanceTutorial);
        continueButton.style.display = 'none';
    }

    // Mark tutorial as seen and save
    tutorialSeen = true;
    saveGame(); // Save progress including tutorialSeen flag

    // Initialize game (this will restart the game loop if it was paused)
    console.log("Tutorial finished. Initializing/Resuming game.");
    // Ensure main container is visible if somehow hidden
    if (outerContainer && !outerContainer.classList.contains('visible')) {
         outerContainer.classList.add('visible');
    }
    initializeGame();
}

// === END Tutorial Functions ===
// ==========================================================================
// End of Block 6
// ==========================================================================
// ==========================================================================
// Block 7 of 12: Core Game Logic (Part 5 - Includes MODIFIED Save/Load)
// ==========================================================================
console.log("Part 5: Defining Core Gameplay functions...");

function clickPotato(event) {
    console.log("--- clickPotato function CALLED ---"); // <-- ADD THIS

    // Block during prestige, story intro, or initial sequences
    if (isPrestiging || isIntroSequenceActive || isStoryIntroRunning) {
        console.log("clickPotato blocked: Prestige/Intro/Story active"); // <-- ADD THIS
        return;
    }
    // Block if the main game container isn't visible yet
    if (!outerContainer?.classList.contains('visible')) {
        console.log("clickPotato blocked: Outer container not visible"); // <-- ADD THIS
        return;
    }

    console.log("clickPotato: Past initial blocks."); // <-- ADD THIS

    const now = Date.now();
    totalClicks++;

    // On Fire check (conditional on isGameInitialized)
    if (!isOnFireActive && now >= onFireCooldownEndTime && isGameInitialized) {
       console.log("clickPotato: Checking On Fire status."); // <-- ADD THIS
       // ... on fire logic ...
       // activateOnFire(now);
    }

    // Calculate gain
    let baseGain = potatoesPerClick;
    let onFireMultiplier = 1;
    if (isOnFireActive && now < onFireEndTime && isGameInitialized) {
       // ... on fire multiplier logic ...
    }
    let gain = baseGain * prestigeMultiplier * onFireMultiplier;
    console.log("clickPotato: Calculated gain:", gain); // <-- ADD THIS

    // Update counts
    potatoCount += gain;
    totalPotatoesHarvested += gain;
    console.log("clickPotato: State updated. New count:", potatoCount); // <-- ADD THIS

    // Visual feedback
    spawnClickAnimation(event, gain, (isOnFireActive && isGameInitialized));
    console.log("clickPotato: Called spawnClickAnimation"); // <-- ADD THIS
    updateDisplay();
    console.log("clickPotato: Called updateDisplay"); // <-- ADD THIS

    // Check achievements (conditional on isGameInitialized)
    if (isGameInitialized) {
        checkAchievements();
        console.log("clickPotato: Called checkAchievements"); // <-- ADD THIS
    }
    console.log("--- clickPotato function FINISHED ---"); // <-- ADD THIS
}

/** Handles buying or upgrading an item */
function buyUpgrade(upgradeId) {
    // Ignore if game not ready or during prestige/story
    // Tutorial interaction change: REMOVED isTutorialRunning check
    if (isPrestiging || !isGameInitialized || isIntroSequenceActive || isStoryIntroRunning) return;

    // Find the upgrade state in the 'upgrades' array
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade) {
        console.error(`Buy failed: Upgrade ID "${upgradeId}" not found.`);
        return;
    }

    const cost = calculateCost(upgrade); // Calculate current cost
    if (potatoCount >= cost) {
        potatoCount -= cost; // Deduct cost
        upgrade.level++; // Increment level
        console.log(`Bought ${upgrade.name} - Lvl: ${upgrade.level}`);
        recalculateStats(); // Update PPC/PPS based on new level
        showMessage(`${upgrade.name} Lvl ${upgrade.level}!`, 1500, false); // Success message
        updateDisplay(); // Update UI counters
        renderUpgrades(); // Re-render upgrade list with new cost/level/disabled states
        if (upgrade.id === 'farmhand-gloves') { // Specific logic for cursor upgrade
             updateCursors(); // Update orbiting cursors
        }
        checkAchievements(); // Check if buying unlocked achievements
    } else {
        showMessage('Need more potatoes!', 1500, true); // Error message if not enough potatoes
    }
}

/** Recalculates base potatoesPerClick and potatoesPerSecond from upgrade levels */
function recalculateStats() {
    // Calculate base Potatoes Per Click (PPC)
    potatoesPerClick = 1 + upgrades // Start with base 1 PPC
        .filter(u => u.effectType === 'click' && u.level > 0) // Filter for active click upgrades
        .reduce((sum, u) => sum + (Number(u.effectValue) || 0) * Math.max(0, Math.floor(u.level || 0)), 0); // Sum effectValue * level

    // Calculate base Potatoes Per Second (PPS)
    potatoesPerSecond = upgrades // Start with base 0 PPS
        .filter(u => u.effectType === 'passive' && u.level > 0) // Filter for active passive upgrades
        .reduce((sum, u) => sum + (Number(u.effectValue) || 0) * Math.max(0, Math.floor(u.level || 0)), 0); // Sum effectValue * level
}

/** Generates passive income based on PPS and prestige multiplier */
function passivePotatoGeneration() {
    // Ignore if game not ready, during prestige/story, or if PPS is zero
    // Tutorial interaction change: Keeping this blocked during tutorial
    if (isPrestiging || !isGameInitialized || isIntroSequenceActive || isStoryIntroRunning || isTutorialRunning || potatoesPerSecond <= 0) return;

    // Calculate gain per tick interval, applying prestige multiplier
    const gain = (potatoesPerSecond * prestigeMultiplier) * (TICK_INTERVAL_MS / 1000);
    if (gain > 0) {
        potatoCount += gain;
        totalPotatoesHarvested += gain;
        // Note: updateDisplay() is called in gameTick, no need to call it here frequently
    }
}

/** Checks prestige requirement and starts animation if possible */
function attemptPrestige() {
    console.log("Attempting prestige...");
    // Ignore if game not ready or during prestige/story/tutorial
    // Tutorial interaction change: Keeping this blocked during tutorial
    if (isPrestiging || !isGameInitialized || isIntroSequenceActive || isStoryIntroRunning || isTutorialRunning) {
        console.log("Prestige blocked (Game not ready or already prestiging/in story/tutorial).");
        return;
    }

    console.log(`Checking prestige: Have ${formatNumber(potatoCount)}, Need ${formatNumber(currentPrestigeRequirement)}`);
    if (potatoCount >= currentPrestigeRequirement) {
        console.log("Requirement met. Starting prestige animation.");
        startPrestigeAnimation(); // Function defined later
    } else {
        showMessage(`Need ${formatNumber(currentPrestigeRequirement)} current potatoes to Prestige!`, 2500, true);
    }
}

/** Finalizes prestige state changes after the animation completes */
function completePrestige() {
    console.log("Completing Prestige process...");
    prestigeLevel++; // Increment level
    prestigeMultiplier = 1 + prestigeLevel; // Calculate new multiplier
    potatoCount = 0; // Reset current potatoes
    totalClicks = 0; // Reset clicks
    upgrades.forEach(u => u.level = 0); // Reset upgrade levels
    isOnFireActive = false; onFireEndTime = 0; onFireCooldownEndTime = 0; onFireStreakLevel = 0; clickTimestamps = []; // Reset On Fire
    recalculateStats(); // Recalculate PPC/PPS
    currentPrestigeRequirement = calculatePrestigeRequirement(prestigeLevel); // Calculate next goal
    showMessage(`PRESTIGE LVL ${prestigeLevel}! (${prestigeMultiplier}x Bonus)`, 3000, false);
    updateDisplay(); renderUpgrades(); renderAchievements(); updateCursors(); // Update UI
    if (mainPotatoImg) { mainPotatoImg.src = ORIGINAL_POTATO_URL; mainPotatoImg.classList.remove('shake-animation'); } // Reset potato image
    removeMeteor(false, 0); // Remove any active meteor
    if (isDebugMenuUnlocked) { enableDebugFeatures(); } else { disableDebugFeatures(); } // Re-apply debug state
    switchTab('clicks'); // Go back to default tab
    saveGame(); // Save the new prestige state
    console.log(`Prestige complete. Lvl: ${prestigeLevel}. Next Req: ${formatNumber(currentPrestigeRequirement)}`);
    isPrestiging = false; // Mark prestige process as finished
    console.log("isPrestiging flag set to false.");
}

/** Updates the popularity display based on total harvested potatoes */
function updatePopularity() {
    if (!popularityLevelDisplay || !farmerIcon || !popularityChatBubble) return;
    let currentTier = popularityTiers[popularityTiers.length - 1]; // Default to lowest
    for (const tier of popularityTiers) { if (totalPotatoesHarvested >= tier.threshold) { currentTier = tier; break; } }
    if (popularityLevelDisplay.textContent !== currentTier.name) { popularityLevelDisplay.textContent = currentTier.name; }
    let iconUrl = FARMER_ICON_URL;
    if (isDebugMenuUnlocked) { iconUrl = POTATOHAX_ICON_URL; }
    else { const proFarmerTier = popularityTiers.find(t => t.name === "Potato Pro"); if (proFarmerTier && totalPotatoesHarvested >= proFarmerTier.threshold) { iconUrl = PRO_FARMER_ICON_URL; } }
    if (farmerIcon.getAttribute('src') !== iconUrl) { farmerIcon.src = iconUrl; }
    const messageToShow = isDebugMenuUnlocked ? "Click me ;)" : currentTier.message;
    if (popularityChatBubble.textContent !== messageToShow || !popularityChatBubble.classList.contains('visible')) { popularityChatBubble.textContent = messageToShow; popularityChatBubble.classList.add('visible'); }
}

/** Saves game state to localStorage */
function saveGame() {
    // Prevent saving during prestige, story intro, or tutorial
    // Tutorial interaction change: Keeping this blocked during tutorial is safer to prevent saving mid-step
    if (isPrestiging || isStoryIntroRunning || isTutorialRunning) return;

    try {
        const state = {
            pc: potatoCount, tph: totalPotatoesHarvested, pl: prestigeLevel, tc: totalClicks,
            upg: upgrades.map(u => ({ id: u.id, lvl: u.level })), ach: achievements,
            pName: playerName, storySeen: hasSeenStoryIntro, tutSeen: tutorialSeen, // Include tutSeen
            debug: isDebugMenuUnlocked, ofs: onFireStreakLevel, version: 7.3 // Use correct version
        };
        const jsonString = JSON.stringify(state);
        const base64String = btoa(unescape(encodeURIComponent(jsonString)));
        localStorage.setItem(SAVE_KEY, base64String);
        if (saveCodeArea) saveCodeArea.value = base64String;
        if (copySaveButton) copySaveButton.textContent = "Copy";
        showMessage("Game Saved!", 1500, false);
    } catch (error) { console.error("Save Game Error:", error); showMessage("Error saving game!", 2500, true); localStorage.removeItem(SAVE_KEY); }
}


/** Attempts to load game from localStorage */
function loadFromLocalStorage() {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) { console.log("Found save data. Attempting load."); return loadGame(savedData); }
    else { console.log("No save data found."); return false; }
}

/** Loads game state from a save string (pasted or from localStorage) */
function loadGame(loadString = null) {
    console.log("Running loadGame function...");
    const code = loadString ?? loadCodeArea?.value.trim();
    if (!code) { if (loadString === null) { showMessage("Paste save code first!", 1500, true); } return false; }
    if (code.toUpperCase() === 'POTATO') {
        console.log("Debug code entered.");
        if (!isDebugMenuUnlocked) { isDebugMenuUnlocked = true; enableDebugFeatures(); showAchievementNotification("Debug Menu Unlocked!", true); checkAchievements(); saveGame(); }
        else { if (loadString === null) showMessage("Debug menu already unlocked!", 1500, false); }
        if (loadCodeArea && loadString === null) loadCodeArea.value = ""; return true;
    }
    try {
        console.log("Decoding save string...");
        const jsonString = decodeURIComponent(escape(atob(code))); const loadedState = JSON.parse(jsonString); console.log('Parsed loadedState:', loadedState);
        if (typeof loadedState !== 'object' || loadedState === null) throw new Error("Invalid save: Not an object.");
        if (!loadedState.version || loadedState.version < 7.3) { console.warn(`Loading save from older version (${loadedState.version || 'pre-7.2'}). Current is 7.3.`); }
        console.log("Restoring game state...");
        potatoCount = Number(loadedState.pc) || 0; totalPotatoesHarvested = Number(loadedState.tph) || 0; prestigeLevel = Number(loadedState.pl) || 0;
        achievements = (typeof loadedState.ach === 'object' && loadedState.ach !== null) ? loadedState.ach : {};
        totalClicks = Number(loadedState.tc) || 0; isDebugMenuUnlocked = Boolean(loadedState.debug) || false; onFireStreakLevel = Number(loadedState.ofs) || 0;
        playerName = (typeof loadedState.pName === 'string' && loadedState.pName.trim() !== "") ? loadedState.pName.trim() : "Farmer";
        hasSeenStoryIntro = Boolean(loadedState.storySeen) || false; tutorialSeen = Boolean(loadedState.tutSeen) || false; // Load tutorial flag
        console.log(`Loaded Name: ${playerName}, Story Seen: ${hasSeenStoryIntro}, Tutorial Seen: ${tutorialSeen}`);
        upgrades.forEach(u => u.level = 0);
        if (Array.isArray(loadedState.upg)) {
             loadedState.upg.forEach(savedUpg => {
                 const gameUpg = upgrades.find(u => u.id === savedUpg.id);
                 if (gameUpg && typeof savedUpg.lvl === 'number') { gameUpg.level = Math.max(0, Math.floor(savedUpg.lvl)); }
                 else if (savedUpg.id) { console.warn(`Upgrade "${savedUpg.id}" from save not found/invalid.`); }
             });
        } else { console.warn("Save data 'upg' missing/invalid.") }
        console.log("Recalculating dependent state..."); prestigeMultiplier = 1 + prestigeLevel; currentPrestigeRequirement = calculatePrestigeRequirement(prestigeLevel); recalculateStats();
        if (loadCodeArea && loadString === null) loadCodeArea.value = ""; if (loadString === null) showMessage("Game loaded successfully!", 2000, false);
        if (loadString === null) { localStorage.setItem(SAVE_KEY, code); console.log("Manual load successful, updated localStorage."); }
        else { console.log("Automatic load from localStorage successful."); }
        return true;
    } catch (error) {
        console.error("Error processing loadGame:", error); if (loadString === null) showMessage("Invalid or corrupted save code!", 2500, true);
        if (loadString !== null) { localStorage.removeItem(SAVE_KEY); console.warn("Removed potentially corrupted save data."); }
        return false;
    }
}

/** Copies the generated save code to the clipboard */
function copySaveCode() {
    if (!saveCodeArea || !saveCodeArea.value) { showMessage("Generate save code first!", 1500, true); return; }
    navigator.clipboard.writeText(saveCodeArea.value).then(() => { if (copySaveButton) copySaveButton.textContent = "Copied!"; showMessage("Save code copied!", 1500, false); })
    .catch(err => {
        console.error('Clipboard API copy failed:', err); showMessage("Failed to copy automatically.", 2000, true);
        try { saveCodeArea.select(); saveCodeArea.setSelectionRange(0, 99999); document.execCommand('copy'); if (copySaveButton) copySaveButton.textContent = "Copied!"; showMessage("Copied! (Fallback)", 1500, false); }
        catch (e) { console.error('Legacy copy command failed:', e); showMessage("Copy failed. Please copy manually.", 2000, true); }
    });
}

/** Checks achievement conditions and updates state/UI */
function checkAchievements() {
    // Tutorial interaction change: REMOVED isTutorialRunning check (allow achievements during tutorial)
    // Still blocked if game isn't initialized or during prestige/intro/story
    if (!isGameInitialized || isPrestiging || isIntroSequenceActive || isStoryIntroRunning) return;

    let newlyUnlocked = []; let changed = false;
    achievementDefinitions.forEach(aDef => {
        if (!aDef || !aDef.id || typeof aDef.condition !== 'function') return;
        const wasUnlocked = achievements[aDef.id] === true; let shouldBeUnlocked = false;
        try { if (aDef.id === 'debug_unlock') aDef.condition = () => isDebugMenuUnlocked; shouldBeUnlocked = aDef.condition(); }
        catch (error) { console.error(`Error checking achievement '${aDef.id}':`, error); return; }
        if (shouldBeUnlocked && !wasUnlocked) {
            achievements[aDef.id] = true; newlyUnlocked.push(aDef); changed = true; console.log(`Achievement Unlocked: ${aDef.name}`);
            if (aDef.id === 'debug_unlock' && !isDebugMenuUnlocked) { isDebugMenuUnlocked = true; enableDebugFeatures(); saveGame(); }
        } else if (!shouldBeUnlocked && wasUnlocked) { /* Optional re-lock logic */ }
    });
    if (newlyUnlocked.length > 0) { showAchievementNotification(newlyUnlocked[0]); }
    const isAchievementsTabActive = document.getElementById('tab-content-achievements')?.classList.contains('active');
    if (changed && isAchievementsTabActive) { renderAchievements(); } else if (isAchievementsTabActive) { updateAchievementProgress(); }
}


/** Asks for confirmation before resetting game data */
function confirmResetGameData() {
    if (confirm("ARE YOU SURE you want to reset ALL progress?\nThis action cannot be undone! This includes Prestige, Upgrades, Achievements, Player Name, and Story progress.")) { resetGameData(); }
    else { showMessage("Reset cancelled.", 1500, false); }
}

/** Clears saved data from localStorage and reloads the page */
function resetGameData() { // Includes tutorialSeen = false
    console.log("Resetting game data...");
    try {
        tutorialSeen = false; console.log(`Reset Tutorial flag`);
        localStorage.removeItem(SAVE_KEY); console.log(`Removed item with key: ${SAVE_KEY}`);
        showMessage("Game data reset! Reloading...", 2000, false);
        setTimeout(() => { window.location.reload(); }, 1500);
    } catch (error) { console.error("Error resetting game data:", error); showMessage("Error resetting data.", 3000, true); }
}

console.log("Part 5: Core Game Logic Finished.");
// End of Block 7
// ==========================================================================
// Block 8 of 12: Effects & Display (Part 6 - Update Display, Renderers, Click FX)
// ==========================================================================
console.log("Part 6: Defining Effects & Display functions (Part 1)...");

/** Updates all major UI elements with current game state */
function updateDisplay() {
    // Allow updates if the game IS initialized OR story/tutorial is running,
    // OR if none of those are running but the main container is visible (initial state before loop)
    if (!isGameInitialized && !isStoryIntroRunning && !isTutorialRunning && !isIntroSequenceActive && !outerContainer?.classList.contains('visible')) {
        // If nothing relevant is running or visible, don't update.
        return;
    }

    try {
        // Update Potato Counts & Rates
        // Tutorial interaction change: Allow updates if game is initialized OR tutorial is running
        if (isGameInitialized || isTutorialRunning) {
            if (potatoCountDisplay) potatoCountDisplay.textContent = formatNumber(potatoCount);
            if (totalPotatoesDisplay) totalPotatoesDisplay.textContent = formatNumber(totalPotatoesHarvested);
            // Only show non-zero PPS if game is *fully* initialized (passive gain is off during tutorial)
            if (ppsDisplay) ppsDisplay.textContent = isGameInitialized ? formatNumber(potatoesPerSecond * prestigeMultiplier) : '0';
            // Show click power even during tutorial as clicks are active
            if (clickPowerDisplay) clickPowerDisplay.textContent = formatNumber(potatoesPerClick * prestigeMultiplier);
        } else { // Fallback for initial display before game loop/tutorial (e.g., if load fails)
             if (potatoCountDisplay) potatoCountDisplay.textContent = '0';
             if (totalPotatoesDisplay) totalPotatoesDisplay.textContent = '0';
             if (ppsDisplay) ppsDisplay.textContent = '0';
             if (clickPowerDisplay) clickPowerDisplay.textContent = '1'; // Base click power
        }

        // Update Prestige Info Line
        if (prestigeStatsLine) {
            if (prestigeLevel > 0) {
                prestigeStatsLine.style.display = 'block';
                if (prestigeLevelDisplay) prestigeLevelDisplay.textContent = prestigeLevel;
                if (prestigeMultiplierDisplay) prestigeMultiplierDisplay.textContent = `${prestigeMultiplier}x`;
            } else {
                prestigeStatsLine.style.display = 'none';
            }
        }

        // Update Popularity Card
        updatePopularity(); // This function handles its own logic

        // Update Prestige Tab elements
        const canPrestige = potatoCount >= currentPrestigeRequirement;
        if (prestigeButton) {
            // Disable during intros, tutorial, or if cannot afford/prestiging
            // Tutorial interaction change: Keep tutorial check here, prestige is blocked
            prestigeButton.disabled = !canPrestige || isPrestiging || isStoryIntroRunning || isTutorialRunning || isIntroSequenceActive;
            prestigeButton.classList.toggle('prestige-ready', canPrestige && !isPrestiging && !isStoryIntroRunning && !isTutorialRunning && !isIntroSequenceActive);
        }
        if (prestigeRequirementDisplay) { prestigeRequirementDisplay.textContent = formatNumber(currentPrestigeRequirement); }
        if (nextPrestigeLevelDisplay) { nextPrestigeLevelDisplay.textContent = prestigeLevel + 1; }
        if (currentPrestigeBonusDisplay) { currentPrestigeBonusDisplay.textContent = `${prestigeMultiplier}x`; }
        updatePrestigeReadiness();

        // Update Upgrade Button States
        document.querySelectorAll('.buy-button-dynamic').forEach(button => {
            const upgradeId = button.dataset.upgradeId;
            const upgrade = upgrades.find(u => u.id === upgradeId);
            if (upgrade) {
                const cost = calculateCost(upgrade);
                // Disable during intros, prestige, or if cannot afford
                // Tutorial interaction change: REMOVED isTutorialRunning check to allow buying
                button.disabled = potatoCount < cost || isPrestiging || isStoryIntroRunning || isIntroSequenceActive;
                const costSpan = button.querySelector('.cost');
                if (costSpan) costSpan.textContent = formatNumber(cost);
            } else { button.disabled = true; }
        });

        // Update Browser Title (only if game fully initialized)
        if (isGameInitialized) {
             document.title = `${formatNumber(potatoCount)} Potatoes - Potato Clicker`;
        } else {
             document.title = 'Potato Clicker'; // Default title before game starts or during intros/tutorial
        }

    } catch (e) {
        console.error("Error in updateDisplay:", e);
        if (gameLoopIntervalId) { console.error("Stopping game loop due to updateDisplay error."); clearInterval(gameLoopIntervalId); gameLoopIntervalId = null; }
    }
}

/** Updates the descriptive text in the prestige tab based on current potatoes vs requirement */
function updatePrestigeReadiness() {
    if (!prestigeReadinessText) return;
    const currentPotatoes = potatoCount;
    const requiredPotatoes = currentPrestigeRequirement;
    let textToShow = ""; let cssClass = "";
    if (currentPotatoes < requiredPotatoes) { textToShow = "Unworthy for ascension into Potateaven."; cssClass = "prestige-text-unworthy"; }
    else if (currentPotatoes >= requiredPotatoes && currentPotatoes < requiredPotatoes * PRESTIGE_BEYOND_FACTOR) { textToShow = "Potateaven awaits! Ready for Prestige."; cssClass = "prestige-text-ready"; }
    else { textToShow = "Radiating immense potato power! Ascension overdue!"; cssClass = "prestige-text-beyond"; }
    prestigeReadinessText.textContent = textToShow;
    prestigeReadinessText.className = `text-sm text-center mb-3 flex-shrink-0 ${cssClass}`;
}

/** Renders the list of upgrades in the Click and Passive tabs */
function renderUpgrades() {
    if (!clickUpgradesContainer || !passiveUpgradesContainer) { console.error("Upgrade container elements not found."); return; }
    clickUpgradesContainer.innerHTML = ''; passiveUpgradesContainer.innerHTML = '';
    upgrades.forEach((upgrade, index) => {
        let shouldRender = false; let targetContainer = null; let previousUpgradeOfType = null;
        if (upgrade.effectType === 'click') {
            targetContainer = clickUpgradesContainer;
            for (let i = index - 1; i >= 0; i--) { if (upgradeDefinitions[i]?.effectType === 'click') { previousUpgradeOfType = upgrades[i]; break; } }
        } else if (upgrade.effectType === 'passive') {
            targetContainer = passiveUpgradesContainer;
            for (let i = index - 1; i >= 0; i--) { if (upgradeDefinitions[i]?.effectType === 'passive') { previousUpgradeOfType = upgrades[i]; break; } }
        }
        // Render first upgrade of each type, or subsequent ones if previous is bought
        shouldRender = (previousUpgradeOfType === null) || (previousUpgradeOfType.level > 0);
        if (shouldRender && targetContainer) {
            const cost = calculateCost(upgrade);
            const upgradeElement = document.createElement('div');
            // Use items-start for correct vertical alignment within card
            upgradeElement.className = 'bg-amber-800/70 p-3 border-2 border-amber-600 flex items-start space-x-3';

            // Ensure HTML is generated correctly without extra spaces
            upgradeElement.innerHTML = `
<div class="upgrade-icon-wrapper flex-shrink-0 border-amber-500 p-1 bg-black/20 flex items-center justify-center">
  <img src="${upgrade.iconUrl || ''}" alt="${upgrade.name?.substring(0,1) || '?'}" class="w-full h-full object-contain" onerror="imageError(this, '${upgrade.name?.substring(0,1) || '?'}')">
</div>
<div class="flex-grow">
  <div class="flex justify-between items-center mb-1.5">
      <span class="font-semibold text-amber-100 upgrade-text-name">${upgrade.name || '?'}</span>
      <span class="font-medium text-amber-300 bg-black/30 px-2 py-0.5 rounded-sm upgrade-text-level">Lvl ${upgrade.level || 0}</span>
  </div>
  <p class="text-amber-300 mb-2 upgrade-text-desc">${upgrade.description || '?'}</p>
  <button data-upgrade-id="${upgrade.id}" class="pixel-button buy-button buy-button-dynamic w-full" onclick="buyUpgrade('${upgrade.id}')">
      Buy (<span class="cost">${formatNumber(cost)}</span> P)
  </button>
</div>`; // Ensure clean structure

            targetContainer.appendChild(upgradeElement);
        }
    });
    updateDisplay(); // Update button states after rendering
}

/** Renders the full achievement grid */
function renderAchievements() {
    if (!achievementsGrid) return;
    achievementsGrid.innerHTML = '';
    achievementDefinitions.forEach(aDef => {
        if (!aDef || !aDef.id) return;
        const isUnlocked = achievements[aDef.id] === true;
        const element = document.createElement('div');
        element.id = `ach-${aDef.id}`;
        element.className = `achievement-item achievement-tier-${aDef.tier || 'bronze'} ${isUnlocked ? 'unlocked' : ''}`;
        let progressText = 'Locked';
        if (isUnlocked) { progressText = 'Completed!'; }
        else { try { if (aDef.id === 'debug_unlock') aDef.condition = () => isDebugMenuUnlocked; progressText = aDef.progress ? aDef.progress() : '0 / ???'; } catch (e) { console.error(`Error getting progress for '${aDef.id}':`, e); progressText = 'Error'; } }
        element.innerHTML = `
          <img src="${aDef.icon || TROPHY_ICON_URL}" alt="${aDef.name?.substring(0, 1) || 'A'}" onerror="imageError(this,'T')">
          <span class="achievement-name">${aDef.name || '?'}</span>
          <span class="achievement-desc">${aDef.description || '?'}</span>
          <span class="achievement-progress">${progressText}</span>`;
        achievementsGrid.appendChild(element);
    });
}

/** Updates only the progress text and unlocked status of visible achievements */
function updateAchievementProgress() {
    if (!achievementsGrid) return;
    achievementDefinitions.forEach(aDef => {
        if (!aDef || !aDef.id) return;
        const element = document.getElementById(`ach-${aDef.id}`);
        if (element) {
            const progressSpan = element.querySelector('.achievement-progress');
            if (progressSpan) {
                const isUnlocked = achievements[aDef.id] === true; let progressText = 'Locked';
                if (isUnlocked) { progressText = 'Completed!'; }
                else { try { if (aDef.id === 'debug_unlock') aDef.condition = () => isDebugMenuUnlocked; progressText = aDef.progress ? aDef.progress() : '0 / ???'; } catch (e) { progressText = 'Error'; } }
                if (progressSpan.textContent !== progressText) { progressSpan.textContent = progressText; }
            }
            const currentlyHasClass = element.classList.contains('unlocked');
            if (achievements[aDef.id] === true && !currentlyHasClass) { element.classList.add('unlocked'); }
            else if (achievements[aDef.id] !== true && currentlyHasClass) { element.classList.remove('unlocked'); }
        }
    });
}

/** Spawns the visual click effects (potato image and +N text) */
function spawnClickAnimation(event, gain, isOnFire) {
    if (!clickArea) return;
    let x = clickArea.offsetWidth / 2; let y = clickArea.offsetHeight / 2;
    if (event && typeof event.clientX === 'number' && typeof event.clientY === 'number') {
        try { const rect = clickArea.getBoundingClientRect(); x = event.clientX - rect.left; y = event.clientY - rect.top; } catch (e) {}
    }
    const img = document.createElement('img'); img.src = ORIGINAL_POTATO_URL; img.alt = ""; img.className = 'click-animation-img';
    img.style.left = `${x - 14}px`; img.style.top = `${y - 14}px`;
    img.onerror = () => img.remove(); img.addEventListener('animationend', () => img.remove());
    clickArea.appendChild(img);
    const text = document.createElement('span'); text.textContent = `+${formatNumber(gain)}`;
    // Use `isGameInitialized` to determine fire color, as buff shouldn't show during tutorial
    text.style.cssText = `position: absolute; left: ${x - 15}px; top: ${y - 30}px; pointer-events: none; z-index: 11; font-size: 1rem; font-weight: bold; color: ${(isOnFire && isGameInitialized) ? '#ff8800' : '#fcd34d'}; text-shadow: 1px 1px 1px rgba(0,0,0,0.8); animation: click-effect-text ${CLICK_ANIMATION_DURATION_MS / 1000}s ease-out forwards;`;
    text.addEventListener('animationend', () => text.remove());
    clickArea.appendChild(text);
}
// End of Block 8
// ==========================================================================
// Block 9 of 12: Effects & Display (Part 6 - On Fire, Meteors, Cursors, Prestige FX, Notifications)
// ==========================================================================
console.log("Part 6: Defining Effects & Display functions (Part 2)...");

/** Activates the "On Fire" buff, increasing PPC */
function activateOnFire(now) {
    // This should only be called if game is initialized anyway due to checks in clickPotato/gameTick
    console.log("On Fire Activated!");
    isOnFireActive = true;
    onFireEndTime = now + ON_FIRE_DURATION_MS; // Set end time
    onFireCooldownEndTime = now + ON_FIRE_COOLDOWN_MS; // Set cooldown end time
    clickTimestamps = []; // Reset click timestamps for next check
    onFireStreakLevel++; // Increment streak level

    // Show message with duration of the buff
    showMessage(`POTATO ON FIRE! ${1 + onFireStreakLevel}x PPC! (Lvl ${onFireStreakLevel})`, ON_FIRE_DURATION_MS, false);

    // Change potato image and add shake animation
    if (mainPotatoImg) {
        mainPotatoImg.src = FIRE_POTATO_URL; // Use the fire potato image URL
        mainPotatoImg.classList.add('shake-animation'); // Add CSS class for shaking
    }

    // Check/Unlock the "Fast Finger" achievement
    if (!achievements['fast_finger']) {
        achievements['fast_finger'] = true;
        const achDef = achievementDefinitions.find(x => x.id === 'fast_finger');
        if (achDef) showAchievementNotification(achDef); // Show popup
        checkAchievements(); // Update achievement UI if needed
    }
}

/** Checks if the "On Fire" buff should expire */
function checkOnFireStatus(now) {
    // This function is only called by gameTick when isGameInitialized and !isTutorialRunning
    if (isOnFireActive && now >= onFireEndTime) {
        console.log("On Fire Expired.");
        isOnFireActive = false; // Deactivate buff
        onFireEndTime = 0; // Reset end time

        // Revert potato image and remove shake animation
        if (mainPotatoImg) {
            mainPotatoImg.src = ORIGINAL_POTATO_URL;
            mainPotatoImg.classList.remove('shake-animation');
        }

        // Show cooldown message
        const cooldownMinutesLeft = Math.ceil(Math.max(0, onFireCooldownEndTime - now) / 60000);
        showMessage(`On Fire cooling down... (${cooldownMinutesLeft} min left)`, 3000, true);
    }
}

/** Spawns a falling potato meteor event */
function spawnMeteor() {
    // Prevent spawning if already active, during prestige/story/tutorial, or if game not initialized
    // Tutorial interaction change: Keeping this blocked during tutorial
    if (meteorActive || isPrestiging || !isGameInitialized || isIntroSequenceActive || isStoryIntroRunning || isTutorialRunning) return;

    console.log("Spawning Meteor...");
    meteorActive = true; // Set flag

    // Show sky message
    if (meteorMessageContainer) {
        meteorMessageElement = document.createElement('p');
        meteorMessageElement.id = 'meteor-sky-message';
        meteorMessageElement.textContent = "A potato meteor falls!";
        meteorMessageContainer.innerHTML = ''; // Clear previous message
        meteorMessageContainer.appendChild(meteorMessageElement);
    }

    // Create and position meteor elements
    if (meteorContainer) {
        // Wrapper for positioning and animation
        meteorWrapperElement = document.createElement('div');
        meteorWrapperElement.id = 'potato-meteor-wrapper';
        meteorWrapperElement.style.left = `${10 + Math.random() * 70}%`; // Random horizontal start
        meteorWrapperElement.style.animationDuration = `${METEOR_FALL_DURATION_S}s`; // Set animation duration

        // The clickable meteor image
        meteorElement = document.createElement('img');
        meteorElement.id = 'potato-meteor';
        meteorElement.src = METEOR_IMAGE_URL;
        meteorElement.alt = 'Meteor';
        meteorElement.onerror = () => imageError(meteorElement, 'M');
        meteorElement.addEventListener('click', handleMeteorClick); // Add click listener

        // Append elements and start effects
        meteorWrapperElement.appendChild(meteorElement);
        meteorContainer.innerHTML = ''; // Clear previous meteor
        meteorContainer.appendChild(meteorWrapperElement);

        // Start fire particle trail
        clearInterval(fireParticleInterval);
        fireParticleInterval = setInterval(spawnFireParticle, METEOR_PARTICLE_INTERVAL_MS);

        // Set timeout to automatically remove the meteor if not clicked
        clearTimeout(meteorTimeoutId);
        const durationMs = METEOR_FALL_DURATION_S * 1000;
        let wrapperRef = meteorWrapperElement; // Capture current wrapper
        meteorTimeoutId = setTimeout(() => {
            console.log("Meteor timed out (not clicked).");
            removeMeteor(false, 0, wrapperRef); // Pass the specific wrapper
        }, durationMs + 500); // Add slight buffer

    } else {
        console.error("Meteor container not found! Cannot spawn meteor.");
        if (meteorMessageElement?.parentNode) meteorMessageElement.remove();
        meteorMessageElement = null; meteorActive = false;
    }
}

/** Spawns a single fire particle for the meteor trail */
function spawnFireParticle() {
    try {
        if (!meteorWrapperElement || !meteorContainer || !meteorActive) {
            clearInterval(fireParticleInterval); fireParticleInterval = null; return;
        }
        // Ensure getBoundingClientRect is called on a valid element attached to DOM
        if(!meteorWrapperElement.isConnected) {
             clearInterval(fireParticleInterval); fireParticleInterval = null; return;
        }
        const rect = meteorWrapperElement.getBoundingClientRect();
        const x = rect.left + (rect.width * 0.1) + (Math.random() * 40 - 20);
        const y = rect.top + (rect.height * 0.9) + (Math.random() * 20 - 10);
        const particle = document.createElement('img');
        particle.src = FIRE_TRAIL_IMAGE_URL; particle.className = 'fire-particle';
        particle.style.left = `${x}px`; particle.style.top = `${y}px`;
        particle.style.transform = `rotate(${Math.random() * 360}deg) scale(${0.8 + Math.random() * 0.4})`;
        particle.alt = "";
        // Append particle to meteorContainer which should always exist if meteor is active
        if (meteorContainer) meteorContainer.appendChild(particle);
        setTimeout(() => { if (particle.parentNode) particle.remove(); }, METEOR_PARTICLE_DURATION_MS);
    } catch (e) { console.error("Error spawning fire particle:", e); clearInterval(fireParticleInterval); fireParticleInterval = null; }
}

/** Handles clicking the falling meteor */
function handleMeteorClick() {
    // Tutorial interaction change: Keeping this blocked during tutorial
    if (!meteorActive || !meteorElement || isTutorialRunning) return;

    console.log("Meteor Clicked!");
    if (meteorElement) meteorElement.style.pointerEvents = 'none'; // Prevent multiple clicks
    clearTimeout(meteorTimeoutId); meteorTimeoutId = null; // Stop automatic removal

    // Calculate bonus
    const ppsBonus = (potatoesPerSecond * prestigeMultiplier * 60);
    const tphBonus = (totalPotatoesHarvested * 0.01);
    const bonusAmount = Math.max(1000, Math.min(1e9, Math.floor(ppsBonus + tphBonus)));

    // Award potatoes
    potatoCount += bonusAmount; totalPotatoesHarvested += bonusAmount;

    // Unlock achievement
    if (!achievements['meteor_clicker']) {
        achievements['meteor_clicker'] = true;
        const achDef = achievementDefinitions.find(x => x.id === 'meteor_clicker');
        if (achDef) showAchievementNotification(achDef);
        checkAchievements();
    }

    updateDisplay();
    removeMeteor(true, bonusAmount, meteorWrapperElement); // Remove visually
}

/** Removes the meteor elements and resets state */
function removeMeteor(clicked, bonusAmount = 0, wrapperToRemove = null) {
    const wrapper = wrapperToRemove || meteorWrapperElement; // Use the provided wrapper if available
    if (!meteorActive && !wrapper) return; // Exit if not active and no specific wrapper given

    const wasMeteorActive = meteorActive; // Store current state
    meteorActive = false; // Set inactive immediately

    clearTimeout(meteorTimeoutId); meteorTimeoutId = null;
    clearInterval(fireParticleInterval); fireParticleInterval = null;

    // Remove elements if they exist
    if (wrapper?.parentNode) { wrapper.remove(); }
    if (meteorMessageElement?.parentNode) { meteorMessageElement.remove(); }

    // Nullify references
    meteorElement = null; meteorWrapperElement = null; meteorMessageElement = null;

    // Schedule next meteor only if one was actually active
    if (wasMeteorActive) {
        nextMeteorTime = Date.now() + METEOR_INTERVAL_MS;
        console.log(`Next potential meteor scheduled around: ${new Date(nextMeteorTime).toLocaleTimeString()}`);
        if (clicked) { showMessage(`Meteor granted ${formatNumber(bonusAmount)} potatoes!`, 2500, false); }
        else { showMessage("Meteor got away!", 2000, true); }
    }
}


/** Checks if a meteor should spawn based on time */
function checkMeteorSpawn() {
    // This function is only called by gameTick when isGameInitialized and !isTutorialRunning
    const now = Date.now();
    if (isGameInitialized && !isPrestiging && !meteorActive && !isIntroSequenceActive && !isStoryIntroRunning && !isTutorialRunning && now >= nextMeteorTime) {
        spawnMeteor();
    }
}

/** Updates the orbiting cursor visuals based on glove upgrade level */
let cursorResizeTimer = null;
function updateCursors() {
    clearTimeout(cursorResizeTimer);
    cursorResizeTimer = setTimeout(() => {
        if (!cursorOrbitContainer || !potatoContainer) return;
        cursorOrbitContainer.innerHTML = '';
        const gloveUpgrade = upgrades.find(u => u.id === 'farmhand-gloves');
        const numberOfCursors = gloveUpgrade ? gloveUpgrade.level : 0;
        if (numberOfCursors === 0) { stopCursorAnimation(); return; }
        // Wait slighty longer if container size is still zero during init
        if (potatoContainer.offsetWidth === 0 || potatoContainer.offsetHeight === 0) {
            console.warn("Potato container size zero, delaying cursor update slightly more."); setTimeout(updateCursors, 200); return;
        }
        const containerSize = Math.min(potatoContainer.offsetWidth, potatoContainer.offsetHeight);
        const orbitRadius = containerSize * 0.30; // Adjust orbit radius based on actual container size
        for (let i = 0; i < numberOfCursors; i++) {
            const angle = (i / numberOfCursors) * 2 * Math.PI;
            const cursorImg = document.createElement('img');
            cursorImg.src = CURSOR_ICON_URL; cursorImg.alt = ""; cursorImg.className = 'cursor-image';
            cursorImg.dataset.angle = angle; cursorImg.dataset.radius = orbitRadius;
            cursorImg.onerror = () => imageError(cursorImg, 'C');
            const xPos = Math.cos(angle) * orbitRadius; const yPos = Math.sin(angle) * orbitRadius;
            const rotationDeg = (angle * 180 / Math.PI) + 90; // Adjust rotation if needed
            cursorImg.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${rotationDeg}deg)`;
            cursorOrbitContainer.appendChild(cursorImg);
        }
        startCursorAnimation();
    }, 50); // Keep short delay
}

/** Animates the orbiting cursors using requestAnimationFrame */
function animateCursors(timestamp) {
    if (!cursorAnimationId || !cursorOrbitContainer) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;
    // Reduce updates if tab is hidden or significant lag occurs
    if (document.hidden || elapsed > 500) {
        lastTimestamp = timestamp; cursorAnimationId = requestAnimationFrame(animateCursors); return;
    }

    const pulseSpeed = 0.0025; const minRadiusFactor = 0.85; const maxRadiusFactor = 1.0;
    const oscillation = (Math.sin(timestamp * pulseSpeed) + 1) / 2; // Value between 0 and 1
    const currentRadiusFactor = minRadiusFactor + (maxRadiusFactor - minRadiusFactor) * oscillation;

    const cursorImages = cursorOrbitContainer.querySelectorAll('.cursor-image');
    cursorImages.forEach(img => {
        if (img.dataset.angle && img.dataset.radius) {
            const angle = parseFloat(img.dataset.angle); const baseRadius = parseFloat(img.dataset.radius);
            const currentRadius = baseRadius * currentRadiusFactor; // Apply pulsing radius
            const xPos = Math.cos(angle) * currentRadius; const yPos = Math.sin(angle) * currentRadius;
            const rotationDeg = (angle * 180 / Math.PI) + 90; // Adjust rotation if needed
            img.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${rotationDeg}deg)`;
        }
    });

    lastTimestamp = timestamp;
    cursorAnimationId = requestAnimationFrame(animateCursors);
}

/** Starts the cursor animation loop if not already running */
function startCursorAnimation() { if (!cursorAnimationId) { lastTimestamp = 0; cursorAnimationId = requestAnimationFrame(animateCursors); } }
/** Stops the cursor animation loop */
function stopCursorAnimation() { if (cursorAnimationId) { cancelAnimationFrame(cursorAnimationId); cursorAnimationId = null; } }

/** Starts the prestige visual animation sequence */
function startPrestigeAnimation() {
    if (!prestigeAnimationOverlay || !prestigeFlashOverlay || isPrestiging) return;
    console.log("Starting Prestige Animation...");
    isPrestiging = true;
    // Make overlay visible and start fade in
    prestigeAnimationOverlay.style.opacity = '0'; prestigeAnimationOverlay.classList.add('show');
    void prestigeAnimationOverlay.offsetWidth; // Trigger reflow
    prestigeAnimationOverlay.style.opacity = '1';

    // After a delay, trigger flash and then fade out
    setTimeout(() => {
        if (!isPrestiging) return; // Check if prestige was cancelled somehow
        if (prestigeFlashOverlay) prestigeFlashOverlay.classList.add('flash');
        setTimeout(() => {
            if (!isPrestiging) return; // Check again
            if (prestigeAnimationOverlay) prestigeAnimationOverlay.style.opacity = '0'; // Fade out black overlay
            if (prestigeFlashOverlay) prestigeFlashOverlay.classList.remove('flash');
            // Wait for fade out before completing prestige logic
            setTimeout(() => {
                 if (prestigeAnimationOverlay) prestigeAnimationOverlay.classList.remove('show'); // Hide completely
                 completePrestige(); // Complete the state changes
                 }, 300); // Match opacity transition duration
        }, 300); // Duration of the flash effect itself
    }, 4000); // Duration of the main prestige animation (image grow)
}

/** Shows the achievement notification popup */
function showAchievementNotification(achievementData, isDebugMessage = false) {
    if (!achievementNotification || !achNotifyIcon || !achNotifyName) return;
    clearTimeout(achievementNotificationTimeout);
    achievementNotification.style.borderColor = ''; achNotifyIcon.style.display = 'block';
    const titleElement = achievementNotification.querySelector('.title');

    if (isDebugMessage) {
        achievementNotification.style.borderColor = '#16a34a'; // Green border for debug
        if (titleElement) titleElement.textContent = "Debug Message";
        achNotifyName.textContent = typeof achievementData === 'string' ? achievementData : (achievementData?.name || "Debug Info");
        achNotifyIcon.style.display = 'none'; // Hide trophy icon for debug
    } else if (achievementData) {
        achievementNotification.style.borderColor = getTierColor(achievementData.tier);
        if (titleElement) titleElement.textContent = "Achievement Unlocked!";
        achNotifyIcon.src = achievementData.icon || TROPHY_ICON_URL;
        achNotifyName.textContent = achievementData.name || "Achievement";
        achNotifyIcon.onerror = () => imageError(achNotifyIcon, 'A'); // Add error handler
    } else { return; } // Do nothing if no valid data

    achievementNotification.classList.remove('hide'); achievementNotification.classList.add('show');
    achievementNotificationTimeout = setTimeout(() => {
        achievementNotification.classList.remove('show'); achievementNotification.classList.add('hide');
    }, ACHIEVEMENT_NOTIFY_DURATION_MS);
}
// End of Block 9
// ==========================================================================
// Block 10 of 12: Effects & Display (Part 6 - Debug Menu Logic)
// ==========================================================================
console.log("Part 6: Defining Effects & Display functions (Part 3 - Debug)...");

/** Enables debug features visually and adds listener */
function enableDebugFeatures() {
    // Check if elements exist before manipulating
    if (!farmerIcon || !popularityChatBubble || !popularityCard) return;

    console.log("Enabling Debug Features");
    isDebugMenuUnlocked = true; // Ensure flag is set
    farmerIcon.src = POTATOHAX_ICON_URL; // Set debug icon
    farmerIcon.onerror = () => imageError(farmerIcon, 'D'); // Handle potential load error
    popularityChatBubble.textContent = "Click me ;)"; // Set debug message
    popularityChatBubble.classList.add('visible'); // Ensure bubble is visible
    popularityCard.classList.add('debug-active'); // Add class for styling (e.g., border)
    popularityCard.style.cursor = 'pointer'; // Change cursor to indicate clickable

    // Add click listener to open the debug menu (remove first to prevent duplicates)
    popularityCard.removeEventListener('click', openDebugMenu);
    popularityCard.addEventListener('click', openDebugMenu);

    // Re-check achievements in case the debug unlock achievement needs updating visually
    checkAchievements();
}

/** Disables debug features visually and removes listener */
function disableDebugFeatures() {
    // Check if elements exist before manipulating
    if (!farmerIcon || !popularityChatBubble || !popularityCard) return;

    console.log("Disabling Debug Features");
    // isDebugMenuUnlocked should be false before calling this, but ensure visuals revert
    updatePopularity(); // Revert icon and message to standard based on potato count
    popularityCard.classList.remove('debug-active'); // Remove debug styling
    popularityCard.style.cursor = 'default'; // Reset cursor

    // Remove the click listener
    popularityCard.removeEventListener('click', openDebugMenu);

    // Re-check achievements if needed (e.g., if debug achievement should be visually locked)
    checkAchievements();
}

/** Opens the debug menu modal */
function openDebugMenu() {
    // Prevent opening if not unlocked or modal doesn't exist
    // Also prevent opening during story/tutorial
    // Tutorial interaction change: Keeping this blocked during tutorial
    if (!isDebugMenuUnlocked || !debugMenuModal || isStoryIntroRunning || isTutorialRunning) return;

    // Pre-fill inputs with current values for convenience
    if (debugClickInput) debugClickInput.value = potatoesPerClick; // Base PPC
    if (debugIncomeInput) debugIncomeInput.value = potatoesPerSecond; // Base PPS
    if (debugPrestigeInput) debugPrestigeInput.value = prestigeLevel;
    if (debugPotatoInput) debugPotatoInput.value = formatNumber(potatoCount); // Use formatted number for large values

    // Show the modal
    openModal('debug-menu-modal'); // Use the central openModal function
}

/** Closes the debug menu modal */
function closeDebugMenu() {
    closeModal('debug-menu-modal'); // Use the central closeModal function
}

// --- Debug Action Functions ---
// These functions are called by buttons within the debug menu modal

/** Applies the value from the debug click modifier input */
function applyClickModifier() {
    if (!isDebugMenuUnlocked) return; // Safety check
    const value = parseInt(debugClickInput?.value);
    if (!isNaN(value) && value >= 1) {
        potatoesPerClick = value; // Set base PPC
        updateDisplay(); // Update UI
        showMessage(`Base PPC set to ${formatNumber(value)}`, 1500, false);
    } else {
        showMessage("Invalid Base PPC (Must be >= 1)", 1500, true);
    }
}

/** Applies the value from the debug income modifier input */
function applyIncomeModifier() {
    if (!isDebugMenuUnlocked) return; // Safety check
    const value = parseInt(debugIncomeInput?.value);
    if (!isNaN(value) && value >= 0) {
        potatoesPerSecond = value; // Set base PPS
        updateDisplay(); // Update UI
        showMessage(`Base PPS set to ${formatNumber(value)}/s`, 1500, false);
    } else {
        showMessage("Invalid Base PPS (Must be >= 0)", 1500, true);
    }
}

/** Applies the value from the debug prestige level input */
function applyPrestigeLevel() {
    if (!isDebugMenuUnlocked) return; // Safety check
    const value = parseInt(debugPrestigeInput?.value);
    if (!isNaN(value) && value >= 0) {
        prestigeLevel = value; // Set prestige level
        prestigeMultiplier = 1 + value; // Recalculate multiplier
        currentPrestigeRequirement = calculatePrestigeRequirement(value); // Recalculate requirement
        updateDisplay(); // Update UI (prestige line, bonus display, etc.)
        renderAchievements(); // Re-render achievements in case prestige level matters
        showMessage(`Prestige Lvl set to ${value}`, 1500, false);
        saveGame(); // Save the change immediately
    } else {
        showMessage("Invalid Prestige Lvl (Must be >= 0)", 1500, true);
    }
}

/** Applies the value from the debug potato count input */
function applyPotatoCount() {
    if (!isDebugMenuUnlocked) return; // Safety check
    const value = parseScientificInput(debugPotatoInput?.value); // Use parser for K, M, B, etc.
    if (!isNaN(value) && value >= 0) {
        potatoCount = value; // Set current potatoes
        updateDisplay(); // Update UI
        showMessage(`Current Potatoes set to ${formatNumber(value)}`, 1500, false);
    } else {
        showMessage("Invalid Potato Count (Use numbers or K, M, B, T...)", 2000, true);
    }
}

/** Gives a gift of potatoes based on current rates */
function givePotatoGift() {
    if (!isDebugMenuUnlocked) return; // Safety check
    // Calculate gift amount (e.g., 1 hour PPS + 1000 clicks worth)
    const ppsGain = potatoesPerSecond * prestigeMultiplier;
    const ppcGain = potatoesPerClick * prestigeMultiplier;
    const giftAmount = Math.max(10000, Math.floor((ppsGain * 3600) + (ppcGain * 1000))); // Ensure minimum gift

    potatoCount += giftAmount;
    totalPotatoesHarvested += giftAmount; // Add to total as well
    updateDisplay(); // Update UI
    showMessage(`Received ${formatNumber(giftAmount)} potatoes!`, 2000, false);
    checkAchievements(); // Check if gift triggered any achievements
}

/** Forces the prestige sequence to start (ignores requirement) */
function forcePrestige() {
    if (!isDebugMenuUnlocked) return; // Safety check
    if (isPrestiging) return; // Don't stack prestige animations
    startPrestigeAnimation(); // Start the visual sequence
    showMessage("Forcing Ascension!", 1500, false);
    closeDebugMenu(); // Close menu after action
}

/** Unlocks all defined achievements */
function unlockAllAchievements() {
    if (!isDebugMenuUnlocked) return; // Safety check
    let newUnlocks = 0;
    achievementDefinitions.forEach(aDef => {
        if (!achievements[aDef.id]) { // If not already unlocked
            achievements[aDef.id] = true;
            newUnlocks++;
            // Special check: If unlocking the debug achievement, enable features
            if (aDef.id === 'debug_unlock' && !isDebugMenuUnlocked) {
                 // This internal flag check is redundant if outer check passes, but safe
                isDebugMenuUnlocked = true;
                enableDebugFeatures();
            }
        }
    });
    renderAchievements(); // Update the grid visually
    showMessage(`Unlocked ${newUnlocks} new achievements!`, 2000, false);
    saveGame(); // Save the unlocked achievements
}

/** Resets all achievements (except potentially debug unlock if kept) */
function resetAchievements() {
    if (!isDebugMenuUnlocked) return; // Safety check
    achievements = {}; // Clear the achievements object
    // If debug is unlocked via achievement, resetting should re-lock it visually
    // Check if the debug achievement *definition* exists before trying to use its condition
    const debugAchDef = achievementDefinitions.find(a => a.id === 'debug_unlock');
    if(isDebugMenuUnlocked && debugAchDef){
        // Check if the condition now evaluates to false (since achievements['debug_unlock'] is gone)
        if (!debugAchDef.condition()) {
             isDebugMenuUnlocked = false; // Set flag false
             disableDebugFeatures(); // Update visuals
             console.log("Debug features disabled due to achievement reset.");
        }
    }
    renderAchievements(); // Update the grid visually
    showMessage(`Achievements Reset!`, 1500, false);
    saveGame(); // Save the reset state
}

/** Sets potato counts to extremely high values */
function beatGame() {
    if (!isDebugMenuUnlocked) return; // Safety check
    // Use a very large number, avoiding true Infinity for potential formatting issues
    const nearInfinity = Number.MAX_SAFE_INTEGER / 100; // Large, but manageable
    potatoCount = nearInfinity;
    totalPotatoesHarvested = Math.max(totalPotatoesHarvested, nearInfinity); // Ensure total isn't lower
    updateDisplay(); // Update UI
    showMessage("You beat the game... or did you?", 3000, false);
    closeDebugMenu();
}

/** Logs the current game state object to the browser console */
function showGameConsole() {
    if (!isDebugMenuUnlocked) return; // Safety check
    console.groupCollapsed("--- Current Game State ---"); // Use groupCollapsed for less initial clutter
    console.log(`Potatoes: ${formatNumber(potatoCount)} (${potatoCount})`);
    console.log(`Total Harvested: ${formatNumber(totalPotatoesHarvested)} (${totalPotatoesHarvested})`);
    console.log(`Base PPC: ${formatNumber(potatoesPerClick)} (Effective: ${formatNumber(potatoesPerClick * prestigeMultiplier)})`);
    console.log(`Base PPS: ${formatNumber(potatoesPerSecond)} (Effective: ${formatNumber(potatoesPerSecond * prestigeMultiplier)})`);
    console.log(`Prestige Lvl: ${prestigeLevel} (Multiplier: ${prestigeMultiplier}x)`);
    console.log(`Next Req: ${formatNumber(currentPrestigeRequirement)}`);
    console.log(`Total Clicks: ${totalClicks}`);
    console.log(`Debug Unlocked: ${isDebugMenuUnlocked}`);
    console.log(`Player Name: ${playerName}`);
    console.log(`Story Seen: ${hasSeenStoryIntro}`);
    console.log(`Tutorial Seen: ${tutorialSeen}`); // Added tutorial seen status
    console.log(`On Fire Active: ${isOnFireActive} (Streak Lvl: ${onFireStreakLevel})`);
    console.log(`On Fire Ends: ${onFireEndTime > 0 ? new Date(onFireEndTime).toLocaleTimeString() : 'N/A'}`);
    console.log(`On Fire Cooldown Ends: ${onFireCooldownEndTime > 0 ? new Date(onFireCooldownEndTime).toLocaleTimeString() : 'N/A'}`);
    console.log(`Meteor Active: ${meteorActive}`);
    console.log(`Next Meteor Spawn Approx: ${nextMeteorTime > 0 ? new Date(nextMeteorTime).toLocaleTimeString() : 'Not Scheduled'}`);
    console.log("Achievements:", achievements);
    console.log("Upgrades (Levels):", upgrades.map(u => ({ id: u.id, level: u.level })));
    console.groupEnd();
    showMessage("Current game state logged to browser console (F12)", 2000, false);
}

/** Triggers a meteor spawn immediately */
function debugTriggerMeteor() {
    if (!isDebugMenuUnlocked) return; // Safety check
    if (meteorActive) { showMessage("Meteor already active!", 1500, true); return; }
    // Tutorial interaction change: Keeping this blocked during tutorial
    if (isPrestiging || !isGameInitialized || isIntroSequenceActive || isStoryIntroRunning || isTutorialRunning) { showMessage("Cannot trigger meteor now (Game busy).", 1500, true); return; }
    console.log("Debug Trigger Meteor"); spawnMeteor(); showMessage("Debug Meteor Triggered!", 1500, false); closeDebugMenu();
}

/** Triggers the "On Fire" buff immediately */
function debugTriggerOnFire() {
    if (!isDebugMenuUnlocked) return; // Safety check
    const now = Date.now();
    if (isOnFireActive) { showMessage("Already On Fire!", 1500, true); return; }
    // Tutorial interaction change: Keeping this blocked during tutorial
    if (isPrestiging || !isGameInitialized || isIntroSequenceActive || isStoryIntroRunning || isTutorialRunning) { showMessage("Cannot trigger On Fire now (Game busy).", 1500, true); return; }
    console.log("Debug Trigger On Fire"); activateOnFire(now); closeDebugMenu();
}


console.log("Part 6: Effects & Display Finished.");
// End of Block 10
// ==========================================================================
// Block 11 of 12: Initialization & Game Loop (Part 7 - MODIFIED Game Start Flow)
// ==========================================================================
console.log("Part 7: Defining Initialization & Game Loop functions...");

/**
 * Central function to handle the flow after clicking "Start Game" on the main menu.
 * Decides whether to prompt for name, show story intro, or start the game directly.
 */
function triggerGameStartFlow() {
    console.log("-----> triggerGameStartFlow called! <-----");

    if (!introOverlay) {
        console.error("Cannot start game flow, main menu intro overlay missing.");
        // Attempt a graceful fallback if possible
        if (outerContainer) outerContainer.classList.add('visible');
        initializeGame(); // Try to initialize game anyway
        return;
    }

    // 1. Fade out the main menu intro overlay
    if (introPotatoInterval) {
        clearInterval(introPotatoInterval); // Stop falling potatoes
        introPotatoInterval = null;
        console.log("Stopped falling potatoes interval.");
    }
    introOverlay.classList.add('fade-out');
    console.log("Fading out main menu intro overlay.");

    // Add a delay matching the fade-out to avoid visual glitches before next step
    setTimeout(() => {
        if(introOverlay) introOverlay.classList.remove('visible', 'fade-out'); // Hide it completely

        // 2. Attempt to Load Save Data (This updates playerName and hasSeenStoryIntro flags)
        const loadedSuccessfully = loadFromLocalStorage(); // Try loading save first

        // 3. Decide Next Step based on loaded/default state
        if (!playerName || playerName === "Farmer") {
            // If name is still default after load attempt, means new player or corrupted name save
            console.log("Player name is default or missing, prompting for input.");
            promptPlayerName(); // This function will then call runStoryIntro
        } else {
            // Name exists, now check if story needs to be shown
            console.log(`Player name "${playerName}" found. Checking if story intro needs to run (Seen: ${hasSeenStoryIntro}).`);
            if (!hasSeenStoryIntro) {
                console.log("Story intro not seen yet. Running story intro.");
                runStoryIntro(playerName); // Run the story (endStoryIntro will handle tutorial check)
            } else {
                // Story already seen, check if tutorial needs to run (e.g., if save was old or reset)
                if (!tutorialSeen) {
                    console.log("Story seen, but tutorial flag not set. Starting tutorial.");
                    // Make game container visible before starting tutorial
                    if (outerContainer) {
                         outerContainer.classList.add('visible');
                         console.log("Made outerContainer visible for tutorial START.");
                    } else {
                         console.error("Cannot start tutorial: outerContainer not found! Initializing game directly.");
                         initializeGame(); // Fallback if container missing
                         return; // Stop here
                    }
                    startTutorial(); // Start tutorial directly
                } else {
                    console.log("Story and tutorial already seen. Initializing main game.");
                    // Ensure main game container is visible
                    if (outerContainer) outerContainer.classList.add('visible');
                    initializeGame(); // Start the game directly
                }
            }
        }
    }, INTRO_FADE_DURATION_MS); // Match the CSS fade duration
}


/** Initializes the main game state, loads data, starts loop */
function initializeGame() {
    // Prevent multiple initializations unless forced by specific scenarios (like after story/prestige/tutorial)
    if (isGameInitialized && !isStoryIntroRunning && !isPrestiging && !isTutorialRunning) {
        console.warn("Game initialize attempted, but already initialized and not returning from story/prestige/tutorial.");
        // Ensure main container is visible if re-initializing somehow
        if (outerContainer && !outerContainer.classList.contains('visible')) {
            outerContainer.classList.add('visible');
        }
        // Resume game loop if paused (safety check)
        if (!gameLoopIntervalId) {
            console.log("Resuming potentially paused game loop during re-init check.");
            gameLoopIntervalId = setInterval(gameTick, TICK_INTERVAL_MS);
        }
        return; // Exit if already initialized and running normally
    }

    console.log("--- Initializing Game Core Logic ---");

    // Set flags
    isGameInitialized = true;
    isIntroSequenceActive = false; // Mark that the initial disclaimer/studio/menu sequence is done
    isStoryIntroRunning = false; // Ensure story intro flag is false now
    isTutorialRunning = false; // Ensure tutorial flag is false now

    // Add core game listeners (like the potato button)
    if (potatoButton) {
        potatoButton.removeEventListener('click', clickPotato); // Remove first to be safe
        potatoButton.addEventListener('click', clickPotato);
        potatoButton.removeEventListener('touchstart', handlePotatoTouch);
        potatoButton.addEventListener('touchstart', handlePotatoTouch, { passive: false }); // Allow preventDefault
        console.log("Attached click and touch listeners to potato button.");
    } else {
        console.error("CRITICAL: Potato button not found during initialization! Clicking will not work.");
        showMessage("Error: Potato button missing!", 10000, true);
    }

    // Load game data if not already done by triggerGameStartFlow (e.g., on page refresh)
    // This ensures state is correct on refresh or if initializeGame is called after load attempt
    const loadedOnRefreshOrInitial = loadFromLocalStorage();

    // If no save loaded EVER (even by trigger flow), set defaults
    // This check might be redundant if triggerGameStartFlow handles the very first launch,
    // but serves as a safeguard if initializeGame is called directly somehow without prior load attempt.
    if (!loadedOnRefreshOrInitial && (!playerName || playerName === "Farmer")) {
        console.log("No valid save found & player name is default. Setting up NEW game state defaults (Safeguard).");
        // Reset state variables (should be default already, but explicit)
        potatoCount = 0; totalPotatoesHarvested = 0; prestigeLevel = 0; achievements = {}; totalClicks = 0; onFireStreakLevel = 0; isDebugMenuUnlocked = false;
        playerName = "Farmer"; hasSeenStoryIntro = false; tutorialSeen = false; // Ensure these are default
        upgrades.forEach(u => u.level = 0); // Reset levels

        // Calculate initial stats & requirement
        recalculateStats();
        currentPrestigeRequirement = calculatePrestigeRequirement(prestigeLevel);
    } else {
         console.log("Game state loaded or already set before final initialization.");
         // Ensure loaded state is consistent after potential load
         recalculateStats(); // Recalculate based on loaded upgrades
         currentPrestigeRequirement = calculatePrestigeRequirement(prestigeLevel); // Ensure requirement matches loaded level
    }

    // Initial UI Rendering based on loaded or default state
    console.log("Performing initial UI rendering...");
    renderUpgrades();
    renderAchievements();
    updateCursors();
    updateDisplay(); // Crucial final update after potential load/reset

    // Schedule first meteor check (give some initial delay)
    if (nextMeteorTime <= 0 || nextMeteorTime < Date.now()) {
        // Schedule 1-3 minutes from now approx for the first meteor
        nextMeteorTime = Date.now() + (METEOR_INTERVAL_MS / 3) + (Math.random() * METEOR_INTERVAL_MS / 3);
    }
    console.log(`Next potential meteor scheduled around: ${new Date(nextMeteorTime).toLocaleTimeString()}`);

    // Start the Game Loop if not already running (e.g., after story/prestige/tutorial)
    if (!gameLoopIntervalId) {
        clearInterval(gameLoopIntervalId); // Clear just in case
        gameLoopIntervalId = setInterval(gameTick, TICK_INTERVAL_MS);
        console.log(`Game loop started/resumed with interval ${TICK_INTERVAL_MS}ms.`);
    }

    // Add Global Event Listeners (Window level) if not added before
    window.removeEventListener('resize', updateCursors); // Prevent duplicates
    window.addEventListener('resize', updateCursors);
    console.log("Attached window resize listener.");

    // Sync Debug Features visuals based on final loaded/default state
    if (isDebugMenuUnlocked) {
        console.log("Enabling debug features based on final state.");
        enableDebugFeatures();
    } else {
        console.log("Disabling debug features based on final state.");
        disableDebugFeatures();
    }

    // Ensure main game container is visible now that initialization is done
    if (outerContainer) outerContainer.classList.add('visible');

    console.log("--- Game Initialization Complete ---");
}

/** Handler for touch events on the potato to simulate a click */
function handlePotatoTouch(e) {
    // Prevent default touch behavior like scrolling or zooming on the button
    e.preventDefault();
    // Process the first touch point
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        // Create a synthetic mouse event to pass coordinates if needed by animations
        // Use clientX/clientY which are relative to the viewport
        const clickEvent = new MouseEvent('click', {
            bubbles: true, cancelable: true, clientX: touch.clientX, clientY: touch.clientY
        });
        clickPotato(clickEvent); // Call the main click handler
    }
}


// --- Game Tick (Main Loop) ---
function gameTick() {
    // Pause game loop ONLY during prestige, if initial intro sequence is active, or if story intro is active.
    // Tutorial interaction change: REMOVED !isGameInitialized and isTutorialRunning from the main blocking check.
    // Game Tick NEEDS to run during tutorial for UI updates and interaction checks.
    if (isPrestiging || isIntroSequenceActive || isStoryIntroRunning) {
        // Log why tick is paused if needed for debugging
        // console.log(`Game Tick Paused: Prestiging=${isPrestiging}, IntroActive=${isIntroSequenceActive}, StoryRunning=${isStoryIntroRunning}`);
        return; // Do nothing if paused by these specific states
    }

    const now = Date.now();
    tickCounter++;

    // --- Conditionally execute parts based on full game initialization AND tutorial status ---
    // Tutorial interaction change: These sections only run if game is fully initialized AND tutorial is NOT running
    if (isGameInitialized && !isTutorialRunning) {
        // 1. Passive Gain
        passivePotatoGeneration();

        // 2. Event Checks
        checkOnFireStatus(now);
        checkMeteorSpawn();

        // 5. Auto-Save
        if (tickCounter % 60 === 0) {
            saveGame();
        }
    }

    // --- Always execute these parts (as long as tick runs) ---

    // 3. Achievement Checks (less frequently) - Requires isGameInitialized to be meaningful
    // Tutorial interaction change: Check achievements if game is initialized, even if tutorial just ended
    if (isGameInitialized && tickCounter % 5 === 0) {
         checkAchievements();
    }

    // 4. UI Update (every tick for smooth counters)
    // updateDisplay handles its own internal logic regarding tutorial/init state
    updateDisplay();


    // Reset counter periodically to prevent potential overflow issues if game runs for very long
    if (tickCounter > 6000) { // Example: Reset every ~100 minutes
        // console.log("Resetting tickCounter"); // Debug log if needed
        tickCounter = 0;
    }
}
// End of Block 11
// ==========================================================================
// Block 12 of 12: Initial Setup Execution & Global Listeners
// ==========================================================================
console.log("Running initial listeners setup...");

// Listener for the VERY FIRST "I understand" button
if (preIntroButton) {
    preIntroButton.removeEventListener('click', handlePreIntroClick); // Prevent multiple listeners
    preIntroButton.addEventListener('click', handlePreIntroClick);
    console.log("Attached initial listener to pre-intro button.");
} else {
    // Critical error if this button is missing
    console.error("CRITICAL: Pre-intro button (#pre-intro-button) not found! Intro sequence cannot start.");
    // Display a visible error message to the user if the button is missing
    document.body.innerHTML = '<p style="color:red; font-family:sans-serif; padding:20px; text-align:center;">Error: Game cannot start. HTML element #pre-intro-button is missing.</p>';
}

// Listener for the music toggle in settings modal
if (musicToggleButton) {
     musicToggleButton.removeEventListener('change', toggleMusic); // Prevent multiple listeners
     musicToggleButton.addEventListener('change', toggleMusic);
     console.log("Attached listener to music toggle button.");
} else {
    console.warn("Music toggle button (#music-toggle) not found.");
}

// Listener for Replay Story Button
if (replayStoryButton) {
    replayStoryButton.removeEventListener('click', handleReplayStoryClick); // Prevent multiple listeners
    replayStoryButton.addEventListener('click', handleReplayStoryClick);
    console.log("Attached listener to replay story button.");
} else {
    console.warn("Replay Story button (#replay-story-button) not found.");
}

/** Handles clicking the "Watch Story Intro Again" button */
function handleReplayStoryClick() {
     // Prevent replay if story, prestige, or tutorial is already running
     if (isStoryIntroRunning || isPrestiging || isTutorialRunning) {
         showMessage("Cannot watch story now (Busy).", 1500, true);
         return;
     }
     // Ensure player name is set (should be loaded/default by now)
     if (!playerName) {
          console.error("Cannot replay story, player name not set.");
          showMessage("Error: Player name missing.", 1500, true);
          return;
     }

     console.log("Replaying story intro...");
     // Run the story intro - it handles pausing loop/music inside
     runStoryIntro(playerName);
}

// Global resize listener for updating cursors
window.removeEventListener('resize', updateCursors); // Prevent duplicates
window.addEventListener('resize', updateCursors);
console.log("Attached window resize listener.");

// --- FINAL SCRIPT LOG ---
console.log("Potato Clicker Script: All blocks defined and initial listeners attached.");
// End of script.js
