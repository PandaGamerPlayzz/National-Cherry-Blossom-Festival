/* By Zachary A. Miller */

const buttons = document.querySelectorAll("[data-carousel-button");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const offset = button.dataset.carouselButton === "next" ? 1: -1;
        const slides = button.closest("[data-carousel]").querySelector('[data-slides');
        const active_slide = slides.querySelector("[data-active]");
        let new_index = [...slides.children].indexOf(active_slide) + offset;

        if(new_index < 0) new_index = slides.children.length - 1;
        if(new_index >= slides.children.length) new_index = 0;

        slides.children[new_index].dataset.active = true
        delete active_slide.dataset.active;
    });
});