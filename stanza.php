<?php
    require_once __DIR__ . '/classes/HtmlTool.php';
    require_once __DIR__ . '/classes/Config.php';

    $service = Config::$DEFAULT_STANZA_SERVICE;
    $parameters = array(
        'service' => $service,
        'attributes' => array()
    );
    

    foreach( $_REQUEST as $key => $value ) {
        if( $key === 'stanza') {
            $parameters[ 'stanza' ] = $value;
        }
        else {
            $attribute = array(
                'key' => $key,
                'value' => $value
            );
            array_push( $parameters[ 'attributes' ], $attribute );
        }
    }

    HtmlTool::render( 'stanza.html', $parameters );
?>