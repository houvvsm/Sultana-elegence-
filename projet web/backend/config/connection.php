<?php
// No CORS needed — frontend and backend run on the same origin (http://localhost)

$hostname = "localhost";
$username = "root";
$password = "";
$database = "sultana_elegance";

try {
    $pdo = new PDO(
        "mysql:host=$hostname;dbname=$database;charset=utf8mb4",
        $username,
        $password
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]);
    exit;
}