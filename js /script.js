document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('#cart-count').forEach(el => {
            el.textContent = count;
        });
    }
    
    function addToCart(productId, productName, productPrice) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`"${productName}" a fost adăugat în coș!`);
    }
    

    
    function loadProducts() {
        const products = [
            { id: 1, name: 'Calculator Gaming RX-9000', price: 40999, category: 'gaming', image: 'catalog/rx9000.jpg' },
            { id: 2, name: 'Calculator Birou B-200', price: 24999, category: 'birou', image: 'catalog/birou.jpg' },
            { id: 3, name: 'Laptop Ultra SLIM', price: 35799, category: 'laptop', image: 'catalog/rog.jpg'},
            { id: 4, name: 'Placă video RTX 3080', price: 42999, category: 'componente', image: 'catalog/rtx3080.jpg' },
            { id: 5, name: 'Procesor i9-12900K', price: 23999, category: 'componente', image: 'catalog/i9.png' },
            { id: 6, name: 'Calculator Gaming Pro X', price: 59999, category: 'gaming', image: 'catalog/gamingX.jpg' },
            { id: 7, name: 'Laptop Gaming GX-700', price: 52999, category: 'laptop', image: 'catalog/gx700.jpg' },
            { id: 8, name: 'Calculator All-in-One', price: 32999, category: 'birou', image: 'catalog/allinone.webp' }
        ];
        
        const categoryFilter = document.getElementById('category-filter');
        const priceFilter = document.getElementById('price-filter');
        const productsGrid = document.querySelector('.products-grid');
        
        function filterProducts() {
            const selectedCategory = categoryFilter.value;
            const selectedPrice = priceFilter.value;
            
            let filteredProducts = products;
            
            if (selectedCategory !== 'all') {
                filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
            }
            
            if (selectedPrice !== 'all') {
                const [min, max] = selectedPrice.split('-').map(Number);
                
                filteredProducts = filteredProducts.filter(product => {
                    if (selectedPrice === '4000+') {
                        return product.price >= 4000;
                    } else {
                        return product.price >= min && product.price <= max;
                    }
                });
            }
            
            displayProducts(filteredProducts);
        }
        
        function displayProducts(productsToDisplay) {
            productsGrid.innerHTML = '';
            
            if (productsToDisplay.length === 0) {
                productsGrid.innerHTML = '<p class="no-products">Nu s-au găsit produse care să corespundă filtrelor.</p>';
                return;
            }
            
            productsToDisplay.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price} lei</p>
                    <button class="btn-add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Adaugă în coș</button>
                `;
                productsGrid.appendChild(productCard);
            });
            
            document.querySelectorAll('.btn-add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    const productName = this.getAttribute('data-name');
                    const productPrice = parseFloat(this.getAttribute('data-price'));
                    addToCart(productId, productName, productPrice);
                });
            });
        }
        
        if (categoryFilter && priceFilter) {
            categoryFilter.addEventListener('change', filterProducts);
            priceFilter.addEventListener('change', filterProducts);
            filterProducts();
        }
        const popularProductsGrid = document.querySelector('.popular-products .products-grid');
        if (popularProductsGrid) {
            const popularProducts = products.slice(0, 3);
            popularProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price} lei</p>
                    <button class="btn-add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Adaugă în coș</button>
                `;
                popularProductsGrid.appendChild(productCard);
            });
        }
    }
    
    function loadCart() {
        const cartItemsList = document.getElementById('cart-items-list');
        const subtotalElement = document.getElementById('subtotal');
        const shippingElement = document.getElementById('shipping');
        const totalElement = document.getElementById('total');
        
        if (cartItemsList) {
            cartItemsList.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsList.innerHTML = '<tr><td colspan="5" class="empty-cart">Coșul tău este gol</td></tr>';
                subtotalElement.textContent = '0';
                shippingElement.textContent = '0';
                totalElement.textContent = '0';
                return;
            }
            
            let subtotal = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.price} lei</td>
                    <td>
                        <input type="number" min="1" value="${item.quantity}" class="quantity-input" data-id="${item.id}">
                    </td>
                    <td>${itemTotal} lei</td>
                    <td>
                        <button class="btn-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                cartItemsList.appendChild(row);
            });
            
            const shipping = subtotal >= 1000 ? 0 : 50;
            const total = subtotal + shipping;
            
            subtotalElement.textContent = subtotal.toFixed(2);
            shippingElement.textContent = shipping.toFixed(2);
            totalElement.textContent = total.toFixed(2);
            
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    const newQuantity = parseInt(this.value);
                    
                    if (newQuantity < 1) {
                        this.value = 1;
                        return;
                    }
                    
                    const item = cart.find(item => item.id === productId);
                    if (item) {
                        item.quantity = newQuantity;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        loadCart(); 
                    }
                });
            });
            
            document.querySelectorAll('.btn-remove').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    cart = cart.filter(item => item.id !== productId);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    loadCart(); 
                });
            });
        }
    }
    
    updateCartCount();
    loadProducts();
    loadCart();
});
