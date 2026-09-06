// Canvas starfield background
(function(){
  const canvas = document.getElementById('starfield');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let width = 0, height = 0, devicePixelRatio = window.devicePixelRatio || 1;

  function resize(){
    devicePixelRatio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * devicePixelRatio);
    canvas.height = Math.floor(height * devicePixelRatio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    initStars();
  }

  function initStars(){
    stars = [];
    const count = Math.min(300, Math.floor((width * height) / 2500)); // density
    for(let i=0;i<count;i++){
      const r = Math.random() * 1.6 + 0.3; // radius
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: r,
        baseAlpha: Math.random()*0.8 + 0.2,
        phase: Math.random()*Math.PI*2,
        twinkleSpeed: Math.random()*0.02 + 0.005
n      });
    }
    // add a few larger soft glow stars
    for(let i=0;i<8;i++){
      stars.push({x:Math.random()*width,y:Math.random()*height,r:Math.random()*4+3,baseAlpha:0.6,phase:Math.random()*Math.PI*2,twinkleSpeed:0.002,soft:true});
    }
  }

  let t = 0;
  function render(){
    t += 1;
    ctx.clearRect(0,0,width,height);
    // subtle gradient
    const g = ctx.createLinearGradient(0,0,0,height);
    g.addColorStop(0,'rgba(10,10,14,0.25)');
    g.addColorStop(1,'rgba(0,0,0,0.6)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,width,height);

    for(let s of stars){
      const alpha = s.baseAlpha + Math.sin(s.phase + t * s.twinkleSpeed) * 0.5 * s.baseAlpha;
      ctx.beginPath();
      if(s.soft){
        const rg = ctx.createRadialGradient(s.x,s.y,s.r*0.1,s.x,s.y,s.r);
        rg.addColorStop(0,'rgba(255,255,255,'+alpha+')');
        rg.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle = rg;
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,'+Math.max(0,Math.min(1,alpha))+')';
        ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fill();
      }
    }
    requestAnimationFrame(render);
  }

  // parallax on mouse move for desktop
  let offsetX=0, offsetY=0;
  function onMove(e){
    const mx = e.clientX || (e.touches && e.touches[0].clientX) || width/2;
    const my = e.clientY || (e.touches && e.touches[0].clientY) || height/2;
    offsetX = (mx - width/2) * 0.02;
    offsetY = (my - height/2) * 0.02;
    // apply small offset to stars
    for(let s of stars){
      s.x += (offsetX - (width/2 - s.x) * 0.0005);
      s.y += (offsetY - (height/2 - s.y) * 0.0005);
      // keep in bounds
      if(s.x < 0) s.x += width;
      if(s.x > width) s.x -= width;
      if(s.y < 0) s.y += height;
      if(s.y > height) s.y -= height;
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, {passive:true});
  resize();
  requestAnimationFrame(render);
})();