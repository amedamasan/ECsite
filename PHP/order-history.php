<?php

// DB接続
require './db_connect.php';

// セッションの開始
session_start();

// ユーザー名がセッションに存在するか確認
if (!isset($_SESSION['username'])) {
    echo json_encode(['status' => 'error', 'message' => 'ログインしていません']);
    exit();
}
$username = $_SESSION['username'];

// クエリの実行
$sql = "
    SELECT 
        id AS order_id,
        order_date,
        username,
        item_name,
        price,
        count
    FROM order_details
    WHERE username = ?
    ORDER BY order_date DESC, order_id DESC
";


$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);

if (!$stmt->execute()) {
    echo json_encode(['status' => 'error', 'message' => 'クエリの実行に失敗しました']);
    exit();
}

$result = $stmt->get_result();
$orders = [];

while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

echo json_encode($orders);
$stmt->close();
$conn->close();
?>
