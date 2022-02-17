<?php
if($_GET["studyid"]) {
   $studyid=$_GET["studyid"];
}

$string = file_get_contents("../json/sweeps.json");
$sweeps=json_decode($string, true);

print(json_encode($sweeps[$studyid]));


?>

