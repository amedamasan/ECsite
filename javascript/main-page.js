let cartCount = 0;

function addToCart(item) {
    // カートの中身をローカルストレージから取得
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 商品情報を追加
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));

    // カートカウントを更新
    cartCount = cart.length;
    document.getElementById('cart-count').innerText = cartCount;
    alert(item.name + "がカートに追加されました！");
}

document.addEventListener('DOMContentLoaded', () => {
    // カートカウントを更新
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartCount = cart.length;
    document.getElementById('cart-count').innerText = cartCount;

    // 商品にカート追加ボタンのイベントリスナーを追加
    document.querySelectorAll('figure').forEach((figure) => {
        const imgAlt = figure.querySelector('img').alt; // 商品名を取得
        const price = parseInt(figure.querySelector('button').getAttribute('data-price')); // 価格を取得
        const image = figure.querySelector('img').src; // 画像URLを取得
        const button = figure.querySelector('button');
        
        const item = {
            name: imgAlt,
            price: price,
            image: image
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

