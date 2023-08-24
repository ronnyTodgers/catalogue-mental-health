
function getJsDateFromExcel(excelDateStart, excelDateEnd, dayGranularity=false) { 

  excelDateEnd = excelDateEnd || excelDateStart;

  let excelDates = [excelDateStart, excelDateEnd];
  let ds = [];
  for (let i=0;i<2;i++) {
    if (excelDates[i] < 3000) {
      ds[i] = Date.parse(excelDates[i] + '-01-01');
    } else {
      ds[i] = new Date((excelDates[i] - (25567 + 2))*86400*1000); 
    if (!dayGranularity) {ds[i].setDate(1);}
      ds[i].setHours(0);
      ds[i].setMinutes(0);
      ds[i].setMilliseconds(0);
      ds[i] = ds[i].getTime();
    }
  }

  return (ds[0] + ds[1]) /2;
}

Object.keys(searchData).forEach(studyID =>{
    $.getJSON('api/getSweeps.php?studyid='+ studyID, function (fullSweeps) { 
        let monthly = []; let daily=[];
        for(var i=0;i<fullSweeps.length;i++) {
            var sweep = fullSweeps[i];
            monthly.push({sweep: sweep['Title'], date: getJsDateFromExcel(sweep['Year'], sweep['End Year'])});
            daily.push({sweep: sweep['Title'], date: getJsDateFromExcel(sweep['Year'], sweep['End Year'], true)});
        }
        monthly= [...new Set(monthly)];
        daily= [...new Set(daily)];
        if(monthly.length != daily.length) {
            console.log(studyID);
        }
      })
    });
