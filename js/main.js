// Formato para mostrar los precios como pesos chilenos.
const formatoPesos = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0
});

// Botón de modo día/noche. Se guarda la preferencia en localStorage.
const botonesTema = document.querySelectorAll("[data-theme-toggle]");
const temaGuardado = localStorage.getItem("temaDonTomate");

// Si el usuario ya había elegido modo oscuro, se aplica al cargar la página.
if (temaGuardado === "oscuro") {
  document.body.classList.add("dark-mode");
  botonesTema.forEach((boton) => {
    boton.textContent = "Modo día";
  });
}

// Al hacer click se cambia la clase del body y el texto del botón.
botonesTema.forEach((boton) => {
  boton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const modoOscuro = document.body.classList.contains("dark-mode");
    localStorage.setItem("temaDonTomate", modoOscuro ? "oscuro" : "claro");
    boton.textContent = modoOscuro ? "Modo día" : "Modo noche";
  });
});

// Elementos usados para buscar y filtrar pizzas en la página listado.
const inputBusqueda = document.querySelector("#busquedaPizza");
const botonesFiltro = document.querySelectorAll("[data-filter]");
const itemsPizza = document.querySelectorAll(".pizza-item");
const resultadoFiltro = document.querySelector("#resultadoFiltro");
let categoriaActual = "todas";

// Revisa cada pizza y la muestra u oculta según búsqueda y categoría.
function aplicarFiltros() {
  const texto = inputBusqueda ? inputBusqueda.value.trim().toLowerCase() : "";
  let visibles = 0;

  itemsPizza.forEach((item) => {
    const coincideCategoria = categoriaActual === "todas" || item.dataset.category === categoriaActual;
    const coincideTexto = item.dataset.name.includes(texto);
    const debeVerse = coincideCategoria && coincideTexto;

    item.classList.toggle("is-hidden", !debeVerse);
    if (debeVerse) {
      visibles += 1;
    }
  });

  if (resultadoFiltro) {
    resultadoFiltro.textContent = `Mostrando ${visibles} pizza${visibles === 1 ? "" : "s"}.`;
  }
}

// Filtra mientras el usuario escribe en el buscador.
if (inputBusqueda) {
  inputBusqueda.addEventListener("input", aplicarFiltros);
}

// Cambia la categoría activa cuando se presiona un botón de filtro.
botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    categoriaActual = boton.dataset.filter;
    botonesFiltro.forEach((otroBoton) => {
      otroBoton.classList.remove("btn-brand");
      otroBoton.classList.add("btn-outline-brand");
    });
    boton.classList.remove("btn-outline-brand");
    boton.classList.add("btn-brand");
    aplicarFiltros();
  });
});

// Elementos de la página detalle para cambiar tamaño y precio.
const botonesTamano = document.querySelectorAll("[data-size-price]");
const precioPizza = document.querySelector("#precioPizza");
const tamanoElegido = document.querySelector("#tamanoElegido");

// Actualiza visualmente el tamaño seleccionado y el precio.
botonesTamano.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesTamano.forEach((otroBoton) => otroBoton.classList.remove("active"));
    boton.classList.add("active");

    if (precioPizza) {
      precioPizza.textContent = formatoPesos.format(Number(boton.dataset.sizePrice));
    }

    if (tamanoElegido) {
      tamanoElegido.textContent = boton.dataset.sizeName;
    }
  });
});

// Botón que marca o desmarca la pizza como favorita.
const botonFavorito = document.querySelector("#botonFavorito");
const mensajeFavorito = document.querySelector("#mensajeFavorito");

// Muestra un mensaje cuando se guarda o quita de favoritos.
if (botonFavorito && mensajeFavorito) {
  botonFavorito.addEventListener("click", () => {
    botonFavorito.classList.toggle("active");
    const guardada = botonFavorito.classList.contains("active");
    mensajeFavorito.textContent = guardada
      ? "Guardada como favorita para pedirla después."
      : "Quitamos esta pizza de tus favoritas.";
  });
}

// Contador de caracteres del mensaje en contacto.
const mensaje = document.querySelector("#mensaje");
const contadorMensaje = document.querySelector("#contadorMensaje");

// Actualiza el contador cada vez que se escribe.
if (mensaje && contadorMensaje) {
  mensaje.addEventListener("input", () => {
    contadorMensaje.textContent = `${mensaje.value.length} / 160 caracteres`;
  });
}

// Formulario de contacto y texto de respuesta.
const formContacto = document.querySelector("#formContacto");
const respuestaFormulario = document.querySelector("#respuestaFormulario");

// Valida datos simples y muestra un mensaje sin enviar el formulario.
if (formContacto && respuestaFormulario) {
  formContacto.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const nombre = document.querySelector("#nombre").value.trim();
    const correo = document.querySelector("#correo").value.trim();

    if (!nombre || !correo.includes("@")) {
      respuestaFormulario.textContent = "Revisa el nombre y el correo antes de enviar.";
      respuestaFormulario.classList.add("text-danger");
      return;
    }

    respuestaFormulario.classList.remove("text-danger");
    respuestaFormulario.textContent = `Gracias, ${nombre}. Recibimos tu mensaje de prueba.`;
    formContacto.reset();
    contadorMensaje.textContent = "0 / 160 caracteres";
  });
}
