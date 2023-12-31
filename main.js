const wordsArray = [
  "purple", "banana", "jacket", "rocket", "guitar", "window", "forest", "sunset", "soccer", "pickle",
  "shadow", "planet", "silver", "basket", "mellow", "travel", "tissue", "waffle", "yellow", "purple",
  "coffee", "bottle", "flower", "puzzle", "pocket", "honest", "museum", "modern", "cactus", "turtle",
  "frozen", "syrup", "purple", "banana", "jacket", "rocket", "guitar", "window", "forest", "sunset",
  "soccer", "pickle", "shadow", "planet", "silver", "basket", "mellow", "travel", "tissue", "waffle",
  "yellow", "purple", "coffee", "bottle", "flower", "puzzle", "pocket", "honest", "museum", "modern",
  "cactus", "turtle", "frozen", "syrup", "purple", "banana", "jacket", "rocket", "guitar", "window",
  "forest", "sunset", "soccer", "pickle", "shadow", "planet", "silver", "basket", "mellow", "travel",
  "tissue", "waffle", "yellow", "purple", "coffee", "bottle", "flower", "puzzle", "pocket", "honest",
  "museum", "modern", "cactus", "turtle", "frozen", "syrup"
];

const checkWordButton = document.getElementById("check_word");
const hintButton = document.getElementById("hint_me");
const remainingHintSpan = document.getElementById("hints");
const winningResult = document.querySelector(".winning_result");
const winningCanvas = document.querySelector('#winning_canvas');
const failingResult = document.querySelector(".failing_result");
const guessedWord = document.querySelector(".the_word");
const correctWordElement = document.querySelector("#correct_word");
const trailsBoxes = document.querySelectorAll('.trail');

const maxTrails = 6;
let currentTrail = 1;
let remainingHints = 2;
let currentCharacterOrder = 1;
let isGameOver = false;


function getRandomWordFromArray() {
  return wordsArray[Math.floor(Math.random() * wordsArray.length)];
}

const TO_BE_GUESSED_WORD = getRandomWordFromArray();

function getCurrentTrailBox() {
  return {
    trailBox: trailsBoxes[currentTrail - 1],
    characterBoxes: [
      trailsBoxes[currentTrail - 1].querySelector('span:nth-of-type(1)'),
      trailsBoxes[currentTrail - 1].querySelector('span:nth-of-type(2)'),
      trailsBoxes[currentTrail - 1].querySelector('span:nth-of-type(3)'),
      trailsBoxes[currentTrail - 1].querySelector('span:nth-of-type(4)'),
      trailsBoxes[currentTrail - 1].querySelector('span:nth-of-type(5)'),
      trailsBoxes[currentTrail - 1].querySelector('span:nth-of-type(6)')
    ]
  }
}

function writeCharaterToCharBox(e) {
  if (isGameOver) return;
  const PRESSED_KEY = String.fromCharCode(e.which);
  const isDeleteKey = e.which === 8 || e.which === 46;

  const currentTrailBox = getCurrentTrailBox();

  // DELETE A CHARACTER CASE
  if (isDeleteKey) {
    if (currentCharacterOrder === 1) return;
    currentCharacterOrder -= 1;
    currentTrailBox.characterBoxes[currentCharacterOrder - 1].innerHTML = '';

    currentTrailBox.characterBoxes.forEach(charElement => {
      charElement.classList.remove('focus');
      charElement.setAttribute('contenteditable', 'false');
    });
    currentTrailBox.characterBoxes[currentCharacterOrder - 1].classList.add('focus');
    currentTrailBox.characterBoxes[currentCharacterOrder - 1].setAttribute('contenteditable', 'true');
    return;
  }

  // WRITE A CHARACTER CASE
  if (currentCharacterOrder > maxTrails) return;

  const isEnglishLetter = /^[a-zA-Z]$/.test(e.key);
  if (!isEnglishLetter) return;

  currentTrailBox.characterBoxes[currentCharacterOrder - 1].innerHTML = PRESSED_KEY;
  currentCharacterOrder += 1;

  currentTrailBox.characterBoxes.forEach(charElement => {
    charElement.classList.remove('focus');
    charElement.setAttribute('contenteditable', 'false');
  });
  currentTrailBox.characterBoxes[currentCharacterOrder - 1].classList.add('focus');
  currentTrailBox.characterBoxes[currentCharacterOrder - 1].setAttribute('contenteditable', 'true');
}

window.onkeyup = writeCharaterToCharBox;

function handleCheckWord() {
  if (isGameOver) return;
  const trailBox = getCurrentTrailBox();
  const writtenWordLetters = trailBox.characterBoxes.map(element => element.innerHTML.toLowerCase());
  const toBeGuessedWordLetters = TO_BE_GUESSED_WORD.toLowerCase().split('');

  // Check letters
  let inPlaceCharsCount = 0;
  writtenWordLetters.forEach((letter, index) => {
    if (toBeGuessedWordLetters[index] === letter) {
      trailBox.characterBoxes[index].classList.add('in_place');
      inPlaceCharsCount += 1;

      const letterElementInGuessedWord = guessedWord.querySelector(`span:nth-of-type(${index + 1})`);
      if (letterElementInGuessedWord) letterElementInGuessedWord.innerHTML = letter;
    } else if (toBeGuessedWordLetters.indexOf(letter) !== -1) {
      trailBox.characterBoxes[index].classList.add('not_in_place');
    } else {
      trailBox.characterBoxes[index].classList.add('not_exist');
    }
  });
  currentCharacterOrder = 1;

  if (inPlaceCharsCount === 6) {
    winningResult.classList.add('show');

    setTimeout(() => {
      const winningConfetti = confetti.create(winningCanvas, {
        resize: true,
        useWorker: true
      });

      winningConfetti({
        particleCount: 500,
        spread: 200
      });
    }, 300);

    isGameOver = true;
    return;
  }

  if (currentTrail === maxTrails) {
    correctWordElement.innerHTML = TO_BE_GUESSED_WORD;
    failingResult.classList.add('show');
    isGameOver = true;
    return;
  } else {
    currentTrail += 1;
    getCurrentTrailBox().trailBox.classList.remove('not_checked');
    trailBox.characterBoxes.forEach(charElement => charElement.classList.remove('focus'));
    getCurrentTrailBox().characterBoxes[currentCharacterOrder - 1].classList.add('focus');
    getCurrentTrailBox().characterBoxes[currentCharacterOrder - 1].setAttribute('contenteditable', 'true');
  }
}

checkWordButton.addEventListener('click', handleCheckWord);

function showAHint() {
  if (isGameOver) return;
  if (remainingHints === 0) return;
  const trailBox = getCurrentTrailBox();
  const randomIndex = Math.floor(Math.random() * TO_BE_GUESSED_WORD.length);
  const randomHintLetter = TO_BE_GUESSED_WORD[randomIndex];

  trailBox.characterBoxes[randomIndex].innerHTML = randomHintLetter.toUpperCase();
  trailBox.characterBoxes[randomIndex].classList.add('in_place');
  remainingHints -= 1;

  remainingHintSpan.innerHTML = remainingHints;
}

hintButton.addEventListener('click', showAHint);