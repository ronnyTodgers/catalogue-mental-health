<?php
require __DIR__ . '/vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;


function makeAllLinksNewWindow($str) {
    $str = str_replace("<a href=\\\" http", "<a href=\\\"http", $str);
    $str = str_replace("<a href=\\\"http", "<a target=\\\"_blank\\\" href=\\\"http", $str);
    return $str;
}

function textToHtmlLinks($str) {
    $url = '~(?:(https?)://([^\s<]+)|(www\.[^\s<]+?\.[^\s<]+))(?<![\.,:])~i'; 
    $str = preg_replace($url, '<a href="$0" target="_blank" title="$0">$0</a>', $str);
return $str;
}

function yesNotoTickCross($str) {
   $str = str_replace('Yes', "<i class='fas fa-check'></i>", $str);
   $str = str_replace('No', "<span hidden>No</span><i class='fas fa-times'></i>", $str);
   return $str;
}

function pretifyLinkages($str) {
    
    $linkArr = explode(",", $str);
    if(count($linkArr)==1 && $linkArr[0] =='No') {
        $str = str_replace('No', "<span hidden>No</span><i class='fas fa-times'></i>", $str);
    } else {
        $str = '';
        foreach($linkArr as $link) {
            if($link){ $str = $str."<i class='fas fa-check'></i>  ".trim($link)."</br>";}
        }
    }


    return $str;
 }

function prettifyQuestions($str) {

    print 'Before '.$str.'\n';
    $str = preg_replace("/[\r\n]+[0-9]+[. ]+(.*)?/i","<ul><li>$1</li></ul>",$str);
    $str = preg_replace("/(\<\/ul\>\n(.*)\<ul\>*)+/","",$str);
    print 'After '.$str.'\n';
    return $str;
}

function homogeniseBRs($str){
    $str = str_replace('</BR>', "<BR>", $str);
    $str = str_replace('<br>', "<BR>", $str);
    $str = str_replace('</br>', "<BR>", $str);
    //convert a mixture of <BR> spacers to double
    $linkArr = explode("<BR>", $str);
    $str='';
    foreach($linkArr as $link) {
        if($link){ 
            if(str_contains($link,"<a")) { 
                $str = $str.trim($link)."</br> </br>";
            } else {
                $str = $str.trim($link)."</br>";
            }
        }
    }
    return $str;
}

function commaNumbers($str) {
    if(is_numeric($str)){   
        $str = number_format($str);
    }
    return $str;
}

function notNull($str) {
    if(is_null($str)) {
        $str = "";
    }
    return $str;
}

function addBRs($str) {
    $str = '<br>'.preg_replace("/[\r\n]+/i","<br>",$str);
    return $str;
}

function addStudyLink($code, $name) {
    if($code) {
    $name = $name . ' ' . '<a title = "See this study in the main catalogue" href="?content=study&studyid=' . urlencode($code) . '" target = "_blank"><i class="fas fa-external-link-alt"></i></a>';
    }
    return $name;
}

$allData = [];

$filename = __DIR__ . '/xlsx/sweeps.xlsx';
$reader = IOFactory::createReaderForFile($filename) -> setReadDataOnly(true);

$spreadsheet1 = $reader ->  load($filename);

foreach ($spreadsheet1->getSheetNames() as $sheetName) {
    $sheet = $spreadsheet1->getSheetByName($sheetName);
    $lastRow = $sheet->getHighestRow();
    $data = [];
        for ($row = 3; $row <= $lastRow; $row++) {
            if( $sheet->getCell('A'.$row)->getCalculatedValue() != "" ) {
 	    $data[] = [
                'Label' => trim($sheet->getCell('A'.$row)->getCalculatedValue()),
                'Title' => trim($sheet->getCell('B'.$row)->getCalculatedValue()),
                'CM age' => $sheet->getCell('C'.$row)->getCalculatedValue(),
                'Year' => $sheet->getCell('D'.$row)->getCalculatedValue(),
                'End Year' => $sheet->getCell('E'.$row)->getCalculatedValue(),
                'Scale' => $sheet->getCell('F'.$row)->getCalculatedValue(),
                'Topic' => $sheet->getCell('G'.$row)->getCalculatedValue(),
                'Focus' => $sheet->getCell('H'.$row)->getCalculatedValue(),
                'Informant' => $sheet->getCell('I'.$row)->getCalculatedValue(),
                'Multiple rater' => yesNoToTickCross($sheet->getCell('J'.$row)->getCalculatedValue()),
                'Reporting term' => $sheet->getCell('K'.$row)->getCalculatedValue(),
                'Subscales' => $sheet->getCell('L'.$row)->getCalculatedValue(),
                'Questions' => addBRs($sheet->getCell('M'.$row)->getCalculatedValue()),
                'Response scale' => addBRs($sheet->getCell('N'.$row)->getCalculatedValue()),
                'Standard Instrument' => yesNoToTickCross($sheet->getCell('O'.$row)->getCalculatedValue()),
                'Comments' => $sheet->getCell('P'.$row)->getCalculatedValue(),
                'Sweep Comments' => $sheet->getCell('R'.$row)->getCalculatedValue(),
                'Timeline Group' => $sheet->getCell('Q'.$row)->getCalculatedValue(),
                'Physical Health Measures' => $sheet->getCell('S'.$row)->getCalculatedValue()
             ];
	     }
        }
    $allData[trim($sheet->getTitle())] = $data;
}

// Save
$fp = fopen('json/sweeps.json', 'w');
fwrite($fp, makeAllLinksNewWindow(json_encode($allData)));
fclose($fp);


$filename = __DIR__ . '/xlsx/studies.xlsx';
$reader = IOFactory::createReaderForFile($filename) -> setReadDataOnly(true);

$spreadsheet1 = $reader ->  load($filename);
$sheet = $spreadsheet1->getSheet(0);
    $lastRow = $sheet->getHighestRow();
    $data = [];
        for ($row = 2; $row <= $lastRow; $row++) {
            if( $sheet->getCell('A'.$row)->getCalculatedValue() != "" ) {
            $data[trim($sheet->getCell('A'.$row)->getCalculatedValue())] = [
                'Title' => trim($sheet->getCell('B'.$row)->getCalculatedValue()),
                'Aims' => $sheet->getCell('C'.$row)->getCalculatedValue(),
                'Institution' => $sheet->getCell('D'.$row)->getCalculatedValue(),
                'Website' => $sheet->getCell('E'.$row)->getCalculatedValue(),
                'Geographic coverage - Nations' => $sheet->getCell('F'.$row)->getCalculatedValue(),
                'Geographic coverage - Regions' => $sheet->getCell('G'.$row)->getCalculatedValue(),
                'Start date' => $sheet->getCell('H'.$row)->getCalculatedValue(),
                'Sample type' => $sheet->getCell('I'.$row)->getCalculatedValue(),
                'Sample details' => $sheet->getCell('J'.$row)->getCalculatedValue(),
                'Sample size at recruitment' => commaNumbers($sheet->getCell('K'.$row)->getCalculatedValue()),
                'Sample size at most recent sweep' => commaNumbers($sheet->getCell('L'.$row)->getCalculatedValue()),
                'Sex' => $sheet->getCell('M'.$row)->getCalculatedValue(),
                'Age at recruitment' => $sheet->getCell('N'.$row)->getCalculatedValue(),
                'Cohort year of birth' => $sheet->getCell('O'.$row)->getCalculatedValue(),
                'Data access' => $sheet->getCell('P'.$row)->getCalculatedValue(),
                'Genetic data collected' => yesNoToTickCross($sheet->getCell('Q'.$row)->getCalculatedValue()),
                'Linkage to administrative data' => pretifyLinkages($sheet->getCell('R'.$row)->getCalculatedValue()),
                'Notes' => $sheet->getCell('S'.$row)->getCalculatedValue(),
                'Reference paper' => homogeniseBRs($sheet->getCell('T'.$row)->getCalculatedValue()),
                'Funders' => $sheet->getCell('U'.$row)->getCalculatedValue(),
                'Related themes' => $sheet->getCell('V'.$row)->getCalculatedValue(),
                'Study design' => $sheet->getCell('W'.$row)->getCalculatedValue(),
                'Sample characteristics' => $sheet->getCell('X'.$row)->getCalculatedValue(),
                'Geographic coverage' => $sheet->getCell('Y'.$row)->getCalculatedValue(),
                'Complementary data' => $sheet->getCell('Z'.$row)->getCalculatedValue(),
                'HDR UK Innovation Gateway' => strip_tags($sheet->getCell('AA'.$row)->getCalculatedValue())
             ];
             }
        }
$fp = fopen('json/study_detail.json', 'w');
fwrite($fp, makeAllLinksNewWindow(json_encode($data)));
fclose($fp);

$filename = __DIR__ . '/xlsx/funders.xlsx';
$reader = IOFactory::createReaderForFile($filename) -> setReadDataOnly(true);

$spreadsheet1 = $reader ->  load($filename);
$sheet = $spreadsheet1->getSheet(0);
    $lastRow = $sheet->getHighestRow();
    $data = [];
        for ($row = 3; $row <= $lastRow; $row++) {
            $funderCode = $sheet->getCell('B'.$row)->getCalculatedValue();
            if( $funderCode != "" ) {
                if(!file_exists(__DIR__. '/img/funders/'. $funderCode .'.png')) {
                    throw new Exception('Image missing for '. $funderCode );
                }
                $data[$funderCode] = [
                'Funder name' => $sheet->getCell('A'.$row)->getCalculatedValue(),
                'Has image' => "Y",
                'Address' => $sheet->getCell('C'.$row)->getCalculatedValue()
             ];
             }
        }
$fp = fopen('json/funders.json', 'w');
fwrite($fp, makeAllLinksNewWindow(json_encode($data)));
fclose($fp);

$filename = __DIR__ . '/xlsx/COVID_timeline.xlsx';
$reader = IOFactory::createReaderForFile($filename) -> setReadDataOnly(true);

$spreadsheet1 = $reader ->  load($filename);
$sheet = $spreadsheet1->getSheet(0);
    $lastRow = $sheet->getHighestRow();
    $data = [];
        for ($row = 3; $row <= $lastRow; $row++) {
            if( $sheet->getCell('A'.$row)->getCalculatedValue() != "" ) {
            $data[$row] = [
                'Month' => $sheet->getCell('A'.$row)->getCalculatedValue(),
                'Study name' => addStudyLink(
                    $sheet->getCell('B'.$row)->getCalculatedValue(),
                    $sheet->getCell('C'.$row)->getCalculatedValue()
                ),
                'Start date' => $sheet->getCell('D'.$row)->getCalculatedValue(),
                'End date' => $sheet->getCell('E'.$row)->getCalculatedValue(),
                'Measures' => addBrs($sheet->getCell('F'.$row)->getCalculatedValue()),
                'Participants' => $sheet->getCell('G'.$row)->getCalculatedValue(),
                'Methodology' => $sheet->getCell('H'.$row)->getCalculatedValue(),
                'Data access' => textToHtmlLinks(addBrs($sheet->getCell('I'.$row)->getCalculatedValue())),
                'Comments' => addBrs($sheet->getCell('J'.$row)->getCalculatedValue()),
                'Links' => textToHtmlLinks(addBrs($sheet->getCell('K'.$row)->getCalculatedValue())),
             ];
             }
        }
$fp = fopen('json/covid_timeline.json', 'w');
fwrite($fp, makeAllLinksNewWindow(json_encode($data)));
fclose($fp);

?>
