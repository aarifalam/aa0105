// cloudinary-config-loader.js
(async function () {
  try {
    const res = await fetch(
      'https://aa0105-lib.pages.dev/json-lib/cloud-greeting-card.json',
      { cache: 'no-store' }
    );

    if (!res.ok) throw new Error('Config fetch failed');

    window.CLOUDINARY_CONFIG = await res.json();
    window.CLOUDINARY_READY = true;

    console.log('Cloudinary config ready');
  } catch (e) {
    console.error('Cloudinary config load error:', e);
    window.CLOUDINARY_READY = false;
  }
})();
