<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

$stmt    = $pdo->query("SELECT * FROM caftans ORDER BY created_at DESC");
$caftans = $stmt->fetchAll();

$scheme  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host    = $_SERVER['HTTP_HOST'] ?? 'localhost';
$script  = $_SERVER['SCRIPT_NAME'];
$webRoot = rtrim(dirname(dirname(dirname($script))), '/');
$baseUrl = $scheme . '://' . $host . $webRoot;

foreach ($caftans as &$c) {
    $c['sizes_available'] = json_decode($c['sizes_available'] ?? '[]', true);
    if (!empty($c['image_main'])
        && strpos($c['image_main'], 'http')    !== 0
        && strpos($c['image_main'], 'uploads/') === 0) {
        $c['image_main'] = $baseUrl . '/' . $c['image_main'];
    }
}

jsonResponse($caftans);