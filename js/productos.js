import { db, collection, getDocs } from './firebase-config.js';

let productos = [], filtrados = [], pag = 1;
const porPag = 6;

// Cargar
async function cargar() {
    const g = document.getElementById('productsGrid');
    g.innerHTML = '<p style="text-align:center;padding:40px">Cargando...</p>';
    try {
        const snap = await getDocs(collection(db, "productos"));
        productos = filtrados = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        mostrar();
    } catch (e) {
        g.innerHTML = '<p style="text-align:center;padding:40px">Error</p>';
    }
}

// Mostrar
function mostrar() {
    const g = document.getElementById('productsGrid');
    const c = document.getElementById('productsCount');
    const inicio = (pag - 1) * porPag;
    const lista = filtrados.slice(inicio, inicio + porPag);
    
    if (!filtrados.length) {
        g.innerHTML = '<p style="text-align:center;padding:40px;color:#666">No hay productos</p>';
        c.textContent = '0 productos';
        document.getElementById('paginationControls')?.remove();
        return;
    }
    
    g.innerHTML = '';
    lista.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-aos', 'zoom-in');
        card.innerHTML = `
            <div class="product-image-container">
                <span class="product-badge">${p.badge || 'Nuevo'}</span>
                <img src="${p.imagen_principal || 'imagenes/placeholder.jpg'}" alt="${p.nombre}" class="product-image">
            </div>
            <div class="product-content">
                <div class="product-category">${p.categoria}</div>
                <h3 class="product-title">${p.nombre}</h3>
                <p class="product-description">${p.descripcion || 'Delicioso postre'}</p>
                <div class="product-footer">
                    <div class="product-price-info">
                        <span class="product-price">S/ ${(p.precio || 0).toFixed(2)}</span>
                        <span class="product-portion">${p.porciones || 1} porcion${p.porciones > 1 ? 'es' : ''}</span>
                    </div>
                </div>
            </div>
        `;
        card.onclick = () => window.location.href = `detalle-producto.html?id=${p.id}`;
        g.appendChild(card);
    });
    
    c.textContent = `${filtrados.length} producto${filtrados.length > 1 ? 's' : ''}`;
    pagination();
    if (window.AOS) AOS.refresh();
}

// Paginacion
function pagination() {
    const total = Math.ceil(filtrados.length / porPag);
    let p = document.getElementById('paginationControls');
    
    if (!p) {
        p = document.createElement('div');
        p.id = 'paginationControls';
        p.className = 'pagination-controls';
        document.querySelector('.products-content').appendChild(p);
    }
    
    if (total <= 1) { p.style.display = 'none'; return; }
    
    p.style.display = 'flex';
    p.innerHTML = `
        <button class="pagination-btn" ${pag === 1 ? 'disabled' : ''} onclick="cambiar(${pag - 1})">
            <i class="bi bi-chevron-left"></i> Anterior
        </button>
        <div class="pagination-numbers">${nums(total)}</div>
        <button class="pagination-btn" ${pag === total ? 'disabled' : ''} onclick="cambiar(${pag + 1})">
            Siguiente <i class="bi bi-chevron-right"></i>
        </button>
    `;
}

function nums(total) {
    let html = '';
    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= pag - 1 && i <= pag + 1)) {
            html += `<button class="pagination-number ${i === pag ? 'active' : ''}" onclick="cambiar(${i})">${i}</button>`;
        } else if (i === pag - 2 || i === pag + 2) {
            html += '<span class="pagination-dots">...</span>';
        }
    }
    return html;
}

window.cambiar = function(n) {
    if (n < 1 || n > Math.ceil(filtrados.length / porPag)) return;
    pag = n;
    mostrar();
    window.scrollTo({ top: document.querySelector('.products-main-container').offsetTop - 100, behavior: 'smooth' });
}

// Filtros
function filtros() {
    document.querySelectorAll('.category-item').forEach(btn => {
        btn.onclick = function() {
            document.querySelectorAll('.category-item').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const cat = this.getAttribute('data-category');
            filtrados = cat === 'todo' ? productos : productos.filter(p => p.categoria.toLowerCase() === cat);
            pag = 1;
            mostrar();
        };
    });
}

// Iniciar
document.addEventListener('DOMContentLoaded', () => { filtros(); cargar(); });