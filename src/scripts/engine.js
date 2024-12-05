

const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardsSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        playerCard: document.getElementById("player-field-card"),
        computerCard: document.getElementById("computer-field-card")
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {
        button: document.getElementById("next-duel")

    },
};
const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Darck Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    },
];

async function getRandomCardId() {
    const cardDataIndex = Math.floor(Math.random() * cardData.length);
    return cardData[cardDataIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", `${pathImages}card-back.png`);
    cardImage.setAttribute("data-id", idCard);
    cardImage.classList.add("card");
    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(idCard);

        });
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        })
    }

    return cardImage;
}

async function setCardsField(cardId) {
    await remoAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showCardsDetails(true);

    await hiddenDetailsCard();

    state.fieldCards.playerCard.src = cardData[cardId].img;
    state.fieldCards.computerCard.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);


    async function showCardsDetails(value) {
        if (value === true) {
            state.fieldCards.playerCard.style.display = "block";
            state.fieldCards.computerCard.style.display = "block";
        }
        if (value === false) {
            state.fieldCards.playerCard.style.display = "none"
            state.fieldCards.computerCard.style.display = "none"
        }
    }
}

async function drawButton(text) {
    state.actions.button.innerText = `${text.toLocaleUpperCase()}!`;
    state.actions.button.style.display = "block";

}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} Lose: ${state.score.computerScore}`
}

async function remoAllCardsImages() {
    let { computerBox, player1Box } = state.playerSides;

    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());


}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randonIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randonIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}
async function drawSelectCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerHTML = cardData[index].name;
    state.cardsSprites.type.innerHTML = `Attribute: ${cardData[index].type}`;

}

async function showTypesResults(playerCardId, computerCardId) {
    state.cardsSprites.type.innerText = `${cardData[playerCardId].type} x ${cardData[computerCardId].type}`
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];
    showTypesResults(playerCardId, computerCardId);
    if (playerCard.WinOf.includes(computerCardId)) {

        duelResults = "Ganhou"
        state.score.playerScore++;
        showTypesResults(playerCardId, computerCardId);

    }
    if (playerCard.LoseOf.includes(computerCardId)) {

        duelResults = "Perdeu"
        state.score.computerScore++;
        showTypesResults(playerCardId, computerCardId);
    }

    await playSound(duelResults);

    return duelResults;

}

async function resetDuel() {
    state.cardsSprites.avatar.src = " "
    state.actions.button.style.display = "none"

    state.fieldCards.playerCard.src = " "
    state.fieldCards.computerCard.src = " "

    state.cardsSprites.name.innerText = "Selecione a ";
    state.cardsSprites.type.innerText = "próxima carta ->";


    init();
}

async function hiddenDetailsCard() {
    state.cardsSprites.avatar.src = ""
    state.cardsSprites.name.innerText = "";
    state.cardsSprites.type.innerText = "";
  
}

async function playSound(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    try {
        audio.play();

    } catch (error) {

    }
}

function init() {
    const audio = document.getElementById("bgm");
    bgm.play();

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
    showCardsDetails();
    state.cardsSprites.name.innerText = "Selecione a ";
    state.cardsSprites.type.innerText = "próxima carta ->";
    
}

init();