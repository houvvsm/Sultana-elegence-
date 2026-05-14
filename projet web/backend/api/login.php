<?php
require_once 'functions.php';
require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Méthode non autorisée"], 405);
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($email) || empty($password)) {
    jsonResponse(["error" => "Email et mot de passe requis"], 400);
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonResponse(["error" => "Email ou mot de passe incorrect"], 401);
}

if ($user['status'] === 'pending') {
    jsonResponse(["error" => "Votre compte est en attente d'approbation"], 403);
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['name'] = $user['name'];
$_SESSION['email'] = $user['email'];
$_SESSION['role'] = $user['role'];

jsonResponse([
    "success" => true,
    "role" => $user['role'],
    "name" => $user['name']
]);