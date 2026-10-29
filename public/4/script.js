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

// Keep the progress rail synchronized with the section in view.
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
    if (link.getAttribute('href')?.slice(1) === id) link.setAttribute('aria-current', 'location');
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

// Interpolation detail: toggle between nearest neighbor and bilinear on the same crop.
document.querySelectorAll('.interp-toggle').forEach((figure) => {
  const images = [...figure.querySelectorAll('img[data-method]')];
  const buttons = [...figure.querySelectorAll('button[data-method]')];
  const label = figure.querySelector('.interp-label');
  buttons.forEach((button) => button.addEventListener('click', () => {
    images.forEach((img) => { img.hidden = img.dataset.method !== button.dataset.method; });
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    if (label) label.textContent = button.textContent;
  }));
});
