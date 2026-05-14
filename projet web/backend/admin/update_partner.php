<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Méthode non autorisée"], 405);
}

$id = $_POST['id'] ?? null;
$status = $_POST['status'] ?? null;

if (!$id || !in_array($status, ['approved','rejected'])) {
    jsonResponse(["error" => "Statut invalide"], 400);
}

$stmt = $pdo->prepare("UPDATE partners SET status = ? WHERE id = ?");
$stmt->execute([$status, $id]);

jsonResponse([
    "success" => true,
    "message" => $status === 'approved' ? "Partenaire approuvé" : "Partenaire rejeté"
]);