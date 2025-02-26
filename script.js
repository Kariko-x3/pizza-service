document.addEventListener("DOMContentLoaded", () => {
    const orderButtons = document.querySelectorAll(".order-button");
    const cartList = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartContainer = document.getElementById("cart");
    const checkoutButton = document.getElementById("checkout-button");
    const cart = [];

    orderButtons.forEach(button => {
        button.addEventListener("click", () => {
            const pizzaName = button.getAttribute("data-item");
            const price = parseFloat(button.previousElementSibling.textContent.replace("€", "").trim());
            
            cart.push({ name: pizzaName, price: price });
            updateCart();
            cartContainer.classList.add("show"); // Zeigt den Warenkorb mit Animation an
        });
    });

    function updateCart() {
        cartList.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const li = document.createElement("li");
            li.textContent = `${item.name} - ${item.price.toFixed(2)} €`;

            // X-Button erstellen
            const removeButton = document.createElement("button");
            removeButton.textContent = "X";
            removeButton.classList.add("remove-item");
            removeButton.addEventListener("click", () => {
                cart.splice(index, 1);
                updateCart();
                if (cart.length === 0) {
                    cartContainer.classList.remove("show"); // Versteckt den Warenkorb, wenn leer
                }
            });

            li.appendChild(removeButton);
            cartList.appendChild(li);
        });

        cartTotal.textContent = total.toFixed(2);
    }
    
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            alert("Bestellung abgeschickt! Vielen Dank.");
            cart.length = 0;
            updateCart();
            cartContainer.classList.remove("show"); // Versteckt den Warenkorb nach Bestellung
        });
    }
});


