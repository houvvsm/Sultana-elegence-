<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

$stmt = $pdo->query("
    SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.city,
        u.size_profile,
        u.status,
        u.created_at,
        COUNT(r.id) AS reservation_count
    FROM users u
    LEFT JOIN reservations r ON u.id = r.user_id
    WHERE u.role = 'client'
    GROUP BY u.id
    ORDER BY u.created_at DESC
");

jsonResponse($stmt->fetchAll());