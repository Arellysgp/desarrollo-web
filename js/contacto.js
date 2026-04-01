/* JAVASCRIPT PARA CONTACTO.HTML */

// Manejo del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Obtener valores del formulario
            const formData = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                asunto: document.getElementById('asunto').value,
                mensaje: document.getElementById('mensaje').value.trim()
            };

            // Validación básica
            if (!validarFormulario(formData)) {
                mostrarMensaje('Por favor completa todos los campos correctamente', 'error');
                return;
            }

            // Deshabilitar botón mientras se envía
            const submitBtn = contactForm.querySelector('.btn-submit');
            const textoOriginal = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';

            try {
                // Simular envío (aquí conectarías con tu backend o servicio de email)
                await enviarFormulario(formData);

                // Mostrar mensaje de éxito
                mostrarMensaje('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');

                // Limpiar formulario
                contactForm.reset();

                // Opcional: Enviar notificación por WhatsApp
                setTimeout(() => {
                    if (confirm('¿Deseas recibir confirmación por WhatsApp?')) {
                        const mensaje = `Hola, soy ${formData.nombre}. Acabo de enviar un mensaje desde el formulario web sobre: ${formData.asunto}`;
                        window.open(`https://wa.me/51999999999?text=${encodeURIComponent(mensaje)}`, '_blank');
                    }
                }, 1500);

            } catch (error) {
                console.error('Error al enviar formulario:', error);
                mostrarMensaje('Hubo un error al enviar el mensaje. Por favor intenta nuevamente o contáctanos por WhatsApp.', 'error');
            } finally {
                // Rehabilitar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = textoOriginal;
            }
        });
    }
});

// Validar datos del formulario
function validarFormulario(datos) {
    // Validar nombre (mínimo 3 caracteres)
    if (datos.nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres');
        return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.email)) {
        alert('Por favor ingresa un email válido');
        return false;
    }

    // Validar teléfono (números y puede tener +, espacios, guiones)
    const telefonoRegex = /^[\d\s\+\-\(\)]+$/;
    if (!telefonoRegex.test(datos.telefono) || datos.telefono.length < 7) {
        alert('Por favor ingresa un teléfono válido');
        return false;
    }

    // Validar que se haya seleccionado un asunto
    if (!datos.asunto) {
        alert('Por favor selecciona un asunto');
        return false;
    }

    // Validar mensaje (mínimo 10 caracteres)
    if (datos.mensaje.length < 10) {
        alert('El mensaje debe tener al menos 10 caracteres');
        return false;
    }

    return true;
}

// Mostrar mensaje de éxito o error
function mostrarMensaje(mensaje, tipo) {
    const formMessage = document.getElementById('formMessage');
    
    formMessage.textContent = mensaje;
    formMessage.className = `form-message ${tipo}`;
    formMessage.style.display = 'block';

    // Scroll al mensaje
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Función para enviar formulario (simula envío)
async function enviarFormulario(datos) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Aquí implementarías la lógica real de envío
    // Opciones:
    // 1. EmailJS (servicio gratuito para enviar emails desde frontend)
    // 2. API de tu backend
    // 3. Firebase Functions
    // 4. Formspree u otro servicio similar

    console.log('Datos del formulario:', datos);

    // Guardar en localStorage como respaldo (opcional)
    guardarEnHistorial(datos);

    return true;
}

// Guardar en historial local (opcional)
function guardarEnHistorial(datos) {
    const historial = JSON.parse(localStorage.getItem('mensajes_contacto') || '[]');
    
    historial.push({
        ...datos,
        fecha: new Date().toISOString(),
        id: Date.now()
    });

    // Mantener solo los últimos 10 mensajes
    if (historial.length > 10) {
        historial.shift();
    }

    localStorage.setItem('mensajes_contacto', JSON.stringify(historial));
}

// Validación en tiempo real de email
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.style.borderColor = '#dc3545';
            mostrarTooltip(this, 'Email inválido');
        } else {
            this.style.borderColor = '';
            ocultarTooltip();
        }
    });
}

// Validación en tiempo real de teléfono
const telefonoInput = document.getElementById('telefono');
if (telefonoInput) {
    telefonoInput.addEventListener('input', function() {
        // Permitir solo números, +, espacios, guiones y paréntesis
        this.value = this.value.replace(/[^0-9\+\-\s\(\)]/g, '');
    });

    telefonoInput.addEventListener('blur', function() {
        if (this.value && this.value.length < 7) {
            this.style.borderColor = '#dc3545';
            mostrarTooltip(this, 'Teléfono muy corto');
        } else {
            this.style.borderColor = '';
            ocultarTooltip();
        }
    });
}

// Contador de caracteres para el textarea
const mensajeTextarea = document.getElementById('mensaje');
if (mensajeTextarea) {
    const maxCaracteres = 500;
    
    // Crear contador
    const contador = document.createElement('div');
    contador.className = 'char-counter';
    contador.style.textAlign = 'right';
    contador.style.fontSize = '0.85rem';
    contador.style.color = '#999';
    contador.style.marginTop = '5px';
    mensajeTextarea.parentElement.appendChild(contador);

    mensajeTextarea.addEventListener('input', function() {
        const restantes = maxCaracteres - this.value.length;
        contador.textContent = `${this.value.length} / ${maxCaracteres} caracteres`;
        
        if (restantes < 0) {
            contador.style.color = '#dc3545';
            this.value = this.value.substring(0, maxCaracteres);
        } else if (restantes < 50) {
            contador.style.color = '#ffc107';
        } else {
            contador.style.color = '#999';
        }
    });

    // Inicializar contador
    contador.textContent = `0 / ${maxCaracteres} caracteres`;
}

// Funciones auxiliares para tooltips
function mostrarTooltip(elemento, mensaje) {
    // Implementación simple de tooltip
    let tooltip = document.getElementById('validation-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'validation-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: #dc3545;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.85rem;
            z-index: 1000;
            pointer-events: none;
        `;
        document.body.appendChild(tooltip);
    }

    tooltip.textContent = mensaje;
    tooltip.style.display = 'block';

    const rect = elemento.getBoundingClientRect();
    tooltip.style.top = `${rect.top - 30}px`;
    tooltip.style.left = `${rect.left}px`;
}

function ocultarTooltip() {
    const tooltip = document.getElementById('validation-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Auto-guardar borrador (opcional)
let autoSaveTimeout;
const formInputs = ['nombre', 'email', 'telefono', 'asunto', 'mensaje'];

formInputs.forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                guardarBorrador();
            }, 2000);
        });
    }
});

function guardarBorrador() {
    const borrador = {};
    formInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            borrador[inputId] = input.value;
        }
    });
    
    localStorage.setItem('borrador_contacto', JSON.stringify(borrador));
    console.log('Borrador guardado');
}

// Cargar borrador al iniciar (opcional)
function cargarBorrador() {
    const borrador = localStorage.getItem('borrador_contacto');
    if (borrador) {
        const datos = JSON.parse(borrador);
        
        if (confirm('Tienes un mensaje sin enviar. ¿Deseas recuperarlo?')) {
            formInputs.forEach(inputId => {
                const input = document.getElementById(inputId);
                if (input && datos[inputId]) {
                    input.value = datos[inputId];
                }
            });
        } else {
            localStorage.removeItem('borrador_contacto');
        }
    }
}

// Cargar borrador al cargar la página
window.addEventListener('load', cargarBorrador);

// Limpiar borrador al enviar exitosamente
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function() {
        localStorage.removeItem('borrador_contacto');
    });
}

// INTEGRACIÓN CON EMAILJS (Opcional - requiere cuenta en EmailJS)
/*
Para usar EmailJS:
1. Crea una cuenta en https://www.emailjs.com/
2. Configura un servicio de email
3. Crea una plantilla de email
4. Agrega esta librería en tu HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
5. Inicializa EmailJS con tu Public Key

Ejemplo de implementación:

// Inicializar EmailJS
emailjs.init("TU_PUBLIC_KEY");

async function enviarFormulario(datos) {
    try {
        const response = await emailjs.send(
            "TU_SERVICE_ID",
            "TU_TEMPLATE_ID",
            {
                to_name: "Dulcinea",
                from_name: datos.nombre,
                from_email: datos.email,
                phone: datos.telefono,
                subject: datos.asunto,
                message: datos.mensaje
            }
        );
        
        console.log('Email enviado:', response);
        return true;
    } catch (error) {
        console.error('Error al enviar email:', error);
        throw error;
    }
}
*/

// INTEGRACIÓN CON FORMSPREE (Alternativa simple)
/*
Para usar Formspree:
1. Crea una cuenta en https://formspree.io/
2. Crea un formulario y obtén el endpoint
3. Usa este código:

async function enviarFormulario(datos) {
    const response = await fetch('https://formspree.io/f/TU_FORM_ID', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });
    
    if (!response.ok) {
        throw new Error('Error al enviar formulario');
    }
    
    return await response.json();
}
*/

console.log('✅ Script de contacto cargado correctamente');