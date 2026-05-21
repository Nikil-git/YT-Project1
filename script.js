/**
 * ════════════════════════════════════════════════
 * HYPIX RID — Gaming Channel Website
 * script.js
 * FIXED YouTube Section
 * UI unchanged
 * ════════════════════════════════════════════════
 */


/* ── Constants ── */

const CHANNEL_ID = 'UC_Np9zl2rDt-mudleJTC1Ow';

const CHANNEL_URL =
'https://www.youtube.com/@HypixRid';

const RSS_URL =
`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

/* FIXED */
const PROXY_URL =
`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

const MAX_GRID_VIDEOS = 6;


/* ════════════════════════════════════════
   NAVBAR
════════════════════════════════════════ */

const navbar =
document.getElementById('navbar');

if (navbar) {
window.addEventListener(
'scroll',
() => {
navbar.classList.toggle(
'scrolled',
window.scrollY > 60
);
},
{ passive:true }
);
}


/* ════════════════════════════════════════
   MOBILE MENU
════════════════════════════════════════ */

const hamburger =
document.getElementById('hamburger');

const mobileMenu =
document.getElementById('mobileMenu');

if (hamburger && mobileMenu){

hamburger.addEventListener(
'click',
() => {
mobileMenu.classList.toggle('open');
}
);

mobileMenu
.querySelectorAll('a')
.forEach(link=>{

link.addEventListener(
'click',
()=>{
mobileMenu.classList.remove(
'open'
);
}
);

});

}


/* ════════════════════════════════════════
   FOOTER
════════════════════════════════════════ */

const year =
document.getElementById('year');

if(year){
year.textContent =
new Date()
.getFullYear();
}


/* ════════════════════════════════════════
   PARTICLES
════════════════════════════════════════ */

(function(){

const canvas =
document.getElementById(
'heroCanvas'
);

if(!canvas)return;

const ctx =
canvas.getContext(
'2d'
);

let particles=[];

let W,H;

function resize(){

W=
canvas.width=
canvas.offsetWidth;

H=
canvas.height=
canvas.offsetHeight;

}

function createParticle(){

return{

x:
Math.random()*W,

y:
Math.random()*H,

r:
Math.random()*1.5+0.3,

color:
Math.random()>0.85
?
(
Math.random()>0.5
?
'rgba(255,45,45,'
:
'rgba(0,229,255,'
)
:
'rgba(255,255,255,',

alpha:
Math.random()*0.5+0.1,

vx:
(Math.random()-0.5)*0.3,

vy:
(Math.random()-0.5)*0.3,

pulse:
Math.random()*6,

speed:
0.01+
Math.random()*0.02

};

}

function init(){

resize();

particles=
Array.from(
{
length:
Math.min(
(W*H)/8000,
120
)
},
createParticle
);

}

function draw(){

ctx.clearRect(
0,
0,
W,
H
);

particles.forEach(
p=>{

p.pulse+=p.speed;

const a=
p.alpha*
(
0.6+
0.4*
Math.sin(
p.pulse
)
);

ctx.beginPath();

ctx.arc(
p.x,
p.y,
p.r,
0,
6
);

ctx.fillStyle=
p.color+
a+
')';

ctx.fill();

p.x+=p.vx;

p.y+=p.vy;

if(
p.x<-2
)
p.x=W+2;

if(
p.x>W+2
)
p.x=-2;

if(
p.y<-2
)
p.y=H+2;

if(
p.y>H+2
)
p.y=-2;

}
);

requestAnimationFrame(
draw
);

}

init();

draw();

window.addEventListener(
'resize',
init
);

})();


/* ════════════════════════════════════════
   HELPERS
════════════════════════════════════════ */

function getVideoId(url){

try{

const u=
new URL(
url
);

if(
u.searchParams.get(
'v'
)
){
return u.searchParams.get(
'v'
);
}

const parts=
u.pathname
.split('/');

return parts.pop();

}

catch{

const m=
url.match(
/([A-Za-z0-9_-]{11})/
);

return m
?
m[1]
:
null;

}

}


function thumbUrl(
id
){

return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

}


function formatDate(
date
){

return new Date(
date
).toLocaleDateString(
'en-US',
{
year:'numeric',
month:'short',
day:'numeric'
}
);

}


function stripHtml(
str=''
){

const div=
document.createElement(
'div'
);

div.innerHTML=
str;

return div.textContent;

}


/* ════════════════════════════════════════
   FEATURED
════════════════════════════════════════ */

function renderFeatured(
video
){

const box=
document.getElementById(
'featuredCard'
);

if(
!box
)return;

box.innerHTML=
`
<a
href="${video.link}"
target="_blank"
rel="noopener"
class="featured-thumb-wrap"
>

<img
src="${thumbUrl(video.id)}"
alt="${video.title}"
class="featured-thumb"
loading="eager"
/>

<div class="featured-play-btn">

<div class="play-circle">

<svg width="20" height="20" viewBox="0 0 24 24">

<path
fill="white"
d="M8 5v14l11-7z"
/>

</svg>

</div>

</div>

</a>

<div class="featured-info">

<span class="featured-badge">

🔴 Latest Video

</span>

<h2 class="featured-title">

${video.title}

</h2>

<p class="featured-date">

📅
${formatDate(
video.pubDate
)}

</p>

<a
href="${video.link}"
target="_blank"
class="btn btn-primary"
>

Watch Now

</a>

</div>
`;

}


/* ════════════════════════════════════════
   GRID
════════════════════════════════════════ */

function renderGrid(
videos
){

const grid=
document.getElementById(
'videoGrid'
);

if(
!grid
)return;

grid.innerHTML='';

videos.forEach(
(video,i)=>{

const card=
document.createElement(
'a'
);

card.href=
video.link;

card.target=
'_blank';

card.rel=
'noopener';

card.className=
'video-card glass';

card.style.animationDelay=
`${i*0.07}s`;

card.innerHTML=
`

<div class="card-thumb-wrap">

<img
src="${thumbUrl(video.id)}"
class="card-thumb"
loading="lazy"
/>

<div class="card-overlay">

<div class="card-play">

▶

</div>

</div>

</div>

<div class="card-body">

<h3 class="card-title">

${video.title}

</h3>

<p class="card-meta">

📅
${formatDate(
video.pubDate
)}

</p>

<span class="card-watch-btn">

Watch →

</span>

</div>

`;

grid.appendChild(
card
);

}
);

}


/* ════════════════════════════════════════
   ERROR
════════════════════════════════════════ */

function showError(){

document
.getElementById(
'errorState'
)
?.classList
.remove(
'hidden'
);

const grid=
document.getElementById(
'videoGrid'
);

if(
grid
)
grid.innerHTML='';

}


/* ════════════════════════════════════════
   FETCH
════════════════════════════════════════ */

async function fetchVideos(){

try{

const res=
await fetch(
PROXY_URL
);

if(
!res.ok
)
throw new Error(
res.status
);

const data=
await res.json();

if(
!data.items
||
!data.items.length
){
throw new Error(
'No videos'
);
}

const videos=
data.items
.map(
v=>({

title:
stripHtml(
v.title
),

link:
v.link,

pubDate:
v.pubDate,

id:
getVideoId(
v.link
)

})
)
.filter(
v=>v.id
);

renderFeatured(
videos[0]
);

renderGrid(
videos.slice(
1,
MAX_GRID_VIDEOS+1
)
);

}
catch(
err
){

console.error(
'YT ERROR:',
err
);

showError();

}

}


/* INIT */

document.addEventListener(
'DOMContentLoaded',
()=>{
fetchVideos();
});
