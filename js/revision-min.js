var driveURL="https://docs.google.com/uc?id=",thumbURL="https://drive.google.com/uc?export=view&id=",visualization,imagePool={},page={loading:!1,stylus:!0,answerMode:!1,match:"m",limit:10,offset:0,total:0,slideIndex:1,subjectCode:"-1",paperCode:"-1",monthCode:"-1",zoneCode:"-1",search:"T",yearCode:"-1",chapterCode:"-1",searchTerm:null,list:{}},mcqa=document.getElementById("mcq-A"),mcqb=document.getElementById("mcq-B"),mcqc=document.getElementById("mcq-C"),mcqd=document.getElementById("mcq-D"),subQSel=
{},profile=null,siteAccess=!1;function onSignIn(c){document.getElementById("status_id");profile=c.getBasicProfile();console.log("ID: "+profile.getId());console.log("Full Name: "+profile.getName());var d=document.getElementById("user-profile-image-id");d.src=profile.getImageUrl();d.style.display="block";document.getElementById("user-profile-icon-id").style.display="none";c.getAuthResponse();checkPermission()}
function checkPermission(){popup("id-google-login","open");var c=new Image,d=document.getElementById("status_id");d.innerHTML="Hi, "+profile.getName()+", please wait, Checking permissions ...";c.src=accessURL;c.id="test_id";c.onload=function(){d.innerHTML="Hi, "+profile.getName()+", Authorization successful !";popup("id-google-login","close");siteAccess=!0;loadData()};c.onerror=function(){siteAccess=!1;d.innerHTML="Hi, "+profile.getName()+", Unable to access site, please make sure you have access by contacting Administrator"}}
function signOut(){gapi.auth2.getAuthInstance().signOut().then(function(){console.log("User signed out.");document.getElementById("user-profile-icon-id").style.display="block";document.getElementById("user-profile-image-id").style.display="none";document.getElementById("status_id").innerHTML="Google Sign In is required !"})}
function setSelection(c){var d=document.getElementById("topic-view"),f=document.getElementById("year-view"),e=document.getElementById("year-view2"),h=document.getElementById("search-view"),l=document.getElementById("non-search-view");d.style.display="none";f.style.display="none";e.style.display="none";h.style.display="none";l.style.display="none";document.formSearch.loadQuestions.disabled=!1;"T"==c?(d.style.display="block",l.style.display="block",page.search="T",document.getElementById("id-offset-count-status").innerHTML=
""):"Y"==c?(f.style.display="block",l.style.display="block",e.style.display="block",page.search="Y",document.getElementById("id-offset-count-status").innerHTML=""):(h.style.display="block",l.style.display="block",page.search="S",document.getElementById("id-offset-count-status").innerHTML='Tip:- For absolute search use quotes, Ex:  "Gross Domestic Product"');setSubject(page.subjectCode)}
function responsiveView(){var c=document.getElementById("myTopnav");c.className="icon-bar-h"===c.className?c.className+" responsive":"icon-bar-h"}function popup(c,d){var f=document.getElementById(c+"-popup");f&&("id-search-menu"!=c||siteAccess?f.style.display="open"==d?"block":"close"==d?"none":"block"!=f.style.display?"block":"none":checkPermission())}
function toggleAnswerMode(){var c=page.list[page.slideIndex-1].data;if(c.isMCQ&&(!page.answerMode||null==c.mark)){var d=document.getElementById("id-answermode-menu");c=document.getElementById("quiz-answer-id");d=d.childNodes[0];page.answerMode?(page.answerMode=!1,d.style.color="red"):(d.style.color="green",page.answerMode=!0);resetMCQObjects();updateQuizPanel(c)}}
function toggleTouch(c){page.stylus?(removeTouchListeners(),page.stylus=!1,c.style.color="white"):(addTouchListeners(),c.style.color="red",page.stylus=!0)}window.onclick=function(c){c=c.target;null!=c&&c.id.endsWith("-popup")&&(c.style.display="none")};function keyPressedIgnore(c){c.stopPropagation()}
function keyPressed(c){c=c.which||c.keyCode;switch(c){case 65:case 97:checkMCQAnswer(mcqa,"A");break;case 66:case 98:checkMCQAnswer(mcqb,"B");break;case 67:case 99:checkMCQAnswer(mcqc,"C");break;case 68:case 100:checkMCQAnswer(mcqd,"D");break;case 13:case 39:case 78:case 110:plusDivs(1);break;case 37:case 80:case 112:plusDivs(-1);break;case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:ques=c-48;0==ques&&(ques=10);console.log("Display: "+ques);plusDivs(ques-page.slideIndex);
break;case 82:case 114:toggleAnswerMode();break;case 63:case 47:if((c=page.list[page.slideIndex-1].data.isMCQ)||"TRUE"==c||"true"==c)break;popup("show-answer-id");break;case 81:case 113:displayPaperLinks("qp");break;case 77:case 109:displayPaperLinks("ms");break;case 70:case 102:popup("id-search-menu")}}
function checkMCQAnswer(c,d){var f=page.list[page.slideIndex-1];f&&0!=f.isMCQ&&(f.data.selected=d,page.answerMode?null==f.data.mark&&(f.data.mark=f.data.answer==d?1:0):f.data.mark=f.data.answer==d?1:0,f=document.getElementById("quiz-"+page.slideIndex),resetMCQObjects(),f.setAttribute("class","answer selected"),f=document.getElementById("quiz-answer-id"),updateQuizPanel(f))}
function loadNext(c){if(0>c)return page.offset=0,displayMessage("No data"),!1;if(c>page.total)return page.offset-=page.limit,displayMessage("No data"),!1;page.loading=!0;page.offset=c;loadQuestions();return!0}
function plusDivs(c){var d=page.slideIndex+c;d>page.total||0>=d||(page.list&&page.list[d-1]?(page.slideIndex=d,1==c?page.slideIndex+5>page.subTotal&&page.subTotal<page.total&&!page.loading&&(loadNext(page.offset+=page.limit)||--page.slideIndex):!page.list[page.subTotal-5]&&page.slideIndex<page.subTotal&&page.subTotal-5<page.slideIndex&&0<page.subTotal-page.limit&&!page.loading&&!loadNext(page.offset-=page.limit)&&(page.slideIndex+=1),showDivs(page.slideIndex)):displayMessage("No Records !"))}
function resetMCQObjects(){for(var c=document.getElementsByName("mcq-objects"),d=page.list[page.slideIndex-1].data.selected,f=page.list[page.slideIndex-1].data.answer,e=0;e<c.length;e++){var h=c[e].childNodes[0],l=c[e].id;h.style.backgroundColor="blue";l.endsWith("-"+d)&&(h.style.backgroundColor="#862c97",page.answerMode&&(l.endsWith("-"+f)?h.style.backgroundColor="green":h.style.backgroundColor="red"))}}
function hidePads(){for(var c=document.getElementById("myPad").children.length,d=0;d<c;d++)document.getElementById("myPad").children[d].style.display="none"}
function showDivs(c){hidePads();if(page.list&&page.list[page.slideIndex-1]){c=page.list[page.slideIndex-1].draw.question;c.style.display="block";initPad(c);var d=document.getElementById("show-mcq-id"),f=document.getElementById("quiz-answer-id"),e=document.getElementById("id-answermode-menu"),h=document.getElementById("show-answer-id");c=page.list[page.slideIndex-1].data;resetMCQObjects();var l=c.isMCQ;l||"TRUE"==l||"true"==l?(d.style.display="block",e.style.display="block",h.style.display="none",
f.style.display="block",updateQuizPanel(f)):(d.style.display="none",e.style.display="none",h.style.display="block",f.style.display="none",updateAnswerPanel());"m"!=page.match?(d=c[page.match]+". "+subjectMap[page.subjectCode].c[c[page.match]].d,50<d.length&&(d=d.substring(0,50)+" ... ")):(d=c.m0+". "+subjectMap[page.subjectCode].c[c.m0].d,d=d.substring(0,35)+" ... /"+c.m1+". "+subjectMap[page.subjectCode].c[c.m1].d.substring(0,10)+" ... ");document.getElementById("subject-name-id").innerHTML=d;displayMessage(c.questionName);
displayPaperLinks()}else displayMessage("No Records !")}
function updateQuizPanel(c){var d=parseInt(page.limit/2),f=document.getElementById("quiz-marks-id"),e=0,h=document.getElementById("quiz-"+page.slideIndex);null==h&&(h=document.createElement("div"),h.setAttribute("id","quiz-"+page.slideIndex),h.innerHTML=page.slideIndex,h.setAttribute("class","answer"),c.appendChild(h),d=page.limit);h=c.childNodes.length;for(var l=0;l<h;l++){var m=c.childNodes[l];m.classList.remove("red");m.classList.remove("blue");m.classList.remove("green");var n="none";if(m.id){var p=
/quiz-(\d*)/g.exec(m.id);p&&(p=parseInt(p[1]));var q=page.list[p-1].data,t=page.list[p-1].data.mark;t=0==t?negativePoint:t*positivePoint;null!=page.list[p-1].data.mark&&(e+=t);null!=q.selected&&m.setAttribute("class","answer selected");p==page.slideIndex&&m.setAttribute("class","answer blue");page.answerMode&&(1==page.list[p-1].data.mark?m.setAttribute("class","answer green"):0==page.list[p-1].data.mark&&m.setAttribute("class","answer red"));if(h<page.limit||Math.abs(page.slideIndex-p)<d)n="inline-block"}m.style.display=
n}page.answerMode?null!=q.mark&&(f.innerHTML="IB"==curriculum||"IG"==curriculum?Math.round(e/h*100)+"%":e+"/"+h*positivePoint):f.innerHTML=""}
function displayPaperLinks(c){var d=page.list[page.slideIndex-1].data,f="",e="",h="",l=d.qpIds;if(null!=l){l=l.split(",");for(var m=0;m<l.length;m++)if(null!=l[m]&&""!==l[m]){"qp"==c&&window.open(driveURL+l[m]);var n="";0<m&&(n=m+1);f=f+"<a target=_ href='"+driveURL+l[m]+"' > QP "+n+"</a>";break}}l=d.msIds;if(null!=l)for(l=l.split(","),m=0;m<l.length;m++)if(null!=l[m]&&""!==l[m]){n="";"ms"==c&&window.open(driveURL+l[m]);0<m&&(n=m+1);e=e+"<a target=_ href='"+driveURL+l[m]+"' > MS "+n+"</a>";break}c=
d.othersIds;if(null!=c)for(c=c.split(","),m=0;m<c.length;m++)null!=c[m]&&""!==c[m]&&(n="",0<m&&(n=m+1),h=h+"<a target=_ href='"+driveURL+c[m]+"' > OTHER "+n+"</a>");document.getElementById("qp-papers-id").innerHTML=f;document.getElementById("ms-papers-id").innerHTML=e;document.getElementById("ot-papers-id").innerHTML=h;document.getElementById("total-questions-id").innerHTML=page.slideIndex+" / "+page.total}
function displaySubQs(c,d){var f=document.getElementsByClassName("subqReport"),e;for(e=f.length-1;0<=e;e--)f[e].parentNode.removeChild(f[e]);f=null;try{f=JSON.parse(c)}catch(t){return}if(f){var h=page.list[page.slideIndex-1].data;e=h.questionName;var l=0;h=h.questionPages;for(k in f){var m=f[k];for(sq1K in m){id=e+"_"+sq1K;var n=m[sq1K];if(n.children)for(sq2K in n.children){id=e+"_"+sq1K+"_"+sq2K;var p=n.children[sq2K],q=(l+p.yPos+30)*d;addDiv(id,q,p.ans,p.report,p.re)}else q=(l+n.yPos+30)*d,addDiv(id,
q,n.ans,n.report,n.re)}h[k-1]&&(l+=imagePool[h[k-1].id].image.naturalHeight)}}}
function addDiv(c,d,f,e,h){d&&(e||(e=""),subQSel[c]={option:"a",w:"",a:f,r:e,re:h},f=document.createElement("div"),f.id="d_"+c,f.className="subqReport",f.style="position: relative; top: "+d+"px;",d=document.createElement("BUTTON"),e=document.createTextNode(" ? "),d.setAttribute("data-role","popover"),d.id=c,d.style="left: 0px;-webkit-text-fill-color: white;background-color: seagreen;border: none;position: absolute;border-top-right-radius: 6px;border-bottom-right-radius: 6px;",d.appendChild(e),f.appendChild(d),
myPad.appendChild(f))}function showOption(c,d){subQSel[c].option=d}
function setSubject(c){page.subjectCode=c;offset=0;var d=document.formSearch.chapters;d.innerHTML="";var f=subjectMap[page.subjectCode].c;c=page.chapterCode;for(var e in f)if(f.hasOwnProperty(e)){c&&-1!=c||(c=e);var h=f[e];h[page.match]&&0<h[page.match].n&&(h=new Option(e+" - "+h.d+" ("+h[page.match].n+")",e),c==e&&(h.selected=!0),d.appendChild(h))}e=page.yearCode;d=document.formSearch.years;d.innerHTML="";f=subjectMap[page.subjectCode].y;for(var l=Object.keys(f).sort().reverse(),m=0;m<l.length;m++){var n=
l[m];e&&-1!=e||(e=n);h=new Option(n+" ("+f[n].n+")",n);e==n&&(h.selected=!0);d.appendChild(h)}"Y"==page.search?setYear(e):"T"==page.search?setChapter(c):"S"==page.search&&setSearch(null)}
function populatePapers(){var c=document.formSearch.papers;c.innerHTML="";var d=null;if("Y"==page.search){var f=subjectMap[page.subjectCode].y[page.yearCode].m[page.monthCode].p;for(var e=Object.keys(f).sort(),h=0;h<e.length;h++){var l=e[h];d||(d=l);c.appendChild(new Option(l+" ("+f[l].n+")",l))}}else if("T"==page.search)for(l in f=subjectMap[page.subjectCode].c[page.chapterCode][page.match].p,f)d||(d=l),c.appendChild(new Option(l+" ("+f[l]+")",l));else if("S"==page.search)for(l in f=subjectMap[page.subjectCode].s,
f)d||(d=l),c.appendChild(new Option(l+" ("+f[l].n+")",l));setPaper(d)}function setPaper(c){page.paperCode=c;"Y"==page.search?populateZones():"T"==page.search&&(page.total=subjectMap[page.subjectCode].c[page.chapterCode][page.match].p[page.paperCode],populateOffset())}function setMatch(c){page.match=c;setSubject(page.subjectCode)}function setSearch(c){page.total=0;populatePapers()}function setChapter(c){page.chapterCode=c;page.offset=0;populatePapers()}
function setYear(c){page.yearCode=c;page.offset=0;populateMonths()}function setMonth(c){page.monthCode=c;populatePapers()}function setZone(c){page.zoneCode=c;page.total=subjectMap[page.subjectCode].y[page.yearCode].m[page.monthCode].p[page.paperCode].z[page.zoneCode];populateOffset()}
function populateMonths(){var c=document.formSearch.months;c.innerHTML="";var d=null;if("Y"==page.search){var f=subjectMap[page.subjectCode].y[page.yearCode].m,e;for(e in f)d||(d=e),c.appendChild(new Option(monthDesc[e]+" ("+f[e].n+")",e))}setMonth(d)}
function populateZones(){var c=document.formSearch.zones;c.innerHTML="";var d=null;if("Y"==page.search){var f=subjectMap[page.subjectCode].y[page.yearCode].m[page.monthCode].p[page.paperCode].z,e;for(e in f)d||(d=e),c.appendChild(new Option(e+" ("+f[e]+")",e))}setZone(d)}
function populateOffset(){page.offset=0;var c=document.formSearch.offsets;c.innerHTML="";var d=Math.ceil(page.total/page.limit),f=page.total%page.limit;0==f&&(f=page.limit);for(i=0;i<d;i++){var e=i*page.limit,h=e+1+" - "+(e+page.limit);i==d-1&&(h=e+1+" - "+(e+f));c.appendChild(new Option(h,e))}setOffset(0)}function setOffset(c){page.offset=c;page.slideIndex=c+1}function displayMessage(c){document.getElementById("question-name-id").innerHTML=c}
function loadQuestionsReset(){popup("id-search-menu");popup("id-loading-menu");document.getElementById("myPad").innerHTML="";page.list={};page.slideIndex=page.offset+1;document.getElementById("id-answermode-menu").childNodes[0].style.color="red";page.answerMode=!1;imagePool={};document.getElementById("quiz-answer-id").innerHTML="";document.getElementById("quiz-marks-id").innerHTML="";loadQuestions()}
function getSearchQueryWhere(){if(page.searchTerm){var c=" WHERE  C = '"+page.paperCode+"' AND ";if(page.searchTerm.startsWith('"')&&page.searchTerm.endsWith('"'))return c+"lower(M) contains '"+page.searchTerm.replace(/"/g,"").replace(/ {1,}/g," ")+"'";for(var d=page.searchTerm.split(/ {1,}/),f=0;f<d.length;f++)0<f&&(c+=" AND "),c+=" lower(M) contains '"+d[f]+"'";return c}}
function loadQuestionsCount(){page.searchTerm=document.formSearch.searchTerm.value;if(page.searchTerm){page.searchTerm=page.searchTerm.trim().toLowerCase().replace(/'/g,"");document.formSearch.loadQuestions.disabled=!0;document.getElementById("id-offset-count-status").innerHTML="Fetching Count, please wait ...";var c=new google.visualization.Query("http://spreadsheets.google.com/tq?key="+ssKey+"&pub=1&sheet="+page.subjectCode),d="SELECT COUNT(M) "+getSearchQueryWhere();c.setQuery(d);console.log("Query: "+
d);c.send(handleQuestionsCountResponse)}else displayMessage("Invalid Search Term ...")}
function handleQuestionsCountResponse(c){var d=document.formSearch.loadQuestions,f=c.getDataTable();c.isError()?document.getElementById("id-offset-count-status").innerHTML="Error: "+c.getMessage():0==f.getNumberOfRows()?(page.total=0,document.getElementById("id-offset-count-status").innerHTML="Search returned NO results !"):(d.disabled=!1,page.total=f.getValue(0,0),document.getElementById("id-offset-count-status").innerHTML=page.total+" records found, click Load Questions button",populateOffset())}
function loadQuestions(){displayMessage("Loading ...");if("-1"==page.subjectCode||-1==page.chapterCode&&-1==page.yearCode||-1==page.offset)displayMessage("Select Options");else{var c=new google.visualization.Query("http://spreadsheets.google.com/tq?key="+ssKey+"&pub=1&sheet="+page.subjectCode),d="SELECT * WHERE  C = '"+page.paperCode,f="";"Y"==page.search?(d=d+"' AND B = "+page.yearCode+" AND lower(Q) = '"+page.monthCode.toLowerCase()+"' AND D = '"+page.zoneCode+"'",f=" ORDER BY B,Q,C,D LIMIT "):
"T"==page.search?("m"==page.match?d=d+"' AND (F = '"+page.chapterCode+"' OR G = '"+page.chapterCode+"')":"m0"==page.match?d=d+"' AND F = '"+page.chapterCode+"' ":"m1"==page.match&&(d=d+"' AND G = '"+page.chapterCode+"' "),f=" ORDER BY B DESC LIMIT "):"S"==page.search&&(f=" ORDER BY B DESC LIMIT ",d="SELECT * "+getSearchQueryWhere());d=d+f+page.limit+" OFFSET "+page.offset;c.setQuery(d);console.log("Query: "+d);c.send(handleQuestionsResponse)}}
function getDriveImageLink(c){var d=gapi.client.drive.files.get({fileId:c,fields:"id, thumbnailLink"});d.then(function(d){var e=new Image;e.id=c;e.src=d.result.thumbnailLink.replace("=s220","");imagePool[c]={image:e,status:"pending"};e.onload=function(){imagePool[this.id].status="done";var c=imagePool.firstPage;0==c[this.id]&&(delete c[this.id],0==Object.keys(c).length&&Object.keys(page.list).length<=page.limit&&(console.log("Displaying very first image ..."),showDivs(page.slideIndex),popup("id-loading-menu")))};
e.onerror=function(){imagePool[this.id].status="error";displayMessage("Unable to download");console.log("Unable to download: "+e.src)}},function(c){console.error(c)});return d}function loadDrivePageImages(c,d){var f=[];if(null!=c){c=c.split(",");for(var e=0;e<c.length;e++){var h=c[e].trim();null!=h&&0<h.length&&"undefined"!=h&&(f.push({id:h}),0==d&&(void 0==imagePool.firstPage&&(imagePool.firstPage={}),imagePool.firstPage[h]=0),getDriveImageLink(h))}}return f}
function loadPageImages(c,d){var f=[];if(null!=c){c=c.split(",");for(var e=0;e<c.length;e++){var h=c[e].trim();if(null!=h&&0<h.length&&"undefined"!=h){f.push({id:h});var l=new Image;l.src=thumbURL+h;l.id=h;imagePool[h]={image:l,status:"pending",index:d+page.offset};0==d&&(void 0==imagePool.firstPage&&(imagePool.firstPage={}),imagePool.firstPage[h]=0);l.onload=function(){imagePool[this.id].status="done";updateCanvas(imagePool[this.id].index);var c=imagePool.firstPage;0==c[this.id]&&(delete c[this.id],
0==Object.keys(c).length&&Object.keys(page.list).length<=page.limit&&(console.log("Displaying very first image ..."),showDivs(page.slideIndex),popup("id-loading-menu")))};l.onerror=function(){imagePool[this.id].status="error";displayMessage("Unable to download");console.log("Unable to load Image"+this.id);page.list[d].draw.question.children[0].innerHTML="Error in downloding question: "+this.id}}}}return f}
function handleQuestionsResponse(c){page.loading=!1;if(c.isError())displayMessage(c.getDetailedMessage());else{var d=document.formSearch.offsets;document.formSearch.offsets.value=offset;d.value=offset;c=c.getDataTable();d=page.offset;page.subTotal=d+c.getNumberOfRows();for(var f=c.getNumberOfRows(),e=0;e<f;e++){var h={};h.code=c.getValue(e,0);h.Y=c.getValue(e,1);h.paper=c.getValue(e,2);h.zone=c.getValue(e,3);h.isMCQ=c.getValue(e,4);h.m0=c.getValue(e,5);h.m1=c.getValue(e,6);h.questionNo=c.getValue(e,
7);h.questionName=c.getValue(e,8);h.questionName&&"IB"==curriculum&&(h.questionName=h.questionName.replace(/_/gmi,"/"));var l=c.getValue(e,9);h.answer=c.getValue(e,10);h.mark=null;var m=c.getValue(e,11);h.subQs=c.getValue(e,12);h.qpIds=c.getValue(e,13);h.msIds=c.getValue(e,14);h.othersIds=c.getValue(e,15);page.list[d+e]={data:{},draw:{question:createPad("sketchpad"+(e+page.offset))}};h.questionPages=loadPageImages(l,e);h.answerPages=loadPageImages(m,e);page.list[d+e].data=h}}}
function createPad(c){var d=document.getElementById("myPad"),f=document.createElement("div");f.id=c;d.appendChild(f);d=document.createElement("div");d.id=c+"-status";d.style.color="red";d.innerHTML="Loading ...";var e=document.createElement("canvas");e.id=c+"-canvas";e.className="sketchpad";e.style["float"]="left";e.style.maxWidth="100%";e.height=0;e.getContext&&e.getContext("2d");f.appendChild(d);f.appendChild(e);f.style.display="none";return f}
function updateCanvas(c){var d=0,f=page.list[c].data.questionPages,e=0,h=0;c=page.list[c].draw.question;for(var l=c.children[1],m=l.getContext("2d"),n=c.children[0],p=0;p<f.length;p++){var q=imagePool[f[p].id].image;if(!isImgOk(q))return;n.style.display="none";e<q.naturalWidth&&(e=q.naturalWidth);h+=q.naturalHeight}e<window.innerWidth&&(e=window.innerWidth);h<window.innerHeight&&(h=window.innerHeight-50);l.height=h;l.width=e;for(p=0;p<f.length;p++)q=imagePool[f[p].id].image,m.drawImage(q,0,d),d+=
parseInt(q.naturalHeight);c.scrollTop=0;window.scrollTo(0,0);displaySubQs(page.list[page.slideIndex-1].data.subQs,l.clientHeight/h)}function loadSubjectsData(){var c=Object.keys(subjectMap).sort();document.formSearch.subjects.innerHTML="";for(i=0;i<c.length;i++){var d=c[i],f=subjectMap[d];document.formSearch.subjects.appendChild(new Option(f.d+" ("+f.n+" questions)",d))}-1==page.subjectCode&&(page.subjectCode=c[0]);setSubject(page.subjectCode)}
function loadData(){loadSubjectsData();popup("id-search-menu");initDrag()}function updateAnswerPanel(){var c=page.list[page.slideIndex-1].data.answerPages,d=document.getElementById("answer-panel");d.innerHTML="";for(var f=0;f<c.length;f++){var e=imagePool[c[f].id].image;e.style.maxWidth="100%";e.style.marginLeft="0px";d.appendChild(e)}}
function showHideAnswer(c){var d=document.getElementById("answer-panel"),f=document.getElementById("show-answer-id");c||"block"===d.style.display?(d.style.display="none",f.style.backgroundColor="green"):(d.style.display="block",f.style.backgroundColor="red")}function isImgOk(c){return c.complete&&0!==c.naturalWidth?!0:!1}function resizeObjects(){repositionControlBar()}function kill(c){window.document.body.addEventListener(c,function(c){c.preventDefault();c.stopPropagation();return!1},!0)}
var canvas,ctx,myPad,mouseX,mouseY,mouseDown=0,touchX,touchY,lastX,lastY=-1,thickness=1;function initPad(c){this.myPad=c;c.style="max-height: "+(screen.height-50)+"px;";this.canvas=c.children[1];this.canvas.getContext&&(this.ctx=canvas.getContext("2d"));page.stylus&&addTouchListeners()}
function addTouchListeners(){ctx&&(canvas.addEventListener("mousedown",sketchpad_mouseDown,!1),canvas.addEventListener("mousemove",sketchpad_mouseMove,!1),window.addEventListener("mouseup",sketchpad_mouseUp,!1),canvas.addEventListener("touchstart",sketchpad_touchStart,!1),canvas.addEventListener("touchend",sketchpad_touchEnd,!1),canvas.addEventListener("touchmove",sketchpad_touchMove,!1))}
function removeTouchListeners(){ctx&&(canvas.removeEventListener("mousedown",sketchpad_mouseDown,!1),canvas.removeEventListener("mousemove",sketchpad_mouseMove,!1),window.removeEventListener("mouseup",sketchpad_mouseUp,!1),canvas.removeEventListener("touchstart",sketchpad_touchStart,!1),canvas.removeEventListener("touchend",sketchpad_touchEnd,!1),canvas.removeEventListener("touchmove",sketchpad_touchMove,!1))}
function drawLine(c,d,f,e){if(-1==lastX||100<Math.abs(lastX-d))lastX=d,lastY=f;r=255;b=g=0;a=255;c.strokeStyle="rgba("+r+","+g+","+b+","+a/255+")";c.lineCap="round";c.beginPath();c.moveTo(lastX/(canvas.clientWidth/canvas.width),lastY/(canvas.clientHeight/canvas.height));c.lineTo(d/(canvas.clientWidth/canvas.width),f/(canvas.clientHeight/canvas.height));c.lineWidth=e;c.stroke();c.closePath();lastX=d;lastY=f}
function clearCanvas(){ctx.clearRect(0,0,canvas.width,canvas.height);updateCanvas(page.slideIndex-1)}function sketchpad_mouseDown(){mouseDown=1;drawLine(ctx,mouseX,mouseY,thickness)}function sketchpad_mouseUp(){mouseDown=0;lastY=lastX=-1}function sketchpad_mouseMove(c){getMousePos(c);1==mouseDown&&drawLine(ctx,mouseX,mouseY,thickness)}function getMousePos(c){c||(c=event);c.offsetX?(mouseX=c.offsetX,mouseY=c.offsetY):c.layerX&&(mouseX=c.layerX,mouseY=c.layerY)}
function sketchpad_touchStart(){getTouchPos();drawLine(ctx,touchX,touchY,thickness);event.preventDefault()}function sketchpad_touchEnd(){lastY=lastX=-1}function sketchpad_touchMove(c){getTouchPos(c);drawLine(ctx,touchX,touchY,thickness);event.preventDefault()}function getTouchPos(c){c||(c=event);c.touches&&1==c.touches.length&&(c=c.touches[0],touchX=c.pageX-c.target.offsetLeft+myPad.scrollLeft,touchY=c.pageY-c.target.offsetTop+myPad.scrollTop)}var pos1=0,pos2=0,pos3=0,pos4=0,elmnt=null;
function initDrag(){pos4=pos3=pos2=pos1=0;elmnt=document.getElementById("controlbar");dragElement(document.getElementById("controlbar"))}function dragTouchStart(c){c=c||window.event;pos3=c.touches[0].clientX;pos4=c.touches[0].clientY}function closeTouchElement(){document.ontouchend=null;document.ontouchmove=null}
function elementTouchDrag(c){c=c||window.event;pos1=pos3-c.touches[0].clientX;pos2=pos4-c.touches[0].clientY;-5<=pos1&&5>=pos1||-5<=pos2&&5>=pos2||(c.preventDefault(),pos3=c.touches[0].clientX,pos4=c.touches[0].clientY,elmnt.style.top=elmnt.offsetTop-pos2+"px",elmnt.style.left=elmnt.offsetLeft-pos1+"px")}dragElement(document.getElementById("controlbar"));
function dragElement(c){function d(c){c=c||window.event;c.preventDefault();m=c.clientX;n=c.clientY;document.onmouseup=e;document.onmousemove=f}function f(d){d=d||window.event;d.preventDefault();h=m-d.clientX;l=n-d.clientY;m=d.clientX;n=d.clientY;c.style.top=c.offsetTop-l+"px";c.style.left=c.offsetLeft-h+"px"}function e(){document.onmouseup=null;document.onmousemove=null}var h=0,l=0,m=0,n=0;if(c=document.getElementById("controlbar"))c.onmousedown=d,c.ontouchstart=dragTouchStart};
