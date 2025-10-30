const swup = new Swup();

/**
 * Initializes all the interactive elements on the page, like the menu and Swiper carousels.
 * This function is designed to be called both on the initial page load and after each Swup navigation.
 */
function initPage() {
  // --- Menu Toggler Initialization ---
  const toggler = document.getElementById("menu-toggler");
  const body = document.body;

  // Check if the toggler exists on the page to avoid errors
  if (toggler) {
    toggler.addEventListener("click", () => {
      body.classList.toggle("menu-open");
    });
  }

  // --- Swiper Carousel Initialization ---
  // Check if the Swiper containers exist before trying to initialize them
  if (document.querySelector(".swiperMain")) {
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
          spaceBetween: 20,
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
      slidesPerView: 1.05,
      spaceBetween: 20,
      on: {
        slideChange: function () {
          // Pause all videos and play only the one in the active slide
          this.slides.forEach((slide, index) => {
            const video = slide.querySelector("video");
            if (video) {
              if (index === this.activeIndex) {
                // Autoplay might need the video to be muted
                video.play().catch(() => {});
              } else {
                video.pause();
                video.currentTime = 0; // Optional: restart video when inactive
              }
            }
          });
        },
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      keyboard: { enabled: true },
      mousewheel: { forceToAxis: true },
      thumbs: { swiper: swiperThumbs },
    });

    // Start the first slide’s video automatically.
    // We run this directly because at this point the swiper is initialized.
    const firstActiveSlide = swiperMain.slides[swiperMain.activeIndex];
    if (firstActiveSlide) {
        const firstVideo = firstActiveSlide.querySelector("video");
        if (firstVideo) {
            firstVideo.play().catch(() => {});
        }
    }
  }

    if (document.querySelector(".swiperInfo")) {


    // Init main swiper and connect thumbs
    const swiperInfo = new Swiper(".swiperInfo", {
      breakpoints: {
        640: {
          slidesPerView: 1.2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 10,
},
      },
         slidesPerView: 1.2,
      spaceBetween: 20,
  
      keyboard: { enabled: true },
      mousewheel: { forceToAxis: true },
    });

     }
}

// --- Event Listeners ---

// 1. Run the init function on the initial page load.
document.addEventListener("DOMContentLoaded", () => {
  initPage();
});

// 2. Run the init function after every Swup page transition.
swup.hooks.on("page:view", () => {
  initPage();
});