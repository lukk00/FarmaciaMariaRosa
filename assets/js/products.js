document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-container");
  const pagination = document.getElementById("pagination");

  let productos = [];
  let currentPage = 1;
  const itemsPerPage = 6; 
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  let productosFiltrados = [];

  // Renderizar productos según página
  function renderProducts() {
    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pagina = productosFiltrados.slice(start, end);

    pagina.forEach((producto) => {
      const col = document.createElement("div");
      col.classList.add("col-md-4");

      col.innerHTML = `
      <div class="card shadow-sm h-100 position-relative producto-card" style="cursor:pointer">
        <span class="badge-categoria">${producto.categoria}</span>
        <img src="${producto.imagen}" class="card-img-top p-3" alt="${
        producto.nombre
      }">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text text-muted">${producto.descripcion}</p>
          <p class="mb-1"><strong>Stock:</strong> ${producto.stock}</p>
          <div class="mt-auto">
            <p class="fw-bold text-success">S/ ${producto.precio.toFixed(2)}</p>
            <small class="text-warning">⭐ ${producto.rating}</small>
          </div>
        </div>
      </div>
    `;

      // Evento click -> abrir modal con detalles
  col.querySelector(".producto-card").addEventListener("click", () => {
        document.getElementById("modalImagen").src = producto.imagen;
        document.getElementById("modalImagen").alt = producto.nombre;
        document.getElementById("modalNombre").textContent = producto.nombre;
        document.getElementById("modalDescripcion").textContent = producto.descripcion;
        document.getElementById("modalCategoria").textContent = producto.categoria;
        document.getElementById("modalStock").textContent = producto.stock;
        document.getElementById("modalPrecio").textContent = `S/ ${producto.precio.toFixed(2)}`;
        document.getElementById("modalRating").textContent = `⭐ ${producto.rating}`;

        const modal = new bootstrap.Modal(document.getElementById("productModal"));
        modal.show();

        // === AGREGAR CONTENEDOR DE CANTIDAD Y BOTÓN ===
        const modalBody = document.querySelector("#productModal .modal-body");

        let cantidadContainer = document.getElementById("cantidadContainer");
        if (!cantidadContainer) {
          cantidadContainer = document.createElement("div");
          cantidadContainer.id = "cantidadContainer";
          cantidadContainer.className =
            "d-flex align-items-center justify-content-center mt-3";
          cantidadContainer.innerHTML = `
            <button id="btnRestar" class="btn btn-outline-secondary btn-sm me-2">−</button>
            <input type="number" id="inputCantidad" value="1" min="1" class="form-control text-center" style="width: 70px;">
            <button id="btnSumar" class="btn btn-outline-secondary btn-sm ms-2">+</button>
          `;
          modalBody.appendChild(cantidadContainer);

          const btnAgregar = document.createElement("button");
          btnAgregar.id = "btnAgregarCarrito";
          btnAgregar.className = "btn btn-danger w-100 mt-3 bi bi-cart-plus";
          btnAgregar.textContent = "Agregar al carrito";
          modalBody.appendChild(btnAgregar);
        }

        // Reiniciar cantidad cada vez
        const inputCantidad = document.getElementById("inputCantidad");
        const btnSumar = document.getElementById("btnSumar");
        const btnRestar = document.getElementById("btnRestar");
        const btnAgregar = document.getElementById("btnAgregarCarrito");

        inputCantidad.value = 1;

        btnSumar.onclick = () => {
          inputCantidad.value = parseInt(inputCantidad.value) + 1;
        };
        btnRestar.onclick = () => {
          if (parseInt(inputCantidad.value) > 1)
            inputCantidad.value = parseInt(inputCantidad.value) - 1;
        };

        // === AGREGAR AL CARRITO Y REDIRIGIR ===
        btnAgregar.onclick = () => {
          const cantidad = parseInt(inputCantidad.value);
          if (isNaN(cantidad) || cantidad < 1) {
            alert("Ingrese una cantidad válida");
            return;
          }

          const productoCarrito = {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: cantidad,
          };

          let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
          const existente = carrito.find((p) => p.id === producto.id);

          if (existente) {
            existente.cantidad += cantidad;
          } else {
            carrito.push(productoCarrito);
          }

          localStorage.setItem("carrito", JSON.stringify(carrito));
          modal.hide();

          window.location.href = "../pages/carrito.html";
        };
      });

      container.appendChild(col);
    });

    renderPagination();
  }

  // función de filtros
  function aplicarFiltros() {
    const search = searchInput.value.toLowerCase();
    const categoria = categoryFilter.value;

    productosFiltrados = productos.filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search);
      const matchCategoria = categoria === "all" || p.categoria === categoria;
      return matchSearch && matchCategoria;
    });

    currentPage = 1;
    renderProducts();
    document.getElementById(
      "resultCount"
    ).textContent = `${productosFiltrados.length} resultados`;
  }

  searchInput.addEventListener("input", aplicarFiltros);
  categoryFilter.addEventListener("change", aplicarFiltros);

  // Crear botones de paginación
  function renderPagination() {
    pagination.innerHTML = "";
    // usar productosFiltrados para paginación, no productos
    const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

    // Botón "Anterior"
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "« Anterior";
    prevBtn.classList.add("btn", "btn-outline-danger", "me-2");
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
      }
    });
    pagination.appendChild(prevBtn);

    // Botones de páginas
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      pageBtn.classList.add(
        "btn",
        "btn-sm",
        i === currentPage ? "btn-danger" : "btn-outline-secondary",
        "mx-1"
      );

      pageBtn.addEventListener("click", () => {
        currentPage = i;
        renderProducts();
      });

      pagination.appendChild(pageBtn);
    }

    // Botón "Siguiente"
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente »";
    nextBtn.classList.add("btn", "btn-outline-danger", "ms-2");
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
      }
    });
    pagination.appendChild(nextBtn);
  }

  // Cargar productos desde JSON
  fetch("../data/products.json")
    .then((res) => res.json())
    .then((data) => {
      productos = data;
      productosFiltrados = productos; // iniciar con todos
      renderProducts();

      const categorias = [...new Set(productos.map((p) => p.categoria))];
      categoryFilter.innerHTML =
        '<option value="all" selected>Todos</option>' +
        categorias.map((c) => `<option value="${c}">${c}</option>`).join("");
    })
    .catch((error) => console.error("Error cargando JSON:", error));
});
