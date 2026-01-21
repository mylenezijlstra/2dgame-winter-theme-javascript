/* ========================= */
/*  BOEK PAGINA FLOW         */
/* ========================= */

const p1 = document.getElementById("page1");
const p2 = document.getElementById("page2");
const p3 = document.getElementById("page3");
const p4 = document.getElementById("page4");
const game = document.getElementById("game");

p1.addEventListener("click", () => {
  p1.classList.add("hidden");
  p2.classList.remove("hidden");
});

p2.addEventListener("click", () => {
  p2.classList.add("hidden");
  p3.classList.remove("hidden");
});

p3.addEventListener("click", () => {
  p3.classList.add("hidden");
  p4.classList.remove("hidden");
});

document.getElementById("startGame").addEventListener("click", (e) => {
  e.preventDefault();
  p4.classList.add("hidden");
  game.classList.remove("hidden");
});

/* ========================= */
/*  DRAG & DROP (jouw code)  */
/* ========================= */

let draggedItem = null;
let draggedType = null;
let solvedShown = false;

document.addEventListener('dragstart', e => {
  const el = e.target.closest('.card, .scene-instance, .character-instance');
  if (!el) return;

  draggedItem = el;

  if (el.classList.contains('scenario') || el.classList.contains('scene-instance')) {
    draggedType = 'scene';
  } else {
    draggedType = 'character';
  }
});

document.querySelectorAll('.slot').forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());

  slot.addEventListener('drop', () => {
    if (draggedType !== 'scene') return;

    let scene;

    if (draggedItem.classList.contains('scene-instance')) {
      scene = draggedItem;
      scene.parentElement.innerHTML = '';
    } else {
      scene = draggedItem.cloneNode(true);
      scene.classList.add('scene-instance');
      scene.removeAttribute('draggable');
      enableScene(scene);
    }

    slot.innerHTML = '';
    slot.appendChild(scene);
    checkStory();
  });
});

function enableScene(scene) {
  scene.addEventListener('dragover', e => e.preventDefault());

  scene.addEventListener('drop', () => {
    if (draggedType !== 'character') return;

    const emptySlot = scene.querySelector('.person-slot:empty');
    if (!emptySlot) return;

    let character;

    if (draggedItem.classList.contains('character-instance')) {
      character = draggedItem;
      character.parentElement.innerHTML = '';
    } else {
      character = draggedItem.cloneNode(true);
      character.classList.remove('character');
      character.classList.add('character-instance');
      enableCharacter(character);
    }

    emptySlot.appendChild(character);
    checkStory();
  });
}

function enableCharacter(character) {
  character.setAttribute('draggable', 'true');

  character.addEventListener('dragstart', () => {
    draggedItem = character;
    draggedType = 'character';
  });
}

const characterBar = document.getElementById('characters');
characterBar.addEventListener('dragover', e => e.preventDefault());
characterBar.addEventListener('drop', () => {
  if (draggedItem?.classList.contains('character-instance')) {
    draggedItem.parentElement.innerHTML = '';
    checkStory();
  }
});

const scenarioBar = document.getElementById('scenarios');
scenarioBar.addEventListener('dragover', e => e.preventDefault());
scenarioBar.addEventListener('drop', () => {
  if (draggedItem?.classList.contains('scene-instance')) {
    draggedItem.parentElement.innerHTML = '';
    checkStory();
  }
});

function checkStory() {
  const slots = document.querySelectorAll('.slot');
  const currentSolution = [];

  for (let slot of slots) {
    const scene = slot.querySelector('.scene-instance');
    if (!scene) return;

    const chars = scene.querySelectorAll('.character-instance');
    if (chars.length !== 2) return;

    const names = [...chars]
      .map(c => c.dataset.name)
      .sort();

    currentSolution.push(names.join('+'));
  }

  const validSolutions = [
    ['edgar+lenora', 'edgar+isobel', 'bernard+isobel'],
    ['edgar+lenora', 'bernard+lenora', 'bernard+isobel'],
    ['edgar+isobel', 'edgar+lenora', 'bernard+lenora'],
    ['edgar+isobel', 'bernard+isobel', 'bernard+lenora'],
    ['bernard+lenora', 'bernard+isobel', 'edgar+isobel'],
    ['bernard+lenora', 'edgar+lenora', 'edgar+isobel'],
    ['bernard+isobel', 'bernard+lenora', 'edgar+lenora'],
    ['bernard+isobel', 'edgar+isobel', 'edgar+lenora']
  ].map(solution =>
    solution.map(pair => pair.split('+').sort().join('+'))
  );

  const solved = validSolutions.some(solution =>
    solution.every((pair, index) => pair === currentSolution[index])
  );

  if (solved) showSolvedMessage();
}

function showSolvedMessage() {
  if (solvedShown) return;
  solvedShown = true;
  alert('🎉 Level 1 opgelost!');
}
