<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Studies to keep an eye out for...</h1>

    <div class="card mb-4">
        <div class="card-body">
            <p>This page highlights some of the <b>upcoming longitudinal and cohort studies</b> based in the UK.</p>
            <p>
                While these studies are <b>not currently longitudinal</b>, they will be valuable sources of data for
                mental
                health research, and will be featured on the Catalogue as they collect more data over time. </p>
            <p>
                Browse this page to find out more about these exciting up and coming studies.</p>
            <div class="row">
                <?php
function prettify_funders($funder_string) {
    $string = file_get_contents(dirname(__DIR__)."/json/funders.json");
    $funders=json_decode($string, true);
    foreach ($funders as $key => $value) {
        $replacement ='';
        if($value["Has image"] =="Y") {
            $replacement = '<div><a href="'.$value["Address"].'" target="_blank"><img class="funderImage my-2" src="img/funders/'.$key.'.png" alt="'.$value["Funder name"].'"/></a></div>';
        } else {
            $replacement = '<div><a href="'.$value["Address"].'" target="_blank">'.$value["Funder name"].'</a><div>';
        }
        $funder_string = preg_replace('/\b'.$key.'\b/',$replacement, $funder_string);     
    }
    return $funder_string;
}
function study_title($key, $study) {
    $title = '<img class="studyImage" src="img/studies/'.$key.'.png?202310" alt="" onerror=\'this.style.display="none"\'/>'.
             '<h6 class="m-0 ml-4 font-weight-bold text-primary">'.$study['Title'].'</h6>';

   
        // add in an empty div to ensure flexbox behaves normally either way
        $title = $title.
                '<div>&nbsp</div>';

    return $title;
}

                    $string = file_get_contents(dirname(__DIR__)."/json/upcoming_studies.json");
                    $studies=json_decode($string, true);
                    foreach ($studies as $key => $study) {
                        $card = file_get_contents(dirname(__DIR__)."/contents/upcoming_card.content");

                        $details='';
                        $card=str_replace('{CARD_TITLE}', study_title($key, $study), $card);
                        $card=str_replace('{OVERVIEW}', $study['Notes'], $card);
                        $card=str_replace('{FUNDERS}', prettify_funders($study['Funders']), $card);
                        $details = $details.'<p class="pr-2" style="width:50%;"><b>Study design</b><br>'.$study['Study design'].'</p>';
                        $details = $details.'<p class="pr-2" style="width:50%;"><b>Age at recruitment</b><br>'.$study['Age at recruitment'].'</p>';     
                        $details = $details.'<p class="pr-2" style="width:50%;"><b>Website</b><br>'.$study['Website'].'</p>';
                        $details = $details.'<p class="pr-2" style="width:50%;"><b>Start date</b><br>'.$study['Start date'].'</p>';
                        $card=str_replace("{DETAILS}", $details, $card);
                        print($card);
                    }

                ?>
            </div>
        </div>
    </div>
</div>