import { db } from "./firebase.js";
import { doc, getDoc, collection, query, where, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const contentDiv = document.getElementById('product-content');

// Helper to get params
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function fetchProductDetails() {
    const productId = getQueryParam('id');

    if (!productId) {
        contentDiv.innerHTML = '<div class="loading">Product ID not found. <a href="index.html">Go back</a></div>';
        return;
    }

    try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            renderProduct(data, productId);
            
            // Update page title
            document.title = `${data.title} - Byteclave Resources`;
            
            // Fetch related resources
            fetchRelated(data.category, productId);
        } else {
            contentDiv.innerHTML = '<div class="loading">Product not found. <a href="index.html">Back to Home</a></div>';
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        contentDiv.innerHTML = '<div class="loading">Error loading product details.</div>';
    }
}

async function fetchRelated(category, currentId) {
    if (!category) return;

    try {
        // Updated query logic to handle potential field changes while remaining compatible
        const q = query(
            collection(db, "products"),
            where("active", "==", true),
            limit(10) // Fetch more to filter client-side for simplicity if schema varies
        );
        
        const querySnapshot = await getDocs(q);
        const related = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (doc.id !== currentId && data.category === category) {
                related.push({ id: doc.id, ...data });
            }
        });

        if (related.length > 0) {
            renderRelated(related.slice(0, 3));
        }
    } catch (error) {
        console.error("Error fetching related resources:", error);
    }
}

function renderRelated(related) {
    const section = document.createElement('section');
    section.className = 'related-section container';
    section.innerHTML = `
        <h3>Related Resources</h3>
        <div class="related-grid">
            ${related.map(item => `
                <a href="product.html?id=${item.id}" class="related-card">
                    <img src="${item.imageUrl || 'https://placehold.co/300x200/142a23/ffffff?text=No+Image'}" alt="${item.title}" class="related-img">
                    <div class="related-body">
                        <h4 class="related-title">${item.title}</h4>
                        <span class="badge" style="font-size: 0.7rem;">${item.fileType || 'PDF'}</span>
                    </div>
                </a>
            `).join('')}
        </div>
    `;
    contentDiv.parentElement.appendChild(section);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle" style="color: var(--clave-green);"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showPreview(url) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'preview-modal';
    
    // Improved viewer: Use a direct iframe for PDF and Google Docs Viewer for other documents
    // Adding timestamp to force reload and avoid cache issues with Google Viewer
    const isPDF = url.toLowerCase().endsWith('.pdf');
    // For PDFs, we add #toolbar=0&navpanes=0&scrollbar=1 to discourage/avoid download if browser respects it,
    // though the most reliable way for cross-origin Firestore links is Google Docs Viewer.
    // Let's use Google Docs Viewer for EVERYTHING to ensure it's a web-based preview and not a direct download.
    const previewUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true&t=${Date.now()}`;
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 style="margin: 0; font-size: 1.1rem; color: #fff; font-family: 'Outfit', sans-serif;">Resource Preview</h3>
                <button class="modal-close" id="close-modal" aria-label="Close">&times;</button>
            </div>
            <div class="preview-container" style="flex: 1; position: relative; background: #fff; overflow: hidden;">
                <iframe src="${previewUrl}" class="preview-iframe" id="preview-frame" style="width: 100%; height: 100%; border: none; display: block;"></iframe>
                <div id="preview-loader" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: var(--clave-blue);">
                    <i class="fas fa-spinner fa-spin fa-3x"></i>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const frame = document.getElementById('preview-frame');
    const loader = document.getElementById('preview-loader');
    
    frame.onload = () => {
        loader.style.display = 'none';
        // Ensure iframe has correct dimensions after load
        frame.style.height = '100%';
        frame.style.width = '100%';
    };

    // Trigger animation
    setTimeout(() => modal.classList.add('active'), 10);
    
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };
    
    document.getElementById('close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function renderProduct(data, id) {
    const shareUrl = window.location.href;
    const shareText = `Check out ${data.title} on Byteclave Resources!`;

    const description = data.fullDescription || data.description || "No description available";
    const imageUrl = data.imageUrl || "";

    // Update SEO Meta Tags dynamically
    document.title = `${data.title} - Byteclave Resources`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', (data.shortDescription || description).substring(0, 160));
    
    // Update Open Graph tags
    document.getElementById('og-title').setAttribute('content', data.title);
    document.getElementById('og-description').setAttribute('content', (data.shortDescription || description).substring(0, 160));
    document.getElementById('og-image').setAttribute('content', imageUrl);

    const html = `
        <div class="product-image-container">
            <img src="${imageUrl}" alt="${data.title}" class="product-image" onerror="this.src='https://placehold.co/600x400/142a23/ffffff?text=No+Image'">
        </div>
        
        <div class="product-info">
            <h1>${data.title}</h1>
            
            <div class="product-meta">
                <span class="badge">${data.fileType || 'PDF'}</span>
            </div>
            
            <div class="product-description">
                ${description}
            </div>
            
            <div class="action-buttons">
                ${data.fileUrl ? `
                    <div style="display: flex; gap: 10px;">
                        <a href="${data.fileUrl}" id="download-btn" target="_blank" class="btn btn-primary" style="flex: 1;">
                            <i class="fas fa-download"></i> Download ${data.fileType || 'PDF'}
                        </a>
                        ${data.fileType?.toLowerCase() === 'pdf' ? `
                            <button id="preview-btn" class="btn" style="border: 1px solid var(--clave-green); color: var(--clave-green); flex: 1;">
                                <i class="fas fa-eye"></i> Preview PDF
                            </button>
                        ` : ''}
                    </div>
                ` : `
                    <button class="btn btn-primary btn-block" disabled style="opacity: 0.5; cursor: not-allowed;">
                        Download unavailable
                    </button>
                `}
            </div>

            <div class="share-section">
                <h3>Share this resource</h3>
                <div class="share-buttons">
                    <button id="copy-link-btn" class="copy-link-btn">
                        <i class="fas fa-link"></i> Copy Link
                    </button>
                </div>
            </div>
            
            <div style="margin-top: 30px; display: flex; gap: 15px;">
                <a href="https://instagram.com/byteclave" target="_blank" style="color: var(--clave-muted);"><i class="fab fa-instagram"></i></a>
                <a href="https://tiktok.com/@byteclave" target="_blank" style="color: var(--clave-muted);"><i class="fab fa-tiktok"></i></a>
                <a href="https://facebook.com/byteclave" target="_blank" style="color: var(--clave-muted);"><i class="fab fa-facebook-f"></i></a>
            </div>
        </div>
    `;

    contentDiv.innerHTML = html;

    // Add Download Toast functionality
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            showToast('Download started! Thank you for using Byteclave.');
        });
    }

    // Add Preview functionality
    const previewBtn = document.getElementById('preview-btn');
    if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            showPreview(data.fileUrl);
        });
    }

    // Add Copy Link functionality
    const copyBtn = document.getElementById('copy-link-btn');
    copyBtn.addEventListener('click', async () => {
        try {
            let linkToCopy = shareUrl;
            
            // Attempt to shorten using CleanURI (Free, no-auth API)
            try {
                const response = await fetch('https://cleanuri.com/api/v1/shorten', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `url=${encodeURIComponent(shareUrl)}`
                });
                const data = await response.json();
                if (data.result_url) {
                    linkToCopy = data.result_url;
                }
            } catch (apiErr) {
                console.warn("Shortener API failed, using long link:", apiErr);
            }

            await navigator.clipboard.writeText(linkToCopy);
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.borderColor = 'var(--clave-green)';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
                copyBtn.style.borderColor = '';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchProductDetails);

