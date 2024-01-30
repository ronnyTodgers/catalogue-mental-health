<script src="js/search.js" defer></script>
<script src="vendor/search-string/search-string.js" defer></script>



<div class="container-fluid">
    <div class="d-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 text-gray-800">Browse or search studies and measures</h1>
    </div>
    <div class="row mb-4" style="flex-wrap: nowrap;align-items: center;">
        <input id="searchField" type="search" style="margin-right:0;" class="form-control"
            placeholder="Search for studies, measures, instruments…">
        <i class='fas fa-info-circle infobutton searchInfobutton' style="margin-right:auto;" data-toggle='tooltip'
            data-html='true' title='
        <p><Strong>Search tips</strong></p>
            <ul style="text-align:left;">
                <li style="text-align:left;">Each word you enter is included separately</li>
                <li>Words are <i>all</i> required to match by default, in other words <i>AND</i> is assumed</li>
                <li>You can specify alternate options with <i>or</i> e.g. Autism <i>or</i> ADHD will show you studies investigating either</li>
                <li>You can use (brackets) to separate groups of terms e.g. (Autism or ADHD) (SDQ or GHQ)</li>
                <li>"Quote phrases" that you want to include in your search as a phrase - if you do not they will be searched for as separate words</li>
                <li>You can negate a search term with - e.g. SDQ -GHQ will show you studies that include the SDQ but <i>not</i> the GHQ</li>
            </ul>'></i>
    </div>
    <div class="row mb-4">
        <div class="col">
            <H6 style="border: none;background: none;" class="h6 card-header" id="searchSummary"></H6>
        </div>
    </div>

    <div class="row mb-4 d-none">
        <input id="dateSliderState" type="search" autocomplete="on" class="form-control d-none" disabled>
        <input id="ageSliderState" type="search" autocomplete="on" class="form-control d-none" disabled>
        <input id="sizeSliderState" type="search" autocomplete="on" class="form-control d-none" disabled>
        <input id="relatedThemesState" type="search" autocomplete="on" class="form-control d-none" disabled>
    </div>
    <div class="row">
        <div class="col-md-4 col-lg-3 filterBox">
            <div class="card mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Filters
                        <span class="custom-control custom-switch" id="filtersToggleSpan" style="float: right;">
                            <input type="checkbox" checked="checked" class="custom-control-input" id="filtersToggle"
                                onchange="$(this).siblings('label').attr('title',$(this).prop('checked')?'Filters are active, click to disable':'Filters currently disabled, click to enable'); updateFilters(); ">
                            <label class="custom-control-label" for="filtersToggle"> </label>
                            <i title="Clear all filters" onclick="clearFilters();" id="clearFilters"
                                style="color:red; border:red solid 1px;padding:2px;" class="fas fa-times"></i>
                        </span>
                    </h6>
                </div>
                <div class="card filterCard mb-0">
                    <!-- Card Header - Accordion -->
                    <a href="#relatedThemesFilter" class="d-block card-header py-3 collapsed" data-toggle="collapse"
                        role="button" aria-expanded="true" aria-controls="collapseCardExample">
                        <h6 class="m-0 text-primary">Related measures</h6>
                    </a>
                    <!-- Card Content - Collapse -->
                    <div class="collapse" id="relatedThemesFilter">
                        <div class="card-body">
                            <div class="custom-control custom-switch mb-2 font-weight-bold font-style-italic">
                                <input type="checkbox" checked="checked" class="andOr toggleFilter custom-control-input"
                                    id="relatedAndOr"
                                    onchange="$(this).siblings('label').text($(this).prop('checked')?'All the selected filters':'Any of the selected filters'); ">
                                <label class="custom-control-label" for="relatedAndOr">All the selected filters</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card filterCard mb-0">
                    <!-- Card Header - Accordion -->
                    <a href="#complementaryDataFilter" class="d-block card-header py-3 collapsed" data-toggle="collapse"
                        role="button" aria-expanded="true" aria-controls="collapseCardExample">
                        <h6 class="m-0 text-primary">Complementary data</h6>
                    </a>
                    <!-- Card Content - Collapse -->
                    <div class="collapse" id="complementaryDataFilter">
                        <div class="card-body">
                            <div class="custom-control custom-switch mb-2 font-weight-bold font-style-italic">
                                <input type="checkbox" checked="checked" class="andOr toggleFilter custom-control-input"
                                    id="cdAndOr"
                                    onchange="$(this).siblings('label').text($(this).prop('checked')?'All the selected filters':'Any of the selected filters'); ">
                                <label class="custom-control-label" for="cdAndOr">All the selected filters</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card filterCard mb-0">
                    <!-- Card Header - Accordion -->
                    <a href="#studyDesignFilter" class="d-block card-header py-3 collapsed" data-toggle="collapse"
                        role="button" aria-expanded="true" aria-controls="collapseCardExample">
                        <h6 class="m-0 text-primary">Study design</h6>
                    </a>
                    <!-- Card Content - Collapse -->
                    <div class="collapse" id="studyDesignFilter">
                        <div class="card-body">
                            <div class="custom-control custom-switch mb-2 font-weight-bold font-style-italic">
                                <input type="checkbox" checked="checked" class="andOr toggleFilter custom-control-input"
                                    id="sdAndOr"
                                    onchange="$(this).siblings('label').text($(this).prop('checked')?'All the selected filters':'Any of the selected filters'); ">
                                <label class="custom-control-label" for="sdAndOr">All the selected filters</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card filterCard mb-0">
                    <!-- Card Header - Accordion -->
                    <a href="#sampleCharacteristicsFilter" class="d-block card-header py-3 collapsed"
                        data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseCardExample">
                        <h6 class="m-0 text-primary">Sample characteristics</h6>
                    </a>
                    <!-- Card Content - Collapse -->
                    <div class="collapse" id="sampleCharacteristicsFilter">
                        <div class="card-body">
                            <div class="custom-control custom-switch mb-2 font-weight-bold font-style-italic">
                                <input type="checkbox" checked="checked" class="andOr toggleFilter custom-control-input"
                                    id="scAndOr"
                                    onchange="$(this).siblings('label').text($(this).prop('checked')?'All the selected filters':'Any of the selected filters'); ">
                                <label class="custom-control-label" for="scAndOr">All the selected filters</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card filterCard mb-0">
                    <a href="#ageRangeFilter" class="d-block card-header py-3 collapsed" data-toggle="collapse"
                        role="button" aria-expanded="true" aria-controls="collapseCardExample">
                        <h6 class="m-0 text-primary">Age at recruitment</h6>
                    </a>
                    <!-- Card Content - Collapse -->
                    <div class="collapse" id="ageRangeFilter">
                        <div class="card-body filterSlider">
                            <input id="ageSlider" type="text">
                        </div>
                    </div>
                </div>
                <div class="card filterCard mb-0">
                    <a href="#sizeRangeFilter" class="d-block card-header py-3 collapsed" data-toggle="collapse"
                        role="button" aria-expanded="true" aria-controls="collapseCardExample">
                        <h6 class="m-0 text-primary">Sample size</h6>
                    </a>
                    <!-- Card Content - Collapse -->
                    <div class="collapse" id="sizeRangeFilter">
                        <div class="card-body filterSlider">
                            <input id="sizeSlider" type="text">
                        </div>
                    </div>
                </div>

                <div class="card filterCard mb-0">
                    <!-- Card Header - Accordion -->
                    <a href="#geographicCoverageFilter" class="d-block card-header py-3 collapsed"
                        data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseCardExample">
                        <h6 class="m-0 text-primary">Geographic coverage</h6>
                    </a>
                    <!-- Card Content - Collapse -->
                    <div class="collapse" id="geographicCoverageFilter">
                        <div class="card-body">
                            <div class="custom-control custom-switch mb-2 font-weight-bold font-style-italic">
                                <input type="checkbox" checked="checked" class="andOr toggleFilter custom-control-input"
                                    id="gcAndOr"
                                    onchange="$(this).siblings('label').text($(this).prop('checked')?'All the selected filters':'Any of the selected filters'); ">
                                <label class="custom-control-label" for="gcAndOr">All the selected filters</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card filterCard mb-0">
                    <a href="#dateRangeFilter" class="d-block card-header py-3 collapsed" data-toggle="collapse"
                        role="button" aria-expanded="true" aria-controls="collapseCardExample">
                        <h6 class="m-0 text-primary">Start date</h6>
                    </a>
                    <!-- Card Content - Collapse -->
                    <div class="collapse" id="dateRangeFilter">
                        <div class="card-body filterSlider">
                            <input id="dateSlider" type="text">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-8 col-lg-9">
            <div class="card">
                <div id="studyList" class="card-body">
                    <p>No results, please try a different search term or remove some filters.</p>
                </div>
            </div>
        </div>


    </div>
</div>