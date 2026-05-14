<?php
require_once 'functions.php';

$stmt = $pdo->query("SELECT DISTINCT category FROM caftans WHERE status != 'hidden' ORDER BY category");
$categories = $stmt->fetchAll(PDO::FETCH_COLUMN);

jsonResponse($categories);