function getRandomDirectionLeft() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const directions = [
        { x: -w, y: 0 },
        { x: -w, y: -h },
        { x: -w, y: h },
        { x: -w, y: -h },
        { x: -w, y: h },
        { x: -w, y: -h * 0.25 },
        { x: -w, y: h * 0.25 },
        { x: -w, y: -h * 0.1 },
        { x: -w, y: h * 0.1 },
    ];
    return directions[Math.floor(Math.random() * directions.length)];
}

function getRandomDirectionRight() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const directions = [
        { x: w, y: 0 },
        { x: w, y: -h },
        { x: w, y: h },
        { x: w, y: -h },
        { x: w, y: h },
        { x: w, y: -h * 0.25 },
        { x: w, y: h * 0.25 },
        { x: w, y: -h * 0.1 },
        { x: w, y: h * 0.1 },
    ];
    return directions[Math.floor(Math.random() * directions.length)];
}

export function animateLettersOut(direction, letters, gsap, startWiggle) {
	const tl = gsap.timeline();

	letters.forEach((el) => {
		if (el._stopWiggle) el._stopWiggle();
        const randomDirection = direction === 'left'
            ? getRandomDirectionLeft()
            : getRandomDirectionRight();
		tl.to(
			el,
			{
				x: randomDirection.x,
				y: randomDirection.y,
				opacity: 1,
				duration: 2,
				ease: 'steps(20, end)'
			},
			0
		);
	});

	return tl;
}

export function animateLettersIn(letters, gsap, startWiggle) {
	const tl = gsap.timeline();

	gsap.set(letters, { opacity: 0, x: 0, y: 0 });

	letters.forEach((el, i) => {
		tl.set(el, { opacity: 1 }, i * 0.2);
	});

	tl.add(() => {
		letters.forEach((el) => startWiggle(el, gsap, 0.3));
	});

	return tl;
}
