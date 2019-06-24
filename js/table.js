// dummy object for the namespace
table = {};

// column data
table.tables = [];

// id
table.id = 1;
table.dc = 1;

// default width
table.defaultWidth = 120;

// get ID
table.getId = function() {
    var id = table.id;
    table.id++;
    return id;
}

// create table
table.createTable = function( name, parameters, downloadable ) {
    $( '#' + name ).html( '' );
    table.setHeaders( name );
    var tableId = table.setTableTag( name );

    var columns = parameters.columns;

    parameters.sort = null;
    parameters.direction = null;
    parameters.id = null;

    table.tables[ name ] = parameters;
    table.setHeader( name, tableId, columns );

    table.setFooters( name, downloadable );    

    table.updateTable( name );
}

// set table tag
table.setTableTag = function( name ) {
    $( '#' + name ).css( 'width', '100%' );

    var innerId = name + '_inner';
    var tag = '<div id="' + innerId + '" class="inner"></div>';
    $( '#' + name ).append( tag );

    var tableId = name + '_table';
    tag = '<table id="' + tableId + '" class="table"></table>';
    $( '#' + innerId ).append( tag );

    return tableId;
}

// set header
table.setHeader = function( name, tableId, columns ) {
    var headerId = tableId + '_table_header';
    var bodyId = tableId + '_table_body';
    table.tables[ name ].bodyId = bodyId;

    var tag = '<thead><tr id="' + headerId + '"></tr></thead>';
    $( '#' + tableId ).append( tag );

    tag = '<tbody id="' + bodyId + '"></tbody>';
    $( '#' + tableId ).append( tag );
    
    var totalWidth = 0;
    var index = 0;
    
    columns.forEach(
        function( column ) {
            var width = table.defaultWidth;
            if( 'width' in column ) {
                width = column.width;
            }
            else {
                column.width = width;
            }
            column.index = index;
            totalWidth += width;
            table.addColumn( name, headerId, column );
            index++;
        }
    );

    $( '#' + tableId ).css( 'width', totalWidth );
}

// add column
table.addColumn = function( name, headerId, column ) {
    titleId = headerId + '_' + table.getId();
    column.id = titleId;

    var tag = '<th id="' + titleId + '">'
            + column.title + '<span id="' + titleId + '_icon" class="table_icon"></th>';

    $( '#' + headerId ).append( tag );

    if( 'width' in column ) {
        $( '#' + titleId ).css( 'width', column.width + 'px' );
    }

    $( '#' + titleId ).click(
        function() {
            table.sort( name, column );
        }
    );
}

// sort table
table.sort = function( name, column ) {
    if( !( 'field' in column ) ) {
        return;
    }

    var parameters = table.tables[ name ];
    var property = column.field;
    var direction = 'asc';
    if( parameters.sort === property && parameters.direction === 'asc' ) {
        direction = 'desc';
    }

    [ 'fas', 'fa-caret-up', 'fa-caret-down' ].forEach(
        function( cls ) {
            $( '.table_icon' ).removeClass( cls );
        }
    );

    var iconId = column.id + '_icon';

    $( '#' + iconId ).addClass( 'fas' );
    if( direction === 'desc' ) {
        $( '#' + iconId ).addClass( 'fa-caret-down' );
    }
    else {
        $( '#' + iconId ).addClass( 'fa-caret-up' );
    }

    parameters.sort = property;
    parameters.direction = direction;

    table.setPageNumber( name, 1 );



    table.updateTable( name );
}

// set the page number
table.setPageNumber = function( name, page ) {
    var pageNumberId = name + '_page_number';
    $( '#' + pageNumberId ).val( page );
}

// update table
table.updateTable = function( name ) {
    var parameters = table.tables[ name ];
    var bodyId = parameters.bodyId;

    $( '#' + bodyId ).html( '<div class="table_message">Now Loading...</div>' );

    parameters.dc = table.dc;
    table.dc++;

    var data = null;
    if( "parameters" in parameters ) {
        data = parameters.parameters();
    }
    if( data === null ) {
        data = {};
    }
    data.dc = parameters.dc;

    table.getPageParameters( name, data );
    table.getSortParameters( name, data );

    $.get(
        {
            url: parameters.url,
            data: data
        }
    ).then( 
        function( response ) {
            if( response.dc == parameters.dc ) {
                table.setTableData( name, response );
            }
        }
    );
}

// get page parameters
table.getPageParameters = function( name, data ) {
    var size = parseInt( $( '#' + name + '_page_size' ).val() );
    var page = parseInt( $( '#' + name + '_page_number' ).val() );
    
    data.limit = size;
    data.offset = size * ( page - 1 );
}

// get 
table.getSortParameters = function( name, data ) {
    var parameters = table.tables[ name ];
    data.sort = parameters.sort;
    data.direction = parameters.direction;
}

// set table data
table.setTableData = function( name, response ) {
    table.setTableDataInfo( name, response );
    table.setPageSelection( name, response );
    table.setPageButtons( name, response );   
    table.setTableDataList( name, response );
    table.setEtc( name, response );    
    table.setTableCell( name, response );
}

// set page selection
table.setPageSelection = function( name, response ) {
    var pageNumberId = name + '_page_number';

    var size = parseInt( $( '#' + name + '_page_size' ).val() );
    var page = parseInt( $( '#' + name + '_page_number' ).val() );
    var count = response.count;
    var maxPage = Math.ceil( count / size );

    $( '#' + pageNumberId ).html( '' );
    for( var i = 1; i <= maxPage; i++ ) {
        $( '#' + pageNumberId ).append( '<option>' + i + '</option>' );
    }

    $( '#' + pageNumberId ).val( page );
}

// set page buttons
table.setPageButtons = function( name, response ) {
    var buttonsId = name + '_buttons_box';
    $( '#' + buttonsId ).html( '' );

    var size = parseInt( $( '#' + name + '_page_size' ).val() );
    var page = parseInt( $( '#' + name + '_page_number' ).val() );
    var count = response.count;
    var maxPage = Math.ceil( count / size );

    var start = Math.max( 1, page - 3 );
    var end = Math.min( start + 6, maxPage );
    start = Math.max( 1, end - 6 );

    var id = name + '_page_button_first';
    var tag = '<button id="' + id + '" class="page_button"><span class="fas fa-angle-double-left"></button>';
    $( '#' + buttonsId ).append( tag );
    $( '#' + id ).click( 
        function() {
            table.changePage( name, 1 );
        }
    );

    id = name + '_page_button_prev';
    tag = '<button id="' + id + '" class="page_button"><span class="fas fa-angle-left"></button>';
    $( '#' + buttonsId ).append( tag );
    $( '#' + id ).click(
        function() {
            table.changePage( name, Math.max( page - 1, 1 ) );
        }
    );

    var pages = [];
    for( var i = start; i <= end; i++ ) {
        pages.push( i );
    }
    pages.forEach(
        function( pageNumber ) {
            id = name + '_page_button_' + pageNumber;

            tag = '<button id="' + id + '" class="page_button">' + pageNumber + '</button>';
            $( '#' + buttonsId ).append( tag );
            $( '#' + id ).click(
                function() {
                    table.changePage( name, pageNumber );
                }
            );
        }
    );

    id = name + '_page_button_next';
    tag = '<button id="' + id + '" class="page_button"><span class="fas fa-angle-right"></button>';
    $( '#' + buttonsId ).append( tag );
    $( '#' + id ).click(
        function() {
            table.changePage( name, Math.min( page + 1, maxPage ) );
        }
    );

    id = name + '_page_button_last';
    tag = '<button id="' + id + '" class="page_button"><span class="fas fa-angle-double-right"></button>';
    $( '#' + buttonsId ).append( tag );
    $( '#' + id ).click(
        function() {
            table.changePage( name, maxPage );
        }
    );
}

// change page
table.changePage = function( name, page ) {
    if( page < 0 ) {
        return
    }
    $( '#' + name + '_page_number' ) .val( page );
    table.updateTable( name );
}

// set table data info
table.setTableDataInfo = function ( name, response ) {
    var size = parseInt( $( '#' + name + '_page_size' ).val() );
    var page = parseInt( $( '#' + name + '_page_number' ).val() );
    var total = response.total;
    var count = response.count;
    var from = size * ( page - 1 ) + 1;
    if( from > count ) {
        from = count;
    }
    var to = from + response.data.length - 1;

    var message = 'Showing ' + from + ' to ' + to + ' of ' + count + ' entries';
    if( total !== count ) {
        message = message + ' (filtered from ' + total + ' entries)';
    }
    $( '#' + name + '_count_info' ).html( message );
}

// set table data list
table.setTableDataList = function( name, response ) {
    var parameters = table.tables[ name ];
    var columns = parameters.columns;

    $( '#' + parameters.bodyId ).html( '' );

    var row = 0;
    response.data.forEach(
        function( element ) {
            var id = name + '_element_' + row;
            var tag = '<tr id="' + id + '"></tr>'
            $( '#' + parameters.bodyId ).append( tag );
            if( 'css' in parameters ) {
                var css = parameters.css( element );
                if( css !== null ) {
                    for( style in css ) {
                        $( '#' + id ).css( style, css[ style ] );
                    }
                }
            }
            var col = 0;
            columns.forEach(
                function( column ) {
                    table.setTableCell( column, element, id, col );
                    col++;
                }
            );
            row++;
        }
    );
}

// set etc
table.setEtc = function( name, response ) {
    var parameters = table.tables[ name ];
    if( 'countClass' in parameters ) {
        var count = response.count;
        var text = count;
        if( 'countUpdate' in parameters ) {
            text = parameters.countUpdate( count );
        }
        $( '.' + parameters.countClass ).html( text );
    }
}

// set table cell
table.setTableCell = function( column, element, rowId, index ) {
    var id = rowId + '_' + index;
    var text = null;
    if( 'field' in column ) {
        text = element[ column.field ];
        $( '#' + id ).attr( { title: text } );
    }
    var title = text;
    if( 'format' in column ) {
        var format = column.format;
        text = format( element );
    }

    var tag = '<td id="' + id + '" title="' + title + '">' + text + '</td>';
    $( '#' + rowId ).append( tag );

    if( 'align' in column ) {
        $( '#' + id ).css( 'text-align', column.align );
    }
    $( '#' + id ).width( column.width + 'px' );
}

// set headers 
table.setHeaders = function( name ) {
    var headerId = name + '_table_header_field';
    var tag = '<div id="' + headerId + '" class="table_header_field"></div>';
    $( '#' + name ).append( tag );

    var pageSizeId = name + '_page_size';

    tag = '<div class="page_size_box">Page size: <select id="' 
        + pageSizeId + '" class="page_size"></select></div>';
    $( '#' + headerId ).append( tag );

    [ 10, 25, 50, 75, 100 ].forEach(
        function( size ) {
            tag = '<option value="' + size + '">' + size + '</option>';
            $( '#' + pageSizeId ).append( tag );
        }
    );
    var page = 10;
    $( '#' + pageSizeId ).val( page );

    $( '#' + pageSizeId ).change( 
        function() {
            $( '#' + name + '_page_number' ).val( 1 );
            table.updateTable( name );
        }
    );

    var countInfoId = name + '_count_info';
    tag = '<div id="' + countInfoId + '" class="count_info"></div>';
    $( '#' + headerId ).append( tag );

    $( '#' + headerId ).append( '<div style="clear: both;"></div>' );
}

// set footers
table.setFooters = function( name, downloadable ) {
    var pagerId = name + '_pager';
    var tag = '<div id="' + pagerId + '" class="pager"></div>';
    $( '#' + name ).append( tag );

    var pageNumberId = name + '_page_number';

    tag = '<div class="page_number_box">Page: <select id="'
        + pageNumberId + '" class="page_number"><option>1</option></select></div>';
    $( '#' + pagerId ).append( tag );
    $( '#' + pageNumberId ).val( 1 );
    $( '#' + pageNumberId ).change(
        function() {
            table.updateTable( name );
        }
    );

    if( downloadable ) {
        var downloadId = name + '_download_button';
        tag = '<div class="page_buttons"><button id="' + downloadId + '" class="operation_button"><span class="fas fa-download"></span></button></div>';
        $( '#' + pagerId ).append( tag );    
        $( '#' + downloadId ).click(
            function() {
                table.download( name );
            }
        );
    }

    var buttonsId = name + '_buttons_box';
    tag = '<div id="' + buttonsId + '" class="page_buttons"></div>';
    $( '#' + pagerId ).append( tag );

    $( '#' + pagerId ).append( '<div style="clear: both;"></div>' );    
}

// download
table.download = function( name ) {
    var parameters = table.tables[ name ];
    var data = null;
    if( "parameters" in parameters ) {
        data = parameters.parameters();
    }
    if( data === null ) {
        data = {};
    }
    data.limit = 25;
    table.getSortParameters( name, data );
    
    var count = data.limit;
    var offset = 0;
    var result = [];
    while( offset < count ) {
        data.offset = offset;
        $.ajax(
            {
                url: parameters.url,
                type: 'GET',
                data: data,
                async: false,
                success: function( response ) {
                    count = response.count;
                    offset = offset + data.limit;
                    response.data.forEach( 
                        function( element ) {
                            result.push( element );
                        }
                    )
                },
                error: function() {
                    count = 0;
                }
            }
        );
    }

    table.saveData( name, result );
}

table.saveData = function( name, result ) {
    var text = '';
    var headers = [];
    result.forEach( 
        function( element ) {
            if( text == '' ) {
                headers = Object.keys( element );
                headers.forEach(
                    function( key ) {
                        if( text !== '' ) {
                            text += "\t";
                        }
                        text += key;
                    }
                );
            }
            text += "\n";
            var tokens = [];
            headers.forEach(
                function( key ) {
                    value = element[ key ];
                    tokens.push( value );
                }
            );
            text += tokens.join( "\t" );
        }
    );

    var file = new File(
        [ text ],
        name + ".txt",
        {
            type: 'text/plain;charset=utf-8'
        }
    );
    saveAs( file );
}
