document.addEventListener("DOMContentLoaded", () => {

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-menu a");

  if (!header || !toggle || !mobileMenu) {
    return;
  }


  /* =========================================================
     ABRIR / FECHAR MENU
  ========================================================= */

  function openMenu() {

    header.classList.add("menu-open");
    document.body.classList.add("menu-open");

    toggle.setAttribute(
      "aria-expanded",
      "true"
    );

    toggle.setAttribute(
      "aria-label",
      "Fechar menu"
    );

  }


  function closeMenu() {

    header.classList.remove("menu-open");
    document.body.classList.remove("menu-open");

    toggle.setAttribute(
      "aria-expanded",
      "false"
    );

    toggle.setAttribute(
      "aria-label",
      "Abrir menu"
    );

  }


  function toggleMenu() {

    const isOpen =
      header.classList.contains(
        "menu-open"
      );

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }

  }


  toggle.addEventListener(
    "click",
    toggleMenu
  );


  /* =========================================================
     FECHAR AO CLICAR EM UM LINK
  ========================================================= */

  mobileLinks.forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        closeMenu();

      }
    );

  });


  /* =========================================================
     FECHAR COM ESC
  ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape" &&
        header.classList.contains(
          "menu-open"
        )
      ) {

        closeMenu();

      }

    }
  );


  /* =========================================================
     FECHAR AO VOLTAR PARA DESKTOP
  ========================================================= */

  window.addEventListener(
    "resize",
    () => {

      if (
        window.innerWidth > 850 &&
        header.classList.contains(
          "menu-open"
        )
      ) {

        closeMenu();

      }

    }
  );


});