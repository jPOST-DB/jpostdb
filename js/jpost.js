var jpost = {};

// form count
jpost.formCount = 0;

// tab
jpost.tab = 'search';

// tab
jpost.openTab = function( name ) {
    $( '.main_tab_field' ).css( 'display', 'none' );
    $( '#' + name + '_panel' ).css( 'display', 'block' );
    if( name == 'search' && jpost.tab == 'search' ) {
        $( '#main_search_panel' ).css( 'display', 'block' );
        $( '#sub_search_panel' ).css( 'display', 'none' );
    }
    jpost.tab = name;
}

// load stanza
jpost.loadStanzas = function( stanzas ) {
    stanzas.forEach(
        function( stanza ) {
            var url = 'stanza.php?stanza=' + stanza.name;;
            var params = stanza.data();
            var width = 250;
            var height = 250;
            if( 'width' in stanza ) {
                width = stanza.width;
            }
            if( 'height' in stanza ) {
                height = stanza.height;
            }
            for( key in params ) {
                var string = key + '=' + encodeURI( params[ key ] );
                url += '&' + string;
            }
            $( '#' + stanza.id ).load( url );            

        }
    );
}

// change tab
jpost.changeTabPanel = function( name, group ) {
    $( '.' + group + '_tab_pane' ).css( 'display', 'none' );
    $( '.' + group + '_tab_button' ).removeClass( 'tab_active' );
    $( '#' + name + '_tab_pane' ).css( 'display', 'block' );
    $( '#' + name + '_tab_button' ).addClass( 'tab_active' );
}


