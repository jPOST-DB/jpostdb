<?php
    require_once( __DIR__ . '/Config.php' );
    require_once( __DIR__ . '/SparqlTool.php' );

    class HttpTool {
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
        /**
         * set page parameters
         */
        public static function setPageParameters( &$parameters ) {
            self::setIntParameter( $parameters, 'limit' );
            self::setIntParameter( $parameters, 'offset' );
            $sort = self::getParameter( 'sort' );
            $direction = self::getParameter( 'direction' );
            if( $sort !== null && $sort !== '' && $direction !== null && $direction !== '' ) {
                $parameters[ 'order' ] = $sort;
                if( $direction === 'desc' ) {
                    $parameters[ 'desc' ] = 1;
                }
            }
        }

        /**
         * set int parameter
         */
        private static function setIntParameter( &$parameters, $name ) {
            $value = self::getParameter( $name );
            if( $value !== null ) {
                $parameters[ $name ] = intval( $value );
            }
        }
    
        /**
         * sets filter parameters
         */
        public static function setFilterParameters( &$parameters ) {
            $filters = array( 'species', 'sample_type', 'cell_line', 'organ', 'disease', 'modification', 'instrument', 'species_s', 'disease_s' );
            foreach( $filters as $filter ) {
                $array = self::getParameter( $filter );
                if( $array !== null ) {
                    $parameters[ $filter ] = join( ',', $array );
                }
            }
            $keywords = array( 'dataset_keywords', 'protein_keywords' );
            foreach( $keywords as $keyword ) {
                $parameters[ $keyword ] = self::getParameter( $keyword );
            }
        }
        
        /**
         * sets target
         */
        public static function setTarget( &$parameters ) {
            $array = self::getParameter( 'datasets' );
            if( $array != null ) {
                $parameters[ 'datasets' ] = join( ',', $array );
            }
            $array = self::getParameter( 'proteins' );
            if( $array != null ) {
                $parameters[ 'proteins' ] = join( ',', $array );
            }

            $peptides = self::getParameter( 'peptides' );
            if( $peptides != null ) {
                $parameters[ 'peptides' ] = $peptides;
            }
        }

        /**
         * gets the global table data
         */
        public static function getGlobalTableData( $api ) {
            $dc = self::getParameter( 'dc' );
            $url = Config::$SPARQLIST_URL . $api;
            $parameters = array( 'line_count' => 1 );
            self::setTarget( $parameters );
            $datasets = null;
            if( array_key_exists( 'datasets', $parameters ) ) {
                $datasets = $parameters[ 'datasets' ];
            }
            $total = 0;
            if( $datasets !== 'nothing' ) {
                $data = SparqlTool::postSparqList( $url, $parameters );
                $total = intval( $data[ 0 ][ 'line_count' ] );
            }
            $parameters = array();
            self::setTarget( $parameters );
            self::setFilterParameters( $parameters );
            $parameters[ 'line_count' ] = 1;
            $count = 0;
            if( $datasets !== 'nothing' ) {        
                $data = SparqlTool::postSparqList( $url, $parameters );
                $count = intval( $data[ 0 ][ 'line_count' ] );
            }
            $data = array();
            if( $datasets !== 'nothing' ) {
                unset( $parameters[ 'line_count' ] );
                self::setPageParameters( $parameters );
                $data = SparqlTool::postSparqList( $url, $parameters );
            }
            $result = array(
                'dc'   => $dc,
                'data' => $data,
                'count' => $count,
                'total' => $total
            );
            return $result;        
        }
    }
?>