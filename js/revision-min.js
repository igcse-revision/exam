var driveURL = 'https://docs.google.com/uc?id=';
// var thumbURL = 'https://drive.google.com/thumbnail?authuser=0&sz=w1024&id=';
var thumbURL = 'https://drive.google.com/uc?export=view&id=';

// var driveURL = 'https://drive.google.com/open?id=';

var visualization;

var imagePool = {};
var page = {
    "loading": false,
    "stylus": true,
    "answerMode": false,
    "match": "m",
    "limit": 10,
    "offset": 0,
    "total": 0,
    "slideIndex": 1,
    "subjectCode": "-1",
    "paperCode": "-1",
    "monthCode": "-1",
    "zoneCode": "-1",
    "search": "T",
    "yearCode": "-1",
    "chapterCode": "-1",
    "searchTerm": null,
    "list": {}
};

var mcqa = document.getElementById("mcq-A");
var mcqb = document.getElementById("mcq-B");
var mcqc = document.getElementById("mcq-C");
var mcqd = document.getElementById("mcq-D");

var subQSel = {};

var profile = null;
var siteAccess = false;

function onSignIn(googleUser) {

    var status = document.getElementById("status_id");

    // Useful data for your client-side scripts:
    profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId());
    // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    var userImg = document.getElementById("user-profile-image-id");
    userImg.src = profile.getImageUrl();
    userImg.style.display = "block";
    document.getElementById("user-profile-icon-id").style.display = "none";

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;

    checkPermission();

}

function checkPermission() {
    popup("id-google-login", "open");
    var image = new Image();
    var status = document.getElementById("status_id");
    status.innerHTML = "Hi, " + profile.getName() + ", please wait, Checking permissions ...";

    //         image.src = "https://drive.google.com/thumbnail?authuser=0&sz=w1024&id=1frOQrDtngWDSw4jgrjETYDKxIX89kfTB";

    image.src = accessURL;
    image.id = "test_id";

    image.onload = function() {
        status.innerHTML = "Hi, " + profile.getName() + ", Authorization successful !";
        popup("id-google-login", "close");
        siteAccess = true;
        loadData();
        //window.location.replace("ib.html");
    }
    ;

    image.onerror = function() {
        siteAccess = false;
        status.innerHTML = "Hi, " + profile.getName() + ", Unable to access site, please make sure you have access by contacting Administrator";
    }
    ;

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
        document.getElementById("user-profile-icon-id").style.display = "block";
        document.getElementById("user-profile-image-id").style.display = "none";
        document.getElementById("status_id").innerHTML = "Google Sign In is required !";
    });
}

function setSelection(sel) {
    var vT = document.getElementById("topic-view");
    var vY = document.getElementById("year-view");
    var vY2 = document.getElementById("year-view2");
    var vS = document.getElementById("search-view");
    var vN = document.getElementById("non-search-view");

    vT.style.display = "none";
    vY.style.display = "none";
    vY2.style.display = "none";
    vS.style.display = "none";
    vN.style.display = "none";

    document.formSearch.loadQuestions.disabled = false;

    if (sel == "T") {
        vT.style.display = "block";
        vN.style.display = "block";
        page.search = "T";
        document.getElementById("id-offset-count-status").innerHTML = "";
    } else if (sel == "Y") {
        vY.style.display = "block";
        vN.style.display = "block";
        vY2.style.display = "block";
        page.search = "Y";
        document.getElementById("id-offset-count-status").innerHTML = "";
    } else {
        vS.style.display = "block";
        vN.style.display = "block";
        page.search = "S";
        document.getElementById("id-offset-count-status").innerHTML = "Tip:- For absolute search use quotes, Ex:  \"Gross Domestic Product\"";
    }

    setSubject(page.subjectCode);
}

function responsiveView() {
    var x = document.getElementById("myTopnav");
    if (x.className === "icon-bar-h") {
        x.className += " responsive";
    } else {
        x.className = "icon-bar-h";
    }
}

function popup(srcId, action) {
    var popObj = document.getElementById(srcId + "-popup");
    if (!popObj)
        return;

    if (srcId == "id-search-menu" && !siteAccess) {
        checkPermission();
        return;
    }

    var display = "none";
    if (action == "open") {
        display = "block";
    } else if (action == "close") {
        display = "none"
    } else {
        if (popObj.style.display != "block")
            display = "block";
        else
            display = "none";
    }

    popObj.style.display = display;
}

function toggleAnswerMode() {

    var qData = page.list[page.slideIndex - 1].data;
    var isMCQ = qData.isMCQ;
    if (!isMCQ)
        return;
    if (page.answerMode && qData["mark"] != null)
        return;

    var src = document.getElementById("id-answermode-menu");
    var quizElement = document.getElementById("quiz-answer-id");
    var childNode = src.childNodes[0];
    if (page.answerMode) {
        page.answerMode = false;
        childNode.style.color = "red";
    } else {
        childNode.style.color = "green";
        page.answerMode = true;
    }

    resetMCQObjects();
    updateQuizPanel(quizElement);
}

function toggleTouch(src) {

    if (page.stylus) {
        removeTouchListeners();
        page.stylus = false;
        src.style.color = "white";
    } else {
        addTouchListeners();
        src.style.color = "red";
        page.stylus = true;
    }
}

window.onclick = function(event) {
    var src = event.target;
    if (src == null)
        return;
    if (src.id.endsWith("-popup")) {
        src.style.display = "none";
    }
}

function keyPressedIgnore(event) {
    //event.preventDefault();
    event.stopPropagation();
}

function keyPressed(event) {
    var keyCode = event.which || event.keyCode;

    switch (keyCode) {

        //A or a is pressed
    case 65:
    case 97:
        checkMCQAnswer(mcqa, 'A');
        break;
    case 66:
    case 98:
        checkMCQAnswer(mcqb, "B");
        break;
    case 67:
    case 99:
        checkMCQAnswer(mcqc, "C");
        break;
    case 68:
    case 100:
        checkMCQAnswer(mcqd, "D");
        break;

        // "N" or "n" or "Enter" for Next
    case 13:
    case 39:
    case 78:
    case 110:
        plusDivs(1);
        break;
        // "P" for Previous
    case 37:
    case 80:
    case 112:
        plusDivs(-1);
        break;

    case 48:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
        ques = keyCode - 48;
        if (ques == 0)
            ques = 10;
        console.log("Display: " + ques);
        plusDivs(ques - page.slideIndex);
        break;

        // "R" or "r" for Results
    case 82:
    case 114:
        toggleAnswerMode();
        break;

        // question Mark or "/"
    case 63:
    case 47:
        var isMCQ = page.list[page.slideIndex - 1].data.isMCQ;
        if (isMCQ || isMCQ == "TRUE" || isMCQ == "true") {
            break;
        }
        popup("show-answer-id");
        break;

        // "q"
    case 81:
    case 113:
        displayPaperLinks("qp");
        break;

        // "M"
    case 77:
    case 109:
        displayPaperLinks("ms");
        break;

        // Open or close search box
    case 70:
    case 102:
        popup("id-search-menu");
        break;

    default:
        break;
    }

}

// END of copied from index.html

function checkMCQAnswer(obj, value) {

    var ques = page.list[page.slideIndex - 1];
    if (!ques || ques.isMCQ == false)
        return;

    ques.data["selected"] = value;

    if (page.answerMode) {
        // If answer mode, marking is allowed only once
        if (ques.data["mark"] == null) {
            if (ques.data["answer"] == value)
                ques.data["mark"] = 1;
            else
                ques.data["mark"] = 0;
        }
    } else {
        if (ques.data["answer"] == value)
            ques.data["mark"] = 1;
        else
            ques.data["mark"] = 0;
    }

    // Do not provide change answer option on answer mode
    // if(!ques.data["selected"]) {
    //     ques.data["selected"] = value;
    // } else if(!page.answerMode) {
    //     ques.data["selected"] = value;
    // }

    var d = document.getElementById("quiz-" + page.slideIndex);

    resetMCQObjects();
    d.setAttribute("class", "answer selected");

    var quizElement = document.getElementById("quiz-answer-id");
    updateQuizPanel(quizElement);
}

function loadNext(n) {

    if (n < 0) {
        page.offset = 0;
        displayMessage("No data");
        return false;
    }
    if (n > page.total) {
        page.offset -= page.limit;
        displayMessage("No data");
        return false;
    }
    page.loading = true;
    page.offset = n;
    loadQuestions();
    return true;
}

function plusDivs(n) {

    var ind = page.slideIndex + n;
    if (ind > page.total || ind <= 0)
        return;

    if (!page.list || !page.list[ind - 1]) {
        displayMessage("No Records !");
        return;
    }

    page.slideIndex = ind;
    //console.log("Page Subtotal: " + page.subTotal + ", Slide Index: " + page.slideIndex);

    if (n == 1) {
        // This represents next button
        if ((page.slideIndex + 5) > page.subTotal && page.subTotal < page.total && !page.loading) {
            if (!loadNext(page.offset += page.limit))
                page.slideIndex -= 1;
        }

    } else {
        var curRecord = page.list[page.subTotal - 5];
        // This is left arrow
        if (!curRecord && (page.slideIndex < page.subTotal && page.subTotal - 5 < page.slideIndex) && page.subTotal - page.limit > 0 && !page.loading) {
            if (!loadNext(page.offset -= page.limit))
                page.slideIndex += 1;
        }

    }
    showDivs(page.slideIndex);
}

function resetMCQObjects() {
    var mcqObjs = document.getElementsByName("mcq-objects");
    var selected = page.list[page.slideIndex - 1].data.selected;
    var answer = page.list[page.slideIndex - 1].data.answer;

    for (var i = 0; i < mcqObjs.length; i++) {
        var node = mcqObjs[i].childNodes[0];
        var nodeId = mcqObjs[i].id;

        node.style.backgroundColor = "blue";

        if (nodeId.endsWith("-" + selected)) {
            node.style.backgroundColor = "#862c97";

            if (page.answerMode) {
                if (nodeId.endsWith("-" + answer)) {
                    node.style.backgroundColor = "green";
                } else {
                    node.style.backgroundColor = "red";
                }
            }
        }

        // if(page.answerMode && selected) {
        //     if(nodeId.endsWith("-"+answer)) {
        //         node.style.backgroundColor = "green";
        //     }
        // }
    }

}

function hidePads() {

    var len = document.getElementById("myPad").children.length;
    for (var i = 0; i < len; i++) {
        document.getElementById("myPad").children[i].style.display = "none";
    }
}

function showDivs(n) {
    hidePads();

    if (!page.list || !page.list[page.slideIndex - 1]) {
        displayMessage("No Records !");
        return;
    }
    var myPad = page.list[page.slideIndex - 1].draw.question;
    myPad.style.display = "block";
    initPad(myPad);

    // document.getElementById('config-page').style.display='block';

    var mcqElement = document.getElementById("show-mcq-id");
    var quizElement = document.getElementById("quiz-answer-id");
    var mcqAnswerMode = document.getElementById("id-answermode-menu");

    var answerElement = document.getElementById("show-answer-id");
    var pageData = page.list[page.slideIndex - 1].data;

    resetMCQObjects();

    var isMCQ = pageData.isMCQ;
    if (isMCQ || isMCQ == "TRUE" || isMCQ == "true") {
        mcqElement.style.display = "block";
        mcqAnswerMode.style.display = "block";
        answerElement.style.display = "none";
        quizElement.style.display = "block";

        updateQuizPanel(quizElement);
    } else {
        mcqElement.style.display = "none";
        mcqAnswerMode.style.display = "none";
        answerElement.style.display = "block";
        quizElement.style.display = "none";

        updateAnswerPanel();
    }

    var chapName = "";
    if (page.match != "m") {
        chapName = pageData[page.match] + ". " + subjectMap[page.subjectCode]["c"][pageData[page.match]].d;
        if (chapName.length > 50)
            chapName = chapName.substring(0, 50) + " ... ";

    } else {
        chapName = pageData["m0"] + ". " + subjectMap[page.subjectCode]["c"][pageData["m0"]].d;

        chapName = chapName.substring(0, 35) + " ... " + "/" + pageData["m1"] + ". " + subjectMap[page.subjectCode]["c"][pageData["m1"]].d.substring(0, 10) + " ... ";

    }
    document.getElementById("subject-name-id").innerHTML = chapName;

    displayMessage(pageData.questionName);
    displayPaperLinks();
    //updateCanvas("questionPages");
}

function updateQuizPanel(quizElement) {
    var midPoint = parseInt(page.limit / 2);
    var totMarks = document.getElementById("quiz-marks-id");
    var marks = 0;

    var d = document.getElementById("quiz-" + page.slideIndex);
    if (d == null) {
        d = document.createElement("div");
        d.setAttribute("id", "quiz-" + page.slideIndex);
        d.innerHTML = page.slideIndex;
        d.setAttribute('class', 'answer');
        quizElement.appendChild(d);
        midPoint = page.limit;
    }

    var len = quizElement.childNodes.length;

    for (var i = 0; i < len; i++) {
        var el = quizElement.childNodes[i];
        el.classList.remove("red");
        el.classList.remove("blue");
        el.classList.remove("green");
        var sty = "none";
        if (el.id) {

            var ind = /quiz-(\d*)/g.exec(el.id);
            if (ind)
                ind = parseInt(ind[1]);

            var pData = page.list[ind - 1].data;
            var wtMark = page.list[ind - 1].data["mark"];

            if (wtMark == 0)
                wtMark = negativePoint;
            else
                wtMark *= positivePoint;

            if (page.list[ind - 1].data["mark"] != null)
                marks += wtMark;

            if (pData.selected != null) {
                el.setAttribute("class", "answer selected");
            }

            if (ind == page.slideIndex) {
                el.setAttribute("class", "answer blue");
                //el.style.border = "2px solid red;"
            }

            if (page.answerMode) {
                if (page.list[ind - 1].data["mark"] == 1) {
                    el.setAttribute("class", "answer green");
                } else if (page.list[ind - 1].data["mark"] == 0) {
                    el.setAttribute("class", "answer red");
                }
            }
            if ((len < page.limit) || (Math.abs(page.slideIndex - ind) < midPoint))
                sty = "inline-block";
        }
        el.style.display = sty;
    }

    if (page.answerMode) {
        if (pData["mark"] != null) {
            if (curriculum == "IB" || curriculum == "IG") {
                totMarks.innerHTML = Math.round((marks / len) * 100) + "%";
            } else {
                totMarks.innerHTML = marks + "/" + (len * positivePoint);
            }
        }
    } else {
        totMarks.innerHTML = "";
    }

}

// This can be null or "qp" or "ms"
function displayPaperLinks(openWin) {
    var pageData = page.list[page.slideIndex - 1].data;

    var qlinks = ""
      , mlinks = ""
      , olinks = "";

    var qpIds = pageData.qpIds;
    if (qpIds != null) {
        qpIds = qpIds.split(",");
        for (var i = 0; i < qpIds.length; i++) {
            if (qpIds[i] != null && qpIds[i] !== "") {
                if (openWin == "qp")
                    window.open(driveURL + qpIds[i]);
                var seq = "";
                if (i > 0)
                    seq = (i + 1);
                qlinks = qlinks + "<a target=_ href='" + driveURL + qpIds[i] + "' > QP " + seq + "</a>";

                // I want only the first item now for space constraint
                break;
            }
        }

    }

    var msIds = pageData.msIds;
    if (msIds != null) {
        msIds = msIds.split(",");
        for (var i = 0; i < msIds.length; i++) {
            if (msIds[i] != null && msIds[i] !== "") {
                var seq = "";
                if (openWin == "ms")
                    window.open(driveURL + msIds[i]);
                if (i > 0)
                    seq = (i + 1);
                mlinks = mlinks + "<a target=_ href='" + driveURL + msIds[i] + "' > MS " + seq + "</a>";

                // I want only the first item now for space constraint
                break;
            }
        }

    }

    var othersIds = pageData.othersIds;
    if (othersIds != null) {
        othersIds = othersIds.split(",");
        for (var i = 0; i < othersIds.length; i++) {
            if (othersIds[i] != null && othersIds[i] !== "") {
                var seq = "";
                if (i > 0)
                    seq = (i + 1);
                olinks = olinks + "<a target=_ href='" + driveURL + othersIds[i] + "' > OTHER " + seq + "</a>";
            }
        }

    }

    document.getElementById("qp-papers-id").innerHTML = qlinks;
    document.getElementById("ms-papers-id").innerHTML = mlinks;
    document.getElementById("ot-papers-id").innerHTML = olinks;

    document.getElementById("total-questions-id").innerHTML = (page.slideIndex) + " / " + page.total;

}

function displaySubQs(subQsStr, imgHFactor) {

    var element = document.getElementsByClassName("subqReport"), index;
    for (index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
    }

    var subQs = null;
    try {
        subQs = JSON.parse(subQsStr);
    } catch (e) {
        return;
    }

    if (!subQs)
        return;

    var pageData = page.list[page.slideIndex - 1].data;
    var qName = pageData.questionName;
    var prevImgH = 0;
    var images = pageData["questionPages"];

    for (k in subQs) {
        // id = k;

        var pageQ = subQs[k];
        for (sq1K in pageQ) {
            id = qName + "_" + sq1K;
            var sq1 = pageQ[sq1K];
            if (sq1.children) {
                for (sq2K in sq1.children) {
                    id = qName + "_" + sq1K + "_" + sq2K;
                    var sq2 = sq1["children"][sq2K];
                    var pos = ((prevImgH + sq2.yPos + 30) * imgHFactor);
                    addDiv(id, pos, sq2.ans, sq2.report, sq2.re);
                }
            } else {
                // Add parent level box
                var pos = ((prevImgH + sq1.yPos + 30) * imgHFactor);
                addDiv(id, pos, sq1.ans, sq1.report, sq1.re);
            }
        }

        // Now calculate yPos value for second image if any !

        if (images[k - 1]) {
            var image = imagePool[images[k - 1].id].image;
            prevImgH += image.naturalHeight;
        }

    }
}

function addDiv(id, pos, ans, report, re) {

    // console.log("id: "+id+", pos: "+pos);
    if (!pos)
        return;

    if (!report)
        report = "";

    subQSel[id] = {
        "option": "a",
        "w": "",
        "a": ans,
        "r": report,
        "re": re
    };
    // This is for testing
    var dv = document.createElement('div');
    dv.id = "d_" + id;
    dv.className = "subqReport";
    dv.style = "position: relative; top: " + pos + "px;";

    var x = document.createElement("BUTTON");
    var t = document.createTextNode(" ? ");
    x.setAttribute("data-role", "popover");
    x.id = id;

    x.style = "left: 0px;-webkit-text-fill-color: white;background-color: seagreen;border: none;position: absolute;border-top-right-radius: 6px;border-bottom-right-radius: 6px;";
    x.appendChild(t);
    dv.appendChild(x);
    //dv.innerHTML = id+"["+pos+"]";

    // var x = dv.createElement("BUTTON");
    // var t = dv.createTextNode(id);
    // x.appendChild(t);

    myPad.appendChild(dv);

}

function showOption(qid, opt) {
    subQSel[qid].option = opt;
}

//{"0625":{"y":{"2002":{"1":40}},"c":{"1":20}}
function setSubject(subj) {
    page.subjectCode = subj;
    offset = 0;
    var chapters = document.formSearch.chapters;
    chapters.innerHTML = "";
    var chapData = subjectMap[page.subjectCode]["c"];

    var selChapterCode = page.chapterCode;
    for (var chNo in chapData) {
        if (chapData.hasOwnProperty(chNo)) {
            if (!selChapterCode || selChapterCode == -1)
                selChapterCode = chNo;
            var obj = chapData[chNo];
            if (obj[page.match] && obj[page.match]["n"] > 0) {
                var option = new Option(chNo + ' - ' + obj["d"] + " (" + obj[page.match]["n"] + ")",chNo);
                if (selChapterCode == chNo)
                    option.selected = true;
                chapters.appendChild(option);
            }

        }
    }

    var selYearCode = page.yearCode;
    var years = document.formSearch.years;
    years.innerHTML = "";
    var yearData = subjectMap[page.subjectCode]["y"];
    var yearArr = Object.keys(yearData).sort().reverse();
    for (var i = 0; i < yearArr.length; i++) {
        var yNo = yearArr[i];
        if (!selYearCode || selYearCode == -1)
            selYearCode = yNo;

        var option = new Option(yNo + " (" + yearData[yNo]["n"] + ")",yNo);
        if (selYearCode == yNo)
            option.selected = true;
        years.appendChild(option);
    }

    var selSearchTerm = null;

    if (page.search == "Y")
        setYear(selYearCode);
    else if (page.search == "T")
        setChapter(selChapterCode);
    else if (page.search == "S")
        setSearch(selSearchTerm);
}

function populatePapers() {
    var papers = document.formSearch.papers;
    papers.innerHTML = "";
    var paperData = null;
    var selPaperCode = null;
    if (page.search == "Y") {
        paperData = subjectMap[page.subjectCode]["y"][page.yearCode]["m"][page.monthCode]["p"];
        var papArr = Object.keys(paperData).sort();
        for (var i = 0; i < papArr.length; i++) {
            var pNo = papArr[i];
            if (!selPaperCode)
                selPaperCode = pNo;
            papers.appendChild(new Option(pNo + " (" + paperData[pNo]["n"] + ")",pNo));
        }
    } else if (page.search == "T") {
        paperData = subjectMap[page.subjectCode]["c"][page.chapterCode][page.match]["p"];
        for (var pNo in paperData) {
            if (!selPaperCode)
                selPaperCode = pNo;

            papers.appendChild(new Option(pNo + " (" + paperData[pNo] + ")",pNo));
        }
    } else if (page.search == "S") {
        paperData = subjectMap[page.subjectCode]["s"];
        for (var pNo in paperData) {
            if (!selPaperCode)
                selPaperCode = pNo;

            papers.appendChild(new Option(pNo + " (" + paperData[pNo].n + ")",pNo));
        }
    }

    setPaper(selPaperCode);
}
function setPaper(paper) {
    page.paperCode = paper;

    if (page.search == "Y") {
        populateZones();
    } else if (page.search == "T") {
        page.total = subjectMap[page.subjectCode]["c"][page.chapterCode][page.match]["p"][page.paperCode];
        populateOffset();
    }

}

function setMatch(match) {
    page.match = match;
    //loadSubjectsData();
    setSubject(page.subjectCode);
}

function setSearch(selSearchTerm) {
    page.total = 0;
    populatePapers();
    //     populateOffset();
}

function setChapter(chapter) {
    page.chapterCode = chapter;
    page.offset = 0;
    populatePapers();
}

function setYear(year) {
    page.yearCode = year;
    page.offset = 0;
    populateMonths();
}

function setMonth(month) {
    page.monthCode = month;
    populatePapers();
}

function setZone(zone) {
    page.zoneCode = zone;
    page.total = subjectMap[page.subjectCode]["y"][page.yearCode]["m"][page.monthCode]["p"][page.paperCode]["z"][page.zoneCode];

    populateOffset();
}

function populateMonths() {
    var months = document.formSearch.months;
    months.innerHTML = "";
    var selMonth = null;
    if (page.search == "Y") {
        var monthData = subjectMap[page.subjectCode]["y"][page.yearCode]["m"];
        for (var mNo in monthData) {
            if (!selMonth)
                selMonth = mNo;
            months.appendChild(new Option(monthDesc[mNo] + " (" + monthData[mNo]["n"] + ")",mNo));
        }
    }
    setMonth(selMonth);
}

function populateZones() {
    var zones = document.formSearch.zones;
    zones.innerHTML = "";
    var selZone = null;
    if (page.search == "Y") {
        var zoneData = subjectMap[page.subjectCode]["y"][page.yearCode]["m"][page.monthCode]["p"][page.paperCode]["z"];
        for (var zNo in zoneData) {
            if (!selZone)
                selZone = zNo;
            zones.appendChild(new Option(zNo + " (" + zoneData[zNo] + ")",zNo));
        }
    }
    setZone(selZone);

}

function populateOffset() {
    page.offset = 0;
    var offsets = document.formSearch.offsets
    offsets.innerHTML = "";

    var totOffset = Math.ceil(page.total / page.limit);
    var remainder = page.total % page.limit;
    if (remainder == 0)
        remainder = page.limit;
    for (i = 0; i < totOffset; i++) {
        var ind = (i * page.limit);
        var display = (ind + 1) + " - " + (ind + page.limit);

        if (i == (totOffset - 1)) {
            display = (ind + 1) + " - " + (ind + remainder);
        }
        offsets.appendChild(new Option(display,ind));
    }
    setOffset(0);
}

function setOffset(offsetVal) {
    page.offset = offsetVal;

    page.slideIndex = offsetVal + 1;
}

function displayMessage(message) {
    document.getElementById("question-name-id").innerHTML = message;
}

function loadQuestionsReset() {
    popup('id-search-menu');
    popup('id-loading-menu');

    document.getElementById("myPad").innerHTML = "";
    page.list = {};
    page.slideIndex = page.offset + 1;
    document.getElementById("id-answermode-menu").childNodes[0].style.color = "red";
    ;page.answerMode = false;

    imagePool = {};
    document.getElementById("quiz-answer-id").innerHTML = "";
    document.getElementById("quiz-marks-id").innerHTML = "";

    loadQuestions();

}

function getSearchQueryWhere() {
    if (!page.searchTerm)
        return;
    var query = " WHERE  C = '" + page.paperCode + "' AND ";
    if (page.searchTerm.startsWith("\"") && page.searchTerm.endsWith("\"")) {
        return query + "lower(M) contains '" + page.searchTerm.replace(/"/g, "").replace(/ {1,}/g, " ") + "'";
    }

    var strTok = page.searchTerm.split(/ {1,}/);
    for (var i = 0; i < strTok.length; i++) {
        if (i > 0)
            query += " AND ";
        query += " lower(M) contains '" + strTok[i] + "'";
    }

    return query;
}

function loadQuestionsCount() {
    page.searchTerm = document.formSearch.searchTerm.value;
    if (!page.searchTerm) {
        displayMessage("Invalid Search Term ...");
        return;
    }

    page.searchTerm = page.searchTerm.trim().toLowerCase().replace(/'/g, "");

    var qButton = document.formSearch.loadQuestions;
    qButton.disabled = true;
    document.getElementById("id-offset-count-status").innerHTML = "Fetching Count, please wait ...";
    var qString = "SELECT COUNT(M) " + getSearchQueryWhere();

//     var query = new google.visualization.Query('http://spreadsheets.google.com/tq?key=' + ssKey + '&pub=1&sheet=' + page.subjectCode);
//     query.setQuery(qString);
//     console.log("Query: " + qString);
//     query.send(handleQuestionsCountResponse);

    var newQuery = "https://docs.google.com/spreadsheets/d/" + ssKey + "/gviz/tqpub?" + "pub=1&sheet=" + page.subjectCode + "&tq=" + encodeURIComponent(qString);
    console.log("New Query: " + newQuery);
    httpRequest(newQuery, handleQuestionsCountResponse);

}

function handleQuestionsCountResponse(data) {
    var qButton = document.formSearch.loadQuestions;

    if (data == "ERROR") {
        document.getElementById("id-offset-count-status").innerHTML = "Error: " + response.getMessage();
        return;
    }

    var tot = data.table.rows.length;

    if (tot == 0) {
        page.total = 0;
        document.getElementById("id-offset-count-status").innerHTML = "Search returned NO results !";
    } else {
        qButton.disabled = false;
        page.total = data.table.rows[0].c[0].v;
        document.getElementById("id-offset-count-status").innerHTML = page.total + " records found, click Load Questions button";
        populateOffset();
    }

}

function loadQuestions() {

    displayMessage("Loading ...");

    if (page.subjectCode == "-1" || (page.chapterCode == -1 && page.yearCode == -1) || page.offset == -1) {
        displayMessage("Select Options");
        return;
    }

    var user = gapi.auth2.getAuthInstance().currentUser.get();
    var oauthToken = user.getAuthResponse().access_token;
    var access_token = encodeURIComponent(oauthToken);

    var query = new google.visualization.Query('http://spreadsheets.google.com/tq?access_token=' + access_token + '&key=' + ssKey + '&pub=1&sheet=' + page.subjectCode);
    // Apply query language.

    var qString = "SELECT * WHERE  C = '" + page.paperCode;

    var orderBy = "";
    if (page.search == "Y") {
        qString = qString + "' AND B = " + page.yearCode + " AND lower(Q) = '" + page.monthCode.toLowerCase() + "' AND D = '" + page.zoneCode + "'";
        orderBy = " ORDER BY B,Q,C,D LIMIT ";
    } else if (page.search == "T") {
        if (page.match == "m")
            qString = qString + "' AND (F = '" + page.chapterCode + "' OR G = '" + page.chapterCode + "')";
        else if (page.match == "m0")
            qString = qString + "' AND F = '" + page.chapterCode + "' ";
        else if (page.match == "m1")
            qString = qString + "' AND G = '" + page.chapterCode + "' ";

        orderBy = " ORDER BY B DESC LIMIT ";

    } else if (page.search == "S") {
        orderBy = " ORDER BY B DESC LIMIT ";
        qString = "SELECT * " + getSearchQueryWhere();
    }

    qString = qString + orderBy + page.limit + " OFFSET " + page.offset;

    query.setQuery(qString);

    var newQuery = "https://docs.google.com/spreadsheets/d/" + ssKey + "/gviz/tqpub?" + "pub=1&sheet=" + page.subjectCode + "&tq=" + encodeURIComponent(qString);
    console.log("New Query: " + newQuery);
    httpRequest(newQuery, handleQuestionsResponse);

    // Send the query with a callback function.
    //query.send(handleQuestionsResponse);

}

function getDriveImageLink(id) {
    var request = gapi.client.drive.files.get({
        fileId: id,
        'fields': "id, thumbnailLink"
    })
    request.then(function(response) {
        // console.log("Yov Yov: "+response.result.webViewLink);

        var image = new Image();
        image.id = id;
        image.src = response.result.thumbnailLink.replace("=s220", "");

        imagePool[id] = {
            "image": image,
            "status": "pending"
        };

        image.onload = function() {
            // console.log("webContentLink Loaded: "+image.src);

            imagePool[this.id].status = "done";
            var fp = imagePool["firstPage"];
            if (fp[this.id] == 0) {
                delete fp[this.id];
                if (Object.keys(fp).length == 0) {
                    //console.log("First Page Images Loaded !");
                    //page.slideIndex = 1;
                    if (Object.keys(page.list).length <= page.limit) {
                        console.log("Displaying very first image ...");
                        showDivs(page.slideIndex);
                        popup('id-loading-menu');
                    }

                }
            }

        }

        image.onerror = function() {
            imagePool[this.id].status = "error";
            displayMessage("Unable to download");
            console.log("Unable to download: " + image.src);
        }

    }, function(error) {
        console.error(error);
    })
    return request;
}

function loadDrivePageImages(pages, index) {

    var pageArr = [];
    if (pages != null) {
        pages = pages.split(",");
        for (var j = 0; j < pages.length; j++) {
            var id = pages[j].trim();
            if (id != null && id.length > 0 && id != "undefined") {
                pageArr.push({
                    "id": id
                });

                // Store First Questio Index, so that page can be loaded without waiting for other images.
                if (index == 0) {
                    if (imagePool["firstPage"] == undefined)
                        imagePool["firstPage"] = {};
                    imagePool["firstPage"][id] = 0;
                }
                getDriveImageLink(id);

            }

        }

    }
    return pageArr;
}

function loadPageImages(pages, index) {
    var pageArr = [];
    if (pages != null) {
        pages = pages.split(",");
        for (var j = 0; j < pages.length; j++) {
            var id = pages[j].trim();
            if (id != null && id.length > 0 && id != "undefined") {
                pageArr.push({
                    "id": id
                });

                var image = new Image();
                // image.src = driveURL + id;
                image.src = thumbURL + id;

                image.id = id;

                // This is to avoid "Tainted "Tainted canvases may not be exported" during PDF export
                //image.crossOrigin="anonymous";

                imagePool[id] = {
                    "image": image,
                    "status": "pending",
                    "index": index + page.offset
                };

                // Store First Question Index, so that page can be loaded without waiting for other images.
                if (index == 0) {
                    if (imagePool["firstPage"] == undefined)
                        imagePool["firstPage"] = {};
                    imagePool["firstPage"][id] = 0;
                }

                image.onload = function() {
                    imagePool[this.id].status = "done";
                    updateCanvas(imagePool[this.id].index);

                    var fp = imagePool["firstPage"];
                    if (fp[this.id] == 0) {
                        delete fp[this.id];
                        if (Object.keys(fp).length == 0) {
                            //console.log("First Page Images Loaded !");
                            //page.slideIndex = 1;
                            if (Object.keys(page.list).length <= page.limit) {
                                console.log("Displaying very first image ...");
                                showDivs(page.slideIndex);
                                popup('id-loading-menu');
                            }

                        }
                    }
                }
                ;

                image.onerror = function() {
                    imagePool[this.id].status = "error";
                    displayMessage("Unable to download");
                    console.log('Unable to load Image' + this.id);
                    var myPad = page.list[index].draw.question;
                    var status = myPad.children[0];
                    status.innerHTML = "Error in downloding question: " + this.id;

                }
                ;

            }
        }
    }
    return pageArr;
}

function httpRequest(urlString, callback) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var response = xhttp.responseText
            var data = JSON.parse(response.substring(response.indexOf('{'), response.lastIndexOf('}')+1));
            callback(data);
        } else {
            //callback("ERROR");
        }
    }
    ;
    xhttp.open("GET", urlString, true);
    xhttp.send();

}

function handleQuestionsResponse(data) {
    page.loading = false;
    if (data == "ERROR") {
        // alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        displayMessage(response.getDetailedMessage());
        return;
    }

    var offsets = document.formSearch.offsets, yearOffsets = document.formSearch.offsets;
    offsets.value = offset,
    yearOffsets.value = offset;
    
    var tot = data.table.rows.length;
    var questionHTML = "";

    var stInd = page.offset;
    page["subTotal"] = stInd + tot;

    var colArr = ["code", "Y", "paper", "zone", "isMCQ", "m0", "m1", "questionNo", "questionName", "questionPages", "answer", "answerPages", "keyWords", "qpIds", "msIds", "othersIds", "month"];
    for (var i = 0; i < tot; i++) {
        var colIndx = 0;
        var record = {};

        for(var j=0; j<colArr.length; j++) {
            if(data.table.rows[i].c[j] == null) continue;
            record[colArr[j]] = data.table.rows[i].c[j].v;

            if(colArr[j] == "questionName") {
                if (record["questionName"] && curriculum == "IB") record["questionName"] = record["questionName"].replace(/_/gmi, "/");
            }

        }

        page.list[stInd + i] = {
            "data": {},
            "draw": {
                "question": createPad("sketchpad" + (i + page.offset))
            }
        };


        record["questionPages"] = loadPageImages(record["questionPages"], i);
        record["answerPages"] = loadPageImages(record["answerPages"], i);

        page.list[stInd + i]["data"] = record;

    }



}

function createPad(id) {

    var myPad = document.getElementById("myPad");
    var pad = document.createElement("div");
    pad.id = id;
    myPad.appendChild(pad);

    var status = document.createElement("div");
    status.id = id + "-status";
    status.style.color = "red";
    status.innerHTML = "Loading ...";

    var canvas = document.createElement('canvas');
    canvas.id = id + "-canvas";
    canvas.className = "sketchpad";
    canvas.style.float = "left";
    canvas.style.maxWidth = "100%";
    canvas.height = 0;

    var ctx = null;
    if (canvas.getContext)
        ctx = canvas.getContext('2d');

    // Maintain the same Order
    pad.appendChild(status);
    pad.appendChild(canvas);
    pad.style.display = "none";

    return pad;
}

function updateCanvas(index) {
    var yPos = 0;
    var type = "questionPages";

    // type: questionPages or answerPages
    var images = page.list[index].data[type];
    var maxWidth = 0
      , maxHeight = 0;

    var myPad = page.list[index].draw.question;
    var canvas = myPad.children[1];
    var ctx = canvas.getContext('2d');
    var status = myPad.children[0];

    // Double Look is required, the CANVAS can't take height adjustment, first calculate height and add all images.
    for (var i = 0; i < images.length; i++) {
        var image = imagePool[images[i].id].image;

        if (!isImgOk(image)) {
            //             console.log(image.id+": Not loaded");
            return;
        }

        status.style.display = "none";

        if (maxWidth < image.naturalWidth)
            maxWidth = image.naturalWidth;
        maxHeight += image.naturalHeight;
    }

    if (maxWidth < window.innerWidth)
        maxWidth = window.innerWidth;

    if (maxHeight < window.innerHeight)
        maxHeight = window.innerHeight - 50;

    canvas.height = maxHeight;
    canvas.width = maxWidth;

    for (var i = 0; i < images.length; i++) {
        var image = imagePool[images[i].id].image;

        ctx.drawImage(image, 0, yPos);
        yPos = yPos + parseInt(image.naturalHeight);
    }

    myPad.scrollTop = 0;
    window.scrollTo(0, 0);

    var hFact = canvas.clientHeight / maxHeight;
    var pageData = page.list[page.slideIndex - 1].data;
    displaySubQs(pageData.subQs, hFact);

}

function loadSubjectsData() {
    var subjects = Object.keys(subjectMap).sort();
    document.formSearch.subjects.innerHTML = "";

    for (i = 0; i < subjects.length; i++) {
        var key = subjects[i];
        var obj = subjectMap[key];
        var dN = obj["d"] + " (" + obj["n"] + " questions)";
        document.formSearch.subjects.appendChild(new Option(dN,key));
    }
    if (page.subjectCode == -1)
        page.subjectCode = subjects[0];
    setSubject(page.subjectCode);

}

function loadData() {
    loadSubjectsData();
    popup("id-search-menu");

    initDrag();

}

function updateAnswerPanel() {
    var images = page.list[page.slideIndex - 1].data["answerPages"];
    var answerPanel = document.getElementById("answer-panel");
    answerPanel.innerHTML = "";

    for (var i = 0; i < images.length; i++) {
        var image = imagePool[images[i].id].image;
        image.style.maxWidth = "100%";
        image.style.marginLeft = "0px";

        answerPanel.appendChild(image);
    }
}

function showHideAnswer(force) {
    var answerPanel = document.getElementById("answer-panel");
    var showAnswerId = document.getElementById("show-answer-id");

    if (force || answerPanel.style.display === "block") {
        answerPanel.style.display = "none";
        showAnswerId.style.backgroundColor = "green";
        // $('[data-role="popover"]').popover('hide');
    } else {
        answerPanel.style.display = "block";
        showAnswerId.style.backgroundColor = "red";
        // $('[data-role="popover"]').popover('show');

    }
}

function isImgOk(img) {
    if (!img.complete)
        return false;
    if (img.naturalWidth === 0)
        return false;

    // No other way of checking: assume it’s ok.
    return true;
}

function resizeObjects() {
    repositionControlBar();
}

function kill(type) {
    window.document.body.addEventListener(type, function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, true);
}

// SKETCHPAD code starts here

// Variables for referencing the canvas and 2dcanvas context
var canvas, ctx, myPad;

// Variables to keep track of the mouse position and left-button status 
var mouseX, mouseY, mouseDown = 0;

// Variables to keep track of the touch position
var touchX, touchY;

// Keep track of the old/last position when drawing a line
// We set it to -1 at the start to indicate that we don't have a good value for it yet
var lastX, lastY = -1;

var thickness = 1;

// Set-up the canvas and add our event handlers after the page has loaded
function initPad(myPad) {

    this.myPad = myPad;
    myPad.style = "max-height: " + (screen.height - 50) + "px;";
    this.canvas = myPad.children[1];

    if (this.canvas.getContext)
        this.ctx = canvas.getContext('2d');

    if (page.stylus)
        addTouchListeners();
}

function addTouchListeners() {
    if (ctx) {
        // React to mouse events on the canvas, and mouseup on the entire document
        canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
        canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
        window.addEventListener('mouseup', sketchpad_mouseUp, false);

        // React to touch events on the canvas
        canvas.addEventListener('touchstart', sketchpad_touchStart, false);
        canvas.addEventListener('touchend', sketchpad_touchEnd, false);
        canvas.addEventListener('touchmove', sketchpad_touchMove, false);
    }
}

function removeTouchListeners() {
    if (ctx) {
        // React to mouse events on the canvas, and mouseup on the entire document
        canvas.removeEventListener('mousedown', sketchpad_mouseDown, false);
        canvas.removeEventListener('mousemove', sketchpad_mouseMove, false);
        window.removeEventListener('mouseup', sketchpad_mouseUp, false);

        // React to touch events on the canvas
        canvas.removeEventListener('touchstart', sketchpad_touchStart, false);
        canvas.removeEventListener('touchend', sketchpad_touchEnd, false);
        canvas.removeEventListener('touchmove', sketchpad_touchMove, false);

    }

}

// Draws a line between the specified position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawLine(ctx, x, y, size) {

    // If lastX is not set, set lastX and lastY to the current position 
    // if (lastX==-1) {
    if (lastX == -1 || Math.abs(lastX - x) > 100) {
        lastX = x;
        lastY = y;
    }

    // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
    r = 255;
    g = 0;
    b = 0;
    a = 255;

    // Select a fill style
    ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";

    // Set the line "cap" style to round, so lines at different angles can join into each other
    ctx.lineCap = "round";
    //ctx.lineJoin = "round";

    // Draw a filled line
    ctx.beginPath();

    // First, move to the old (previous) position
    // ctx.moveTo(lastX,lastY);

    ctx.moveTo(lastX / (canvas.clientWidth / canvas.width), lastY / (canvas.clientHeight / canvas.height));

    // Now draw a line to the current touch/pointer position
    // ctx.lineTo(x,y);
    ctx.lineTo(x / (canvas.clientWidth / canvas.width), y / (canvas.clientHeight / canvas.height));

    // Set the line thickness and draw the line
    ctx.lineWidth = size;
    ctx.stroke();

    ctx.closePath();

    // Update the last position to reference the current position
    lastX = x;
    lastY = y;
}

// Clear the canvas context using the canvas width and height
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCanvas(page.slideIndex - 1);
}

// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown() {
    mouseDown = 1;
    drawLine(ctx, mouseX, mouseY, thickness);
}

// Keep track of the mouse button being released
function sketchpad_mouseUp() {
    mouseDown = 0;

    // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
    lastX = -1;
    lastY = -1;
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) {
    // Update the mouse co-ordinates when moved
    getMousePos(e);

    // Draw a dot if the mouse button is currently being pressed
    if (mouseDown == 1) {
        drawLine(ctx, mouseX, mouseY, thickness);
    }
}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
    if (!e)
        var e = event;

    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    } else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

}

// Draw something when a touch start is detected
function sketchpad_touchStart() {
    // Update the touch co-ordinates
    getTouchPos();

    drawLine(ctx, touchX, touchY, thickness);

    // Prevents an additional mousedown event being triggered
    event.preventDefault();
}

function sketchpad_touchEnd() {
    // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
    lastX = -1;
    lastY = -1;
}

// Draw something and prevent the default scrolling when touch movement is detected
function sketchpad_touchMove(e) {
    // Update the touch co-ordinates
    getTouchPos(e);

    // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
    drawLine(ctx, touchX, touchY, thickness);

    // Prevent a scrolling action as a result of this touchmove triggering.
    event.preventDefault();
}

// Get the touch position relative to the top-left of the canvas
// When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
// but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
// "target.offsetTop" to get the correct values in relation to the top left of the canvas.
function getTouchPos(e) {
    if (!e)
        var e = event;

    if (e.touches) {
        if (e.touches.length == 1) {
            // Only deal with one finger
            var touch = e.touches[0];
            // Get the information for finger #1
            touchX = touch.pageX - touch.target.offsetLeft + myPad.scrollLeft;
            touchY = touch.pageY - touch.target.offsetTop + myPad.scrollTop;
        }
    }
}

var pos1 = 0
  , pos2 = 0
  , pos3 = 0
  , pos4 = 0;
var elmnt = null;

function initDrag() {
    pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
    elmnt = document.getElementById("controlbar");
    //Make the DIV element draggagle:
    dragElement(document.getElementById("controlbar"));

}

function dragTouchStart(e) {

    e = e || window.event;
    //e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.touches[0].clientX;
    pos4 = e.touches[0].clientY;

}

function closeTouchElement() {
    document.ontouchend = null;
    document.ontouchmove = null;
}

function elementTouchDrag(e) {

    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.touches[0].clientX;
    pos2 = pos4 - e.touches[0].clientY;

    if ((pos1 >= -5 && pos1 <= 5) || (pos2 >= -5 && pos2 <= 5)) {
        return;
    }

    // This is absolutely important, preventing mild shakes with Apple Pencil
    e.preventDefault();

    pos3 = e.touches[0].clientX;
    pos4 = e.touches[0].clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
}

//Make the DIV element draggagle:
dragElement(document.getElementById("controlbar"));

function dragElement(elmnt) {
    var pos1 = 0
      , pos2 = 0
      , pos3 = 0
      , pos4 = 0;
    elmnt = document.getElementById("controlbar");

    if (elmnt) {
        elmnt.onmousedown = dragMouseDown;
        elmnt.ontouchstart = dragTouchStart;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
