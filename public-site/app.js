import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

var CONFIGURED = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey.indexOf("YOUR_") !== 0);
var fdb = null;
if (CONFIGURED) { try { fdb = getFirestore(initializeApp(firebaseConfig)); } catch (e) { CONFIGURED = false; } }

var LOGO = "logo.png", L0G0 = "logo.png", UH = "uniform.jpg";
var ANN = [], CAL = [], BAN = null, LOAD = CONFIGURED;
function $(i) { return document.getElementById(i); }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function bn(a, b) { return '<div class="banner"><h1>' + a + '</h1><p>' + b + '</p></div><div class="mtn"></div>'; }
var V = {};

/* ---------- announcements + calendar (display) ---------- */
function annSorted(){return ANN.slice().sort(function(a,b){return (b.pinned?1:0)-(a.pinned?1:0)||(b.ts||0)-(a.ts||0)})}
function annCard(a,del){var d=a.ts?new Date(a.ts).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}):"";
return '<div class="ann'+(a.pinned?' pin':'')+'"><h3>'+(a.pinned?'★ ':'')+esc(a.title)+'</h3><div class="meta">'+esc(d)+(a.pinned?' <span class="pill">Pinned</span>':'')+'</div><p>'+esc(a.body).replace(/\n/g,"<br>")+'</p>'+(del?'<button class="sm r" data-ad="'+esc(a.id)+'">Delete</button>':'')+'</div>'}
function annBlock(l){return LOAD?'<p class="hint">Loading announcements…</p>':l.length?l.map(function(a){return annCard(a)}).join(''):'<div class="note">No announcements right now. Please check back soon.</div>'}
function annHome(){return '<div class="wrap2" style="margin-bottom:0"><div class="sechead"><h2>Latest Announcements</h2><a href="#announcements">View all →</a></div>'+annBlock(annSorted().slice(0,3))+'</div>'}
function dfmt(d,o){return new Date(d+"T00:00:00").toLocaleDateString(undefined,o)}
function calUpcoming(){var n=new Date(),s=n.getFullYear()+"-"+("0"+(n.getMonth()+1)).slice(-2)+"-"+("0"+n.getDate()).slice(-2);return CAL.filter(function(e){return (e.end||e.date)>=s}).sort(function(a,b){return a.date<b.date?-1:a.date>b.date?1:0})}
function calCard(e,del){var rg=e.end&&e.end!==e.date?dfmt(e.date,{month:"short",day:"numeric"})+" – "+dfmt(e.end,{month:"short",day:"numeric",year:"numeric"}):dfmt(e.date,{month:"long",day:"numeric",year:"numeric"});
return '<div class="ev"><div class="dt">'+dfmt(e.date,{day:"numeric"})+'<small>'+dfmt(e.date,{month:"short"})+'</small></div><div style="flex:1"><h3>'+esc(e.title)+'</h3><p>'+esc(rg)+'</p>'+(e.note?'<p>'+esc(e.note)+'</p>':'')+'</div>'+(del?'<button class="sm r" data-cd="'+esc(e.id)+'">Delete</button>':'')+'</div>'}
function calSection(){var l=calUpcoming(),h='<div class="wrap2" style="margin-top:0"><div class="sechead"><h2>School Calendar</h2></div>';
if(LOAD)return h+'<p class="hint">Loading calendar…</p></div>';if(!l.length)return h+'<div class="note">Our school calendar will be posted here soon.</div></div>';
var cur="";l.forEach(function(e){var m=dfmt(e.date,{month:"long",year:"numeric"});if(m!==cur){cur=m;h+='<h3 style="margin:18px 0 8px">'+esc(m)+'</h3>'}h+=calCard(e)});return h+'</div>'}
V.announcements=function(){return bn('Announcements &amp; Calendar','News, updates, and important dates from our school')+'<div class="wrap2" style="margin-bottom:0"><div class="sechead"><h2>Announcements</h2></div>'+annBlock(annSorted())+'</div>'+calSection()};
function renderBanner(){var k=(location.hash||"#home").slice(1),el=$("bnr");if(!el)return;
if(!BAN||BAN.status==="hidden"||!BAN.message||(k!=="home"&&k!=="register")){el.innerHTML="";return}
el.innerHTML='<div class="bnr '+esc(BAN.status)+'"><span>'+esc(BAN.message)+'</span>'+(k==="home"?'<a href="#register">How to enroll →</a>':'')+'</div>'}

/* ---------- pages ---------- */
V.home=function(){return '<div class="hero"><div class="hl"><img class="lg" alt="Buhisan Night High School logo"></div><div class="eb">Buhisan, Cebu City</div><h1>Welcome to Buhisan Night High School</h1><p>Junior High School classes for Grades 7 to 10, from the afternoon to the evening. Education is for everyone, and it is never too late to learn.</p><div class="cta"><a class="btn" href="#register">Enroll Now</a><a class="btn o" href="#about">Learn More</a></div></div><div class="mtn"></div>'+
'<div class="stats"><div><b>2016</b><span>Founded</span></div><div><b>7–10</b><span>Grade Levels</span></div><div><b>1:30 PM</b><span>Classes Start</span></div><div><b>Free</b><span>Enrollment</span></div></div>'+annHome()+
'<div class="wrap2"><div class="depts"><div class="dept"><h3>Who can enroll</h3><div class="pill">Grades 7 to 10</div><p>Incoming Grade 7, 8, 9, and 10 learners, transferees, and Balik-Aral learners.</p><a href="#register">See requirements →</a></div><div class="dept"><h3>Class hours</h3><div class="pill">Afternoon to evening</div><p>Classes run from 1:30 PM to 8:30 PM, with a recess from 6:00 to 6:30 PM.</p><a href="#schedule">View schedule →</a></div></div>'+
'<div class="panel"><h2>About our school</h2><p>Buhisan Night High School opened in 2016 in Buhisan, Cebu City. We offer Junior High School education for Grades 7 to 10, with classes from the afternoon to the evening, taught by Licensed Professional Teachers (LPT).</p></div>'+
'<div class="fbs"><b>Follow us on Facebook</b><a class="btn o" href="https://www.facebook.com/buhisannight.cebucity" target="_blank" rel="noopener">Buhisan Night High School</a></div></div>'};

V.about=function(){return bn('About Us','Buhisan Night High School')+'<div class="wrap2"><div class="panel"><p>Buhisan Night High School provides Junior High School education for Grades 7 to 10 in Buhisan, Cebu City, with classes from the afternoon to the evening.</p>'+
'<h2>A Welcome from Our School</h2><p>Welcome to Buhisan Night High School. Education is for everyone, and it is never too late to learn. We look forward to working with you to help every learner grow in knowledge, character, and confidence.</p><div class="tgrid" style="margin-top:16px;max-width:300px"><div class="tcard"><img class="plg lg" alt="Buhisan Night High School logo"><h3>Irish L. Tadios</h3><span class="pill">School Principal</span></div></div>'+
'<h2>Our History</h2><p>Buhisan Night High School opened in 2016 in Barangay Buhisan, Cebu City, offering Junior High School classes from the afternoon to the evening.</p>'+
'<h2>Our Mission</h2><p>To provide accessible, quality, and values-based education that empowers students to reach their full potential and become responsible, productive, and compassionate members of society.</p>'+
'<h2>Our Vision</h2><p>To be a leading educational institution in Cebu City that transforms lives through excellence in teaching, innovation in learning, and a strong commitment to character development.</p>'+
'<h2>Core Values</h2><ul class="v"><li><b>Excellence</b>We aim for high standards in teaching and learning.</li><li><b>Integrity</b>We act with honesty and respect.</li><li><b>Compassion</b>We treat every person with kindness and dignity.</li><li><b>Innovation</b>We welcome better ways to teach and learn.</li><li><b>Community</b>We work together with families and our neighbors.</li></ul>'+
'<h2>Our Program</h2><p>Grades 7 to 10, with classes from 1:30 PM to 8:30 PM. Learners study Mathematics, Science, English, Filipino, Araling Panlipunan, Technology and Livelihood Education (TLE), MAPEH, and values formation.</p>'+
'<h2>Our Facilities</h2><p>BHNS has well-maintained classrooms and a school canteen where students can take a break and enjoy a meal during the school day.</p>'+
'<h2>Our Teachers</h2><p>Our faculty members are Licensed Professional Teachers (LPT) who are dedicated to helping every learner succeed.</p>'+
'<div class="q">“Every student who walks through our doors is embarking on a journey of discovery, growth, and possibility. We are honored to be part of that journey.”<b>— The BNHS Community</b></div>'+
'<h2>Contact Information</h2><div class="ct"><p><b>Address:</b> Sitio Eskwelahan, Buhisan, Cebu City, Philippines</p><p><b>Phone:</b> 0960-670-9368 / (032) 564-9941</p><p><b>Email:</b> <a href="mailto:buhisannight.cebucity@deped.gov.ph">buhisannight.cebucity@deped.gov.ph</a></p><p><b>Facebook:</b> <a href="https://www.facebook.com/buhisannight.cebucity" target="_blank" rel="noopener">@buhisannight.cebucity</a></p></div></div></div>'};

function tbl(rows){var h='<div class="wrap"><table><tr><th>Time</th><th>Activity</th></tr>';rows.forEach(function(r){h+='<tr'+(r[1]==="Recess"?' class="rc"':/Dismissal/.test(r[1])?' class="dm"':'')+'><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>'});return h+'</table></div>'}
var DAILY='<div class="wrap2" style="margin-bottom:0"><div class="rcard" style="max-width:640px;margin:auto"><span class="pill">Afternoon to evening classes</span><h3 style="margin-top:8px">Daily class schedule</h3>'+tbl([["1:30 – 3:00 PM","Class Hours"],["3:00 – 4:30 PM","Class Hours"],["4:30 – 6:00 PM","Class Hours"],["6:00 – 6:30 PM","Recess"],["6:30 – 7:00 PM","Class Hours"],["7:00 – 8:30 PM","Class Hours"],["8:30 PM","Class Dismissal"]])+'</div></div>';
var FINDUS='<div class="wrap2" style="margin-top:0"><div class="panel" style="max-width:640px;margin:auto"><h2>Find us</h2><p><b>Buhisan Night High School</b><br>Sitio Eskwelahan, Buhisan, Cebu City, Philippines<br>Plus Code: 8V52+PWR</p><div class="cta"><a class="btn" href="https://www.google.com/maps/search/?api=1&query=10.3093522,123.8522528" target="_blank" rel="noopener">Open in Google Maps</a><a class="btn o" href="https://www.google.com/maps/dir/?api=1&destination=10.3093522,123.8522528" target="_blank" rel="noopener">Get directions</a></div><div class="note">The map pin is placed on our campus, which is listed on Google Maps as Buhisan Elementary School.</div></div></div>';
V.schedule=function(){var d=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];return bn('Schedule &amp; Location','Daily class schedule, hours, and how to find us')+DAILY+'<div class="wrap2"><div class="panel" style="max-width:640px;margin:auto"><h2>Hours Open</h2><div class="wrap"><table><tr><th>Day</th><th>Time</th></tr>'+d.map(function(x,i){return '<tr><td><b>'+x+'</b></td><td>'+(i<5?'<span class="pill o">7:30 AM - 8:30 PM</span>':'<span class="pill c">CLOSED</span>')+'</td></tr>'}).join('')+'</table></div></div></div>'+FINDUS};

var TCH=[[7,[["Orion","Marian Gie O. Amarillo"],["Perseus","Cristy Joy L. Echavez"],["Sirius","Niña Faith H. Fantonial"]]],[8,[["Antares","Eva V. Cuizon"],["Aquarius","Farrah E. Rusiana"],["Arcturus","Mary Joy V. Bardilas"]]],[9,[["Centaurus","Celerina A. Bedrijo"],["Pollux","Pedro G. Bag-o Jr."]]],[10,[["Polaris","April Jane S. Balili"]]]];
var SPT=["Rowe V. Abalayan","Grazel B. Flores","Daniel Gabriel B. Gornez","Christine Kiese Ortega","Jessa B. Mahilum","Vince Gingoyon"];
function tcard(n,p){return '<div class="tcard"><div class="av">'+esc(n.charAt(0))+'</div><h3>'+esc(n)+'</h3><span class="pill">'+esc(p)+'</span></div>'}
V.teachers=function(){var h=bn('Our Teachers','Our faculty by grade level and section')+'<div class="wrap2">';
TCH.forEach(function(g){h+='<div class="sechead" style="margin-top:28px"><h2>Grade '+g[0]+'</h2></div><div class="tgrid">'+g[1].map(function(s){return tcard(s[1],"Grade "+g[0]+" · "+s[0])}).join('')+'</div>'});
return h+'<div class="sechead" style="margin-top:40px"><h2>Special Teachers</h2></div><div class="tgrid">'+SPT.map(function(n){return tcard(n,"Special Teacher")}).join('')+'</div></div>'};

/* ---------- enroll ---------- */
var REQS='<div class="wrap2" style="margin-bottom:0"><div class="note" style="margin:0 0 22px">Please prepare the documents below. You can also start with the online registration form further down this page.</div><div class="rcard" style="max-width:720px;margin:auto"><span class="pill">Junior High School</span><h3 style="margin-top:8px">Enrollment Requirements</h3><p>For incoming Grade 7, 8, 9, and 10 learners, transferees, and Balik-Aral learners.</p><h4>Requirements</h4><ul class="rq"><li>Report Card</li><li>PSA Birth Certificate (photocopy)</li></ul><p>No PSA Birth Certificate? Please submit one of the following:</p><ul class="rq"><li>Local Birth Certificate</li><li>Barangay Certification</li></ul><div class="note" style="margin:14px 0 0;font-size:.9rem">Secure your slot early! Education is for everyone. It is never too late to learn.</div><div class="ctc"><b>Irish L. Tadios</b>, School Principal<br><a href="tel:+639606709368">0960-670-9368</a> / <a href="tel:+63325649941">(032) 564-9941</a><br><a href="mailto:buhisannight.cebucity@deped.gov.ph">buhisannight.cebucity@deped.gov.ph</a><br><a href="https://www.facebook.com/buhisannight.cebucity" target="_blank" rel="noopener">facebook.com/buhisannight.cebucity</a></div></div></div>';
var UNI='<div class="wrap2" style="margin-bottom:0"><div class="sechead"><h2>School Uniform</h2></div><div class="rcard" style="max-width:720px;margin:auto"><img class="uimg" loading="lazy" alt="Buhisan Night High School prescribed uniform" src="'+UH+'" style="max-width:420px;margin:0 auto 8px"><div class="reqs" style="margin-top:8px"><div><h4>Boys</h4><ul class="rq"><li>White polo</li><li>Black slacks</li><li>Black shoes</li></ul></div><div><h4>Girls</h4><ul class="rq"><li>White blouse with green ribbon tie</li><li>Green plaid skirt</li><li>White socks</li><li>Black shoes</li></ul></div></div><div class="note" style="font-size:.9rem">As shown in the prescribed uniform for S.Y. 2025-2026. Uniforms can be bought at any store or supermarket.</div></div></div>';
var FQ=[["Who can enroll?","Incoming Grade 7, 8, 9, and 10 learners, transferees, and Balik-Aral learners."],
["What documents do I need to bring?","A Report Card and a photocopy of the PSA Birth Certificate. Please see the requirements above."],
["What if I do not have a PSA Birth Certificate?","You may submit a Local Birth Certificate or a Barangay Certification instead."],
["What does Balik-Aral mean?","Balik-Aral refers to learners who are returning to school after a break from their studies."],
["What are the class hours?","Classes run from 1:30 PM to 8:30 PM. See the <a href='#schedule'>Schedule &amp; Location</a> page for the full daily schedule."],
["Is there a fee to enroll?","No. Enrollment is free."],
["Where can I buy the school uniform?","Uniforms can be bought at any store or supermarket. See the School Uniform section above."],
["What about the student ID?","Please submit a 2x2 or 1x1 photo of the student with a white background. The school prepares the ID, so students do not need to come to school just to have their picture taken."],
["Can I register online?","You can start with the online registration form on this page. For the documents and any questions, please contact the school or visit us."],
["How will I know my child’s section?","The school will announce your child’s section. You can see our teachers on the <a href='#teachers'>Teachers</a> page and check <a href='#announcements'>Announcements</a> for updates."],
["Where is the school and how do I contact you?","We are at Sitio Eskwelahan, Buhisan, Cebu City. See the <a href='#schedule'>Schedule &amp; Location</a> page for the map, and the <a href='#about'>About</a> page for contact details."]];
var FAQ='<div class="wrap2 faq"><div class="sechead"><h2>Frequently asked questions</h2></div>'+FQ.map(function(x){return '<details><summary>'+x[0]+'</summary><p>'+x[1]+'</p></details>'}).join('')+'</div>';
var PV='<details class="pvn"><summary>Privacy Notice</summary><p>We collect the learner’s name, date of birth, and address, and the parent or guardian’s name and contact number, only for enrollment, class placement, and school records. This information is kept confidential, is accessed only by authorized school personnel, and is not sold or shared for any other purpose. You may ask the school to review or correct your information at any time. This notice follows the Data Privacy Act of 2012 (Republic Act No. 10173).</p></details><label class="chk"><input type="checkbox" id="pv"> I am the learner’s parent or legal guardian, and I agree to the privacy notice.</label>';
V.register=function(){var g="";for(var i=7;i<=10;i++)g+='<option value="'+i+'">Grade '+i+'</option>';
return bn('Enrollment','What to bring and how to register')+REQS+UNI+'<div class="wrap2"><div class="sechead"><h2>Online registration</h2></div><div class="reg"><aside><h2>How it works</h2><p>Complete the form and we will take care of the rest.</p><ol><li>Prepare the documents listed above.</li><li>Fill out the student’s details.</li><li>Submit to receive your student ID.</li><li>Your section will be announced by the school.</li></ol></aside><div class="panel"><div class="fg"><div class="f"><label for="name">Full name</label><input id="name" autocomplete="name"></div><div><label for="dob">Date of birth</label><input id="dob" type="date"></div><div><label for="contact">Contact number</label><input id="contact" inputmode="tel"></div><div class="f"><label for="address">Address</label><input id="address" autocomplete="street-address"></div><div class="f"><label for="guardian">Parent / guardian</label><input id="guardian"></div><div><label for="grade">Grade</label><select id="grade"><option value="">Select Grade</option>'+g+'</select></div><div><label for="studentType">Student type</label><select id="studentType"><option value="">Select Student Type</option><option>New Student</option><option>Continuing Student</option><option>Transferee</option><option>Balik-Aral</option></select></div></div>'+PV+'<button id="reg">Enroll</button><div id="m" class="msg"></div></div></div></div>'+FAQ};
async function doReg() {
  var ks = ["name", "dob", "address", "guardian", "contact", "grade", "studentType"], f = {}, m = $("m"), btn = $("reg");
  ks.forEach(function (k) { f[k] = $(k).value.trim(); });
  for (var k in f) if (!f[k]) { m.className = "msg er"; m.textContent = "Please fill in all fields."; return; }
  if (!$("pv").checked) { m.className = "msg er"; m.textContent = "Please read the privacy notice and tick the box to continue."; return; }
  if (!fdb) { m.className = "msg er"; m.textContent = "Online registration is not available right now. Please visit the school to enroll."; return; }
  var id = "BNHS-" + Math.floor(100000 + Math.random() * 900000);
  btn.disabled = true; m.className = "msg"; m.textContent = "Submitting…";
  try {
    await addDoc(collection(fdb, "students"), { studentId: id, name: f.name, dob: f.dob, address: f.address, guardian: f.guardian, contact: f.contact, grade: +f.grade, type: f.studentType, section: "", teacher: "", createdAt: serverTimestamp() });
    m.className = "msg ok"; m.textContent = "Registration received! Your ID: " + id + ". Please keep it for your records.";
    ks.forEach(function (k) { $(k).value = ""; }); $("pv").checked = false;
  } catch (e) {
    m.className = "msg er"; m.textContent = "Sorry, we could not submit your registration. Please try again, or visit the school.";
  }
  btn.disabled = false;
}

function onAnn() { renderBanner(); var k = (location.hash || "#home").slice(1); if (k === "home" || k === "announcements") { var y = window.scrollY || 0; render(); window.scrollTo(0, y); } }
function mapDocs(s) { return s.docs.map(function (x) { var o = x.data(); o.id = x.id; return o; }); }
function listen() {
  if (!fdb) return;
  onSnapshot(collection(fdb, "announcements"), function (s) { ANN = mapDocs(s); LOAD = false; onAnn(); }, function () { LOAD = false; onAnn(); });
  onSnapshot(collection(fdb, "events"), function (s) { CAL = mapDocs(s); onAnn(); }, function () {});
  onSnapshot(collection(fdb, "settings"), function (s) { BAN = null; s.docs.forEach(function (x) { if (x.id === "banner") BAN = x.data(); }); onAnn(); }, function () {});
  setTimeout(function () { if (LOAD) { LOAD = false; onAnn(); } }, 8000);
}
function render() {
  var k = (location.hash || "#home").slice(1); if (!V[k]) k = "home";
  $("app").innerHTML = V[k](); renderBanner();
  document.querySelectorAll("nav ul a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + k); });
  document.querySelectorAll(".lg").forEach(function (i) { i.src = LOGO; });
  document.querySelectorAll(".lg2").forEach(function (i) { i.src = L0G0; });
  if (k === "register") $("reg").onclick = doReg;
  $("nv").classList.remove("open"); window.scrollTo(0, 0);
}
$("mt").onclick = function () { $("nv").classList.toggle("open"); };
window.addEventListener("hashchange", render);
render(); listen();
