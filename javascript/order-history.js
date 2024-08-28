document.addEventListener('DOMContentLoaded', () => {
    // ユーザー名を取得するためのAPIリクエスト
    fetch('../php/getname.php')
        .then(response => response.json())
        .then(data => {
            const username = data.username;

        if (!username) {
            alert('ログインしていません。');
            window.location.href = '../html/login.html'; // ログインページにリダイレクト
            return;
        }

        // 注文履歴を取得するためのAPIリクエスト
        fetch(`../php/order-history.php?username=${encodeURIComponent(username)}`)
            .then(response => response.json())
            .then(data => {
                const ordersTableBody = document.getElementById('order-history').querySelector('tbody');

            if (Array.isArray(data)) {
                let rows = '';
                data.forEach(order => {
                    // 価格をJPYに
                    const formattedPrice = new Intl.NumberFormat('ja-JP', {
                        style: 'currency',
                        currency: 'JPY',
                        minimumFractionDigits: 0, // 小数点以下を表示しない
                        maximumFractionDigits: 0  // 小数点以下を表示しない
                    }).format(order.price);

                    rows += `
                        <tr>
                            <td>${order.order_id}</td>
                            <td>${new Date(order.order_date).toLocaleDateString()}</td>
                            <td>${order.username}</td>
                            <td>${order.item_name}</td>
                            <td>${formattedPrice}</td>
                            <td>${order.count}</td>
                        </tr>
                    `;
                });
                ordersTableBody.innerHTML = rows;
            } else {
                ordersTableBody.innerHTML = `
                    <tr>
                        <td colspan="6">注文履歴が見つかりません。</td>
                    </tr>
                `;
            }
        })
        .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error:', error));
});
