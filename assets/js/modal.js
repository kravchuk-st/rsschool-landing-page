export class Modal {
	constructor() {
    this.modal = document.querySelector('.modal');
    if (!this.modal) {
      console.error('Елемент модалки не знайдено!');
      return;
    }

    this.imgEl = this.modal.querySelector('.modal__img-picture');
    this.titleEl = this.modal.querySelector('.modal__title');
    this.descrEl = this.modal.querySelector('.modal__descr');
		this.formEl = this.modal.querySelector('.form');
    this.sizesEl = this.formEl.querySelector('.form__sizes');
    this.additivesEl = this.formEl.querySelector('.form__additives');
    this.priceEl = this.formEl.querySelector('.form__price');
    this.closeBtn = this.formEl.querySelector('.form__btn');
		this.basePrice = 0;

		this.onKeydown = this.onKeydown.bind(this);
		this.updatePrice = this.updatePrice.bind(this);

    this.events();
  }

	events() {
    this.closeBtn.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    this.formEl.addEventListener('change', this.updatePrice);
  }

	onKeydown(e) {
    if (e.key === 'Escape') this.close();
  }

	updatePrice() {
    const sizePrice = Number(
      this.sizesEl.querySelector('input[name="size"]:checked')?.value ?? 0
    );

    const additivesPrice = [...this.additivesEl.querySelectorAll('input[name="additives"]:checked')]
      .reduce((sum, el) => sum + Number(el.value), 0);

    const total = this.basePrice + sizePrice + additivesPrice;
    this.priceEl.textContent = `$${total.toFixed(2)}`;
  }

	open(product, imgId) {
		const paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';

		this.basePrice = Number(product.price);
		this.priceEl.textContent = '$' + product.price;
    this.imgEl.src = `../assets/img/products/${product.category}/${product.category}-${imgId}.avif`;
    this.imgEl.alt = product.name;
    this.titleEl.textContent = product.name;
    this.descrEl.textContent = product.description;

    this.sizesEl.innerHTML = Object.entries(product.sizes)
      .map(([label, info], i) => `
				<input class="radio-btn" type="radio" id="size-${label}" name="size" value="${info['add-price']}" ${i === 0 ? 'checked' : ''} />
				<label class="form__label" for="size-${label}"><span class="label__item">${label.toUpperCase()}</span>${info.size}</label>
			`).join('');

    this.additivesEl.innerHTML = product.additives
      .map((add, i) => `
				<input class="radio-btn" type="checkbox" id="additive-${i}" name="additives" value="${add['add-price']}" />
				<label class="form__label" for="additive-${i}"><span class="label__item">${i + 1}</span>${add.name}</label>
			`).join('');

		document.body.style.paddingRight = paddingOffset;
		document.body.classList.add('lock');
		this.modal.classList.add('active');

		document.addEventListener('keydown', this.onKeydown);
  }

	close() {
    this.modal.classList.remove('active');
		document.body.style = null;
		document.body.classList.remove('lock');
		document.removeEventListener('keydown', this.onKeydown);
  }
}
