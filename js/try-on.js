/* Virtual try-on on product pages. Garment = the product's own image;
   the person photo is uploaded by the visitor. Talks to /api/tryon, which
   proxies FASHN AI server-side. Runs on any page with a product gallery. */
(function () {
  if (window.__innocntTryOn) return;
  window.__innocntTryOn = true;

  const details = document.querySelector('.product-details');
  const gallery = document.querySelector('.product-page .gallery, .gallery');
  if (!details || !gallery) return;

  if (!document.querySelector('link[href*="try-on.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/try-on.css';
    document.head.append(link);
  }

  // Garment image: prefer the clean flat/product shot, else the first gallery image.
  const images = [...gallery.querySelectorAll('img')];
  const garmentImg = images.find((i) => /flat|product/i.test(i.getAttribute('src') || '')) || images[0];
  if (!garmentImg) return;
  const garmentUrl = new URL(garmentImg.getAttribute('src'), location.href).href;

  // Category hint for FASHN, inferred from the product copy.
  const label = ((details.querySelector('.eyebrow') || {}).textContent + ' ' + document.title).toLowerCase();
  const category = /track|pant|short|trouser|jean|jogger|bottom/.test(label) ? 'bottoms'
    : /hoodie|tee|shirt|sweat|sleeve|jacket|top|crew/.test(label) ? 'tops'
      : 'auto';

  let block = details.querySelector('.try-on');
  if (!block) { block = document.createElement('div'); block.className = 'try-on'; details.appendChild(block); }
  block.innerHTML = `
    <h3>Virtual Try-On</h3>
    <p>Upload a clear, front-facing full-body photo to preview this piece on you.</p>
    <label class="tryon__drop" data-drop>
      <input type="file" accept="image/*" hidden data-file>
      <span data-drop-text>Tap to upload your photo</span>
    </label>
    <div class="tryon__photo" hidden data-photo-wrap><img alt="Your uploaded photo" data-photo></div>
    <button class="button dark tryon__run" type="button" data-run disabled>Preview try-on <span aria-hidden="true">↗</span></button>
    <p class="tryon__status" role="status" data-status></p>
    <div class="tryon__result" hidden data-result-wrap>
      <img alt="Virtual try-on preview" data-result>
      <button class="tryon__reset" type="button" data-reset>Try another photo</button>
    </div>`;

  const $ = (sel) => block.querySelector(sel);
  const fileInput = $('[data-file]');
  const dropText = $('[data-drop-text]');
  const photoWrap = $('[data-photo-wrap]');
  const photoImg = $('[data-photo]');
  const runBtn = $('[data-run]');
  const statusEl = $('[data-status]');
  const resultWrap = $('[data-result-wrap]');
  const resultImg = $('[data-result]');

  let personDataUrl = null;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const setStatus = (text, kind) => { statusEl.textContent = text || ''; statusEl.dataset.kind = kind || ''; };
  const unavailable = 'Virtual try-on isn’t available on this site yet.';
  const readJson = async (res) => { try { return JSON.parse(await res.text()); } catch { return null; } };

  // Downscale on the client so the upload stays small enough for the function body.
  const toDataUrl = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const max = 1024;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => reject(new Error('That image could not be read. Try another photo.'));
    img.src = URL.createObjectURL(file);
  });

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    setStatus('');
    resultWrap.hidden = true;
    try {
      personDataUrl = await toDataUrl(file);
      photoImg.src = personDataUrl;
      photoWrap.hidden = false;
      dropText.textContent = 'Change photo';
      runBtn.disabled = false;
    } catch (err) {
      setStatus(err.message, 'error');
    }
  });

  const poll = async (id) => {
    const deadline = Date.now() + 120000;
    while (Date.now() < deadline) {
      await sleep(2500);
      const res = await fetch('/api/tryon?id=' + encodeURIComponent(id));
      if (res.status === 404) throw new Error(unavailable);
      const data = await readJson(res);
      if (!data) throw new Error(unavailable);
      if (data.status === 'completed' && data.output && data.output[0]) return data.output[0];
      if (data.status === 'failed' || data.error) throw new Error(data.error || 'Try-on failed. Try a clearer, full-body photo.');
    }
    throw new Error('This is taking longer than expected. Please try again.');
  };

  runBtn.addEventListener('click', async () => {
    if (!personDataUrl) return;
    runBtn.disabled = true;
    block.classList.add('is-loading');
    setStatus('Generating your try-on… this usually takes 20–40 seconds.');
    try {
      const res = await fetch('/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelImage: personDataUrl, garmentImage: garmentUrl, category }),
      });
      if (res.status === 404) throw new Error(unavailable);
      const data = await readJson(res);
      if (!data) throw new Error(unavailable);
      if (!res.ok || data.error || !data.id) throw new Error(data.error || 'Could not start the try-on.');
      const output = await poll(data.id);
      resultImg.src = output;
      resultWrap.hidden = false;
      setStatus('');
    } catch (err) {
      setStatus(err.message, 'error');
      runBtn.disabled = false;
    } finally {
      block.classList.remove('is-loading');
    }
  });

  $('[data-reset]').addEventListener('click', () => {
    personDataUrl = null;
    fileInput.value = '';
    photoWrap.hidden = true;
    resultWrap.hidden = true;
    runBtn.disabled = true;
    dropText.textContent = 'Tap to upload your photo';
    setStatus('');
  });
})();
