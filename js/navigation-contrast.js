(() => {
  const header = document.querySelector('.site-header, .page-header');
  if (!header) return;

  const luminance = (color) => {
    const parts = color.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return null;
    const [red, green, blue, alpha = 1] = parts.map(Number);
    if (alpha < .05) return null;
    return (red * .2126) + (green * .7152) + (blue * .0722);
  };

  const isDarkBehindHeader = () => {
    const x = Math.round(window.innerWidth / 2);
    const y = Math.max(1, Math.round(header.getBoundingClientRect().height / 2));
    const target = document.elementsFromPoint(x, y).find((element) => !header.contains(element));

    for (let element = target; element && element !== document.documentElement; element = element.parentElement) {
      const value = luminance(getComputedStyle(element).backgroundColor);
      if (value !== null) return value < 145;
    }
    return false;
  };

  let frame;
  const update = () => {
    frame = undefined;
    const scrolled = window.scrollY > 10;
    header.classList.toggle('is-scrolled', scrolled);
    // Once scrolled the header is solid white, so ink is always dark — the
    // background-behind detection only matters while translucent over the hero.
    header.classList.toggle('is-on-dark', !scrolled && isDarkBehindHeader());
  };
  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  requestUpdate();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  document.addEventListener('load', requestUpdate, true);
})();
