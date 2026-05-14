<?php
require_once 'functions.php';

$category = $_GET['category'] ?? null;
$search   = $_GET['search']   ?? null;

$sql    = "SELECT * FROM caftans WHERE status != 'hidden'";
$params = [];

if ($category && $category !== 'all') {
    $sql     .= " AND category = ?";
    $params[] = $category;
}
if ($search) {
    $sql     .= " AND (name LIKE ? OR description LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
}
$sql .= " ORDER BY featured DESC, created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$caftans = $stmt->fetchAll();

$scheme  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host    = $_SERVER['HTTP_HOST'] ?? 'localhost';
$script  = $_SERVER['SCRIPT_NAME'];
$webRoot = rtrim(dirname(dirname(dirname($script))), '/'); // htdocs/projet web
$baseUrl = $scheme . '://' . $host . $webRoot;

foreach ($caftans as &$c) {
    $c['images_gallery']  = json_decode($c['images_gallery']  ?? '[]', true);
    $c['sizes_available'] = json_decode($c['sizes_available'] ?? '[]', true);
    if (!empty($c['image_main'])
        && strpos($c['image_main'], 'http')    !== 0
        && strpos($c['image_main'], 'uploads/') === 0) {
        $c['image_main'] = $baseUrl . '/' . $c['image_main'];
    }
}

jsonResponse($caftans);