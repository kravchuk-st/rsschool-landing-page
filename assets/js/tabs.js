export class Tabs {
  constructor(selector) {
    this.selector = selector;
    this.tabs = document.querySelector(`[data-tabs="${selector}"]`);
    if (!this.tabs) {
      console.error('Елемент з таким data-tabs не існує!');
      return;
    }

    this.tabList = this.tabs.querySelector('.tabs__nav');
    this.tabsBtns = this.tabList.querySelectorAll('.tabs__nav-btn');
    this.tabsPanels = this.tabs.querySelectorAll('.tabs__panel');

    if (!this.check()) return;
    this.init();
    this.events();
  }

  check() {
    if (document.querySelectorAll(`[data-tabs="${this.selector}"]`).length > 1) {
      console.error('Кількість елементів з однаковим data-tabs більша за одну!');
      return false;
    }

    if (this.tabsBtns.length !== this.tabsPanels.length) {
      console.error('Кількість кнопок і панелей табів не збігається!');
      return false;
    }

    if (this.tabsBtns.length === 0) {
      console.error('Немає жодного табу!');
      return false;
    }

    return true;
  }

  init() {
    this.tabList.setAttribute('role', 'tablist');

    this.tabsBtns.forEach((el, i) => {
      el.setAttribute('role', 'tab');
      el.setAttribute('tabindex', '-1');
      el.setAttribute('id', `${this.selector}${i + 1}`);
      el.classList.remove('active');
    });

    this.tabsPanels.forEach((el, i) => {
      el.setAttribute('role', 'tabpanel');
      el.setAttribute('tabindex', '-1');
      el.setAttribute('aria-labelledby', this.tabsBtns[i].id);
      el.classList.remove('active');
    });

    this.tabsBtns[0].classList.add('active');
    this.tabsBtns[0].removeAttribute('tabindex');
    this.tabsBtns[0].setAttribute('aria-selected', 'true');
    this.tabsPanels[0].classList.add('active');
  }

  events() {
    this.tabsBtns.forEach((el, i) => {
      el.addEventListener('click', (e) => {
        const currentTab = this.tabList.querySelector('[aria-selected]');

        if (e.currentTarget !== currentTab) {
          this.switchTabs(e.currentTarget, currentTab);
        }
      });

      el.addEventListener('keydown', (e) => {
        const index = Array.prototype.indexOf.call(this.tabsBtns, e.currentTarget);
        let dir = null;

        if (e.key === 'ArrowLeft') dir = index - 1;
        else if (e.key === 'ArrowRight') dir = index + 1;
        else if (e.key === 'ArrowDown') dir = 'down';

        if (dir === null) return;

        if (dir === 'down') {
          this.tabsPanels[i].focus();
        } else if (this.tabsBtns[dir]) {
          this.switchTabs(this.tabsBtns[dir], e.currentTarget);
        }
      });
    });
  }

  switchTabs(newTab, oldTab = this.tabs.querySelector('[aria-selected]')) {
    oldTab.removeAttribute('aria-selected');
    oldTab.setAttribute('tabindex', '-1');

    newTab.focus();
    newTab.removeAttribute('tabindex');
    newTab.setAttribute('aria-selected', 'true');

    const index = Array.prototype.indexOf.call(this.tabsBtns, newTab);
    const oldIndex = Array.prototype.indexOf.call(this.tabsBtns, oldTab);

    this.tabsPanels[oldIndex].classList.remove('active');
    this.tabsPanels[index].classList.add('active');

    this.tabsBtns[oldIndex].classList.remove('active');
    this.tabsBtns[index].classList.add('active');
  }
}
