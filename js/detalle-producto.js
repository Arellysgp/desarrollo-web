import { db, doc, getDoc, collection, query, where, getDocs, limit } from './firebase-config.js';

let producto = null, cant = 1;
const id = new URLSearchParams(window.location.search).get('id');

if (!id) location.href = 'productos.html';

// Cargar producto
async function cargar() {
    try {
        const snap = await getDoc(doc(db, "productos", id));
        if (!snap.exists()) throw new Error('No encontrado');
        
        producto = { id: snap.id, ...snap.data() };
        mostrar();
        relacionados(producto.categoria);
    } catch (e) {
        document.getElementById('productDetailContainer').innerHTML = `
            <div><h2>No pudimos cargar este producto</h2></div>`;
    }
}

// Mostrar
function mostrar() {
    document.title = `${producto.nombre} - Dulcinea`;
    document.querySelector('.breadcrumb-item.active').textContent = producto.nombre;
    
    const caract = producto.caracteristicas?.length 
        ? producto.caracteristicas.map(c => `<div class="feature-item"><i class="bi bi-check-circle-fill feature-icon"></i><span>${c}</span></div>`).join('')
        : '<div class="feature-item"><i class="bi bi-check-circle-fill feature-icon"></i><span>Producto artesanal de alta calidad</span></div>';
    
    document.getElementById('productDetailContainer').innerHTML = `
        <div class="product-detail-card" data-aos="fade-up">
            <div class="product-detail-content">
                <div class="product-image-section">
                    <span class="product-badge-detail">${producto.badge || 'Nuevo'}</span>
                    <img src="${producto.imagen_principal || 'imagenes/placeholder.jpg'}" 
                         alt="${producto.nombre}" class="product-main-image">
                </div>
                <div class="product-info-section">
                    <span class="product-category-tag">${producto.categoria}</span>
                    <h1 class="product-title-detail">${producto.nombre.toUpperCase()}</h1>
                    <p class="product-description-full">${producto.descripcion_completa || producto.descripcion || 'Delicioso postre artesanal'}</p>
                    <div class="product-features">${caract}</div>
                    <div class="product-price-section">
                        <div class="price-info">
                            <span class="product-price-large">S/ ${(producto.precio || 0).toFixed(2)}</span>
                            <p class="product-portion-info">${producto.porciones || 1} porción${producto.porciones > 1 ? 'es' : ''}</p>
                        </div>
                        <div class="quantity-selector">
                            <span class="quantity-label">Cantidad:</span>
                            <div class="quantity-controls">
                                <button class="quantity-btn" id="dec">-</button>
                                <span class="quantity-value" id="val">1</span>
                                <button class="quantity-btn" id="inc">+</button>
                            </div>
                        </div>
                    </div>
                    <button class="btn-add-large" id="add">
                        <i class="bi bi-cart-plus-fill"></i> Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Events
    document.getElementById('dec').onclick = () => cambiarCant(-1);
    document.getElementById('inc').onclick = () => cambiarCant(1);
    document.getElementById('add').onclick = agregar;
}

// Cambiar cantidad
function cambiarCant(n) {
    cant = Math.max(1, Math.min(10, cant + n));
    document.getElementById('val').textContent = cant;
    document.getElementById('dec').style.opacity = cant === 1 ? '0.5' : '1';
    document.getElementById('inc').style.opacity = cant === 10 ? '0.5' : '1';
}

// Agregar al carrito
function agregar() {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const existe = carrito.find(i => i.id === producto.id);
    
    if (existe) existe.cantidad += cant;
    else carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, imagen: producto.imagen_principal, cantidad: cant });
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    const btn = document.getElementById('add');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="bi bi-check-circle-fill"></i> ¡Agregado!';
    btn.style.background = '#4CAF50';
    btn.disabled = true;
    
    notif(`${cant} × "${producto.nombre}" agregado`);
    
    setTimeout(() => {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        cant = 1;
        cambiarCant(0);
    }, 2000);
}

// Productos relacionados
async function relacionados(cat) {
    try {
        const q = query(collection(db, "productos"), where("categoria", "==", cat), limit(4));
        const snap = await getDocs(q);
        const grid = document.getElementById('relatedProductsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        let n = 0;
        snap.forEach(d => {
            if (d.id !== id && n < 3) {
                const p = d.data();
                const card = document.createElement('a');
                card.href = `detalle-producto.html?id=${d.id}`;
                card.className = 'related-product-card';
                card.setAttribute('data-aos', 'fade-up');
                card.innerHTML = `
                    <img src="${p.imagen_principal || 'imagenes/placeholder.jpg'}" alt="${p.nombre}" class="related-product-image">
                    <div class="related-product-info">
                        <h3 class="related-product-title">${p.nombre}</h3>
                        <p class="related-product-price">S/ ${(p.precio || 0).toFixed(2)}</p>
                    </div>
                `;
                grid.appendChild(card);
                n++;
            }
        });
        
        if (n === 0) grid.innerHTML = '<p style="text-align:center;color:#999">No hay productos relacionados</p>';
        if (window.AOS) AOS.refresh();
    } catch (e) {}
}

// Notificacion
function notif(msg) {
    const n = document.createElement('div');
    n.className = 'notificacion';
    n.innerHTML = `<i class="bi bi-check-circle-fill"></i><span>${msg}</span>`;
    n.style.cssText = 'position:fixed;bottom:30px;right:-300px;background:#4CAF50;color:white;padding:15px 25px;border-radius:10px;box-shadow:0 5px 20px rgba(0,0,0,0.3);display:flex;align-items:center;gap:10px;z-index:9999;transition:right 0.3s';
    document.body.appendChild(n);
    setTimeout(() => n.style.right = '30px', 10);
    setTimeout(() => { n.style.right = '-300px'; setTimeout(() => n.remove(), 300); }, 3000);
}

cargar();