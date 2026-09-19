import {
  createIcons,
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  Phone,
  Mail,
  Sparkles,
  Wheat,
  Heart,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide";

createIcons({
  icons: { ArrowUpRight, ArrowDown, ArrowUp, ArrowRight, Phone, Mail, Sparkles, Wheat, Heart, Menu, X, Moon, Sun },
  attrs: { "stroke-width": 1.6, "aria-hidden": "true", focusable: "false" },
});

const themeToggle = document.querySelector(".theme-toggle");
const storedTheme = (() => {
  try {
    return window.localStorage.getItem("smartrooti-theme");
  } catch {
    return null;
  }
})();
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let themeTransitionAvailableAfter = 0;

function configureEmailLinks() {
  const isMobile = window.matchMedia("(max-width: 700px)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    const mailto = new URL(link.href);
    const params = new URLSearchParams({
      to: mailto.pathname,
      subject: mailto.searchParams.get("subject") || "",
      body: mailto.searchParams.get("body") || "",
    });

    link.href = isMobile
      ? `googlegmail://co?${params.toString()}`
      : `https://mail.google.com/mail/?view=cm&fs=1&${params.toString()}`;
  });
}

configureEmailLinks();

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  if (!themeToggle) return;

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Use light mode" : "Use dark mode");
  themeToggle.title = isDark ? "Use light mode" : "Use dark mode";
}

applyTheme(storedTheme || (prefersDark ? "dark" : "light"));

function transitionTheme(theme) {
  const updateTheme = () => applyTheme(theme);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || typeof document.startViewTransition !== "function") {
    updateTheme();
    return;
  }

  if (performance.now() < themeTransitionAvailableAfter) return;
  themeTransitionAvailableAfter = performance.now() + 1000;

  const toggleBounds = themeToggle?.getBoundingClientRect();
  const originX = toggleBounds ? toggleBounds.left + toggleBounds.width / 2 : window.innerWidth / 2;
  const originY = toggleBounds ? toggleBounds.top + toggleBounds.height / 2 : window.innerHeight / 2;
  const originXPercent = (originX / window.innerWidth) * 100;
  const originYPercent = (originY / window.innerHeight) * 100;
  document.documentElement.style.setProperty("--theme-origin-x", `${originXPercent}%`);
  document.documentElement.style.setProperty("--theme-origin-y", `${originYPercent}%`);

  document.startViewTransition(updateTheme);
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  transitionTheme(nextTheme);
  try {
    window.localStorage.setItem("smartrooti-theme", nextTheme);
  } catch {
    // The preference still applies for this visit when storage is unavailable.
  }
});

document.querySelectorAll(".product-image img").forEach((image) => {
  image.addEventListener("error", () => {
    if (image.dataset.fallbackApplied) return;

    image.dataset.fallbackApplied = "true";
    image.src = image.src.includes("/public/images/")
      ? image.src.replace("/public/images/", "/images/")
      : image.src.replace("/images/", "/public/images/");
  });
});

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const header = document.querySelector("#site-header");
const navigationToggle = document.querySelector(".menu-toggle");
const mobileNavigation = document.querySelector("#mobile-navigation");

function closeNavigation(restoreFocus = false) {
  if (!mobileNavigation || !navigationToggle) return;

  mobileNavigation.classList.remove("is-opening");
  mobileNavigation.classList.add("is-closing");
  navigationToggle.setAttribute("aria-expanded", "false");
  navigationToggle.setAttribute("aria-label", "Open navigation");
  if (restoreFocus) navigationToggle.focus();

  window.setTimeout(() => {
    if (!mobileNavigation.classList.contains("is-closing")) return;
    mobileNavigation.hidden = true;
    mobileNavigation.classList.remove("is-closing");
  }, 220);
}

if (navigationToggle && mobileNavigation) {
  navigationToggle.addEventListener("click", () => {
    const isOpening = navigationToggle.getAttribute("aria-expanded") !== "true";

    if (isOpening) {
      mobileNavigation.classList.remove("is-closing");
      mobileNavigation.hidden = false;
      mobileNavigation.classList.add("is-opening");
      window.setTimeout(() => {
        if (navigationToggle.getAttribute("aria-expanded") === "true") mobileNavigation.classList.remove("is-opening");
      }, 320);
    } else {
      closeNavigation();
    }

    navigationToggle.setAttribute("aria-expanded", String(isOpening));
    navigationToggle.setAttribute("aria-label", isOpening ? "Close navigation" : "Open navigation");
  });

  mobileNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNavigation();
  });
}

document.addEventListener("click", (event) => {
  if (!mobileNavigation || mobileNavigation.hidden || !header) return;

  const target = event.target;
  if (target instanceof Node && !header.contains(target) && !mobileNavigation.contains(target)) {
    closeNavigation();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && mobileNavigation && !mobileNavigation.hidden) closeNavigation(true);
});

const desktopQuery = window.matchMedia("(min-width: 701px)");
const addMediaQueryListener = (query, callback) => {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", callback);
    return;
  }
  if (typeof query.addListener === "function") {
    query.addListener(callback);
  }
};

addMediaQueryListener(desktopQuery, (event) => {
  if (event.matches) closeNavigation();
});

const filters = [...document.querySelectorAll("[data-filter]")];
const products = [...document.querySelectorAll(".product[data-category]")];
const menuCount = document.querySelector("#menu-count");
const menuHelp = document.querySelector("#menu-help");

filters.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filters.forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));

    let visibleCount = 0;
    products.forEach((product) => {
      const matches = selected === "all" || selected === product.dataset.category;
      product.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (menuHelp) menuHelp.hidden = selected !== "all";
    if (menuCount) menuCount.textContent = `${visibleCount} lovely ${visibleCount === 1 ? "favourite" : "favourites"}`;

    const scrollBehavior = motionQuery.matches ? "auto" : "smooth";
    button.scrollIntoView({ behavior: scrollBehavior, block: "nearest", inline: "nearest" });
  });
});

/* ---------- Lightweight, deterministic SVG artwork ----------
   Texture is generated once. Scroll animates compositor transforms,
   not the SVG paths or image filters.
*/
function seededRandom(seed) {
  return function () {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function createFoodSymbol(id, seed, spotCount, layered = false) {
  const random = seededRandom(seed);
  let content = `
    <circle cx="100" cy="100" r="97" fill="#b67e35"/>
    <circle cx="100" cy="99" r="95" fill="url(#roti-base)"/>
    <g clip-path="url(#food-clip)">
  `;

  for (let i = 0; i < spotCount; i += 1) {
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(random()) * 85;
    const x = 100 + Math.cos(angle) * radius;
    const y = 100 + Math.sin(angle) * radius;
    const rx = 3 + random() * 12;
    const ry = 2 + random() * 8;
    content += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="url(#toast-spot)" transform="rotate(${Math.round(random() * 180)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }

  for (let i = 0; i < 65; i += 1) {
    const x = 10 + random() * 180;
    const y = 10 + random() * 180;
    content += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.3 + random() * 1.1).toFixed(1)}" fill="${i % 2 ? "#fff2c6" : "#ac722e"}" opacity=".3"/>`;
  }

  if (layered) {
    for (let radius = 22; radius <= 85; radius += 12) {
      content += `<circle cx="100" cy="100" r="${radius}" fill="none" stroke="#b57832" stroke-opacity=".35" stroke-width="2.8" stroke-dasharray="75 9 34 6"/><circle cx="100" cy="98" r="${radius - 3}" fill="none" stroke="#ffe9ae" stroke-opacity=".5" stroke-width="2"/>`;
    }
  }

  content += `</g><ellipse cx="72" cy="49" rx="43" ry="18" fill="#fff8d5" opacity=".14" transform="rotate(-28 72 49)"/><circle cx="100" cy="100" r="93.5" fill="none" stroke="#ffe4a9" stroke-opacity=".5" stroke-width="1.5"/>`;
  return `<symbol id="food-${id}" viewBox="0 0 200 200">${content}</symbol>`;
}

const foodDefs = document.querySelector("#food-defs");
if (foodDefs) {
  foodDefs.insertAdjacentHTML(
    "beforeend",
    createFoodSymbol("roti", 42, 39) + createFoodSymbol("paratha", 73, 34, true),
  );
}

/* ---------- Scroll animation ----------
   Cache geometry on resize, use one animation frame per scroll update,
   and only animate transforms. No perpetual render loop.
*/
const hero = document.querySelector(".hero");
const sticky = document.querySelector(".hero-sticky");
const stack = document.querySelector("#food-stack");
const layers = [...document.querySelectorAll(".bread-layer")];
const topLabel = document.querySelector("#label-top");
const bottomLabel = document.querySelector("#label-bottom");
const progressBar = document.querySelector("#scroll-progress");
const caption = document.querySelector("#scene-caption");
const captions = ["Good things come in layers.", "A little lift. A lot of comfort.", "Find your favourite round below."];
let heroTop = 0;
let scrollRange = 1;
let pendingFrame = 0;
let lastProgress = -1;
let lastPhase = -1;
let compact = window.innerWidth <= 700;

function paintScene() {
  pendingFrame = 0;
  header.classList.toggle("is-scrolled", window.scrollY > 25);

  const progress = motionQuery.matches ? 0 : Math.max(0, Math.min(1, (window.scrollY - heroTop) / scrollRange));
  if (progress === lastProgress) return;
  lastProgress = progress;

  const eased = progress * progress * (3 - 2 * progress);
  const spread = Math.sin(eased * Math.PI * 0.86);
  const lift = compact ? 27 : 43;
  stack.style.transform = `translateY(${eased * 14}px) rotateX(${57 - eased * 17}deg) rotateZ(${-24 + eased * 48}deg)`;

  layers.forEach((layer, index) => {
    const z = index * 17 + index * lift * spread;
    const x = (index - 1.5) * 12 * spread;
    layer.style.transform = `translate3d(${x}px, 0, ${z}px) rotateZ(${index * eased * 8}deg)`;
  });

  topLabel.style.transform = `translateY(${-spread * 18}px) rotate(${6 - eased * 5}deg)`;
  bottomLabel.style.transform = `translateY(${spread * 12}px) rotate(${-6 + eased * 5}deg)`;
  progressBar.style.transform = `scaleX(${progress})`;

  const phase = progress < 0.3 ? 0 : progress < 0.75 ? 1 : 2;
  if (phase !== lastPhase) {
    caption.textContent = captions[phase];
    lastPhase = phase;
  }
}

function scheduleScene() {
  if (!pendingFrame) pendingFrame = requestAnimationFrame(paintScene);
}

function measureScene() {
  heroTop = hero.getBoundingClientRect().top + window.scrollY;
  scrollRange = Math.max(1, hero.offsetHeight - sticky.offsetHeight);
  compact = window.innerWidth <= 700;
  lastProgress = -1;
  scheduleScene();
}

window.addEventListener("scroll", scheduleScene, { passive: true });
window.addEventListener("resize", measureScene, { passive: true });

if ("ResizeObserver" in window) {
  const resizeObserver = new ResizeObserver(measureScene);
  resizeObserver.observe(hero);
  resizeObserver.observe(sticky);
}

/* ---------- Reveal content without scroll handlers ---------- */
let revealObserver;
function configureMotion() {
  revealObserver?.disconnect();
  document.documentElement.classList.remove("motion-ready");

  if (!motionQuery.matches && "IntersectionObserver" in window) {
    document.documentElement.classList.add("motion-ready");
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
  }

  lastPhase = -1;
  measureScene();
}

if ("IntersectionObserver" in window) {
  const navigationLinks = [...document.querySelectorAll("[data-nav-link]")];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-15% 0px -50% 0px" });
  document.querySelectorAll("main > section[id]").forEach((section) => sectionObserver.observe(section));
}

addMediaQueryListener(motionQuery, configureMotion);
configureMotion();
const yearTarget = document.querySelector("#year");
if (yearTarget) yearTarget.textContent = String(new Date().getFullYear());
document.documentElement.dataset.ready = "true";
