// Función para formatear el dinero a pesos chilenos (CLP)
const formatearCLP = (valor) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
};

// Cargar componentes con Async/Await
async function cargarComponentes(id, archivo) {
  const subcarpetas = window.location.pathname.includes("/pages/");
  const ruta = subcarpetas ? `../components/${archivo}` : `components/${archivo}`;
  
  try {
    const res = await fetch(ruta);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
    
    // Si se cargó el menú de navegación, verificamos si hay una sesión activa
    if (archivo === 'nav.html') {
      actualizarNavSesion();
    }
  } catch (error) {
    console.warn(`No se cargó el ${archivo}`, error);
  }
}

const catalogoProductos = [
  { id: 1, nombre: "Auriculares Studio Pro", precio: 45000, imagen: "img/card/REIFSTORE-MQTP3BE-A-VIEW6.jpg" },
  { id: 2, nombre: "Micrófono Condensador", precio: 75000, imagen: "img/card/Behringer-TM1-Microfono-de-Condensador-de-Estudio-con-Accesorios-B1-Planet-Music-1200x1200-1.jpg" },
  { id: 3, nombre: "Interfaz de Audio", precio: 85000, imagen: "img/card/u-phoria-um2-interfaz-de-audio-usb.jpg" },
  { id: 4, nombre: "Teclado Mecánico Setup", precio: 55000, imagen: "img/card/3315X4654094252028129.jpg" },
  { id: 5, nombre: "Tocadiscos", precio: 180000, imagen: "img/card/1731345043062-MKBW6SIA37-3-1.jpg"},
  { id: 6, nombre: "Monitores de Estudio", precio: 97000, imagen: "img/card/48ee9f93-bcbb-4ab2-bfcf-ef74d48c385c.jpg"},
  { id: 7, nombre: "Monitor Gamer", precio: 120000, imagen: "img/card/MGMG3240C-01.png"},
  { id: 8, nombre: "Mouse Gamer", precio: 8000, imagen: "img/card/mouse-gamer-led-rgb.jpg"}
];

function renderizarProductos(productosAMostrar = catalogoProductos) {
  const contenedor = document.getElementById('contenedor-productos');
  if (!contenedor) return; 

  contenedor.innerHTML = ''; 

  productosAMostrar.forEach((producto) => {
    const columna = document.createElement('div');
    columna.className = 'col-md-3 mb-3';
    columna.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${producto.imagen}" class="card-img-top" style="height: 300px; object-fit: cover;" alt="${producto.nombre}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold">${producto.nombre}</h5>
          <p class="card-text text-success fs-5">${formatearCLP(producto.precio)}</p>
          <button class="btn btn-dark mt-auto" onclick="agregarAlCarrito(${producto.id})">
            <i class="bi bi-cart-plus"></i> Agregar
          </button>
        </div>
      </div>
    `;
    contenedor.appendChild(columna);
  });
}

window.filtrarProductos = function() {
  const textoBusqueda = document.getElementById('inputBuscador').value.toLowerCase();
  const productosFiltrados = catalogoProductos.filter(producto => 
    producto.nombre.toLowerCase().includes(textoBusqueda)
  );
  renderizarProductos(productosFiltrados);
}

function mostrar(id) {
  const secciones = document.querySelectorAll("#contenido-perfil > *");
  secciones.forEach(sec => sec.classList.add("oculto"));
  const seccionMostrar = document.getElementById(id);
  if(seccionMostrar) seccionMostrar.classList.remove("oculto");
}

function obtenerCarrito() {
  const carrito = localStorage.getItem('carrito');
  return carrito ? JSON.parse(carrito) : [];
}

// CRUD del carrito
window.agregarAlCarrito = function(idProducto) {
  const carrito = obtenerCarrito();
  const producto = catalogoProductos.find(p => p.id === idProducto);
  const existe = carrito.find(p => p.id === idProducto);
  
  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert(`Se agregó ${producto.nombre} al carrito.`);
};

window.cargarTablaCarrito = function() {
  const tabla = document.getElementById('tablaCarrito');
  if (!tabla) return; 

  const tbody = tabla.querySelector('tbody');
  tbody.innerHTML = ''; 

  const carrito = obtenerCarrito();
  let subtotalCompra = 0; 

  carrito.forEach((item, index) => {
    const subtotalItem = item.precio * item.cantidad;
    subtotalCompra += subtotalItem;

    const fila = document.createElement('tr');
    
    fila.innerHTML = `
      <td class="align-middle">${index + 1}</td>
      <td class="align-middle fw-bold">${item.nombre}</td>
      <td class="align-middle">${formatearCLP(item.precio)}</td>
      <td class="align-middle">
        <button class="btn btn-sm btn-outline-dark" onclick="modificarCantidad(${index}, -1)">-</button>
        <span class="mx-2 fw-bold">${item.cantidad}</span>
        <button class="btn btn-sm btn-outline-dark" onclick="modificarCantidad(${index}, 1)">+</button>
      </td>
      <td class="align-middle text-success fw-bold">${formatearCLP(subtotalItem)}</td>
      <td class="align-middle">
        <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  const totalFinal = subtotalCompra - (subtotalCompra * descuentoActivo);
  const celdaTotal = document.getElementById('totalCompra');
  if(celdaTotal) celdaTotal.textContent = formatearCLP(totalFinal);
};

window.modificarCantidad = function(index, cambio) {
  const carrito = obtenerCarrito();
  carrito[index].cantidad += cambio;

  if (carrito[index].cantidad < 1) {
    carrito[index].cantidad = 1;
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  cargarTablaCarrito();
};

window.eliminarDelCarrito = function(index) {
  const carrito = obtenerCarrito();
  carrito.splice(index, 1); 
  localStorage.setItem('carrito', JSON.stringify(carrito));
  cargarTablaCarrito(); 
};

window.aplicarDescuento = function() {
  const inputCodigo = document.getElementById('codigoDescuento').value.trim().toUpperCase();
  const mensaje = document.getElementById('mensajeDescuento');

  if (inputCodigo === "INACAP10") {
    descuentoActivo = 0.10; 
    mensaje.textContent = "¡Código aceptado! 10% de descuento aplicado.";
    mensaje.className = "text-success fw-bold mt-1";
  } else {
    descuentoActivo = 0; 
    mensaje.textContent = "Código inválido.";
    mensaje.className = "text-danger fw-bold mt-1";
  }
  
  cargarTablaCarrito();
};

let descuentoActivo = 0;

// Lógica Visual de Sesión en el Menú
window.actualizarNavSesion = function() {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
  const navUsuario = document.getElementById('nav-usuario'); // <- IMPORTANTE: Agrega un div con id="nav-usuario" en tu nav.html

  if (usuarioActivo && navUsuario) {
    navUsuario.innerHTML = `
      <span class="navbar-text me-3 fw-bold text-primary">Hola, ${usuarioActivo.nombre}</span>
      <button class="btn btn-outline-danger btn-sm" onclick="cerrarSesion()">Cerrar Sesión</button>
    `;
  }
}

window.cerrarSesion = function() {
  localStorage.removeItem('usuarioActivo');
  window.location.reload(); 
}

function obtenerUsuarios(){
  const usuarios = localStorage.getItem('usuarios');
  return usuarios ? JSON.parse(usuarios) : [];    
}

document.addEventListener('DOMContentLoaded', () => {
  cargarComponentes("nav-container", "nav.html");
  cargarComponentes("footer-container", "footer.html");
  
  renderizarProductos();
  cargarTablaCarrito();

  // === LÓGICA DE REGISTRO ===
  const formRegistro = document.getElementById('formRegistro');
  const mensajeRegistro = document.getElementById('msgRegistro');

  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault(); 
      
      const nombre = document.getElementById('regNombre').value;
      const correo = document.getElementById('regCorreo').value;
      const password = document.getElementById('regPassword').value;

      if (nombre === "" || correo === "" || password === "") {
        mensajeRegistro.textContent = "Error: Faltan datos por llenar.";
        mensajeRegistro.className = "mt-2 text-danger text-center fw-bold";
        return; 
      }

      const usuarios = obtenerUsuarios();
      
      usuarios.push({nombre, correo, password});
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      mensajeRegistro.textContent = "¡Usuario guardado exitosamente!";
      mensajeRegistro.className = "mt-2 text-success text-center fw-bold";

      formRegistro.reset(); 
    });
  }

  // === LÓGICA DE LOGIN ===
  const formLogin = document.getElementById('formLogin');
  const msgLogin = document.getElementById('msgLogin');

  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const correo = document.getElementById('loginCorreo').value;
      const password = document.getElementById('loginPassword').value;

      if (correo === "" || password === "") {
        msgLogin.textContent = "Error: Faltan datos por llenar.";
        msgLogin.className = "mt-2 text-danger text-center fw-bold";
        return;
      }

      const usuarios = obtenerUsuarios(); 
      const usuarioValido = usuarios.find(user => user.correo === correo && user.password === password);

      if (usuarioValido) {
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));
        
        msgLogin.textContent = `¡Bienvenido, ${usuarioValido.nombre}! Redirigiendo...`;
        msgLogin.className = "mt-2 text-success text-center fw-bold";
        
        actualizarNavSesion();

        setTimeout(() => {
          // Redirige al index dependiendo de dónde esté el usuario
          window.location.href = window.location.pathname.includes("/pages/") ? '../index.html' : 'index.html';
        }, 1500);

      } else {
        msgLogin.textContent = "Correo o contraseña incorrectos.";
        msgLogin.className = "mt-2 text-danger text-center fw-bold";
      }
    });
  }
});