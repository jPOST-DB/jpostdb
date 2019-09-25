<?php
    require_once __DIR__ . '/classes/HtmlTool.php';
    $id = HtmlTool::getId();
    $slice = HtmlTool::getParameter( 'slice' );
    $params = array(
        'id' => $id,
        'page' => 'protein',
        'slice' => $slice
    );
    HtmlTool::render( 'protein.html', $params );
?>