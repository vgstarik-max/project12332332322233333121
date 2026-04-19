const slider = document.getElementById('productSlider');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const countSpan = document.getElementById('cart-count');
const itemsContainer = document.getElementById('cart-items');
const totalSpan = document.getElementById('total-price');

let currentPosition = 0;
let isPaused = false;
let cart = JSON.parse(localStorage.getItem('plantifyCart')) || [];

// ФУНКЦІЇ СЛАЙДЕРА
function updateSlider() {
    slider.style.transform = `translateX(-${currentPosition}px)`;
}

function moveNext() {
    const card = document.querySelector('.product-card');
    const step = card.offsetWidth + 20;
    const maxScroll = slider.scrollWidth - slider.parentElement.offsetWidth;
    
    if (currentPosition < maxScroll - 5) {
        currentPosition += step;
    } else {
        currentPosition = 0;
    }
    updateSlider();
}

function movePrev() {
    const card = document.querySelector('.product-card');
    const step = card.offsetWidth + 20;
    
    if (currentPosition > 0) {
        currentPosition -= step;
    } else {
        currentPosition = slider.scrollWidth - slider.parentElement.offsetWidth;
    }
    updateSlider();
}

// Події кнопок
nextBtn.addEventListener('click', () => { moveNext(); isPaused = true; });
prevBtn.addEventListener('click', () => { movePrev(); isPaused = true; });

// Автопрокрутка
setInterval(() => {
    if (!isPaused) moveNext();
}, 5000);

// Пауза при наведенні
slider.addEventListener('mouseenter', () => isPaused = true);
slider.addEventListener('mouseleave', () => isPaused = false);

// КОШИК ТА ПЕРЕХІД
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

function updateCartUI() {
    countSpan.innerText = cart.length;
    if (itemsContainer) {
        itemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            itemsContainer.innerHTML += `
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #f4f4f4; padding-bottom:10px;">
                    <div><strong>${item.name}</strong><br><small>$${item.price}</small></div>
                    <button onclick="removeItem(${index})" style="border:none; background:none; color:red; cursor:pointer;">видалити</button>
                </div>
            `;
        });
        totalSpan.innerText = `$${total}`;
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('plantifyCart', JSON.stringify(cart));
    updateCartUI();
}

function goToProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// Старт
document.addEventListener('DOMContentLoaded', updateCartUI);



// Функція для повного оновлення цифри та списку в кошику
function refreshCart() {
    const savedCart = JSON.parse(localStorage.getItem('plantifyCart')) || [];
    const countElement = document.getElementById('cart-count');
    const itemsElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-price');

    if (countElement) countElement.innerText = savedCart.length;

    if (itemsElement) {
        itemsElement.innerHTML = '';
        let total = 0;
        savedCart.forEach((item, index) => {
            total += item.price;
            itemsElement.innerHTML += `
                <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span>${item.name}</span>
                    <span>$${item.price}</span>
                    <button onclick="removeFromCart(${index})" style="color:red; background:none; border:none; cursor:pointer;">×</button>
                </div>`;
        });
        if (totalElement) totalElement.innerText = `$${total}`;
    }
}

// Видалення товару
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('plantifyCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('plantifyCart', JSON.stringify(cart));
    refreshCart();
}

// ЗАПУСК ПРИ ЗАВАНТАЖЕННІ
document.addEventListener('DOMContentLoaded', refreshCart);



// Копія каталогу для пошуку
const searchCatalog = {
    'peperomia': { name: 'Peperomia Ginny' },
    'fern': { name: "Bird's Nest Fern" },
    'palm': { name: 'Large Majesty Palm' },
    'pet-friendly': { name: 'Pet Friendly Plant' },
    'snake': { name: 'Snake Plant' },
    'monstera': { name: 'Monstera Deliciosa' }
};

function liveSearch() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const suggestionsBox = document.getElementById('searchSuggestions');
    
    // Очищуємо попередні результати
    suggestionsBox.innerHTML = '';
    
    if (input.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    let hasResults = false;

    // Перевіряємо кожен вазон у каталозі
    for (let id in searchCatalog) {
        let plantName = searchCatalog[id].name;
        let lowerName = plantName.toLowerCase();

        if (lowerName.includes(input)) {
            hasResults = true;
            
            // Створюємо елемент списку
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            
            // Підсвічуємо співпадіння
            const regex = new RegExp(`(${input})`, "gi");
            const highlightedName = plantName.replace(regex, `<span class="highlight">$1</span>`);
            
            item.innerHTML = highlightedName;

            // При кліку — перехід на сторінку товару
            item.onclick = function() {
                window.location.href = `product.html?id=${id}`;
            };

            suggestionsBox.appendChild(item);
        }
    }

    // Показуємо блок лише якщо є результати
    suggestionsBox.style.display = hasResults ? 'block' : 'none';
}

// Закривати пошук, якщо клікнули в будь-якому іншому місці екрана
document.addEventListener('click', function(e) {
    if (!document.querySelector('.search-container').contains(e.target)) {
        document.getElementById('searchSuggestions').style.display = 'none';
    }
});


