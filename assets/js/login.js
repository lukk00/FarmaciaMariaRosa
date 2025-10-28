document.addEventListener("DOMContentLoaded", function () {
  // ======= Crear e insertar modal dinámicamente =======
  const modalHTML = `
  <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">Iniciar Sesión / Registrarse</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <!-- Nav tabs -->
          <ul class="nav nav-tabs mb-3" id="authTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="login-tab" data-bs-toggle="tab"
                data-bs-target="#loginTabPane" type="button" role="tab">Login</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="register-tab" data-bs-toggle="tab"
                data-bs-target="#registerTabPane" type="button" role="tab">Registro</button>
            </li>
          </ul>
          <div class="tab-content">
            <!-- Login Form -->
            <div class="tab-pane fade show active" id="loginTabPane" role="tabpanel">
              <form id="loginForm" class="form-auth">
                <div class="mb-3">
                  <label for="loginEmail" class="label-auth">Correo electrónico</label>
                  <input type="email" class="form-control" id="loginEmail" required>
                </div>
                <div class="mb-3">
                  <label for="loginPassword" class="label-auth">Contraseña</label>
                  <input type="password" class="form-control" id="loginPassword" required>
                </div>
                <div id="loginError" class="text-danger" style="display:none;">Usuario o contraseña incorrectos.</div>
                <button type="submit" class="btn-auth w-100 mt-2">Ingresar</button>
              </form>
            </div>
            <!-- Register Form -->
            <div class="tab-pane fade" id="registerTabPane" role="tabpanel">
              <form id="registerForm" class="form-auth">
                <div class="mb-3">
                  <label for="registerEmail" class="label-auth">Correo electrónico</label>
                  <input type="email" class="form-control" id="registerEmail" required>
                </div>
                <div class="mb-3">
                  <label for="registerPassword" class="label-auth">Contraseña</label>
                  <input type="password" class="form-control" id="registerPassword" required>
                </div>
                <div class="mb-3">
                  <label for="registerPassword2" class="label-auth">Confirmar contraseña</label>
                  <input type="password" class="form-control" id="registerPassword2" required>
                </div>
                <div id="registerError" class="text-danger" style="display:none;"></div>
                <div id="registerSuccess" class="text-success" style="display:none;">¡Registro exitoso! Ahora puedes iniciar sesión.</div>
                <button type="submit" class="btn-auth w-100 mt-2">Registrarse</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  
  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // =====================================================
  // Funciones de usuarios y sesión
  function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
  }
  function saveUser(email, password) {
    const users = getUsers();
    users.push({ email, password, role: "user" });
    localStorage.setItem("users", JSON.stringify(users));
  }
  function findUser(email, password) {
    if (email === "admin@farmacia.com" && password === "123456") {
      return { email, role: "admin" };
    }
    return getUsers().find(u => u.email === email && u.password === password);
  }
  function userExists(email) {
    return (
      email === "admin@farmacia.com" ||
      getUsers().some(u => u.email === email)
    );
  }
  function setLoggedInUser(user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  }
  function getLoggedInUser() {
    return JSON.parse(localStorage.getItem("loggedInUser") || "null");
  }

  // =====================================================
  // Login y registro
  document.addEventListener("submit", function (e) {
    if (e.target.id === "loginForm") {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      const loginError = document.getElementById("loginError");

      const user = findUser(email, password);
      if (user) {
        loginError.style.display = "none";
        setLoggedInUser(user);
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        if (user.role === "admin") {
          const isInPages = window.location.pathname.includes("/pages/");
          const isInAdmin = window.location.pathname.includes("/admin/");
          if (isInPages || isInAdmin) {
            window.location.href = "../admin/admin-productos.html";
          } else {
            window.location.href = "./admin/admin-productos.html";
          }
        } else {
          alert("¡Bienvenido, " + email + "!");
        }
      } else {
        loginError.style.display = "block";
      }
    }

    if (e.target.id === "registerForm") {
      e.preventDefault();
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const password2 = document.getElementById("registerPassword2").value;
      const registerError = document.getElementById("registerError");
      const registerSuccess = document.getElementById("registerSuccess");

      registerError.style.display = "none";
      registerSuccess.style.display = "none";

      if (password !== password2) {
        registerError.textContent = "Las contraseñas no coinciden.";
        registerError.style.display = "block";
        return;
      }
      if (userExists(email)) {
        registerError.textContent = "El correo ya está registrado.";
        registerError.style.display = "block";
        return;
      }
      saveUser(email, password);
      registerSuccess.style.display = "block";
      e.target.reset();
    }
  });

  // =====================================================
  // Botón login (abre la modal o redirige)
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", function (e) {
      const user = getLoggedInUser();
      if (user) {
        e.preventDefault();
        const isInPages = window.location.pathname.includes("/pages/");
        const isInAdmin = window.location.pathname.includes("/admin/");
        if (user.role === "admin") {
          if (isInPages || isInAdmin) {
            window.location.href = "../admin/admin-productos.html";
          } else {
            window.location.href = "./admin/admin-productos.html";
          }
        } else {
          if (isInPages || isInAdmin) {
            window.location.href = "../pages/perfil.html";
          } else {
            window.location.href = "./pages/perfil.html";
          }
        }
      } else {
        // Mostrar modal si no hay usuario logueado
        e.preventDefault();
        const modal = new bootstrap.Modal(document.getElementById("loginModal"));
        modal.show();
      }
    });
  }
});
