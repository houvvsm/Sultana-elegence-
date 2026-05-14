<?php
require_once 'functions.php';
require_once 'auth.php';

requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Méthode non autorisée"], 405);
}

$caftan_id = $_POST['caftan_id'] ?? null;
$user_id = $_SESSION['user_id'];

if (!$caftan_id || !filter_var($caftan_id, FILTER_VALIDATE_INT)) {
    jsonResponse(["error" => "ID caftan invalide"], 400);
}

$stmt = $pdo->prepare("SELECT id FROM favorites WHERE user_id = ? AND caftan_id = ?");
$stmt->execute([$user_id, $caftan_id]);
$existing = $stmt->fetch();

if ($existing) {
    $stmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = ? AND caftan_id = ?");
    $stmt->execute([$user_id, $caftan_id]);
    jsonResponse(["success" => true, "favorited" => false]);
} else {
    $stmt = $pdo->prepare("INSERT INTO favorites (user_id, caftan_id) VALUES (?, ?)");
    $stmt->execute([$user_id, $caftan_id]);
    jsonResponse(["success" => true, "favorited" => true]);
}