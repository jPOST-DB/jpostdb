<?php
    require_once( __DIR__ . '/classes/HttpTool.php' );
    require_once( __DIR__ . '/classes/Config.php' );

    $item = $_REQUEST[ 'item' ];
    $parameters = array( 'type' =>  $item );
    HttpTool::setFilterParameters( $parameters );

    unset( $parameters[ $item ] );
    unset( $parameters[ $item . '_s' ] );

    $data = http_build_query( $parameters );
    $options = array(
        'http' => array(
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded'
        )
    );


    $url = Config::$SPARQLIST_URL . 'stat_chart_filtering';
    $url2 = $url . '?' . $data;
    $result = file_get_contents( $url2, false, stream_context_create( $options ) );
    $result = json_decode( $result );

    $array = array();

    foreach( $result->data as $element ) {
        $item = $element->onclick_list[ 0 ];
        array_push( $array, $item );
    }

    header( 'content-type: application/json; charset=utf-8' );
    echo json_encode( $array );
?>
