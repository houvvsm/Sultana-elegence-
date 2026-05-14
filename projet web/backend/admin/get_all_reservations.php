<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

$stmt = $pdo->query("
    SELECT
        r.*,
        u.name  AS client_name,
        u.email AS client_email,
        u.phone AS client_phone,
        c.name       AS caftan_name,
        c.image_main AS caftan_image
    FROM reservations r
    JOIN users u ON r.user_id  = u.id
    JOIN caftans c ON r.caftan_id = c.id
    ORDER BY r.created_at DESC
");
$rows = $stmt->fetchAll();

$scheme  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host    = $_SERVER['HTTP_HOST'] ?? 'localhost';
$script  = $_SERVER['SCRIPT_NAME'];
$webRoot = rtrim(dirname(dirname(dirname($script))), '/');
$baseUrl = $scheme . '://' . $host . $webRoot;

foreach ($rows as &$r) {
    if (!empty($r['caftan_image'])
        && strpos($r['caftan_image'], 'http')    !== 0
        && strpos($r['caftan_image'], 'uploads/') === 0) {
        $r['caftan_image'] = $baseUrl . '/' . $r['caftan_image'];
    }
}

jsonResponse($rows);