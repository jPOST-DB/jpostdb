<?php
    require_once __DIR__ . '/classes/HtmlTool.php';
    $id = HtmlTool::getParameter( 'id' );
    $slice = HtmlTool::getParameter( 'slice' );
    $peptide = HtmlTool::getParameter( 'peptide' );
    $tax = HtmlTool::getParameter( 'tax' );
    $params = array(
        'id' => $id,
        'page' => 'peptide',
        'slice' => $slice,
        'peptide' => $peptide,
        'tax' => $tax
    );
    HtmlTool::render( 'peptide.html', $params );
?>
