<?php
// DB接続
require './db_connect.php';

// セッション開始
session_start();

// ユーザーIDをセッションから取得
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'ユーザーIDが設定されていません。']);
    exit;
}

$user_id = $_SESSION['user_id'];

// ユーザー情報の取得
$sql = "SELECT username FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode(['success' => true, 'username' => $user['username']]);
} else {
    echo json_encode(['success' => false, 'message' => 'ユーザーが見つかりません。']);
}

// 接続の閉鎖
$stmt->close();
$conn->close();
?>
