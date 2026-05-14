<?php
require_once 'functions.php';
require_once 'auth.php';

requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["error" => "Méthode non autorisée"], 405);
}

$user_id          = $_SESSION['user_id'];
$caftan_id        = $_POST['caftan_id']        ?? null;
$start_date       = $_POST['start_date']       ?? null;
$end_date         = $_POST['end_date']         ?? null;
$duration         = intval($_POST['duration']  ?? 0);
$delivery_address = trim($_POST['delivery_address'] ?? '');
$city             = trim($_POST['city']        ?? '');
$service_type     = $_POST['service_type']     ?? 'none';
$event_time       = $_POST['event_time']       ?? null;
$notes            = trim($_POST['notes']       ?? '');
$payment_method   = $_POST['payment_method']   ?? 'on_delivery';

if (!$caftan_id || !$start_date || !$end_date || $duration < 1) {
    jsonResponse(["error" => "Champs obligatoires manquants"], 400);
}
if (empty($delivery_address)) {
    jsonResponse(["error" => "L'adresse de livraison est obligatoire"], 400);
}

$stmt = $pdo->prepare("SELECT id, price_per_day FROM caftans WHERE id = ? AND status != 'hidden'");
$stmt->execute([$caftan_id]);
$caftan = $stmt->fetch();
if (!$caftan) {
    jsonResponse(["error" => "Caftan introuvable"], 404);
}

$service_fees = ['none' => 0, 'hair' => 300, 'makeup' => 400, 'full' => 600];
$total = ($caftan['price_per_day'] * $duration) + ($service_fees[$service_type] ?? 0);

// Date conflict check
$stmt = $pdo->prepare("
    SELECT id FROM reservations
    WHERE caftan_id = ? AND status NOT IN ('cancelled','returned')
    AND ((start_date <= ? AND end_date >= ?) OR (start_date <= ? AND end_date >= ?) OR (start_date >= ? AND end_date <= ?))
");
$stmt->execute([$caftan_id, $end_date, $start_date, $end_date, $start_date, $start_date, $end_date]);
if ($stmt->fetch()) {
    jsonResponse(["error" => "Ce caftan est déjà réservé pour ces dates"], 409);
}

// Insert — with or without payment_method column
$hasPaymentCol = $pdo->query("SHOW COLUMNS FROM reservations LIKE 'payment_method'")->fetch();

if ($hasPaymentCol) {
    $sql    = "INSERT INTO reservations (user_id,caftan_id,start_date,end_date,duration_days,delivery_address,city,service_type,event_time,notes,total_price,payment_method,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'pending')";
    $params = [$user_id,$caftan_id,$start_date,$end_date,$duration,$delivery_address,$city,$service_type,$event_time?:null,$notes,$total,$payment_method];
} else {
    $sql    = "INSERT INTO reservations (user_id,caftan_id,start_date,end_date,duration_days,delivery_address,city,service_type,event_time,notes,total_price,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,'pending')";
    $params = [$user_id,$caftan_id,$start_date,$end_date,$duration,$delivery_address,$city,$service_type,$event_time?:null,$notes,$total];
}

$pdo->prepare($sql)->execute($params);

jsonResponse(["success" => true, "message" => "Réservation créée", "reservation_id" => $pdo->lastInsertId(), "total" => $total]);