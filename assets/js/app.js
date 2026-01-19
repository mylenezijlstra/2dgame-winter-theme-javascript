let draggedItem = null;
let draggedType = null;

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
   SLOTS (scenes)
===================== */
document.querySelectorAll('.slot').forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());

  slot.addEventListener('drop', () => {
    if (draggedType !== 'scene') return;

    let scene;

    if (draggedItem.classList.contains('scene-instance')) {
      // verplaatsen
      scene = draggedItem;
      scene.parentElement.innerHTML = '';
    } else {
      // clone van template
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
      // verplaatsen
      character = draggedItem;
      character.parentElement.innerHTML = '';
    } else {
      // clone
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
   CHARACTER BALK (verwijderen)
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
   SCENARIO BALK (verwijderen)
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
   STORY CHECK
===================== */
function checkStory() {
  document.querySelectorAll('.scene-instance')
    .forEach(scene => scene.classList.remove('success', 'fail'));

  document.querySelectorAll('.slot').forEach((slot, index) => {
    const scene = slot.querySelector('.scene-instance');
    if (!scene) return;

    const chars = scene.querySelectorAll('.character-instance');
    if (chars.length < 2) return;

    const names = [...chars].map(c => c.dataset.name);

    if (index === 0 && names.includes('edgar') && names.includes('lenora')) {
      scene.classList.add('success');
    }

    if (index === 1 && names.includes('bernard') && names.includes('lenora')) {
      scene.classList.add('fail');
    }

    if (index === 2 && names.includes('edgar') && names.includes('isobel')) {
      scene.classList.add('success');
    }
  });
}
