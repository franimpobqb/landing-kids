
// Init thumbs swiper
const swiperThumbs = new Swiper(".swiperThumbs", {
  spaceBetween: 10,
  slidesPerView: 6,
  watchSlidesProgress: true,
});

// Init main swiper and connect thumbs
const swiperMain = new Swiper(".swiperMain", {
  breakpoints: {
    640: {
      slidesPerView: 1.5,
      spaceBetween: 80,
    },
    1024: {
      slidesPerView: 1.2,
      spaceBetween: 50,
      centeredSlides: true,
 coverflowEffect: {
     rotate: 0,
     stretch: 800,
     depth: 350,
     modifier: 1,
     slideShadows: false,
   }, 
    },
  },
  effect: "coverflow",
 
  loop: true,
  grabCursor: true,
  centeredSlides: true,
slidesPerView: 1.1,
  on: {
    slideChange: function () {
      const slides = this.slides;
      slides.forEach((slide, index) => {
        const video = slide.querySelector('video');
        if (video) {
          if (index === this.activeIndex) {
            video.play().catch(() => { }); // autoplay might need muted
          } else {
            video.pause();
            video.currentTime = 0; // optional, restart when inactive
          }
        }
      });
    },
  },
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  keyboard: { enabled: true },
  mousewheel: { forceToAxis: true },
  thumbs: { swiper: swiperThumbs }
});

// Start first slide’s video automatically
window.addEventListener('load', () => {
  const firstVideo = swiperMain.slides[swiperMain.activeIndex].querySelector('video');
  if (firstVideo) firstVideo.play().catch(() => { });
});