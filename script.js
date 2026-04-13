const pizzas = [
    {
        id: 1,
        name: 'بيتزا مارجريتا',
        description: 'صلصة الطماطم الغنية، جبنة الموتزاريلا الطازجة، وأوراق الريحان الخضراء.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 2,
        name: 'بيتزا بيبروني',
        description: 'شرائح البيبروني المقرمشة مع طبقة سخية من جبنة الموتزاريلا.',
        price: 190,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 3,
        name: 'بيتزا دجاج باربيكيو',
        description: 'قطع الدجاج المشوية، بصل أحمر شرائح، وصلصة الباربيكيو المدخنة.',
        price: 210,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 4,
        name: 'بيتزا كواترو فورماجي',
        description: 'مزيج فاخر من 4 أنواع أجبان: موتزاريلا، بارميزان، جورجونزولا، وريكوتا.',
        price: 230,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 5,
        name: 'بيتزا سي فود',
        description: 'تشكيلة من فواكه البحر، روبيان، كاليماري مع ثوم ونكهات بحرية.',
        price: 280,
        image: 'https://images.unsplash.com/photo-1561043433-9265f73e685f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 6,
        name: 'بيتزا خضار',
        description: 'مشروم طازج، فلفل ألوان، زيتون أسود، بصل، وطماطم كرزية.',
        price: 170,
        image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
];

let cart = [];

// Initialize Menu
function initMenu() {
    const grid = document.getElementById('pizza-grid');
    grid.innerHTML = '';

    pizzas.forEach(pizza => {
        const card = document.createElement('div');
        card.className = 'pizza-card';
        card.innerHTML = `
            <div class="pizza-img-wrapper">
                <img src="${pizza.image}" alt="${pizza.name}" class="pizza-img">
            </div>
            <div class="pizza-info">
                <h3 class="pizza-name">${pizza.name}</h3>
                <p class="pizza-desc">${pizza.description}</p>
                <div class="pizza-price-add">
                    <span class="pizza-price">${pizza.price} ج.م</span>
                    <button class="btn-add" onclick="addToCart(${pizza.id})" title="أضف للسلة">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Cart Functions
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');

    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function addToCart(pizzaId) {
    const pizza = pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;

    const existingItem = cart.find(item => item.id === pizzaId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...pizza, quantity: 1 });
    }

    updateCartUI();
    // Show a small animation or open cart
    const sidebar = document.getElementById('cart-sidebar');
    if (!sidebar.classList.contains('active')) {
        toggleCart();
    }
}

function updateQuantity(pizzaId, delta) {
    const item = cart.find(i => i.id === pizzaId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(pizzaId);
    } else {
        updateCartUI();
    }
}

function removeFromCart(pizzaId) {
    cart = cart.filter(item => item.id !== pizzaId);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update contents
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">السلة فارغة حالياً. أضف بعض البيتزا!</div>';
        checkoutForm.style.display = 'none';
        checkoutBtn.disabled = true;
        totalPriceEl.textContent = '0 ج.م';
        return;
    }

    checkoutForm.style.display = 'flex';
    checkoutBtn.disabled = false;

    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} ج.م للواحدة</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
                </div>
            </div>
            <div class="cart-item-total">
                <button class="remove-item" onclick="removeFromCart(${item.id})" title="حذف">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    totalPriceEl.textContent = `${total} ج.م`;
}

// WhatsApp Checkout
function processCheckout() {
    if (cart.length === 0) return;

    const name = document.getElementById('customer-name').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const notes = document.getElementById('customer-notes').value.trim();

    if (!name || !address) {
        alert('برجاء إدخال الاسم والعنوان بالكامل لإتمام الطلب.');
        return;
    }

    // Phone number from user requirement
    const phoneNumber = "201282887573";

    let message = "🍕 *طلب جديد من بيتزا كينج* 🍕\n\n";
    message += "*المنتجات:*\n";

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `▪ ${item.quantity}x ${item.name} - ${itemTotal} ج.م\n`;
    });

    message += `\n*الإجمالي:* ${total} ج.م\n\n`;
    message += "*بيانات العميل:*\n";
    message += `👤 الاسم: ${name}\n`;
    message += `📍 العنوان: ${address}\n`;

    if (notes) {
        message += `📝 ملاحظات: ${notes}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initMenu();
});
