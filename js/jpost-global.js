// filter
jpost.filters = [
    { title: 'Species',      name: 'species' },
    { title: 'Sample type',  name: 'sampleType' },
    { title: 'Cell line',    name: 'cellLine' },
    { title: 'Organ',        name: 'organ' },
    { title: 'Disease',      name: 'disease' },
    { title: 'Modification', name: 'modification' },
    { title: 'Instrument',   name: 'instrument' }
];

// global tables
jpost.globalTables = [];

// prepare filter
jpost.prepareFilter = function() {
    $( '#filter_title_button' ).click( jpost.toggleFilterForm );
}

// toggle filter form
jpost.toggleFilterForm = function() {
    var status = $( '#filter_body' ).css( 'display' );
    if( status === 'none' ) {
        $( '#filter_body' ).css( 'display', 'block' );
        $( '#filter_title_icon' ).removeClass( 'fa-caret-down' );
        $( '#filter_title_icon' ).addClass( 'fa-caret-up' );
    }
    else {
        $( '#filter_body' ).css( 'display', 'none' );
        $( '#filter_title_icon' ).removeClass( 'fa-caret-up' );
        $( '#filter_title_icon' ).addClass( 'fa-caret-down' );
    }
}

// add form
jpost.addForm = function() {
    var id = jpost.formCount;
    jpost.formCount++;

    var tag = '<div id="filter_form_line' + id + '" class="form_line"></div>';
    $( '#filter_form' ).append( tag );

    jpost.addFormSelection( id );
    jpost.addFormText( id );
    jpost.addFormDeleteButton( id );
    jpost.addFilterChart( id );
    jpost.updateFilterForm( id );
}

// add form selection
jpost.addFormSelection = function( id ) {
    var value = jpost.getNextFormType();
    var tag = '<select id="form_selection' + id + '" style="width: 175px; margin-right: 10px;" '
            + 'name="filter' + id + '"></select>';
    $( '#filter_form_line' + id ).append( tag );

    jpost.filters.forEach( 
        function( filter ) {
            var tag = '<option value="' + filter.name + '">' + filter.title + '</option>';
            $( '#form_selection' + id ).append( tag );
        }
    );
    $( '#form_selection' + id ).val( value );
    $( '#form_selection' + id ).change(
        function() {
            jpost.updateFilterForm( id );
        }
    );
}

// get pie chart type name
jpost.getPieChartTypeName = function( type ) {
    var chartType = type;
    if( chartType === 'sampleType' ) {
        chartType = 'sample_type';
    }
    else if( chartType === 'cellLine' ) {
        chartType = 'cell_line';
    }
    return chartType;
}

// add filter chart
jpost.addFilterChart = function( id ) {
    var type = $( '#form_selection' + id ).val();
    type = jpost.getPieChartTypeName( type );
    var stanzaId = 'filter_chart' + id;
    var tag = '<div id="' + stanzaId + '" style="float: left;"></div>';
    $( '#filter_chart' ).append( tag );

    var stanzas = [
        {
            name: 'stat_pie_chart',
            id: stanzaId,
            data: function() {
                return {
                    type: type
                };
            }
        }
    ];
    jpost.loadStanzas( stanzas );
}

// gets the next form type
jpost.getNextFormType = function() {
    var parameters = $( '#filter_form' ).serializeArray();
    var values = [];
    parameters.forEach(
        function( parameter ) {
            values.push( parameter.value );
        }
    );
    var value = null;
    jpost.filters.forEach(
        function( filter ) {
            if( values.indexOf( filter.name ) < 0 ) {
                if( value === null ) {
                    value = filter.name;
                }
            }
        }
    );
    if( value === null ) {
        value = jpost.filters[ 0 ].name;        
    }
    return value;
}

// adds form text
jpost.addFormText = function( id ) {
    var tag = '<select type="text" id="form_selection' + id + '_value" '
            + 'style="display: none;" class="form_selection_value" '
            + 'name="filter' + id + '_value" multiple></select>';
    $( '#filter_form_line' + id ).append( tag );
}

// adds form delete button
jpost.addFormDeleteButton = function( id ) {
    var tag = '<a href="javascript:jpost.deleteForm( ' + id + ' )" '
            + 'class="fas fa-times-circle icon_button_red" '
            + 'style="margin-left: 10px;"></a>';
    $( '#filter_form_line' + id ).append( tag );
}

// delete form
jpost.deleteForm = function( id ) {
    $( '#filter_form_line' + id ).remove();
    $( '#filter_chart' + id ).remove();
    jpost.updateGlobalTables();
}

// update filter form
jpost.updateFilterForm = function( id ) {
    $( '#form_selection' + id + '_value' ).css( 'display', 'none' );

    var item = $( '#form_selection' + id ).val();

    $( '#form_selection' + id + '_value' ).val( null ).trigger( 'change' );
    $( '#form_selection' + id + '_value' ).select2(
        {
            ajax: {
                url: 'preset_list.php',
                type: 'GET',
                data: function( params ) {
                    return { item: item };
                },
                processResults: function( result, params ) {
                    var array = result.map(
                        function( object ) {
                            return { id: object.object, text: object.label };
                        }
                    );
                    return { results: array };
                }
            },
            width: '100%',
            tags: true
        }
    );

    $( '#form_selection' + id + '_value' ).css( 'display', 'inline' );
    $( '#form_selection' + id + '_value' ).change( jpost.updateGlobalTables );

    var stanzaId = 'filter_chart' + id;
    $( '#' + stanzaId ).html( '' );

    var type = jpost.getPieChartTypeName( item );

    var stanzas = [
        {
            name: 'stat_pie_chart',
            id: stanzaId,
            data: function() {
                return {
                    type: type
                };
            }
        }
    ];
    jpost.loadStanzas( stanzas );    
}

// create dataset table
jpost.createGlobalDatasetTable = function( id ) {
    table.createTable(
        id,
        {
            url: 'dataset_table.php',
            columns: jpost.getDatasetColumns(),
            parameters: function() {
                var params = jpost.getFilterParameters();
                return params;
            }
        },
        true
    );
}

// dataset columns
jpost.getDatasetColumns = function() {
    var checkHeader = '<input type="checkbox" id="dataset_all_check">'
    var columns = [
        {
            title: 'Dataset ID',
            field: 'dataset_id',
            format: function( dataset ) {
                var url = 'dataset/' + dataset.dataset_id;
                var tag = '<a href="' + url + '">' + dataset.dataset_id + '</a>';
                return tag;
            },
            width: 200
        },
        {
            title: 'Project ID',
            field: 'project_id',
            width: 200
        },
        {
            title: 'Project Title',
            field: 'project_title',
            width: 350
        },
        {
            title: 'Project Date',
            field: 'project_date',
            width: 180
        },
        {
            title: '#proteins',
            field: 'protein_count',
            width: 120,
            align: 'right'
        },
        {
            title: '#spectra',
            field: 'spectrum_count',
            width: 120,
            align: 'right'
        }
    ];
    return columns;
}

// get filter parameters
jpost.getFilterParameters = function() {
    var parameters = $( '#filter_form' ).serializeArray();
    var names = {};
    var data = {};

    parameters.forEach(
        function( parameter ) {
            var name = parameter.name;
            var value = parameter.value;

            if( name in names ) {
                name = names[ name ];
                data[ name ].push( value );
            }
            else {
                names[ name + "_value" ] = value;
                data[ value ] = [];
            }
        }
    );
    return data;
}

// create protein table
jpost.createGlobalProteinTable = function( id, dataset ) {
    table.createTable(
        id,
        {
            url: 'protein_table.php',
            columns: jpost.getProteinColumns(),
            parameters: function() {
                return { datasets: [ dataset ] };
            }
        },
        true
    );
}

// protein columns
jpost.getProteinColumns = function() {
    var columns = [
        {
            title: 'Protein Name',
            field: 'full_name',
            format: function( protein ) {
                var url = '/protein/' + protein.accession;
                var tag = '<a href="' + url + '">' + protein.full_name + '</a>';
                return tag;
            },
            width: 350
        },
        {
            title: 'Accession',
            field: 'accession',
            format: function( protein ) {
                var accession = protein.accession;
                var url = 'https://www.uniprot.org/uniprot/' + accession;
                var tag = '<a href="' + url + '">' + accession + '</a>';
                return tag;
            },
            width: 180
        },
        {
            title: 'ID',
            field: 'mnemonic',
            width: 180
        },
        {
            title: 'Length',
            field: 'length',
            width: 100,
            align: 'right'
        },
        {
            title: 'Sequence',
            field: 'sequence',
            width: 350,
        }
    ];
    return columns;
}


// update global tables
jpost.updateGlobalTables = function() {
    table.setPageNumber( 'datasets', 1 );
    table.updateTable( 'datasets' );

    table.setPageNumber( 'proteins', 1 );    
    table.updateTable( 'proteins');
}

