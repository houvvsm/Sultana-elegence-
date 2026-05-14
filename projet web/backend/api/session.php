<?php
require_once 'functions.php';
require_once 'auth.php';

if (isLoggedIn()) {
    jsonResponse([
        "logged_in" => true,
        "user_id" => $_SESSION['user_id'],
        "name" => $_SESSION['name'],
        "role" => $_SESSION['role']
    ]);
} else {
    jsonResponse(["logged_in" => false]);
}