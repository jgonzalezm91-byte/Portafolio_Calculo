// ====================== 
// CONFIGURACIÓN
// ======================

// Total de páginas reales que exportaste
const TOTAL_PAGES = 1131;

// Generador de la ruta a cada imagen de página.
// Debe coincidir con /flipbook/pages/page1.jpg, page2.jpg, etc.
function imgFor(n){
  return `pages/page${n}.jpg`;
}

// ======================
// STATE / DOM
// ======================
let pageFlipInstance = null;

const flipbookRoot = document.getElementById("flipbook");
const counterEl    = document.getElementById("pageCounter");
const prevBtn      = document.getElementById("prevBtn");
const nextBtn      = document.getElementById("nextBtn");

// ======================
// INIT PAGEFLIP
// ======================

window.addEventListener("DOMContentLoaded", () => {

  // Creamos la instancia PageFlip sobre el contenedor raíz.
  // IMPORTANTE: St.PageFlip viene de page-flip.browser.min.js
  pageFlipInstance = new St.PageFlip(flipbookRoot, {
    width: 1200,      // ancho base de UNA página
    height: 1600,     // alto base de UNA página

    size: "stretch",  // ocupa todo el contenedor padre
    minWidth: 400,
    maxWidth: 1800,
    minHeight: 600,
    maxHeight: 2400,

    maxShadowOpacity: 0.9,
    showCover: true,
    mobileScrollSupport: true,
    drawShadow: true,
    flippingTime: 900,

    // ⚫ Fondo del área del libro (por defecto es blanco)
    backgroundColor: "#000000",
  });

  // 👇👇 BLOQUE CRÍTICO: forzar fondo negro real del canvas 👇👇
  const observer = new MutationObserver(() => {
    const canvas = flipbookRoot.querySelector("canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const origClear = ctx.clearRect.bind(ctx);
        ctx.clearRect = function(x, y, w, h) {
          ctx.fillStyle = "#000";  // Fuerza el fondo negro real
          ctx.fillRect(x, y, w, h);
          origClear(x, y, w, h);
        };
      }
      observer.disconnect();
    }
  });
  observer.observe(flipbookRoot, { childList: true, subtree: true });
  // 👆👆 FIN BLOQUE CRÍTICO 👆👆

  // Array de todas las páginas del libro.
  const allImages = [];
  for (let i = 1; i <= TOTAL_PAGES; i++) {
    allImages.push(imgFor(i));
  }

  // Cargar las páginas como imágenes
  pageFlipInstance.loadFromImages(allImages);

  // Cuando se da vuelta la página, actualizar el contador
  pageFlipInstance.on("flip", (e) => {
    updateCounter(e.data);
  });

  // Cuando termina de inicializar, poner contador correcto
  pageFlipInstance.on("init", (e) => {
    updateCounter(e.data.page);
  });

  // Botones prev/next
  prevBtn.addEventListener("click", () => {
    pageFlipInstance.flipPrev("top");
  });

  nextBtn.addEventListener("click", () => {
    pageFlipInstance.flipNext("top");
  });

  // Navegación con teclado ← →
  window.addEventListener("keydown",(ev)=>{
    if(ev.key === "ArrowLeft")  pageFlipInstance.flipPrev("top");
    if(ev.key === "ArrowRight") pageFlipInstance.flipNext("top");
  });
});

// ======================
// CONTADOR DE PÁGINAS
// ======================
function updateCounter(currentIndex){
  const humanPage = currentIndex + 1;
  counterEl.textContent = `${humanPage} / ${TOTAL_PAGES}`;
}
