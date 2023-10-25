var searchData;
var searchField;
var originalSearchData;
var ageSlider;
var dateSlider;

var searchSwaps = [];
searchSwaps['ADHD'] = ['Hyperactivity', 'Inattention', 'Impulsivity', 'ADD', 'Hyperkinesis', 'Learning difficulty', 'Learning disorder', 'Neurodevelopmental disorder'];
searchSwaps['Hyperactivity'] = ['Inattention', 'ADHD', 'Impulsivity', 'ADD', 'Hyperkinesis', 'Learning difficulty', 'Learning disorder', 'Neurodevelopmental disorder'];
searchSwaps['Inattention'] = ['Hyperactivity', 'ADHD', 'Impulsivity', 'ADD', 'Hyperkinesis', 'Learning difficulty', 'Learning disorder', 'Neurodevelopmental disorder'];
searchSwaps['Autism'] = ['Asperger[’\']?s', 'Neurodevelopmental disorder'];
searchSwaps['Anxiety'] = ['Emotional problems', 'Phobia', 'Agoraphobia', 'Panic', 'GAD', 'Social anxiety', 'Fear'];
searchSwaps['Emotional problems'] = ['Anxiety', 'Phobia', 'Agoraphobia', 'Panic', 'GAD', 'Social anxiety', 'Fear'];
searchSwaps['Behavioural problems'] = ['Externalising', 'Externalizing', 'Conduct disorder', 'Conduct problems', 'ODD', 'Oppositional defiant disorder', 'Oppositionality', 'ASPD', 'CD', 'Delinquency'];
searchSwaps['Psychological Distress'] = ['Depression', 'Anxiety', 'Stress', 'Dysthymia', 'MDD', 'Major depression', 'Emotional problems', 'Depressive episode', 'Mood disorder'];
searchSwaps['Borderline personality disorder'] = ['Borderline', 'Emotionally unstable personality disorder', 'EUPD', 'BPD'];
searchSwaps['Borderline'] = ['Borderline personality disorder', 'Emotionally unstable personality disorder', 'EUPD', 'BPD'];
searchSwaps['Bipolar disorder'] = ['Mania', 'Manic depression', 'Bipolar affective disorder', 'BPAD', 'Mood disorder'];
searchSwaps['Mania'] = ['Bipolar disorder', 'Manic depression', 'Bipolar affective disorder', 'BPAD', 'Mood disorder'];
searchSwaps['Emotional Problems'] = ['Internalising', 'Internalizing', 'Depression', 'Anxiety'];
searchSwaps['Psychopathy'] = ['Callous-unemotional traits', 'Sociopathy'];
searchSwaps['Callous-unemotional traits'] = ['Psychopathy', 'Sociopathy'];
searchSwaps['Depression'] = ['Dysthymia', 'MDD', 'Major depression', 'Emotional problems', 'Depressive episode', 'Mood disorder'];
searchSwaps['Eating disorders'] = ['Anorexia', 'Bulimia', 'Binge eating', 'Feeding'];
searchSwaps['Antisocial personality disorder'] = ['Antisocial behaviour', 'Conduct disorder', 'Conduct problems', 'ODD', 'Oppositional defiant disorder', 'Oppositionality', 'ASPD', 'CD', 'Delinquency'];
searchSwaps['Antisocial behaviour'] = ['Antisocial personality disorder', 'Conduct disorder', 'Conduct problems', 'ODD', 'Oppositional defiant disorder', 'Oppositionality', 'ASPD', 'CD', 'Delinquency'];
searchSwaps['Alcohol use'] = ['Alcoholism', 'alcoholic', 'Addiction', 'AUD', 'Alcohol dependence', 'Alcohol abuse', 'Alcohol misuse', 'Alcohol problem', 'Fetal alcohol spectrum disorder', 'Fetal alcohol syndrome', 'FASD'];
searchSwaps['Substance use'] = ['Drug use', 'Drug abuse', 'Drug misuse', 'Drug problem', 'Substance abuse', 'Substance misuse', 'Substance dependence', 'Substance use disorder', 'Addiction', 'Illicit', 'SUD', 'Cannabis'];
searchSwaps['Smoking'] = ['Addiction', 'Cigarette', 'Pack year', 'Tobacco dependence'];
searchSwaps['Tobacco use'] = ['Addiction', 'Cigarette', 'Pack year', 'Tobacco dependence'];
searchSwaps['Gambling'] = ['Pathological gambling', 'Addiction', 'Gaming'];
searchSwaps['PTSD'] = ['Trauma', 'Stress'];
searchSwaps['Post-traumatic stress disorder'] = ['Trauma', 'Stress'];
searchSwaps['Schizophrenia'] = ['Hallucination', 'Psychosis', 'Schizotypal personality disorder', 'Delusion', 'Voices', 'Psychotic', 'Schizophreniform disorder'];
searchSwaps['Psychosis'] = ['Schizophrenia', 'Hallucination', 'Schizotypal personality disorder', 'Delusion', 'Voices', 'Psychotic', 'Schizophreniform disorder'];
searchSwaps['Schizotypal personality disorder'] = ['Schizophrenia', 'Psychosis', 'Hallucination', 'Delusion', 'Voices', 'Psychotic', 'Schizophreniform disorder'];
searchSwaps['Self harm'] = ['Suicide', 'Suicidality', 'Non-suicidal self-injury', 'NSSI', 'Self-injury', 'Self-mutilation', 'Cutting', 'Suicidal ideation'];
searchSwaps['Suicidality'] = ['Self harm', 'Suicide', 'Non-suicidal self-injury', 'NSSI', 'Self-injury', 'Self-mutilation', 'Cutting', 'Suicidal ideation'];
searchSwaps['Suicide'] = ['Self harm', 'Suicidality', 'Non-suicidal self-injury', 'NSSI', 'Self-injury', 'Self-mutilation', 'Cutting', 'Suicidal ideation'];
searchSwaps['Impairment'] = ['Disability', 'Impact'];
searchSwaps['Psychological wellbeing'] = ['Well being', 'Wellness', 'Well-being', 'Happiness', 'Life satisfaction'];
searchSwaps['Treatment and service use'] = ['Patient', 'Hospital', 'Psychiatry', 'Sectioned', 'Help seeking'];
searchSwaps['Treatment - medication'] = ['Antidepressant', 'Antipsychotic', 'Pharmacology', 'Prescription', 'Medicine'];
searchSwaps['Treatment - in-patient'] = ['Hospital', 'Involuntary', 'Section', 'sectioned', 'MHA', 'Mental Health Act'];
searchSwaps['Treatment - specialist'] = ['Psychotherapy', 'Psychology', 'Psychiatry', 'Talking therapy', 'Counselling', 'Counsellor'];
searchSwaps['Treatment and service use - school support'] = ['SEN', 'IEP', 'Teacher[’\']?s aid', 'Special school', 'Special needs school'];




$.getJSON('api/getSearchData.php', function (data) {
    searchData = data;
    originalSearchData = data;
    $(document).ready(function () {
        createFilters();
        $('#Covid-19_data_collection_during_pandemic').parent().addClass('mb-2').addClass('font-weight-bold').insertAfter($('#relatedAndOr').parent());
        $('[data-toggle="tooltip"]').tooltip({ container: 'body', boundary: 'window', offset: 0, customClass: "searchInfobuttonTooltip" });
        updateFilters(true);
        populateSearchFromUrl();
    });
});

// polyfill replaceAll for older browsers
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (str, newStr) {

        // If a regex pattern
        if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
            return this.replace(str, newStr);
        }

        // If a string
        return this.replace(new RegExp(str, 'g'), newStr);

    };
}

function uniqueArray(arr) {
    arr = arr.filter(function (item, i, ar) { return item !== '' && ar.indexOf(item) === i; });
    return arr;
}

function populateSearchFromUrl() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('query')) {
        $('#searchField').val(searchParams.get('query')).keyup();
    }
    if (searchParams.has('relatedThemes')) {
        $('#relatedThemesFilter').addClass('show');
        $('#' + searchParams.get('relatedThemes')).click();
    }
}

function parseNumbers(numStr, assumeDates, returnLargest, discountDates) {
    var returnLargest = returnLargest || false;
    var assumeDates = assumeDates || false;
    numStr = String(numStr);
    if (numStr.toLowerCase() == 'birth') { numStr = '0'; }
    var numbers = numStr.match(/\d+/g);

    if (!numbers) {
        console.log(numStr);
        return null;
    }

    // ensure all numbers are actually numbers and convert 2 digit dates to 4 digit

    for (i = 0; i < numbers.length; i++) {
        numbers[i] = Number(numbers[i]);
        if (isNaN(numbers[i])) console.log(numStr);
        if (assumeDates && numbers[i] < 100) { numbers[i] = 2000 + Number(numbers[i]); }
    }
    // if we are not looking for dates then discard any obvious dates
    if (discountDates) {
        numbers = numbers.filter(function (num) { return num < 1960 || num > 2030; })
    }
    if (returnLargest) {
        console.log(numbers);
        return (Math.max.apply(null, numbers));
    } else {
        return (numbers.sort(function (a, b) { return a - b }));
    }
}

function rangeOverlaps(arr1, arr2, preSorted) {
    if (arr1 == null || arr2 == null) return true;
    var preSorted = preSorted || false;
    var arrHigher; var arrLower;
    if (!preSorted) { arr1.sort(function (a, b) { return a - b }); arr2.sort(function (a, b) { return a - b }); }
    if (arr1[0] > arr2[0]) {
        arrHigher = arr1;
        arrLower = arr2;
    } else {
        arrHigher = arr2;
        arrLower = arr1;
    }
    return (Number(arrHigher[0]) <= Number(arrLower[arrLower.length - 1]));
}

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

function createFilters() {
    var relatedThemes = [];
    var studyDesign = [];
    var sampleCharacteristics = [];
    var geographicCoverage = [];
    var complementaryData = [];
    var starts = [];
    var ages = [];
    var sizes = [];
    $.each(searchData, function (key, val) {
        if (val['Related themes']) relatedThemes = relatedThemes.concat(val['Related themes'].split(','));
        if (val['Study design']) studyDesign = studyDesign.concat(val['Study design'].split(','));
        if (val['Sample characteristics']) sampleCharacteristics = sampleCharacteristics.concat(val['Sample characteristics'].split(','));
        if (val['Geographic coverage']) geographicCoverage = geographicCoverage.concat(val['Geographic coverage'].split(','));
        if (val['Complementary data']) complementaryData = complementaryData.concat(val['Complementary data'].split(','));
        let start = parseNumbers(String(val['Start date']), true);
        if (start !== null) { starts = starts.concat(start); }
        let age = parseNumbers(String(val['Age at recruitment']), false, false, true);
        if (age !== null) { ages = ages.concat(age); }
        //need to strip commas from sizes as they are often in the format 11,111
        let size = parseNumbers(String(val['Sample size at recruitment']).replaceAll(',', ''), false, true);
        if (size !== null) { sizes = sizes.concat(size); }
    });
    for (var i = 1; i < relatedThemes.length; i++) {
        relatedThemes[i] = relatedThemes[i].trim();
        relatedThemes[i] = relatedThemes[i].charAt(0).toUpperCase() + relatedThemes[i].substr(1);
    }
    for (var i = 1; i < studyDesign.length; i++) {
        studyDesign[i] = studyDesign[i].trim();
        studyDesign[i] = studyDesign[i].charAt(0).toUpperCase() + studyDesign[i].substr(1);
    }
    for (var i = 1; i < sampleCharacteristics.length; i++) {
        sampleCharacteristics[i] = sampleCharacteristics[i].trim();
        sampleCharacteristics[i] = sampleCharacteristics[i].charAt(0).toUpperCase() + sampleCharacteristics[i].substr(1);
    }
    for (var i = 1; i < geographicCoverage.length; i++) {
        geographicCoverage[i] = geographicCoverage[i].trim();
        geographicCoverage[i] = geographicCoverage[i].charAt(0).toUpperCase() + geographicCoverage[i].substr(1);
    }
    for (var i = 1; i < complementaryData.length; i++) {
        complementaryData[i] = complementaryData[i].trim();
        complementaryData[i] = complementaryData[i].charAt(0).toUpperCase() + complementaryData[i].substr(1);
    }
    relatedThemes = uniqueArray(relatedThemes).sort();
    studyDesign = uniqueArray(studyDesign).sort();
    sampleCharacteristics = uniqueArray(sampleCharacteristics).sort();
    geographicCoverage = uniqueArray(geographicCoverage).sort();

    // Put Local and National at the start
    geographicCoverage.unshift(geographicCoverage.splice(geographicCoverage.indexOf("National"), 1)[0]);
    geographicCoverage.unshift(geographicCoverage.splice(geographicCoverage.indexOf("Local area"), 1)[0]);

    //reorder study design
    arraymove(studyDesign, 0, 2);
    arraymove(studyDesign, 1, 0);
    arraymove(studyDesign, 4, 2);
    arraymove(studyDesign, 5, 6);




    complementaryData = uniqueArray(complementaryData).sort();
    $.each(relatedThemes, function (index, value) {
        let idValue = 'RM' + value.replaceAll(' ', '_');
        var checkbox = "<div class='custom-control custom-switch'><input type='checkbox' class='relatedThemesFilter toggleFilter form-control custom-control-input' id='" + idValue + "' value='" + value + "' name='" + value + "'><label class='custom-control-label' for='" + idValue + "'>" + value + "</label></div>"
        $("#relatedThemesFilter .card-body").append($(checkbox));
    })
    $.each(studyDesign, function (index, value) {
        let idValue = 'SD' + value.replaceAll(' ', '_');
        var checkbox = "<div class='custom-control custom-switch'><input type='checkbox' class='studyDesignFilter toggleFilter form-control custom-control-input' id='" + idValue + "' value='" + value + "' name='" + value + "'><label class='custom-control-label' for='" + idValue + "'>" + value + "</label></div>"
        $("#studyDesignFilter .card-body").append($(checkbox));
    })
    $.each(sampleCharacteristics, function (index, value) {
        let idValue = 'SC' + value.replaceAll(' ', '_');
        var checkbox = "<div class='custom-control custom-switch'><input type='checkbox' class='sampleCharacteristicsFilter toggleFilter form-control custom-control-input' id='" + idValue + "' value='" + value + "' name='" + value + "'><label class='custom-control-label' for='" + idValue + "'>" + value + "</label></div>"
        $("#sampleCharacteristicsFilter .card-body").append($(checkbox));
    })
    $.each(geographicCoverage, function (index, value) {
        let idValue = 'GC' + value.replaceAll(' ', '_');
        var checkbox = "<div class='custom-control custom-switch'><input type='checkbox' class='geographicCoverageFilter toggleFilter form-control custom-control-input' id='" + idValue + "' value='" + value + "' name='" + value + "'><label class='custom-control-label' for='" + idValue + "'>" + value + "</label></div>"
        $("#geographicCoverageFilter .card-body").append($(checkbox));
    })
    $.each(complementaryData, function (index, value) {
        let idValue = 'CD' + value.replaceAll(' ', '_');
        var checkbox = "<div class='custom-control custom-switch'><input type='checkbox' class='complementaryDataFilter toggleFilter form-control custom-control-input' id='" + idValue + "' value='" + value + "' name='" + value + "'><label class='custom-control-label' for='" + idValue + "'>" + value + "</label></div>"
        $("#complementaryDataFilter .card-body").append($(checkbox));
    })
    // add a gap before local
    $('#Local').parent('.custom-switch').addClass('mt-2');
    // add a gap before local
    $('#Household_panel_study').parent('.custom-switch').addClass('mt-2');
    $('#Twin_study').parent('.custom-switch').addClass('mt-2');


    starts = uniqueArray(starts).sort(function (a, b) { return a - b });
    ages = uniqueArray(ages).sort(function (a, b) { return a - b });
    sizes = uniqueArray(sizes).sort(function (a, b) { return a - b });
    $("#ageSlider").before("<div><b style='float:left;'>" + (ages[0] == 0 ? "Birth" : ages[0]) + "</b><b style='float:right;'>" + ages[ages.length - 1] + "</b></div>");
    ageSlider = $("#ageSlider").slider({
        min: Number(ages[0]),
        max: Number(ages[ages.length - 1]),
        value: [Number(ages[0]), Number(ages[ages.length - 1])],
        tooltip: 'always',
        formatter: function (value) {
            var values = String(value).split(',');
            return (values[0] == 0 ? "Birth" : values[0]) + ' - ' + values[1];
        }
    });

    $("#dateSlider").before("<div><b style='float:left;'>" + starts[0] + "</b><b style='float:right;'>" + starts[starts.length - 1] + "</b></div>");
    dateSlider = $("#dateSlider").slider({
        min: Number(starts[0]),
        max: Number(starts[starts.length - 1]),
        value: [Number(starts[0]), Number(starts[starts.length - 1])],
        tooltip: 'always',
        formatter: function (value) {
            var values = String(value).split(',');
            return values[0] + ' - ' + values[1];
        }

    });

    $("#sizeSlider").before("<div><b style='float:left;'>" + numberWithCommas(sizes[0]) + "</b><b style='float:right;'>" + numberWithCommas(sizes[sizes.length - 1]) + "</b></div>");
    sizeSlider = $("#sizeSlider").slider({
        min: sizes[0],
        max: Number(sizes[sizes.length - 1]),
        value: [1, Number(sizes[sizes.length - 1])],
        scale: 'logarithmic',
        tooltip: 'always',
        formatter: function (value) {
            if (value) {
                var values = String(value).split(',');
                return numberWithCommas(values[0]) + ' - ' + numberWithCommas(values[1]);
            }
        }

    });



}

function clearFilters() {
    localStorage.removeItem('relatedThemesState');
    localStorage.removeItem('studyDesignState');
    localStorage.removeItem('sampleCharacteristicsState');
    localStorage.removeItem('geographicCoverageState');
    localStorage.removeItem('complementaryDataState');

    $('#dateSlider, #ageSlider, .toggleFilter:not(".andOr")').off('change');


    dateSlider.slider('setValue', new Array(Number($('#dateRangeFilter .slider-handle').attr('aria-valuemin')),
        Number($('#dateRangeFilter .slider-handle').attr('aria-valuemax'))));
    ageSlider.slider('setValue', new Array(Number($('#ageRangeFilter .slider-handle').attr('aria-valuemin')),
        Number($('#ageRangeFilter .slider-handle').attr('aria-valuemax'))));
    sizeSlider.slider('setValue', new Array(Number($('#sizeRangeFilter .slider-handle').attr('aria-valuemin')),
        Number($('#sizeRangeFilter .slider-handle').attr('aria-valuemax'))));
    $('.toggleFilter:not(".andOr"):checked').each(function () { $(this).prop('checked', false); });
    $('#dateSlider, #ageSlider, #sizeSlider, .toggleFilter:not(".andOr")').change(function () {
        updateFilters();
    });
    updateFilters();
}


function updateFilters(firstRun) {
    var firstRun = firstRun || false;
    if (!firstRun && $('#filtersToggle').prop('checked') == false && $('#filtersToggle').is(':visible')) { updateSearchResults(originalSearchData); return true; }
    //Start from the original search dateRange
    var filteredData = originalSearchData;
    var dateRange = parseNumbers($('#dateSlider').val());
    var ageRange = parseNumbers($('#ageSlider').val());
    var sizeRange = parseNumbers($('#sizeSlider').val());
    var relatedThemesFilters = [];
    var studyDesignFilters = [];
    var sampleCharacteristicsFilters = [];
    var geographicCoverageFilters = [];
    var complementaryDataFilters = [];
    if ($('.relatedThemesFilter:checked').length) {
        $('.relatedThemesFilter:checked').each(function () { relatedThemesFilters.push(this.name); });
    }
    if ($('.studyDesignFilter:checked').length) {
        $('.studyDesignFilter:checked').each(function () { studyDesignFilters.push(this.name); });
    }
    if ($('.sampleCharacteristicsFilter:checked').length) {
        $('.sampleCharacteristicsFilter:checked').each(function () { sampleCharacteristicsFilters.push(this.name); });
    }
    if ($('.geographicCoverageFilter:checked').length) {
        $('.geographicCoverageFilter:checked').each(function () { geographicCoverageFilters.push(this.name); });
    }
    if ($('.complementaryDataFilter:checked').length) {
        $('.complementaryDataFilter:checked').each(function () { complementaryDataFilters.push(this.name); });
    }

    if (firstRun) {
        //load the filters from the fields if they are present to allow search / filter state to be preserved when navigating backwards
        var dateRangeState = localStorage.getItem('dateSliderState');
        var ageRangeState = localStorage.getItem('ageSliderState');
        var sizeRangeState = localStorage.getItem('sizeSliderState');
        var relatedThemesState = localStorage.getItem('relatedThemesState');
        var studyDesignState = localStorage.getItem('studyDesignState');
        var sampleCharacteristicsState = localStorage.getItem('sampleCharacteristicsState');
        var geographicCoverageState = localStorage.getItem('geographicCoverageState');
        var complementaryDataState = localStorage.getItem('complementaryDataState');
        try {
            if (dateRangeState) {
                $('#dateRangeFilter').collapse('show');
                dateRange = dateRangeState.split(',');
                dateSlider.slider('setValue', parseNumbers(dateRangeState));
            }
            if (sizeRangeState) {
                $('#sizeRangeFilter').collapse('show');
                sizeRange = sizeRangeState.split(',');
                sizeSlider.slider('setValue', parseNumbers(sizeRangeState));
            }
            if (ageRangeState) {
                $('#ageRangeFilter').collapse('show');
                ageRange = ageRangeState.split(',');
                ageSlider.slider('setValue', parseNumbers(ageRangeState));
            }
            if (relatedThemesState) {
                $('#relatedThemesFilter').collapse('show');
                relatedThemesFilters = relatedThemesState.split(',');
                $("#relatedAndOr").prop('checked', relatedThemesFilters[0] == "true");
                relatedThemesFilters.shift();
                for (i = 0; i < relatedThemesFilters.length; i++) {
                    $(".relatedThemesFilter[name='" + relatedThemesFilters[i] + "']").prop('checked', true);
                }
            }
            if (studyDesignState) {
                $('#studyDesignFilter').collapse('show');
                studyDesignFilters = studyDesignState.split(',');
                $("#sdAndOr").prop('checked', studyDesignFilters[0] == "true");
                studyDesignFilters.shift();
                for (i = 0; i < studyDesignFilters.length; i++) {
                    $(".studyDesignFilter[name='" + studyDesignFilters[i] + "']").prop('checked', true);
                }
            }
            if (sampleCharacteristicsState) {
                $('#sampleCharacteristicsFilter').collapse('show');
                sampleCharacteristicsFilters = sampleCharacteristicsState.split(',');
                $("#scAndOr").prop('checked', sampleCharacteristicsFilters[0] == "true");
                sampleCharacteristicsFilters.shift();
                for (i = 0; i < sampleCharacteristicsFilters.length; i++) {
                    $(".sampleCharacteristicsFilter[name='" + sampleCharacteristicsFilters[i] + "']").prop('checked', true);
                }
            }
            if (geographicCoverageState) {
                $('#geographicCoverageFilter').collapse('show');
                geographicCoverageFilters = geographicCoverageState.split(',');
                $("#gcAndOr").prop('checked', geographicCoverageFilters[0] == "true");
                geographicCoverageFilters.shift();
                for (i = 0; i < geographicCoverageFilters.length; i++) {
                    $(".geographicCoverageFilter[name='" + geographicCoverageFilters[i] + "']").prop('checked', true);
                }
            }
            if (complementaryDataState) {
                $('#complementaryDataFilter').collapse('show');
                complementaryDataFilters = complementaryDataState.split(',');
                $("#cdAndOr").prop('checked', complementaryDataFilters[0] == "true");
                complementaryDataFilters.shift();
                for (i = 0; i < complementaryDataFilters.length; i++) {
                    $(".complementaryDataFilter[name='" + complementaryDataFilters[i] + "']").prop('checked', true);
                }
            }
            //Attach Filter listeners
            $('#dateSlider, #ageSlider, #sizeSlider, .toggleFilter').off('change').change(function () {
                updateFilters();
            });
        } catch (e) {
            clearFilters();
        }
    }
    var filtersActive = false;
    if (relatedThemesFilters.length) {
        filtersActive = true;
        filteredData = filterItems(filteredData, function (study) {
            var regex;
            if ($('#relatedAndOr').prop('checked')) {
                regex = relatedThemesFilters.join("))(?=[\\s\\S]*(") + "))";
                regex = "^(?=[\\s\\S]*(" + regex.replace(/["]/g, '');
            } else {
                regex = relatedThemesFilters.join("|");
                regex = regex.replace(/["]/g, '');
            }
            regex = new RegExp(regex, "i");
            return regex.test(study['Related themes']);
        });
        localStorage.setItem('relatedThemesState',
            [$('#relatedAndOr').prop('checked')].concat(Array(relatedThemesFilters.join(','))));
    } else {
        localStorage.removeItem('relatedThemesState');
    }

    if (studyDesignFilters.length) {
        filtersActive = true;
        filteredData = filterItems(filteredData, function (study) {
            var regex;
            if ($('#sdAndOr').prop('checked')) {
                regex = studyDesignFilters.join("))(?=[\\s\\S]*(") + "))";
                regex = "^(?=[\\s\\S]*(" + regex.replace(/["]/g, '');
            } else {
                regex = studyDesignFilters.join("|");
                regex = regex.replace(/["]/g, '');
            }
            regex = new RegExp(regex, "i");
            return regex.test(study['Study design']);
        });
        localStorage.setItem('studyDesignState',
            [$('#sdAndOr').prop('checked')].concat(Array(studyDesignFilters.join(','))));
    } else {
        localStorage.removeItem('studyDesignState');
    }

    if (sampleCharacteristicsFilters.length) {
        filtersActive = true;
        filteredData = filterItems(filteredData, function (study) {
            var regex;
            if ($('#scAndOr').prop('checked')) {
                regex = sampleCharacteristicsFilters.join("))(?=[\\s\\S]*(") + "))";
                regex = "^(?=[\\s\\S]*(" + regex.replace(/["]/g, '');
            } else {
                regex = sampleCharacteristicsFilters.join("|");
                regex = regex.replace(/["]/g, '');
            }
            regex = new RegExp(regex, "i");
            return regex.test(study['Sample characteristics']);
        });
        localStorage.setItem('sampleCharacteristicsState',
            [$('#scAndOr').prop('checked')].concat(Array(sampleCharacteristicsFilters.join(','))));
    } else {
        localStorage.removeItem('sampleCharacteristicsState');
    }
    if (geographicCoverageFilters.length) {
        filtersActive = true;
        filteredData = filterItems(filteredData, function (study) {
            var regex;
            if ($('#gcAndOr').prop('checked')) {
                regex = geographicCoverageFilters.join("))(?=[\\s\\S]*(") + "))";
                regex = "^(?=[\\s\\S]*(" + regex.replace(/["]/g, '');
            } else {
                regex = geographicCoverageFilters.join("|");
                regex = regex.replace(/["]/g, '');
            }
            regex = new RegExp(regex, "i");
            return regex.test(study['Geographic coverage']);
        });
        localStorage.setItem('geographicCoverageState',
            [$('#gcAndOr').prop('checked')].concat(Array(geographicCoverageFilters.join(','))));
    } else {
        localStorage.removeItem('geographicCoverageState');
    }
    if (complementaryDataFilters.length) {
        filtersActive = true;
        filteredData = filterItems(filteredData, function (study) {
            var regex;
            if ($('#cdAndOr').prop('checked')) {
                regex = complementaryDataFilters.join("))(?=[\\s\\S]*(") + "))";
                regex = "^(?=[\\s\\S]*(" + regex.replace(/["]/g, '');
            } else {
                regex = complementaryDataFilters.join("|");
                regex = regex.replace(/["]/g, '');
            }
            regex = new RegExp(regex, "i");
            return regex.test(study['Complementary data']);
        });
        localStorage.setItem('complementaryDataState',
            [$('#cdAndOr').prop('checked')].concat(Array(complementaryDataFilters.join(','))));
    } else {
        localStorage.removeItem('complementaryDataState');
    }


    // Do not filter on age and date if the sliders colver the full range
    if ($('#dateRangeFilter .slider-handle').attr('aria-valuemin') == dateRange[0] &&
        $('#dateRangeFilter .slider-handle').attr('aria-valuemax') == dateRange[1]) {
        dateRange = false;
        localStorage.removeItem('dateSliderState');
    } else {
        filtersActive = true;
        filteredData = filterItems(filteredData, function (study) { return rangeOverlaps(parseNumbers(study['Start date'], true), dateRange); });
        localStorage.setItem('dateSliderState', dateRange.join(','));
    }
    if ($('#ageRangeFilter .slider-handle').attr('aria-valuemin') == ageRange[0] &&
        $('#ageRangeFilter .slider-handle').attr('aria-valuemax') == ageRange[1]) {
        ageRange = false;
        localStorage.removeItem('ageSliderState');
    } else {
        filtersActive = true;
        filteredData = filterItems(filteredData, function (study) { return rangeOverlaps(parseNumbers(study['Age at recruitment'], false, false, true), ageRange); });
        localStorage.setItem('ageSliderState', ageRange.join(','));
    }
    if ($('#sizeRangeFilter .slider-handle').attr('aria-valuemin') == sizeRange[0] &&
        $('#sizeRangeFilter .slider-handle').attr('aria-valuemax') == sizeRange[1]) {
        sizeRange = false;
        localStorage.removeItem('sizeSliderState');
    } else {
        filtersActive = true;
        filteredData = filterItems(filteredData, function (study) { return rangeOverlaps([parseNumbers(String(study['Sample size at recruitment']).replaceAll(',', ''), false, true)], sizeRange); });
        localStorage.setItem('sizeSliderState', sizeRange.join(','));
    }
    // hide the filtersToggle if there are no filters selected
    if (filtersActive) {
        $('#filtersToggleSpan').show();
        $('#filtersToggle').prop('checked', true);
    } else {
        $('#filtersToggleSpan').hide();
        $('#filtersToggle').prop('checked', false);
    }
    updateSearchResults(filteredData);
}


function createFunctionWithTimeout(callback, opt_timeout) {
    var called = false;
    function fn() {
        if (!called) {
            called = true;
            callback();
        }
    }
    setTimeout(fn, opt_timeout || 250);
    return fn;
}

function updateSearchResults(newSearchData, noAdditions) {
    var newSearchData = newSearchData || false;
    var noAdditions = noAdditions || false;
    var noHighlighting = false;
    var additions = [];

    if (newSearchData && Object.keys(newSearchData).toString() != Object.keys(searchData).toString()) {
        searchData = newSearchData;
    } else {
        //see if we need to update from the searchfield
        if (searchField == $('#searchField').val()) { return false; }
    }

    searchField = cleanSearchField($('#searchField').val(), noAdditions);
    console.log(searchField);
    additions = searchField[1];
    searchField = searchField[0];


    // The searchData object is already filtered to just matching studies when the filters are applied
    // If there is no search term then we should just display all studies in it
    // But if there is a search term then we display the matching list - with the search term highlighted.
    // Only execute a search if the term is at least minLength long
    const minLength = 2;
    var output = '';

    if (searchField.length > minLength) {
        searchField = searchField.replace(/ OR /gi, ' OR ');
        // quote any word which contains a - symbol ( eg GHQ-7 ) to stop it being treated as GHQ and -7
        // UNLESS IT'S ALREADY QUOTED!
        // convert special hyphens(–) to -
        searchField = searchField.replace(/(–)/gi, '-');
        searchField = searchField.replace(/(\w+-\w+)/gi, '"$&"');
        searchField = searchField.replace(/("+)/gi, '"');
        var searchArrayMap = stringSearch.simplify(stringSearch.parse(searchField));

        var excludedTerms = ["AND", "OR", "AU", "AS"]
        buildSearchRegex = function (arr) {
            var regexTerms = [];
            var verb = arr[0]; console.log(verb);
            if (verb == "And" || verb == "Or") {
                for (var i in arr[1]) {
                    regexTerms = regexTerms.concat(buildSearchRegex(arr[1][i]));
                }
                regexTerms = ["(" + regexTerms.join((verb == "And" ? "" : "|")) + ")"];
                return regexTerms;
            }
            if ((verb == "Text" || verb == "Exactly") &&
                arr[1].length > minLength &&
                excludedTerms.indexOf(String(arr[1]).toUpperCase) == -1) {
                console.log("adding term: " + arr[1]);
                return ("(?=([\\S\\s]*" + arr[1] + "))");
            }
            if (verb == "Pair" &&
                arr[2].length > minLength &&
                excludedTerms.indexOf(String(arr[2]).toUpperCase) == -1) {
                console.log("adding pair term: " + arr[1] + ": " + arr[2]);
                return ("(?=([\\S\\s]*" + arr[1] + "[^{]*:{[^}]*" + arr[2] + "))");
            }
            if (Array.isArray(arr[1])) {
                regexTerms = regexTerms.concat(buildSearchRegex(arr[1]));
            }
            if (verb == "Including" || verb == "Group") {
                return (["(" + regexTerms.join("") + ")"]);
            }
            if (verb == "Excluding") {
                return (["(?!(" + regexTerms.join("") + "))"]);
            }
            return regexTerms;
        }
        buildHighlightRegex = function (arr) {
            var regexTerms = [];
            var verb = arr[0]; console.log(verb);
            if (verb == "And" || verb == "Or") {
                for (var i in arr[1]) {
                    regexTerms = regexTerms.concat(buildHighlightRegex(arr[1][i]));
                }
                return regexTerms;
            }

            if ((verb == "Text" || verb == "Exactly") &&
                arr[1].length > minLength &&
                excludedTerms.indexOf(String(arr[1]).toUpperCase()) == -1) {
                console.log("adding highlight term: " + arr[1]);
                // Dont match terms inside links
                regexTerms.push("(" + arr[1] + ")");
            }
            if (verb == "Pair" && arr[2].length > minLength &&
                excludedTerms.indexOf(String(arr[2]).toUpperCase()) == -1) {
                console.log("adding highlight pair term: " + arr[1] + ": " + arr[2]);
                regexTerms.push(arr[1] + "[^<>]*<\\/b><br>[^<>]*(" + arr[2] + ")");;
            }

            if (verb != "Excluding" && Array.isArray(arr[1])) {
                regexTerms = regexTerms.concat(buildHighlightRegex(arr[1]));
            }
            return regexTerms;
        }

        console.log(searchArrayMap);
        var searchRegex = "^" + buildSearchRegex(searchArrayMap).join("");
        console.log(searchRegex);
        var searchRegex = new RegExp(searchRegex, "i");

        /*var andRegex = searchTerms.join("))(?=[\\s\\S]*(") + "))";
            andRegex = "^(?=[\\s\\S]*(" + andRegex.replace(/["]/g, '');
        */    //console.log (andRegex);
        var highlightRegex = buildHighlightRegex(searchArrayMap).join("|");
        highlightRegex = highlightRegex.replace(/["]/g, '');
        console.log(highlightRegex);
        if (highlightRegex.trim() == "") {
            //Nothing will be highlighted in this case (all negatives) so set a flag 
            noHighlighting = true;
        }
        var highlightRegex = new RegExp(highlightRegex, "ig");

        var outputs = [];
        var output = '';
        var count = 1;
        Object.keys(searchData)
            .sort()
            .forEach(function (key, idx) {
                let val = searchData[key];

                //Construct a search string
                var s = "";
                for (var i in val) {
                    s += i + ":{" + val[i] + "} ";
                }

                var thisOutput = ''
                var matches = [];
                var matchScore = 0
                if (searchRegex.test(s)) {
                    if (noHighlighting) {
                        thisOutput += '<div class="card shadow mb-4 searchResult" sid="' +
                            key +
                            '"><div class="card-header py-3"><h6 class="m-0 font-weight-bold text-primary d-flex align-items-center flex-wrap">';
                        thisOutput += '<img class="funderImage" src="img/studies/' + key + '.png?202310" alt="" onerror=\'this.style.display="none"\'/>' + val.Title + '</h6>';
                        thisOutput += '</div><div class="card-body">';
                        thisOutput += '<p>' + val['Aims'] + '</p>';
                        thisOutput += '</div></div>';
                    } else {
                        for (var i in val) {
                            var thisMatches = [];
                            var thisMatch;
                            while (thisMatch = highlightRegex.exec('<p><b>' + i + '</b><br>' + val[i])) {
                                thisMatches.push(getFirstGroupMatch(thisMatch));
                            }
                            if (thisMatches.length) {
                                thisMatches = uniqueArray(thisMatches);
                                matches[i] = thisMatches;
                            }
                        }
                        matchScore = Object.keys(matches).length;
                        if ('Title' in matches) matchScore += 10;

                        console.log(matches);
                        thisOutput += '<div class="card shadow mb-4 searchResult" sid="' +
                            key +
                            '"><div class="card-header py-3"><h6 class="m-0 font-weight-bold text-primary d-flex align-items-center flex-wrap">';
                        thisOutput += '<img class="funderImage" src="img/studies/' + key + '.png?202310" alt="" onerror=\'this.style.display="none"\'/>' + val.Title + '</h6>';
                        thisOutput += '</div><div class="card-body">';
                        if (!matches.length) {
                            thisOutput += '<p>' + val['Aims'] + '</p>';
                        }
                        for (var i in matches) {
                            matchString = '<p><b>' + i + '</b><br>' + val[i];
                            for (var match in matches[i]) {
                                var matchRegex = new RegExp(matches[i][match], "ig");
                                matchString = matchString.replace(matchRegex, '<span class="highlighted">$&</span>');
                            }
                            matchString = matchString.replace(/[\\|.][^<>]+$/, ' ...');
                            matchString = matchString.replace(/^[^<>]+[\\|.]/, '... ');
                            matchString = matchString.replace(/[\\|.][^<>]+[\\|.]/g, ' ... ');
                            thisOutput += matchString + '</p>';
                        }
                        thisOutput += '</div></div>';
                    }
                    thisOutput.score = matchScore;
                    outputs.push({ html: thisOutput, score: matchScore, sid: key });
                }
            });
        //sort by match score and construct the final output string
        outputs.sort(function (output1, output2) {
            if (output1.score < output2.score) return 1;
            if (output2.score < output1.score) return -1;
            if (output1.sid > output2.sid) return 1;
            if (output2.sid > output1.sid) return -1;
            return 0;
        });
        console.log(outputs);
        outputs.forEach(function (o) {
            output += o.html;
        }
        )
    } else {
        Object.keys(searchData)
            .sort()
            .forEach(function (key, idx) {
                let val = searchData[key];
                output += '<div class="card shadow mb-4 searchResult" sid="' +
                    key +
                    '"><div class="card-header py-3"><h6 class="m-0 font-weight-bold text-primary d-flex align-items-center flex-wrap">';
                output += '<img class="funderImage" src="img/studies/' + key + '.png?202310" alt="" onerror=\'this.style.display="none"\'/>' + val.Title + '</h6>';
                output += '</div><div class="card-body">';
                output += '<p>' + val['Aims'] + '</p>';
                output += '</div><a href="?content=study&studyid=' + key + '"></a></div>';
            });
    }


    if (output == '') { output = '<p>No results, please try a different search term or remove some filters.</p>'; }
    if ($('#studyList').html() != output) { $('#studyList').html(output); }
    var searchSummary = "";
    if (!noAdditions && additions.length) {
        searchSummary += "Adding the alternative terms: <i>" + additions.join(', ') + "</i> based on your search terms <a href='#' onclick='updateSearchResults(false, true);' >UNDO</a><br>";
    }
    searchSummary += "Studies found: " + $('#studyList .card').length;
    $('#searchSummary').html(searchSummary);
    $('.searchResult').click(function () {
        const ID = $(this).attr('sid');
        if (typeof gtag == 'function') {
            //setTimeout(function() {  window.location  = '?content=study&studyid='+ID ;}, 200);
            gtag('event', ID, {
                'event_label': 'Query: ' + $('#searchField').val() + ' RelThemes: ' + localStorage.getItem('relatedThemesState') + ' Date: ' + localStorage.getItem('dateSliderState') + ' Age: ' + localStorage.getItem('ageSliderState') + ' Size: ' + localStorage.getItem('sizeSliderState'),
                'event_category': 'SearchEnd',
                'transport_type': 'beacon',
                'event_callback':
                    createFunctionWithTimeout(function () {
                        window.location = '?content=study&studyid=' + ID;
                    })
            });
        } else {
            window.location = '?content=study&studyid=' + ID;
        }
    });
}



// get the first group integer index from a regex match object
function getFirstGroupMatch(match) {
    var bestMatch = -99;
    for (var i in match) {
        if (isNumeric(i) && Number(i) > bestMatch && typeof match[i] != "undefined")
            bestMatch = i;
    }
    return match[bestMatch];
}

function cleanSearchField(searchField, noAdditions) {
    var noAdditions = noAdditions || false;
    // remove characters that will break regex construction
    searchField = searchField.replace(/[|<>{[}&]]/g, ' ');
    var additions = [];
    // at present this does not substitue for negated terms (preceeded by -) 
    if (!noAdditions) {
        for (var i in searchSwaps) {
            var re = '(^|\\s|\\()' + searchSwaps[i].join("(\\s|$|\\))|(^|\\s|\\()") + '($|\\s|\\))';
            console.log(re);
            re = new RegExp(re, "ig");
            if (re.test(searchField)) {
                searchField = "(" + searchField + ') OR "' + i + '"';
                additions.push(i);
            }
        }
    }
    return new Array(searchField, additions);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function filterItems(data, predicate) {
    var result = {}, key;
    for (key in data) {
        if (data.hasOwnProperty(key) && predicate(data[key])) {
            result[key] = data[key];
        }
    }
    return result;
}


$('#searchField').keyup(function () {
    updateSearchResults();
});

function numberWithCommas(x) {
    if (x) return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
