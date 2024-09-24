<?php
if($_GET["studyid"]) {
   $studyid=sanitize_xss($_GET["studyid"]);
}

$string = file_get_contents("../json/sweeps.json");
$sweeps=json_decode($string, true);

print(json_encode($sweeps[$studyid]));

function sanitize_xss($value) {
	return htmlspecialchars(strip_tags($value));
}

?>