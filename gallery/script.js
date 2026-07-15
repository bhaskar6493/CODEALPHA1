/* =========================================================
   Image Gallery - JavaScript
   Handles: rendering images, category filtering,
            lightbox open/close, next/prev navigation
   ========================================================= */

// ---------------------------------------------------------
// 1. Image data
// Each object stores the image URL, a caption and a category.
// In a real project these details could come from a database
// or a JSON file instead of being hard-coded here.
// ---------------------------------------------------------
const images = [
  { src: "https://picsum.photos/id/1015/600/450", caption: "Mountain River",  category: "nature" },
  { src: "https://picsum.photos/id/1018/600/450", caption: "Green Valley",    category: "nature" },
  { src: "https://picsum.photos/id/1043/600/450", caption: "Forest Path",     category: "nature" },
  { src: "https://picsum.photos/id/64/600/450",   caption: "Portrait Study",  category: "people" },
  { src: "https://picsum.photos/id/91/600/450",   caption: "Candid Smile",    category: "people" },
  { src: "https://picsum.photos/id/177/600/450",  caption: "Morning Walk",    category: "people" },
  { src: "https://picsum.photos/id/1031/600/450", caption: "City Street",     category: "city" },
  { src: "https://picsum.photos/id/1048/600/450", caption: "Downtown View",   category: "city" },
  { src: "https://picsum.photos/id/1074/600/450", caption: "Night Skyline",   category: "city" },
];

// Track which image is currently open in the lightbox
// and which list of images is currently visible (after filtering).
let currentIndex = 0;
let visibleImages = images;

// ---------------------------------------------------------
// 2. Grab references to DOM elements once, at the start
// ---------------------------------------------------------
const galleryEl = document.getElementById("gallery");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

// ---------------------------------------------------------
// 3. Function to build the gallery grid from the images array
// ---------------------------------------------------------
function renderGallery(imageList) {
  galleryEl.innerHTML = ""; // clear previous content

  imageList.forEach((image, index) => {
    // Create the card container
    const item = document.createElement("div");
    item.className = "gallery-item";
    item.setAttribute("data-category", image.category);

    // Create the image element
    const imgEl = document.createElement("img");
    imgEl.src = image.src;
    imgEl.alt = image.caption;

    // Create the caption overlay shown on hover
    const captionEl = document.createElement("div");
    captionEl.className = "item-caption";
    captionEl.textContent = image.caption;

    item.appendChild(imgEl);
    item.appendChild(captionEl);

    // Open the lightbox when this image is clicked
    item.addEventListener("click", () => openLightbox(index, imageList));

    galleryEl.appendChild(item);
  });
}

// Render all images when the page first loads
renderGallery(images);

// ---------------------------------------------------------
// 4. Category filter logic
// ---------------------------------------------------------
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Highlight the clicked button, remove highlight from others
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.getAttribute("data-category");

    if (category === "all") {
      visibleImages = images;
    } else {
      visibleImages = images.filter((img) => img.category === category);
    }

    renderGallery(visibleImages);
  });
});

// ---------------------------------------------------------
// 5. Lightbox functions
// ---------------------------------------------------------

// Open the lightbox and display the selected image
function openLightbox(index, imageList) {
  visibleImages = imageList;
  currentIndex = index;
  updateLightboxImage();
  lightbox.classList.add("open");
}

// Update the lightbox image/caption based on currentIndex
function updateLightboxImage() {
  const image = visibleImages[currentIndex];
  lightboxImg.src = image.src;
  lightboxImg.alt = image.caption;
  lightboxCaption.textContent =
    image.caption + " (" + (currentIndex + 1) + " / " + visibleImages.length + ")";
}

// Close the lightbox
function closeLightbox() {
  lightbox.classList.remove("open");
}

// Show the next image (wraps around to the first image at the end)
function showNextImage() {
  currentIndex = (currentIndex + 1) % visibleImages.length;
  updateLightboxImage();
}

// Show the previous image (wraps around to the last image at the start)
function showPrevImage() {
  currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  updateLightboxImage();
}

// ---------------------------------------------------------
// 6. Event listeners for lightbox controls
// ---------------------------------------------------------
closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", showNextImage);
prevBtn.addEventListener("click", showPrevImage);

// Close the lightbox if the user clicks the dark background
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Allow keyboard navigation: Escape to close, arrow keys to navigate
document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showNextImage();
  if (event.key === "ArrowLeft") showPrevImage();
});
