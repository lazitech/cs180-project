const sectionOrder = [
  'cover',
  'method',
  'single',
  'edges',
  'multiscale',
  'cropping',
  'pyramid',
  'selections',
  'measurements',
];

const main = document.querySelector('main');
const progress = document.querySelector('.progress');
const total = progress?.querySelector('.total');

// Keep the report's reading order and progress rail in sync. The two
// technical sections are intentionally presented as feature matching first,
// followed by the image-pyramid search that uses it.
sectionOrder.forEach((id) => {
  const section = document.getElementById(id);
  if (section) main?.append(section);

  const link = progress?.querySelector(`a[href="#${id}"]`);
  if (link && total) progress.insertBefore(link, total);
});

const edgesKicker = document.querySelector('#edges .kicker');
const pyramidKicker = document.querySelector('#multiscale .kicker');
const pyramidVisualKicker = document.querySelector('#multiscale .pyramid-visual .kicker');
if (edgesKicker) edgesKicker.textContent = '03 / Feature matching';
if (pyramidKicker) pyramidKicker.textContent = '04 / Image pyramid';
if (pyramidVisualKicker) pyramidVisualKicker.textContent = '04 / Image pyramid visualization';

const sections = [...document.querySelectorAll('main > section')];
const links = [...document.querySelectorAll('.progress a')];
function setActive(id) {
  const index = sections.findIndex(section => section.id === id);
  links.forEach((link, i) => {
    if (i === index) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  document.querySelector('#section-number').textContent = String(index + 1).padStart(2, '0');
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));
}
setActive('cover');
document.querySelectorAll('.selected-figure').forEach(figure => {
  const aligned = figure.querySelector('.comparison img:first-child');
  const before = figure.querySelector('.before-image');
  const buttons = [...figure.querySelectorAll('button[data-state]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const showBefore = button.dataset.state === 'before';
    aligned.hidden = showBefore;
    before.hidden = !showBefore;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
});
