document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("productGrid");
    const categoryButtons = document.querySelectorAll(".category-filter button");
    const priceRange = document.getElementById("price-range");
    const availabilityFilter = document.getElementById("availability");
    const menuOverlay = document.getElementById("menuOverlay");
    const hamburgerBtn = document.getElementById("hamburgerBtn");

    let products = [];

    fetch("./shopdata.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load products: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Products loaded:", data);
            products = data.products;
            renderProducts(products);
        })
        .catch(error => console.error("Error loading products:", error));

    function renderProducts(filteredProducts) {
        productGrid.innerHTML = "";
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = "<p>No products match the selected filters.</p>";
            return;
        }
        filteredProducts.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p><strong>$${product.price}</strong></p>
                <button>Add to Cart</button>
            `;
            productGrid.appendChild(productItem);
        });
    }

    function filterProducts() {
        const selectedCategory = document.querySelector(".category-filter .active")?.dataset.category || "all";
        const maxPrice = parseInt(priceRange.value, 10);
        const selectedAvailability = availabilityFilter.value;

        const filteredProducts = products.filter(product => {
            const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
            const matchesPrice = product.price <= maxPrice;
            const matchesAvailability = selectedAvailability === "all" || product.availability === selectedAvailability;

            return matchesCategory && matchesPrice && matchesAvailability;
        });

        renderProducts(filteredProducts);
    }

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            filterProducts();
        });
    });

    priceRange.addEventListener("input", filterProducts);
    availabilityFilter.addEventListener("change", filterProducts);

    if (hamburgerBtn && menuOverlay) {
        hamburgerBtn.addEventListener("click", () => {
            menuOverlay.classList.toggle("active");
            document.body.classList.toggle("menu-open");
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const shopBody = document.querySelector(".shop-body"); // Target the correct element

    if (shopBody) {
        shopBody.style.overflowY = "auto"; // Ensure scrolling is enabled
    }

    console.log("Scrolling enabled on shop page.");
});
