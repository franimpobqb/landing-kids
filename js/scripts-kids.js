        // Init thumbs swiper
        const swiperThumbs = new Swiper(".swiperThumbs", {
            spaceBetween: 10,
            slidesPerView: 6,
            watchSlidesProgress: true,
        });

        // Init main swiper and connect thumbs
        const swiperMain = new Swiper(".swiperMain", {
            loop: true,
            grabCursor: true,
            centeredSlides: true,
            effect: "coverflow",
            coverflowEffect: {
              rotate: 0,
        stretch: 800,
        depth: 350,
        modifier: 1,
        slideShadows: false,
            },
            slidesPerView: 1.2,
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            keyboard: { enabled: true },
            mousewheel: { forceToAxis: true },
            thumbs: { swiper: swiperThumbs }
        });