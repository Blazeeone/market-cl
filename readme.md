# 🛒 MARKET.CL - Front-End E-Commerce Project

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

Un proyecto de comercio electrónico interactivo desarrollado completamente del lado del cliente (Front-End) para consolidar conocimientos en desarrollo web, manipulación del DOM y persistencia de datos en el navegador.

## 📌 Descripción del Proyecto

**MARKET.CL** es una simulación de tienda online que permite a los usuarios explorar un catálogo de productos, agregar artículos a un carrito de compras interactivo, aplicar códigos de descuento y gestionar una sesión de usuario básica. 

Este proyecto fue construido con el objetivo de aplicar buenas prácticas de diseño responsivo y lógica de programación en JavaScript sin depender de frameworks complejos ni bases de datos en el backend, simulando toda la experiencia a través de `LocalStorage`.

## ✨ Características Principales

* **Catálogo Dinámico:** Renderizado de productos mediante JavaScript a partir de un arreglo de objetos.
* **Buscador en Tiempo Real:** Filtro de productos integrado en la barra de navegación.
* **Carrito de Compras (CRUD):** * Agregar productos.
  * Modificar cantidades (+ / -).
  * Eliminar artículos.
  * Cálculo automático de subtotales y total final con formato de moneda local (CLP).
* **Sistema de Cupones:** Integración de códigos de descuento (ej. `INACAP10`) que recalculan el total dinámicamente.
* **Gestión de Usuarios:** Simulación de Registro y Login con validación de credenciales guardadas en el navegador.
* **Componentes Reutilizables:** Inyección asíncrona de la barra de navegación (`nav.html`) y el pie de página (`footer.html`) mediante la API `fetch`, manteniendo el código DRY (Don't Repeat Yourself).
* **Diseño Responsivo:** Interfaz adaptativa para dispositivos móviles y de escritorio utilizando Bootstrap 5.

## 🚀 Lo que aprendí en este proyecto

Durante el desarrollo de esta aplicación, logré profundizar y aplicar de manera práctica los siguientes conceptos de Front-End:

1. **Manipulación avanzada del DOM:** Creación de elementos HTML al vuelo (con `document.createElement` y `innerHTML`) para inyectar datos de forma dinámica.
2. **Web Storage API:** Uso intensivo de `LocalStorage` (con `JSON.stringify` y `JSON.parse`) para mantener la persistencia del carrito y la sesión de los usuarios, incluso si se recarga la página.
3. **Asincronismo:** Implementación de funciones `async/await` y promesas (`fetch`) para modularizar el proyecto separando el menú y el footer en archivos independientes.
4. **Formateo de Datos:** Uso de `Intl.NumberFormat` para presentar precios profesionales de forma nativa.
5. **Eventos y Funciones de Orden Superior:** Uso de `addEventListener`, `forEach`, `find` y `filter` para la interacción y búsqueda de productos.

## 🛠️ Instalación y Uso

Para probar este proyecto en tu entorno local:

1. Clona este repositorio:
   ```bash
   git clone [https://github.com/tu-usuario/nombre-del-repo.git](https://github.com/tu-usuario/nombre-del-repo.git)