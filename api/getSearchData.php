<?php
$string = file_get_contents("../json/sweeps.json");
$sweeps=json_decode($string, true);

$string = file_get_contents("../json/study_detail.json");
$studies=json_decode($string, true);

foreach ($sweeps as $key => $value) {
    $scales = array(); $disorders = array(); $subscales = array();
    foreach($sweeps[$key] as $sweep) {
        foreach($sweep as $subkey => $value) {
            if($subkey=='Subscales' && !in_array($value, $scales)) {
                array_push($subscales, $value); 
            }
            if($subkey=='Scale' && !in_array($value, $scales)) {
                array_push($scales, $value); 
            }
	        if($subkey=='Topic' && !in_array($value, $disorders)) {
                array_push($disorders, $value); 
            }
		}
	}
    $studies[$key]['Subscales']=implode('|',array_unique($subscales));
    $studies[$key]['Scales']=implode('|',array_unique($scales));
    $studies[$key]['Topics']=implode('|',array_unique($disorders));
}


@natcasesort($studies);
//var_dump($studies);
print(json_encode($studies));


?>