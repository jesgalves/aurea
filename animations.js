document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     CONFIGURAÇÃO
  ========================================================= */

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.14
  };


  /* =========================================================
     REVEALS
  ========================================================= */

  const animatedElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .fade-in, .image-reveal"
  );


  const observer = new IntersectionObserver(
    (entries, observerInstance) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");

        observerInstance.unobserve(entry.target);

      });

    },
    observerOptions
  );


  animatedElements.forEach((element) => {
    observer.observe(element);
  });


  /* =========================================================
     PARALLAX SUAVE
  ========================================================= */

  const parallaxElements = document.querySelectorAll(
    ".parallax-image"
  );


  let ticking = false;


  function updateParallax() {

    const viewportHeight = window.innerHeight;


    parallaxElements.forEach((element) => {

      const rect = element.getBoundingClientRect();


      /*
       * Só calcula enquanto o elemento
       * estiver próximo da viewport.
       */

      if (
        rect.bottom < 0 ||
        rect.top > viewportHeight
      ) {
        return;
      }


      const center =
        rect.top +
        rect.height / 2;


      const viewportCenter =
        viewportHeight / 2;


      const distance =
        center -
        viewportCenter;


      /*
       * Movimento propositalmente pequeno.
       */

      const movement =
        distance * -0.035;


      element.style.transform =
        `translateY(${movement}px)`;

    });


    ticking = false;

  }


  function requestParallaxUpdate() {

    if (!ticking) {

      window.requestAnimationFrame(
        updateParallax
      );

      ticking = true;

    }

  }


  window.addEventListener(
    "scroll",
    requestParallaxUpdate,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    requestParallaxUpdate
  );


  updateParallax();


  /* =========================================================
     ACESSIBILIDADE
  ========================================================= */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  if (prefersReducedMotion.matches) {

    parallaxElements.forEach((element) => {
      element.style.transform = "none";
    });

  }

});