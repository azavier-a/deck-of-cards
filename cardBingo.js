const resetButton = document.getElementById("deckResetButtonInput");
const useJokersRadio = document.getElementById("radioJokerTrue");
const exclusionsHolder = document.getElementById("exclusionsList");
const addExclusionText = document.getElementById("addExclusionTextInput");
const addExclusionButton = document.getElementById("addExclusionButtonInput");
const cardTextDisplay = document.getElementById("cardText")
const cardsLeftDisplay = document.getElementById("cardsLeft");
const docMain = document.querySelector("main");

const SUITES = ["Hearts","Spades","Clubs","Diamonds"];
const CARDS = ["Ace","2","3","4","5","6","7","8","9","10","Jack","Queen","King"];

const deckOfCards = [];
const EXCLUSIONS = [];

function shuffleDeck() {
    for (let i = deckOfCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [deckOfCards[i], deckOfCards[j]] = [deckOfCards[j], deckOfCards[i]];
    }
}

function checkIsCardValid(card) {
    for(const CARD of CARDS) {
        if(CARD.toLowerCase() == card.toLowerCase()) return true;
    }
    return false;
}
function checkIsSuiteValid(suite) {
    for(const SUITE of SUITES) {
        if(SUITE.toLowerCase() == suite.toLowerCase()) return true;
    }
    return false;
}
function addToExclusions(str) {
    const SPLIT = str.split(" ");

    if(!checkIsCardValid(SPLIT[0])) return false;
    if(SPLIT[1].toLowerCase() != "of") return false;
    if(!checkIsSuiteValid(SPLIT[2])) return false;


    const lowered = str.toLowerCase();
    if(EXCLUSIONS.includes(lowered)) return false;


    const newElement = document.createElement("li");
    newElement.innerHTML = lowered;

    const newButton = document.createElement("input");
    newButton.type = 'button';
    newButton.value = 'X';
    newButton.className = 'exclusionRemoveButton';

    newButton.onclick = () => {
        removeFromExclusions(lowered);
        exclusionsHolder.removeChild(newElement);
        generateNewDeck();
    }

    newElement.appendChild(newButton);

    EXCLUSIONS.push(lowered);
    exclusionsHolder.appendChild(newElement)
    return true;
}

function removeFromExclusions(str) {
    EXCLUSIONS.splice(EXCLUSIONS.indexOf(str), 1);
}

function removeFromDeck(str) {
    for(let i = 0; i < deckOfCards.length; i++) {
        if(deckOfCards[i].toLowerCase() == str.toLowerCase()) {
            deckOfCards.splice(i, 1);
            return true;
        }
    }
    return false;
}

function generateNewDeck() {
    deckOfCards.splice(0, deckOfCards.length);

    for(const suite of SUITES) for(const card of CARDS) {
        const str = card  +" of "+ suite;

        if(EXCLUSIONS.includes(str.toLowerCase())) continue;

        deckOfCards.push(str);
    }

    if(useJokersRadio.checked) {
        deckOfCards.push("Red Joker");
        deckOfCards.push("Black Joker");
    }

    for(let i = 0; i < 211; i++) shuffleDeck();

    cardTextDisplay.innerHTML = "Click to Start";
    cardsLeftDisplay.innerHTML = deckOfCards.length;
}

function Utter(str, timeout) {
    setTimeout(() => {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(str));
    }, timeout);
}

function drawFromDeck() {
    window.speechSynthesis.cancel();

    if(deckOfCards.length == 0) {
        cardsLeftDisplay.innerHTML = "There are no more!";
        docMain.style="background-color: rgb(124, 59, 59)";
        setTimeout(()=>docMain.style="", 1000);
        Utter('There are no more cards', 1000);
        return;
    }

    const randomIndex = Math.floor(Math.random()*deckOfCards.length);

    const card = deckOfCards[randomIndex];
    cardTextDisplay.innerHTML = card;

    Utter(card, 2100 + Math.random()*350);

    deckOfCards.splice(randomIndex, 1);
    cardsLeftDisplay.innerHTML = deckOfCards.length;
}

window.addEventListener("load", generateNewDeck);
resetButton.addEventListener("click", generateNewDeck);

docMain.addEventListener("click", drawFromDeck);

addExclusionButton.addEventListener("click", () => {
    if(addToExclusions(addExclusionText.value)) {
        addExclusionButton.style = "background-color: rgb(50, 200, 50)";
        generateNewDeck();

    } else addExclusionButton.style = "background-color: rgb(200, 50, 50)";
    
    setTimeout(() => addExclusionButton.style = "", 500);
});