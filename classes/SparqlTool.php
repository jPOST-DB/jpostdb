<?php
    require_once( __DIR__ . '/Config.php' );

    class SparqlTool {
        public static function postSparqlist( $url, $parameters ) {
            if( $parameters === null ) {
                $parameters = array();
            }
            $data = http_build_query( $parameters );
            $options = array(
                'http' => array(
                    'method' => 'POST',
                    'header' => 'Content-Type: application/x-www-form-urlencoded'
                )
            );
            $url2 = $url . '?' . $data;
            $contents = file_get_contents( $url2, false, stream_context_create( $options ) );

            $data = json_decode( $contents, true );
            $keys = $data[ 'head' ][ 'vars' ];
            $bindings = $data[ 'results' ][ 'bindings' ];

            $array = array();

            foreach( $bindings as $element ) {
                $object = array();
                foreach( $keys as $key ) {
                    $object[ $key ] = $element[ $key ] [ 'value' ];
                }
                array_push( $array, $object );
            }
            return $array;
        }
    }
?>