<?php 
ob_start();
if(empty($_GET['content'])) {
    include ("contents/home.php");
      } elseif (file_exists("contents/".$_GET["content"].".php")) {
        include("contents/".$_GET["content"].".php"); 
        
      } else {
        include ("contents/not_yet.php");
      }
$pageContents = ob_get_contents();
ob_end_clean();
$pattern = "/<h1(.*?)>(.*?)<\/h1>/";
    preg_match_all($pattern, $pageContents, $matches);
    $subTitle = $matches[2] ? $matches[2][0] : false;
    ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Catalogue of Mental Health Measures<?php if($subTitle) echo(" - ".$subTitle); ?></title>

    <!-- Custom fonts for this template-->
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link
        href="https://fonts.googleapis.com/css?family=Lato:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap"
        rel="stylesheet">
    <link
        href="https://fonts.googleapis.com/css?family=Quicksand:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap"
        rel="stylesheet">

    <script src="vendor/jquery/jquery.min.js"></script>

    <link href="css/core.css?v5" rel="stylesheet">
    <link href="css/glossary.css" rel="stylesheet">
    <link rel="preload" href="css/timeline.css?v5" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="css/timeline.css">
    </noscript>
    <link rel="preload" href="vendor/datatables/dataTables.min.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="vendor/datatables/jquery.dataTables.min.css">
    </noscript>
    <link rel="preload" href="vendor/datatables/dataTables.min.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="vendor/datatables/jquery.dataTables.min.css">
    </noscript>
    <link rel="preload" href="vendor/bootstrap/bootstrap-slider.min.css" as="style"
        onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet" href="vendor/bootstrap/bootstrap-slider.min.css">
    </noscript>


    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    <link rel="apple-touch-icon" href="apple-touch-icon.png" />
    <link rel="apple-touch-icon" sizes="57x57" href="apple-touch-icon-57x57.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="apple-touch-icon-72x72.png" />
    <link rel="apple-touch-icon" sizes="76x76" href="apple-touch-icon-76x76.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="apple-touch-icon-114x114.png" />
    <link rel="apple-touch-icon" sizes="120x120" href="apple-touch-icon-120x120.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="apple-touch-icon-144x144.png" />
    <link rel="apple-touch-icon" sizes="152x152" href="apple-touch-icon-152x152.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon-180x180.png" />


</head>

<body id="page-top">


    <!-- Page Wrapper -->
    <div id="wrapper">
        <div id="wrapper-bg"> </div>

        <!-- Content Wrapper -->
        <div id="filter-records"></div>

        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">
                <!-- Topbar -->
                <div class="navWrapper mb-4">
                    <nav class="navbar navbar-expand-lg navbar-light bg-white mb-4 static-top topbar shadow">
                        <a href="?content=home"><img style="height:70px;" src="img/sitelogo.png" alt="Home" /></a>
                        <a href="?content=home" class="nav-link mr-auto d-lg-inline text-logo-600">Catalogue
                            of<br>Mental Health Measures</a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <!-- Topbar Navbar -->
                            <ul class="navbar-nav ml-auto">

                                <!-- Dropdown - About the Catalogue -->
                                <li class="nav-item dropdown no-arrow">
                                    <a class="nav-link dropdown-toggle" href="#" id="projectDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span class="mr-1 d-lg-inline text-gray-600">About the Catalogue</span>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="projectDropdown">
                                        <a class="dropdown-item" href="?content=1">
                                            Background
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=11">
                                            Who we are
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=2">
                                            How we work
                                        </a>

                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=12">
                                            Our funders & collaborators
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=17">
                                            Newsletters
                                        </a>
                                    </div>
                                </li>
                                <!-- Dropdown - Using the Catalogue -->
                                <li class="nav-item dropdown no-arrow">
                                    <a class="nav-link dropdown-toggle" href="#" id="mhwDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span class="mr-1 d-lg-inline text-gray-600">Longitudinal research</span>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="mhwDropdown">
                                        <a class="dropdown-item" href="?content=5">
                                            What are longitudinal studies?
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=4">
                                            UK studies & Covid-19
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=18">
                                            Longitudinal data resources </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=19">
                                            Upcoming studies </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=9">
                                            Online methods training
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=20">
                                            Input from the public
                                        </a>
                                        <!--   <a class="dropdown-item" href="/testing/api/spec">
                                            API specification
                                        </a> -->
                                    </div>
                                </li>
                                <!-- Dropdown - Training and ask the experts -->
                                <li class="nav-item dropdown no-arrow">
                                    <a class="nav-link dropdown-toggle" href="#" id="tateDropdown" role="button"
                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span class="mr-1 d-lg-inline text-gray-600">Exploring the Catalogue</span>
                                    </a>
                                    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="tateDropdown">
                                        <a class="dropdown-item" href="?content=3">
                                            How to use the Catalogue
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=6">
                                            Mental health & wellbeing topics </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=15">
                                            Personality & temperament topics </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=14">
                                            Physical health topics
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=7">
                                            Commonly used measures
                                        </a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="?content=13">
                                            FAQs
                                        </a>
                                    </div>
                                </li>
                                <!-- SearchLink -->
                                <li class="nav-item no-arrow navSearch">
                                    <a href="?content=search" class="nav-link">Search Mental Health Measures</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <!-- Page Heading -->
                <?php echo($pageContents); ?>

                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->

            <!-- Footer -->
            <footer class="sticky-footer px-4">
                <div class="footerWrapper ">
                    <div class="row col-12 flex-space-between d-flex flex-row align-items-center footerLeftLogoFlex">
                        <div class="contactus text-left my-auto d-flex align-items-center flex-row flex-grow-1">
                            <a href="https://www.kcl.ac.uk/ioppn/about/index" target="_blank"><img style="height:5rem"
                                    class=" " src="img/kcl_logo.png" /></a>
                            <p class="ml-4 mb-0"><b>CONTACT US</b><br>
                                Institute of Psychiatry, Psychology & Neuroscience<br>
                                King's College London<br>
                                E: <a href="mailto:cataloguemhm@kcl.ac.uk">cataloguemhm@kcl.ac.uk</a>
                            </p>
                        </div>
                        <div class="d-flex footerLogos mx-auto flex-grow-0 pr-4">
                            <div class="row flex-nowrap" style="align-items: end; justify-content:end">
                                <div class="footerLogoWrapper flex-grow-0 flex-shrink-2">
                                    <a href="https://www.hdruk.ac.uk/" target="_blank">
                                        <img style="height:2.5rem; margin-top:auto" src='img/HDRUK.png' />

                                    </a>
                                </div>
                                <div class="footerLogoWrapper flex-grow-2 w-50">
                                    <a href="https://www.closer.ac.uk/" target="_blank">
                                        <img style="height:4.5rem" src="img/closer_logo.svg" /></a>
                                </div>
                            </div>
                            <div class="row mx-auto flex-nowrap">
                                <div class="footerLogoWrapper flex-grow-0 ">
                                    <a href="https://www.ukri.org/councils/mrc/" target="_blank">
                                        <img style="height:3rem" src='img/funders/MRC.png' />
                                    </a>
                                </div>
                                <div class="footerLogoWrapper flex-grow-2 w-50">
                                    <img style="height:4.5rem" usemap="#esrcmap" src="img/esrc_logo.png" />
                                    <map name="esrcmap">
                                        <area shape="rect" coords="0,0,500,50" target="_blank"
                                            href="https://esrc.ukri.org/">
                                        <area shape="rect" coords="0,50, 500, 300" target="_blank"
                                            href="http://www.louise-arseneault.com/">
                                    </map>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="copyright my-0">
                        <p class="my-1">
                            <a href="/testing/api/spec" target="_blank" style="font-weight: 400;">
                                API specification</a> |
                            <a href="/sitemap.xml" target="_blank" style="font-weight: 400;">
                                Site map</a>
                        </p>

                        <p>
                            To reference the Catalogue, please use: Catalogue of Mental Health Measures
                            (<?php echo date("Y"); ?>).
                            Available at www.cataloguementalhealth.ac.uk
                        </p>
                    </div>
                </div>
                <div class="d-flex">
                    <div class="copyright col-6">
                        <span>Copyright &copy; <a href="https://www.louise-arseneault.com/" target="_blank">Louise
                                Arseneault</a>, <?php echo date("Y"); ?></span>
                    </div>
                    <div class="copyright col-6 text-right">
                        <span>Platform built by <a target="_blank" href="https://www.delosis.com">Delosis</a></span>
                    </div>
                </div>

            </footer>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>
    <div id="myCookieConsent">
        <a id="cookieRefuse" class="cookieRefuse cookieButton">NO!</a>
        <a id="cookieAccept" class="cookieButton">That's fine</a>
        <div>This website is using <b>anonymised</b> Google analytics to help us work out how to make it better! <a
                href="privacy.html">More&nbsp;details</a></div>
    </div>


    <!-- Bootstrap core JavaScript-->
    <script src="vendor/bootstrap/bootstrap-slider.min.js" defer></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js" defer></script>

    <!-- Core plugin JavaScript-->
    <script src="vendor/jquery-easing/jquery.easing.min.js" defer></script>

    <!-- Custom scripts for all pages-->
    <script src="js/cookie.js" defer></script>
    <script src="https://www.googletagmanager.com/gtag/js?id=UA-152615597-1" defer></script>
    <script defer>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'UA-152615597-1', {
        'anonymize_ip': true
    });
    </script>
    <script src="vendor/datatables/dataTables.min.js" defer></script>
    <script src="js/glossary.js" defer></script>

</body>

</html>