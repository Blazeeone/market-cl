function cargarComponentes(id, archivo){
  const subcarpetas = window.location.pathname.includes("/pages/");
  const ruta = subcarpetas ? `../components/${archivo}` : `components/${archivo}`;
  
  fetch(ruta)
  .then((res => res.text()))
  .then((html) => {
      document.getElementById(id).innerHTML = html;
  })
  .catch(() => console.warn(`No se cargo el ${archivo}`));
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

function renderizarProductos() {
  const contenedor = document.getElementById('contenedor-productos');
  if (!contenedor) return; 

  contenedor.innerHTML = ''; 

  catalogoProductos.forEach((producto) => {
    const columna = document.createElement('div');
    columna.className = 'col-md-3 mb-3';
    columna.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${producto.imagen}" class="card-img-top" style="height: 300px; object-fit: cover;" alt="${producto.nombre}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold">${producto.nombre}</h5>
          <p class="card-text text-success fs-5">$${producto.precio}</p>
          <button class="btn btn-dark mt-auto" onclick="agregarAlCarrito(${producto.id})">
            <i class="bi bi-cart-plus"></i> Agregar
          </button>
        </div>
      </div>
    `;
    contenedor.appendChild(columna);
  });
}

function mostrar(id) {
  const secciones = document.querySelectorAll("#contenido-perfil > *");
  secciones.forEach(sec => sec.classList.add("oculto"));
  document.getElementById(id).classList.remove("oculto");
}

let descuentoActivo = 0;

function obtenerCarrito() {
  const carrito = localStorage.getItem('carrito');
  return carrito ? JSON.parse(carrito) : [];
}

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
      <td class="align-middle">$${item.precio}</td>
      <td class="align-middle">
        <button class="btn btn-sm btn-outline-dark" onclick="modificarCantidad(${index}, -1)">-</button>
        <span class="mx-2 fw-bold">${item.cantidad}</span>
        <button class="btn btn-sm btn-outline-dark" onclick="modificarCantidad(${index}, 1)">+</button>
      </td>
      <td class="align-middle text-success fw-bold">$${subtotalItem}</td>
      <td class="align-middle">
        <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  const totalFinal = subtotalCompra - (subtotalCompra * descuentoActivo);
  document.getElementById('totalCompra').textContent = totalFinal;
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

document.addEventListener('DOMContentLoaded', () => {
  cargarComponentes("nav-container", "nav.html");
  cargarComponentes("footer-container", "footer.html");
  
  renderizarProductos();
  cargarTablaCarrito();

  const formRegistro = document.getElementById('formRegistro');
  const mensaje = document.getElementById('msgRegistro');

  function obtenerUsuarios(){
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];    
  }

  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault(); 
      
      const nombre = document.getElementById('regNombre').value;
      const correo = document.getElementById('regCorreo').value;
      const password = document.getElementById('regPassword').value;

      if (nombre === "" || correo === "" || password === "") {
        mensaje.textContent = "Error: Faltan datos por llenar.";
        mensaje.className = "mt-2 text-danger text-center fw-bold";
        return; 
      }

      const usuarios = obtenerUsuarios();
      
      usuarios.push({nombre, correo, password});
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      mensaje.textContent = "¡Usuario guardado exitosamente!";
      mensaje.className = "mt-2 text-success text-center fw-bold";

      formRegistro.reset(); 
    });
  }
});