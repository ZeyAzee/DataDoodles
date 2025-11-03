// Smooth scroll for any internal anchors
(function () {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
})();

// Elevate header on scroll
(function () {
  const header = document.querySelector(".site-header");
  const set = () => {
    header.style.boxShadow =
      window.scrollY > 6 ? "0 2px 10px rgba(40,10,80,.12)" : "none";
  };
  set();
  window.addEventListener("scroll", set, { passive: true });
})();

// Focus state for cards via keyboard
(function () {
  document.querySelectorAll(".viz-card").forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        card.click();
      }
    });
  });
})();
