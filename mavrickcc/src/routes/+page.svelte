<script>
    import {onMount, tick} from 'svelte';
    import {
        animateLetters,
        setupHoverWiggle,
        startWiggle,
        animateLettersIn,
        animateLettersOut,
    } from '$lib';
    import { browser } from '$app/environment';
    import {addCTAEffect} from "$lib/js/beaucamps-le.js";

    export async function load() {
        if (browser) {
            fetch('http://127.0.0.1:3000/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    page: window.location.pathname,
                    user_agent: navigator.userAgent
                })
            }).catch(console.error);
        }
    }

    const pages = [
        {type: 'beaucamps'},
        {type: 'affiche', image: 'minuscule.jpg'},
        {type: 'affiche', image: 'majuscule.jpg'},
        {type: 'affiche', image: 'chiffres.jpg'},
        {type: 'affiche', image: 'char-spec.jpg'}

    ];

    let currentPage = $state(0);
    let gsapLib;

    onMount(() => {
        import('gsap').then(({gsap}) => {
            gsapLib = gsap;
            const letters = document.querySelectorAll('.letter');
            const arrows = document.querySelectorAll('.arrow');
            const downloadBtn = document.querySelector('.download-btn');
            animateLetters(letters, [], gsap, startWiggle);
            setupHoverWiggle(arrows, gsap, 0.15);
            addCTAEffect([downloadBtn], gsap);
        });
    });

    async function changePage(direction) {
        const letters = document.querySelectorAll('.letter');

        if (currentPage === 0 && gsapLib) {
            const animDirection = direction === 'right' ? 'left' : 'right';
            const tl = animateLettersOut(animDirection, letters, gsapLib, startWiggle);
            await new Promise(resolve => tl.eventCallback('onComplete', resolve));
        } else if (gsapLib) {
            const affiche = document.querySelector('.affiche');
            const animX = direction === 'right' ? -window.innerWidth - 300 : window.innerWidth + 300;
            await new Promise(resolve => {
                gsapLib.to(affiche, {
                    x: animX,
                    duration: 1,
                    ease: 'steps(10, end)',
                    onComplete: () => {
                        gsapLib.set(affiche, {x: 0});
                        resolve();
                    }
                });
            });
        }
        if (direction === 'right') {
            currentPage = (currentPage + 1) % pages.length;
        } else {
            currentPage = (currentPage - 1 + pages.length) % pages.length;
        }

        if (currentPage === 0 && gsapLib) {
            await tick();
            const newLetters = document.querySelectorAll('.letter');
            animateLettersIn(newLetters, gsapLib, startWiggle);
        } else if (gsapLib) {
            await tick();
            const newAffiche = document.querySelector('.affiche');
            const animX = direction === 'right' ? window.innerWidth + 300 : -window.innerWidth - 300;
            gsapLib.set(newAffiche, {x: animX});
            gsapLib.to(newAffiche, {
                x: 0,
                duration: 1,
                ease: 'steps(10, end)'
            });
        }
    }

    load();
</script>

<div class="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
    <div class="fixed top-[2vw] right-[2vw] z-50">
        <a href="/beaucamps-le/download/Beaucamps-Le.zip" download>
            <img src="/beaucamps-le/download.png" alt="Télécharger" class="download-btn object-contain cursor-pointer" style="height: clamp(2.5rem, 5vw, 4rem)"/>
        </a>
    </div>
    {#if currentPage === 0}
        <div class="flex flex-wrap gap-2 items-center justify-center w-full">
            <img src="/beaucamps-le/b.png" alt="b" class="letter mx-[-10px] h-24 object-contain"/>
            <img src="/beaucamps-le/e.png" alt="e" class="letter mx-[-10px] h-36 object-contain"/>
            <img src="/beaucamps-le/a.png" alt="a" class="letter mx-[-10px] h-32 object-contain"/>
            <img src="/beaucamps-le/u.png" alt="u" class="letter mx-[-10px] h-28 object-contain"/>
            <img src="/beaucamps-le/c.png" alt="c" class="letter mx-[-5px] h-24 object-contain"/>
            <img src="/beaucamps-le/a2.png" alt="a2" class="letter mx-[-10px] h-32 object-contain"/>
            <img src="/beaucamps-le/m.png" alt="m" class="letter mx-[-5px] h-24 object-contain"/>
            <img src="/beaucamps-le/p.png" alt="p" class="letter mx-[-15px] h-32 object-contain"/>
            <img src="/beaucamps-le/s.png" alt="s" class="letter mx-[-20px] h-32 object-contain"/>
            <img src="/beaucamps-le/-.png" alt="-" class="letter h-24 object-contain"/>
            <img src="/beaucamps-le/l.png" alt="l" class="letter mx-[-15px] h-32 object-contain"/>
            <img src="/beaucamps-le/e2.png" alt="e" class="letter h-24 object-contain"/>
        </div>
    {:else}
        <img
                src="/beaucamps-le/affiche/{pages[currentPage].image}"
                alt="Affiche"
                class="affiche max-h-[80vh] max-w-[90vw] object-contain"
        />
    {/if}

    <div class="fixed bottom-6 left-0 right-0 flex items-center justify-center gap-12 px-4">
        <button on:click={() => changePage('left')} aria-label="Précédent">
            <img src="/beaucamps-le/arrowleft.png" alt="Précédent" class="arrow h-24 object-contain cursor-pointer"/>
        </button>
        <div class="flex gap-2 items-center">
            {#each pages as _, i}
                <div
                        class="w-3 h-3 transition-all duration-300"
                        style="background: {i === currentPage ? '#FFB000' : '#7E00FF'}"
                ></div>
            {/each}
        </div>

        <button on:click={() => changePage('right')} aria-label="Suivant">
            <img src="/beaucamps-le/arrowright.png" alt="Suivant" class="arrow h-24 object-contain cursor-pointer"/>
        </button>
    </div>
</div>

