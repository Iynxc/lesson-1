/* =========================================
   ELEMENTS
========================================= */

const terminal = document.querySelector("#terminal");

const mainText = document.querySelector("#mainText");
const subText = document.querySelector("#subText");
const progressText = document.querySelector("#progress");

const screen = document.querySelector(".screen");

const override = document.querySelector("#override");
const overrideLogs = document.querySelector("#overrideLogs");
const coreProgress = document.querySelector("#coreProgress");

const finalScreen = document.querySelector("#final");

const matrix = document.querySelector("#matrix");


/* =========================================
   AUDIO
========================================= */

const glitchSound = document.querySelector("#glitchSound");
const scanSound = document.querySelector("#scanSound");
const warningSound = document.querySelector("#warningSound");
const voiceSound = document.querySelector("#voiceSound");

let audioUnlocked = false;


/*
    Chrome не разрешает автоматический звук
    до взаимодействия пользователя.
    
    Поэтому первый клик по сайту
    активирует аудио.
*/

document.addEventListener("click", unlockAudio, {
    once: true
});


async function unlockAudio() {

    audioUnlocked = true;

    const sounds = [
        glitchSound,
        scanSound,
        warningSound,
        voiceSound
    ];

    for (const sound of sounds) {

        if (!sound) continue;

        try {

            sound.volume = 0;

            await sound.play();

            sound.pause();
            sound.currentTime = 0;

            sound.volume = 1;

        } catch (error) {

            console.log("Audio unlock:", error);

        }

    }

    // Первый цифровой звук после клика
    playSound(glitchSound, 0.7);
}


/*
    Проигрывание звука
*/

function playSound(sound, volume = 0.6) {

    if (!audioUnlocked || !sound) {
        return;
    }

    try {

        sound.pause();

        sound.currentTime = 0;

        sound.volume = volume;

        const promise = sound.play();

        if (promise) {

            promise.catch(error => {
                console.log("Sound error:", error);
            });

        }

    } catch (error) {

        console.log("Audio error:", error);

    }
}


/*
    Иногда создаём новый экземпляр звука,
    чтобы короткие glitch-звуки могли
    накладываться друг на друга.
*/

function playGlitch(volume = 0.3) {

    if (!audioUnlocked || !glitchSound) {
        return;
    }

    const sound = glitchSound.cloneNode();

    sound.volume = volume;

    sound.play().catch(() => { });

    sound.addEventListener("ended", () => {
        sound.remove();
    });

}


/* =========================================
   MATRIX
========================================= */

const matrixCharacters =
    "010101101001011010010110010101101010";


for (let i = 0; i < 14; i++) {

    const column = document.createElement("span");

    let text = "";

    for (let j = 0; j < 45; j++) {

        text +=
            matrixCharacters[
            Math.floor(
                Math.random() *
                matrixCharacters.length
            )
            ];

        text += "<br>";

    }

    column.innerHTML = text;

    column.style.animationDuration =
        `${5 + Math.random() * 7}s`;

    column.style.animationDelay =
        `${Math.random() * -8}s`;

    matrix.appendChild(column);

}


/* =========================================
   TERMINAL
========================================= */

const terminalMessages = [

    "[SYSTEM] Initializing connection...",

    "[NETWORK] Searching active nodes...",

    "[NETWORK] 14 nodes detected.",

    "[SCAN] Checking security layers...",

    "[SCAN] Firewall detected.",

    "[SCAN] Searching vulnerabilities...",

    "[SCAN] Analyzing security response...",

    "[ERROR] Security response detected.",

    "[BYPASS] Attempting security bypass...",

    "[BYPASS] Security protocol interrupted.",

    "[BYPASS] Searching secondary access point...",

    "[ACCESS] Core connection established.",

    "[SYSTEM] Reading system structure...",

    "[ROOT] Administrator privileges detected.",

    "[WARNING] Active administrator session.",

    "[ACCESS] Authentication layer bypassed.",

    "[SYSTEM] Continuing access...",

    "[CORE] Preparing system override...",

    "[NETWORK] Internal structure mapped.",

    "[SYSTEM] Synchronizing core..."

];


let terminalIndex = 0;


function addTerminalMessage() {

    const line = document.createElement("div");

    const message =
        terminalMessages[terminalIndex];


    line.textContent =
        "> " + message;


    if (message.includes("[ERROR]")) {

        line.className =
            "terminal__error";

        playSound(warningSound, 0.25);

    }

    else if (message.includes("[WARNING]")) {

        line.className =
            "terminal__warning";

        playSound(warningSound, 0.2);

    }

    else {

        line.className =
            "terminal__normal";

        if (Math.random() > 0.45) {
            playGlitch(0.18);
        }

    }


    terminal.appendChild(line);


    terminal.scrollTop =
        terminal.scrollHeight;


    terminalIndex++;


    if (
        terminalIndex >=
        terminalMessages.length
    ) {

        terminalIndex = 0;

    }

}


addTerminalMessage();


const terminalTimer = setInterval(
    addTerminalMessage,
    650
);


/* =========================================
   MAIN PROGRESS
========================================= */

let progress = 0;

let loadingTimer = null;


function updateMainStage() {

    progressText.textContent =
        `BREACH: ${progress}%`;


    subText.textContent =
        `SYSTEM SECURITY: ${100 - progress}%`;


    /* 20% */

    if (progress === 20) {

        mainText.textContent =
            "SCANNING";

        subText.textContent =
            "SEARCHING SECURITY LAYERS...";

        playSound(scanSound, 0.8);

    }


    /* 40% */

    if (progress === 40) {

        mainText.textContent =
            "BYPASSING";

        subText.textContent =
            "SECURITY PROTOCOL DETECTED";

        playSound(glitchSound, 0.8);

    }


    /* 60% */

    if (progress === 60) {

        mainText.textContent =
            "ACCESSING";

        subText.textContent =
            "CORE CONNECTION ESTABLISHED";

        playSound(glitchSound, 0.9);

    }


    /* 80% */

    if (progress === 80) {

        mainText.textContent =
            "OVERRIDING";

        subText.textContent =
            "SECURITY CONTROL LOST";

        playSound(warningSound, 0.9);

    }


    /* 90% */

    if (progress === 90) {

        mainText.textContent =
            "CORE ACCESS";

        subText.textContent =
            "FINAL SECURITY LAYER...";

        playGlitch(0.7);

    }


    /* 100% */

    if (progress >= 100) {

        progress = 100;

        progressText.textContent =
            "BREACH: 100%";

        mainText.textContent =
            "COMPLETE";

        subText.textContent =
            "SECURITY LAYER: OFFLINE";


        clearInterval(loadingTimer);


        playSound(voiceSound, 0.9);


        /*
            Через 1 секунду начинается
            вторая стадия.
        */

        setTimeout(() => {

            startOverride();

        }, 1000);

    }

}


/*
    Скорость основного сканирования
*/

loadingTimer = setInterval(() => {

    progress++;

    updateMainStage();


}, 80);


/* =========================================
   RANDOM GLITCH SOUNDS
========================================= */

const randomSoundTimer = setInterval(() => {

    if (!audioUnlocked) {
        return;
    }


    /*
        Пока система работает,
        иногда появляются короткие помехи.
    */

    if (
        progress > 5 &&
        progress < 100 &&
        Math.random() > 0.55
    ) {

        playGlitch(
            0.12 + Math.random() * 0.2
        );

    }

}, 1200);


/* =========================================
   SECOND PHASE
========================================= */

const overrideMessages = [

    "[CORE] Security modules disabled...",

    "[ROOT] Administrator privileges acquired...",

    "[DATA] System structure exposed...",

    "[NETWORK] Internal nodes mapped...",

    "[KERNEL] Core access established...",

    "[SYSTEM] Defensive protocols terminated...",

    "[AUTH] Authentication service disabled...",

    "[CORE] Security restrictions removed...",

    "[ROOT] Full system control acquired..."

];


function startOverride() {

    screen.classList.add("breached");

    override.classList.add("active");


    /*
        Звук начала override
    */

    playSound(warningSound, 0.7);


    let index = 0;


    /*
        Логи override
    */

    const messageTimer = setInterval(() => {

        if (
            index >=
            overrideMessages.length
        ) {

            clearInterval(messageTimer);

            return;

        }


        const line =
            document.createElement("div");


        line.className =
            "override__line";


        line.textContent =
            overrideMessages[index];


        overrideLogs.appendChild(line);


        overrideLogs.scrollTop =
            overrideLogs.scrollHeight;


        /*
            Разные звуки для разных действий
        */

        if (index === 0) {

            playSound(glitchSound, 0.5);

        }

        else if (index === 4) {

            playSound(scanSound, 0.4);

        }

        else if (index === 6) {

            playSound(warningSound, 0.6);

        }

        else {

            playGlitch(0.25);

        }


        index++;

    }, 500);


    /* =========================================
       CORE PROGRESS
    ========================================= */

    let core = 0;


    const coreTimer = setInterval(() => {

        core += 2;


        if (core > 100) {
            core = 100;
        }


        coreProgress.style.width =
            `${core}%`;


        /*
            Звуки во время заполнения ядра
        */

        if (
            core % 10 === 0
        ) {

            playGlitch(0.18);

        }


        if (core >= 100) {

            clearInterval(coreTimer);


            mainText.textContent =
                "SYSTEM OVERRIDDEN";

            subText.textContent =
                "ROOT CONTROL: 100%";


            playSound(
                voiceSound,
                0.9
            );


            /*
                После полного override
                небольшая пауза.
            */

            setTimeout(() => {

                finish();

            }, 1200);

        }

    }, 45);

}


/* =========================================
   FINAL
========================================= */

function finish() {

    override.classList.remove("active");

    finalScreen.classList.add("active");

    screen.classList.add("breached");


    mainText.textContent =
        "COMPROMISED";


    subText.textContent =
        "SYSTEM CONTROL : 100%";


    progressText.textContent =
        "BREACH: 100%";


    /*
        Финальный glitch
    */

    playSound(
        glitchSound,
        0.8
    );


    /* =========================================
       SCREEN FLASH
    ========================================= */

    let flashes = 0;


    const flashTimer = setInterval(() => {

        document.body.classList.toggle(
            "screen-flash"
        );


        flashes++;


        if (flashes >= 8) {

            clearInterval(flashTimer);


            document.body.classList.remove(
                "screen-flash"
            );

        }

    }, 120);


    /*
        10 секунд после полного завершения
    */

    setTimeout(() => {

        mainText.textContent =
            "SESSION TERMINATED";


        subText.textContent =
            "CLOSING CONNECTION...";


        playSound(
            warningSound,
            0.6
        );


        /*
            Через 1 секунду
            закрываем текущую страницу.
        */

        setTimeout(() => {

            window.location.replace(
                "about:blank"
            );

        }, 1000);


    }, 10000);

}


/* =========================================
   RANDOM SCREEN GLITCH
========================================= */

setInterval(() => {

    if (
        Math.random() > 0.55
    ) {

        screen.style.transform =
            `translate(
                ${Math.random() * 6 - 3}px,
                ${Math.random() * 5 - 2.5}px
            )`;


        setTimeout(() => {

            screen.style.transform =
                "";

        }, 70);

    }

}, 500);


/* =========================================
   RANDOM VISUAL GLITCH
========================================= */

setInterval(() => {

    if (
        progress >= 20 &&
        progress < 100 &&
        Math.random() > 0.7
    ) {

        mainText.style.transform =
            `translateX(
                ${Math.random() * 10 - 5}px
            )`;


        setTimeout(() => {

            mainText.style.transform =
                "";

        }, 80);

    }

}, 700);


/* =========================================
   BLOCK NORMAL COPYING
========================================= */

document.addEventListener(
    "contextmenu",
    event => {
        event.preventDefault();
    }
);


document.addEventListener(
    "selectstart",
    event => {
        event.preventDefault();
    }
);


document.addEventListener(
    "dragstart",
    event => {
        event.preventDefault();
    }
);


document.addEventListener(
    "copy",
    event => {
        event.preventDefault();
    }
);


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        /*
            F5
        */

        if (
            event.key === "F5" ||
            event.keyCode === 116
        ) {

            event.preventDefault();

            showRefreshBlocked();

            return;

        }


        /*
            CTRL + R
        */

        if (
            event.ctrlKey &&
            key === "r"
        ) {

            event.preventDefault();

            showRefreshBlocked();

            return;

        }


        /*
            CTRL + C
            CTRL + U
            CTRL + S
        */

        if (
            event.ctrlKey &&
            (
                key === "c" ||
                key === "u" ||
                key === "s"
            )
        ) {

            event.preventDefault();

        }


        /*
            F12
        */

        if (
            event.key === "F12"
        ) {

            event.preventDefault();

        }


        /*
            CTRL + SHIFT + I
            CTRL + SHIFT + J
        */

        if (
            event.ctrlKey &&
            event.shiftKey &&
            (
                key === "i" ||
                key === "j"
            )
        ) {

            event.preventDefault();

        }

    },
    true
);


/* =========================================
   REFRESH BLOCK MESSAGE
========================================= */

let refreshMessageActive = false;


function showRefreshBlocked() {

    if (refreshMessageActive) {
        return;
    }


    refreshMessageActive = true;


    const oldMain =
        mainText.textContent;

    const oldSub =
        subText.textContent;


    mainText.textContent =
        "REFRESH BLOCKED";


    subText.textContent =
        "SYSTEM SESSION IS ACTIVE";


    playSound(
        warningSound,
        0.6
    );


    setTimeout(() => {

        mainText.textContent =
            oldMain;


        subText.textContent =
            oldSub;


        refreshMessageActive = false;

    }, 1200);

}


/* =========================================
   PAGE VISIBILITY
========================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
            Когда пользователь возвращается
            на страницу — маленький glitch.
        */

        if (
            !document.hidden &&
            audioUnlocked
        ) {

            playGlitch(0.2);

        }

    }
);