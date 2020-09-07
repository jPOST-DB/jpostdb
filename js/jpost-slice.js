jpost.slices = [];
jpost.slice = null;

// id count
jpost.idCount = 0;
jpost.dialogFormCount = 0;

jpost.sliceCheckingFlag = false;

// get selected slice
jpost.getSelectedSlice = function() {
    return jpost.slice;
}

// add slice parameters
jpost.addSliceParameters = function( slice ) {
    var parameters = $( '#slice_dialog_filter_form' ).serializeArray();
    var values = {};
    parameters.forEach(
        function( parameter ) {
            values[ parameter.name ] = parameter.value;
        }
    );

    var filters = {};

    for( var i = 0; i < jpost.dialogFormCount; i++ ) {
        var id = 'filter' + i;
        if( id in values ) {
            var item = values[ id ];
            var array = [];

            var id = 'slice_dialog_form_selection' + i + '_value';
            var options = $( '#' + id + ' option' );

            options.each(
                function( index, element ) {
                    if( element.selected ) {
                        array.push( { id: element.value, text: element.innerHTML } );
                    }
                }
            );

            if( array.length > 0 ) {
                filters[ item ] = array;
            }
        }
    }

    var keyword = $( '#slice_keyword_text' ).val();
    filters[ 'keyword' ] = keyword;

    slice.filters = filters;


}

// add slice
jpost.addSlice = function( slice ) {
    slice.id = jpost.idCount;
    jpost.idCount++;
    jpost.addSliceParameters( slice );
    jpost.slices.push( slice );
}

// load slice
jpost.loadSlices = function() {
    var string = localStorage.getItem( 'jPOST_SLICES' );
    if( string === null ) {
        jpost.slices = [];
    }
    else {
        jpost.slices = JSON.parse( string );
    }

    string = localStorage.getItem( 'jPOST_SLICE_NAME' );
    jpost.slice = null;
    jpost.slices.forEach( 
        function( slice ) {
            if( jpost.slice == null || slice.name == string ) {
                jpost.slice = slice;
            }
            var id = parseInt( slice.id );
            if( id >= jpost.idCount ) {
                jpost.idCount = id + 1;
            }
        }
    );
}

// save slice
jpost.saveSlices = function() {
    var string = null;
    if( jpost.slices !== null ) {
        string = JSON.stringify( jpost.slices );
    }
    localStorage.setItem( 'jPOST_SLICES', string );

    string = null;
    if( jpost.slice !== null ) {
        string = jpost.slice.name;
    }
    localStorage.setItem( 'jPOST_SLICE_NAME', string );
}

// update tabs
jpost.updateTabs = function() {
    var checkedSlices = jpost.getCheckedSlices();
    var checkedSliceIds = [];
    checkedSlices.forEach( 
        function( sliceElement ) {
            checkedSliceIds.push( sliceElement.id );
        }
    );

    $( '#slice_tab_field' ).html( '' );
    $( '#slice_information_pane' ).html( '' );
    $( '.slices' ).html( '' );
    jpost.slices.forEach(
        function( slice ) {
            tab = '<a class="tab_link title_link" ';
            if( slice === jpost.slice ) {
                tab = '<a class="tab_link title_link active_tab_link" ';
            }
            tab = tab + 'href="javascript:jpost.selectSlice( ' + slice.id + '  )"><div>' + slice.name
                + '</div><div><input id="slice_checkbox' + slice.id + '" type="checkbox" class="slice_tab_check" name="slices[]" value="' + slice.id + '" /></div></a>';
            $( '#slice_tab_field' ).append( tab );
            jpost.addSliceContens( slice );
            $( '.slices' ).append( '<option value="' + slice.id + '">' + slice.name + '</option>' );
            $( '#slice_checkbox' + slice.id ).change( jpost.onCheckSlice )
            if( checkedSliceIds.indexOf( slice.id ) >= 0 ) {
                $( '#slice_checkbox' + slice.id ).prop( 'checked', true );
            }
        }
    );
    $( '#slice_tab_field' ).append( '<a href="javascript:jpost.openNewSliceDialogWithInit()" class="tab_link title_link tab_link_short"><div><div style="padding-top: 10px;"><span class="fa fa-plus"></span></div></div></a>' );
    $( '#slice_tab_field' ).append( '<button id="compare_button">Compare</button>' );
    $( '#slice_tab_field' ).append( '<div style="clear: both;"></div>' );
    $( '#compare_button' ).click( jpost.onCompareButton );
}

// on check
jpost.onCheckSlice = function() {
    jpost.sliceCheckingFlag = true;
    setTimeout( 
        function() {
            jpost.sliceCheckingFlag = false;
        },
        1000
    );
}

// add slice contents
jpost.addSliceContens = function( slice ) {
    var id = 'slice_contents_' + slice.id;
    var tag = '<div id="' + id + '" class="slice_pane" style="display: none;"><div>';
    $( '#slice_information_pane' ).append( tag );

    var mainId = id + '_main';
    tag = '<div id="' + mainId + '"></div>';
    $( '#' + id ).append( tag );

    var subId = id + '_sub';
    tag = '<div id="' + subId + '" style="display: none;"></div>';
    $( '#' + id ).append( tag );

    $( '#' + mainId ).append( '<h2 style="float: left;">' + slice.name  + '</h2>' );

    var buttonId = id + '_buttons';
    tag = '<div><div id="' + buttonId + '" style="float: right;></div><div style="clear: both;"></div></div>';
    $( '#' + mainId ).append( tag );

    $( '#' + buttonId ).append( '<button id="' + id + '_upload_button" class="operation_button"><span class="fas fa-upload"></span></button>' );
    $( '#' + id + '_upload_button' ).click(
        function() {
            jpost.uploadSlices();
        }
    );
    $( '#' + buttonId ).append( '<button id="' + id + '_download_button" class="operation_button"><span class="fas fa-download"></span></button>' );
    $( '#' + id + '_download_button' ).click(
        function() {
            jpost.downloadSlice( slice );
        }
    );    
    $( '#' + buttonId ).append( '<button id="' + id + '_edit_button" class="operation_button"><span class="fas fa-edit"></span></button>' );
    $( '#' + id + '_edit_button' ).click(
        function() {
            jpost.editSlice( slice );
        }
    );   
    $( '#' + buttonId ).append( '<button id="' + id + '_delete_button" class="operation_button"><span class="fas fa-trash-alt"></span></button>' );
    $( '#' + id + '_delete_button' ).click(
        function() {
            jpost.removeSlice( slice );
        }
    );   
    $( '#' + mainId ).append( '<div style="clear: both;"></div>' );
    $( '#' + mainId ).append( '<p>' + slice.description  + '</p>' );

    // $( '#' + mainId ).append( '<h3>Table</h3>' );
    $( '#' + mainId ).append( '<div id="' + id + '_table_slice"></div>' );
    $( '#' + mainId ).append( '<h3>Chromosome Info.</h3>' );
    $( '#' + mainId ).append( '<div id="' + id + '_chromosome"></div>' );
    $( '#' + mainId ).append( '<h3>Protein Existence</h3>' );
    $( '#' + mainId ).append( '<div id="' + id + '_protein"></div>' );
    $( '#' + mainId ).append( '<h3>Pathway Mapping</h3>' );
    $( '#' + mainId ).append( '<div id="' + id + '_kegg"></div>' );
    //jpost.loadSliceStanzas( slice );
    setTimeout(jpost.loadSliceStanzas, slice.id * 100, slice );

    $( '#' + mainId ).append( '<div id="' + id + '_tab_buttons" class="tab_buttons_line"></div>' );
    tag = '<button id="' + id + '_dataset_tab_button" class="' + id + '_tab_button tab_button tab_active dataset_tab_button">Dataset</button>';
    $( '#' + id + '_tab_buttons' ).append( tag );
    tag = '<button id="' + id + '_protein_tab_button" class="' + id + '_tab_button tab_button protein_tab_button">Protein</button>';
    $( '#' + id + '_tab_buttons' ).append( tag );
    tag = '<button id="' + id + '_peptide_tab_button" class="' + id + '_tab_button tab_button peptide_tab_button">Peptide</button>';
    $( '#' + id + '_tab_buttons' ).append( tag );
    $( '#' + id + '_tab_buttons' ).append( '<button class="fill_blank"></button>' );
    $( '#' + id + '_dataset_tab_button' ).click( 
        function() {
            jpost.changeTabPanel( id + '_dataset', id );
        }
    );
    $( '#' + id + '_protein_tab_button' ).click( 
        function() {
            jpost.changeTabPanel( id + '_protein', id );
        }
    );
    $( '#' + id + '_peptide_tab_button' ).click( 
        function() {
            jpost.changeTabPanel( id + '_peptide', id );
        }
    );
    tag = '<div id="' + id + '_dataset_tab_pane" class="tab_pane ' + id + '_tab_pane">Dataset</div>';
    $( '#' + mainId ).append( tag );
    tag = '<div id="' + id + '_protein_tab_pane" class="tab_pane ' + id + '_tab_pane" style="display: none;">Protein</div>';
    $( '#' + mainId ).append( tag );
    tag = '<div id="' + id + '_peptide_tab_pane" class="tab_pane ' + id + '_tab_pane" style="display: none;">Peptide</div>';
    $( '#' + mainId ).append( tag );

    jpost.createSliceDatasetTable( slice );
    jpost.createSliceProteinTable( slice );
    jpost.createSlicePeptideTable( slice );
}

// load slice stanzas
jpost.loadSliceStanzas = function( slice ) {
    var id = 'slice_contents_' + slice.id;
    var datasets = slice.datasets.join( ' ' );
    var stanzas = [
        {
            name: 'table_slice',
            id: id + '_table_slice',
            data: function() {
                return { dataset: datasets }
            }
        },
        {
            name: 'chromosome_histogram',
            id: id + '_chromosome',
            data: function() {
                return { dataset: datasets }
            }
        },
        {
            name: 'protein_evidence',
            id: id + '_protein',
            data:  function() {
                return { dataset: datasets }
            }
        },
        {
            name: 'kegg_mapping_form',
            id: id + '_kegg',
            data:  function() {
                return { dataset: datasets }
            }
        }
    ];
    jpost.loadStanzas( stanzas );
}

// select slice
jpost.selectSlice = function( id ) {
    if( jpost.sliceCheckingFlag ) {
        return;
    }

    var slice =  jpost.findSlice( id );
    jpost.slice = slice;
    jpost.saveSlices();
    jpost.updateTabs();
    $( '.slice_pane' ).css( 'display', 'none');

    if( slice !== null ) {
        var id = 'slice_contents_' + slice.id;
        $( '#' + id ).css( 'display', 'block' );
    }
}

// get slice
jpost.findSlice = function( id ) {
    var dataset = null;
    jpost.slices.forEach(
        function( tmp ) {
            if( tmp.id == id ) {
                dataset = tmp;
            }
        }
    );
    return dataset;
}

// get slice
jpost.findSliceByName = function( name ) {
    var slice = null;
    jpost.slices.forEach(
        function( tmp ) {
            if( tmp.name === name ) {
                slice = tmp;
            }
        }
    );
    return slice;
}

jpost.openNewSliceDialogWithInit = function() {    
    $( '#slice_dialog_filter_form' ).html( '' );
    $( '#slice_keyword_text' ).val( '' );
    jpost.openNewSliceDialog();
    jpost.updateDialogTable();
}

jpost.setSliceParameters = function( slice ) {
    for( key in slice.filters ) {
        if( key === 'keyword' ) {
            $( '#slice_keyword_text' ).val( slice.filters[ key ] );
        }
        else {            
            var count = jpost.dialogFormCount;
            jpost.addFormInDialog();
            $( '#slice_dialog_form_selection' + count ).val( key );
            jpost.updateFilterFormInDialog( count );

            var array = slice.filters[ key ];
            var values = [];

            id = 'slice_dialog_form_selection' + count + '_value';
            
            array.forEach(
                function( element ) {
                    var option = new Option( element.text, element.id, true, true );
                    values.push( element.id )
                    $( '#' + id ).append( option ).trigger( 'change' );
                }
            );

            $( '#' + id ).trigger( 
                {
                    type: 'select2:select',
                    params: {
                        data: values
                    }
                }
            );
        }
    }
}

jpost.openNewSliceDialogWithParameters = function() {
    $( '#slice_dialog_filter_form' ).html( '' );

    var parameters = $( '#filter_form' ).serializeArray();
    var values = {};
    parameters.forEach(
        function( parameter ) {
            values[ parameter.name ] = parameter.value;
        }
    );

    for( var i = 0; i < jpost.formCount; i++ ) {
        var id = 'filter' + i;
        if( id in values ) {
            var item = values[ id ];
            var id = 'form_selection' + i + '_value';
            var options = $( '#' + id + ' option' );

            var count = jpost.dialogFormCount;
            jpost.addFormInDialog();

            $( '#slice_dialog_form_selection' + count ).val( item );
            jpost.updateFilterFormInDialog( count );

            id = 'slice_dialog_form_selection' + count + '_value';
            var array = [];

            options.each(
                function( index, element ) {
                    if( element.selected ) {
                        var option = new Option( element.innerHTML, element.value, true, true );
                        array.push( element.value );
                        $( '#' + id ).append( option ).trigger( 'change' );
                    }
                }
            );
                
            $( '#' + id ).trigger( 
                {
                    type: 'select2:select',
                    params: {
                        data: array
                    }
                }
            );
        }
    }

    $( '#slice_keyword_text' ).val( $( '#global_dataset_text' ).val() );

    jpost.openNewSliceDialog();
    jpost.updateDialogTable();
}

// open new slice dialog
jpost.openNewSliceDialog = function() {
    jpost.slice = null;
    $( '#dialog_slice_name' ).val( 'Slice' + ( jpost.idCount + 1 ) );
    $( '#dialog_slice_description' ).val( '' );
    jpost.updateDialogTable();
    $( '#slice_dialog' ).dialog(
        {
            modal: true,
            title: 'New Slice',
            width: '800px',
            buttons: {
                Create: function() {
                    var name = $( '#dialog_slice_name' ).val();
                    if( name == null || name == '' ) {
                        alert( "Slice Name is empty." );
                        return;
                    }
                    for( var i = 0; i < jpost.slices.length; i++ ) {
                        if( jpost.slices[ i ].name === name ) {
                            alert( 'Name [' + name + '] is already exists.' );
                            return;
                        }
                    }
                    var description = $( '#dialog_slice_description' ).val();
                    var datasets = jpost.getCheckedDatasets();
                    if( datasets == 0 || datasets.length == 0 ) {
                        alert( "No datasets are selected.")
                        return;
                    }

                    var string = datasets.join( ' ' );

                    var dialog = $( this );

                    $.ajax(
                        {
                            url: 'get_species.php',
                            type: 'GET',
                            data: {
                                dataset: string
                            },
                            success: function( response ) {
                                var species = JSON.parse( response );
                                var flag = true;
                                if( species.length > 1 ) {
                                    var message = 'There are multiple species in selected datasets. [' + species.join( ',' ) + ']' + "\n"
                                                + 'Are you sure to create a slice?';
                                    if( window.confirm( message ) ) {
                                        flag = true;
                                    }
                                    else {
                                        flag = false;
                                    }
                                }

                                if( flag ) {
                                    var slice = {
                                        name: name,
                                        description: description,
                                        datasets: datasets
                                    };
                                    jpost.addSlice( slice );
                                    jpost.selectSlice( slice.id );
                                    dialog.dialog( 'close' );
                                }
                            }
                        }
                    );
                },
                Cancel: function() {
                    $( this ).dialog( 'close' );
                }
            }
        }
    );
}

// add form
jpost.addFormInDialog = function() {
    var id = jpost.dialogFormCount;
    jpost.dialogFormCount++;

    var tag = '<div id="slice_dialog_filter_form_line' + id + '" class="slice_dialog_form_line"></div>';
    $( '#slice_dialog_filter_form' ).append( tag );

    jpost.addFormSelectionInDialog( id );
    jpost.addFormTextInDialog( id );
    jpost.addFormDeleteButtonInDialog( id );
    jpost.updateFilterFormInDialog( id );

    if( jpost.getNextFormTypeInDialog() === null ) {
        $( '#slice_dialog_form_add_button' ).prop( 'disabled', true );
    }
}

// add form selection
jpost.addFormSelectionInDialog = function( id ) {
    var value = jpost.getNextFormTypeInDialog();
    var tag = '<select id="slice_dialog_form_selection' + id + '" style="width: 175px; margin-right: 10px;" '
            + 'name="filter' + id + '"></select>';
    $( '#slice_dialog_filter_form_line' + id ).append( tag );

    jpost.filters.forEach( 
        function( filter ) {
            var tag = '<option value="' + filter.name + '">' + filter.title + '</option>';
            $( '#slice_dialog_form_selection' + id ).append( tag );
        }
    );
    $( '#slice_dialog_form_selection' + id ).val( value );
    $( '#slice_dialog_form_selection' + id ).change(
        function() {
            jpost.updateFilterFormInDialog( id );
        }
    );

    jpost.updateDialogFilterSelections();
}

// gets the next form type
jpost.getNextFormTypeInDialog = function() {
    var parameters = $( '#slice_dialog_filter_form' ).serializeArray();
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
    return value;
}

// update filter selections
jpost.updateDialogFilterSelections = function() {
    var parameters = $( '#slice_dialog_filter_form' ).serializeArray();
    var values = {};
    var filters = [];
    parameters.forEach(
        function( parameter ) {
            values[ parameter.name ] = parameter.value;
            filters.push( parameter.value );
        }
    );

    for( var i = 0; i < jpost.dialogFormCount; i++ ) {
        var id = i;
        if( ( 'filter' + id ) in values ) {
            $( '#slice_dialog_form_selection' + id + ' option' ).prop( 'disabled', false );
            jpost.filters.forEach(
                function( filter ) {
                    if( filters.indexOf( filter.name ) >= 0 ) {
                        $( '#slice_dialog_form_selection' + id + ' option[value="' + filter.name + '"]' ).prop( 'disabled', true );
                    }
                }
            );
            $( '#slice_dialog_form_selection' + id + ' option:selected' ).prop( 'disabled', false );
        }
    }
}


// adds form text
jpost.addFormTextInDialog = function( id ) {
    var tag = '<select type="text" id="slice_dialog_form_selection' + id + '_value" '
            + 'style="display: none;" class="form_selection_value" '
            + 'name="filter' + id + '_value" multiple></select>';
    $( '#slice_dialog_filter_form_line' + id ).append( tag );
}

// adds form delete button
jpost.addFormDeleteButtonInDialog = function( id ) {
    var tag = '<a href="javascript:jpost.deleteFormInDialog( ' + id + ' )" '
            + 'class="fas fa-times-circle icon_button_red" '
            + 'style="margin-left: 10px;"></a>';
    $( '#slice_dialog_filter_form_line' + id ).append( tag );
}

// delete form
jpost.deleteFormInDialog = function( id ) {
    $( '#slice_dialog_filter_form_line' + id ).remove();
    jpost.updateDialogTable();

    if( jpost.getNextFormTypeInDialog() !== null ) {
        $( '#slice_dialog_form_add_button' ).prop( 'disabled', false );
    }
}

// update filter form
jpost.updateFilterFormInDialog = function( id ) {
    $( '#slice_dialog_form_selection' + id + '_value' ).css( 'display', 'none' );

    var item = $( '#slice_dialog_form_selection' + id ).val();

    $( '#slice_dialog_form_selection' + id + '_value' ).val( null ).trigger( 'change' );
    $( '#slice_dialog_form_selection' + id + '_value' ).select2(
        {
            ajax: {
                url: 'preset_list.php',
                type: 'GET',
                data: function( params ) {
                    var parameters = jpost.getDialogFilterParameters();
                    parameters.item = item;
                    return parameters;
                },
                processResults: function( result, params ) {
                    var array = result.map(
                        function( object ) {
                            return { id: object.id, text: object.label };
                        }
                    );
                    return { results: array };
                }
            },
            width: '450px',
            tags: true
        }
    );

    $( '#slice_dialog_form_selection' + id + '_value' ).css( 'display', 'inline' );
    $( '#slice_dialog_form_selection' + id + '_value' ).change( jpost.updateDialogTable );

    jpost.updateDialogFilterSelections();
}

jpost.updateDialogTable = function() {
    if( jpost.slice !== null ) {
        name = jpost.slice.name;
        description = jpost.slice.description;
    }
    table.updateTable( 'slice_dialog_table' );
}

// prepare filter
jpost.prepareFilterInDialog = function() {
    $( '#slice_dialog_filter_title_button' ).click( jpost.toggleFilterFormInDialog );
}

// toggle filter form
jpost.toggleFilterFormInDialog = function() {
    var status = $( '#slice_dialog_filter_body' ).css( 'display' );
    if( status === 'none' ) {
        $( '#slice_dialog_filter_body' ).css( 'display', 'block' );
        $( '#slice_dialog_filter_title_icon' ).removeClass( 'fa-caret-down' );
        $( '#slice_dialog_filter_title_icon' ).addClass( 'fa-caret-up' );
    }
    else {
        $( '#slice_dialog_filter_body' ).css( 'display', 'none' );
        $( '#slice_dialog_filter_title_icon' ).removeClass( 'fa-caret-up' );
        $( '#slice_dialog_filter_title_icon' ).addClass( 'fa-caret-down' );
    }
}

// create dataset table
jpost.createDialogDatasetTable = function( id ) {
    table.createTable(
        id,
        {
            url: 'dataset_table.php',
            columns: jpost.dialogDatasetColumns,
            parameters: function() {
                var params = jpost.getDialogFilterParameters();
                return params;
            }
        },
        true
    );
}

// get filter parameters
jpost.getDialogFilterParameters = function() {
    var parameters = $( '#slice_dialog_filter_form' ).serializeArray();
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
    data.dataset_keywords = $( '#slice_keyword_text' ).val();
    return data;
}

// get checked datasets
 jpost.getCheckedDatasets = function() {
    var array = [];
    $( '[class="dialog_dataset_check"]:checked' ).map(
        function() {
            array.push( $( this ).val() );
        }
    );
    return array;
}

// create dataset table
jpost.createSliceDatasetTable = function( slice ) {
    var id = 'slice_contents_' + slice.id + '_dataset_tab_pane';
    table.createTable(
        id,
        {
            url: 'dataset_table.php',
            columns: jpost.sliceDatasetColumns,
            parameters: function() {
                var params = {
                    'datasets': slice.datasets
                }
                return params;
            },
            countClass: 'dataset_tab_button',
            countUpdate: function( count ) {
                return 'Dataset (' + count + ')';
            }
        },
        true
    );
}

// create protein table
jpost.createSliceProteinTable = function( slice ) {
    var id = 'slice_contents_' + slice.id + '_protein_tab_pane';
    table.createTable(
        id,
        {
            url: 'protein_table.php',
            columns: jpost.sliceProteinColumns,
            parameters: function() {
                return { datasets: slice.datasets };
            },
            countClass: 'protein_tab_button',
            countUpdate: function( count ) {
                return 'Protein (' + count + ')';
            }
        },
        true
    );
}

// create slice peptide table
jpost.createSlicePeptideTable = function( slice ) {
    var id = 'slice_contents_' + slice.id + '_peptide_tab_pane';
    table.createTable(
        id,
        {
            url: 'peptide_table.php',
            columns: jpost.slicePeptideColumns,
            parameters: function() {
                return { datasets: slice.datasets };
            },
            countClass: 'peptide_tab_button',
            countUpdate: function( count ) {
                return 'Peptide (' + count + ')';
            }
        }
    );
}

// get checked slices
jpost.getCheckedSlices = function() {
    var array = [];
    $( '[class="slice_tab_check"]:checked' ).map(
        function() {
            array.push( $( this ).val() );
        }
    );

    slices = [];
    array.forEach(
        function( id ) {
            var slice = jpost.findSlice( id );
            if( slice !== null ) {
                slices.push( slice );
            }
        }
    );
    return slices;
}

jpost.onCompareButton = function() {
    var slices = jpost.getCheckedSlices();
    if( slices == null || slices.length == 0 ) {
        alert( "No slices are selected." );
        return;
    }
    if( slices.length != 2 ) {
        alert( "Select just two slices before comparing." );
        return;
    }
    $( '#slice1' ).val( slices[ 0 ].id );
    $( '#slice2' ).val( slices[ 1 ].id ); 
    jpost.openTab( 'compare' );
    jpost.compareSlices();
}

// compare slices
jpost.compareSlices = function() {
    var slice1 = jpost.findSlice( $( '#slice1' ).val() );
    var slice2 = jpost.findSlice( $( '#slice2' ).val() );
    if( slice1 != null && slice2 != null && slice1 != slice2 ) {
        var stanzas = [
                {
                    name: 'slice_comparison',
                    id: 'compare_result_pane',
                    width: 800,
                    height: 800,
                    data: function() {
                        return {
                            dataset1: slice1.datasets.join( ' ' ),
                            dataset2: slice2.datasets.join( ' ' ),
                            slice1: slice1.name,
                            slice2: slice2.name
                        };
                    }
                }
            ];
            jpost.loadStanzas( stanzas );            
    }
}

jpost.uploadSlices = function() {
    $( '#upload_slices' ).click();
}

jpost.downloadSlice = function( slice ) {
    var json = JSON.stringify( [ slice ] );
    var file = new File(
        [ json ],
        slice.name + ".json",
        {
            type: 'text/plain;charset=utf-8'
        }
    );
    saveAs( file );
}

jpost.editSlice = function( slice ) {
    $( '#slice_dialog_filter_form' ).html( '' );
    $( '#slice_keyword_text' ).val( '' );
    $( '#dialog_slice_name' ).val( slice.name );
    jpost.setSliceParameters( slice );
    jpost.updateDialogTable();

    $( '#slice_dialog' ).dialog(
        {
            modal: true,
            title: 'Edit Slice',
            width: '800px',
            buttons: {
                Update: function() {
                    var name = $( '#dialog_slice_name' ).val();
                    if( name == null || name == '' ) {
                        alert( "Slice Name is empty." );
                        return;
                    }
                    var description = $( '#dialog_slice_description' ).val();
                    var datasets = jpost.getCheckedDatasets();
                    if( datasets == 0 || datasets.length == 0 ) {
                        alert( "No datasets are selected.")
                        return;
                    }

                    var string = datasets.join( ' ' );
                    var dialog = $( this );

                    $.ajax(
                        {
                            url: 'get_species.php',
                            type: 'GET',
                            data: {
                                dataset: string
                            },
                            success: function( response ) {
                                var species = JSON.parse( response );
                                var flag = true;
                                if( species.length > 1 ) {
                                    var message = 'There are multiple species in selected datasets. [' + species.join( ',' ) + ']' + "\n"
                                                + 'Are you sure to create a slice?';
                                    if( window.confirm( message ) ) {
                                        flag = true;
                                    }
                                    else {
                                        flag = false;
                                    }
                                }

                                if( flag ) {
                                    jpost.slice.name = name;
                                    jpost.slice.description = description;
                                    jpost.slice.datasets = datasets;
                                    jpost.selectSlice( jpost.slice.id );     
                                    jpost.addSliceParameters( slice );                               
                                    dialog.dialog( 'close' );
                                }
                            }
                        }
                    );
                },
                Cancel: function() {
                    $( this ).dialog( 'close' );
                }
            }
        }
    );
}

jpost.removeSlice = function( slice ) {
    if( confirm( "Are you sure to delete this slice?" ) ) {
        var index = -1;
        for( var i = 0; i < jpost.slices.length; i++ ) {
            if( jpost.slice == jpost.slices[ i ] ) {
                index = i;
            }
        }
        if( index >= 0 ) {
            jpost.slice = null;
            jpost.slices.splice( index, 1 );
            if( jpost.slices.length > 0 ) {
                jpost.selectSlice( jpost.slices[ 0 ].id )
            }
            else {
                jpost.selectSlice( -1 );
            }
        }
    }
}
