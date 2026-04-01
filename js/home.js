// home-productos.js
import { db, collection, getDocs, query, where, limit } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('productsGrid');
    const loading = document.getElementById('loadingProducts');
    const categorias = ['Tortas', 'Tradicionales', 'Cuchareables'];

    for (let i = 0; i < categorias.length; i++) {
        const snapshot = await getDocs(query(collection(db, "productos"), where("categoria", "==", categorias[i]), limit(1)));
        
        snapshot.forEach(doc => {
            const p = doc.data();
            grid.innerHTML += `
                <div data-aos="zoom-in">
                    <div class="product-card" onclick="location.href='detalle-producto.html?id=${doc.id}'">
                        <div class="product-image-container">
                            <img src="${p.imagen_principal || 'imagenes/placeholder.jpg'}" alt="${p.nombre}" class="product-image">
                        </div>
                        <div class="product-content">
                            <h3 class="product-title">${p.nombre.toUpperCase()}</h3>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    loading.style.display = 'none';
    grid.style.display = 'grid';
    if (window.AOS) AOS.refresh();
});