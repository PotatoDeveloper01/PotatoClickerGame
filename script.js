"use strict"; // Enforce stricter parsing and error handling
console.log("Executing Script: Part 3a - Constants & State Variables...");

// --- Game Constants ---
// Timing Constants (in milliseconds unless otherwise specified)
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

// Gameplay Constants
const BASE_PRESTIGE_REQUIREMENT = 10_000_000_000; // 10 Billion Potatoes
const PRESTIGE_REQUIREMENT_MULTIPLIER = 2;
const PRESTIGE_BEYOND_FACTOR = 100;
const ON_FIRE_CLICK_THRESHOLD = 500;
const ON_FIRE_TIME_WINDOW_MS = 60000; // 1 minute

// Storage Key
const SAVE_KEY = 'potatoClickerSave_v7.1'; // Versioned key

// --- Game State Variables ---
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
let isIntroSequenceActive = true; // Start in intro
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

console.log("Part 3a finished.");
// End of Part 3a
// --- DOM Elements ---
console.log("Part 3b: Selecting DOM elements...");

// Intro Sequence Elements
const preIntroOverlay = document.getElementById('pre-intro-overlay');
const preIntroButton = document.getElementById('pre-intro-button');
const preIntroFlash = document.getElementById('pre-intro-flash');
const studioIntroOverlay = document.getElementById('studio-intro-overlay');
const studioLogo = document.getElementById('studio-logo');
const introOverlay = document.getElementById('intro-overlay');
const introPotatoContainer = document.getElementById('intro-potato-container');
const introTitleImage = document.getElementById('intro-title-image');
const introPromptText = document.getElementById('intro-prompt-text');
const introMenuButtons = document.getElementById('intro-menu-buttons');
const introStartButton = document.getElementById('intro-start-button');
const introSettingsButton = document.getElementById('intro-settings-button');
const introCreditsButton = document.getElementById('intro-credits-button');
const introUpdatesButton = document.getElementById('intro-updates-button');

// Main Game Container
const outerContainer = document.querySelector('.outer-container');
const backgroundMusic = document.getElementById('background-music');

// Left Zone Elements
const statsDisplay = document.getElementById('stats-display');
const prestigeStatsLine = document.getElementById('prestige-stats-line');
const prestigeLevelDisplay = document.getElementById('prestige-level');
const prestigeMultiplierDisplay = document.getElementById('prestige-multiplier');
const potatoCountDisplay = document.getElementById('potato-count');
const totalPotatoesDisplay = document.getElementById('total-potatoes');
const ppsDisplay = document.getElementById('pps');
const clickPowerDisplay = document.getElementById('click-power-stat');
const clickArea = document.getElementById('click-area');
const potatoContainer = document.getElementById('potato-container'); // Inner container for potato/cursors
const cursorOrbitContainer = document.getElementById('cursor-orbit-container');
const potatoButton = document.getElementById('potato-button');
const mainPotatoImg = document.getElementById('main-potato-img');
const popularityCard = document.getElementById('popularity-card');
const popularityLevelDisplay = document.getElementById('popularity-level');
const popularityChatBubble = document.getElementById('popularity-chat-bubble');
const farmerIcon = document.getElementById('farmer-icon');
const messageBox = document.getElementById('message-box');

// Middle Zone Elements
const clickUpgradesContainer = document.getElementById('click-upgrades-container');
const passiveUpgradesContainer = document.getElementById('passive-upgrades-container');

// Right Zone Elements
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

// Other UI Elements
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

// Modal Elements
const settingsModal = document.getElementById('settings-modal');
const creditsModal = document.getElementById('credits-modal');
const updatesModal = document.getElementById('updates-modal');
const musicToggleButton = document.getElementById('music-toggle');

console.log("Part 3b finished.");
// End of Part 3b
// --- URLs ---
console.log("Part 3c: Defining URLs & Data Definitions...");
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
    // Click Upgrades
    { id: 'farmhand-gloves', name: 'Gloves', description: '+1 PPC', baseCost: 10, costIncreaseFactor: 1.12, effectType: 'click', effectValue: 1, iconUrl: GLOVES_ICON_URL },
    { id: 'better-seeds', name: 'Seeds', description: '+3 PPC', baseCost: 75, costIncreaseFactor: 1.15, effectType: 'click', effectValue: 3, iconUrl: 'https://media-hosting.imagekit.io/27fd4976da254899/Gemini_Generated_Image_j0wn03j0wn03j0wn-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=fix1CKOhKcY97XdA4ScNqMFSqh2N4vCyTqAQzdf3RpyX1KZmfht5BXq9Z0a4AHRny1hPhfICo85iLY61w6CFgEPQnMwc8R5UeuuL~C0Bne4FCaxwTIN~j8VZkGuACMuyaCDvevZqjnyTcRV4K~C2BWhwQAGztRIBCeb-PTpKsXKj6fvxbmC1DhRqUwqtyTUWYmrhXKWXSVMy3d5NX-1q-cn6VQq8lWG0nMostcqtGrhRjf5iAiJ7XREQVyo6KF3bqlvKUEUjaXxHfwKSNrbsCvrOTyb~1eIFuEDtl58lNDawAqalDzAWVbhCW~-WxY6EqCLcf9rxPEUQAw3D4S7t-g__' },
    { id: 'sturdy-shovel', name: 'Shovel', description: '+10 PPC', baseCost: 500, costIncreaseFactor: 1.18, effectType: 'click', effectValue: 10, iconUrl: SHOVEL_ICON_URL },
    { id: 'fertilizer', name: 'Fertilizer', description: '+25 PPC', baseCost: 2500, costIncreaseFactor: 1.19, effectType: 'click', effectValue: 25, iconUrl: FERTILIZER_ICON_URL },
    { id: 'magic-wateringcan', name: 'Water Can', description: '+50 PPC', baseCost: 12000, costIncreaseFactor: 1.20, effectType: 'click', effectValue: 50, iconUrl: WATERCAN_ICON_URL },
    { id: 'enriched-soil', name: 'Soil', description: '+250 PPC', baseCost: 75000, costIncreaseFactor: 1.22, effectType: 'click', effectValue: 250, iconUrl: 'https://media-hosting.imagekit.io/c4269fd294504d45/Gemini_Generated_Image_e2faqde2faqde2fa-removebg-preview.png?Expires=1840547551&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=tPxXTU9psc2jl1~PGyio8ioYixDgs3lPEqddvPZEXHZNLm7dQaYuVHLZWuQmQW1JCIFQMDIR~88mW5zQkUr9zMOh8-JwP3aASG-LbJTlHoGqG~tYusi65G4rGrsMOgqpp7ZVTihp2TN2JYQrJ4UawT4Uc9dm34XDYFhSOlxWhAI8FwRQiqPl6~62aBts5BNadJrss6QwrMA864V~mSxwNt3d2UbM867ar34bVTNRpLwn0NlDm2lhMxhpL1Fwcf5PvATqa5Dov0u5gKJTRiEDxZnnkDi2mgCv4u2ggxwngfCxmDUkbkMRnpq9TLU0~CdlU2tlpd6an-85qMu7K4f1hg__' },
    { id: 'tractor', name: 'Tractor', description: '+1k PPC', baseCost: 400000, costIncreaseFactor: 1.23, effectType: 'click', effectValue: 1000, iconUrl: TRACTOR_ICON_URL },
    { id: 'potato-fries', name: 'Fries', description: '+5k PPC', baseCost: 2500000, costIncreaseFactor: 1.25, effectType: 'click', effectValue: 5000, iconUrl: FRIES_ICON_URL },
    { id: 'gmp', name: 'GMP', description: '+25k PPC', baseCost: 15000000, costIncreaseFactor: 1.27, effectType: 'click', effectValue: 25000, iconUrl: GMP_ICON_URL },
    // Passive Upgrades
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
     if (!upgrade || typeof upgrade.baseCost !== 'number' || typeof upgrade.costIncreaseFactor !== 'number') return Infinity;
     const level = Math.max(0, Math.floor(upgrade.level || 0));
     return Math.floor(upgrade.baseCost * Math.pow(upgrade.costIncreaseFactor, level));
}

function calculatePrestigeRequirement(level) {
    return BASE_PRESTIGE_REQUIREMENT * Math.pow(PRESTIGE_REQUIREMENT_MULTIPLIER, Math.max(0, level));
}

function showMessage(text, duration = MESSAGE_DURATION_MS, isError = true) {
     if (!messageBox) return;
     messageBox.textContent = text;
     messageBox.style.color = isError ? '#f87171' : '#86efac';
     clearTimeout(messageTimeout);
     if (duration > 0) {
         messageTimeout = setTimeout(() => {
              if (messageBox.textContent === text) { messageBox.textContent = ''; }
         }, duration);
     }
}

function imageError(element, fallbackText = '?') {
    console.warn("Failed to load image:", element?.src);
    if (!element || !element.parentNode) return;
    const fallback = document.createElement('span');
    fallback.className = (element.className || '') + ' img-fallback flex items-center justify-center bg-red-900/50 text-red-300';
    fallback.style.width = element.offsetWidth > 0 ? `${element.offsetWidth}px` : '40px';
    fallback.style.height = element.offsetHeight > 0 ? `${element.offsetHeight}px` : '40px';
    fallback.style.fontSize = '1rem'; fallback.textContent = fallbackText;
    try { element.replaceWith(fallback); }
    catch (e) { console.error("Could not replace image element:", e); element.style.display = 'none'; if (element.parentNode) { element.parentNode.insertBefore(fallback, element); } }
}

function parseScientificInput(input) {
     if (typeof input !== 'string') return NaN;
     input = input.trim().toUpperCase().replace(/,/g, ''); let multiplier = 1;
     if (input.endsWith('K')) { multiplier = 1e3; input = input.slice(0, -1); }
     else if (input.endsWith('M')) { multiplier = 1e6; input = input.slice(0, -1); }
     else if (input.endsWith('B')) { multiplier = 1e9; input = input.slice(0, -1); }
     else if (input.endsWith('T')) { multiplier = 1e12; input = input.slice(0, -1); }
     else if (input.endsWith('QA')) { multiplier = 1e15; input = input.slice(0, -2); }
     else if (input.endsWith('QI')) { multiplier = 1e18; input = input.slice(0, -2); }
     else if (input.endsWith('SX')) { multiplier = 1e21; input = input.slice(0, -2); }
     else if (input.endsWith('SP')) { multiplier = 1e24; input = input.slice(0, -2); }
     else if (input.endsWith('OC')) { multiplier = 1e27; input = input.slice(0, -2); }
     const numberPart = Number(input); if (isNaN(numberPart)) return NaN;
     return numberPart * multiplier;
}

function openModal(modalId) {
    const modal = document.getElementById(modalId); if (modal) { modal.classList.add('show'); console.log(`Opened modal: ${modalId}`); } else { console.error(`Modal with ID "${modalId}" not found.`); }
}

function closeModal(modalId) {
     const modal = document.getElementById(modalId); if (modal) { modal.classList.remove('show'); console.log(`Closed modal: ${modalId}`); }
}

function getTierColor(tier) {
    switch(tier?.toLowerCase()) { case 'bronze': return '#cd7f32'; case 'silver': return '#c0c0c0'; case 'gold': return '#ffd700'; case 'platinum': return '#e5e4e2'; default: return '#a16207'; }
}

// --- Tab Switching Logic ---
function switchTab(tabId) {
     if (isPrestiging || (!isGameInitialized && !outerContainer?.classList.contains('visible'))) return;
     console.log(`Switching tab to: ${tabId}`); const middleTabs = ['clicks','income']; const rightTabs = ['achievements','prestige','save']; const allTabs = [...middleTabs, ...rightTabs]; const rightZone = document.querySelector('.right-zone');
     allTabs.forEach(t => { document.getElementById('tab-btn-'+t)?.classList.remove('active'); document.getElementById('tab-content-'+t)?.classList.remove('active'); });
     document.getElementById('tab-btn-'+tabId)?.classList.add('active'); document.getElementById('tab-content-'+tabId)?.classList.add('active');
     if (window.innerWidth > 1024) { if (rightTabs.includes(tabId)) { rightZone?.classList.add('open'); } else { rightZone?.classList.remove('open'); } } else { rightZone?.classList.remove('open'); }
     if (tabId === 'achievements') { updateAchievementProgress(); } // Defined in Part 6
}

console.log("Part 3: Initial Setup & Constants Finished.");
// End of Part 3

// ==========================================================================
// Part 4: Intro Sequence Logic
// ==========================================================================
console.log("Part 4: Defining Intro Sequence functions...");

function handlePreIntroClick() { /* ... (Paste from Response #30) ... */ }
function showStudioIntro() { /* ... (Paste from Response #30) ... */ }
function hideStudioIntro() { /* ... (Paste from Response #30, includes 2nd flash) ... */ }
function startMainIntro() { /* ... (Paste from Response #30, includes logging/fixes) ... */ }
function createFallingPotato() { /* ... (Paste from Response #30) ... */ }
function showIntroMenu(event) { /* ... (Paste from Response #30, includes logging/fixes) ... */ }
function startGameFromIntro() { /* ... (Paste from Response #30) ... */ }
function handleSettingsClick() { /* ... (Paste from Response #30) ... */ }
function handleCreditsClick() { /* ... (Paste from Response #30) ... */ }
function handleUpdatesClick() { /* ... (Paste from Response #30) ... */ }
function toggleMusic() { /* ... (Paste from Response #30) ... */ }
// (Paste the full code for the functions above from Response #30 here)
/** Handles the click on the "I understand" button in the pre-intro */
function handlePreIntroClick() {
    console.log("[Intro Step 1] 'I understand' clicked.");
    if (!preIntroOverlay || !preIntroFlash) {
        console.error("handlePreIntroClick: Missing required elements (preIntroOverlay, preIntroFlash). Attempting fallback.");
        showStudioIntro(); if(preIntroOverlay) preIntroOverlay.classList.add('hidden'); return;
    }
    if (backgroundMusic && backgroundMusic.paused) {
         backgroundMusic.play().then(() => { console.log("Background music started successfully via handlePreIntroClick."); if(musicToggleButton) musicToggleButton.checked = true; })
         .catch(error => { console.error("Audio playback failed on pre-intro click:", error); if(musicToggleButton) musicToggleButton.checked = false; });
    } else if (musicToggleButton && backgroundMusic) { musicToggleButton.checked = !backgroundMusic.paused; }
    preIntroOverlay.classList.add('hidden'); preIntroFlash.classList.add('flash');
    console.log("[Intro Step 1] Pre-intro hidden, first flash triggered.");
    setTimeout(() => { console.log("[Intro Step 1] First flash finished."); if(preIntroFlash) preIntroFlash.classList.remove('flash'); showStudioIntro(); }, FLASH_DURATION_MS);
}
/** Shows the studio intro screen */
function showStudioIntro() {
    console.log("[Intro Step 2] Showing studio intro.");
    if (!studioIntroOverlay || !studioLogo) { console.error("showStudioIntro: Missing required elements. Skipping to main intro."); startMainIntro(); return; }
    studioIntroOverlay.classList.add('visible'); studioLogo.classList.remove('animate'); void studioLogo.offsetWidth; studioLogo.classList.add('animate'); console.log("[Intro Step 2] Studio intro visible, logo animation started.");
    setTimeout(hideStudioIntro, STUDIO_DISPLAY_DURATION_MS);
}
/** Hides the studio intro, flashes again, and transitions to the main intro */
function hideStudioIntro() {
    console.log("[Intro Step 3] Hiding studio intro.");
    if (!studioIntroOverlay || !preIntroFlash) { console.error("hideStudioIntro: Missing required elements. Skipping flash."); startMainIntro(); return; }
    studioIntroOverlay.classList.add('fade-out'); console.log("[Intro Step 3] Studio intro fading out.");
    setTimeout(() => {
        console.log("[Intro Step 3] Studio intro fade-out finished."); studioIntroOverlay.classList.remove('visible', 'fade-out'); if (studioLogo) studioLogo.classList.remove('animate');
        preIntroFlash.classList.add('flash'); console.log("[Intro Step 3] Second flash triggered.");
        setTimeout(() => { console.log("[Intro Step 3] Second flash finished."); preIntroFlash.classList.remove('flash'); startMainIntro(); }, FLASH_DURATION_MS);
    }, STUDIO_FADE_DURATION_MS);
}
/** Starts the main (falling potato) intro */
function startMainIntro() {
    console.log("[Intro Step 4] Starting main intro (falling potatoes).");
    if (!introOverlay || !introPotatoContainer || !introTitleImage || !introPromptText) { console.error("startMainIntro: Missing required elements. Attempting fallback game start."); startGameFromIntro(); return; }
    introOverlay.classList.add('visible'); console.log("[Intro Step 4] Main intro overlay visible.");
    clearInterval(introPotatoInterval);
    introPotatoInterval = setInterval(() => { if (!introPotatoContainer) { clearInterval(introPotatoInterval); return; } if (introPotatoContainer.children.length < INTRO_POTATO_LIMIT) { for (let i = 0; i < INTRO_POTATO_DENSITY; i++) { createFallingPotato(); } } }, INTRO_POTATO_INTERVAL_MS);
    console.log("[Intro Step 4] Falling potato interval started.");
    setTimeout(() => { if (introTitleImage) { introTitleImage.classList.remove('animate-fade-out'); introTitleImage.classList.add('animate-pop-in'); console.log("[Intro Step 4] Title image pop-in triggered."); } else { console.warn("startMainIntro: Title image element not found for animation."); } }, INTRO_TITLE_DELAY_MS);
    setTimeout(() => {
         console.log("[Intro Step 4] Timer fired for showing prompt text and adding overlay listener.");
         if (introPromptText) { introPromptText.style.display = 'block'; void introPromptText.offsetWidth; introPromptText.classList.add('animate-fade-in'); console.log("[Intro Step 4] Prompt text fade-in class added."); } else { console.error("startMainIntro: Prompt text element missing!"); }
         if (introOverlay) { introOverlay.removeEventListener('click', showIntroMenu); introOverlay.addEventListener('click', showIntroMenu, { once: true }); introOverlay.style.cursor = 'pointer'; console.log("[Intro Step 4] Click listener added to intro overlay."); } else { console.error("startMainIntro: Intro overlay element missing!"); }
    }, INTRO_PROMPT_DELAY_MS);
}
/** Creates a single falling potato for the intro animation */
function createFallingPotato() { if (!introPotatoContainer) return; try { const p = document.createElement('img'); p.src = INTRO_POTATO_URL; p.className = 'intro-potato'; p.style.left = `${Math.random() * 100}%`; const d = 3 + Math.random() * 2; p.style.animationDuration = `${d}s`; p.onerror = () => { if(p.parentNode) p.remove(); }; introPotatoContainer.appendChild(p); setTimeout(() => { if (p.parentNode) p.remove(); }, d * 1000 + 200); } catch (e) { console.error("Error creating falling potato:", e); clearInterval(introPotatoInterval); introPotatoInterval = null; } }
/** Shows the main intro menu buttons after clicking the falling potato screen */
function showIntroMenu(event) { if (event) event.stopPropagation(); console.log("[Intro Step 5] ----> showIntroMenu function started! <-----"); if (!introTitleImage || !introPromptText || !introMenuButtons || !introOverlay) { console.error("showIntroMenu: Missing required elements!"); return; } if (introMenuButtons.classList.contains('visible')) { console.warn("showIntroMenu called again, menu already visible."); return; } introOverlay.removeEventListener('click', showIntroMenu); introTitleImage.classList.remove('animate-pop-in'); introTitleImage.classList.add('animate-fade-out'); console.log("[Intro Step 5] Title image fade-out triggered."); introPromptText.style.display = 'none'; introOverlay.style.cursor = 'default'; console.log("[Intro Step 5] Prompt text hidden, cursor reset."); console.log("[Intro Step 5] Attempting to show menu buttons. Element selected:", introMenuButtons); if (introMenuButtons) { introMenuButtons.classList.add('visible'); console.log("[Intro Step 5] Added '.visible' class to introMenuButtons."); setTimeout(() => { if (introMenuButtons) { try { const s = window.getComputedStyle(introMenuButtons); console.log("[Intro Step 5 - Debug Check] Computed styles - display:", s.display, "opacity:", s.opacity); } catch (e) { console.error("Could not get computed styles for introMenuButtons", e)} } }, 50); } else { console.error("showIntroMenu: Cannot show menu buttons - introMenuButtons element not found!"); return; } console.log("[Intro Step 5] Attaching listeners to menu buttons..."); introStartButton?.removeEventListener('click', startGameFromIntro); introStartButton?.addEventListener('click', startGameFromIntro); introSettingsButton?.removeEventListener('click', handleSettingsClick); introSettingsButton?.addEventListener('click', handleSettingsClick); introCreditsButton?.removeEventListener('click', handleCreditsClick); introCreditsButton?.addEventListener('click', handleCreditsClick); introUpdatesButton?.removeEventListener('click', handleUpdatesClick); introUpdatesButton?.addEventListener('click', handleUpdatesClick); console.log("[Intro Step 5] Menu button listeners attached."); }
/** Starts the actual game after clicking "Start Game" */
function startGameFromIntro() { console.log("[Intro Step 6] ----> startGameFromIntro function started! <-----"); if (!introOverlay || !outerContainer) { console.error("Cannot start game, intro or outer container missing."); return; } if (isGameInitialized) { console.warn("startGameFromIntro called, but game is already initialized."); if (introOverlay.classList.contains('visible')) { console.log("Hiding lingering intro overlay."); introOverlay.classList.add('fade-out'); setTimeout(() => { introOverlay.classList.remove('visible', 'fade-out'); }, INTRO_FADE_DURATION_MS); } return; } if (introPotatoInterval) { clearInterval(introPotatoInterval); introPotatoInterval = null; console.log("[Intro Step 6] Stopped falling potatoes interval."); } introOverlay.classList.add('fade-out'); console.log("[Intro Step 6] Fading out intro overlay."); if (backgroundMusic && backgroundMusic.paused && musicToggleButton?.checked) { backgroundMusic.play().catch(error => { console.error("Audio playback failed on start game:", error); if(musicToggleButton) musicToggleButton.checked = false; }); } setTimeout(() => { console.log("[Intro Step 6] Intro fade out complete."); introOverlay.classList.remove('visible', 'fade-out'); outerContainer.classList.add('visible'); console.log("[Intro Step 6] Main game container visible. Initializing game..."); initializeGame(); isIntroSequenceActive = false; }, INTRO_FADE_DURATION_MS); }
/** Modal Button Handlers & Music Toggle */
function handleSettingsClick() { console.log("Settings button clicked."); if (musicToggleButton && backgroundMusic) { musicToggleButton.checked = !backgroundMusic.paused && backgroundMusic.duration > 0 && !backgroundMusic.ended; } openModal('settings-modal'); }
function handleCreditsClick() { console.log("Credits button clicked."); openModal('credits-modal'); }
function handleUpdatesClick() { console.log("Update Log button clicked."); openModal('updates-modal'); }
function toggleMusic() { if (!backgroundMusic || !musicToggleButton) return; console.log(`Toggling music. Checkbox checked: ${musicToggleButton.checked}`); if (musicToggleButton.checked) { backgroundMusic.play().then(() => { console.log("Music playing."); }).catch(error => { console.error("Music toggle ON failed:", error); musicToggleButton.checked = false; showMessage("Could not play music.", 1500, true); }); } else { backgroundMusic.pause(); console.log("Music paused."); } }

console.log("Part 4: Intro Sequence Logic Finished.");
// End of Part 4

// ==========================================================================
// Part 5: Core Game Logic
// ==========================================================================
console.log("Part 5: Defining Core Gameplay functions...");

/** Handles clicking the main potato */
function clickPotato(event) {
    if (isPrestiging || !isGameInitialized || isIntroSequenceActive) return;
    const now = Date.now(); totalClicks++;
    if (!isOnFireActive && now >= onFireCooldownEndTime) { clickTimestamps = clickTimestamps.filter(ts => now - ts < ON_FIRE_TIME_WINDOW_MS); clickTimestamps.push(now); if (clickTimestamps.length >= ON_FIRE_CLICK_THRESHOLD) { activateOnFire(now); } }
    let baseGain = potatoesPerClick; let onFireMultiplier = 1; if (isOnFireActive && now < onFireEndTime) { onFireMultiplier = (1 + onFireStreakLevel); } let gain = baseGain * prestigeMultiplier * onFireMultiplier;
    potatoCount += gain; totalPotatoesHarvested += gain;
    spawnClickAnimation(event, gain, (onFireMultiplier > 1)); updateDisplay(); checkAchievements();
}
/** Handles buying or upgrading an item */
function buyUpgrade(upgradeId) {
    if (isPrestiging || !isGameInitialized || isIntroSequenceActive) return;
    const upgrade = upgrades.find(u => u.id === upgradeId); if (!upgrade) { console.error(`Buy failed: Upgrade ID "${upgradeId}" not found.`); return; }
    const cost = calculateCost(upgrade); if (potatoCount >= cost) { potatoCount -= cost; upgrade.level++; console.log(`Bought ${upgrade.name} - Lvl: ${upgrade.level}`); recalculateStats(); showMessage(`${upgrade.name} Lvl ${upgrade.level}!`, 1500, false); updateDisplay(); renderUpgrades(); if (upgrade.id === 'farmhand-gloves') { updateCursors(); } checkAchievements(); } else { showMessage('Need more potatoes!', 1500, true); }
}
/** Recalculates base potatoesPerClick and potatoesPerSecond */
function recalculateStats() { potatoesPerClick = 1 + upgrades.filter(u => u.effectType === 'click' && u.level > 0).reduce((s, u) => s + (Number(u.effectValue) || 0) * Math.max(0, Math.floor(u.level || 0)), 0); potatoesPerSecond = upgrades.filter(u => u.effectType === 'passive' && u.level > 0).reduce((s, u) => s + (Number(u.effectValue) || 0) * Math.max(0, Math.floor(u.level || 0)), 0); }
/** Generates passive income */
function passivePotatoGeneration() { if (isPrestiging || !isGameInitialized || isIntroSequenceActive || potatoesPerSecond <= 0) return; const gain = (potatoesPerSecond * prestigeMultiplier) * (TICK_INTERVAL_MS / 1000); if (gain > 0) { potatoCount += gain; totalPotatoesHarvested += gain; } }
/** Checks prestige requirement and starts animation */
function attemptPrestige() { console.log("Attempting prestige..."); if (isPrestiging || !isGameInitialized || isIntroSequenceActive) { console.log("Prestige blocked."); return; } console.log(`Checking prestige: Have ${formatNumber(potatoCount)}, Need ${formatNumber(currentPrestigeRequirement)}`); if (potatoCount >= currentPrestigeRequirement) { console.log("Requirement met. Starting animation."); startPrestigeAnimation(); } else { showMessage(`Need ${formatNumber(currentPrestigeRequirement)} current potatoes to Prestige!`, 2500, true); } }
/** Finalizes prestige state changes after animation */
function completePrestige() { console.log("Completing Prestige process..."); prestigeLevel++; prestigeMultiplier = 1 + prestigeLevel; potatoCount = 0; totalPotatoesHarvested = 0; totalClicks = 0; upgrades.forEach(u => u.level = 0); achievements = {}; isOnFireActive = false; onFireEndTime = 0; onFireCooldownEndTime = 0; onFireStreakLevel = 0; clickTimestamps = []; recalculateStats(); currentPrestigeRequirement = calculatePrestigeRequirement(prestigeLevel); showMessage(`PRESTIGE LVL ${prestigeLevel}! (${prestigeMultiplier}x Bonus)`, 3000, false); updateDisplay(); renderUpgrades(); renderAchievements(); updateCursors(); if (mainPotatoImg) { mainPotatoImg.src = ORIGINAL_POTATO_URL; mainPotatoImg.classList.remove('shake-animation'); } removeMeteor(false, 0); if (isDebugMenuUnlocked) { enableDebugFeatures(); } else { disableDebugFeatures(); } switchTab('clicks'); saveGame(); console.log(`Prestige complete. Lvl: ${prestigeLevel}. Next Req: ${formatNumber(currentPrestigeRequirement)}`); isPrestiging = false; console.log("isPrestiging flag set to false.");}
/** Updates popularity display */
function updatePopularity() { if (!popularityLevelDisplay || !farmerIcon || !popularityChatBubble) return; let tier = popularityTiers[popularityTiers.length - 1]; for (const t of popularityTiers) { if (totalPotatoesHarvested >= t.threshold) { tier = t; break; } } if (popularityLevelDisplay.textContent !== tier.name) { popularityLevelDisplay.textContent = tier.name; } let iconUrl = FARMER_ICON_URL; if (isDebugMenuUnlocked) { iconUrl = POTATOHAX_ICON_URL; } else { const pro = popularityTiers.find(t => t.name === "Potato Pro"); if (pro && totalPotatoesHarvested >= pro.threshold) { iconUrl = PRO_FARMER_ICON_URL; } } if (farmerIcon.getAttribute('src') !== iconUrl) { farmerIcon.src = iconUrl; } if (!isDebugMenuUnlocked) { if (popularityChatBubble.textContent !== tier.message || !popularityChatBubble.classList.contains('visible')) { popularityChatBubble.textContent = tier.message; popularityChatBubble.classList.add('visible'); } } else { const msg = "Click me ;)"; if (popularityChatBubble.textContent !== msg || !popularityChatBubble.classList.contains('visible')) { popularityChatBubble.textContent = msg; popularityChatBubble.classList.add('visible'); } } }
/** Saves game state */
function saveGame() { try { const state = { pc: potatoCount, tph: totalPotatoesHarvested, pl: prestigeLevel, upg: upgrades.map(u => ({ id: u.id, lvl: u.level })), ach: achievements, tc: totalClicks, debug: isDebugMenuUnlocked, ofs: onFireStreakLevel, version: 7.1 }; console.log('State object BEFORE stringify:', state);
// Specifically log the achievements part:
console.log('Achievements object within state BEFORE stringify:', state.ach); const str = JSON.stringify(state); console.log('JSON string BEFORE base64 encoding:', str); const b64 = btoa(unescape(encodeURIComponent(str))); console.log('Base64 string to be saved:', b64); if (saveCodeArea) saveCodeArea.value = b64; localStorage.setItem(SAVE_KEY, b64); showMessage("Game Saved!", 1500, false); if (copySaveButton) copySaveButton.textContent = "Copy"; } catch (e) { console.error("Save Error:", e); showMessage("Error saving game!", 2000, true); localStorage.removeItem(SAVE_KEY); } }
/** Placeholder loadGame - final version in Part 7 */
function loadGame(loadString = null) { console.warn("Placeholder loadGame called."); return false; }
/** Placeholder loadFromLocalStorage - final version in Part 7 */
    /** Asks for confirmation before resetting game data */
    function confirmResetGameData() {
        if (confirm("ARE YOU SURE you want to reset ALL progress?\nThis action cannot be undone!")) {
            resetGameData();
        } else {
            showMessage("Reset cancelled.", 1500, false);
        }
    }

  /** Clears saved data from localStorage and reloads the page */
  function resetGameData() {
      console.log("Resetting game data...");
      try {
          // Clear the specific save key from local storage
          localStorage.removeItem(SAVE_KEY);
          console.log(`Removed item with key: ${SAVE_KEY}`);
  
          // Optionally clear other related keys if you add more later
  
          // Show message and reload the page for a fresh start
          showMessage("Game data reset! Reloading...", 2000, false);
          // Add a small delay before reloading to allow the message to be seen
          setTimeout(() => {
              window.location.reload();
          }, 1500);
  
      } catch (error) {
          console.error("Error resetting game data:", error);
          showMessage("Error resetting data. Check console.", 3000, true);
      }
  }
function loadFromLocalStorage() { console.warn("Placeholder loadFromLocalStorage called."); return false; }
/** Copies save code */
function copySaveCode() { if (!saveCodeArea || !saveCodeArea.value) { showMessage("Generate save code first!", 1500, true); return; } navigator.clipboard.writeText(saveCodeArea.value).then(() => { if (copySaveButton) copySaveButton.textContent = "Copied!"; showMessage("Save code copied!", 1500, false); }).catch(err => { console.error('Copy failed:', err); showMessage("Failed to copy!", 1500, true); try { saveCodeArea.select(); saveCodeArea.setSelectionRange(0, 99999); document.execCommand('copy'); if (copySaveButton) copySaveButton.textContent = "Copied!"; showMessage("Copied (Fallback)!", 1500, false); } catch (e) {} }); }
/** Checks achievement conditions */
function checkAchievements() { if (!isGameInitialized || isPrestiging || isIntroSequenceActive) return; let newly = []; let changed = false; achievementDefinitions.forEach(a => { if (!a || !a.id || typeof a.condition !== 'function') return; const was = achievements[a.id] === true; let should = false; try { should = a.condition(); } catch (e) { console.error(`Err check ach '${a.id}':`, e); return; } if (should && !was) { achievements[a.id] = true; newly.push(a); changed = true; console.log(`Ach Unlocked: ${a.name}`); if (a.id === 'debug_unlock' && !isDebugMenuUnlocked) { isDebugMenuUnlocked = true; enableDebugFeatures(); saveGame(); } } else if (!should && was) { delete achievements[a.id]; changed = true; console.log(`Ach Re-locked: ${a.name}`); if (a.id === 'debug_unlock' && isDebugMenuUnlocked) { isDebugMenuUnlocked = false; disableDebugFeatures(); saveGame(); } } }); if (newly.length > 0) { showAchievementNotification(newly[0]); } const tabActive = document.getElementById('tab-content-achievements')?.classList.contains('active'); if (changed && tabActive) { renderAchievements(); } else if (tabActive) { updateAchievementProgress(); } }

console.log("Part 5: Core Game Logic Finished.");
// End of Part 5

// ==========================================================================
// Part 6: Effects & Display
// ==========================================================================
console.log("Part 6: Defining Effects & Display functions...");

/** Updates all major UI elements */
function updateDisplay() { if (!outerContainer?.classList.contains('visible') && !isGameInitialized) return; try { if (potatoCountDisplay) potatoCountDisplay.textContent = formatNumber(potatoCount); if (totalPotatoesDisplay) totalPotatoesDisplay.textContent = formatNumber(totalPotatoesHarvested); if (ppsDisplay) ppsDisplay.textContent = formatNumber(potatoesPerSecond * prestigeMultiplier); if (clickPowerDisplay) clickPowerDisplay.textContent = formatNumber(potatoesPerClick * prestigeMultiplier); if (prestigeStatsLine) { if (prestigeLevel > 0) { prestigeStatsLine.style.display = 'block'; if (prestigeLevelDisplay) prestigeLevelDisplay.textContent = prestigeLevel; if (prestigeMultiplierDisplay) prestigeMultiplierDisplay.textContent = prestigeMultiplier; } else { prestigeStatsLine.style.display = 'none'; } } updatePopularity(); const canPrestige = potatoCount >= currentPrestigeRequirement; if (prestigeButton) { prestigeButton.disabled = !canPrestige || isPrestiging; prestigeButton.classList.toggle('prestige-ready', canPrestige && !isPrestiging); } if (prestigeRequirementDisplay) { prestigeRequirementDisplay.textContent = formatNumber(currentPrestigeRequirement); } if (nextPrestigeLevelDisplay) { nextPrestigeLevelDisplay.textContent = prestigeLevel + 1; } if (currentPrestigeBonusDisplay) { currentPrestigeBonusDisplay.textContent = `${prestigeMultiplier}x`; } updatePrestigeReadiness(); const buttons = document.querySelectorAll('.buy-button-dynamic'); buttons.forEach(b => { const id = b.dataset.upgradeId; const upg = upgrades.find(u => u.id === id); if (upg) { const cost = calculateCost(upg); b.disabled = potatoCount < cost || isPrestiging; const span = b.querySelector('.cost'); if (span) span.textContent = formatNumber(cost); } else { b.disabled = true; } }); document.title = `${formatNumber(potatoCount)} Potatoes`; } catch (e) { console.error("Error in updateDisplay:", e); } }
/** Updates prestige readiness text */
function updatePrestigeReadiness() { if (!prestigeReadinessText) return; const c = potatoCount; const r = currentPrestigeRequirement; let txt = ""; let cls = ""; if (c < r) { txt = "Unworthy for ascension into Potateaven."; cls = "prestige-text-unworthy"; } else if (c >= r && c < r * PRESTIGE_BEYOND_FACTOR) { txt = "Potateaven awaits! Ready for Prestige."; cls = "prestige-text-ready"; } else { txt = "Radiating immense potato power! Ascension overdue!"; cls = "prestige-text-beyond"; } prestigeReadinessText.textContent = txt; prestigeReadinessText.className = `text-sm text-center mb-3 flex-shrink-0 ${cls}`; }
/** Renders upgrade list - FIXED */
function renderUpgrades() { if (!clickUpgradesContainer || !passiveUpgradesContainer) { return; } clickUpgradesContainer.innerHTML = ''; passiveUpgradesContainer.innerHTML = ''; upgrades.forEach((upgrade, index) => { let shouldRender = false; let targetContainer = null; if (upgrade.effectType === 'click') { targetContainer = clickUpgradesContainer; let prevIdx = -1; for (let i = index - 1; i >= 0; i--) { if (upgrades[i].effectType === 'click') { prevIdx = i; break; } } shouldRender = (prevIdx === -1) || (upgrades[prevIdx]?.level > 0); } else if (upgrade.effectType === 'passive') { targetContainer = passiveUpgradesContainer; let prevIdx = -1; for (let i = index - 1; i >= 0; i--) { if (upgrades[i].effectType === 'passive') { prevIdx = i; break; } } shouldRender = (prevIdx === -1) || (upgrades[prevIdx]?.level > 0); } if (shouldRender && targetContainer) { const cost = calculateCost(upgrade); const el = document.createElement('div'); el.className = 'bg-amber-800/70 p-3 border-2 border-amber-600 flex items-center space-x-3'; el.innerHTML = `<div class="upgrade-icon-wrapper flex-shrink-0 border-amber-500 p-1 bg-black/20 flex items-center justify-center"><img src="${upgrade.iconUrl || ''}" alt="${upgrade.name?.substring(0,1) || '?'}" class="w-full h-full object-contain" onerror="imageError(this, '${upgrade.name?.substring(0,1) || '?'}')"></div><div class="flex-grow"><div class="flex justify-between items-center mb-1.5"><span class="font-semibold text-amber-100 upgrade-text-name">${upgrade.name || '?'}</span><span class="font-medium text-amber-300 bg-black/30 px-2 py-0.5 rounded-sm upgrade-text-level">Lvl ${upgrade.level || 0}</span></div><p class="text-amber-300 mb-2 upgrade-text-desc">${upgrade.description || '?'}</p><button data-upgrade-id="${upgrade.id}" class="pixel-button buy-button buy-button-dynamic w-full" onclick="buyUpgrade('${upgrade.id}')">Buy (<span class="cost">${formatNumber(cost)}</span> P)</button></div>`; targetContainer.appendChild(el); } }); updateDisplay(); }
/** Renders achievement grid */
function renderAchievements() { if (!achievementsGrid) return; achievementsGrid.innerHTML = ''; achievementDefinitions.forEach(a => { if(!a||!a.id) return; const u = achievements[a.id] === true; const e = document.createElement('div'); e.id = `ach-${a.id}`; e.className = `achievement-item achievement-tier-${a.tier||'bronze'} ${u?'unlocked':''}`; if(u){e.style.borderColor=getTierColor(a.tier)} let p = 'Locked'; if(u){p='Completed!'}else{try{p=a.progress?a.progress():'0 / ???'}catch(e){p='Error'}} e.innerHTML = `<img src="${a.icon||TROPHY_ICON_URL}" alt="${a.name?.substring(0,1)||'A'}" onerror="imageError(this,'T')"><span class="achievement-name">${a.name||'?'}</span><span class="achievement-desc">${a.description||'?'}</span><span class="achievement-progress">${p}</span>`; achievementsGrid.appendChild(e); }); }
/** Updates achievement progress text */
function updateAchievementProgress() { if (!achievementsGrid) return; achievementDefinitions.forEach(a => { if(!a||!a.id) return; const e = document.getElementById(`ach-${a.id}`); if (e) { const p = e.querySelector('.achievement-progress'); if (p) { const u = achievements[a.id] === true; let txt = 'Locked'; if(u){txt='Completed!'}else{try{txt=a.progress?a.progress():'0 / ???'}catch(e){txt='Error'}} if (p.textContent !== txt) { p.textContent = txt; } } const c = e.classList.contains('unlocked'); if(a.id === 'debug_unlock') { a.condition = () => isDebugMenuUnlocked; } /* Update condition */ if (achievements[a.id] === true && !c) { e.classList.add('unlocked'); e.style.borderColor = getTierColor(a.tier); } else if (achievements[a.id] !== true && c) { e.classList.remove('unlocked'); e.style.borderColor = ''; } } }); }
/** Spawns click effects */
function spawnClickAnimation(event, gain, isOnFire) { if (!clickArea) return; let x = clickArea.offsetWidth / 2, y = clickArea.offsetHeight / 2; if (event && typeof event.clientX === 'number') { try { const r = clickArea.getBoundingClientRect(); x = event.clientX - r.left; y = event.clientY - r.top; } catch (e) {} } const i = document.createElement('img'); i.src = ORIGINAL_POTATO_URL; i.alt=""; i.className='click-animation-img'; i.style.left = `${x-14}px`; i.style.top = `${y-14}px`; i.onerror=()=>{i.remove()}; i.addEventListener('animationend',()=>i.remove()); clickArea.appendChild(i); const t = document.createElement('span'); t.textContent=`+${formatNumber(gain)}`; t.style.cssText=`position:absolute;left:${x-15}px;top:${y-30}px;pointer-events:none;z-index:11;font-size:1rem;font-weight:bold;color:${isOnFire?'#ff8800':'#fcd34d'};text-shadow:1px 1px 1px rgba(0,0,0,0.8);animation:click-effect-text 0.7s ease-out forwards;`; t.addEventListener('animationend',()=>t.remove()); clickArea.appendChild(t); }
/** Activates On Fire buff */
function activateOnFire(now) { console.log("On Fire Activated!"); isOnFireActive=true; onFireEndTime=now+ON_FIRE_DURATION_MS; onFireCooldownEndTime=now+ON_FIRE_COOLDOWN_MS; clickTimestamps=[]; onFireStreakLevel++; showMessage(`POTATO ON FIRE! ${1+onFireStreakLevel}x PPC! (Lvl ${onFireStreakLevel})`,ON_FIRE_DURATION_MS,false); if(mainPotatoImg){mainPotatoImg.src=FIRE_POTATO_URL; mainPotatoImg.classList.add('shake-animation')} if(!achievements['fast_finger']){achievements['fast_finger']=true; const a=achievementDefinitions.find(x=>x.id==='fast_finger'); if(a)showAchievementNotification(a); checkAchievements()} }
/** Checks On Fire buff status */
function checkOnFireStatus(now) { if(isOnFireActive&&now>=onFireEndTime){ console.log("On Fire Expired.");isOnFireActive=false;onFireEndTime=0; if(mainPotatoImg){mainPotatoImg.src=ORIGINAL_POTATO_URL; mainPotatoImg.classList.remove('shake-animation')} const left=Math.ceil(Math.max(0,onFireCooldownEndTime-now)/60000); showMessage(`On Fire cooling down... (${left} min left)`,3000,true)} }
/** Spawns meteor */
function spawnMeteor() { if(meteorActive||isPrestiging||!isGameInitialized||isIntroSequenceActive)return; console.log("Spawning Meteor..."); meteorActive=true; if(meteorMessageContainer){meteorMessageElement=document.createElement('p'); meteorMessageElement.id='meteor-sky-message'; meteorMessageElement.textContent="A potato meteor falls!"; meteorMessageContainer.innerHTML=''; meteorMessageContainer.appendChild(meteorMessageElement)} if(meteorContainer){meteorWrapperElement=document.createElement('div'); meteorWrapperElement.id='potato-meteor-wrapper'; meteorWrapperElement.style.left=`${10+Math.random()*70}%`; meteorWrapperElement.style.animationDuration=`${METEOR_FALL_DURATION_S}s`; meteorElement=document.createElement('img'); meteorElement.id='potato-meteor'; meteorElement.src=METEOR_IMAGE_URL; meteorElement.alt='Meteor'; meteorElement.onerror=()=>imageError(meteorElement,'M'); meteorElement.addEventListener('click',handleMeteorClick); meteorWrapperElement.appendChild(meteorElement); meteorContainer.innerHTML=''; meteorContainer.appendChild(meteorWrapperElement); clearInterval(fireParticleInterval); fireParticleInterval=setInterval(spawnFireParticle,METEOR_PARTICLE_INTERVAL_MS); clearTimeout(meteorTimeoutId); const dur=METEOR_FALL_DURATION_S*1000; let wrapper=meteorWrapperElement; meteorTimeoutId=setTimeout(()=>{console.log("Meteor timed out."); removeMeteor(false,0,wrapper)},dur+500)}else{console.error("Meteor container not found!"); if(meteorMessageElement?.parentNode)meteorMessageElement.remove(); meteorMessageElement=null; meteorActive=false;} }
/** Spawns meteor particle */
function spawnFireParticle() { try{if(!meteorWrapperElement||!meteorContainer)return; const r=meteorWrapperElement.getBoundingClientRect(); const x=r.left+(r.width*0.8)+(Math.random()*20-10); const y=r.top+(r.height*0.1)+(Math.random()*20-10); const p=document.createElement('img'); p.src=FIRE_TRAIL_IMAGE_URL; p.className='fire-particle'; p.style.left=`${x}px`; p.style.top=`${y}px`; p.style.transform=`rotate(${Math.random()*360}deg) scale(${0.8+Math.random()*0.4})`; meteorContainer.appendChild(p); setTimeout(()=>{if(p.parentNode)p.remove()},METEOR_PARTICLE_DURATION_MS)}catch(e){console.error("Particle Error:",e); clearInterval(fireParticleInterval);fireParticleInterval=null;} }
/** Handles meteor click */
function handleMeteorClick() { if(!meteorActive||!meteorElement)return; console.log("Meteor Clicked!"); if(meteorElement)meteorElement.style.pointerEvents='none'; clearTimeout(meteorTimeoutId); meteorTimeoutId=null; const ppsB=(potatoesPerSecond*prestigeMultiplier*60); const tphB=(totalPotatoesHarvested*0.01); const bonus=Math.max(1000,Math.min(1e9,Math.floor(ppsB+tphB))); potatoCount+=bonus; totalPotatoesHarvested+=bonus; if(!achievements['meteor_clicker']){achievements['meteor_clicker']=true; const a=achievementDefinitions.find(x=>x.id==='meteor_clicker'); if(a)showAchievementNotification(a); checkAchievements()} updateDisplay(); removeMeteor(true,bonus,meteorWrapperElement); }
/** Removes meteor */
function removeMeteor(clicked,bonus=0,wrapperToRemove=null) { const wrapper = wrapperToRemove || meteorWrapperElement; if (!wrapper && !meteorActive) return; const wasActive = meteorActive; meteorActive=false; clearTimeout(meteorTimeoutId); meteorTimeoutId=null; clearInterval(fireParticleInterval); fireParticleInterval=null; if(wrapper?.parentNode){wrapper.remove()} if(meteorMessageElement?.parentNode){meteorMessageElement.remove()} meteorElement=null; meteorWrapperElement=null; meteorMessageElement=null; if(wasActive){nextMeteorTime=Date.now()+METEOR_INTERVAL_MS; console.log(`Next meteor ~${new Date(nextMeteorTime).toLocaleTimeString()}`); if(clicked){showMessage(`Meteor granted ${formatNumber(bonus)} potatoes!`,2500,false)}else{showMessage("Meteor got away!",2000,true)}}}
/** Checks if meteor should spawn */
function checkMeteorSpawn() { const now=Date.now(); if(isGameInitialized&&!isPrestiging&&!meteorActive&&!isIntroSequenceActive&&now>=nextMeteorTime){spawnMeteor()} }
/** Updates orbiting cursors */
function updateCursors() { clearTimeout(window.cursorResizeTimer); window.cursorResizeTimer=setTimeout(()=>{ if(!cursorOrbitContainer||!potatoContainer)return; cursorOrbitContainer.innerHTML=''; const g=upgrades.find(u=>u.id==='farmhand-gloves'); const n=g?g.level:0; if(n===0){stopCursorAnimation();return} if(potatoContainer.offsetWidth===0||potatoContainer.offsetHeight===0){setTimeout(updateCursors,100);return} const s=Math.min(potatoContainer.offsetWidth,potatoContainer.offsetHeight); const r=s*0.30; for(let i=0;i<n;i++){ const a=(i/n)*2*Math.PI; const c=document.createElement('img'); c.src=CURSOR_ICON_URL; c.alt=""; c.className='cursor-image'; c.dataset.angle=a; c.dataset.radius=r; c.onerror=()=>imageError(c,'C'); const x=Math.cos(a)*r; const y=Math.sin(a)*r; const rot=(a*180/Math.PI)+90; c.style.transform=`translate(${x}px, ${y}px) rotate(${rot}deg)`; cursorOrbitContainer.appendChild(c); } startCursorAnimation(); }, 50); }
/** Animates cursors */
function animateCursors(timestamp) { if(!cursorAnimationId||!cursorOrbitContainer)return; if(!lastTimestamp)lastTimestamp=timestamp; const e=timestamp-lastTimestamp; if(document.hidden||e>500){lastTimestamp=timestamp;cursorAnimationId=requestAnimationFrame(animateCursors);return} const sp=0.0025; const minR=0.85; const maxR=1.0; const o=(Math.sin(timestamp*sp)+1)/2; const curR=minR+(maxR-minR)*o; const imgs=cursorOrbitContainer.querySelectorAll('.cursor-image'); imgs.forEach(img=>{if(img.dataset.angle&&img.dataset.radius){const a=parseFloat(img.dataset.angle); const bR=parseFloat(img.dataset.radius); const cR=bR*curR; const x=Math.cos(a)*cR; const y=Math.sin(a)*cR; const rot=(a*180/Math.PI)+90; img.style.transform=`translate(${x}px, ${y}px) rotate(${rot}deg)`;}}); lastTimestamp=timestamp; cursorAnimationId=requestAnimationFrame(animateCursors); }
/** Starts cursor animation loop */
function startCursorAnimation() { if (!cursorAnimationId) { lastTimestamp = 0; cursorAnimationId = requestAnimationFrame(animateCursors); } }
/** Stops cursor animation loop */
function stopCursorAnimation() { if (cursorAnimationId) { cancelAnimationFrame(cursorAnimationId); cursorAnimationId = null; } }
/** Starts prestige animation sequence */
function startPrestigeAnimation() { if(!prestigeAnimationOverlay||!prestigeFlashOverlay||isPrestiging)return; console.log("Starting Prestige Animation..."); isPrestiging=true; prestigeAnimationOverlay.style.opacity='0'; prestigeAnimationOverlay.classList.add('show'); void prestigeAnimationOverlay.offsetWidth; prestigeAnimationOverlay.style.opacity='1'; setTimeout(()=>{ if(!isPrestiging)return; prestigeFlashOverlay.classList.add('flash'); setTimeout(()=>{ if(!isPrestiging)return; prestigeAnimationOverlay.style.opacity='0'; prestigeFlashOverlay.classList.remove('flash'); setTimeout(()=>{ prestigeAnimationOverlay.classList.remove('show'); completePrestige(); /* isPrestiging reset inside completePrestige now */ }, 300); }, 300); }, 4000); }
/** Shows achievement notification popup */
function showAchievementNotification(ach,isDebug=false) { if(!achievementNotification||!achNotifyIcon||!achNotifyName)return; clearTimeout(achievementNotificationTimeout); achievementNotification.style.borderColor=''; achNotifyIcon.style.display='block'; const t=achievementNotification.querySelector('.title'); if(t)t.textContent="Achievement Unlocked!"; if(isDebug){achievementNotification.style.borderColor='#16a34a'; if(t)t.textContent="Debug Message"; achNotifyName.textContent=typeof ach==='string'?ach:(ach?.name||"Debug Info"); achNotifyIcon.style.display='none'} else if(ach){achievementNotification.style.borderColor=getTierColor(ach.tier); achNotifyIcon.src=ach.icon||TROPHY_ICON_URL; achNotifyName.textContent=ach.name||"Achievement"} else{return} achievementNotification.classList.remove('hide'); achievementNotification.classList.add('show'); achievementNotificationTimeout=setTimeout(()=>{achievementNotification.classList.remove('show'); achievementNotification.classList.add('hide')},ACHIEVEMENT_NOTIFY_DURATION_MS); }
/** Enables debug features visually */
function enableDebugFeatures() { if(!farmerIcon||!popularityChatBubble||!popularityCard)return; console.log("Enabling Debug Features"); isDebugMenuUnlocked=true; farmerIcon.src=POTATOHAX_ICON_URL; farmerIcon.onerror=()=>imageError(farmerIcon,'D'); popularityChatBubble.textContent="Click me ;)"; popularityChatBubble.classList.add('visible'); popularityCard.classList.add('debug-active'); popularityCard.removeEventListener('click',openDebugMenu); popularityCard.addEventListener('click',openDebugMenu); checkAchievements(); }
/** Disables debug features visually */
function disableDebugFeatures() { if(!farmerIcon||!popularityChatBubble||!popularityCard)return; console.log("Disabling Debug Features"); updatePopularity(); popularityCard.classList.remove('debug-active'); popularityCard.style.cursor='default'; popularityCard.removeEventListener('click',openDebugMenu); checkAchievements(); }
/** Opens debug menu */
function openDebugMenu() { if(!isDebugMenuUnlocked||!debugMenuModal)return; if(debugClickInput)debugClickInput.value=potatoesPerClick; if(debugIncomeInput)debugIncomeInput.value=potatoesPerSecond; if(debugPrestigeInput)debugPrestigeInput.value=prestigeLevel; if(debugPotatoInput)debugPotatoInput.value=formatNumber(potatoCount); debugMenuModal.classList.add('show'); }
/** Closes debug menu */
function closeDebugMenu() { if (debugMenuModal) debugMenuModal.classList.remove('show'); }
// --- Debug Actions ---
function applyClickModifier() { const v=parseInt(debugClickInput?.value);if(!isNaN(v)&&v>=1){potatoesPerClick=v;updateDisplay();showMessage(`Base PPC set to ${formatNumber(v)}`,1500,false)}else{showMessage("Invalid PPC (>=1)",1500,true)} }
function applyIncomeModifier() { const v=parseInt(debugIncomeInput?.value);if(!isNaN(v)&&v>=0){potatoesPerSecond=v;updateDisplay();showMessage(`Base PPS set to ${formatNumber(v)}/s`,1500,false)}else{showMessage("Invalid PPS (>=0)",1500,true)} }
function applyPrestigeLevel() { const v=parseInt(debugPrestigeInput?.value);if(!isNaN(v)&&v>=0){prestigeLevel=v;prestigeMultiplier=1+v;currentPrestigeRequirement=calculatePrestigeRequirement(v);updateDisplay();renderAchievements();showMessage(`Prestige Lvl set to ${v}`,1500,false);saveGame()}else{showMessage("Invalid Prestige Lvl (>=0)",1500,true)} }
function applyPotatoCount() { const v=parseScientificInput(debugPotatoInput?.value);if(!isNaN(v)&&v>=0){potatoCount=v;updateDisplay();showMessage(`Current Potatoes set to ${formatNumber(v)}`,1500,false)}else{showMessage("Invalid Potato Count",1500,true)} }
function givePotatoGift() { const pps=potatoesPerSecond*prestigeMultiplier; const ppc=potatoesPerClick*prestigeMultiplier; const gift=Math.max(10000,Math.floor((pps*3600)+(ppc*1000))); potatoCount+=gift; totalPotatoesHarvested+=gift; updateDisplay(); showMessage(`Received ${formatNumber(gift)} potatoes!`,2000,false); checkAchievements(); }
function forcePrestige() { if(isPrestiging)return; startPrestigeAnimation(); showMessage("Forcing Ascension!",1500,false); closeDebugMenu(); }
function unlockAllAchievements() { let n=0;achievementDefinitions.forEach(a=>{if(!achievements[a.id]){achievements[a.id]=true;n++;if(a.id==='debug_unlock'&&!isDebugMenuUnlocked){isDebugMenuUnlocked=true;enableDebugFeatures()}}});renderAchievements();showMessage(`Unlocked ${n} new achievements!`,2000,false);saveGame(); }
function resetAchievements() { achievements={};if(isDebugMenuUnlocked){const d=achievementDefinitions.find(a=>a.id==='debug_unlock');if(d&&!d.condition()){isDebugMenuUnlocked=false;disableDebugFeatures()}}renderAchievements();showMessage(`Achievements Reset!`,1500,false);saveGame(); }
function beatGame() { const inf=Number.MAX_SAFE_INTEGER/100;potatoCount=inf;totalPotatoesHarvested=Math.max(totalPotatoesHarvested,inf);updateDisplay();showMessage("You beat the game...?",3000,false);closeDebugMenu(); }
function showGameConsole() { console.group("--- Game State ---"); console.log(`Potatoes: ${formatNumber(potatoCount)} (${potatoCount})`); console.log(`Total Harvested: ${formatNumber(totalPotatoesHarvested)} (${totalPotatoesHarvested})`); console.log(`Base PPC: ${formatNumber(potatoesPerClick)} (Eff: ${formatNumber(potatoesPerClick*prestigeMultiplier)})`); console.log(`Base PPS: ${formatNumber(potatoesPerSecond)} (Eff: ${formatNumber(potatoesPerSecond*prestigeMultiplier)})`); console.log(`Prestige Lvl: ${prestigeLevel} (Mult: ${prestigeMultiplier}x)`); console.log(`Next Req: ${formatNumber(currentPrestigeRequirement)}`); console.log(`Total Clicks: ${totalClicks}`); console.log(`Debug: ${isDebugMenuUnlocked}`); console.log(`On Fire: ${isOnFireActive} (Streak: ${onFireStreakLevel})`); console.log(`On Fire Ends: ${onFireEndTime>0?new Date(onFireEndTime).toLocaleTimeString():'N/A'}`); console.log(`On Fire CD Ends: ${onFireCooldownEndTime>0?new Date(onFireCooldownEndTime).toLocaleTimeString():'N/A'}`); console.log(`Meteor Active: ${meteorActive}`); console.log(`Next Meteor Spawn: ${nextMeteorTime>0?new Date(nextMeteorTime).toLocaleTimeString():'N/A'}`); console.log("Achievements:", achievements); console.log("Upgrades:", upgrades.map(u=>({id:u.id, lvl:u.level}))); console.groupEnd(); showMessage("State logged to console (F12)",2000,false); }
function debugTriggerMeteor() { if(meteorActive){showMessage("Meteor active!",1500,true);return} if(isPrestiging||!isGameInitialized||isIntroSequenceActive){showMessage("Cannot trigger now.",1500,true);return} console.log("Debug Trigger Meteor");spawnMeteor();showMessage("Debug Meteor Triggered!",1500,false);closeDebugMenu(); }
function debugTriggerOnFire() { const now=Date.now();if(isOnFireActive){showMessage("On Fire active!",1500,true);return} if(isPrestiging||!isGameInitialized||isIntroSequenceActive){showMessage("Cannot trigger now.",1500,true);return} console.log("Debug Trigger On Fire");activateOnFire(now);showMessage("Debug On Fire Triggered!",ON_FIRE_DURATION_MS,false);closeDebugMenu(); }

console.log("Part 6: Effects & Display Finished.");
// End of Part 6
// --- Game Initialization & Loop ---
console.log("Part 7: Defining Initialization & Game Loop functions...");

/** Initializes the main game state, called AFTER the intro sequence ends */
function initializeGame() {
    // Prevent multiple initializations
    if (isGameInitialized) {
        console.warn("Game initialize attempted, but already initialized.");
        return;
    }
    console.log("Initializing Game Core Logic...");
    isGameInitialized = true;       // Mark game logic as ready
    isIntroSequenceActive = false;  // Intro sequence is officially over

    // --- FIX for BUG #1 START: Add Potato Button Listeners ---
    if (potatoButton) {
         potatoButton.removeEventListener('click', clickPotato); // Remove first to be safe
         potatoButton.addEventListener('click', clickPotato); // Defined in Part 5

         // Handle touch events for mobile clicking
         potatoButton.removeEventListener('touchstart', handlePotatoTouch);
         potatoButton.addEventListener('touchstart', handlePotatoTouch, { passive: false });
         console.log("Attached click and touch listeners to potato button.");
    } else {
         // This would be a critical error for gameplay
         console.error("CRITICAL: Potato button not found during initialization! Clicking will not work.");
         showMessage("Error: Potato button missing!", 10000, true); // Show persistent error
    }
    // --- FIX for BUG #1 END ----

    // 1. Attempt to Load Saved Data from Local Storage
    // loadFromLocalStorage calls loadGame internally and returns true/false
    const didLoad = loadFromLocalStorage(); // Final version defined below

    // 2. If no save loaded, ensure initial state & display are set
    if (!didLoad) {
        console.log("No valid save found or load failed. Setting up NEW game state.");
        // Re-confirm defaults (mostly for clarity, should be set initially)
        potatoCount = 0; totalPotatoesHarvested = 0; prestigeLevel = 0; achievements = {}; totalClicks = 0; onFireStreakLevel = 0; isDebugMenuUnlocked = false;
        upgrades.forEach(u => u.level = 0); // Reset levels

        // Calculate initial stats based on defaults
        recalculateStats(); // Should result in 1 PPC, 0 PPS
        currentPrestigeRequirement = calculatePrestigeRequirement(prestigeLevel); // Should be base value

        // Initial render based on default state
        renderUpgrades();
        renderAchievements();
        updateCursors();
        updateDisplay(); // Show 0s etc.
    }
    // If didLoad was true, loadGame already handled setting state and UI updates.

     // 3. Schedule first meteor check
     if (nextMeteorTime <= 0 || nextMeteorTime < Date.now()) {
         nextMeteorTime = Date.now() + (METEOR_INTERVAL_MS / 3) + (Math.random() * METEOR_INTERVAL_MS / 3); // 1-3 minutes approx
     }
     console.log(`Next potential meteor scheduled around: ${new Date(nextMeteorTime).toLocaleTimeString()}`);

    // 4. Start the Game Loop
    clearInterval(gameLoopIntervalId); // Clear just in case
    gameLoopIntervalId = setInterval(gameTick, TICK_INTERVAL_MS);
    console.log(`Game loop started with interval ${TICK_INTERVAL_MS}ms.`);

    // 5. Add Global Event Listeners (Window level)
    window.removeEventListener('resize', updateCursors); // Prevent duplicates
    window.addEventListener('resize', updateCursors);
    console.log("Attached window resize listener.");

    // 6. Sync Debug Features (Visuals and Listener) based on final loaded/default state
    if (isDebugMenuUnlocked) {
        console.log("Enabling debug features based on final state.");
        enableDebugFeatures(); // Defined in Part 6
    } else {
        console.log("Disabling debug features based on final state.");
        disableDebugFeatures(); // Defined in Part 6
    }

    // 7. Final confirmation
    console.log("Game Initialization Complete.");
    if (!didLoad) { // Only show welcome message on a fresh start
        showMessage("Welcome to Potato Clicker!", 2000, false);
    }
}

/** Handler for touch events on the potato to simulate a click */
function handlePotatoTouch(e) {
    // Prevent default touch behavior like scrolling or zooming on the button
    e.preventDefault();
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        // Create a synthetic mouse event to pass coordinates if needed by animations
        const clickEvent = new MouseEvent('click', {
            bubbles: true, cancelable: true, clientX: touch.clientX, clientY: touch.clientY
        });
        clickPotato(clickEvent); // Call the main click handler (Defined in Part 5)
    }
}


// --- Game Tick (Main Loop) ---
function gameTick() {
    // Pause game loop during prestige, if game not initialized, or if intro is still active
    if (isPrestiging || !isGameInitialized || isIntroSequenceActive) return;

    const now = Date.now();
    tickCounter++;

    // 1. Passive Gain
    passivePotatoGeneration(); // Defined in Part 5

    // 2. Event Checks
    checkOnFireStatus(now);    // Defined in Part 6
    checkMeteorSpawn();       // Defined in Part 6

    // 3. Achievement Checks (every 5 seconds)
    if (tickCounter % 5 === 0) {
        checkAchievements();     // Defined in Part 5
    }

    // 4. UI Update (every tick for smooth counters)
    updateDisplay(); // Defined in Part 6

    // 5. Auto-Save (every 60 seconds)
    if (tickCounter % 60 === 0) {
        // console.log("Auto-saving..."); // Less verbose log
        saveGame(); // Defined in Part 5
    }

    // Reset counter periodically to prevent potential overflow issues
    if (tickCounter > 6000) { // Reset every ~100 minutes
        tickCounter = 0;
    }
}


// --- Final Load Functions (Overrides placeholders from Part 5) ---

/** Attempts to load game from localStorage, returns true if successful, false otherwise */
function loadFromLocalStorage() {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
        console.log("Found save data in localStorage. Attempting to load.");
        const success = loadGame(savedData); // Call loadGame with data
        return success; // Return true/false based on loadGame result
    } else {
        console.log("No save data found in localStorage.");
        return false; // Indicate no save was loaded
    }
}

/** Loads game state from a save string, returns true if successful, false otherwise */
function loadGame(loadString = null) {
    console.log("Running final loadGame function...");
    const code = loadString ?? loadCodeArea?.value.trim(); console.log('Raw Base64 string from load input/localStorage:', code);

    // Handle Empty Input (only show msg on manual load)
    if (!code) {
        if (!loadString) showMessage("Paste save code first!", 1500, true);
        return false; // Load failed
    }

    // Handle Debug Code Activation
    if (code.toUpperCase() === 'POTATO') {
        console.log("Debug code entered.");
        if (!isDebugMenuUnlocked) {
             isDebugMenuUnlocked = true;
             // Don't call enableDebugFeatures here; initializeGame will handle it after load returns true.
             showAchievementNotification("Debug Menu Unlocked", true); // Show immediate feedback
             enableDebugFeatures(); // Apply visual changes and listener NOW
             checkAchievements(); // Check debug achievement
             saveGame(); // Save unlocked state
        } else { if (!loadString) showMessage("Debug menu already unlocked!", 1500, false); }
        if (loadCodeArea && !loadString) loadCodeArea.value = ""; // Clear input area
        return true; // Debug activation counts as success for initialization flow
    }

    // Process Actual Save Code
    try {
        console.log("Decoding save string...");
        const jsonString = decodeURIComponent(escape(atob(code))); console.log('Decoded JSON string:', jsonString);
        const loadedState = JSON.parse(jsonString); console.log('Parsed loadedState object:', loadedState);
// Specifically log the achievements part:
console.log('Achievements object within loadedState:', loadedState.ach);
        console.log("Save string decoded and parsed.");

        // --- Validation ---
        if (typeof loadedState !== 'object' || loadedState === null) throw new Error("Invalid save: Not an object.");
        if (loadedState.version !== 7.1 && loadedState.version !== 7.0) { // Allow v7.0
             console.warn(`Loading save from different version (${loadedState.version}). Current is 7.1.`);
        }

        // --- Restore State ---
        console.log("Restoring game state...");
        potatoCount = Number(loadedState.pc) || 0;
        totalPotatoesHarvested = Number(loadedState.tph) || 0;
        prestigeLevel = Number(loadedState.pl) || 0;
        achievements = (typeof loadedState.ach === 'object' && loadedState.ach !== null) ? loadedState.ach : {}; console.log('Game achievements variable set to:', achievements);
        totalClicks = Number(loadedState.tc) || 0;
        isDebugMenuUnlocked = Boolean(loadedState.debug) || false; // Restore debug flag status
        onFireStreakLevel = Number(loadedState.ofs) || 0;
        // Restore timers if saved previously (optional)
        // nextMeteorTime = Number(loadedState.meteorNext) || 0;
        // onFireEndTime = Number(loadedState.onFireEnd) || 0;
        // onFireCooldownEndTime = Number(loadedState.onFireCD) || 0;

        // --- Restore Upgrades ---
        upgrades.forEach(u => u.level = 0); // Reset current levels first
        if (Array.isArray(loadedState.upg)) {
             loadedState.upg.forEach(savedUpg => {
                 const gameUpg = upgrades.find(u => u.id === savedUpg.id);
                 if (gameUpg && typeof savedUpg.lvl === 'number') {
                    gameUpg.level = Math.max(0, Math.floor(savedUpg.lvl));
                 } else if (savedUpg.id) { console.warn(`Upgrade "${savedUpg.id}" from save not found. Skipping.`); }
             });
        } else { console.warn("Save data 'upg' missing or invalid.") }

        // --- Recalculate Dependent State ---
        console.log("Recalculating dependent state after load...");
        prestigeMultiplier = 1 + prestigeLevel;
        currentPrestigeRequirement = calculatePrestigeRequirement(prestigeLevel);
        recalculateStats();

        // --- Update UI ---
        console.log("Updating UI based on loaded state...");
        updateDisplay();
        renderUpgrades();
        renderAchievements();
        updateCursors();
        // Debug feature visuals handled by initializeGame after load returns

        // --- Final Steps ---
        if (loadCodeArea && !loadString) loadCodeArea.value = ""; // Clear manual input
        if (!loadString) showMessage("Game loaded successfully!", 2000, false); // Only show for manual load
        switchTab('clicks'); // Go to default tab

        // Update localStorage only if this was a manual paste/load
        if (loadString === null) { localStorage.setItem(SAVE_KEY, code); console.log("Manual load successful, updated localStorage."); }
        else { console.log("Auto-load successful."); }
        return true; // Load succeeded

    } catch (error) {
        console.error("Error processing loadGame:", error);
        if (!loadString) showMessage("Invalid or corrupted save code!", 2500, true);
        localStorage.removeItem(SAVE_KEY); // Remove invalid save data
        return false; // Load failed
    }
}

// --- Initial Setup Execution ---
// This code runs once the entire script is parsed, thanks to 'defer'

console.log("Running initial listeners setup...");

// Listener to start the entire intro sequence via the pre-intro button
if (preIntroButton) {
    preIntroButton.removeEventListener('click', handlePreIntroClick); // Prevent multiple listeners
    preIntroButton.addEventListener('click', handlePreIntroClick);
    console.log("Attached initial listener to pre-intro button.");
} else {
    // This is critical - the game cannot start without this button
    console.error("CRITICAL: Pre-intro button (#pre-intro-button) not found! Intro sequence cannot start.");
    // Display a visible error message to the user
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

console.log("Part 7: Initialization & Game Loop Finished. Script setup complete and initial listeners attached.");
// End of Part 7 / End of script.js
