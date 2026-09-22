class BurgerMenu {
  constructor({
    burgerSelector = '.burger',
    menuSelector = '.nav',
    linkSelector = '.nav__link',
    overlaySelector = '.overlay',
    openClass = 'open',
    burgerOpenClass = 'burger_open',
    scrollLockClass = 'disable-scroll',
  } = {}) {
    this.body = document.body;
    this.burger = document.querySelector(burgerSelector);
    this.menu = document.querySelector(menuSelector);
    this.overlay = document.querySelector(overlaySelector);
    this.menuLinks = [...this.menu.querySelectorAll(linkSelector)];

    this.openClass = openClass;
    this.burgerOpenClass = burgerOpenClass;
    this.scrollLockClass = scrollLockClass;

    this.isOpen = false;

    this.bindEvents();
  }

  open() {
    const paddingOffset = window.innerWidth - this.body.offsetWidth + 'px';

    this.menu.classList.add(this.openClass);
    this.burger.classList.add(this.burgerOpenClass);
    this.burger.setAttribute('aria-expanded', 'true');
    this.burger.setAttribute('aria-label', 'close burger');
    this.body.style.paddingRight = paddingOffset;
    this.body.classList.add(this.scrollLockClass);

    this.isOpen = true;
  }

  close() {
    this.menu.classList.remove(this.openClass);
    this.burger.classList.remove(this.burgerOpenClass);
    this.burger.setAttribute('aria-expanded', 'false');
    this.burger.setAttribute('aria-label', 'open burger');
    this.body.style = null;
    this.body.classList.remove(this.scrollLockClass);

    this.isOpen = false;
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  bindEvents() {
    this.burger.addEventListener('click', () => this.toggle());

    this.overlay?.addEventListener('click', () => {
      if (this.isOpen) this.close();
    });

    this.menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (this.isOpen) this.close();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }
}

new BurgerMenu();
