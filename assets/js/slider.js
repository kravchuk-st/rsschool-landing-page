const slider = document.querySelector('.slider');
const prevSlideBtn = slider.querySelector('.slider__btn_prev');
const nextSlideBtn = slider.querySelector('.slider__btn_next');
const pagination = [...slider.querySelectorAll('.bullet')];
const items = [...slider.querySelectorAll('.slide')];
let currentItem = 0;
let isEnabled = true;

const updatePagination = () => {
	pagination.forEach((bullet, i) => {
		bullet.classList.toggle('active', i === currentItem);
	});
};

const changeCurrentItem = (n) => {
	currentItem = (n + items.length) % items.length;
	updatePagination();
};

const hideItem = (direction) => {
	isEnabled = false;
	const item = items[currentItem];
	item.classList.add(direction);
	item.addEventListener('animationend', () => {
		item.classList.remove('active', direction);
	}, { once: true });
};

const showItem = (direction) => {
	const item = items[currentItem];
	item.classList.add('next', direction);
	item.addEventListener('animationend', () => {
		item.classList.remove('next', direction);
		item.classList.add('active');
		isEnabled = true;
	}, { once: true });
};

const nextItem = (n) => {
	hideItem('to-left');
	changeCurrentItem(n + 1);
	showItem('from-right');
};

const previousItem = (n) => {
	hideItem('to-right');
	changeCurrentItem(n - 1);
	showItem('from-left');
};

prevSlideBtn.addEventListener('click', () => {
	if (isEnabled) {
		previousItem(currentItem);
	}
});

nextSlideBtn.addEventListener('click', () => {
	if (isEnabled) {
		nextItem(currentItem);
	}
});

pagination.forEach((bullet, i) => {
	bullet.addEventListener('click', () => {
		if (!isEnabled || i === currentItem) return;

		if (i > currentItem) {
			hideItem('to-left');
			changeCurrentItem(i);
			showItem('from-right');
		} else {
			hideItem('to-right');
			changeCurrentItem(i);
			showItem('from-left');
		}
	});
});

const swipeDetect = (surface) => {
	let startX = 0;
	let startY = 0;
	let startTime = 0;

	const threshold = 120;
	const restraint = 100;
	const allowedTime = 300;

	const start = (x, y) => {
		startX = x;
		startY = y;
		startTime = Date.now();
	};

	const end = (x, y) => {
		const distX = x - startX;
		const distY = y - startY;
		const elapsedTime = Date.now() - startTime;

		if (!isEnabled || elapsedTime > allowedTime) return;
		if (Math.abs(distX) < threshold || Math.abs(distY) > restraint) return;

		if (distX > 0) {
			previousItem(currentItem);
		} else {
			nextItem(currentItem);
		}
	};

	surface.addEventListener('mousedown', (e) => {
		start(e.pageX, e.pageY);
		e.preventDefault();
	});

	surface.addEventListener('mouseup', (e) => {
		end(e.pageX, e.pageY);
		e.preventDefault();
	});

	surface.addEventListener('touchstart', (e) => {
		const touch = e.changedTouches[0];
		start(touch.pageX, touch.pageY);
	}, { passive: true });

	surface.addEventListener('touchend', (e) => {
		const touch = e.changedTouches[0];
		end(touch.pageX, touch.pageY);
	}, { passive: true });
};

swipeDetect(slider);
