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
}

const changeCurrentItem = (n) => {
	currentItem = (n + items.length) % items.length;
	updatePagination();
}

const hideItem = (direction) => {
	isEnabled = false;
	items[currentItem].classList.add(direction);
	items[currentItem].addEventListener('animationend', function() {
		this.classList.remove('active', direction);
	});
}

const showItem = (direction) => {
	items[currentItem].classList.add('next', direction);
	items[currentItem].addEventListener('animationend', function() {
		this.classList.remove('next', direction);
		this.classList.add('active');
		isEnabled = true;
	});
}

const nextItem = (n) => {
	hideItem('to-left');
	changeCurrentItem(n + 1);
	showItem('from-right');
}

const previousItem = (n) => {
	hideItem('to-right');
	changeCurrentItem(n - 1);
	showItem('from-left');
}

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

const swipeDetect = (el) => {
  
	let surface = el;
	let startX = 0;
	let startY = 0;
	let distX = 0;
	let distY = 0;
	let startTime = 0;
	let elapsedTime = 0;

	let threshold = 150;
	let restraint = 100;
	let allowedTime = 300;

	surface.addEventListener('mousedown', (e) => {
		startX = e.pageX;
		startY = e.pageY;
		startTime = new Date().getTime();
		e.preventDefault();
	}, false);

	surface.addEventListener('mouseup', (e) => {
		distX = e.pageX - startX;
		distY = e.pageY - startY;
		elapsedTime = new Date().getTime() - startTime;
		if (elapsedTime <= allowedTime){
			if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
				if ((distX > 0)) {
					if (isEnabled) {
						previousItem(currentItem);
					}
				} else {
					if (isEnabled) {
						nextItem(currentItem);
					}
				}
			}
		}
		e.preventDefault();
	}, false);

	surface.addEventListener('touchstart', (e) => {
		if (e.target.classList.contains('arrow') || e.target.classList.contains('control')) {
			if (e.target.classList.contains('left')) {
				if (isEnabled) {
					previousItem(currentItem);
				}
			} else {
				if (isEnabled) {
					nextItem(currentItem);
				}
			}
		}
			let touchObj = e.changedTouches[0];
			startX = touchObj.pageX;
			startY = touchObj.pageY;
			startTime = new Date().getTime();
			e.preventDefault();
	}, false);

	surface.addEventListener('touchmove', (e) => {
			e.preventDefault();
	}, false);

	surface.addEventListener('touchend', (e) => {
			let touchObj = e.changedTouches[0];
			distX = touchObj.pageX - startX;
			distY = touchObj.pageY - startY;
			elapsedTime = new Date().getTime() - startTime;
			if (elapsedTime <= allowedTime){
					if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
							if ((distX > 0)) {
								if (isEnabled) {
									previousItem(currentItem);
								}
							} else {
								if (isEnabled) {
									nextItem(currentItem);
								}
							}
					}
			}
			e.preventDefault();
	}, false);
}


swipeDetect(slider);
