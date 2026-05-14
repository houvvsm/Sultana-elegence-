<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Méthode non autorisée"], 405);
}

$id = $_POST['id'] ?? null;
if (!$id) {
    jsonResponse(["error" => "ID requis"], 400);
}

// Get image path before deleting
$stmt = $pdo->prepare("SELECT image_main FROM caftans WHERE id = ?");
$stmt->execute([$id]);
$caftan = $stmt->fetch();

if (!$caftan) {
    jsonResponse(["error" => "Caftan non trouvé"], 404);
}

// Delete image file
if ($caftan['image_main'] && file_exists('../../' . $caftan['image_main'])) {
    unlink('../../' . $caftan['image_main']);
}

// Delete from database (favorites and reservations cascade via FK)
$stmt = $pdo->prepare("DELETE FROM caftans WHERE id = ?");
$stmt->execute([$id]);

jsonResponse([
    "success" => true,
    "message" => "Caftan supprimé"
]);