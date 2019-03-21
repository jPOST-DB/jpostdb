<?php
    require_once( __DIR__ . '/classes/SparqlTool.php' );
    require_once( __DIR__ . '/classes/Config.php' );

    $url = Config::$SPARQLIST_URL . 'dbi_get_preset';
    $result = SparqlTool::postSparqlist( $url, $_REQUEST );
    header( 'content-type: application/json; charset=utf-8' );
    echo json_encode( $result );
?>
