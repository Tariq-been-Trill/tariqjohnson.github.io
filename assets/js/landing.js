// Small enhancements for landing
(function(){
  // prevent layout shift on fonts
  document.documentElement.style.backgroundColor = '#000';

  // optional: show subtle focus outlines for keyboard users
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);

  // ensure scroll-snap on some browsers
  const container = document.querySelector('.main-snap');
  if(container){
    // if user swipes quickly, still snap
    let scrollTimer;
    container.addEventListener('scroll', ()=>{
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(()=>{
        const vh = window.innerHeight;
        const pos = container.scrollTop;
        const page = Math.round(pos / vh);
        container.scrollTo({top: page * vh, behavior: 'smooth'});
      }, 120);
    }, {passive:true});
  }
})();