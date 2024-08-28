<?php
// データベース接続
$servername = "localhost";
$username = "root";
$password = "rootpass";
$dbname = "ecsite";

// データベース接続の確立
$conn = new mysqli($servername, $username, $password, $dbname);

// 接続エラーの確認
if ($conn->connect_error) {
    die("接続失敗: " . $conn->connect_error);
}
?>
