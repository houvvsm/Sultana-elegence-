<?php
require_once 'functions.php';

$type = $_GET['type'] ?? null;

$sql = "SELECT * FROM partners WHERE status = 'approved'";
$params = [];

if ($type && in_array($type, ['boutique', 'beauty'])) {
    $sql .= " AND type = ?";
    $params[] = $type;
}

$sql .= " ORDER BY created_at DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
jsonResponse($stmt->fetchAll());