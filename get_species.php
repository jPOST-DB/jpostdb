<?php
    require_once( __DIR__ . '/classes/SparqlTool.php' );
    require_once( __DIR__ . '/classes/Config.php' );

    $parameters = $_REQUEST;
    $data = http_build_query( $parameters );
    $options = array(
        'http' => array(
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded'
        )
    );
    $url = Config::$SPARQLIST_URL . 'datasets_species';
    $url2 = $url . '?' . $data;
    $result = file_get_contents( $url2, false, stream_context_create( $options ) );
    $objects = json_decode( $result );

    header( 'content-type: application/json; charset=utf-8' );
    echo json_encode( $result );
?>