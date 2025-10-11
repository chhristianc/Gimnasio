document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const navLinks = document.querySelector(".nav-links");
  const menuBtn = document.getElementById("menu-btn");         // sidebar izquierdo
  const menuBtnRight = document.getElementById("menu-btn-right"); // sidebar derecho
  const closeBtn = document.getElementById("close-btn");
  const overlay = document.getElementById("overlay");
  const closeBtnRight = document.getElementById("close-btn-right");

  // Abrir sidebar izquierdo
  menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  // Abrir sidebar derecho
  menuBtnRight.addEventListener("click", () => {
    navLinks.classList.add("active");
    overlay.classList.add("active");
  });

  // Cerrar sidebar izquierdo
  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });

   // Cerrarsidebar derecho
  closeBtnRight.addEventListener("click", () => {
    navLinks.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Cerrar ambos sidebars con overlay
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    navLinks.classList.remove("active");
    overlay.classList.remove("active");
  });

  // ===== SLIDER HERO =====
  let slides = document.querySelectorAll(".hero-slide");
  let currentSlide = 0;

  function changeSlide() {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  setInterval(changeSlide, 6000); // cambia cada 6 segundos
});

const select = document.getElementById("paletaSelect");
select.addEventListener("change", () => {
  document.documentElement.setAttribute("data-paleta", select.value);
});