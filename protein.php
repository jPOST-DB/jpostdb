<?php
    require_once __DIR__ . '/classes/HtmlTool.php';
    $id = HtmlTool::getId();
    $params = array(
        'id' => $id,
        'page' => 'protein'
    );
    HtmlTool::render( 'protein.html', $params );
?>