let draggedItem = null;
let draggedType = null;
let solvedShown = false;

/* =====================
   DRAG START (delegated)
===================== */
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

/* =====================
   SLOTS (scenes plaatsen)
===================== */
document.querySelectorAll('.slot').forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());

  slot.addEventListener('drop', () => {
    if (draggedType !== 'scene') return;

    let scene;

    if (draggedItem.classList.contains('scene-instance')) {
      // scene verplaatsen
      scene = draggedItem;
      scene.parentElement.innerHTML = '';
    } else {
      // scene clonen vanuit balk
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

/* =====================
   SCENE LOGICA
===================== */
function enableScene(scene) {
  scene.addEventListener('dragover', e => e.preventDefault());

  scene.addEventListener('drop', () => {
    if (draggedType !== 'character') return;

    const emptySlot = scene.querySelector('.person-slot:empty');
    if (!emptySlot) return;

    let character;

    if (draggedItem.classList.contains('character-instance')) {
      // character verplaatsen
      character = draggedItem;
      character.parentElement.innerHTML = '';
    } else {
      // character clonen vanuit balk
      character = draggedItem.cloneNode(true);
      character.classList.remove('character');
      character.classList.add('character-instance');
      enableCharacter(character);
    }

    emptySlot.appendChild(character);
    checkStory();
  });
}

/* =====================
   CHARACTER INSTANCE
===================== */
function enableCharacter(character) {
  character.setAttribute('draggable', 'true');

  character.addEventListener('dragstart', () => {
    draggedItem = character;
    draggedType = 'character';
  });
}

/* =====================
   CHARACTER BALK = VERWIJDEREN
===================== */
const characterBar = document.getElementById('characters');
characterBar.addEventListener('dragover', e => e.preventDefault());
characterBar.addEventListener('drop', () => {
  if (draggedItem?.classList.contains('character-instance')) {
    draggedItem.parentElement.innerHTML = '';
    checkStory();
  }
});

/* =====================
   SCENARIO BALK = VERWIJDEREN
===================== */
const scenarioBar = document.getElementById('scenarios');
scenarioBar.addEventListener('dragover', e => e.preventDefault());
scenarioBar.addEventListener('drop', () => {
  if (draggedItem?.classList.contains('scene-instance')) {
    draggedItem.parentElement.innerHTML = '';
    checkStory();
  }
});

/* =====================
   LEVEL CHECK (8 oplossingen)
===================== */
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

/* =====================
   MELDING
===================== */
function showSolvedMessage() {
  if (solvedShown) return;
  solvedShown = true;
  alert('🎉 Level 1 opgelost!');
}
