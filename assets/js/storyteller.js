/*EMOTIES*/
function updateWeddingHeart(scene) {
  const old = scene.querySelector('.emotion');
  if (old) old.remove();

  if (scene.dataset.type !== 'wedding') return;

  const chars = scene.querySelectorAll('.character-instance');
  if (chars.length !== 2) return;

  const heart = document.createElement('div');
  heart.classList.add('emotion');
  heart.textContent = '❤️';

  scene.appendChild(heart);
}

let draggedItem = null;
let draggedType = null;
let solvedShown = false;

/* DRAG START */
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

/* SCENE → SLOT */
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

    updateWeddingHeart(scene); // ⭐ TOEGEVOEGD

    checkStory();
  });
});

/* CHARACTER → SCENE */
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

    updateWeddingHeart(scene); // ⭐ TOEGEVOEGD

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

/* RETURN CHARACTER */
document.getElementById('characters').addEventListener('dragover', e => e.preventDefault());
document.getElementById('characters').addEventListener('drop', () => {
  if (draggedItem?.classList.contains('character-instance')) {
    const scene = draggedItem.closest('.scene-instance');

    draggedItem.parentElement.innerHTML = '';

    if (scene) updateWeddingHeart(scene); // ⭐ TOEGEVOEGD

    checkStory();
  }
});

/* LEVEL CHECK */
function checkStory() {
  const slots = document.querySelectorAll('.slot');
  const result = [];

  for (let slot of slots) {
    const scene = slot.querySelector('.scene-instance');
    if (!scene) return;

    const type = scene.dataset.type;
    const chars = scene.querySelectorAll('.character-instance');

    if (type === 'amnesia') {
      if (chars.length !== 1) return;
      result.push(`amnesia-${chars[0].dataset.name}`);
    } else {
      if (chars.length !== 2) return;
      result.push(type);
    }
  }

  const solutions = [
    [
      'wedding',
      'fight',
      'amnesia-edgar',
      'amnesia-lenora',
      'wedding',
      'fight'
    ],
    [
      'wedding',
      'fight',
      'amnesia-lenora',
      'amnesia-edgar',
      'wedding',
      'fight'
    ]
  ];

  const solved = solutions.some(solution =>
    solution.every((step, i) => step === result[i])
  );

  if (solved) showSolvedMessage();
}

function showSolvedMessage() {
  if (solvedShown) return;
  solvedShown = true;
  alert('Solved! 💔 The cycle continues.');
}
