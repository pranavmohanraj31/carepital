// References for sections
const sections = {
    Analgesics: document.getElementById("analgesics"),
    Antibiotics: document.getElementById("antibiotics"),
    Antidepressants: document.getElementById("antidepressants"),
    Antihistamines: document.getElementById("antihistamines"),
    Antihypertensives: document.getElementById("antihypertensives"),
};

// References for cart table and total price
const cartTableBody = document.getElementById("cart-items");
const totalPriceDisplay = document.getElementById("total-price");

// References for buttons
const saveFavouritesButton = document.getElementById("save-favourites");
const applyFavouritesButton = document.getElementById("apply-favourites");
const buyNowButton = document.getElementById("buy-now");

// Variables
let cart = [];
let totalCost = 0;

// On page load: fetch medicines and set up cart
document.addEventListener("DOMContentLoaded", () => {
    fetchMedicines();
    setupEventListeners();
    initialise();
});

// Fetch medicines dynamically from medicine.json
async function fetchMedicines() {
    try {
        // Corrected the path to use forward slashes
        const response = await fetch("scripts/medicine.json");
        console.log("Response Status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON data
        const medicines = await response.json();
        console.log("Fetched Medicines:", medicines); // Debugging: Log the medicines

        // Populate the medicines into the relevant sections
        populateMedicines(medicines);
    } catch (error) {
        console.error("Error fetching medicines:", error);
    }
}

// Populate medicines into respective sections
function populateMedicines(medicines) {
    medicines.forEach(medicine => {
        if (sections[medicine.category]) {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("item");
            itemDiv.innerHTML = `
                <label>${medicine.name}</label>
                <input type="number" min="0" class="quantity" id="${medicine.name.replace(" ", "_")}">
                <button class="add-to-cart" data-name="${medicine.name}" data-price="${medicine.price}">Add to Cart</button>
            `;
            sections[medicine.category].appendChild(itemDiv);
        }
    });

    // Attach event listeners to dynamically added buttons
    document.querySelectorAll(".add-to-cart").forEach(button =>
        button.addEventListener("click", handleAddToCart)
    );
}

// Setup event listeners for favourites and checkout buttons
function setupEventListeners() {
    saveFavouritesButton.addEventListener("click", saveFavourites);
    applyFavouritesButton.addEventListener("click", applyFavourites);
    buyNowButton.addEventListener("click", proceedToCheckout);
}

// Initialise the cart
function initialise() {
    console.log("Application initialised");
    cart = [];
    totalCost = 0;
    updateCart();
}

// Handle Add to Cart functionality
function handleAddToCart(event) {
    const button = event.target;
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    const quantityInput = button.previousElementSibling;
    const quantity = parseInt(quantityInput.value) || 0;

    if (quantity > 0) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ name, price, quantity });
        }
        updateCart();
        quantityInput.value = ""; // Clear input
    } else {
        alert("Please enter a valid quantity.");
    }
}

// Update the cart table and total price
function updateCart() {
    cartTableBody.innerHTML = ""; // Clear table

    cart.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.quantity * item.price).toFixed(2)}</td>
        `;
        cartTableBody.appendChild(row);
    });

    // Calculate total price
    totalCost = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    totalPriceDisplay.textContent = `Total Price: $${totalCost.toFixed(2)}`;
}

// Save favourites to local storage
function saveFavourites() {
    if (cart.length > 0) {
        localStorage.setItem("favouriteCart", JSON.stringify(cart));
        alert("Cart saved as favourites!");
    } else {
        alert("Your cart is empty.");
    }
}

// Apply favourites from local storage
function applyFavourites() {
    const savedCart = localStorage.getItem("favouriteCart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
        alert("Favourite cart applied!");
    } else {
        alert("No favourite cart found.");
    }
}

// Proceed to checkout page
function proceedToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    window.location.href = "checkout.html";
}
