<?php
header('Content-Type: application/json'); // レスポンスのContent-TypeをJSONに設定

$response = array(); // レスポンス用の配列を初期化


// POSTメソッドでリクエストされているか確認
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start(); // セッションを開始

    // DB接続
    require './db_connect.php';

    // フォームから送信されたデータを取得
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // ユーザー名に基づいてパスワードを取得するクエリを実行
    $sql = "SELECT id, password FROM users WHERE username = '$user'";
    $result = $conn->query($sql);

    // クエリ結果がある場合
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc(); // クエリ結果を取得

        // パスワードの照合
        if ($pass === $row['password']) {
            $_SESSION['user_id'] = $row['id']; // ユーザーIDをセッションに保存
            $_SESSION['username'] = $user; // ユーザー名をセッションに保存
            $response['success'] = true;
            $response['message'] = "ログイン成功";
        } else {
            $response['success'] = false;
            $response['message'] = "パスワードが違います";
        }
    } else {
        $response['success'] = false;
        $response['message'] = "ユーザー名が見つかりません";
    }

    // データベース接続を閉じる
    $conn->close();
} else {
    $response['success'] = false;
    $response['message'] = "無効なリクエストメソッド";
}

// レスポンスをJSON形式で出力
echo json_encode($response);
?>
