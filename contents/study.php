<?php include(dirname(__DIR__).'/contents/study_info.php');?>
<input style='display:none;' type='text' id='studyid' value='<?php echo($_GET['studyid']); ?>' >

<div class="container-fluid">
    <div class="d-sm-flex align-items-center justify-content-between mb-4">
        <div class="d-sm-flex align-items-center justify-content-between w-100">
            <?php print(study_title()); ?>
        </div>
        <a id="MHMjumpLink" href="#timeline" class="d-sm-inline-block btn btn-primary">Jump to study timeline <i class="fas fa-arrow-down"></i></a>
    </div>  
    <?php study_cards($_GET['studyid']); ?>

    <div class="row">
       <div class="col-md-12">
        <div class="card shadow mb-4">
            <div id="timeline" class="card-header py-3">
                <h6 class="mb-4 font-weight-bold text-primary">Mental health measures timeline</h6>
                <div id="lineContGroup" class = "lineCont" > 
                    <div id="groupLine" class = "line">
                        <svg height="107px" width="100%" id="timeline-ranges" style="stroke:#b1e5a8;stroke-width:1.5">
                            <line id="timeline-ranges-line-1" x1="0" y1="7px" x2="0%" y2="100%"></line>
                            <line id="timeline-ranges-line-2" x1="14px" y1="7px" x2="100%" y2="100%"></line>
                        </svg>

                    </div>
                </div>
                <div id="lineCont" class = "lineCont"> 
                    <div id="line" class = "line"></div>
                    <div class="mt-2">
                    <p id="sweepTitle" class="sweepTitle text-primary" ><b>Sweep name: </b><span class="sweepTitleText"></span></p>
                    <p id="sweepCMage" class="sweepTitle text-primary" ><b>Cohort member age: </b><span class="sweepTitleText"></span></p>
                    <p id="sweepDates" class="sweepTitle text-primary" ><b>Data collection period: </b><span class="sweepTitleText" ></span></p>
                    <p id="sweepComment" class="sweepTitle text-primary text-truncate" ><b>Notes: </b><span class="sweepTitleText" ></span></p>
                    <p id="sweepPhysHealth" class="sweepTitle text-primary text-truncate" ><i class="fas fa-medkit"></i> <b>Physical health measures: </b><span class="sweepTitleText" ></span></p>
                    <p id="sweepTitleSuffix" class="sweepTitle text-primary" ><span></span></p>
                    </div>
                </div>
            </div>
           
            <table id="dataTable" class="display compact"></table>
        </div>
    </div>
</div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.1/TweenMax.min.js" defer></script>
<script src="js/timeline.js" defer></script>