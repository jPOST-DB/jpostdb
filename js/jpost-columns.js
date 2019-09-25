// Global Dataset Table
jpost.globalDatasetColumns = [
    {
        title: 'Dataset ID',
        field: 'dataset_id',
        format: function (dataset) {
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

// Global Protein Table
jpost.globalProteinColumns = [
    {
        title: 'Protein Name',
        field: 'full_name',
        format: function (protein) {
            var url = 'protein.php?id=' + protein.accession;
            var tag = '<a href="' + url + '" target="_blank">' + protein.full_name + '</a>';
            return tag;
        },
        width: 350
    },
    {
        title: 'Accession',
        field: 'accession',
        format: function (protein) {
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

// Global Peptide Table
jpost.globalPeptideColumns = [
    {
        title: 'ID',
        field: 'peptide_id',
        format: function (peptide) {
            var id = peptide.peptide_id;
            var url = 'peptide.php?id=' + id;
            if( jpost.slice !== null ) {
                url = url + '&slice=' + jpost.slice.name;
            }
            var tag = '<a href="' + url + '" target="_blank">' + id + '</a>';
            return tag;
        },
        width: 250
    },
    {
        title: 'Dataset ID',
        field: 'dataset_id',
        format: function (peptide) {
            var url = 'dataset.php?id=' + peptide.dataset_id;
            var tag = '<a href="' + url + '" target="_blank">' + peptide.dataset_id + '</a>';
            return tag;
        },
        width: 200
    },
    {
        title: 'Protein Name',
        field: 'full_name',
        format: function (peptide) {
            var url = 'protein?id=' + peptide.accession;
            var tag = '<a href="' + url + '" target="_blank">' + peptide.full_name + '</a>';
            return tag;
        },
        width: 350
    },
    {
        title: 'Accession',
        field: 'accession',
        format: function (peptide) {
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

// Global PSM Table
jpost.globalPsmColumns = [
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

// Slice Dataset Table
jpost.sliceDatasetColumns = [
    {
        title: 'Dataset ID',
        field: 'dataset_id',
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

// Slice Protein Table
jpost.sliceProteinColumns = [
    {
        title: 'Protein Name',
        field: 'full_name',
        format: function (protein) {
            var url = 'protein.php?id=' + protein.accession + '&slice=' + jpost.slice.name;
            var tag = '<a href="' + url + '" target="_blank">' + protein.full_name + '</a>';
            return tag;
        },
        width: 350
    },
    {
        title: 'Accession',
        field: 'accession',
        format: function (protein) {
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

// Slice Peptide Columns
jpost.slicePeptideColumns = [
    {
        title: 'ID',
        field: 'peptide_id',
        format: function (peptide) {
            var id = peptide.peptide_id;
            var url = 'peptide.php?id=' + id + '&slice=' + jpost.slice.name;
            var tag = '<a href="' + url + '" target="_blank">' + id + '</a>';
            return tag;
        },
        width: 250
    },
    {
        title: 'Dataset ID',
        field: 'dataset_id',
        format: function (peptide) {
            var url = 'dataset.php?id=' + peptide.dataset_id;
            var tag = '<a href="' + url + '" target="_blank">' + peptide.dataset_id + '</a>';
            return tag;
        },
        width: 200
    },
    {
        title: 'Protein Name',
        field: 'full_name',
        format: function (peptide) {
            var url = 'protein?id=' + peptide.accession + '&slice=' + jpost.slice.name;
            var tag = '<a href="' + url + '" target="_blank">' + peptide.full_name + '</a>';
            return tag;
        },
        width: 350
    },
    {
        title: 'Accession',
        field: 'accession',
        format: function (peptide) {
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

// Dialog Dataset Table
jpost.dialogDatasetColumns = [
    {
        title: '<input type="checkbox" id="dialog_dataset_all_check">',
        align: 'center',
        width: 50,
        format: function (dataset) {
            var tag = '<input type="checkbox" name="dialog_slice[]" value="' + dataset.dataset_id + '" ';
            tag = tag + 'class="dialog_dataset_check"';
            var slice = jpost.getSelectedSlice();
            if (slice != null) {
                var checked = false;
                slice.datasets.forEach(
                    function (element) {
                        if (element == dataset.dataset_id) {
                            checked = true;
                        }
                    }
                );
                if (checked) {
                    tag = tag + ' checked';
                }
                tag = tag + '>';
            }
            return tag;
        },
        sortable: false
    },
    {
        title: 'Dataset ID',
        field: 'dataset_id',
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
