const svgSupport = document.implementation.hasFeature(
  "http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1");

//Sample dates
var fullSweeps = []; ; var dates =[];
$.getJSON('json/covid_timeline.json', function (data) { 
    fullSweeps = Object.values(data);
    $( document ).ready( function () {
      sweeps = makeTimeline(fullSweeps);
      if(sweeps) { 
        makeCircles(sweeps);
      }
      });
});


getKeyByValue = function( obj, value ) {
  for( var prop in obj ) {
      if( obj.hasOwnProperty( prop ) ) {
           if( obj[ prop ] === value )
               return prop;
      }
  }
}

function getSortedKeys(obj) {
  var keys = Object.keys(obj);
  return keys.sort(function(a,b){
    return a-b;
  });
}

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



/* function getJsDateFromExcel(excelDate) { 
  let d = new Date((excelDate - (25567 + 2))*86400*1000); 
  //Truncate to nearest Month
  //d.setDate(1);
  d.setHours(0);
  d.setMinutes(0);
  d.setMilliseconds(0);
  return d;
}
 */
function formatMonthYear(d) {
  return monthNames[d.getMonth()] + ' ' + d.getFullYear();
}

function formatDayMonthYear(d) {
  d = new Date(d);
  let day = d.getDate();
  return day + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
}
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const timelineBackgroundTitles = [
  {title: 'First confirmed UK death', date:'2020-03-05'},
  {title: 'Non-essential buisinesses, schools close', date:'2020-03-20'},
  {title: 'Lockdown begins', date:'2020-03-23'},
  {title: 'UK deaths exceed 10,000', date:'2020-04-12'},
  {title: 'UK deaths exceed 30,000', date:'2020-05-06'},
  {title: 'Restrictions tighten accross UK', date:'2020-10-01'},
  {title: 'Second lockdown begins', date:'2020-11-01'},
  {title: 'Third lockdown begins', date:'2021-01-01'},
  {title: 'Restrictions begin easing accross UK', date:'2021-03-01'}
];


function makeTimeline(fullSweeps) {
  var titles = []; var sweeps={};
  if(fullSweeps == null) { $('#timeline').parent().hide(); return false; }
  for(var i=0;i<fullSweeps.length;i++) {
    let d = getJsDateFromExcel(fullSweeps[i]['Start date'], fullSweeps[i]['End date']);
    let thisTitle = fullSweeps[i]['Month'];
    //d = d.getTime();
    if(titles.indexOf(thisTitle)==-1) { titles.push(thisTitle); sweeps[d] = thisTitle ; }
  }
 //console.log(sweeps);
  return sweeps;
}

//Main function. Draw your circles.
function makeCircles(sweeps) {
  var labelDates = [];
  var labelTitles = [];

  for(var i=0;i<timelineBackgroundTitles.length;i++) {
    labelDates.push(Date.parse(timelineBackgroundTitles[i].date));
    labelTitles.push(timelineBackgroundTitles[i].title);
  }
  
  dates = getSortedKeys(sweeps);
  //console.log(dates);
    var first = Math.min(dates[0], labelDates[0]);
    var lastInt = dates[dates.length - 1] - first;
    var firstLabel = false;
    let animationElement = '<i class="fa fa-tree"></i>';
    if(svgSupport) {
      animationElement = '<object type="image/svg+xml" class="svgTree" style="visibility:hidden;width:40px;height:55px;" data="img/svgTree.svg"></object>';
    }

    if (first == labelDates[0]){
      firstLabel = true;
      $("#line").append('<div class="labelLine left above" id="label0" style="left:0%;"><div class="popupSpan label">' + labelTitles[0] + '</div><div class="popupSpan square"></div></div>');
    } else {
      $("#line").append('<div class="circle labelled left" id="circle0" style="left:0%;"><div class="popupSpan label">' + sweeps[dates[0]] + '</div><div class="popupSpan tree">' + animationElement + '</div></div>');
    }
    
    var currentData = fullSweeps.filter(function(sweep) { return sweep.Title == sweeps[dates[0]]; });
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
    { title: 'Study name', data: 'Study name' },
    { title: 'Start date', data: 'Start date',  render: function(value) {
            return formatDayMonthYear(getJsDateFromExcel(value));
        }},
    { title: 'End date', data: 'End date', render: function(value) {
            return formatDayMonthYear(getJsDateFromExcel(value));
        }},
    { title: 'Mental health measures used', data: 'Measures', class: 'none'  },
    { title: 'Participants', data: 'Participants', class: 'none'  },
    { title: 'Data collection method', data: 'Methodology', class: 'none'  },
    { title: 'Data access', data: 'Data access', class: 'none' },
    { title: 'Comments', data: 'Comments', class: 'none' },
    { title: 'Links', data: 'Links', class: 'none' }
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

    $('#dataTable_filter').insertAfter($('#line'))
    $('#dataTable_filter  input').addClass('form-control').attr('placeholder','Search sweeps for ...').appendTo($('#dataTable_filter'));
    $('#dataTable_filter > label').remove();
    

    
    //Loop through middle dates
    for (i = (firstLabel?0:1); i < dates.length - 1; i++) {
      var thisInt = dates[i] - first;

      //Integer relative to the first and last dates
      var relativeInt = thisInt / lastInt;

      //Draw the date circle
      $("#line").append('<div class="circle" id="circle' + i + '" style="left: ' + relativeInt * 100 + '%;"><div class="popupSpan label">' + sweeps[dates[i]] + '</div><div class="popupSpan tree">'+ animationElement+ '</div></div>');
    }


   
    // Draw on the labels
    for (i = (firstLabel?1:0); i < labelDates.length; i++) {
      var thisInt = labelDates[i] - first;

      //Integer relative to the first and last dates
      var relativeInt = thisInt / lastInt;
      let position = 'above';
      if([1,3,4,8].includes(i)){
        position = 'below';
      }

      if([3,2].includes(i)) {
        position = position + ' hideable'
      }
      //Draw the label
      $("#line").append('<div class="labelLine ' + position + '" id="labelLine' + i + '" style="left: ' + relativeInt * 100 + '%;"><div class="popupSpan label">' + labelTitles[i] + '</div></div>');
    }
    
    //Draw the last date circle
    $("#line").append('<div class="circle labelled right" id="circle' + (dates.length -1) + '" style="right:0;"><div class="popupSpan label">' + sweeps[dates[dates.length - 1]] + '</div><div class="popupSpan tree">'+animationElement+'</div></div>'); 

    var minLength = 3;
    $('#dataTable').DataTable().on( 'search.dt', function () {
      var searchField = $('#dataTable').DataTable().search();
      var matches = [];
     if(searchField.length >= 3)  {
        var searchTerms = searchField.match(/(?:[^\s"]+|"[^"]*")+/g); 
      for (var i in searchTerms) { if(searchTerms[i].length < minLength) { searchTerms.splice(i,1); } }
        var andRegex = searchTerms.join("))(?=[\\s\\S]*(") + "))";
      andRegex = "^(?=[\\s\\S]*(" + andRegex.replace(/["]/g, '');
      var andRegex = new RegExp(andRegex , "i");
      var matches = [];

      $.each(fullSweeps, function(key, val){
        var s = "";
        for (var i in val) {
         s += val[i] + " ";
       }
       if (andRegex.test(s)) {
          // let d = getJsDateFromExcel(val["Start date"]).getTime();
          // if (d > Date.parse('2020-09-01') && d <= Date.parse('2020-12-01')) {
          //   d = Date.parse('2020-11-15');
          // }
          // if (d >= Date.parse('2021-02-01') && d < Date.parse('2021-06-02')) {
          //   d = Date.parse('2021-04-15');
          // }
          //  d = String(d);
         if(matches.indexOf(dates.indexOf(getKeyByValue(sweeps, val["Month"])))==-1) {
          matches.push(dates.indexOf(getKeyByValue(sweeps, val["Month"]))); 
        }
      }
      });
    }

      for (i=0;i<fullSweeps.length;i++) {
        let elem = $('#circle' + i + ' .tree');
        if(matches.indexOf(i) == -1 && $(elem).hasClass('treeShown')){
          $(elem).removeClass('treeShown');
          animateTreeAnimation('line', i, 'shrink');
        } else if(matches.indexOf(i) != -1 && !$(elem).hasClass('treeShown')){
          $(elem).addClass('treeShown');
          animateTreeAnimation('line', i, 'grow');
        }
      }
    } );
  if (dates.length <2 ) {
    $('#timeline .sweepTitle').html("Showing measures used in sweep: <b>" +sweeps[dates[0]] + "</b><br><i>No other sweeps</i>").addClass('mb-4');
    $("#line").hide();
  } 

  selectDate($(".circle:first").attr('id'));
  $(".circle").mouseenter(function() {
    $(this).addClass("hover");
  });

  $(".circle").mouseleave(function() {
    $(this).removeClass("hover");
  });

  $(".circle").click(function() {
    var spanNum = $(this).attr("id");
    var currentIndex = spanNum.replace("circle", "");
    selectDate(spanNum);
     gtag('event', 'click', {
        'event_label': 'Study: ' + $('#studyid').val() + ' Sweep: ' + sweeps[dates[currentIndex]],
        'event_category': 'Timeline',
        'transport_type': 'beacon'
        });
  });

  if(svgSupport) {
   
    $('.svgTree').on('load', function() { 
      stopAndResetTreeAnimation($(this.contentDocument.documentElement)); 
      setupTreeAnimation($(this.contentDocument.documentElement)); 
      $(this).css('visibility','visible'); 
      if($(this).parent().hasClass('treeShown')){
        animateTreeAnimation($(this).closest('.line').attr('id'), $(this).closest('.circle').attr('data-id').replace('circle',''), 'grow');

      }
    });
  }
}

function selectDate(selector) {
  $('.active').removeClass('active');
  $('#' + selector).addClass('active');
  var currentIndex = selector.replace("circle", "");
  var currentLabel = sweeps[dates[currentIndex]];
  $('#timeline .sweepTitle').html("Showing studies collecting data in: <b>" + sweeps[dates[currentIndex]] + "</b><br><i>click on the timeline to see other timepoints");
  var currentData = fullSweeps.filter(function(sweep) {
      return sweep['Month'] ==currentLabel; 
  });
  $('#dataTable').dataTable().fnClearTable();
  $('#dataTable').dataTable().fnAddData(currentData);
  $('#dataTable').dataTable().fnAdjustColumnSizing();
  $('#dataTable').dataTable().css('width','100%');

  if(currentIndex >0 && collide($('#' + selector + ' .label')[0], $('#circle0 .label')[0])) {
    $('#circle0 .label').css('visibility', 'hidden');
  } else {
    $('#circle0 .label').css('visibility', 'visible');
  }

  if(currentIndex < (dates.length-1) && collide($('#' + selector + ' .label')[0], $('#circle' + (dates.length -1) + ' .label')[0])) {
    $('#circle' + (dates.length -1) + ' .label').css('visibility', 'hidden');
  } else {
    $('#circle' + (dates.length -1) + ' .label').css('visibility', 'visible');
  }

$('[data-toggle="tooltip"]').tooltip({container:'body',boundary: 'window', offset:0});  
  
};

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
    elem = $('#' + lineID + ' .circle[id="circle' + index + '"] .svgTree')[0];
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

