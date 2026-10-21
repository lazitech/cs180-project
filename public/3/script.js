// Typeset \( … \) and \[ … \] formulas with KaTeX, loaded by the deferred scripts before this one.
if (window.renderMathInElement) {
  renderMathInElement(document.body, {
    delimiters: [
      { left: '\\[', right: '\\]', display: true },
      { left: '\\(', right: '\\)', display: false },
    ],
    fleqn: true,
    throwOnError: false,
  });
}

// Keep the progress rail synchronized with the report without changing the
// document order. Section order is defined by the HTML page itself.
const sections = [...document.querySelectorAll('main > section[id]')];
const progress = document.querySelector('.progress');
const links = progress ? [...progress.querySelectorAll('a[href^="#"]')] : [];
const number = document.querySelector('#section-number');
const total = progress?.querySelector('.total');

if (total) total.textContent = String(sections.length).padStart(2, '0');

function setActive(id) {
  const index = sections.findIndex((section) => section.id === id);
  if (index < 0) return;

  links.forEach((link) => {
    const linkId = link.getAttribute('href')?.slice(1);
    if (linkId === id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });

  if (number) number.textContent = String(index + 1).padStart(2, '0');
}

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

if (sections.length) setActive(sections[0].id);

// Cover anagram: rotate the same image 180 degrees and show the prompt for that orientation.
document.querySelectorAll('.anagram-demo').forEach((demo) => {
  const label = demo.querySelector('.anagram-label');
  const buttons = [...demo.querySelectorAll('button[data-turn]')];
  buttons.forEach((button) => button.addEventListener('click', () => {
    const rotated = button.dataset.turn === '1';
    demo.classList.toggle('is-rotated', rotated);
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    if (label) label.textContent = `"${rotated ? demo.dataset.rotated : demo.dataset.upright}"`;
  }));
});

// Hybrid images: shrink the full-size result in place to simulate stepping back.
document.querySelectorAll('.hybrid-full').forEach((figure) => {
  const stage = figure.querySelector('.distance-stage');
  const input = figure.querySelector('input[type="range"]');
  if (!stage || !input) return;
  const update = () => stage.style.setProperty('--scale', input.value);
  input.addEventListener('input', update);
  update();
});
