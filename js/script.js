const images = [
  { id: 0, label: 'Lamb Ojahuri with Potatoes', src: 'https://img.freepik.com/premium-photo/georgian-dish-lamb-ojahuri-with-potato-stew_219193-7763.jpg?uid=R208066470&ga=GA1.1.1679070017.1753435898&semt=ais_hybrid&w=740&q=80' },
  { id: 1, label: 'Indian Thali', src: 'https://img.freepik.com/free-photo/delicious-indian-food-tray_23-2148723505.jpg?uid=R208066470&ga=GA1.1.1679070017.1753435898&semt=ais_hybrid&w=740&q=80' },
  { id: 2, label: 'Chicken Skewers with Peppers & Dill', src: 'https://img.freepik.com/free-photo/chicken-skewers-with-slices-sweet-peppers-dill-tasty-food-weekend-meal_2829-7043.jpg?uid=R208066470&ga=GA1.1.1679070017.1753435898&semt=ais_hybrid&w=740&q=80' },
  { id: 3, label: 'Fried Chicken with Mushrooms & Rice', src: 'https://img.freepik.com/free-photo/fried-chicken-with-mushrooms-rice_140725-9648.jpg?uid=R208066470&ga=GA1.1.1679070017.1753435898&semt=ais_hybrid&w=740&q=80' },
  { id: 4, label: 'Festive Table of Assorted Dishes', src: 'https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg?uid=R208066470&ga=GA1.1.1679070017.1753435898&semt=ais_hybrid&w=740&q=80' }
];


  const config = {
    slidesToShow: window.innerWidth <= 768 ? 1 : 5,
    centerMode: true,
    gap: 20,
  };

  const track = document.getElementById('sliderTrack');
  let currentLogicalIndex = 0;
  let currentPhysicalIndex = 0;
  let slides = [];
  let isTransitioning = false;

  let sideSlideSize = 0;
  let centerSlideSize = 0;
  let isMobile = window.innerWidth <= 768;

  function calculateWidths() {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const containerSize = sliderWrapper.offsetWidth;
    const totalGaps = config.gap * (config.slidesToShow - 1);
    const availableSize = containerSize - totalGaps;

    if (config.centerMode) {
      centerSlideSize = availableSize * 0.4;
      sideSlideSize = (availableSize - centerSlideSize) / (config.slidesToShow - 1);
    } else {
      sideSlideSize = availableSize / config.slidesToShow;
      centerSlideSize = sideSlideSize;
    }
  }

  function createSlide(item) {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.dataset.label = item.label;
    slide.dataset.id = item.id;
    slide.innerHTML = `<img src="${item.src}" alt="${item.label}">`;
    return slide;
  }

  function buildInfiniteTrack() {
    track.innerHTML = '';
    calculateWidths();
    const repeatCount = 20;

    for (let rep = 0; rep < repeatCount; rep++) {
      images.forEach(item => {
        const slide = createSlide(item);
        track.appendChild(slide);
      });
    }

    slides = Array.from(track.children);
    currentPhysicalIndex = Math.floor(slides.length / 2);
    currentLogicalIndex = currentPhysicalIndex % images.length;
    applyWidths();
  }

  function applyWidths() {
    slides.forEach((slide, index) => {
      const isCenter = index === currentPhysicalIndex && config.centerMode;
      const size = isCenter ? centerSlideSize : sideSlideSize;

      slide.style.width = `${size}px`;
      slide.style.height = isMobile ? '220px' : '300px';
      slide.style.marginRight = `${config.gap}px`;
    });

    if (slides.length > 0) {
      slides[slides.length - 1].style.marginRight = '0px';
    }
  }

  function getCenterOffset(slideIndex) {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const containerCenter = sliderWrapper.offsetWidth / 2;
    let offset = 0;

    for (let i = 0; i < slideIndex; i++) {
      const size = (i === currentPhysicalIndex) ? centerSlideSize : sideSlideSize;
      offset += size + config.gap;
    }

    const currentSize = (slideIndex === currentPhysicalIndex) ? centerSlideSize : sideSlideSize;
    offset += currentSize / 2;

    return offset - containerCenter;
  }

  function updateSlider(animate = true) {
    if (isTransitioning && animate) return;
    applyWidths();

    slides.forEach(slide => slide.classList.remove('active'));
    if (slides[currentPhysicalIndex] && config.centerMode) {
      slides[currentPhysicalIndex].classList.add('active');
    }

    const offset = getCenterOffset(currentPhysicalIndex);
    track.style.transition = animate ? 'transform 0.6s ease' : 'none';
    track.style.transform = `translateX(-${offset}px)`;

    if (animate) {
      isTransitioning = true;
      setTimeout(() => {
        isTransitioning = false;
        resetPositionIfNeeded();
      }, 600);
    }
  }

  function resetPositionIfNeeded() {
    const resetThreshold = images.length * 2;
    const middlePosition = Math.floor(slides.length / 2);
    if (currentPhysicalIndex < resetThreshold || currentPhysicalIndex > slides.length - resetThreshold) {
      const targetLogical = currentLogicalIndex;
      currentPhysicalIndex = middlePosition + (targetLogical - (middlePosition % images.length));
      updateSlider(false);
    }
  }

  function nextSlide() {
    if (isTransitioning) return;
    currentPhysicalIndex++;
    currentLogicalIndex = (currentLogicalIndex + 1) % images.length;
    updateSlider(true);
  }

  function prevSlide() {
    if (isTransitioning) return;
    currentPhysicalIndex--;
    currentLogicalIndex = (currentLogicalIndex - 1 + images.length) % images.length;
    updateSlider(true);
  }

  function bindEvents() {
    document.querySelector('.next-button').addEventListener('click', nextSlide);
    document.querySelector('.prev-button').addEventListener('click', prevSlide);

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') nextSlide();
      else if (e.key === 'ArrowLeft') prevSlide();
    });

    window.addEventListener('resize', () => {
      isMobile = window.innerWidth <= 768;
      config.slidesToShow = isMobile ? 1 : 5;
      calculateWidths();
      applyWidths();
      updateSlider(false);
    });
  }

  buildInfiniteTrack();
  updateSlider(false);
  bindEvents();

  let autoplay = setInterval(() => {
    if (!isTransitioning) nextSlide();
  }, 3000);

  const wrapper = document.querySelector('.slider-wrapper');
  wrapper.addEventListener('mouseenter', () => clearInterval(autoplay));
  wrapper.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      if (!isTransitioning) nextSlide();
    }, 3000);
  });

  $(document).ready(function(){
    $(".owl-carousel").owlCarousel({
      loop:true,
      margin:20,
      nav:false,
      dots:true,
      autoplay:true,
      autoplayTimeout:5000,
      responsive:{
        0:{ items:1 },
        768:{ items:2 },
        992:{ items:3 }
      }
    });
  });

  
  // Use IntersectionObserver to detect when .fact-counter is in view
  document.addEventListener("DOMContentLoaded", function () {
    const counters = document.querySelectorAll(".count-text");
    const options = { threshold: 0.5 };
    let animated = false;

    const observer = new IntersectionObserver(function (entries, observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          counters.forEach((el) => {
            const endValue = parseInt(el.getAttribute("data-stop")) || parseInt(el.innerText);
            const speed = parseInt(el.getAttribute("data-speed")) || 2000;
            animateCountUp(el, endValue, speed);
          });
          animated = true;
          observer.disconnect(); // remove observer after animation
        }
      });
    }, options);

    const target = document.querySelector(".fact-counter");
    if (target) {
      observer.observe(target);
    }
  });
