import './styles.css';

document.documentElement.dataset.ready = 'true';

document.querySelector('.print-button')?.addEventListener('click', () => {
  window.print();
});

const galleryItems = [...document.querySelectorAll('[data-gallery-item]')].map((item) => {
  const image = item.querySelector('img');
  const caption = item.querySelector('figcaption');
  return {
    element: item,
    src: image?.currentSrc || image?.src || '',
    alt: image?.alt || '',
    caption: caption?.textContent?.trim() || image?.alt || '',
  };
});

const lightbox = document.querySelector('.gallery-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxCaption = lightbox?.querySelector('figcaption');
let activeGalleryIndex = 0;

function showGalleryImage(index) {
  if (!lightbox || !lightboxImage || !lightboxCaption || galleryItems.length === 0) return;
  activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeGalleryIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = item.caption;
}

function openGallery(index) {
  showGalleryImage(index);
  lightbox?.classList.add('is-open');
  lightbox?.setAttribute('aria-hidden', 'false');
}

function closeGallery() {
  lightbox?.classList.remove('is-open');
  lightbox?.setAttribute('aria-hidden', 'true');
}

galleryItems.forEach((item, index) => {
  item.element.tabIndex = 0;
  item.element.setAttribute('role', 'button');
  item.element.setAttribute('aria-label', `浏览图片：${item.caption}`);
  item.element.addEventListener('click', () => openGallery(index));
  item.element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openGallery(index);
    }
  });
});

lightbox?.querySelector('.gallery-close')?.addEventListener('click', closeGallery);
lightbox?.querySelector('.gallery-prev')?.addEventListener('click', () => showGalleryImage(activeGalleryIndex - 1));
lightbox?.querySelector('.gallery-next')?.addEventListener('click', () => showGalleryImage(activeGalleryIndex + 1));
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeGallery();
});

document.addEventListener('keydown', (event) => {
  if (!lightbox?.classList.contains('is-open')) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') showGalleryImage(activeGalleryIndex - 1);
  if (event.key === 'ArrowRight') showGalleryImage(activeGalleryIndex + 1);
});
