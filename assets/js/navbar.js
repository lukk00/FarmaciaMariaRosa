
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link.nav-btn');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    link.classList.remove('nav-btn-activo');
  });
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === '#' || !linkHref) {
      return;
    }

    const linkPath = new URL(linkHref, window.location.origin).pathname;
    
    if (
      linkPath === currentPath ||
      (linkPath === '/index.html' && currentPath === '/') ||
      (linkPath.endsWith('/index.html') && currentPath.includes('index.html')) ||
      (linkPath.endsWith('/catalogo.html') && currentPath.includes('catalogo.html')) ||
      (linkPath.endsWith('/contacto.html') && currentPath.includes('contacto.html'))
    ) {
      link.classList.add('nav-btn-activo');
    }
  });
});