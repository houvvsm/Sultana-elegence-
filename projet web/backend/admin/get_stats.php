<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

$stats = [
    "caftans" => $pdo->query("SELECT COUNT(*) FROM caftans WHERE status != 'hidden'")->fetchColumn(),
    "reservations_active" => $pdo->query("SELECT COUNT(*) FROM reservations WHERE status IN ('pending','confirmed','delivered')")->fetchColumn(),
    "clients" => $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'client'")->fetchColumn(),
    "partners_pending" => $pdo->query("SELECT COUNT(*) FROM partners WHERE status = 'pending'")->fetchColumn()
];

jsonResponse($stats);