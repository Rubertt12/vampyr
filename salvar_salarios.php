<?php
$host = 'localhost';
$dbname = 'salariosDB';
$username = 'root';  // Usuário padrão do MySQL no XAMPP
$password = '';      // Senha padrão do MySQL no XAMPP (vazio)

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Obtendo os dados do frontend via POST
    $data = json_decode(file_get_contents('php://input'), true);

    $ano = $data['ano'];
    $mes = $data['mes'];
    $salario15 = $data['salario15'];
    $salario30 = $data['salario30'];
    $extras = json_encode($data['extras']);  // Codificando extras para o formato JSON

    // Inserindo dados na tabela
    $sql = "INSERT INTO salarios (ano, mes, salario15, salario30, extras)
            VALUES (:ano, :mes, :salario15, :salario30, :extras)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':ano' => $ano,
        ':mes' => $mes,
        ':salario15' => $salario15,
        ':salario30' => $salario30,
        ':extras' => $extras,
    ]);

    echo json_encode(['message' => 'Dados salvos com sucesso!']);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
