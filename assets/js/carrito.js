document.addEventListener("DOMContentLoaded", () => {
  const carritoContenedor = document.getElementById("carrito-contenedor");
  const totalElemento = document.getElementById("total-carrito");
  const btnVaciar = document.getElementById("btn-vaciar");
  const btnComprar = document.getElementById("btn-comprar");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Renderizar carrito
  function renderizarCarrito() {
    carritoContenedor.innerHTML = "";
    if (carrito.length === 0) {
      carritoContenedor.innerHTML = `<p class="text-center text-muted">Tu carrito está vacío </p>`;
      totalElemento.textContent = "S/ 0.00";
      return;
    }

    carrito.forEach((producto, index) => {
      const col = document.createElement("div");
      col.classList.add("col-md-4");

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body d-flex flex-column">
            <h5>${producto.nombre}</h5>
            <p class="text-success fw-bold mb-1">S/ ${producto.precio.toFixed(2)}</p>
            <p class="text-muted small">Cantidad: ${producto.cantidad}</p>
            <button class="btn btn-danger mt-auto btn-eliminar">Eliminar</button>
          </div>
        </div>
      `;

      col.querySelector(".btn-eliminar").addEventListener("click", () => {
        carrito.splice(index, 1);
        actualizarCarrito();
      });

      carritoContenedor.appendChild(col);
    });

    const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    totalElemento.textContent = `S/ ${total.toFixed(2)}`;
  }

  function actualizarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
  }

  btnVaciar.addEventListener("click", () => {
    carrito = [];
    actualizarCarrito();
  });

  btnComprar.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    alert("Compra realizada con éxito ");
    carrito = [];
    actualizarCarrito();
  });

  renderizarCarrito();
});
