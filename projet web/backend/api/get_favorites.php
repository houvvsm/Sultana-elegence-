<?php
require_once 'functions.php';
require_once 'auth.php';

requireLogin();

$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("
    SELECT c.* FROM caftans c
    JOIN favorites f ON c.id = f.caftan_id
    WHERE f.user_id = ? AND c.status != 'hidden'
    ORDER BY f.created_at DESC
");
$stmt->execute([$user_id]);
$favorites = $stmt->fetchAll();

foreach ($favorites as &$fav) {
    $fav['images_gallery'] = json_decode($fav['images_gallery'] ?? '[]', true);
    $fav['sizes_available'] = json_decode($fav['sizes_available'] ?? '[]', true);
}

jsonResponse($favorites);