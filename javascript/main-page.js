document.addEventListener('DOMContentLoaded', () => {
    // ローカルストレージからカートを取得
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // カートの総数量を計算
    let totalQuantity = cart.reduce((sum, cartItem) => sum + (cartItem.quantity || 1), 0);
    
    // カートカウントを更新
    document.getElementById('cart-count').innerText = totalQuantity;

    // 商品にカート追加ボタンのイベントリスナーを追加
    document.querySelectorAll('figure').forEach((figure) => {
        const imgAlt = figure.querySelector('img').alt; // 商品名を取得
        const price = parseInt(figure.querySelector('button').getAttribute('data-price')); // 価格を取得
        const image = figure.querySelector('img').src; // 画像URLを取得
        const button = figure.querySelector('button');
        
        const item = {
            name: imgAlt,
            price: price,
            image: image,
            quantity: 1 // 初期数量を1に設定
        };

        // ボタンが存在する場合のみイベントリスナーを追加
        if (button) {
            button.addEventListener('click', () => addToCart(item));
        }
    });

    // ユーザー名を取得して表示
    fetch('../php/getname.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const message = `ようこそ ${data.username} さん！`;
                document.getElementById('message').innerText = message;
            } else {
                console.error(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
});

function addToCart(item) {
    // カートの中身をローカルストレージから取得
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 既存の商品か確認して数量を更新
    let existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }

    // ローカルストレージにカートを保存
    localStorage.setItem('cart', JSON.stringify(cart));

    // カートの総数量を再計算
    let totalQuantity = cart.reduce((sum, cartItem) => sum + (cartItem.quantity || 1), 0);

    // カートカウントを更新
    document.getElementById('cart-count').innerText = totalQuantity;
    alert(item.name + "がカートに追加されました！");
}
