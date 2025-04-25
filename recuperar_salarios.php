<?php
$host = 'localhost';
$dbname = 'salariosDB';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT * FROM salarios";
    $stmt = $pdo->query($sql);
    $salarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($salarios);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
