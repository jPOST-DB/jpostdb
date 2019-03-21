var jpost = {};

// form count
jpost.formCount = 0;

// id count
jpost.idCount = 0;

// tab
jpost.openTab = function( name ) {
    $( '.main_tab_field' ).css( 'display', 'none' );
    $( '#' + name + '_panel' ).css( 'display', 'block' );
}

// load stanza
jpost.loadStanzas = function( stanzas ) {
    stanzas.forEach(
        function( stanza ) {
            var url = 'stanza.php?stanza=' + stanza.name;;
            var params = stanza.data();
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


