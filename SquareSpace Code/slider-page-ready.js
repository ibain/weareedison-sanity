<!-- ===== New Home Carousel with Sanity Integration ===== -->
<style>
  /* Scope everything to #home-carousel so no other Splide on the page gets styled */
  #home-carousel.splide{visibility:hidden}
  #home-carousel.splide.is-initialized,
  #home-carousel.splide.is-rendered{visibility:visible}

  #home-carousel .splide__track{position:relative;overflow:hidden}
  #home-carousel .splide__list{display:flex;align-items:stretch;will-change:transform;margin:0;padding:0;list-style:none}
  #home-carousel .splide__slide{position:relative;flex-shrink:0;width:100% !important}

  /* Arrows (no double icons; left arrow actually points left) */
  #home-carousel .splide__arrow{
    position:absolute;top:50%;transform:translateY(-50%);
    width:2.25rem;height:2.25rem;border-radius:9999px;
    display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,.5);color:#fff;border:0;cursor:pointer;z-index:10;
    padding:0;line-height:1;appearance:none;
  }
  #home-carousel .splide__arrow svg{width:1.2rem;height:1.2rem;display:block}
  #home-carousel .splide__arrow--prev{left:.5rem}
  #home-carousel .splide__arrow--next{right:.5rem}
  /* Make the prev arrow point left (Splide's SVG is a right chevron by default) */
  #home-carousel .splide__arrow--prev svg{transform:scaleX(-1)}

  /* Pagination dots (fixed size; no scale pop) */
  #home-carousel .splide__pagination { list-style: none; }
#home-carousel .splide__pagination li { list-style: none; margin: 0; padding: 0; }
  #home-carousel .splide__pagination{
    display:flex;gap:.5rem;justify-content:center;margin-top:.75rem;padding:0;position:relative;z-index:2
  }
  #home-carousel .splide__pagination__page{
    width:.6rem;height:.6rem;border-radius:50%;
    background:#bbb;border:0;padding:0;opacity:.6;cursor:pointer;appearance:none;
  }
  #home-carousel .splide__pagination__page.is-active{background:#333;opacity:1;transform:none}

  /* Card (image with 16:9, caption beneath with fixed min-height to prevent page jump) */
  #home-carousel.pta-carousel{width:100%;max-width:none;margin:0 auto}
  #home-carousel .pta-card{display:block;text-decoration:none;color:#111}
  #home-carousel .pta-figure{width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:10px;background:transparent}
  #home-carousel .pta-figure img{width:100%;height:100%;object-fit:cover;display:block}

  #home-carousel .pta-caption{padding:.6rem .8rem .8rem;text-align:center;min-height:72px}
  #home-carousel .pta-title{
    margin:0 0 .25rem;font-size:1.15rem;line-height:1.25;
    display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden
  }
  /* fixed caption height to prevent vertical jitter */
  #home-carousel { --caption-h: 84px; }     /* default; JS will overwrite with real max */
  #home-carousel .pta-caption { height: var(--caption-h); }
  /* Lock the track height via a CSS variable so it won't reflow per slide */
  #home-carousel { --slide-h: auto; }
  #home-carousel .splide__track { height: var(--slide-h); }


  #home-carousel .pta-meta{
    margin:0;color:#555;font-size:.95rem;line-height:1.25;
    display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden
  }
</style>

<div id="home-carousel" class="splide pta-carousel">
  <div class="splide__track"><ul class="splide__list"></ul></div>
</div>

<script>
(function(){
  const ROOT_ID='home-carousel';
  const SANITY_PROJECT = 'u8cybb7l';
  const SANITY_DATASET = 'production';
  const API_VER='2023-10-01';
  
  if (document.getElementById(ROOT_ID)?.dataset.ptaInit==='1') return;

  /* Utilities */
  function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.defer=true;s.onload=res;s.onerror=rej;document.body.appendChild(s);});}
  
  /* Sanity helpers */
  const Q = encodeURIComponent;
  function qUrl(query, params={}) {
    const base = `https://${SANITY_PROJECT}.api.sanity.io/v${API_VER}/data/query/${SANITY_DATASET}?query=${Q(query)}`;
    const vars = Object.entries(params).map(([k,v])=>`&$${k}=${Q(String(v))}`).join('');
    return base + vars;
  }
  async function runQuery(query, params){ const r=await fetch(qUrl(query, params)); const j=await r.json(); return j.result||[]; }
  
  function imgUrl(imageObj, w=1600, h=900) { 
    console.log('🔍 imgUrl called with:', imageObj);
    
    if (!imageObj || !imageObj.asset) {
      console.log('❌ No image object or asset:', imageObj);
      return '';
    }
    
    // Check if we have a direct URL (old format) or a reference (new format)
    if (imageObj.asset.url) {
      // Direct URL format
      let url = `${imageObj.asset.url}?auto=format&fit=crop&w=${w}&h=${h}`;
      console.log('🔗 Base URL (direct):', url);
      
      // Apply crop if available
      if (imageObj.crop) {
        const { left, top, width, height } = imageObj.crop;
        const rect = `${Math.round(left * 1000)},${Math.round(top * 1000)},${Math.round(width * 1000)},${Math.round(height * 1000)}`;
        url += `&rect=${rect}`;
        console.log('✂️ Applied crop:', rect);
      }
      
      console.log('✅ Final URL (direct):', url);
      return url;
    } else if (imageObj.asset._ref) {
      // Reference format - construct URL from asset reference
      const assetRef = imageObj.asset._ref;
      console.log('📦 Asset reference:', assetRef);
      
      // Use the full asset reference in the URL
      // Format: "image-{id}-{dimensions}-{format}"
      let url = `https://cdn.sanity.io/images/${SANITY_PROJECT}/${SANITY_DATASET}/${assetRef}?auto=format&fit=crop&w=${w}&h=${h}`;
      console.log('🔗 Base URL (reference):', url);
      
      // Apply crop if available
      if (imageObj.crop) {
        const { left, top, width, height } = imageObj.crop;
        const rect = `${Math.round(left * 1000)},${Math.round(top * 1000)},${Math.round(width * 1000)},${Math.round(height * 1000)}`;
        url += `&rect=${rect}`;
        console.log('✂️ Applied crop:', rect);
      }
      
      console.log('✅ Final URL (reference):', url);
      return url;
    } else {
      console.log('❌ No URL or reference found in asset:', imageObj.asset);
      return '';
    }
  }

  function formatDate(dateString, type) {
    const date = new Date(dateString);
    
    if (type === 'slide') {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
    return '';
  }

  /* GROQ queries */
  const slidesQuery = `
    *[_type=="slides" && enabled==true] | order(order asc){
      title, meta, excerpt, href, 
      "image": {
        "asset": {
          "_ref": image.asset._ref,
          "url": image.asset->url
        },
        "alt": image.alt
      },
      "alt": coalesce(image.alt, title)
    }`;
  const featEventsQuery = `
    *[_type=="events" && defined(startDate) && startDate >= now() && featured==true]
      | order(startDate asc)[0...$n]{
        title, excerpt, startDate, endDate, displayTime, sourceUrl, linkButtonTitle,
        "image": {
          "asset": {
            "_ref": image.asset._ref,
            "url": image.asset->url
          },
          "alt": image.alt
        },
        "alt": coalesce(image.alt, title)
      }`;

  /* Render helper: wrapper is <a> if href exists; else <div> (no link) */
  function appendSlide(list, s){
    console.log('🔗 Appending slide:', s);
    const tag = s.href ? 'a' : 'div';
    const attrs = s.href ? ` class="pta-card" href="${s.href}"` : ` class="pta-card"`;
    const imageUrl = imgUrl(s.image, 1600, 900);
    
    const li=document.createElement('li'); li.className='splide__slide';
    li.innerHTML = `
      <${tag}${attrs}>
        <figure class="pta-figure"><img src="${imageUrl}" alt="${s.alt||s.title||''}"></figure>
        <div class="pta-caption">
          <div class="pta-title">${s.title||''}</div>
          ${s.meta?`<div class="pta-meta">${s.meta}</div>`:''}
        </div>
      </${tag}>`;
    list.appendChild(li);
  }

  /* --------- HEIGHT LOCK: compute tallest slide and freeze track height --------- */
  function measureTallest(root){
    const originals = [...root.querySelectorAll('.splide__slide')].filter(el=>!el.classList.contains('splide__slide--clone'));
    let max = 0;
    originals.forEach(el => { max = Math.max(max, Math.ceil(el.getBoundingClientRect().height)); });
    return max;
  }
  function lockHeight(root){
    const h = measureTallest(root);
    if (h && isFinite(h)) root.style.setProperty('--slide-h', h + 'px');
  }
  const debounce = (fn,ms=150)=>{let t; return (...a)=>{clearTimeout(t); t=setTimeout(()=>fn(...a),ms);}};

  async function init(){
    const root=document.getElementById(ROOT_ID);
    if(!root||root.dataset.ptaInit==='1') return;
    root.dataset.ptaInit='1';

    const list=root.querySelector('.splide__list'); list.innerHTML='';

    /* 1) Sanity slides (evergreen) */
    let evergreen=[];
    try{
      evergreen = await runQuery(slidesQuery);
      console.log('📋 Raw evergreen slides:', evergreen);
      
      // Debug each slide's image
      evergreen.forEach((slide, index) => {
        console.log(`🎯 Slide ${index + 1}:`, slide.title);
        console.log(`🖼️ Slide ${index + 1} image:`, slide.image);
        if (slide.image) {
          console.log(`📦 Slide ${index + 1} asset:`, slide.image.asset);
          if (slide.image.asset) {
            console.log(`🔗 Slide ${index + 1} URL:`, slide.image.asset.url);
          }
        }
      });
      
      evergreen = evergreen.map(slide => ({
        ...slide,
        meta: (slide.meta || '') + (slide.excerpt ? `<br>${slide.excerpt}` : '')
      }));
      console.log('✅ Processed evergreen slides:', evergreen);
    }catch(e){ console.warn('Evergreen load:', e); }

    /* 2) Sanity featured events (limit 3) */
    let eventSlides=[];
    try{
      const events = await runQuery(featEventsQuery, { n: 3 });
      console.log('📅 Raw events:', events);
      
      // Debug each event's image
      events.forEach((event, index) => {
        console.log(`🎯 Event ${index + 1}:`, event.title);
        console.log(`🖼️ Event ${index + 1} image:`, event.image);
        if (event.image) {
          console.log(`📦 Event ${index + 1} asset:`, event.image.asset);
          if (event.image.asset) {
            console.log(`🔗 Event ${index + 1} URL:`, event.image.asset.url);
          }
        }
      });
      
      // Map events for carousel (link to /events landing, keep meta = date)
      eventSlides = events.map(e=>{
        // Comprehensive date/time formatting
        const start = e.startDate ? new Date(e.startDate) : null;
        const end = e.endDate ? new Date(e.endDate) : null;
        const sameDay = end && start && start.toDateString() === end.toDateString();
        const hasStartTime = e.displayTime !== false && start && (start.getHours() !== 0 || start.getMinutes() !== 0);
        const hasEndTime = end && e.displayTime !== false && (end.getHours() !== 0 || end.getMinutes() !== 0);
        
        let dateTime = '';
        if (start) {
          if (sameDay) {
            // Same day: "Mon, Aug 25, 6:30 PM - 7:55 PM" or "Mon, Aug 25"
            dateTime = start.toLocaleDateString(undefined, {weekday:'short',month:'short',day:'numeric',year:'numeric'});
            if (hasStartTime) {
              dateTime += `, ${start.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit',hour12:true})}`;
              if (hasEndTime) {
                dateTime += ` - ${end.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit',hour12:true})}`;
              }
            }
          } else if (end) {
            // Different days: "Mon, Aug 25 - Fri, Aug 29, 2:30 PM - 4:30 PM" or "Mon, Aug 25 - Fri, Aug 29"
            dateTime = `${start.toLocaleDateString(undefined, {weekday:'short',month:'short',day:'numeric',year:'numeric'})} - ${end.toLocaleDateString(undefined, {weekday:'short',month:'short',day:'numeric',year:'numeric'})}`;
            if (hasStartTime && hasEndTime) {
              dateTime += `, ${start.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit',hour12:true})} - ${end.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit',hour12:true})}`;
            }
          } else {
            // Single day: "Mon, Aug 25, 6:30 PM" or "Mon, Aug 25"
            dateTime = start.toLocaleDateString(undefined, {weekday:'short',month:'short',day:'numeric',year:'numeric'});
            if (hasStartTime) {
              dateTime += `, ${start.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit',hour12:true})}`;
            }
          }
        }
        
        const meta = dateTime + (e.excerpt ? `<br>${e.excerpt}` : '');
        return { title: e.title, meta, href: e.sourceUrl || '/events', image: e.image, alt: e.alt };
      });
      console.log('✅ Processed event slides:', eventSlides);
    }catch(e){ console.warn('Events load:', e); }

    /* 3) render */
    const slides=[...evergreen, ...eventSlides];
    if(!slides.length){
      list.innerHTML='<li class="splide__slide"><div class="pta-figure"></div></li>';
    }else{
      slides.forEach(s => appendSlide(list, s));
    }

    /* Lock height BEFORE mounting Splide to prevent the very first flicker */
    lockHeight(root);

    /* 4) mount Splide (single slide view) */
    try{ await loadScript('https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js'); }catch{}
    if(window.Splide){
      if(root._splide){ try{ root._splide.destroy(true); }catch{} }
      const splide = new Splide(root,{
        type:'loop',
        perPage:1,
        autoplay:true,
        interval:5000,
        pauseOnHover:true,
        arrows:true,
        pagination:true,
        gap:'14px'
      }).mount();
      root._splide = splide;
    }

    /* Re-measure after images and fonts finish loading (then on resize) */
    const imgs = [...root.querySelectorAll('.pta-figure img')];
    Promise.all(imgs.map(img => img.complete ? 1 : new Promise(r => img.addEventListener('load', r, { once:true }))))
      .then(()=> lockHeight(root));
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(()=> lockHeight(root)); }

    const onResize = debounce(()=> lockHeight(root), 120);
    window.addEventListener('resize', onResize);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
</script>
<!-- ===== END ===== -->
