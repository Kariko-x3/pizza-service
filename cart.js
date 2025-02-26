// Warenkorb Daten aus localStorage abrufen oder leeres Array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Warenkorb anzeigen
function displayCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceContainer = document.getElementById("total-price");
    cartItemsContainer.innerHTML = "";

    let totalPrice = 0;

    cart.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.innerHTML = `
            <p>${item.name} - ${item.price.toFixed(2)} €</p>
            <button onclick="removeItem('${item.name}')">Entfernen</button>
        `;
        cartItemsContainer.appendChild(itemElement);
        totalPrice += item.price;
    });

    totalPriceContainer.innerText = totalPrice.toFixed(2);
}

// Artikel aus dem Warenkorb entfernen
function removeItem(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

// Bestellung abschließen
document.getElementById("order-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Verhindert das Standardformularabsenden

    if (cart.length === 0) {
        alert("Ihr Warenkorb ist leer!");
        return;
    }

    // Eingabewerte des Formulars
    const customerName = document.getElementById("name").value.trim();
    const customerSurname = document.getElementById("surname").value.trim();
    const customerAddress = document.getElementById("address").value.trim();
    const customerPhone = document.getElementById("phone").value.trim();
    const customerEmail = document.getElementById("email").value.trim();

    // Validierung der Eingaben
    let valid = true;
    let errorMessages = [];

    if (!customerName || !customerSurname || !customerAddress || !customerEmail) {
        errorMessages.push("Bitte füllen Sie alle erforderlichen Felder aus.");
        valid = false;
    }

    if (valid) {
        const orderData = {
            name: customerName,
            surname: customerSurname,
            address: customerAddress,
            phone: customerPhone,
            email: customerEmail,
            order: JSON.stringify(cart),
            total: document.getElementById("total-price").innerText
        };

        // Bestellung an Server senden
        fetch("/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert("Bestellung erfolgreich!");
                localStorage.removeItem("cart");
                window.location.href = "/";
            } else {
                alert("Fehler: " + data.error);
            }
        })
        .catch(error => {
            alert("Fehler beim Bestellvorgang: " + error);
        });
    } else {
        alert(errorMessages.join("\n"));
    }
});

// Initiale Anzeige des Warenkorbs
displayCart();


