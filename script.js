const dummyListings = [
    { title: "HP Laptop 8GB RAM", price: "₦85,000", condition: "Used - Good", image: "https://via.placeholder.com/300x180?text=HP+Laptop" },
    { title: "iPhone 11 64GB", price: "₦120,000", condition: "Used - Fair", image: "https://via.placeholder.com/300x180?text=iPhone+11" },
    { title: "Engineering Textbook", price: "₦3,500", condition: "Used - Good", image: "https://via.placeholder.com/300x180?text=Textbook" },
    { title: "Reading Chair", price: "₦8,000", condition: "Used - Fair", image: "https://via.placeholder.com/300x180?text=Chair" },
]

const grid = document.getElementById('listings-grid')

dummyListings.forEach(item => {
    grid.innerHTML += `
        <div class="listing-card">
            <img src="${item.image}" alt="${item.title}">
            <div class="listing-info">
                <h3>${item.title}</h3>
                <div class="price">${item.price}</div>
                <div class="condition">${item.condition}</div>
            </div>
        </div>
    `
})