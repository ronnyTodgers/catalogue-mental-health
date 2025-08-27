﻿<div class="container-fluid">
    <h1 class="h3 mb-4 text-gray-800">Input from the public</h1>
    <div class="card mb-4">
        <div class="card-body">
            <p><strong>How and why should longitudinal studies consider input from the public?</strong></p>
            <p>Longitudinal research studies rely on the sustained participation of individuals over time to gather
                valuable information about their lives. These participants are typically members of specific
                communities, such as patient groups or age-based cohorts.</p>
            <p>Because the data provided by participants reflect the experiences and characteristics of these specific
                populations, the findings from such studies often aim to identify trends and patterns within these
                groups. Some studies focus on understanding the emergence of particular health conditions, such as
                mental health conditions, over time.</p>
            <p>Although the data collected in longitudinal studies is intended to benefit the public, many people are
                unaware of the various ways they can become involved. By leveraging public input, researchers can
                enhance the quality of the data collected, improve participant retention, and ensure the effective
                communication of study results. Most importantly, involving the public helps maintain the integrity of
                the research by ensuring its relevance to the communities it seeks to represent.</p>
            <p>In recent developments of the Catalogue, we engaged with members of the <a
                    href="https://datamind.org.uk/patients-and-public/the-super-research-advisory-group/">DATAMIND Super
                    Research Advisory Group</a> to uphold the integrity of the project. Through this process, we also
                identified three key ways researchers can involve the public in longitudinal studies:</p>
            <ol>
                <li><strong>Participation:</strong> Participants contribute by enrolling in studies and providing data
                    through repeated interactions over time.</li>
                <li><strong>Engagement:</strong> Research teams actively connect with individuals and communities to
                    share study updates and findings.</li>
                <li><strong>Involvement: </strong>Members of the public are involved throughout the duration of a study
                    to ensure that its methodology and objectives remain relevant, meaningful and sensitive. This can
                    include input from participants, patients and/or the public through <strong>Patient and Public
                        Involvement (PPI). </strong>It can also be through advice from <strong>Lived Experience Experts
                        (LEEs)</strong> who have personal experience of the research topic (e.g., a mental health
                    condition).</li>
            </ol>
            <p><strong>Participation</strong>, <strong>engagement</strong>, and <strong>involvement </strong>can be
                incorporated at various stages of longitudinal studies and in diverse ways. While these approaches
                require dedicated resources from research teams, they offer significant benefits that enhance the
                overall quality of the research. The key step forward is for researchers and the public to become more
                aware of the opportunities for public involvement in longitudinal studies. To support this awareness,
                the following infographics illustrate the various avenues for engagement.</p>
            <div class="row mb-2">
                <?php
				$card = file_get_contents(dirname(__DIR__)."/contents/poster_card.content");
						$posters = array('Participation','Engagement', 'Involvement');
						foreach ($posters as $title){
							$pdf = "PPI_poster-" . $title . ".pdf";
							
							$thisCard = str_replace("{CARD_TITLE}", ucwords($title), $card);
							$thisCard = str_replace("{THUMB}", "PPI-" . $title . ".png", $thisCard);
							$thisCard = str_replace("{link}", "newsletters/" . $pdf, $thisCard);

							print('<div class="col-lg-4 col-sm-12">');
							print($thisCard);
							print('</div>');
						}
				?>
            </div>
            <p><strong>How has the Catalogue considered and implemented input from the public?</strong></p>
            <p>We collaborated with the <a
                    href="https://datamind.org.uk/patients-and-public/the-super-research-advisory-group/">DATAMIND Super
                    Research Advisory Group (SRAG)</a> on a project funded by the <a
                    href="https://www.hdruk.ac.uk/">Health Data Research UK (HDR UK) Alliance</a> and guided by the <a
                    href="https://ukhealthdata.org/news/pan-uk-data-governance-steering-group-makes-progress-in-improving-transparency-in-the-use-of-health-data-for-research/">HDR
                    UK Transparency Standards.</a></p>
            <p>The project was a three-part endeavour to increase transparency in research processes, specifically for
                longitudinal research, where the following was achieved:</p>
            <ul>
                <li>The DATAMIND <strong>glossary </strong>was expanded to incorporate definitions of specialist terms
                    commonly used in longitudinal research, in consultation with researchers and members of the public
                    to ensure clarity and inclusivity. Explore the glossary <a
                        href="https://datamind.org.uk/glossary/">here</a>.</li>
                <li>Three <strong>infographics </strong>were designed (featured above) to illustrate the collaborative
                    process between researchers and the public in longitudinal research, highlighting challenges and
                    avenues for collaboration. These infographics are free to download and use as they are intended for
                    anyone involved or interested in longitudinal research.</li>
                <li>Previous study descriptions on the Catalogue were revised into <strong>short, accessible
                        summaries</strong> for all our featured studies, enhancing the transparency of information for
                    both researchers and the public.</li>
            </ul>
            <p>To find out more, please reference the International Journal of Population Data Science (IJPDS) special,
                the poster we presented at the HDR UK Transparency Showcase in May 2024 (and won an award for!) and a
                blog by our 2023-2034 psychology undergraduate placement students, Hannah Lewis and Maria Jose Rodriguez
                Pinzon, hosted on the DATAMIND website.</p>


            <div class="row mb-2">
                <?php
				$card = file_get_contents(dirname(__DIR__)."/contents/poster_card_short.content");	
						$thisCard = str_replace("{CARD_TITLE}", "IJPDS special", $card);
						$thisCard = str_replace("{THUMB}", "IJPDS_screenshot.PNG", $thisCard);
						$thisCard = str_replace("{link}", "https://ijpds.org/article/view/2444", $thisCard);

						print('<div class="col-lg-4 col-sm-12">');
						print($thisCard);
						print('</div>');

                        $thisCard = str_replace("{CARD_TITLE}", "Transparency Showcase Poster", $card);
						$thisCard = str_replace("{THUMB}", "PPI_transparency_poster.PNG", $thisCard);
						$thisCard = str_replace("{link}", "/newsletters/PPI_transparency_poster.pdf", $thisCard);

						print('<div class="col-lg-4 col-sm-12">');
						print($thisCard);
						print('</div>');

                        $thisCard = str_replace("{CARD_TITLE}", "DATAMIND website blog", $card);
						$thisCard = str_replace("{THUMB}", "PPI-Blog.png", $thisCard);
						$thisCard = str_replace("{link}", "https://datamind.org.uk/what-can-co-production-teach-us-reflections-from-undergraduate-psychology-students/", $thisCard);

						print('<div class="col-lg-4 col-sm-12">');
						print($thisCard);
						print('</div>');
						
				?>






            </div>
        </div>
    </div>
</div>