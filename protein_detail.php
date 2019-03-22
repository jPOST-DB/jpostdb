<?php
    require_once( __DIR__ . '/classes/HtmlTool.php' );
    require_once( __DIR__ . '/classes/HttpTool.php' );
    $parameters = array(
        'id' => $_REQUEST[ 'id' ]
    );
    HtmlTool::render( 'protein_detail.html', $parameters );
?>