// References
const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const purchaseButton = document.getElementById("purchase-button");

// Variables
let cart = [];

// Load Cart Data
function loadCart() {
    const savedCart = localStorage.getItem("checkoutCart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        displayCart();
    } else {
        alert("No cart found. Redirecting to the main page.");
        window.location.href = "pharmacy.html"; // Redirect if no cart found
    }
}

// Display Cart Items in Table
function displayCart() {
    checkoutItems.innerHTML = ""; // Clear existing rows
    let totalCost = 0;

    cart.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.quantity * item.price).toFixed(2)}</td>
        `;
        checkoutItems.appendChild(row);

        totalCost += item.quantity * item.price;
    });

    checkoutTotal.textContent = `Total Price: $${totalCost.toFixed(2)}`;
}

// Validate Form Inputs
function validateForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const postalCode = document.getElementById("postal-code").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();
    const expiryDate = document.getElementById("expiry-date").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!name || !email || !address || !city || !postalCode || !cardNumber || !expiryDate || !cvv) {
        alert("Please fill in all fields.");
        return false;
    }

    if (!validateCardNumber(cardNumber)) {
        alert("Invalid card number. Use format XXXX-XXXX-XXXX-XXXX.");
        return false;
    }

    if (!validateCVV(cvv)) {
        alert("Invalid CVV. It should be a 3-digit number.");
        return false;
    }

    return { name, email, address, city, postalCode, cardNumber, expiryDate };
}

// Validate Card Number Format
function validateCardNumber(cardNumber) {
    const cardRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/; // Format: XXXX-XXXX-XXXX-XXXX
    return cardRegex.test(cardNumber);
}

// Validate CVV Format
function validateCVV(cvv) {
    const cvvRegex = /^\d{3}$/; // 3-digit number
    return cvvRegex.test(cvv);
}

// Handle Purchase Submission
function handlePurchase() {
    const formData = validateForm();
    if (!formData) return;

    alert(`Thank you, ${formData.name}! Your order has been placed successfully.`);
    localStorage.removeItem("checkoutCart"); // Clear the cart data after purchase
    window.location.href = "pharmacy.html"; // Redirect back to the pharmacy page
}

// Attach Event Listener to Purchase Button
purchaseButton.addEventListener("click", handlePurchase);

// Load cart items on page load
loadCart();
