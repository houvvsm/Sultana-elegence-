<?php
require_once 'functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Méthode non autorisée"], 405);
}

$type    = trim($_POST['type']    ?? '');
$name    = trim($_POST['name']    ?? '');
$city    = trim($_POST['city']    ?? '');
$phone   = trim($_POST['phone']   ?? '');
$email   = trim($_POST['email']   ?? '');
$message = trim($_POST['message'] ?? '');

if (!in_array($type, ['boutique','beauty']) || empty($name) || empty($city)) {
    jsonResponse(["error" => "Type, nom et ville sont obligatoires"], 400);
}

$pieces_count = !empty($_POST['pieces_count']) ? intval($_POST['pieces_count']) : null;
$service_type = !empty($_POST['service_type']) ? $_POST['service_type']         : null;

$stmt = $pdo->prepare("INSERT INTO partners (type,name,city,phone,email,pieces_count,service_type,message,status) VALUES (?,?,?,?,?,?,?,?,'pending')");
$stmt->execute([$type,$name,$city,$phone,$email,$pieces_count,$service_type,$message]);

jsonResponse(["success" => true, "message" => "Votre demande a été envoyée. Nous vous contacterons bientôt."]);