document.addEventListener('DOMContentLoaded', () => {
    const cartTable = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');

    // カートの内容を更新する
    function updateCart() {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const uniqueItem = {};

        // 重複を取り除き数量を集計
        cartItems.forEach(item => {
            if (uniqueItem[item.name]) {
                uniqueItem[item.name].quantity += item.quantity || 1;
            } else {
                uniqueItem[item.name] = { ...item, quantity: item.quantity || 1 };
            }
        });

        cartItems = Object.values(uniqueItem);
        localStorage.setItem('cart', JSON.stringify(cartItems)); // 更新されたカートを保存

        cartTable.innerHTML = '';
        let total = 0;

        if (cartItems.length === 0) {
            // カートが空の場合
            cartTable.innerHTML = `<tr><td colspan="6">カートは空です。</td></tr>`;
        } else {
            cartItems.forEach((item, index) => {
                total += item.price * item.quantity;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${item.image}" alt="${item.name}"></td>
                    <td>${item.name}</td>
                    <td>¥${item.price.toLocaleString()}</td>
                    <td>${item.quantity}</td>
                    <td>¥${(item.price * item.quantity).toLocaleString()}</td>
                    <td><button onclick="removeItem('${item.name}')">削除</button></td>
                `;
                cartTable.appendChild(row);
            });
        }

        // 合計金額を表示
        totalPrice.textContent = `¥${total.toLocaleString()}`;
    }

    // カートアイテムを削除する
    window.removeItem = function(itemName) {
        let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const updateCartItems = [];

        // アイテムを1つずつ減らす
        cartItems.forEach(item => {
            if (item.name === itemName) {
                if (item.quantity > 1) {
                    // 数量が1より大きい場合は数量を減らす
                    updateCartItems.push({ ...item, quantity: item.quantity - 1 });
                }
                // 数量が1の場合はアイテムを削除する
            } else {
                updateCartItems.push(item);
            }
        });

        localStorage.setItem('cart', JSON.stringify(updateCartItems));
        updateCart();
    }

    // カートを空にする
    document.getElementById('clear-cart-button').addEventListener('click', () => {
        const confirmation = confirm("カートを空にしますか？");
        if (confirmation) {
            localStorage.removeItem('cart');
            updateCart();
            alert("カートが空になりました。");
        }
    });

    // 注文確定の処理
    document.getElementById('checkout-button').addEventListener('click', () => {
        fetch('../php/getname.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    processOrder(data.username);
                } else {
                    alert("ユーザー情報の取得に失敗しました。");
                }
            })
            .catch(error => console.error('Error:', error));
    });

    // 注文処理
    function processOrder(username) {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const total = Array.from(document.querySelectorAll('#cart-items tr'))
            .reduce((sum, row) => {
                const priceText = row.children[4]?.innerText.replace(/[^0-9]/g, '') || '0';
                return sum + parseInt(priceText, 10);
            }, 0);

        // カートが空の場合
        if (cartItems.length === 0) {
            alert("カートが空です。商品を追加してください。");
            return;
        }

        // 注文確認
        const confirmation = confirm("注文を確定しますか？");

        // 注文データの確認
        if (confirmation) {
            const orderData = {
                username: username,
                total_price: total,
                items: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity || 1,
                    price: item.price
                }))
            };

            console.log('Order data:', JSON.stringify(orderData)); // デバッグ

            //fetchでPHPに送信 
            fetch('../php/order.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    localStorage.removeItem('cart'); // 注文後にカートを空にする
                    alert("注文が完了しました！");
                    updateCart(); // カートの表示を更新する
                } else {
                    alert("注文の処理中にエラーが発生しました: " + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }

    // ページ読み込み時にカートの内容を表示
    updateCart();
});
