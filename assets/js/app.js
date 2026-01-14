let draggedItem = null;

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('dragstart', () => {
    draggedItem = card;
  });
});

document.querySelectorAll('.slot').forEach(slot => {
  slot.addEventListener('dragover', e => {
    e.preventDefault();
  });

  slot.addEventListener('drop', () => {
    if (draggedItem.classList.contains('scenario')) {
      slot.innerHTML = '';
      slot.appendChild(draggedItem);
    }
  });
});
