<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Our news & updates over time</h1>
    <div class="card mb-4">
        <div class="card-body">
            <div class="row">
                <?php
				$card = file_get_contents(dirname(__DIR__)."/contents/newsletter_card.content");
						$newletters = preg_grep('~\.pdf$~', scandir("./newsletters/"));
						foreach (array_reverse($newletters) as $newsletter){
							$title = preg_replace('/CMHM newsletter [0-9]+ ([A-Z a-z 0-9]+)[.]pdf/', '${1}', $newsletter);
							$thumb = str_replace('.pdf', '.png', $newsletter);

							$thisCard = str_replace("{CARD_TITLE}", ucwords($title), $card);
							$thisCard = str_replace("{THUMB}", $thumb, $thisCard);
							$thisCard = str_replace("{PDF}", $newsletter, $thisCard);

							print('<div class="col-lg-4 col-md-6 col-sm-6">');
							print($thisCard);
							print('</div>');
						}
				?>
            </div>
        </div>
    </div>

</div>