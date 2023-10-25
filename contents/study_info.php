<?php
$studyid=sanitize_xss($_GET["studyid"]);
$string = file_get_contents(dirname(__DIR__)."/json/study_detail.json");
$study_detail=json_decode($string, true);

function study_title() {
	global $study_detail;
    global $studyid;
    $title = '<img class="studyImage" src="img/studies/'.$studyid.'.png?202310" alt="" onerror=\'this.style.display="none"\'/>'.
             '<h1 class="h3 text-center text-sm-left mb-0 text-green-800 mr-auto">'.$study_detail[$studyid]['Title'].'</h1>';

    if($study_detail[$studyid]['HDR UK Innovation Gateway']) {
        $title = $title.
                '<a target="_blank" class="hdrLink" href="'.
                $study_detail[$studyid]['HDR UK Innovation Gateway'].
                '"><img class="studyImage" style="min-width:10rem;" src="img/HDRgateway.png" alt="HDR Gateway"/></a>';
    } else {
        // add in an empty div to ensure flexbox behaves normally either way
        $title = $title.
                '<div>&nbsp</div>';
    }
    return $title;


}

function sanitize_xss($value) {
	return htmlspecialchars(strip_tags($value));
}

function prettify_funders($funder_string) {
    $string = file_get_contents(dirname(__DIR__)."/json/funders.json");
    $funders=json_decode($string, true);
    foreach ($funders as $key => $value) {
        $replacement ='';
        if($value["Has image"] =="Y") {
            $replacement = '<div><a href="'.$value["Address"].'" target="_blank"><img class="funderImage" src="img/funders/'.$key.'.png" alt="'.$value["Funder name"].'"/></a></div>';
        } else {
            $replacement = '<div><a href="'.$value["Address"].'" target="_blank">'.$value["Funder name"].'</a><div>';
        }
        $funder_string = preg_replace('/\b'.$key.'\b/',$replacement, $funder_string);     
    }
    return $funder_string;
}



function study_cards() {
	$overview_card_fields = ["Aims","Geographic coverage - Nations", "Geographic coverage - Regions","Institution","Start date","Links","Most recent sweep","Ongoing?", "Updated"];
	$sample_card_fields =  ["Sample type","Sample details","Sample size at recruitment","Sample size at most recent sweep","Age at recruitment","Cohort year of birth","Sex"];
	$data_card_fields = ["Linkage to administrative data","Genetic data collected","Data access", "HDR UK Innovation Gateway"];
	$marker_card_fields = ["Reference paper"];
	$funder_card_fields = ["Funders"];
    $excluded_fields = ["Study design","Sample characteristics","Geographic coverage","Complementary data", "Physical Health Measures"];


	global $studyid;
	global $study_detail;
	$basic_card = file_get_contents(dirname(__DIR__)."/contents/study_card.content");
	$flex_card = file_get_contents(dirname(__DIR__)."/contents/flex_card.content");

    $overview_card = str_replace('{CARD_TITLE}', "Overview", $basic_card);
    $sample_card = str_replace('{CARD_TITLE}', "Sample", $basic_card);
    $data_card = str_replace('{CARD_TITLE}', "Data", $basic_card);
    $funder_card = str_replace('{CARD_TITLE}', "Funders", $flex_card);
    $marker_card = str_replace('{CARD_TITLE}', "Key Papers", $basic_card);
	$additional_card = str_replace('{CARD_TITLE}', "Additional information", $basic_card);
	$additional_card_body = '';
    $data_card_body = '';
    $sample_card_body = '';
    $marker_card_body = '';
    $overview_card_body = '';
    $funder_card_body = '';

	foreach ($study_detail[$studyid] as $key => $value) {
   		if($value && $key != 'Title') { 
			if (in_array($key, $overview_card_fields)) {
                if($key =="Updated") {
                    $overview_card_body = $overview_card_body.'<p><b>Catalogue record last updated</b><br>'.date('d/m/Y', $value).'</p>';
                } else {
				$overview_card_body = $overview_card_body.'<p><b>'.$key.'</b><br>'.$value.'</p>';
                }

			}
            elseif (in_array($key, $sample_card_fields)) {
                    $sample_card_body = $sample_card_body.'<p><b>'.$key.'</b><br>'.$value.'</p>';
            }
            elseif (in_array($key, $funder_card_fields)) {
                    $funder_card_body = $funder_card_body.prettify_funders($value);
            }
            elseif (in_array($key, $marker_card_fields)) {
                    $marker_card_body = $marker_card_body.'<p>'.$value.'</p>';
            }
            elseif (in_array($key, $data_card_fields)) {
                    if($key == 'HDR UK Innovation Gateway') {
                        $data_card_body = $data_card_body.'<p><b>'.$key.'</b><br>'.
                        '<a target="_blank" class="hdrLink" href="'.$value.'"><img class="studyImage" style="min-width:10rem;" src="img/HDRgateway.png" alt="HDR Gateway"/></a>';
                    } else {
                        $data_card_body = $data_card_body.'<p><b>'.$key.'</b><br>'.$value.'</p>';
                    }
            }
            elseif (!in_array($key, $excluded_fields)) {
                $additional_card_body = $additional_card_body.'<p><b>'.$key.'</b><br>'.$value.'</p>';
			}
   		}
	}
	print('<div class="row"><div class="col-md-6">');
    print(str_replace('{CARD_BODY}', $overview_card_body, $overview_card));
    print('</div><div class="col-md-6">');
    print(str_replace('{CARD_BODY}', $sample_card_body, $sample_card));
	print('</div></div><div class="row"><div class="col-md-6 col-lg-3 col-sm-6">');
    print(str_replace('{CARD_BODY}', $data_card_body, $data_card));
    print('</div><div class="col-md-6 col-lg-3 col-sm-6">');
    print(str_replace('{CARD_BODY}', $additional_card_body, $additional_card));
    print('</div><div class="col-md-6 col-lg-3 col-sm-6">');
    print(str_replace('{CARD_BODY}', $marker_card_body, $marker_card));
    print('</div><div class="col-md-6 col-lg-3 col-sm-6">');
    print(str_replace('{CARD_BODY}', $funder_card_body, $funder_card));
	print('</div></div>');


}

function study_menu() {
	global $study_detail;
        $basic_link='<a class="collapse-item" href="index.php?studyid={LINK_STUDYID}">{LINK_TITLE}</a>';
        foreach ($study_detail as $key => $value) {
  		$study_titles[$key]=$value['Title'];
	}


	foreach ($study_titles as $key => $value) {
                if($value) { 
                        $thislink=str_replace('{LINK_STUDYID}', $key, $basic_link);
                        $thislink= str_replace('{LINK_TITLE}',$value, $thislink);
                        print($thislink);
                }
        }
}



?>

