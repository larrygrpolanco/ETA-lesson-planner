// Toggle expandable sections
document.querySelectorAll('.section-title').forEach((title) => {
  title.addEventListener('click', () => {
    title.classList.toggle('open');
    const section = title.nextElementSibling;
    section.classList.toggle('open');
  });
});

// Remove selected items in multiselect
document.querySelectorAll('.remove-item').forEach((button) => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    button.parentElement.remove();
  });
});
