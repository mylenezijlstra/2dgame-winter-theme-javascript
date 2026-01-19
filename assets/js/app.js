let draggedItem = null;
let draggedType = null;

/* =====================
   DRAG START
===================== */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('dragstart', () => {
    draggedItem = card;
    draggedType = card.classList.contains('scenario')
      ? 'scenario'
      : 'character';
  });
});

/* =====================
   SCENE NAAR SLOT
===================== */
document.querySelectorAll('.slot').forEach(slot => {
  slot.addEventListener('dragover', e => e.preventDefault());

  slot.addEventListener('drop', () => {
    if (draggedType !== 'scenario') return;

    const scene = draggedItem.cloneNode(true);
    scene.classList.add('scene-instance');
    scene.removeAttribute('draggable');

    slot.innerHTML = '';
    slot.appendChild(scene);

    enableScene(scene);
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

    const character = draggedItem.cloneNode(true);
    character.classList.add('character-instance');
    character.removeAttribute('draggable');

    emptySlot.appendChild(character);
    checkStory();
  });
}

/* =====================
   STORY CHECK
===================== */
function checkStory() {
  const slots = document.querySelectorAll('.slot');

  slots.forEach((slot, index) => {
    const scene = slot.querySelector('.scene-instance');
    if (!scene) return;

    const chars = scene.querySelectorAll('.character-instance');
    if (chars.length < 2) return;

    const names = [...chars].map(c => c.dataset.name);
    const title = scene.querySelector('.title');

    title.textContent = 'Wedding';

    // Scene 1: Edgar + Lenora
    if (
      index === 0 &&
      names.includes('edgar') &&
      names.includes('lenora')
    ) {
      title.textContent = 'Wedding ❤️';
    }

    // Scene 2: Bernard + Lenora
    if (
      index === 1 &&
      names.includes('bernard') &&
      names.includes('lenora')
    ) {
      title.textContent = 'Rejected 💔';
    }

    // Scene 3: Edgar + Isobel
    if (
      index === 2 &&
      names.includes('edgar') &&
      names.includes('isobel')
    ) {
      title.textContent = 'Love Healed ❤️';
    }
  });
}
