export function startWiggle(el, gsap, speed) {
	const angles = [3, -5, 2, -4, 6, -2, 4, -6];
	let step = 0;
	let running = true;

	function nextFrame() {
		if (!running) return;
		gsap.set(el, { rotation: angles[step % angles.length] });
		step++;
		gsap.delayedCall(speed, nextFrame);
	}

	gsap.delayedCall(Math.random() * speed, nextFrame);

	el._stopWiggle = () => {
		running = false;
	};
}

export function animateLetters(letters, cta, gsap, wiggleFunc = startWiggle) {
	gsap.set(letters, { opacity: 0, scale: 1 });
	gsap.set(cta, { opacity: 0 });

	const tl = gsap.timeline();

	letters.forEach((el, i) => {
		tl.set(el, { opacity: 1 }, i * 0.2);
	});

	tl.add(() => {
		letters.forEach((el) => wiggleFunc(el, gsap, 0.3));
	});

	tl.to(cta, { opacity: 1, duration: 0 }, letters.length * 0.2 + 0.3);

	return cta;
}

export function setupHoverWiggle(elements, gsap, speed = 0.15) {
	elements.forEach((el) => {
		el.addEventListener('mouseenter', () => {
			if (el._stopWiggle) el._stopWiggle();
			startWiggle(el, gsap, speed);
		});

		el.addEventListener('mouseleave', () => {
			if (el._stopWiggle) el._stopWiggle();
			gsap.set(el, { rotation: 0 });
		});
	});
}

export function startZoomPop(el, gsap, speed = 0.15) {
    const scales = [1, 1.15, 1, 1.15, 1];
    let running = true;

    function nextCycle() {
        if (!running) return;
        let step = 0;

        function nextFrame() {
            if (!running) return;
            gsap.set(el, { scale: scales[step % scales.length] });
            step++;
            if (step < scales.length) {
                gsap.delayedCall(speed, nextFrame);
            } else {
                gsap.delayedCall(2 + Math.random(), nextCycle);
            }
        }

        nextFrame();
    }
    gsap.delayedCall(Math.random() * 3, nextCycle);
    el._stopZoom = () => { running = false; };
}

export function addCTAEffect(cta, gsap) {
    cta.forEach((el) => {
        startZoomPop(el, gsap, 0.15);

        el.addEventListener('mouseenter', () => {
            startWiggle(el, gsap, 0.15);
        });

        el.addEventListener('mouseleave', () => {
            if (el._stopWiggle) el._stopWiggle();
            gsap.set(el, { rotation: 0 });
        });
    });
}