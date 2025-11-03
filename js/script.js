// Smooth scrolling for internal anchors
(function () {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
})();

// Header shadow on scroll
(function () {
  const header = document.querySelector(".site-header");
  const cls = "with-shadow";
  const set = () => {
    if (window.scrollY > 6) {
      header.style.boxShadow = "0 2px 10px rgba(40,10,80,.18)";
    } else {
      header.style.boxShadow = "none";
    }
  };
  set();
  window.addEventListener("scroll", set, { passive: true });
})();

// Subtle arrow nudge on hover
(function () {
  document.querySelectorAll(".tile").forEach((tile) => {
    const arrow = tile.querySelector(".tile-arrow");
    tile.addEventListener("mouseenter", () => {
      arrow.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(4px)" }],
        { duration: 180, fill: "forwards" }
      );
    });
    tile.addEventListener("mouseleave", () => {
      arrow.animate(
        [{ transform: "translateX(4px)" }, { transform: "translateX(0)" }],
        { duration: 160, fill: "forwards" }
      );
    });
  });
})();
