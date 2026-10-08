/**
 * Main Interactive Script for Ghufron Tamami Portfolio
 * Pure Vanilla JavaScript (No external libraries required)
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initTypewriter();
  initScrollSpy();
  initPortfolioFilter();
  initTiltCards();
  initCopyEmail();
  initScrollProgress();
  initBackToTop();
});

/* ----------------------------------------------------
   1. Navbar Scroll & Mobile Navigation
---------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const navWrap = document.querySelector(".nav-wrap");
  const navLinks = document.querySelectorAll(".nav-links a");

  // Scroll effect on navbar
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  });

  // Mobile drawer toggle
  if (navToggle && navWrap) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      navWrap.classList.toggle("open");
      document.body.classList.toggle("nav-open", !isExpanded);
    });

    // Close mobile nav when clicking a link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navWrap.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });

    // Close mobile nav with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navWrap.classList.contains("open")) {
        navWrap.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
        navToggle.focus();
      }
    });
  }
}

/* ----------------------------------------------------
   2. Dynamic Typewriter Effect
---------------------------------------------------- */
function initTypewriter() {
  const typeTarget = document.getElementById("typewriter-text");
  if (!typeTarget) return;

  const roles = [
    "Fullstack Developer",
    "Machine Learning Enthusiast",
    "Sarjana Sistem Informasi",
    "PHP & Laravel Specialist",
    "Python & Deep Learning Explorer",
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typeTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typeTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ----------------------------------------------------
   3. ScrollSpy Navigation (Active Link Highlighting)
---------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  function highlightNav() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNav);
  highlightNav();
}

/* ----------------------------------------------------
   4. Portfolio Interactive Category Filter
---------------------------------------------------- */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioCards = document.querySelectorAll(".portfolio-card-wrap");

  if (!filterButtons.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      portfolioCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.classList.remove("hide");
          card.classList.add("show");
        } else {
          card.classList.add("hide");
          card.classList.remove("show");
        }
      });
    });
  });
}

/* ----------------------------------------------------
   5. Interactive Card Spotlight / 3D Tilt Effect
---------------------------------------------------- */
function initTiltCards() {
  const cards = document.querySelectorAll(".interactive-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Glow coordinates for CSS radial-gradient spotlight
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      // Gentle 3D perspective tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });
}

/* ----------------------------------------------------
   6. Copy Email with Toast Feedback
---------------------------------------------------- */
function initCopyEmail() {
  const copyButtons = document.querySelectorAll("[data-copy-email]");
  const toast = document.getElementById("toast-notification");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const email = btn.getAttribute("data-copy-email") || "ghufrontamami1@gmail.com";

      try {
        await navigator.clipboard.writeText(email);
        showToast(`Email disalin: ${email}`);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast(`Email disalin: ${email}`);
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

/* ----------------------------------------------------
   7. Scroll Progress Bar at Top of Page
---------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress-bar");
  if (!progressBar) return;

  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });
}

/* ----------------------------------------------------
   8. Back to Top Button with SVG Progress Ring
---------------------------------------------------- */
function initBackToTop() {
  const bttBtn = document.getElementById("back-to-top");
  const progressCircle = document.getElementById("btt-progress-circle");
  if (!bttBtn) return;

  const circumference = 2 * Math.PI * 18; // r = 18

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollY > 300) {
      bttBtn.classList.add("visible");
    } else {
      bttBtn.classList.remove("visible");
    }

    if (progressCircle && totalHeight > 0) {
      const scrollFraction = scrollY / totalHeight;
      const offset = circumference - scrollFraction * circumference;
      progressCircle.style.strokeDashoffset = `${offset}`;
    }
  });

  bttBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
