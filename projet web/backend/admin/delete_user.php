<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Méthode non autorisée"], 405);
}

$id = intval($_POST['id'] ?? 0);
if (!$id) {
    jsonResponse(["error" => "ID requis"], 400);
}

// Prevent admin from deleting themselves
if ($id === intval($_SESSION['user_id'])) {
    jsonResponse(["error" => "Vous ne pouvez pas supprimer votre propre compte"], 403);
}

// Only allow deleting clients, not other admins
$stmt = $pdo->prepare("SELECT id, role FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(["error" => "Utilisateur introuvable"], 404);
}

if ($user['role'] === 'admin') {
    jsonResponse(["error" => "Impossible de supprimer un administrateur"], 403);
}

// Cascades will handle reservations and favorites via FK
$stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
$stmt->execute([$id]);

jsonResponse(["success" => true, "message" => "Client supprimé"]);