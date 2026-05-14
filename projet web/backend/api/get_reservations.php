<?php
require_once 'functions.php';
require_once 'auth.php';

requireLogin();

$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("
    SELECT r.*, c.name as caftan_name, c.image_main, c.price_per_day
    FROM reservations r
    JOIN caftans c ON r.caftan_id = c.id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
");
$stmt->execute([$user_id]);
$reservations = $stmt->fetchAll();

$scheme  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host    = $_SERVER['HTTP_HOST'] ?? 'localhost';
$script  = $_SERVER['SCRIPT_NAME'];
$webRoot = rtrim(dirname(dirname(dirname($script))), '/');
$baseUrl = $scheme . '://' . $host . $webRoot;

foreach ($reservations as &$r) {
    if (!empty($r['image_main'])
        && strpos($r['image_main'], 'http')    !== 0
        && strpos($r['image_main'], 'uploads/') === 0) {
        $r['image_main'] = $baseUrl . '/' . $r['image_main'];
    }
}

jsonResponse($reservations);