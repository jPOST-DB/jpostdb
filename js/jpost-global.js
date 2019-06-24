// filter
jpost.filters = [
    { title: 'Species',      name: 'species' },
    { title: 'Sample type',  name: 'sample_type' },
    { title: 'Cell line',    name: 'cell_line' },
    { title: 'Organ',        name: 'organ' },
    { title: 'Disease',      name: 'disease' },
    { title: 'Modification', name: 'modification' },
    { title: 'Instrument',   name: 'instrument' }
];

jpost.filterChartIds = {};

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
    return chartType;
}

// add filter chart
jpost.addFilterChart = function( id ) {
    var type = $( '#form_selection' + id ).val();
    type = jpost.getPieChartTypeName( type );
    var stanzaId = 'filter_chart' + id;
    var clazz = 'pie_chart_stanza-' + type;
    var tag = '<div id="' + stanzaId + '" class="'
            + clazz + '"></div>';
    $( '#filter_chart' ).append( tag );

    jpost.loadPieChart( stanzaId, type );
}

// load pie chart
jpost.loadPieChart = function( stanzaId, type ) {
    var stanzas = [
        {
            name: 'stat_pie_chart',
            id: stanzaId,
            data: function() {
                var data = { type: type };

                var filter = jpost.getFilterParameters();
                jpost.filters.forEach(
                    function( item ) {
                        var name = item.name;
                        if( name in filter ) {
                            var value = filter[ name ];
                            if( value !== null && value !== undefined && value.length !== 0 ) {
                                data[ name ] = value.join( ',' );
                            }
                        }
                    }
                );
                return data;
            }
        }
    ];
    jpost.filterChartIds[ stanzaId ] = type;    
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
    var stanzaId = 'filter_chart' + id;
    $( '#' + stanzaId ).remove();
    delete jpost.filterChartIds[ stanzaId ];

    jpost.updateGlobalTables();
}

// update filter form
jpost.updateFilterForm = function( id ) {
    $( '#form_selection' + id + '_value' ).css( 'display', 'none' );

    var item = $( '#form_selection' + id ).val();
    if( item === 'sample_type' ) {
        item = 'sampleType';
    }
    if( item === 'cell_line' ) {
        item = 'cellLine';
    }

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
    jpost.loadPieChart( stanzaId, type );
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
            },
            countClass: 'dataset_table_tab_button',
            countUpdate: function( count ) {
                return 'Dataset (' + count + ')';
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
                var url = 'dataset.php?id=' + dataset.dataset_id;
                var tag = '<a href="' + url + '" target="_blank">' + dataset.dataset_id + '</a>';
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
                if( name === 'species' ) {
                    if( value.indexOf( 'TAX_' ) !== 0 ) {
                        name = 'species_s';
                        if( !( name in data ) ) {
                            data[ name ] = [];
                        }
                    }
                }
                else if( name == 'disease' ) {
                    if( value.indexOf( 'DOID_' ) !== 0 ) {
                        name = 'disease_s';
                        if( !( name in data ) ) {
                            data[ name ] = [];
                        }
                    }
                }
                data[ name ].push( value );
            }
            else {
                names[ name + "_value" ] = value;
                data[ value ] = [];
            }
        }
    );

    data.dataset_keywords = $( '#global_dataset_text' ).val();
    data.protein_keywords = $( '#global_protein_text' ).val();

    return data;
}

// 
jpost.addFilter = function( type, value, text  ) {
    var parameters = $( '#filter_form' ).serializeArray();
    var filter = jpost.getFilterParameters();
    var values = [];
    if( type in filter ) {
        values = filter[ type ];
    }

    if( values.indexOf( value ) >= 0 ) {
        return;
    }
    values.push( value );

    var flag = false;
    parameters.forEach(
        function( parameter ) {
            console.log( parameter );
            var id = parameter.name;
            var item = parameter.value;

            if( item === type && !flag ) {
                id = id.replace( 'filter', '' );
                id = 'form_selection' + id + '_value';

                var option = new Option( text, value, true, true );
                $( '#' + id ).append( option ).trigger( 'change' );
                $( '#' + id ).trigger( 
                    {
                        type: 'select2:select',
                        params: {
                            data: values
                        }
                    }
                );
                flag = true;                
            }
        }
    );
}

jpost.clearFilters = function( type ) {
    var parameters = $( '#filter_form' ).serializeArray();
    var flag = false;
    parameters.forEach(
        function( parameter ) {
            var id = parameter.name;
            var item = parameter.value;

            if( item === type && !flag ) {
                id = id.replace( 'filter', '' );
                id = 'form_selection' + id + '_value';

                $( '#' + id ).val( null ).trigger( 'change' );
                flag = true;                
            }
        }
    );    
}


// create protein table
jpost.createGlobalProteinTable = function( id, dataset ) {
    table.createTable(
        id,
        {
            url: 'protein_table.php',
            columns: jpost.getProteinColumns(),
            parameters: function() {
                var params = jpost.getFilterParameters();
                if( dataset !== null ) {
                    params.datasets = [ dataset ];
                }
                return params;
            },
            countClass: 'protein_table_tab_button',
            countUpdate: function( count ) {
                return 'Protein (' + count + ')';
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
                var url = 'protein.php?id=' + protein.accession;
                var tag = '<a href="' + url + '" target="_blank">' + protein.full_name + '</a>';
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

    jpost.updatePieCharts();
}

// update pie charts
jpost.updatePieCharts = function() {
    for( id in jpost.filterChartIds ) {
        jpost.loadPieChart( id, jpost.filterChartIds[ id ] );
    }
}

jpost.setPieChartFilter = function() {
    var filter = jpost.getFilterParameters();
    if( filter.species === null || filter.species.length === 0 ) {
        $( '.pie_chart' ).removeAttr( 'species' );
    }
    else {
        var species = filter.species.join( ',' );
        $( '.pie_chart' ).attr( 'species',  species );
    }
}

// open global dataset
jpost.openGlobalDataset = function( dataset ) {
    var url = 'dataset_detail.php?id=' + dataset;
    $( '#sub_search_panel' ).load( url );
    $( '#main_search_panel' ).css( 'display', 'none' );
    $( '#sub_search_panel' ).css( 'display', 'block' );    
}

// open global protein
jpost.openGlobalProtein = function( protein ) {
    var url = 'protein_detail.php?id=' + protein;
    $( '#sub_search_panel' ).load( url );
    $( '#main_search_panel' ).css( 'display', 'none' );
    $( '#sub_search_panel' ).css( 'display', 'block' );    
}

// open global protein
jpost.openGlobalPeptide = function( peptide ) {
    var url = 'peptide_detail.php?id=' + peptide;
    $( '#sub_search_panel' ).load( url );
    $( '#main_search_panel' ).css( 'display', 'none' );
    $( '#sub_search_panel' ).css( 'display', 'block' );    
}

// create dataset protein table
jpost.createDatasetProteinTable = function( id, dataset ) {
    table.createTable(
        id,
        {
            url: 'protein_table.php',
            columns: jpost.getProteinColumns(),
            parameters: function() {
                return { datasets: [ dataset ] };
            },
            countClass: 'protein_table_tab_button',
            countUpdate: function( count ) {
                return 'Protein (' + count + ')';
            }
        }
    );
}

// create dataset peptide table
jpost.createDatasetPeptideTable = function( id, dataset ) {
    table.createTable(
        id,
        {
            url: 'peptide_table.php',
            columns: jpost.getPeptideColumns(),
            parameters: function() {
                return { datasets: [ dataset ] };
            },
            countClass: 'peptide_table_tab_button',
            countUpdate: function( count ) {
                return 'Peptide (' + count + ')';
            }
        }
    );
}


// create protein peptide table
jpost.createProteinPeptideTable = function( id, protein ) {
    table.createTable(
        id,
        {
            url: 'peptide_table.php',
            columns: jpost.getPeptideColumns(),
            parameters: function() {
                return { proteins: [ protein ] };
            },
            countClass: 'peptide_table_tab_button',
            countUpdate: function( count ) {
                return 'Peptide (' + count + ')';
            }
        }
    );
}

// get peptide columns
jpost.getPeptideColumns = function() {
    var columns = [
        {
            title: 'ID',
            field: 'peptide_id',
/*            
            format: function( peptide ) {
                var id = peptide.peptide_id;
                var url = "javascript:jpost.openGlobalPeptide( '" + id + "' )";
                var tag = '<a href="' + url + '">' + id + '</a>';
                return tag;
            },
*/            
            width: 250
        },
        {
            title: 'Dataset ID',
            field: 'dataset_id',
            format: function( peptide ) {
                var url = 'dataset.php?id=' + peptide.dataset_id;
                var tag = '<a href="' + url + '" target="_blank">' + peptide.dataset_id + '</a>';
                return tag;
            },
            width: 200
        },
        {
            title: 'Protein Name',
            field: 'full_name',
            format: function( peptide ) {
                var url = 'protein?id=' + peptide.accession;
                var tag = '<a href="' + url + '" target="_blank">' + peptide.full_name + '</a>';
                return tag;
            },
            width: 350
        },
        {
            title: 'Accession',
            field: 'accession',
            format: function( peptide ) {
                var accession = peptide.accession;
                var url = 'https://www.uniprot.org/uniprot/' + accession;
                var tag = '<a href="' + url + '">' + accession + '</a>';
                return tag;
            },
            width: 180
        },
        {
            title: 'Protein ID',
            field: 'mnemonic',
            width: 180
        },
        {
            title: 'Sequence',
            field: 'sequence',
            width: 350,
        }
    ];
    return columns;
}

// create protein peptide table
jpost.createProteinPsmTable = function( id, protein ) {
    table.createTable(
        id,
        {
            url: 'psm_table.php',
            columns: jpost.getPsmColumns(),
            parameters: function() {
                return { proteins: [ protein ] };
            },
            countClass: 'psm_table_tab_button',
            countUpdate: function( count ) {
                return 'Psm (' + count + ')';
            }
        }
    );
}

// get psm columns
jpost.getPsmColumns = function() {
    var columns = [
        {
            title: 'ID',
            field: 'psm_id',
            width: 200,
        },
        {
            title: 'jPOST Score',
            field: 'jpost_score',
            width: 120,
            align: 'right'
        },
        {
            title: 'Charge',
            field: 'charge',
            width: 100,
            align: 'right'
        }, 
        {
            title: 'Calculated Mass',
            field: 'calc_mass',
            width: 200,
            align: 'right'
        },
        {
            title: 'Experimental Mass',
            field: 'exp_mass',
            width: 200,
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
