"use strict";

///////////////////////////////////////

//Mobile Navigation
const navBar = document.querySelector(".btn--mobile-nav");
const headerEl = document.querySelector(".header");
const highlights = document.querySelectorAll(".highlight");
const headerImg = document.querySelector(".header__img");
const operations = document.querySelector(".operations");

navBar.addEventListener("click", function () {
  headerEl.classList.toggle("nav-open");
  highlights.forEach((element) => {
    element.classList.toggle("highlight");
  });
});

//OPTION A
//Smooth scrolling animation [to support all browswers]
const allLinks = document.querySelectorAll("a:link");

document
  .querySelector(".nav__links__link")
  .addEventListener("click", function (e) {
    e.preventDefault();
    if (e.target.classList.contains("nav__link")) {
      // if (e.target.getAttribute("class") === 'nav__link') {
      const id = e.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }

    //close mobile navigation
    if (e.target.classList.contains("nav__link")) {
      headerEl.classList.toggle("nav-open");
    }
  });

// STICKY NAV
// Sticky Navigation
const sectionHeroEl = document.querySelector(".section-hero");

//BETTER OPTION USING Intersection Observer API
const target = document.querySelector(".section-hero");
const navHeight = headerEl.getBoundingClientRect().height;
// console.log(navHeight)

let options = {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
};
let observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // console.log(entry);
    // if (entry.isIntersecting === false) headerEl.classList.add('sticky');
    if (!entry.isIntersecting) headerEl.classList.add("sticky");
    else headerEl.classList.remove("sticky");
  });
}, options);

observer.observe(target);

// ONPAGE NAVIGATION
let options1 = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};
let navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // console.log(entry);
    // console.log(entry.target);
    // console.log(entry.target.getAttribute('id'));
    if (entry.isIntersecting && entry.intersectionRatio >= 0) {
      // remove old active class
      document.querySelector(".active").classList.remove("active");

      // get id of the intersecting section
      const id = entry.target.getAttribute("id");
      document.querySelector(`[href="#${id}"]`).classList.add("active");
    }
  });
}, options1);

// target the elements to be observed
const sections = document.querySelectorAll(".section1");
sections.forEach((section) => {
  navObserver.observe(section);
});

//REVEALING SECTIONS or ELEMENTS OF SCROLL
let sectionObserver = new IntersectionObserver(
  (entries, observer) => {
    //since there is only one threshold
    const [entry] = entries;
    // console.log(entry);
    if (!entry.isIntersecting) return;

    entry.target.classList.remove("section--hidden");
    // entry.target.style.transitionDelay = "1s";
    //Unobserve the target
    observer.unobserve(entry.target);
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  }
);

// target the elements to be observed
document.querySelectorAll(".section").forEach((section) => {
  sectionObserver.observe(section);
  //Can be done manually at HTML --adding class to html
  section.classList.add("section--hidden");
});

//LAZY LOADING IMAGES
const imgObserver = new IntersectionObserver(
  (entries, observer) => {
    const [entry] = entries;
    console.log(entry);
    if (!entry.isIntersecting) return;

    //Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    //Best to remove the blurry css once loading is finished
    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-img");
    });

    //Stop Observing
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 0,
    rootMargin: "150px",
  }
);

const imgTargets = document.querySelectorAll("img[data-src]");
console.log(imgTargets);
imgTargets.forEach((img) => {
  imgObserver.observe(img);
});

//SLIDER COMPONENT
const sliders = function () {
  const slides = document.querySelectorAll(".slide");
  const slider = document.querySelector(".slider");
  const leftSliderBtn = document.querySelector(".slider__btn--left");
  const rightSliderBtn = document.querySelector(".slider__btn--right");
  const dotsContainer = document.querySelector(".dots");

  let curSlide = 0;

  //Function to change images
  const goToSlide = function (curSlide) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - curSlide)}%)`;
    });
  };

  //Creating Dots
  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  //Activate Dots COLOR
  const activateDot = function (slide) {
    //Remove class active
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    //Add class active to the target
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  //Function for Prev Slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = slides.length;
    curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //Function for Next Slide
  const nextSlide = function () {
    curSlide++;
    if (curSlide === slides.length) curSlide = 0;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //Init Functions
  const init = function () {
    goToSlide(curSlide);
    createDots();
    activateDot(0);
  };
  init();

  //EVENT LISTENERS
  leftSliderBtn.addEventListener("click", prevSlide);
  rightSliderBtn.addEventListener("click", nextSlide);

  //USING KEYBOARD LEFT AND RIGHT FOR SLIDES
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  //DOT BUTTONS EVENT LISTENERS
  dotsContainer.addEventListener("click", function (e) {
    // e.target.classList.remove('dots__dot--active');
    if (!e.target) return;
    if (e.target) {
      const numSlide = e.target.getAttribute("data-slide");
      goToSlide(numSlide);
      activateDot(numSlide);
    }

    //ALTERNATIVELY FOR DOT ONLY
    // console.log(document.querySelectorAll('.slide'));
    // document.querySelectorAll('.slide').forEach(slide => {
    //   slide.style.transform = 'translateX(100%)';
    // });
    // document.querySelectorAll('.slide')[numSlide].style.transform =
    //   'translateX(0%)';
  });
};
sliders();

// Modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//SMOOTH SCROLLING EFFECT
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function (e) {
  e.preventDefault();
  //Get cordinates of elements you want to scroll to
  //from the top of the broswer viewport to the section
  //it varies depending of where you clicked the button on the viewport
  const s1cords = section1.getBoundingClientRect();
  console.log(s1cords);
  //DOMRect {x: 0, y: 468, width: 558, height: 1891.078125, top: 468, …}

  //from the top of the broswer (Apex where you can see) viewport to the button
  //it varies depending of where you clicked the button on the viewport
  console.log(e.target.getBoundingClientRect());
  //DOMRect {x: 234.984375, y: 308, width: 88, height: 23, top: 308, …}

  //Use this to calculate scroll level top from the very top of the browser viewport
  console.log("Current scroll (X/Y)", window.pageXOffset, window.pageYOffset);
  //if untouched after relad, the results should be Current scroll (X/Y), 0, 0
  //Returns...Current scroll (X/Y) 0 0
  //If the scrollbar is moved slighly below the learn more button, y value increases

  //Knowing Viewport Height and Width
  console.log(
    "Height/Width viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //Scrolling
  // window.scrollTo(s1cords.left, s1cords.top + window.pageYOffset)

  console.log(s1cords.top + window.pageYOffset);

  window.scrollTo({
    left: s1cords.left + window.scrollX,
    top: s1cords.top + window.screenY,
    behavior: "smooth",
  });

  //New Method
  section1.scrollIntoView({ behavior: "smooth" });
});

//Better way to go about this.
//Target the parent element if all elements have the same parent element
//Determine what element originated the event.
document
  .querySelector(".nav__links__link")
  .addEventListener("click", function (e) {
    e.preventDefault();
    // if (e.target.classList.contains('nav__link')) {
    if (e.target.getAttribute("class") === "nav__link") {
      const id = e.target.getAttribute("href");
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    }

    //close mobile navigation
    if (e.target.classList.contains("nav__link")) {
      headerEl.classList.toggle("nav-open");
    }
  });

//LIFECYCLE DOM EVENTS
document.addEventListener("DOMContentLoaded", function (e) {
  console.log("HTLM parsed and DOM tree built", e);
});

window.addEventListener("load", function (e) {
  console.log("Windows loaded", e);
});

//TABBED COMPONENT
const operationBtnContainer = document.querySelector(
  ".operations__tab-container"
);
const tabs = document.querySelectorAll(".operations__tab");
const operationsContent = document.querySelectorAll(".operations__content");

operationBtnContainer.addEventListener("click", function (e) {
  //Button checks
  let dataTab = "";
  tabs.forEach((element) =>
    element.classList.remove("operations__tab--active")
  );
  //Use closest to ensure the button is focal point and not the span
  const targetClick = e.target.closest(".operations__tab");
  //Guard Clause -if clicked outside the button but within the btn container
  if (!targetClick) return;
  targetClick.classList.add("operations__tab--active");
  dataTab = targetClick.getAttribute("data-tab");
  //Remove active classes
  operationsContent.forEach((element) => {
    element.classList.remove("operations__content--active");
    //Activate content area
    if (element.classList.contains(`operations__content--${dataTab}`)) {
      element.classList.add("operations__content--active");
    }
  });
});
