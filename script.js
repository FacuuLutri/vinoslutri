// Global cart array to store products
let cart = [];

// Initialize popup and default tab on page load
document.addEventListener("DOMContentLoaded", function () {
    initPopup();
    // Use safe selector and check before clicking
    const firstTab = document.querySelector('a[href="#"]');
    if (firstTab) firstTab.click(); 
});

// Create popup element with improved styling and initialization
function initPopup() {
    const popup = document.createElement('div');
    popup.id = 'popup';
    Object.assign(popup.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        padding: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        opacity: '0',
        transition: 'opacity 0.5s',
        zIndex: '1000' // Ensure popup is on top
    });
    document.body.appendChild(popup);
}

// Product catalog with potential for expansion
const products = [
    { id: 1, name: 'Vino Tinto', price: 10, category: 'Vinos' },
    { id: 2, name: 'Vino Blanco', price: 11, category: 'Vinos' },
    { id: 3, name: 'Vino Rosado', price: 13, category: 'Vinos' },
    { id: 4, name: 'Champagne', price: 25, category: 'Espumantes' },
    { id: 5, name: 'Cerveza Rubia', price: 5, category: 'Cervezas' },
    { id: 6, name: 'Cerveza Negra', price: 6, category: 'Cervezas' },
    { id: 7, name: 'Cerveza Roja', price: 7, category: 'Cervezas' },
    { id: 8, name: 'Gaseosa de Naranja', price: 2, category: 'Refrescos' },
    { id: 9, name: 'Gaseosa de Cola', price: 2.5, category: 'Refrescos' },
    { id: 10, name: 'Gaseosa de Limón', price: 2, category: 'Refrescos' }
];

// Add event listener with null check
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', function () {
        showSuggestions(this.value);
    });
}

// Enhanced suggestion search with redirection
function showSuggestions(query) {
    const suggestionsContainer = document.getElementById('suggestions');
    if (!suggestionsContainer) return;

    suggestionsContainer.innerHTML = '';
    
    if (query.length === 0) {
        suggestionsContainer.classList.remove('active');
        return;
    }

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const suggestionDiv = document.createElement('div');
            suggestionDiv.textContent = `${product.name} - $${product.price}`;
            suggestionDiv.classList.add('suggestion-item');
            suggestionDiv.onclick = () => {
                addToCart(product.name, product.price);
                
                // Redirigir a la subcategoría y categoría correcta
                redirectToProductSubcategory(product);
            };
            suggestionsContainer.appendChild(suggestionDiv);
        });
        suggestionsContainer.classList.add('active');
    } else {
        suggestionsContainer.classList.remove('active');
    }
}

// Nueva función para redirigir a la subcategoría correcta
function redirectToProductSubcategory(product) {
    // Limpiar búsqueda y sugerencias
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('suggestions');
    if (searchInput) searchInput.value = '';
    if (suggestionsContainer) suggestionsContainer.classList.remove('active');

    // Mapeo de categorías a subcategorías
    const categoryMap = {
        'Vinos': 'vinos-subcategoria',
        'Espumantes': 'espumantes-subcategoria',
        'Cervezas': 'cervezas-subcategoria', 
        'Refrescos': 'refrescos-subcategoria'
    };

    // Encuentra la categoría del producto
    const subcategoryId = categoryMap[product.category];
    
    if (subcategoryId) {
        // Abrir pestaña de Categorías
        const categoriasTab = document.querySelector('[onclick="openTab(event, \'Categorias\')"]');
        if (categoriasTab) categoriasTab.click();

        // Mostrar subcategoría correspondiente
        toggleSubcategories(subcategoryId);

        // Resaltar producto específico
        showProductInCategories(product.name);
    }
}

// Improved product highlighting in categories
function showProductInCategories(productName) {
    const productsInCategories = document.querySelectorAll('.product-item');
    productsInCategories.forEach(product => {
        product.classList.remove('highlight');
        if (product.textContent.includes(productName)) {
            product.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            product.classList.add('highlight');
        }
    });
}

// More robust cart management
function addToCart(name, price, image = '') {
    const existingItem = cart.find(product => product.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1, image });
    }
    
    updateCart();
    showPopup(`${name} ha sido agregado al carrito.`);
}

// Comprehensive cart update function
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const totalQuantity = document.getElementById('total-quantity');
    
    if (!cartItems || !cartTotal || !cartCount || !totalQuantity) return;

    cartItems.innerHTML = '';
    let total = 0;
    let quantity = 0;

    cart.forEach((product, index) => {
        const li = document.createElement('div');
        li.classList.add('flex', 'items-center', 'mb-2', 'p-2', 'bg-gray-100', 'rounded', 'shadow');
        
        li.innerHTML = `
            ${product.image ? `<img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover mr-2"/>` : ''}
            <span class="flex-grow">${product.name} - $${product.price}</span>
            <input 
                type="number" 
                value="${product.quantity}" 
                min="1" 
                class="w-16 mx-2 border rounded"
                onchange="updateQuantity(${index}, this.value)"
            />
            <button 
                onclick="removeFromCart(${index})" 
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
            >
                Eliminar
            </button>
        `;
        
        cartItems.appendChild(li);
        total += product.price * product.quantity;
        quantity += product.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.length;
    totalQuantity.textContent = quantity;
}

// Quantity update with validation
function updateQuantity(index, quantity) {
    const parsedQuantity = parseInt(quantity, 10);
    
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
        removeFromCart(index);
    } else {
        cart[index].quantity = parsedQuantity;
        updateCart();
    }
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Enhanced popup with accessibility
function showPopup(message) {
    const popup = document.getElementById('popup');
    if (!popup) return;

    popup.textContent = message;
    popup.setAttribute('role', 'alert'); // Improve accessibility
    popup.style.display = 'block';
    
    requestAnimationFrame(() => {
        popup.style.opacity = '1';
    });

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
        }, 500);
    }, 2000);
}

// Toggle cart visibility
function toggleCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.classList.toggle('hidden');
        cartElement.classList.toggle('active');
    }
}

// Close cart when clicking outside
window.addEventListener('click', function(event) {
    const cartElement = document.getElementById('cart');
    const cartButton = document.querySelector('.cart-button');
    
    if (cartElement && cartButton && 
        !cartElement.contains(event.target) && 
        !cartButton.contains(event.target)) {
        cartElement.classList.add('hidden');
    }
});

// Consolidated tab management
function openTab(evt, tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    // Hide drink tabs and subcategories
    document.querySelectorAll('.drink-tab, .subcategories').forEach(element => {
        element.classList.add('hidden');
    });

    // Remove active state from all tab links
    document.querySelectorAll('.tablink').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = 'block';
    }

    // Add active state to current tab link
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('active');
    }
}

// Optional: Utility function for subcategory and drink tab management
function toggleSubcategories(id) {
    document.querySelectorAll('.subcategories').forEach(sub => {
        sub.classList.toggle('hidden', sub.id !== id);
    });
}

function openDrinkTab(drinkId) {
    document.querySelectorAll('.drink-tab').forEach(tab => {
        tab.classList.toggle('hidden', tab.id !== drinkId);
    });
}

// Account form submission handler
document.getElementById('accountForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username')?.value;
    const email = document.getElementById('email')?.value;

    // Optional: Add client-side validation
    if (!username || !email) {
        alert('Por favor complete todos los campos');
        return;
    }

    // Placeholder for server-side update logic
    document.getElementById('message').innerText = 
        `Información actualizada: ${username} - ${email}`;

    const popup = document.getElementById('updatePopup');
    if (popup) {
        popup.style.display = 'block';
        popup.style.opacity = '1';

        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 500);
        }, 2000);
    }
});


function openTab(evt, tabName) {
    // Ocultar todas las pestañas
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"; // Oculta el contenido de la pestaña
    }

    // Remover la clase "active" de todos los enlaces
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", ""); // Elimina la clase "active"
    }

    // Mostrar la pestaña seleccionada y agregar la clase "active" al enlace
    document.getElementById(tabName).style.display = "block"; // Muestra el contenido de la pestaña seleccionada
    evt.currentTarget.className += " active"; // Agrega la clase "active" al enlace
}

// Agregar un evento al formulario para manejar el inicio de sesión
document.getElementById('accountForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma tradicional
    const username = document.querySelector('.input-field[type="text"]').value; // Obtiene el nombre de usuario
    const password = document.querySelector('.input-field[type="password"]').value; // Obtiene la contraseña

    // Aquí puedes agregar la lógica para manejar el inicio de sesión, como enviar los datos a un servidor
    console.log(`Nombre de Usuario: ${username}, Contraseña: ${password}`);

    // Mostrar un mensaje de éxito o error
    alert(`Iniciaste sesión como: ${username}`);
});