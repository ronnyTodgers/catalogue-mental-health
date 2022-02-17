 
 var harmonisationItems = []; var harmonisationColumns=[];

 $.getJSON('json/harmonisationItems.json', function (data) { 
    console.log(data);
    harmonisationItems = data;
    harmonisationColumns = createColumns(harmonisationItems);
    $(document).ready(function(){ 
     	loadData();
       	$('#harmonisationFactors_filter').insertAfter($("#harmonisationItems_filter"));
       	$('#harmonisationFactors_filter').show();
       	$('#harmonisationFactors').change(function() {
       		if(this.value) {
       			$('#harmonisationItems').DataTable().columns().search('').draw();
       			$('#harmonisationItems').DataTable().column( this.value ).search( '.+', true, false, true ).draw();
       		}
       	});
    });

 });


createColumns = function(data) {
	var columns = [];
	columns.push({ title:'', data:null, defaultContent: '', class:'control',orderable: false,searchable:false });
	columns.push({ title:'Cohort', data: 'Cohort'});
	columns.push({ title:'Participant age', data: 'Participant age'});
	columns.push({ title:'Age range', data: 'Age range'});
	columns.push({ title:'Measure', data: 'Measure'});
	columns.push({ title:'Developmental period', data: 'Developmental period'});
	columns.push({ title:'Reporter', data: 'Reporter'});
	data.forEach(function(row){
		if(!row['Developmental period']) {row['Developmental period'] = 'Adult';}
		if(!row['Age range']) {row['Age range'] = 'Childhood/Adolescence';}
		if(!row['Reporter']) {row['Reporter'] = 'Self';}
		Object.keys(row).forEach(function(col){
			col=col.replace(/\./g,'\\\.');
			if(columns.filter(column => column.title === col).length==0) {
				columns.push({ title: col, data: col, class: 'none',orderable: false,defaultContent: '' });
			}
		});
	});
	let unsorted = ['', 'Cohort', 'Participant age', 'Age range','Measure','Developmental period', 'Reporter']
	columns = columns.sort(function(a,b){
		if(unsorted.indexOf(b.title) >-1 || unsorted.indexOf(a.title) >-1) { return 0; }
		switch(a.title.toUpperCase()>b.title.toUpperCase()) {
			case true: return 1; break;
			case false: return -1; break;
			default: return 0;
		}
	});
	for(let i=8; i < columns.length; i++) {
		let opt = columns[i].title.replace(/\\\./g,'\.');;
		var el = document.createElement("option");
		el.textContent = opt;
		el.value = i;
		document.getElementById("harmonisationFactors").appendChild(el);
	}
	return columns;
}

loadData = function() {
 $('#harmonisationItems').DataTable(
     { data: harmonisationItems, responsive: {
      details: {
        type: 'column',
        target: 'tr'
      }
    }, 
    paging: false,
    searchDelay: 350,
    fixedHeader: { footer: true },
    columns: harmonisationColumns,
    order: [ 1, 'asc' ]
});
 $('#harmonisationItems').dataTable().fnAdjustColumnSizing();
    $('#harmonisationItems').dataTable().css('width','100%');
    $('#harmonisationItems').DataTable().on( 'responsive-display', function ( e, datatable, row, showHide, update ) {
      if(showHide) {
        $("li[data-dt-row='" + row.index() + "'] .dtr-data").each(
          function() { 
            if($(this).text()=="") {
              $(this).parent().hide();
            } 
          }
          );
      }
    } );
}
