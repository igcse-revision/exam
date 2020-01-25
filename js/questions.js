

var driveURL = 'https://docs.google.com/uc?id=';
var thumbURL = 'https://drive.google.com/thumbnail?authuser=0&sz=w1024&id=';

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
    "searchTerm":null,
    "list": {}
};

var mcqa = document.getElementById("mcq-A");
var mcqb = document.getElementById("mcq-B");
var mcqc = document.getElementById("mcq-C");
var mcqd = document.getElementById("mcq-D");

var subQSel = {};

var popoversettings = {
    trigger: 'click',
    html: true,
    title: function() {
        var id = $(this).attr("id");
        var opt = subQSel[id].option;
        var wCheck = ""
          , aCheck = ""
          , rCheck = "";
        if (opt == "w")
            wCheck = "checked";
        else if (opt == "a")
            aCheck = "checked";
        else
            rCheck = "checked";
        // var title = id+")"+
        var title = "<input id='" + id + "_w' type='radio' name='show' value='w' " + wCheck + " onclick='showOption(\"" + id + "\", \"w\");'> Write" + "<input id='" + id + "_a' type='radio' name='show' value='a' " + aCheck + " onclick='showOption(\"" + id + "\", \"a\");'> Answer" + "<input id='" + id + "_r' type='radio' name='show' value='r' " + rCheck + " onclick='showOption(\"" + id + "\", \"r\");'> Report";

        return title;
    },
    content: function() {
        var id = $(this).attr("id");
        var opt = subQSel[id].option;
        $("#" + id + "_" + opt).prop("checked", true);
        return subQSel[id][opt];
    },
    container: 'body',
    placement: 'right'

};


function popup(srcId, action) {
    var popObj = document.getElementById(srcId+"-popup");
      if(!popObj) return;

      if(srcId == "id-search-menu" && !siteAccess) {
          checkPermission();
          return;
      }

      var display = "none";
      if(action == "open" ) {
        display = "block";
      } else if(action == "close") {
          display = "none"
      } else {
          if (popObj.style.display != "block") display = "block";
          else display = "none";
      }
    
      popObj.style.display = display;
}

function toggleAnswerMode() {

    var qData = page.list[page.slideIndex-1].data;
    var isMCQ = qData.isMCQ;
    if(!isMCQ) return;
    if(page.answerMode && qData["mark"] != null) return;

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

    var childNode = src.childNodes[0]
    if (page.stylus) {
        removeTouchListeners();
        page.stylus = false;
        childNode.style.color = "white";
    } else {
        addTouchListeners();
        childNode.style.color = "red";
        page.stylus = true;
    }
}

window.onclick = function(event) {
  var src = event.target;
  if(src == null) return;
  if(src.id.endsWith("-popup")) {
    src.style.display = "none";
  }
}

function keyPressedIgnore(event) {
    //event.preventDefault();
    event.stopPropagation();
}

function keyPressed(event) {
    var keyCode = event.which || event.keyCode;
    
     switch ( keyCode )
    {

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
        ques = keyCode-48;
        if(ques == 0) ques = 10;
        console.log("Display: "+ques);
        plusDivs(ques-page.slideIndex);
        break;

      // CTRL + Enter for submitAns
      case 10:
        toggleAnswerMode();
        break;
      
      // question Mark or "/"
      case 63:
      case 47:
        var isMCQ = page.list[page.slideIndex-1].data.isMCQ;
        if(isMCQ || isMCQ == "TRUE" || isMCQ == "true") {
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
    if (!ques) return;

    ques.data["selected"] = value;
    
    if(page.answerMode) {
        // If answer mode, marking is allowed only once
        if(ques.data["mark"] == null) {
            if(ques.data["answer"] == value) ques.data["mark"] = 1;
            else ques.data["mark"] = 0;
        }
    } else {
        if(ques.data["answer"] == value) ques.data["mark"] = 1;
        else ques.data["mark"] = 0;
    }

    
    // Do not provide change answer option on answer mode
    // if(!ques.data["selected"]) {
    //     ques.data["selected"] = value;
    // } else if(!page.answerMode) {
    //     ques.data["selected"] = value;
    // }
    
    var d = document.getElementById("quiz-"+page.slideIndex);
    
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
    var ind = page.slideIndex+n;
    if( ind > page.total || ind <= 0) return;
    page.slideIndex = ind;
    //console.log("Page Subtotal: " + page.subTotal + ", Slide Index: " + page.slideIndex);

    if(n == 1) {
        // This represents next button
        if ((page.slideIndex + 5) > page.subTotal && page.subTotal < page.total && !page.loading) {
            if(!loadNext(page.offset += page.limit)) page.slideIndex -= 1;
        }

    } else {
         var curRecord = page.list[page.subTotal-5];
        // This is left arrow
        if( !curRecord && (page.slideIndex < page.subTotal && page.subTotal-5 < page.slideIndex) && page.subTotal-page.limit > 0 && !page.loading) {
            if (!loadNext(page.offset -= page.limit)) page.slideIndex += 1;
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
        
        if(nodeId.endsWith("-"+selected)) {
            node.style.backgroundColor = "#862c97";
        
            if(page.answerMode) {
                if(nodeId.endsWith("-"+answer)) {
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

function showDivs(n) {


    if (!page.list || !page.list[page.slideIndex - 1]) {
        displayMessage("No Records !");
        return;
    }

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
        if(chapName.length > 50 ) chapName = chapName.substring(0,50)+" ... ";

    } else {
        chapName = pageData["m0"] + ". " + subjectMap[page.subjectCode]["c"][pageData["m0"]].d;

        chapName = chapName.substring(0,35)+" ... " + "/" + pageData["m1"]+ ". "+subjectMap[page.subjectCode]["c"][pageData["m1"]].d.substring(0,10)+" ... ";

    }
    document.getElementById("subject-name-id").innerHTML = chapName;

    displayMessage(pageData.questionName);
    displayPaperLinks();
    updateCanvas("questionPages");
}

function updateQuizPanel(quizElement) {
    var midPoint = parseInt(page.limit/2);
    var totMarks = document.getElementById("quiz-marks-id");
    var marks = 0;
    
    var d = document.getElementById("quiz-"+page.slideIndex);
    if(d == null) {
        d = document.createElement("div");
        d.setAttribute("id", "quiz-"+page.slideIndex);
        d.innerHTML = page.slideIndex;
        d.setAttribute('class', 'answer');
        quizElement.appendChild(d);
        midPoint = page.limit;
    }
    
    var len = quizElement.childNodes.length;
    
    for(var i=0; i<len; i++) {
        var el = quizElement.childNodes[i];
        el.classList.remove("red");
        el.classList.remove("blue");
        el.classList.remove("green");
        var sty = "none";
        if(el.id) {

           var ind = /quiz-(\d*)/g.exec(el.id);
            if(ind) ind = parseInt(ind[1]);

            var pData = page.list[ind-1].data;
            var wtMark = page.list[ind-1].data["mark"];
            
            if(wtMark == 0) wtMark = negativePoint;
            else wtMark*= positivePoint;
            
            if(page.list[ind-1].data["mark"] != null) marks+= wtMark;

           if(pData.selected != null) {
               el.setAttribute("class", "answer selected");
           }
            
            if(ind == page.slideIndex) {
                el.setAttribute("class", "answer blue");
                //el.style.border = "2px solid red;"
            }
            
            if(page.answerMode) {
                if(page.list[ind-1].data["mark"] == 1) {
                    el.setAttribute("class", "answer green");
                } else if(page.list[ind-1].data["mark"] == 0) {
                    el.setAttribute("class", "answer red");
                }
            }
            if( (len < page.limit) || (Math.abs(page.slideIndex - ind) < midPoint) ) sty = "inline-block";
        }
        el.style.display = sty;
    }
    
    if(page.answerMode) {
        if(pData["mark"] != null) {
            if(curriculum == "IB" || curriculum == "IG") {
                totMarks.innerHTML = Math.round((marks/len)*100) + "%";
            } else {
                totMarks.innerHTML = marks + "/" +(len * positivePoint);
            }
        }
    } else {
        totMarks.innerHTML = "";
    }

}

// This can be null or "qp" or "ms"
function displayPaperLinks(openWin) {
    var pageData = page.list[page.slideIndex - 1].data;

    var qlinks = "", mlinks = "", olinks = "";

    var qpIds = pageData.qpIds;
    if(qpIds != null) {
        qpIds = qpIds.split(",");
        for(var i=0; i<qpIds.length;i++) {
            if(qpIds[i] != null && qpIds[i] !== "") {
                if(openWin == "qp") window.open(driveURL+qpIds[i]);
                var seq = "";
                if(i > 0 ) seq = (i+1);
                qlinks = qlinks + "<a target=_ href='" + driveURL+qpIds[i]+"' > QP "+seq+"</a>";
                
                // I want only the first item now for space constraint
                break;
            }
        }
        
    }

    var msIds = pageData.msIds;
    if(msIds != null) {
        msIds = msIds.split(",");
        for(var i=0; i<msIds.length;i++) {
            if(msIds[i] != null && msIds[i] !== "") {
                var seq = "";
                if(openWin == "ms") window.open(driveURL+msIds[i]);
                if(i > 0 ) seq = (i+1);
                mlinks = mlinks + "<a target=_ href='" + driveURL+msIds[i]+"' > MS "+seq+"</a>";
                
                // I want only the first item now for space constraint
                break;
            }
        }
        

    }

    var othersIds = pageData.othersIds;
    if(othersIds != null) {
        othersIds = othersIds.split(",");
        for(var i=0; i<othersIds.length;i++) {
            if(othersIds[i] != null && othersIds[i] !== "") {
                var seq = "";
                if(i > 0 ) seq = (i+1);
                olinks = olinks + "<a target=_ href='" + driveURL+othersIds[i]+"' > OTHER "+seq+"</a>";
            }
        }

    }

    document.getElementById("qp-papers-id").innerHTML = qlinks;
    document.getElementById("ms-papers-id").innerHTML = mlinks;
    document.getElementById("ot-papers-id").innerHTML = olinks;

    document.getElementById("total-questions-id").innerHTML = (page.slideIndex) + " / " + page.total;

}

function displaySubQs(subQsStr, imgHFactor) {

    $('[data-role="popover"]').popover('hide');

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
    $('[data-role="popover"]').popover(popoversettings);

}

function showOption(qid, opt) {
    subQSel[qid].option = opt;
    $("#" + qid + "_" + opt).prop("checked", true);
    $('[id="' + qid + '"]').popover('show');
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
            if (!selChapterCode || selChapterCode == -1) selChapterCode = chNo;
            var obj = chapData[chNo];
            if (obj[page.match] && obj[page.match]["n"] > 0) {
                var option = new Option(chNo + ' - ' + obj["d"] + " (" + obj[page.match]["n"] + ")",chNo);
                if(selChapterCode == chNo) option.selected = true;
                chapters.appendChild(option);
            }
                
        }
    }

    var selYearCode = page.yearCode;
    var years = document.formSearch.years;
    years.innerHTML = "";
    var yearData = subjectMap[page.subjectCode]["y"];
    var yearArr = Object.keys(yearData).sort().reverse();
    for (var i=0; i<yearArr.length; i++) {
        var yNo = yearArr[i];
        if (!selYearCode || selYearCode == -1) selYearCode = yNo;

        var option = new Option(yNo + " (" + yearData[yNo]["n"] + ")",yNo);
        if(selYearCode == yNo) option.selected = true;
        years.appendChild(option);
    }

    var selSearchTerm = null;

    if (page.search == "Y")
        setYear(selYearCode);
    else if(page.search == "T")
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
        for (var i=0; i< papArr.length; i++) {
            var pNo = papArr[i];
            if (!selPaperCode)
                selPaperCode = pNo;
                papers.appendChild(new Option(pNo + " (" + paperData[pNo]["n"] + ")",pNo));
        }
    } else {
        paperData = subjectMap[page.subjectCode]["c"][page.chapterCode][page.match]["p"];
        for (var pNo in paperData) {
            if (!selPaperCode) selPaperCode = pNo;

            papers.appendChild(new Option(pNo + " (" + paperData[pNo] + ")",pNo));
        }
    }

    setPaper(selPaperCode);
}
function setPaper(paper) {
    page.paperCode = paper;

    if (page.search == "Y") {
        populateZones();
    }
    else if(page.search == "T") {
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
    populateOffset();
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
            if(!selMonth) selMonth = mNo;
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
            if(!selZone) selZone = zNo;
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
    
    page.list = {};
    page.slideIndex = page.offset + 1;
    document.getElementById("id-answermode-menu").childNodes[0].style.color = "red";;
    page.answerMode = false;

    imagePool = {};
    document.getElementById("quiz-answer-id").innerHTML = "";
    document.getElementById("quiz-marks-id").innerHTML = "";

    loadQuestions();
    
}

function getSearchQueryWhere() {
    if(!page.searchTerm) return;
    var query = " WHERE ";
    if(page.searchTerm.startsWith("\"") && page.searchTerm.endsWith("\"")) {
        return query+"lower(M) contains '" + page.searchTerm.replace(/"/g,"").replace(/ {1,}/g," ")+"'";
    }

    var strTok = page.searchTerm.split(/ {1,}/);
    for(var i=0; i<strTok.length; i++) {
        if(i > 0) query+=" AND ";
        query+=" lower(M) contains '"+strTok[i]+"'";
    }

    return query;
}

function loadQuestionsCount() {
    page.searchTerm = document.formSearch.searchTerm.value;
    if(!page.searchTerm) {
        displayMessage("Invalid Search Term ...");
        return;
    }

    page.searchTerm = page.searchTerm.trim().toLowerCase().replace(/'/g,"");

    var qButton = document.formSearch.loadQuestions;
    qButton.disabled = true;
    document.getElementById("id-offset-count-status").innerHTML = "Fetching Count, please wait ...";

    var query = new google.visualization.Query('http://spreadsheets.google.com/tq?key=' + ssKey + '&pub=1&sheet=' + page.subjectCode);
    var qString = "SELECT COUNT(M) "+getSearchQueryWhere();

    query.setQuery(qString);
    console.log("Query: " + qString);

    // Send the query with a callback function.
    query.send(handleQuestionsCountResponse);
}

function handleQuestionsCountResponse(response) {
    var qButton = document.formSearch.loadQuestions;
    var data = response.getDataTable();

    if(response.isError()) {
        document.getElementById("id-offset-count-status").innerHTML = "Error: "+response.getMessage();
        return;        
    }
    if(data.getNumberOfRows() == 0) {
        page.total = 0;
        document.getElementById("id-offset-count-status").innerHTML = "Search returned NO results !";
    } else {
        qButton.disabled = false;
        page.total = data.getValue(0,0);
        document.getElementById("id-offset-count-status").innerHTML = page.total+" records found, click Load Questions button";
        populateOffset();
    }

}

function loadQuestions() {

    displayMessage("Loading ...");

    if (page.subjectCode == "-1" || (page.chapterCode == -1 && page.yearCode == -1) || page.offset == -1) {
        displayMessage("Select Options");
        return;
    }

    var query = new google.visualization.Query('http://spreadsheets.google.com/tq?key=' + ssKey + '&pub=1&sheet=' + page.subjectCode);
    // Apply query language.

    var qString = "SELECT * WHERE  C = '" + page.paperCode;

    var orderBy = "";
    if (page.search == "Y") {
        qString = qString + "' AND B = " + page.yearCode + " AND Q = '" + page.monthCode + "' AND D = '" + page.zoneCode+"'";
        orderBy = " ORDER BY B,Q,C,D LIMIT ";
    } else  if (page.search == "T") {
        if (page.match == "m")
            qString = qString + "' AND (F = '" + page.chapterCode + "' OR G = '" + page.chapterCode + "')";
        else if (page.match == "m0")
            qString = qString + "' AND F = '" + page.chapterCode + "' ";
        else if (page.match == "m1")
            qString = qString + "' AND G = '" + page.chapterCode + "' ";

        orderBy = " ORDER BY B DESC LIMIT ";

   } else  if (page.search == "S") {
       orderBy = " ORDER BY B DESC LIMIT ";
       qString = "SELECT * "+getSearchQueryWhere();
   }



    qString = qString + orderBy + page.limit + " OFFSET " + page.offset;

    query.setQuery(qString);
    console.log("Query: " + qString);

    // Send the query with a callback function.
    query.send(handleQuestionsResponse);

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
                console.log("Unable to download: "+image.src);
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
                    "status": "pending"
                };

                // Store First Questio Index, so that page can be loaded without waiting for other images.
                if (index == 0) {
                    if (imagePool["firstPage"] == undefined)
                        imagePool["firstPage"] = {};
                    imagePool["firstPage"][id] = 0;
                }

                image.onload = function() {
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
                ;

                image.onerror = function() {
                    imagePool[this.id].status = "error";
                    displayMessage("Unable to download");
                    console.log('Unable to load Image' + this.id);
                }
                ;

            }
        }
    }
    return pageArr;
}


function handleQuestionsResponse(response) {
    page.loading = false;
    if (response.isError()) {
        // alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        displayMessage(response.getDetailedMessage());
        return;
    }

    var offsets = document.formSearch.offsets, yearOffsets = document.formSearch.offsets;
    offsets.value = offset,
    yearOffsets.value = offset;

    var data = response.getDataTable();
    //imagePool = {};
    var questionHTML = "";
    //page.list = {};

    var stInd = page.offset;
    page["subTotal"] = stInd + data.getNumberOfRows();
    var tot = data.getNumberOfRows();
    for (var i = 0; i < tot; i++) {
        var record = {};
        record["code"] = data.getValue(i, 0);
        record["Y"] = data.getValue(i, 1);
        record["paper"] = data.getValue(i, 2);
        record["zone"] = data.getValue(i, 3);
        record["isMCQ"] = data.getValue(i, 4);
        record["m0"] = data.getValue(i, 5);
        record["m1"] = data.getValue(i, 6);
        record["questionNo"] = data.getValue(i, 7);
        record["questionName"] = data.getValue(i, 8);
        if(record["questionName"] && curriculum == "IB") record["questionName"] = record["questionName"].replace(/_/gmi, "/");
        
        var questionPages = data.getValue(i, 9);
        record["answer"] = data.getValue(i, 10);
        record["mark"] = null;
        var answerPages = data.getValue(i, 11);
        record["subQs"] = data.getValue(i, 12);

        record["qpIds"] = data.getValue(i, 13);
        record["msIds"] = data.getValue(i, 14);
        record["othersIds"] = data.getValue(i, 15);

        // record["questionPages"] = loadDrivePageImages(questionPages, i);
        // record["answerPages"] = loadDrivePageImages(answerPages, i);

        record["questionPages"] = loadPageImages(questionPages, i);
        record["answerPages"] = loadPageImages(answerPages, i);
        

        page.list[stInd + i] = {
            "data": {},
            "draw": {
                "question": createCanvas("sketchpad" + i),
                "answer": createCanvas("sketchpad-answer" + i)
            }
        };
        page.list[stInd + i]["data"] = record;
    }

    //   if(page.subTotal > 0) {
    //       page.slideIndex = 1;
    //   } else {
    //     displayMessage("No data found !");
    //   }

}

function createCanvas(id) {
    var canvas = document.createElement('canvas');

    canvas.id = id;
    canvas.className = "sketchpad";
    canvas.style.float = "left";
    canvas.style.maxWidth = "100%";
    canvas.height = 0;

    var ctx = null;
    if (canvas.getContext)
        ctx = canvas.getContext('2d');
    return {
        "canvas": canvas,
        "ctx": ctx
    };
}

function updateCanvas(type) {
    var yPos = 0;

    // type: questionPages or answerPages
    var images = page.list[page.slideIndex - 1].data[type];
    var maxWidth = 0
      , maxHeight = 0;
    //if(canvas) canvas.remove();
    var canvas = page.list[page.slideIndex - 1].draw.question.canvas;
    var ctx = page.list[page.slideIndex - 1].draw.question.ctx;

    initCanvas(canvas, ctx);
    myPad.appendChild(canvas);

    // Double Look is required, the CANVAS can't take height adjustment, first calculate height and add all images.
    for (var i = 0; i < images.length; i++) {
        var image = imagePool[images[i].id].image;
        if (maxWidth < image.naturalWidth)
            maxWidth = image.naturalWidth;
        maxHeight += image.naturalHeight;
    }

    if (maxWidth < window.innerWidth)
        maxWidth = window.innerWidth;
    if (maxHeight < window.innerHeight)
        maxHeight = window.innerHeight;

    canvas.height = maxHeight;
    canvas.width = maxWidth;

    for (var i = 0; i < images.length; i++) {
        var image = imagePool[images[i].id].image;
        if(!isImgOk(image)) {
            console.log("Image not Okay: "+page.slideIndex);
        }

        ctx.drawImage(image, 0, yPos);
        yPos = yPos + parseInt(image.naturalHeight);
    }

//     ctx.save();
    page.list[page.slideIndex - 1].draw.question.ctx = ctx;
    page.list[page.slideIndex - 1].draw.question.canvas = canvas;

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
    if(page.subjectCode == -1) page.subjectCode = subjects[0];
    setSubject(page.subjectCode);

}

function loadData() {

    document.getElementById("myPad").style = "max-height: " + (screen.height) + "px;";

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
    if (!img.complete) return false;
    if (img.naturalWidth === 0) return false;

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

