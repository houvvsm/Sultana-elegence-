<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Méthode non autorisée"], 405);
}

$id = $_POST['id'] ?? null;
$status = $_POST['status'] ?? null;

$allowed = ['pending','confirmed','delivered','returned','cancelled'];
if (!$id || !in_array($status, $allowed)) {
    jsonResponse(["error" => "Données invalides"], 400);
}

$stmt = $pdo->prepare("UPDATE reservations SET status = ? WHERE id = ?");
$stmt->execute([$status, $id]);

jsonResponse([
    "success" => true,
    "message" => "Statut mis à jour"
]);