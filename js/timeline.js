//Sample dates
var fullSweeps = []; var sweeps=[]; var dates=[]; var tlGroups = [];
var standardInstruments = {};
const minSearchLength = 3;
const svgSupport = document.implementation.hasFeature(
  "http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");
var treeAnimationTimeLines = {};
$.when(
  $.get("?content=7", function(data) {
    $(data).find('strong[id]').each(function(){
      let ID = $(this).prop('id');
      standardInstruments[ID] = $(this).parent()[0].outerHTML;
      let parasInToolTip = 0;
      $(this).parent().nextAll().each(function(){
        parasInToolTip++;
        if($(this)[0].tagName == "HR" || parasInToolTip >3 || $(this).text().indexOf('Reference')>-1) return false;
        standardInstruments[ID] += $(this)[0].outerHTML;
      });
    });
  }),
  $.getJSON('api/getSweeps.php?studyid='+ $('#studyid').val(), function (data) { 
    fullSweeps = data;
  })
  ).then(function(){
    for(var i=0;i<fullSweeps.length;i++) {
      var sweep = fullSweeps[i];
      if(sweep['Standard Instrument']=="<i class='fas fa-check'></i>"){
        for (var standardInstrument in standardInstruments){
          if(sweep['Scale'].indexOf(standardInstrument) >-1) {
            sweep['Scale'] = "<div style='display:flex;align-items:center;'>" + sweep['Scale'] + "<i class='fas fa-info-circle infobutton' data-toggle='tooltip' data-html='true' title='" + standardInstruments[standardInstrument] + "'></i></div>";
            break;
          }
        }
      }
    }
  $( document ).ready( function () {
    makeTimeLineGroups(fullSweeps);
    makeTimeline(fullSweeps);
  });
});

function isOverflown(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function applyReadMore() {
  $('#sweepComment, #sweepPhysHealth').each( function() {
    $(this).addClass('text-truncate');
    $(this).off('click');
    if(isOverflown($(this)[0])) {
      $(this).addClass('readMore');
      $(this).click(function() { $(this).toggleClass('text-truncate'); });
    } else {
      $(this).removeClass('readMore');
    }
  });
}


const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getJsDateFromExcel(excelDateStart, excelDateEnd) { 

  excelDateEnd = excelDateEnd || excelDateStart;

  let excelDates = [excelDateStart, excelDateEnd];
  let ds = [];
  for (let i=0;i<2;i++) {
    if (excelDates[i] < 3000) {
      ds[i] = Date.parse(excelDates[i] + '-01-01');
    } else {
      ds[i] = new Date((excelDates[i] - (25567 + 2))*86400*1000); 
      ds[i].setDate(1);
      ds[i].setHours(0);
      ds[i].setMinutes(0);
      ds[i].setMilliseconds(0);
      ds[i] = ds[i].getTime();
    }
  }

  return (ds[0] + ds[1]) /2;
}

function tlEntry(startDate, endDate, title, label, cAge, comment, physHealth) {
  this.startDate = startDate;
  this.endDate = endDate;
  this.tlDate = (this.startDate+this.endDate)/2;
  this.title = title;
  this.label = label;
  this.cAge = cAge;
  this.comment = comment;
  this.physHealth = physHealth;
}

function makeTimeLineGroups(fullSweeps) {
  tlGroups = [];
    let tlGroupTitles = fullSweeps.map(
      function (sweep) { 
        return sweep['Timeline Group']; 
      }).filter(
          function(item, pos, self) {
            return self.indexOf(item) == pos;
          });

    for(var i=0;i<tlGroupTitles.length;i++) {
      let thisTlGroupStart = fullSweeps.filter(
                          function(sweep) {
                             return sweep["Timeline Group"] == tlGroupTitles[i]; 
                          }).map(
                            function (sweep) { 
                              return getJsDateFromExcel(sweep['Year']); 
                            }
                          ).sort()[0];
      let thisTlGroupEnd = fullSweeps.filter(
                          function(sweep) {
                             return sweep["Timeline Group"] == tlGroupTitles[i]; 
                          }).map(
                            function (sweep) { 
                              return getJsDateFromExcel(sweep['End Year']); 
                            }
                          ).sort().pop();
      tlGroups.push(new tlEntry(thisTlGroupStart, thisTlGroupEnd, tlGroupTitles[i], tlGroupTitles[i]));
      tlGroups = tlGroups.sort(function(a,b) { if(a.tlDate > b.tlDate) {return -1;} if(b.tlDate > a.tlDate) {return 1;}});
  }
}

function makeTimeline(fullSweeps, timelineGroup) {
  console.log('makeTimeline for timelineGroup ' + timelineGroup + ' with:');
  console.log(fullSweeps)
  let updateTimelineGroup = false;
  var thisGroupSweeps = fullSweeps.slice();  
    
  if(fullSweeps == null) { $('#timeline').parent().hide(); return false; }
  if(timelineGroup ==null) { updateTimelineGroup = true; }
  //default to showing the first group if none is specified.
  if(fullSweeps[0].hasOwnProperty('Timeline Group') && fullSweeps[0]['Timeline Group'] !== null) {
    timelineGroup = timelineGroup || fullSweeps[0]['Timeline Group'];
    if (updateTimelineGroup) { makeCircles(tlGroups, $('#groupLine')); }
    thisGroupSweeps = fullSweeps.filter(function(sweep) { return sweep["Timeline Group"] == timelineGroup; });
  } else {
    $('#lineContGroup').remove();
  }
  sweeps=[];
  let sweepTitles = thisGroupSweeps.map(
      function (sweep) { 
        return sweep['Label']; 
      }).filter(
          function(item, pos, self) {
            return self.indexOf(item) == pos;
          });
  for(var i=0;i<sweepTitles.length;i++) {
    // This takes the sweep level info from the first entry for that sweep - might miss out sweep level comments if they have not put them in everywhere
    let sweep = thisGroupSweeps.filter(function(sweep) { return sweep["Label"] == sweepTitles[i]; })[0];
    sweeps.push(new tlEntry(getJsDateFromExcel(sweep['Year']), getJsDateFromExcel(sweep['End Year']), sweep['Title'], sweep['Label'], sweep['CM age'], sweep['Sweep Comments'], sweep['Physical Health Measures'])); 
  }
  if(sweeps){
    makeCircles(sweeps, $('#line'));
    selectDate($('#line').find('.circle[data-id="circle0"]'));
  }
}

//Main function. Draw your circles.
function makeCircles(tlEntries, $line) {
  console.log("making circles");
  console.log(tlEntries);
// order by date and then by reverse title alpha
    tlEntries = tlEntries.sort(function (el1, el2) {
        if(el1.tlDate == el2.tlDate)
        {
            return (el1.title > el2.title) ? -1 : (el1.title < el2.title) ? 1 : 0;
        }
        else
        {
            return (el1.tlDate < el2.tlDate) ? -1 : 1;
        }
    });

  //RESET THIS LINE - REMOVE ALL CIRCLES
  $line.find('.circle').remove();
  //Forget the timeline if there's only one date. Who needs it!?
  dates = tlEntries.map(
    function(el) {
     return Number(el.tlDate); 
    }).filter(
      function(item, pos, self) {
        return self.indexOf(item) == pos;
      }
    ).sort(function(a,b){return a-b;});
  var first = Number(dates[0]);
  var lastInt = Number(dates[dates.length - 1]);
  var spanInt = lastInt - first;

// run through and check if there will be any collisions - might need immproving if we push some off the right end
    let pxPerInt = $line.width() / (spanInt);
    let minGapInt = 20*(1/pxPerInt);
    for (i = 1; i < tlEntries.length-1; i++) {
      if(tlEntries[i].tlDate - tlEntries[i-1].tlDate < minGapInt) {
        if (tlEntries[i-1].tlDate + minGapInt <= lastInt) {
          tlEntries[i].tlDate = tlEntries[i-1].tlDate + minGapInt;
        }
      }
    }
    for (i = tlEntries.length-2; i > 0; i--) {
      let thisMinGap = i==tlEntries.length-2?2*minGapInt:minGapInt;
      if(tlEntries[i+1].tlDate - tlEntries[i].tlDate < thisMinGap) {
        if (tlEntries[i].tlDate - thisMinGap >= first) {
          tlEntries[i].tlDate = tlEntries[i+1].tlDate - thisMinGap;
        }
      }
    }


    for (i = 0; i < tlEntries.length; i++) {
      var thisInt = tlEntries[i].tlDate - first;
      var relativeInt = (thisInt / spanInt) ;
      let animationElement = '<i class="fa fa-tree"></i>';
      if(svgSupport) {
        animationElement = '<object type="image/svg+xml" class="svgTree" style="visibility:hidden;width:40px;height:52px;" data="img/svgTree.svg"></object>';
      }

      //Draw the date circle
      if (i==0) {
        $line.append('<div class="circle labelled left" title="' + 
            formatLabels(tlEntries[i].label, 'tooltip') + 
            '" data-id="circle' + i + '" style="left: 0;"><div class="popupSpan label">' + 
              formatLabels(tlEntries[i].label, 'tl') + 
                '</div><div class="popupSpan tree">' + 
                animationElement + '</div></div>');
      } else if (i == tlEntries.length -1) {
        $line.append('<div class="circle labelled right" title="' + 
            formatLabels(tlEntries[i].label, 'tooltip') + 
            '" data-id="circle' + i + '" style="right: 0;"><div class="popupSpan label">' + 
              formatLabels(tlEntries[i].label, 'tl') + 
                '</div><div class="popupSpan tree">' + 
                animationElement + '</div></div>');
      } else {
        $line.append('<div class="circle" title="' + 
            formatLabels(tlEntries[i].label, 'tooltip') + 
            '" data-id="circle' + i + '" style="left: ' + relativeInt * 100 + '%;"><div class="popupSpan label">' + 
              formatLabels(tlEntries[i].label, 'tl') + 
                '</div><div class="popupSpan tree">' + 
                animationElement + '</div></div>')
      }

      if(svgSupport) {
          var elem = $('#' + $line.attr('id') + ' .circle[data-id="circle' + i + '"] .svgTree');
          $(elem)[0].addEventListener('load', function() { 
            stopAndResetTreeAnimation($(this.contentDocument.documentElement)); 
            setupTreeAnimation($(this.contentDocument.documentElement)); 
            $(this).css('visibility','visible'); 
            if($(this).parent().hasClass('treeShown')){
              animateTreeAnimation($(this).closest('.line').attr('id'), $(this).closest('.circle').attr('data-id').replace('circle',''), 'grow');
    
            }
          });
      }
        // // reset any cached animation timelines for this line object - they will be recreated when animated if needs be
        // for (const elemID in treeAnimationTimeLines) {
        //   if(elemID.startsWith($line.id)) {
        //     treeAnimationTimeLines[elemID] = null;
        //   }
        // }
    }

 
  if (tlEntries.length <2 ) {
    displaySweepInfo(tlEntries[0], "<br><i>No other sweeps</i>");
    $("#line").hide();
  } 

 
  $(".circle").off('mouseenter').mouseenter(function() {
    $(this).addClass("hover");
  });

  $(".circle").off('mouseleave').mouseleave(function() {
    $(this).removeClass("hover");
  });

  $(".circle").off('click').click(function() {
    var spanNum = $(this).attr("data-id");
    var currentIndex = spanNum.replace("circle", "");
    selectDate($(this), true);
  });
}

function formatLabels(label, type) {
  let retval = label;
  switch(type) {
    case 'tl':
      retval = label.replace(' || ', '</br>');
      break;
    case 'header':
    case 'tooltip':
      retval = label.replace(' || ', ' - ');
  }
  return retval;
}

function setDataTable(currentData) {
  console.log("setting Data table with");
  console.log(currentData);
    if( ! $.fn.DataTable.isDataTable( '#dataTable' ) ) {
      $('#dataTable').DataTable(
           { data: currentData, responsive: {
            details: {
              type: 'column',
              target: 'tr'
            }
          }, 
          paging: false,
          searchDelay: 350,
          fixedHeader: { footer: true },
          columns:
          [
          { title:'', data:null, defaultContent: '', class:'control',orderable: false,searchable:false },
          { title: 'Topic', data: 'Topic' },
          { title: 'Scale', data: 'Scale' },
          { title: '<div title="The focus of a measure is the person who the measure is about">Focus</div>', data: 'Focus' },
          { title: '<div title="The informant is the person who provides the information">Informant</div>', data: 'Informant' },
          { title: '<div title="Standard instruments are measures which have published indication of validity and/or reliability. Standard instruments have often used in multiple studies.">Standard Instrument</div>', data: 'Standard Instrument' },
          { title: 'Reporting term', data: 'Reporting term', class: 'none' },
          { title: 'Subscales', data: 'Subscales', class: 'none' },
          { title: 'Questions', data: 'Questions', class: 'none' },
          { title: 'Response scale', data: 'Response scale', class: 'none' },
          { title: 'Comments', data: 'Comments', class: 'none' },
          ],
          order: [ 1, 'asc' ]
        });
          $('#dataTable').dataTable().fnAdjustColumnSizing();
          $('#dataTable').dataTable().css('width','100%');
          $('#dataTable').DataTable().on( 'responsive-display', function ( e, datatable, row, showHide, update ) {
            if(showHide) {
               row.nodes().to$().next().find("td.child").each(
               function() {
                  $(this).attr('colspan',$(this).attr('colspan') - 1);
                  $(this).before("<td></td>");
                });
              $("li[data-dt-row='" + row.index() + "'] .dtr-data").each(
                function() { 
                  if($(this).text()=="") {
                    $(this).parent().hide();
                  } 
                }
                );
            }
          } );

          $('#dataTable_filter').insertAfter($('#timeline > h6'))
          $('#dataTable_filter  input').addClass('form-control').attr('placeholder','Search sweeps for ...').appendTo($('#dataTable_filter'));
          $('#dataTable_filter > label').remove();
          $('#dataTable').DataTable().on( 'search.dt', showTrees );


    } else {
          $('#dataTable').dataTable().fnClearTable(false);
          $('#dataTable').dataTable().fnAddData(currentData, false);
    }
    $('[data-toggle="tooltip"]').tooltip({container:'body',boundary: 'window', offset:0}); 
    $('#dataTable').dataTable().css('width','100%');
    $('#dataTable').dataTable().fnAdjustColumnSizing();
}


function showTrees() {
  console.log("show trees");
  var searchField = $('#dataTable').DataTable().search();
  var groupMatches = [];
  var tlMatches = [];
  if(searchField.length >= minSearchLength)  {
    var searchTerms = searchField.match(/(?:[^\s"]+|"[^"]*")+/g); 
    for (var i in searchTerms) { if(searchTerms[i].length < minSearchLength) { searchTerms.splice(i,1); } }
      var andRegex = searchTerms.join("))(?=[\\s\\S]*(") + "))";
    andRegex = "^(?=[\\s\\S]*(" + andRegex.replace(/["]/g, '');
    var andRegex = new RegExp(andRegex , "i");


    $.each(fullSweeps, function(key, val){
      var s = "";
      for (var i in val) {
      s += val[i] + " ";
      }
      if (andRegex.test(s)) {
          groupMatches.push(tlGroups.map(function (sweep) { 
                                            return sweep['title']; 
                                          }).indexOf(val['Timeline Group']));
          tlMatches.push(sweeps.map(function (sweep) { 
                                            return sweep['title']; 
                                          }).indexOf(val['Title']));
      }
    });
    //deduplicate
    tlMatches = tlMatches.filter(function(item, pos, self) {
        return item > -1 &&  self.indexOf(item) == pos;
    });
    groupMatches = groupMatches.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
    });
  }
  for (i=0;i<tlGroups.length;i++) {
    let elemSelect = '#groupLine .circle[data-id="circle' + i + '"] .tree' ;
    let elem = $(elemSelect);
    if(elem.length){
      if(groupMatches.indexOf(i) == -1 && $(elem).hasClass('treeShown')){
        $(elem).removeClass('treeShown');
        animateTreeAnimation('groupLine', i, 'shrink');
      } else if(groupMatches.indexOf(i) != -1 && !$(elem).hasClass('treeShown')) {
        $(elem).addClass('treeShown');
        animateTreeAnimation('groupLine', i, 'grow');                                                                                                                                                                                 
      }
    }
  }
  for (i=0;i<sweeps.length;i++) {
    let elemSelect = '#line .circle[data-id="circle' + i + '"] .tree' ;
    let elem = $(elemSelect);
    if(tlMatches.indexOf(i) == -1 && $(elem).hasClass('treeShown')){
      $(elem).removeClass('treeShown');
      animateTreeAnimation('line', i, 'shrink');
    } else if(tlMatches.indexOf(i) != -1 && !$(elem).hasClass('treeShown')){
      $(elem).addClass('treeShown');
      animateTreeAnimation('line', i, 'grow');
    }
  }

  // If the current sweep has no results then move to the first one that does have
  if ($('#line .circle.active .treeShown').length ==0) {
    if ($('#line .circle .treeShown').length) {
      //there are matches in the current group - move to the first
      selectDate($('#line .circle:has(.treeShown)').first());
    } else if ($('#groupLine .circle .treeShown').length) {
      // None in this group - move to the first group that has them
      selectDate($('#groupLine .circle:has(.treeShown)').first());
      selectDate($('#line .circle:has(.treeShown)').first());
    }
  }
  $('[data-toggle="tooltip"]').tooltip({container:'body',boundary: 'window', offset:0}); 
}


function displaySweepInfo(tlEntry, suffix) {
  var suffix = suffix || "";
  $('#sweepTitle > span').html(formatLabels(tlEntry.title, 'header'));
  $('#sweepCMage > span').html(tlEntry.cAge);
  if(tlEntry.physHealth) {
    $('#sweepPhysHealth > span').html(tlEntry.physHealth);
  } else {
    $('#sweepPhysHealth > span').html('No detailed physical health assessment matching Catalogue criteria');
  }
  let dates=[new Date(tlEntry.startDate), new Date(tlEntry.endDate)];
  var dateStr;
  if(dates[0].getFullYear() == dates[1].getFullYear())  {
      if(dates[0].getMonth()== dates[1].getMonth()) {
          //Just display the full date once
          dateStr = monthNames[dates[0].getMonth()] + 
            " " + dates[0].getFullYear();
      } else {
        // Same year different month
        dateStr = monthNames[dates[0].getMonth()] + 
            " - " +
            monthNames[dates[1].getMonth()] + 
            " " + dates[1].getFullYear();
      }
  } else {
    dateStr = monthNames[dates[0].getMonth()] + 
          " " + dates[0].getFullYear() + " - " +
          monthNames[dates[1].getMonth()] + 
          " " + dates[1].getFullYear();
  }
  
  $('#sweepDates > span').html(dateStr);
  if(tlEntry.comment) {
    $('#sweepComment').show();
    $('#sweepComment > span').html(tlEntry.comment);
  } else {
    $('#sweepComment').hide();
    $('#sweepComment > span').html('');
  }
  applyReadMore();  
}

function selectDate($circle, report) {
  $line = $circle.parent('.line');
  $line.find('.active').removeClass('active');
  $circle.addClass('active');
  var currentIndex = $circle.attr('data-id').replace("circle", "");
  var currentSweepTitle = '';
  var tlGroupSelection = false;
  deCollide(currentIndex, $circle, $line);
  if ($line.attr('id') == 'groupLine') {
    makeTimeline(fullSweeps, tlGroups[currentIndex].title);
    drawRangeLines();
    tlGroupSelection = true;
    currentSweepTitle = tlGroups[currentIndex].title;
  } else {
    currentSweepTitle = sweeps[currentIndex].title;
    displaySweepInfo(sweeps[currentIndex]);
    //$('.sweepTitle').html("Showing measures used in sweep: <b>" + formatLabels(currentSweepTitle, 'header') + "</b><br><i>click on the timeline above to see other sweeps");
    var currentData = fullSweeps.filter(function(sweep) { return sweep.Title == currentSweepTitle; });
    setDataTable(currentData);
    $('[data-toggle="tooltip"]').tooltip({container:'body',boundary: 'window', offset:0}); 

  }
  if (report) {
    if(tlGroupSelection) {
      gtag('event', 'click', {
        'event_label': 'Study: ' + $('#studyid').val() + ' Group: ' + currentSweepTitle,
        'event_category': 'Timeline Group' ,
        'transport_type': 'beacon'
        });

    } else {
      gtag('event', 'click', {
        'event_label': 'Study: ' + $('#studyid').val() + ' Sweep: ' + currentSweepTitle,
        'event_category': 'Timeline' ,
        'transport_type': 'beacon'
        });
    }
    
  }
};

function drawRangeLines() {
  let circleRect = $('#groupLine .circle.active')[0].getBoundingClientRect();
  let lineRect = $('#groupLine')[0].getBoundingClientRect();
  $('#timeline-ranges-line-1').attr('x1', circleRect.left - lineRect.left + 3); 
  $('#timeline-ranges-line-2').attr('x1', circleRect.right - lineRect.left - 3);
  

}

function deCollide(currentIndex, $circle, $line) {
  let $circle0 = $line.find('.circle[data-id="circle0"]');
  let circleCount = $line.find('.circle').length;
  if (currentIndex >0 && !contained($circle.find('.label')[0], $line.parent('.lineCont')[0])) {
        $circle.addClass('offsetLabel');
       if (currentIndex >0 && !contained($circle.find('.label')[0], $line.parent('.lineCont')[0])) {
        $circle.addClass('offsetLabelRight');
      }
    }
  if(currentIndex >0 && collide($circle.find('.label')[0], $circle0.find('.label')[0])) {
    $circle0.find('.label').css('visibility', 'hidden');
  } else {
    $circle0.find('.label').css('visibility', 'visible');
  }

  if(currentIndex < (circleCount-1) && collide($circle.find('.label')[0], $line.find('.circle.right').find('.label')[0])) {
    $line.find('.circle.right').find('.label').css('visibility', 'hidden');
  } else {
    $line.find('.circle.right').find('.label').css('visibility', 'visible');
  }
}


function collide(el1, el2) {
  var rect1 = el1.getBoundingClientRect();
  var rect2 = el2.getBoundingClientRect();

  return !(
    rect1.top > rect2.bottom ||
    rect1.right < rect2.left ||
    rect1.bottom < rect2.top ||
    rect1.left > rect2.right
    );
}

function contained(el1, el2) {
  var rect1 = el1.getBoundingClientRect();
  var rect2 = el2.getBoundingClientRect();

  return !(
    rect1.bottom > rect2.bottom ||
    rect1.right > rect2.right ||
    rect1.top < rect2.top ||
    rect1.left < rect2.left
    );
}  



function setupTreeAnimation($svgID) {
  TweenMax.set($svgID.find(".shadow"), {
    scale:0,
    transformOrigin:"15px 8px"
  });
  TweenMax.set($svgID.find(".tree"), {
    scale:0,
    transformOrigin:"154px bottom"
  });
  TweenMax.set($svgID.find(".leaf-rb"), {
    scale:0,
    rotation:'-60cw',
    y: -15,
    transformOrigin:"left bottom"
  });
  TweenMax.set($svgID.find(".leaf-rm"), {
    scale:0,
    rotation:'-50cw',
    y: 30,
    transformOrigin:"left bottom"
  });
  TweenMax.set($svgID.find(".leaf-lb"), {
    scale:0,
    rotation:'60cw',
    y: -80,
    transformOrigin:"right bottom"
  });
  TweenMax.set($svgID.find(".leaf-lm"), {
    scale:0,
    rotation:'40cw',
    y: -90,
    transformOrigin:"right bottom"
  });

  TweenMax.set($svgID.find(".leaf-top"), {
    scale:0,
    transformOrigin:"center bottom"
  });

  TweenMax.set($svgID.find(".leaf-rb g"), {
    scale:0,
    transformOrigin:"left 60px"
  });
  TweenMax.set($svgID.find(".leaf-rm g"), {
    scale:0,
    transformOrigin:"22px 140px"
  });
  TweenMax.set($svgID.find(".leaf-lb g"), {
    scale:0,
    transformOrigin:"right 56px"
  });
  TweenMax.set($svgID.find(".leaf-lm g"), {
    scale:0,
    transformOrigin:"106px bottom"
  });
}

function animateTreeAnimation(lineID, index, direction) {
  if(svgSupport) {
    elem = $('#' + lineID + ' .circle[data-id="circle' + index + '"] .svgTree')[0];
    if(elem.contentDocument){
      stopAndResetTreeAnimation($(elem.contentDocument.documentElement)); 
      setupTreeAnimation($(elem.contentDocument.documentElement)); 
      let tl = getAnimationTimeline($(elem.contentDocument.documentElement));
      $('.treeShown').css('font-size',0);
      if(direction =='grow') {
        tl.timeScale(3).play();
      }
      if(direction =='shrink') {
        tl.timeScale(3).reverse(0);
      }
    }
  }
}

function validatePropertyName(str) {
  return str.replace(/[^A-Za-z_]/, '');
}


// This should be called on document.load
function getAnimationTimeline($svgID) {
var tl = new TimelineMax({
  repeat: 0
   });

    tl.to($svgID.find(".shadow"), 2, {
      scale:1
    }, 0).to($svgID.find(".tree"), 2, {
      scale:1
    }, 0).to($svgID.find(".leaf-rb"), 2, {
      scale:1,
      rotation:'0cw',
      y: 0,
      delay: 0.35
    }, 0).to($svgID.find(".leaf-rm"), 2, {
      scale:1,
      rotation:'0cw',
      y: 0,
      delay: 0.35
    }, 0).to($svgID.find(".leaf-lb"), 2, {
      scale:1,
      rotation:'0cw',
      y: 0,
      delay: 0.35
    }, 0).to($svgID.find(".leaf-lm"), 2, {
      scale:1,
      rotation:'0cw',
      y: 0,
      delay: 0.35
    }, 0).to($svgID.find(".leaf-top"), 2.5, {
      scale:1,
      delay: 0.35
    }, 0).to($svgID.find(".leaf-lb g"), 2.25, {
      scale:1,
      delay: 0.5
    }, 0).to($svgID.find(".leaf-lm g"), 2.25, {
      scale:1,
      delay: 0.6
    }, 0).to($svgID.find(".leaf-rb g"), 2.25, {
      scale:1,
      delay: 0.5
    }, 0).to($svgID.find(".leaf-rm g"), 2.25, {
      scale:1,
      delay: 0.6
    }, 0);

    return tl;
}

function stopAndResetTreeAnimation($svgID) {
  //TweenMax.killAll(false, true, false);
  TweenMax.set($svgID.find(".tree"), {clearProps:"all"});
  TweenMax.set($svgID.find(".shadow"), {clearProps:"all"});
  TweenMax.set($svgID.find(".leaf-top"), {clearProps:"all"});
  TweenMax.set($svgID.find(".leaf-rb"), {clearProps:"all"});
  TweenMax.set($svgID.find(".leaf-rm"), {clearProps:"all"});
  TweenMax.set($svgID.find(".leaf-lb"), {clearProps:"all"});
  TweenMax.set($svgID.find(".leaf-lm"), {clearProps:"all"});
  TweenMax.set($svgID.find(".leaf-top"), {clearProps:"all"});
  TweenMax.set($svgID.find(".leaf-rb g"), {clearProps:"all"});
  TweenMax.set($svgID.find(".leaf-rm g"), {clearProps:"all"});
  TweenMax.set($svgID.find(".leaf-lb g"), {clearProps:"all"});
  TweenMax.set($svgID.find(".leaf-lm g"), {clearProps:"all"});
}

