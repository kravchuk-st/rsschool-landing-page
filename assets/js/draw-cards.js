import { Tabs } from './tabs.js';

const PAGE_SIZE = 4;
const mobileQuery = window.matchMedia('(max-width: 991.98px)');

const tabsRoot = document.querySelector('[data-tabs="tab"]');
const tabsNav = tabsRoot.querySelector('.tabs__nav');
const tabsContent = tabsRoot.querySelector('.tabs__content');

let categories = [];
let productsByCategory = {};
let mobileCounts = [];
let panels = [];

const cardTemplate = (product, category, i) => `
  <button class="tabs__content-btn card btn-reset" type="button">
    <img class="card__img" src="../assets/img/products/${category}/${category}-${i + 1}.avif" alt="${product.name}">
    <div class="card__body">
      <p class="card__title">${product.name}</p>
      <p class="card__descr">${product.description}</p>
      <p class="card__price">\$${product.price}</p>
    </div>
  </button>
`;

const moreBtnTemplate = (hidden) =>
  `<button class="tabs__more btn-reset" type="button"${hidden ? ' hidden' : ''}>
    <svg class="icon" aria-hidden="true">
      <use xlink:href="../assets/img/svg/more.svg#icon"></use>
    </svg>
  </button>`;

const renderPanel = (i) => {
  const category = categories[i];
  const items = productsByCategory[category];
  const count = mobileQuery.matches ? mobileCounts[i] : items.length;

  panels[i].innerHTML =
    items
      .slice(0, count)
      .map((p, idx) => cardTemplate(p, category, idx))
      .join('') +
    moreBtnTemplate(count >= items.length);
}

const loadMore = (i, btn) => {
  const category = categories[i];
  const items = productsByCategory[category];
  const from = mobileCounts[i];
  const to = Math.min(from + PAGE_SIZE, items.length);

  btn.insertAdjacentHTML(
    'beforebegin',
    items
      .slice(from, to)
      .map((p, idx) => cardTemplate(p, category, from + idx))
      .join('')
  );
  mobileCounts[i] = to;

  if (to >= items.length) btn.hidden = true;
}

tabsContent.addEventListener('click', (e) => {
  const btn = e.target.closest('.tabs__more');
  if (!btn) return;

  const i = panels.indexOf(btn.closest('.tabs__panel'));
  if (i !== -1) loadMore(i, btn);
});

async function getData() {
  try {
    const response = await fetch('../assets/js/products.json');

    if (!response.ok) {
      throw new Error(`Помилка: ${response.status}`);
    }

    const data = await response.json();

    categories = [...new Set(data.map(el => el.category))];
    productsByCategory = Object.fromEntries(
      categories.map(c => [c, data.filter(p => p.category === c)])
    );

    mobileCounts = categories.map(c =>
      Math.min(PAGE_SIZE, productsByCategory[c].length)
    );

    tabsNav.innerHTML = categories.map(category => `
      <li class="tabs__nav-item">
        <button class="tabs__nav-btn btn-reset" type="button" aria-label="Show more cards">
          <span class="tabs__nav-icon" aria-hidden="true">
            <img src="../assets/img/categories/${category}.png" alt="arrow icon" width="16" height="16">
          </span>${category}
        </button>
      </li>
    `).join('');

    tabsContent.innerHTML = categories.map(() => '<div class="tabs__panel"></div>').join('');
    panels = [...tabsContent.querySelectorAll('.tabs__panel')];
    panels.forEach((_, i) => renderPanel(i));

    new Tabs('tab');

    mobileQuery.addEventListener('change', () => {
      panels.forEach((_, i) => renderPanel(i));
    });

  } catch (err) {
    console.error('Не вдалося отримати дані:', err);
  }
}

getData();
