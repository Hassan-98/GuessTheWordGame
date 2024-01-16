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
const firstInput = document.querySelector('#trail_1 input');

const maxTrails = 6;
let currentTrail = 1;
let remainingHints = 2;
let currentCharacterOrder = 1;
let isGameOver = false;

window.onload = () => firstInput.focus();

function getRandomWordFromArray() {
  return wordsArray[Math.floor(Math.random() * wordsArray.length)];
}

const TO_BE_GUESSED_WORD = getRandomWordFromArray();

function getCurrentTrailBox() {
  return {
    trailBox: trailsBoxes[currentTrail - 1],
    characterInputs: [
      trailsBoxes[currentTrail - 1].querySelector('input:nth-of-type(1)'),
      trailsBoxes[currentTrail - 1].querySelector('input:nth-of-type(2)'),
      trailsBoxes[currentTrail - 1].querySelector('input:nth-of-type(3)'),
      trailsBoxes[currentTrail - 1].querySelector('input:nth-of-type(4)'),
      trailsBoxes[currentTrail - 1].querySelector('input:nth-of-type(5)'),
      trailsBoxes[currentTrail - 1].querySelector('input:nth-of-type(6)')
    ]
  }
}

const isMobile = window.matchMedia('(max-width: 800px)').matches;

function writeCharaterToCharBox(e) {
  if (isGameOver) return;
  const PRESSED_KEY = e.key;
  const isDeleteKey = e.which === 8 || e.which === 46;

  if (!isDeleteKey && !(/^[a-zA-Z]$/.test(e.key)) && !isMobile) return;

  const currentTrailBox = getCurrentTrailBox();

  if (isMobile && currentTrailBox.characterInputs[currentCharacterOrder - 1].value !== '') {
    currentCharacterOrder += 1;

    if (currentCharacterOrder <= maxTrails) {
      currentTrailBox.characterInputs[currentCharacterOrder - 1].focus();
    }
  }

  // DELETE A CHARACTER CASE
  if (isDeleteKey) {
    if (currentCharacterOrder === 1) return;
    currentCharacterOrder -= 1;
    currentTrailBox.characterInputs[currentCharacterOrder - 1].value = '';

    currentTrailBox.characterInputs.forEach(charElement => {
      charElement.classList.remove('focus');
    });
    currentTrailBox.characterInputs[currentCharacterOrder - 1].classList.add('focus');
    currentTrailBox.characterInputs[currentCharacterOrder - 1].focus();
    return;
  }

  // WRITE A CHARACTER CASE
  if (currentCharacterOrder > maxTrails) return;

  const isEnglishLetter = /^[a-zA-Z]$/.test(PRESSED_KEY);
  if (!isEnglishLetter) return;

  currentTrailBox.characterInputs[currentCharacterOrder - 1].value = PRESSED_KEY.toUpperCase();
  currentCharacterOrder += 1;

  currentTrailBox.characterInputs.forEach(charElement => {
    charElement.classList.remove('focus');
  });

  if (currentCharacterOrder <= maxTrails) {
    currentTrailBox.characterInputs[currentCharacterOrder - 1].classList.add('focus');
    currentTrailBox.characterInputs[currentCharacterOrder - 1].focus();
  }
}

document.querySelectorAll('input').forEach(input => {
  input.addEventListener('keyup', writeCharaterToCharBox);
  input.onfocus = function () {
    if (isMobile) currentCharacterOrder = +input.id.slice(-1);
  }
})

function handleCheckWord() {
  if (isGameOver) return;
  const trailBox = getCurrentTrailBox();
  const writtenWordLetters = trailBox.characterInputs.map(element => element.value.toUpperCase());
  const toBeGuessedWordLetters = TO_BE_GUESSED_WORD.toUpperCase().split('');

  // Check letters
  let inPlaceCharsCount = 0;
  writtenWordLetters.forEach((letter, index) => {
    if (toBeGuessedWordLetters[index] === letter) {
      trailBox.characterInputs[index].classList.add('in_place');
      inPlaceCharsCount += 1;

      const letterElementInGuessedWord = guessedWord.querySelector(`input:nth-of-type(${index + 1})`);
      if (letterElementInGuessedWord) letterElementInGuessedWord.value = letter;
    } else if (toBeGuessedWordLetters.indexOf(letter) !== -1) {
      trailBox.characterInputs[index].classList.add('not_in_place');
    } else {
      trailBox.characterInputs[index].classList.add('not_exist');
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
    trailBox.characterInputs.forEach(charElement => charElement.classList.remove('focus'));
    getCurrentTrailBox().characterInputs.forEach(charElement => charElement.removeAttribute('disabled'));
    getCurrentTrailBox().characterInputs[currentCharacterOrder - 1].classList.add('focus');
    getCurrentTrailBox().characterInputs[currentCharacterOrder - 1].focus();
  }
}

checkWordButton.addEventListener('click', handleCheckWord);

function showAHint() {
  if (isGameOver) return;
  if (remainingHints === 0) return;

  const trailBox = getCurrentTrailBox();
  const randomIndex = Math.floor(Math.random() * TO_BE_GUESSED_WORD.length);
  const randomHintLetter = TO_BE_GUESSED_WORD[randomIndex];

  trailBox.characterInputs[randomIndex].value = randomHintLetter.toUpperCase();
  trailBox.characterInputs[randomIndex].classList.add('in_place');
  remainingHints -= 1;

  remainingHintSpan.innerHTML = remainingHints;
  if (remainingHints === 0) remainingHintSpan.parentElement.style.pointerEvents = 'none';
}

hintButton.addEventListener('click', showAHint);