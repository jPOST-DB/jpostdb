<?php
    require_once __DIR__ . '/classes/HtmlTool.php';
    $id = HtmlTool::getId();
    $params = array(
        'id' => $id,
        'page' => 'dataset'
    );
    HtmlTool::render( 'dataset.html', $params );
?>