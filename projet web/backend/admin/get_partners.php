<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

$status = $_GET['status'] ?? null;

$sql = "SELECT * FROM partners";
$params = [];

if ($status && in_array($status, ['pending','approved','rejected'])) {
    $sql .= " WHERE status = ?";
    $params[] = $status;
}

$sql .= " ORDER BY created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);

jsonResponse($stmt->fetchAll());