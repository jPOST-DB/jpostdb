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
}

?>