<?php

require_once __DIR__ . '/../vendor/autoload.php';

class HtmlTool {
    private static $loader = null;
    private static $twig = null;

    /**
     * initializes
     */
    private static function initialize() {
        if( self::$loader === null ) {
            self::$loader = new Twig_Loader_Filesystem( __DIR__ . '/../templates' );
        }
        if( self::$twig === null ) {
            self::$twig = new Twig_Environment( self::$loader );
        }
    }

    /**
     * renders
     * @param $template template name
     * @param $parameters parameters
     */
    public static function render( $template, $parameters ) {
        self::initialize();

        if( $parameters === null ) {
            $parameters = array();
        }
        echo self::$twig->render( $template, $parameters );
    }

    /**
     * gets the ID
     * @return ID
     */
    public static function getId() {
        $id = $_REQUEST[ 'id' ];
        return $id;
    }

    /**
     * gets the parameter
     */
    public static function getParameter( $key ) {
        $value = null;
        if( array_key_exists( $key, $_REQUEST ) ) {
            $value = $_REQUEST[ $key ];
        }
        return $value;
    }
}

?>