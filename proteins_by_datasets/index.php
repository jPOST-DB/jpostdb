<?php

    require_once(__DIR__ . '/../classes/Config.php');
    $datasets = $_REQUEST['datasets'];
    $accession = 'false';
    if(isset($_REQUEST['accession'])) {
        $accession = $_REQUEST['accession'];
    }
    $url = Config::$PROTEINS_API . '?datasets=' . $datasets . '&accession=' . $accession;
    $contents = file_get_contents($url);

    header( 'content-type: application/json; charset=utf-8' );
    echo $contents;

?>