/* =========================================================
   Portfolio Site - JavaScript
   Handles: mobile menu toggle, scroll-triggered animations,
            scroll-to-top button, contact form submission
   ========================================================= */

// ---------------------------------------------------------
// 1. Mobile navigation menu toggle
// ---------------------------------------------------------
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close the mobile menu after a link is clicked
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// ---------------------------------------------------------
// 2. Scroll-triggered fade-in animations
// Uses IntersectionObserver so elements animate in only
// once they scroll into the viewport.
// ---------------------------------------------------------
const fadeElements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // animate only once
      }
    });
  },
  { threshold: 0.15 }
);

fadeElements.forEach((el) => observer.observe(el));

// ---------------------------------------------------------
// 3. Scroll-to-top button
// ---------------------------------------------------------
const scrollTopBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ---------------------------------------------------------
// 4. Contact form handling
// Note: this is a front-end only demo. To actually receive
// messages, connect this form to a service such as Formspree,
// EmailJS, or your own backend endpoint.
// ---------------------------------------------------------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();

  if (!contactForm.checkValidity()) {
    formStatus.textContent = "Please fill in all fields correctly.";
    formStatus.style.color = "#f87171";
    return;
  }

  // Simulate a successful send (replace with a real API call if needed)
  formStatus.textContent = `Thanks, ${name}! Your message has been noted.`;
  formStatus.style.color = "#38bdf8";
  contactForm.reset();
});

// ---------------------------------------------------------
// 5. Navbar background on scroll (subtle shadow when scrolled)
// ---------------------------------------------------------
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    navbar.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.25)";
  } else {
    navbar.style.boxShadow = "none";
  }
});
