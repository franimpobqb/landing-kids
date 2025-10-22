<?php
// Always start the session at the top
session_start();

// The "gatekeeper"
// Check if the user is logged in
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    // User is not logged in. Redirect them to the login page.
    header('Location: login.php');
    exit;
}

// If the script reaches this point, the user is logged in.
?>

<!doctype html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Landing China Kids</title>

  <!-- Swiper CSS -->
  <link rel="stylesheet" href="https://unpkg.com/swiper@11/swiper-bundle.min.css" />
  <link rel="stylesheet" href="css/estilos-kids.css">
  <script src="https://unpkg.com/swup@4"></script>
</head>

<body>

  <!-- Transparent intro: three image lines -->
  <!--   <div class="intro" id="intro" role="dialog" aria-label="Intro">
     <video muted autoplay class="video-bg" id="bgVideo">
        <source src="videos/ACCION_01_CHINA_ASIENTE_A.mp4">
      </video> 
    <div class="stack">
      <img class="line-img line-1" src="images/subite.png" width="1600" height="400" alt="Title line 1">
      <img class="line-img line-2" src="images/temporada.png" width="1600" height="400" alt="Title line 2">
      <img class="line-img line-3" src="images/masanimada.png" width="1600" height="400" alt="Title line 3">
    </div>
  </div> -->

  <video muted autoplay loop class="video-bg" id="bgVideo">
    <source src="videos/video-bg.mp4">
  </video>

  <main class="page transition-fade"  id="swup" aria-label="Page content" aria-hidden="true">

   <?php 
include 'template-parts/header.php'; ?>

    <section id="main-content">
      <!-- Main Swiper -->
      <div class="swiper swiperMain">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <video class="slide-video" muted playsinline disablepictureinpicture loop src="videos/cover-e1.mp4"
              preload="auto" loading="lazy">

            </video>
            <a class="slide-content" href="episodio1.html">
              <button class="pure-css-button"><img src="images/btn-play.png" alt><span>E1 - Bienvenida
                  China</span></button>
            </a>
          </div>

          <div class="swiper-slide">
            <video class="slide-video" muted playsinline disablepictureinpicture loop src="videos/cover-e2.mp4"
              preload="auto" loading="lazy">

            </video>
            <a class="slide-content" href="episodio1.html">
              <button class="pure-css-button"><img src="images/btn-play.png" alt style="opacity: .5;"><span
                  style="opacity: .5;">E2 -
                  Seguridad (próximamente)</span></button>
              </a>
          </div>

          <div class="swiper-slide">
            <video class="slide-video" muted playsinline disablepictureinpicture loop src="videos/e3-cover.mp4"
              preload="auto" loading="lazy">

            </video>
            <a class="slide-content" href="episodio1.html">
              <div class="pure-css-button" ><img src="images/btn-play.png" alt style="opacity: .5;"><span
                  style="opacity: .5;">E3 -
                  Historias de familia (próximamente)</span></div>
            </a>
          </div>

       <!--    <div class="swiper-slide">
            <img class="slide-img" src="images/cover-preguntas.jpg" alt>
            <a class="slide-content" href="#">
              <button class="pure-css-button"><span>Jugar</span></button>
            </a>
          </div> -->

          
          <div class="swiper-slide">
            <img class="slide-img" src="images/cover-memotest-2.jpg" alt>
            <a class="slide-content" href="memotest/index.html">
              <button class="pure-css-button"><span>Jugar</span></button>
            </a>
          </div>

          <div class="swiper-slide">
            <img class="slide-img" src="images/cover-preguntas.jpg" alt>
            <a class="slide-content" href="#">
              <button class="pure-css-button"><span>Jugar</span></button>
            </a>
          </div>
        </div>
        <!-- Controls -->
        <div class="swiper-button-prev">
          <img src="images/button-prev.png" alt="">
        </div>
        <div class="swiper-button-next">
          <img src="images/button-next.png" alt="">
        </div>
      </div>

      <!-- Thumbs Swiper -->
      <div class="swiper swiperThumbs desktop">
        <div class="swiper-wrapper">
          <div class="swiper-slide"><img src="images/thumb-e1.jpg" alt>
          </div>
          <div class="swiper-slide"><img src="images/thumb-e2.jpg" alt>
          </div>
          <div class="swiper-slide"><img src="images/thumb-e3.jpg" alt>
          </div>
       <!--    <div class="swiper-slide"><img src="images/cover-preguntas.jpg" alt>
          </div> -->
          <div class="swiper-slide"><img src="images/cover-memotest-2.jpg" alt>
          </div>
          <div class="swiper-slide"><img src="images/cover-preguntas.jpg" alt>
          </div>

        </div>
      </div>
    </section>

    <!-- <nav id="main-menu">
        <img src="images/china2.png" alt="">
        <ul>
          <li>
            <a href="">Episodios</a>
          </li>
          <li>
            <a href="">Episodios</a>
          </li>
          <li>
            <a href="">Episodios</a>
          </li>
          <li>
            <a href="">Episodios</a>
          </li>
          <li>
            <a href="">Episodios</a>
          </li>
        </ul>
      </nav> -->
  </main>

  </div>

  <!-- Swiper JS -->
  <script src="https://unpkg.com/swiper@11/swiper-bundle.min.js"></script>
  <script src="js/scripts-kids.js"></script>

</body>

</html>