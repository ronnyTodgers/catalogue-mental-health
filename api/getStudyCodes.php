<?php

$string = file_get_contents("../json/study_detail.json");
$studies=json_decode($string, true);

print(json_encode(array_combine(array_keys($studies), array_column($studies, 'Title'))));

?>

