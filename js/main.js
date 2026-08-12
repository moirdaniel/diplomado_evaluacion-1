// Datos falsos del catálogo.
// La clave, por ejemplo "margarita", es la que viaja en la URL: detalle.html?pizza=margarita
// Cada pizza tiene nombre, descripción, ingredientes, precios por tamaño e imagen.
const pizzasDetalle = {
  margarita: {
    nombre: "Margarita buena",
    descripcion: "Mozzarella, tomate y albahaca fresca. Es una opción simple y liviana.",
    ingredientes: "Masa artesanal, salsa de tomate, mozzarella y albahaca fresca.",
    categoria: "clasica",
    busqueda: "margarita queso albahaca tomate",
    precios: {
      individual: 8900,
      mediana: 11900,
      familiar: 14900
    },
    imagen: "img/margarita_con_albahaca.jpg",
    alt: "Pizza Margarita con albahaca"
  },
  pepperoni: {
    nombre: "Pepperoni tranquila",
    descripcion: "Pepperoni, queso y salsa de la casa. Tiene sabor marcado, pero no es pesada.",
    ingredientes: "Masa artesanal, salsa de tomate, mozzarella y pepperoni.",
    categoria: "clasica",
    busqueda: "pepperoni queso tomate",
    precios: {
      individual: 9500,
      mediana: 12500,
      familiar: 15500
    },
    imagen: "img/pepperoni_tranquila.jpg",
    alt: "Pizza de pepperoni"
  },
  huerta: {
    nombre: "La Huerta",
    descripcion: "Champiñón, pimentón, cebolla morada y aceitunas. Buena opción vegetariana.",
    ingredientes: "Masa artesanal, salsa de tomate, mozzarella, champiñón, pimentón, cebolla y aceitunas.",
    categoria: "vegetariana",
    busqueda: "huerta champiñon pimenton cebolla",
    precios: {
      individual: 9200,
      mediana: 12200,
      familiar: 15200
    },
    imagen: "img/la_huerta.jpg",
    alt: "Pizza vegetariana con verduras"
  },
  bbq: {
    nombre: "Chanchita BBQ",
    descripcion: "Tocino, cebolla caramelizada y toque de barbecue. Es la más contundente.",
    ingredientes: "Masa artesanal, salsa de tomate, mozzarella, tocino, cebolla caramelizada y barbecue.",
    categoria: "especial",
    busqueda: "chanchita tocino cebolla bbq",
    precios: {
      individual: 10300,
      mediana: 13300,
      familiar: 16300
    },
    imagen: "img/chanchita_bbq.jpg",
    alt: "Pizza con carne y queso"
  },
  quesos: {
    nombre: "Tres quesos",
    descripcion: "Mozzarella, parmesano y un poco de queso azul. Cremosa y bien sabrosa.",
    ingredientes: "Masa artesanal, salsa de tomate, mozzarella, parmesano y queso azul.",
    categoria: "vegetariana",
    busqueda: "quesos mozzarella azul parmesano",
    precios: {
      individual: 9900,
      mediana: 12900,
      familiar: 15900
    },
    imagen: "img/tres_quesos.jpg",
    alt: "Pizza de quesos"
  },
  salame: {
    nombre: "Salame picantita",
    descripcion: "Salame, ají suave y extra salsa de tomate. Tiene un picor moderado.",
    ingredientes: "Masa artesanal, salsa de tomate, mozzarella, salame y ají suave.",
    categoria: "especial",
    busqueda: "picante salame aji tomate",
    precios: {
      individual: 10100,
      mediana: 13100,
      familiar: 16100
    },
    imagen: "img/salame_picantita.jpg",
    alt: "Pizza picante con salame"
  }
};

// Formato para mostrar los precios como pesos chilenos.
// Así evitamos escribir los puntos a mano en cada precio.
const formatoPesos = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0
});

// --------------------
// Modo claro / oscuro
// --------------------
const botonesTema = document.querySelectorAll("[data-theme-toggle]");
const temaGuardado = localStorage.getItem("temaDonTomate");

// Cambia el texto del botón según el modo actual.
function actualizarTextoTema() {
  const modoOscuro = document.body.classList.contains("dark-mode");

  botonesTema.forEach((boton) => {
    boton.textContent = modoOscuro ? "Modo día" : "Modo noche";
  });
}

if (temaGuardado === "oscuro") {
  document.body.classList.add("dark-mode");
  actualizarTextoTema();
}

botonesTema.forEach((boton) => {
  boton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    // Guardamos la preferencia para que se mantenga al cambiar de página.
    const modoOscuro = document.body.classList.contains("dark-mode");
    localStorage.setItem("temaDonTomate", modoOscuro ? "oscuro" : "claro");
    actualizarTextoTema();
  });
});

// --------------------
// Buscador del listado
// --------------------
const catalogoPizzas = document.querySelector("#catalogoPizzas");
const inputBusqueda = document.querySelector("#busquedaPizza");
const botonesFiltro = document.querySelectorAll("[data-filter]");
let itemsPizza = document.querySelectorAll(".pizza-item");
const resultadoFiltro = document.querySelector("#resultadoFiltro");
let categoriaActual = "todas";

// Arma las cards del listado desde los datos dummy.
function cargarListadoPizzas() {
  if (!catalogoPizzas) {
    return;
  }

  catalogoPizzas.innerHTML = "";

  Object.entries(pizzasDetalle).forEach(([clave, pizza]) => {
    const articulo = document.createElement("article");
    articulo.className = "col-md-6 col-lg-4 pizza-item";
    articulo.dataset.category = pizza.categoria;
    articulo.dataset.name = pizza.busqueda;

    articulo.innerHTML = `
      <div class="card pizza-card h-100">
        <img src="${pizza.imagen}" class="card-img-top" alt="${pizza.alt}">
        <div class="card-body">
          <h2 class="h5 card-title">${pizza.nombre}</h2>
          <p class="card-text">${pizza.descripcion}</p>
          <p class="price">Desde ${formatoPesos.format(pizza.precios.individual)}</p>
          <a class="btn btn-outline-brand w-100" href="detalle.html?pizza=${clave}">Ver detalle</a>
        </div>
      </div>
    `;

    catalogoPizzas.appendChild(articulo);
  });

  itemsPizza = document.querySelectorAll(".pizza-item");
  aplicarFiltros();
}

// Marca visualmente qué botón de filtro está seleccionado.
function actualizarBotonFiltro(botonActivo) {
  botonesFiltro.forEach((boton) => {
    boton.classList.remove("btn-brand");
    boton.classList.add("btn-outline-brand");
  });

  botonActivo.classList.remove("btn-outline-brand");
  botonActivo.classList.add("btn-brand");
}

// Recorre las cards y oculta las que no coinciden con búsqueda o categoría.
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

if (inputBusqueda) {
  inputBusqueda.addEventListener("input", aplicarFiltros);
}

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    categoriaActual = boton.dataset.filter;
    actualizarBotonFiltro(boton);
    aplicarFiltros();
  });
});

cargarListadoPizzas();

// --------------------
// Detalle de la pizza
// --------------------
const botonesTamano = document.querySelectorAll("[data-size-price]");
const precioPizza = document.querySelector("#precioPizza");
const tamanoElegido = document.querySelector("#tamanoElegido");

const pizzaElegida = new URLSearchParams(window.location.search).get("pizza");
const detalle = pizzasDetalle[pizzaElegida];

// Carga en la página detalle los textos, imagen y precios de la pizza seleccionada.
function cargarDetallePizza(pizza) {
  document.querySelector("#detalleTitulo").textContent = pizza.nombre;
  document.querySelector("#detalleDescripcion").textContent = pizza.descripcion;
  document.querySelector("#detalleIngredientes").textContent = pizza.ingredientes;
  document.querySelector("#detalleModal").textContent = `Agregamos ${pizza.nombre} a tu pedido.`;

  const imagenDetalle = document.querySelector("#detalleImagen");
  imagenDetalle.src = pizza.imagen;
  imagenDetalle.alt = pizza.alt;

  botonesTamano.forEach((boton) => {
    const tamano = boton.dataset.sizeKey;
    boton.dataset.sizePrice = pizza.precios[tamano];
  });

  precioPizza.textContent = formatoPesos.format(pizza.precios.individual);
}

// Actualiza el precio cuando el usuario cambia el tamaño.
function actualizarPrecioTamano(boton) {
  botonesTamano.forEach((otroBoton) => otroBoton.classList.remove("active"));
  boton.classList.add("active");

  if (precioPizza) {
    precioPizza.textContent = formatoPesos.format(Number(boton.dataset.sizePrice));
  }

  if (tamanoElegido) {
    tamanoElegido.textContent = boton.dataset.sizeName;
  }
}

// Si viene una pizza en la URL, se cambia el contenido del detalle.
if (detalle && precioPizza) {
  cargarDetallePizza(detalle);
}

botonesTamano.forEach((boton) => {
  boton.addEventListener("click", () => {
    actualizarPrecioTamano(boton);
  });
});

const botonFavorito = document.querySelector("#botonFavorito");
const mensajeFavorito = document.querySelector("#mensajeFavorito");

if (botonFavorito && mensajeFavorito) {
  botonFavorito.addEventListener("click", () => {
    botonFavorito.classList.toggle("active");

    // Según si quedó activo o no, mostramos un mensaje distinto.
    const guardada = botonFavorito.classList.contains("active");
    mensajeFavorito.textContent = guardada
      ? "Guardada como favorita para pedirla después."
      : "Quitamos esta pizza de tus favoritas.";
  });
}

// --------------------
// Formulario contacto
// --------------------
const mensaje = document.querySelector("#mensaje");
const contadorMensaje = document.querySelector("#contadorMensaje");

if (mensaje && contadorMensaje) {
  mensaje.addEventListener("input", () => {
    // Muestra cuántos caracteres lleva escrito el usuario.
    contadorMensaje.textContent = `${mensaje.value.length} / 160 caracteres`;
  });
}

const formContacto = document.querySelector("#formContacto");
const respuestaFormulario = document.querySelector("#respuestaFormulario");

if (formContacto && respuestaFormulario) {
  formContacto.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = document.querySelector("#nombre").value.trim();
    const correo = document.querySelector("#correo").value.trim();

    // Validación simple para que no se envíe vacío ni sin correo válido.
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
