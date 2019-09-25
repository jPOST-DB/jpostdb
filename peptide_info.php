<?php
    require_once( __DIR__ . '/classes/SparqlTool.php' );
    require_once( __DIR__ . '/classes/HtmlTool.php' );
    require_once( __DIR__ . '/classes/Config.php' );

    $id = HtmlTool::getId();
    $url = Config::$SPARQLIST_URL . 'table_items_peptide';
    $result = SparqlTool::post( $url, array( 'peptide' => $id ) );

    header( 'content-type: application/json; charset=utf-8' );
    echo json_encode( $result );
?>
