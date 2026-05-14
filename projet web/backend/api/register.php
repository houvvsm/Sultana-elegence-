<?php
require_once 'functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Méthode non autorisée"], 405);
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$password = $_POST['password'] ?? '';
$city = trim($_POST['city'] ?? '');
$size_profile = trim($_POST['size_profile'] ?? '');

if (empty($name) || empty($email) || empty($password)) {
    jsonResponse(["error" => "Nom, email et mot de passe requis"], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(["error" => "Email invalide"], 400);
}

if (strlen($password) < 6) {
    jsonResponse(["error" => "Le mot de passe doit contenir au moins 6 caractères"], 400);
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonResponse(["error" => "Cet email est déjà utilisé"], 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("
    INSERT INTO users (name, email, phone, password_hash, role, city, size_profile, status)
    VALUES (?, ?, ?, ?, 'client', ?, ?, 'pending')
");
$stmt->execute([$name, $email, $phone, $hash, $city, $size_profile]);

jsonResponse([
    "success" => true,
    "message" => "Compte créé. En attente d'approbation par l'administrateur."
]);