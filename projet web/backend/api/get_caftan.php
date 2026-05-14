<?php
require_once 'functions.php';

$id = intval($_GET['id'] ?? 0);
if (!$id) {
    jsonResponse(["error" => "ID requis"], 400);
}

$stmt = $pdo->prepare("SELECT * FROM caftans WHERE id = ? AND status != 'hidden'");
$stmt->execute([$id]);
$caftan = $stmt->fetch();

if (!$caftan) {
    jsonResponse(["error" => "Caftan introuvable"], 404);
}

$caftan['images_gallery']  = json_decode($caftan['images_gallery']  ?? '[]', true);
$caftan['sizes_available'] = json_decode($caftan['sizes_available'] ?? '[]', true);

// Build absolute URL for uploaded images (same logic as get_caftans.php)
$scheme  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host    = $_SERVER['HTTP_HOST'] ?? 'localhost';
$script  = $_SERVER['SCRIPT_NAME'];
$apiDir  = rtrim(dirname(dirname($script)), '/');
$webRoot = rtrim(dirname($apiDir), '/');
$baseUrl = $scheme . '://' . $host . $webRoot;

if (!empty($caftan['image_main'])
    && strpos($caftan['image_main'], 'http') !== 0
    && strpos($caftan['image_main'], 'uploads/') === 0) {
    $caftan['image_main'] = $baseUrl . '/' . ltrim($caftan['image_main'], '/');
}

jsonResponse($caftan);