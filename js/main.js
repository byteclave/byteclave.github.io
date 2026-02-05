import { db } from "./firebase.js";
import { collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const freeGrid = document.getElementById('products-grid');
const premiumGrid = document.getElementById('premium-grid');
const searchInput = document.getElementById('search-input');

let allProducts = [];
let searchQuery = '';

async function fetchProducts() {
    try {
        const q = query(collection(db, "products"));
        
        console.log("Fetching products from Firestore...");
        const querySnapshot = await getDocs(q);
        
        allProducts = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Ensure active is true or not explicitly false
            if (data.active !== false) {
                allProducts.push({ id: doc.id, ...data });
            }
        });

        renderProducts();
        
    } catch (error) {
        console.error("Error fetching products:", error);
        if (freeGrid) freeGrid.innerHTML = '<div class="loading">Error loading resources.</div>';
        if (premiumGrid) premiumGrid.innerHTML = '';
    }
}

function renderProducts() {
    console.log("Total products fetched:", allProducts.length);
    
    const filtered = allProducts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (p.shortDescription && p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    console.log("Filtered products:", filtered.length);

    // Render all visible products in one grid as premium is now a button elsewhere
    renderGrid(freeGrid, filtered);
}

function renderGrid(container, products) {
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<div class="loading">No resources match your search.</div>';
        return;
    }

    let html = '';
    products.forEach((data) => {
        const description = data.shortDescription || data.description || "No description available";
        
        html += `
            <article class="card">
                <div class="card-img-wrapper">
                    <img src="${data.imageUrl || 'https://placehold.co/600x400/141C24/ffffff?text=No+Image'}" 
                         alt="${data.title}" class="card-img" loading="lazy"
                         onerror="this.src='https://placehold.co/600x400/141C24/ffffff?text=No+Image'">
                </div>
                <div class="card-body">
                    <h2 class="card-title">${data.title}</h2>
                    <p class="card-desc">${description.substring(0, 150)}${description.length > 150 ? '...' : ''}</p>
                    <div class="card-footer">
                        <span class="badge">${data.fileType || 'PDF'}</span>
                        <a href="product.html?id=${data.id}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            </article>
        `;
    });
    container.innerHTML = html;
}

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
});

// Back to Top Button
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', fetchProducts);
