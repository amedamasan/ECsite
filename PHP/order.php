<?php
session_start();

if (!isset($_SESSION['username'])) {
    echo json_encode(['status' => 'error', 'message' => 'ログインしていません']);
    exit();
}

// データベース接続と注文データ取得処理
$username = $_SESSION['username'];

require './db_connect.php';

// POST データの取得
$data = json_decode(file_get_contents('php://input'), true);

// データが正しいか確認
if (isset($data['username']) && isset($data['total_price']) && isset($data['items'])) {
    $username = $conn->real_escape_string($data['username']);
    $total_price = $conn->real_escape_string($data['total_price']);

    // 注文詳細を挿入
    foreach ($data['items'] as $item) {
        $item_name = $conn->real_escape_string($item['name']);
        $quantity = (int)$item['quantity'];
        $price = (float)$item['price'];

        $sql = "INSERT INTO order_details (username, total_price, item_name, count, price) VALUES ('$username', '$total_price', '$item_name', '$quantity', '$price')";

        if (!$conn->query($sql)) {
            echo json_encode(["status" => "error", "message" => "注文の処理中にエラーが発生しました: " . $conn->error]);
            $conn->close();
            exit;
        }
    }

    echo json_encode(["status" => "success", "message" => "注文が正常に処理されました。"]);
} else {
    echo json_encode(["status" => "error", "message" => "無効なデータです。"]);
}

$conn->close();
?>
