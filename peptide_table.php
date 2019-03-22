<?php
    require_once( __DIR__ . '/classes/HttpTool.php' );
    $result = HttpTool::getGlobalTableData( 'dbi_peptide_table' );
    header( 'content-type: application/json; charset=utf-8' );
    echo json_encode( $result );
?>
