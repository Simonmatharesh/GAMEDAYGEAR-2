document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    addCartEventListeners();
});

function initializeCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount(cart);
}

function updateCartCount(cart) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function addCartEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productPrice = parseFloat(this.dataset.productPrice);
            const productImage = this.closest('.product-card').querySelector('.product-image img').src;

            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });

            // Visual feedback
            this.classList.add('added');
            this.textContent = 'Added to Cart';
            setTimeout(() => {
                this.classList.remove('added');
                this.textContent = 'Add to Cart';
            }, 2000);
        });
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(cart);
}