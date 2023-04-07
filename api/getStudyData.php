<?php
if($_GET["studyid"]) {
   $studyid=$_GET["studyid"];
} else {
   http_response_code(400); exit;
}

$string = file_get_contents("../json/study_detail.json");
$studies=json_decode($string, true);

print(json_encode($studies[$studyid]));


?>

