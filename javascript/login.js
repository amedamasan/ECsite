document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // フォームのデフォルト送信を防止

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('../php/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    username: username,
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'main-page.html'; // ログイン成功後のリダイレクト
                } else {
                    alert(data.message); // エラーメッセージの表示
                }
            })
            .catch(error => {
                console.error('エラー:', error);
            });
        });
    } else {
        console.error('フォームが見つかりません');
    }
});
