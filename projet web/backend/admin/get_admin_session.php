<?php
require_once '../api/functions.php';
require_once '../api/auth.php';

requireAdmin();

jsonResponse([
    "success" => true,
    "admin" => [
        "id" => $_SESSION['user_id'],
        "name" => $_SESSION['name'],
        "email" => $_SESSION['email']
    ]
]);