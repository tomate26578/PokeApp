import {
  leerPokemones,
  guardarPokemones,
  leerUsuarios,
  guardarUsuarios,
} from "./persistencia.js";
import { situacionesBatalla } from "./db/game.js";

// ==========================================
// ELEMENTO PRINCIPAL DE LA APLICACIÓN
// ==========================================

const app = document.querySelector("#app");
let usuarioActivo = null;

// ==========================================
// 1. LANDING
// ==========================================

// Estructura básica de la pantalla
const landing = `
  <section class="landing">
    <p class="landing-sello">CUADERNO DE ENTRENADOR</p>
    <h1>Bienvenido a PokeApp</h1>
    <p>Explorá el mundo Pokémon.</p>
    <p>Elegí una opción del menú para comenzar.</p>
  </section>
`;

// Función para cargar los elementos dinámicos
function cargarLanding() {
  app.innerHTML = landing;
}

// Evento del logo
function volverAlInicio(event) {
  event.preventDefault();
  cargarLanding();
}

document.querySelector("#link-logo").addEventListener("click", volverAlInicio);
document.querySelector("#link-inicio").addEventListener("click", volverAlInicio);

// ==========================================
// 2. POKÉDEX
// ==========================================

// Estructura básica de la pantalla
const pokedex = `
  <section class="pokedex-section">
    <h1>Pokédex</h1>

    <div id="pokedex-gallery" class="pokedex-gallery"></div>
  </section>
`;

// Los textos del formulario también pueden terminar en una tarjeta.
function escaparHTML(texto) {
  return texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cargarPokedex(busqueda = "") {
  const pokedexGallery = document.querySelector("#pokedex-gallery");
  const termino = busqueda.trim().toLowerCase();

  for (const pokemon of leerPokemones()) {
    if (!pokemon.nombre.toLowerCase().includes(termino)) continue;

    let tipos = "";
    for (const tipo of pokemon.tipo) {
      // El texto conserva la tilde; la clase CSS usa, por ejemplo, type-electrico.
      const clase = tipo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      tipos += `<span class="type type-${escaparHTML(clase)}">${escaparHTML(tipo)}</span>`;
    }

    pokedexGallery.innerHTML += `
      <article class="pokemon-card">
        <div class="pokemon-image">
          <img src="${escaparHTML(pokemon.imagen)}" alt="${escaparHTML(pokemon.nombre)}" />
        </div>
        <div class="pokemon-info">
          <span class="pokemon-id">N.º ${pokemon.id}</span>
          <h2>${escaparHTML(pokemon.nombre)}</h2>
          <div class="pokemon-types">${tipos}</div>
          <p class="pokemon-rareza">${escaparHTML(pokemon.rareza)}</p>
          <button type="button" class="btn-detalle" data-id="${pokemon.id}">
            Ver detalles
          </button>
        </div>
      </article>
    `;
  }

  if (pokedexGallery.children.length === 0) {
    pokedexGallery.innerHTML = '<p class="empty-state">No encontramos Pokémon con ese nombre.</p>';
  }
}

// Evento del botón Pokédex
const botonPokedex = document.querySelector("#link-pokedex");

botonPokedex.addEventListener("click", function (event) {
  event.preventDefault();

  app.innerHTML = pokedex;
  cargarPokedex();
});

const formularioBusqueda = document.querySelector("#form-busqueda");
formularioBusqueda.addEventListener("submit", function (event) {
  event.preventDefault();
  app.innerHTML = pokedex;
  cargarPokedex(document.querySelector("#busqueda").value);
});

// Las tarjetas se crean después de cargar la página. Escuchamos el clic en #app.
app.addEventListener("click", function (event) {
  const boton = event.target.closest(".btn-detalle[data-id]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const pokemon = leerPokemones().find((pokemon) => pokemon.id === id);
  if (!pokemon) return;

  const evolucion = pokemon.tieneEvolucion
    ? escaparHTML(pokemon.evolucion || "Sin registrar")
    : "No tiene";
  const nivel = pokemon.nivelEvolucion ?? "No indicado";
  const imagenShiny = pokemon.shiny && pokemon.imagenShiny
    ? `<img src="${escaparHTML(pokemon.imagenShiny)}" alt="${escaparHTML(pokemon.nombre)} shiny" />`
    : "";

  app.innerHTML = `
    <section class="pokemon-detail">
      <button type="button" id="volver-pokedex" class="btn-detalle">Volver a la Pokédex</button>
      <h1>${escaparHTML(pokemon.nombre)}</h1>
      <img src="${escaparHTML(pokemon.imagen)}" alt="${escaparHTML(pokemon.nombre)}" />
      <p>N.º ${pokemon.id} · Tipo: ${escaparHTML(pokemon.tipo.join(" / "))}</p>
      <p class="pokemon-descripcion">${escaparHTML(pokemon.descripcion)}</p>

      <h2>Características</h2>
      <p>Generación: ${pokemon.generacion} · Rareza: ${escaparHTML(pokemon.rareza)}</p>
      <p>Altura: ${pokemon.altura} m · Peso: ${pokemon.peso} kg</p>
      <p>Habilidad: ${escaparHTML(pokemon.habilidad)}</p>

      <h2>Estadísticas</h2>
      <p>HP: ${pokemon.hp} · Ataque: ${pokemon.ataque}</p>
      <p>Defensa: ${pokemon.defensa} · Velocidad: ${pokemon.velocidad}</p>

      <h2>Evolución</h2>
      <p>Evoluciona: ${pokemon.tieneEvolucion ? "Sí" : "No"} · Evolución: ${evolucion}</p>
      <p>Nivel: ${nivel}</p>

      <h2>Sonido</h2>
      <audio controls preload="none" src="${escaparHTML(pokemon.sonido)}">Tu navegador no reproduce audio.</audio>

      <h2>Variante shiny</h2>
      <p>${pokemon.shiny ? "Tiene variante shiny" : "Sin variante shiny registrada"}</p>
      ${imagenShiny}
    </section>
  `;

  document.querySelector("#volver-pokedex").addEventListener("click", function () {
    app.innerHTML = pokedex;
    cargarPokedex();
  });
});

// ==========================================
// 3. INICIAR SESIÓN
// ==========================================

// Estructura básica de la pantalla
const login = `
  <section class="login-section">
          <h1>Iniciar sesión</h1>

          <form id="form-login">
            <label for="username"> Usuario </label>

            <input type="text" id="username" required />

            <label for="password"> Contraseña </label>

            <input type="password" id="password" required />
            <button type="submit">Ingresar</button>
            <p id="mensaje-login" class="form-message" role="status"></p>
          </form>
        </section>
`;

// Función para cargar los elementos dinámicos
function cargarLogin() {
  const formularioLogin = document.querySelector("#form-login");

  formularioLogin.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value;
    let encontrado = false;
    const usuarios = leerUsuarios();
    for (let usuario of usuarios) {
      if (usuario.username === username && usuario.password === password) {
        encontrado = true;
        usuarioActivo = usuario;
        botonLogin.textContent = "Mi perfil";
        botonRegistro.hidden = true;
        mostrarPerfil();
        break;
      }
    }
    if (!encontrado) {
      document.querySelector("#mensaje-login").textContent =
        "Usuario o contraseña incorrectos";
    }
  });
}

// Evento del botón Iniciar sesión
const botonLogin = document.querySelector("#link-login");

botonLogin.addEventListener("click", function (event) {
  event.preventDefault();
  if (usuarioActivo) {
    mostrarPerfil();
    return;
  }
  app.innerHTML = login;
  cargarLogin();
});

// ==========================================
// 4. REGISTRO
// ==========================================

// Estructura básica de la pantalla
const registro = `
  <section class="registro-section">

    <h1>Registrarse</h1>

    <form id="form-registro">

      <label for="nombre">
        Nombre
      </label>

      <input 
        type="text" 
        id="nombre" required
      />

      <label for="email">
        Email
      </label>

      <input 
        type="email" 
        id="email" required
      />

      <label for="nuevo-username">
        Usuario
      </label>

      <input 
        type="text" 
        id="nuevo-username" required
      />

      <label for="nueva-password">
        Contraseña
      </label>

      <input 
        type="password" 
        id="nueva-password" required minlength="4"
      />

      <button type="submit">
        Registrarse
      </button>
      <p id="mensaje-registro" class="error-message" role="status"></p>

    </form>

  </section>
`;

// Función para cargar los elementos dinámicos
function cargarRegistro() {
  const formularioRegistro = document.querySelector("#form-registro");
  const mensaje = document.querySelector("#mensaje-registro");

  formularioRegistro.addEventListener("submit", function (event) {
    event.preventDefault();
    const nombre = document.querySelector("#nombre").value.trim();
    const email = document.querySelector("#email").value.trim();
    const username = document.querySelector("#nuevo-username").value.trim();
    const password = document.querySelector("#nueva-password").value;
    const usuarios = leerUsuarios();
    if (nombre === "" || username === "") {
      mensaje.textContent = "Completá tu nombre y tu usuario.";
      return;
    }

    for (const usuario of usuarios) {
      if (usuario.username === username || usuario.email === email) {
        mensaje.textContent = "Ese usuario o email ya está registrado.";
        return;
      }
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      email,
      username,
      password,
      avatar: "./assets/avatar/default.png",
      admin: false,
    };
    guardarUsuarios(nuevoUsuario);
    app.innerHTML = login;
    cargarLogin();
    document.querySelector("#mensaje-login").textContent =
      "Cuenta creada. Ya podés iniciar sesión.";
  });
}

// Evento del botón Registrarse
const botonRegistro = document.querySelector("#link-registro");

botonRegistro.addEventListener("click", function (event) {
  event.preventDefault();
  app.innerHTML = registro;
  cargarRegistro();
});

// ==========================================
// 5. BATALLA
// ==========================================

// Estructura básica de la pantalla
const batalla = `
  <section class="batalla-section">

    <h1>Batalla Pokémon</h1>

    <form id="form-batalla">
      <label for="pokemon-batalla">Elegí tu Pokémon para comenzar.</label>
      <select id="pokemon-batalla" required>
        <option value="" disabled selected>Seleccioná un Pokémon</option>
      </select>
      <button id="btn-comenzar-batalla" type="submit">Comenzar batalla</button>
    </form>
    <p id="resultado-batalla" class="battle-result" role="status"></p>

  </section>
`;

// Función para cargar los elementos dinámicos
function cargarBatalla() {
  const pokemones = leerPokemones();
  const selector = document.querySelector("#pokemon-batalla");
  const resultado = document.querySelector("#resultado-batalla");

  for (const pokemon of pokemones) {
    selector.add(new Option(pokemon.nombre, pokemon.id));
  }

  document.querySelector("#form-batalla").addEventListener("submit", function (event) {
    event.preventDefault();
    const id = Number(selector.value);
    const elegido = pokemones.find((pokemon) => pokemon.id === id);
    const rivales = pokemones.filter((pokemon) => pokemon.id !== id);
    if (!elegido || rivales.length === 0) {
      resultado.textContent = "Necesitás dos Pokémon distintos para combatir.";
      return;
    }

    const rival = rivales[Math.floor(Math.random() * rivales.length)];
    mostrarTurno("inicio", elegido, rival);
  });
}

function mostrarTurno(clave, elegido, rival) {
  const situacion = situacionesBatalla[clave];

  app.innerHTML = `
    <section class="batalla-section">
      <h1>Batalla Pokémon</h1>
      <div class="batalla-equipo">
        <figure>
          <img src="${escaparHTML(elegido.imagen)}" alt="" />
          <figcaption>Tu Pokémon: ${escaparHTML(elegido.nombre)}</figcaption>
        </figure>
        <figure>
          <img src="${escaparHTML(rival.imagen)}" alt="" />
          <figcaption>Rival: ${escaparHTML(rival.nombre)}</figcaption>
        </figure>
      </div>
      <div class="battle-result">
        <h2>${situacion.titulo}</h2>
        <p>${situacion.texto}</p>
      </div>
      <div id="acciones-batalla" class="batalla-acciones"></div>
    </section>
  `;

  const acciones = document.querySelector("#acciones-batalla");
  for (const opcion of situacion.opciones) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = opcion.texto;
    boton.addEventListener("click", function () {
      mostrarTurno(opcion.siguiente, elegido, rival);
    });
    acciones.append(boton);
  }

  if (situacion.opciones.length === 0) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Volver a elegir Pokémon";
    boton.addEventListener("click", abrirBatalla);
    acciones.append(boton);
  }
}

function abrirBatalla() {
  app.innerHTML = batalla;
  cargarBatalla();
}

// Evento del botón Batalla
const botonBatalla = document.querySelector("#link-juego");

botonBatalla.addEventListener("click", function (event) {
  event.preventDefault();

  abrirBatalla();
});
// ==========================================
// 6. PERFIL USUARIO ESTANDAR
// ==========================================
function mostrarPerfil() {
  app.innerHTML = usuarioActivo.admin ? perfilAdmin : perfilEstandar;

  document.querySelector(".user-profile-nombre").textContent = usuarioActivo.nombre;
  document.querySelector(".user-profile-username").textContent = usuarioActivo.username;
  document.querySelector(".user-profile-email").textContent = usuarioActivo.email;
  document.querySelector(".user-profile-rol").textContent =
    usuarioActivo.admin ? "Administrador" : "Entrenador";
  const avatar = document.querySelector(".user-profile-avatar");
  avatar.src = usuarioActivo.avatar;
  avatar.alt = `Avatar de ${usuarioActivo.username}`;

  document.querySelector("#cerrar-sesion").addEventListener("click", function () {
    usuarioActivo = null;
    botonLogin.textContent = "Iniciar sesión";
    botonRegistro.hidden = false;
    cargarLanding();
  });

  if (usuarioActivo.admin) cargarPerfilAdmin();
}

const perfilEstandar = `
<section class="user-profile" id="user-profile">
          <h2>Perfil de usuario</h2>
          <div class="user-profile-info">
            <div>
              <img
                src="./assets/avatar/default.png"
                alt="Avatar de usuario"
                class="user-profile-avatar"
              />
            </div>
            <div>
              <p>Nombre: <span class="user-profile-nombre"></span></p>
              <p>
                Nombre de usuario:
                <span class="user-profile-username">Usuario</span>
              </p>
              <p>
                Email:
                <span class="user-profile-email">usuario@example.com</span>
              </p>
              <p>Rol: <span class="user-profile-rol"></span></p>
            </div>
          </div>
          <button type="button" id="cerrar-sesion" class="btn-detalle">Cerrar sesión</button>
        </section>`;

// ==========================================
// 7. PERFIL USUARIO ADMIN
// ==========================================
function cargarPerfilAdmin() {
  const formularioNuevoPokemon = document.querySelector("#form-nuevo-pokemon");

  formularioNuevoPokemon.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!usuarioActivo?.admin) return;

    const numero = document.querySelector("#pokemon-number");
    const nombre = document.querySelector("#pokemon-name");
    const tipo = document.querySelector("#pokemon-type");
    const descripcion = document.querySelector("#pokemon-description");
    const altura = document.querySelector("#pokemon-height");
    const peso = document.querySelector("#pokemon-weight");
    const generacion = document.querySelector("#pokemon-generation");
    const hp = document.querySelector("#pokemon-hp");
    const ataque = document.querySelector("#pokemon-attack");
    const velocidad = document.querySelector("#pokemon-speed");
    const defensa = document.querySelector("#pokemon-defense");
    const habilidad = document.querySelector("#pokemon-ability");
    const tieneEvolucion = document.querySelector(
      'input[name="pokemon-has-evolution"]:checked',
    );
    const evolucion = document.querySelector("#pokemon-evolution");
    const nivelEvolucion = document.querySelector("#pokemon-evolution-level");
    const rareza = document.querySelector("#pokemon-rarity");
    const imagen = document.querySelector("#pokemon-image");
    const sonido = document.querySelector("#pokemon-sound");
    const shiny = document.querySelector("#pokemon-shiny");
    const imagenShiny = document.querySelector("#pokemon-shiny-image");
    const mensaje = document.querySelector("#mensaje-pokemon");
    const tipos = tipo.value.split(",").map((texto) => texto.trim()).filter(Boolean);
    const evoluciona = tieneEvolucion.value === "true";

    if (!nombre.value.trim() || !tipos.length || !descripcion.value.trim() ||
        !imagen.value.trim() || !sonido.value.trim()) {
      mensaje.textContent = "Completá el nombre, los tipos, la descripción y las rutas de imagen y sonido.";
      return;
    }

    if (evoluciona && !evolucion.value.trim()) {
      mensaje.textContent = "Indicá en qué Pokémon evoluciona.";
      return;
    }

    if (shiny.checked && !imagenShiny.value.trim()) {
      mensaje.textContent = "Indicá la ruta de la imagen shiny.";
      return;
    }

    if (leerPokemones().some((pokemon) => pokemon.id === numero.valueAsNumber)) {
      mensaje.textContent = "Ya hay un Pokémon con ese número.";
      return;
    }

    const nuevoPokemon = {
      id: numero.valueAsNumber,
      nombre: nombre.value.trim(),
      tipo: tipos,
      descripcion: descripcion.value.trim(),
      altura: altura.valueAsNumber,
      peso: peso.valueAsNumber,
      generacion: generacion.valueAsNumber,
      hp: hp.valueAsNumber,
      ataque: ataque.valueAsNumber,
      velocidad: velocidad.valueAsNumber,
      defensa: defensa.valueAsNumber,
      habilidad: habilidad.value,
      tieneEvolucion: evoluciona,
      evolucion: evoluciona ? evolucion.value.trim() : null,
      nivelEvolucion: evoluciona && nivelEvolucion.value !== "" ? nivelEvolucion.valueAsNumber : null,
      rareza: rareza.value,
      imagen: imagen.value.trim(),
      sonido: sonido.value.trim(),
      shiny: shiny.checked,
      imagenShiny: shiny.checked ? imagenShiny.value.trim() : null,
    };

    console.log("Nuevo Pokémon agregado:", nuevoPokemon);
    guardarPokemones(nuevoPokemon);

    formularioNuevoPokemon.reset();
    mensaje.textContent = `${nuevoPokemon.nombre} se agregó a la Pokédex.`;
    numero.focus();
  });
}

const perfilAdmin = `${perfilEstandar}
        <section class="new-pokemon" id="new-pokemon">
          <h2>Nuevo Pokémon</h2>
          <form id="form-nuevo-pokemon">
            <label for="pokemon-number"> Numero en el Pokedex: </label>
            <input type="number" id="pokemon-number" min="1" required />

            <label for="pokemon-name">Nombre:</label>
            <input type="text" id="pokemon-name" required />

            <label for="pokemon-type">Tipos (separados por coma):</label>
            <input type="text" id="pokemon-type" placeholder="Planta, Veneno" required />

            <label for="pokemon-description">Descripción:</label>
            <textarea id="pokemon-description" rows="3" required></textarea>

            <label for="pokemon-height">Altura (m):</label>
            <input type="number" id="pokemon-height" min="0" step="any" required />

            <label for="pokemon-weight">Peso (kg):</label>
            <input type="number" id="pokemon-weight" min="0" step="any" required />

            <label for="pokemon-generation">Generación:</label>
            <input type="number" id="pokemon-generation" min="1" required />

            <label for="pokemon-hp">HP:</label>
            <input type="number" id="pokemon-hp" min="1" required />
            <label for="pokemon-attack">Ataque:</label>
            <input type="number" id="pokemon-attack" min="0" required />
            <label for="pokemon-speed">Velocidad:</label>
            <input type="number" id="pokemon-speed" min="0" required />
            <label for="pokemon-defense">Defensa:</label>
            <input type="number" id="pokemon-defense" min="0" required />

            <label for="pokemon-ability">Habilidad:</label>
            <select id="pokemon-ability" required>
              <option value="" disabled selected>Seleccioná una habilidad</option>
              <option value="Adaptability">Adaptable</option>
              <option value="Battle Armor">Armadura batalla</option>
              <option value="Blaze">Mar llamas</option>
              <option value="Chlorophyll">Clorofila</option>
              <option value="Clear Body">Cuerpo puro</option>
              <option value="Color Change">Cambio color</option>
              <option value="Compound Eyes">Ojo compuesto</option>
              <option value="Cute Charm">Gran encanto</option>
              <option value="Early Bird"> madrugar</option>
              <option value="Effect Spore">Efecto espora</option>
              <option value="Flame Body">Cuerpo llama</option>
              <option value="Flash Fire">Absorbe fuego</option>
              <option value="Guts">Agallas</option>
              <option value="Huge Power">Potencia</option>
              <option value="Hustle">Entusiasmo</option>
              <option value="Hyper Cutter"> Corte fuerte</option>
              <option value="Illuminate"> iluminacion</option>
              <option value="Immunity">Inmunidad</option>
              <option value="Inner Focus">Foco interno</option>
              <option value="Intimidate">Intimidación</option>
              <option value="Keen Eye">Vista lince</option>
              <option value="Levitate">Levitación</option>
              <option value="Lightning Rod">Pararrayos</option>
              <option value="Limber">Flexibilidad</option>
              <option value="Liquid Ooze">Lodo líquido</option>
              <option value="Magic Guard">Muro mágico</option>
              <option value="Natural Cure">Cura natural</option>
              <option value="Oblivious">Despiste</option>
              <option value="Overgrow">Espesura</option>
              <option value="Own Tempo">Ritmo propio</option>
              <option value="Pickup">Recogida</option>
              <option value="Poison Point">Punto tóxico</option>
              <option value="Pressure">Presión</option>
              <option value="Run Away">Fuga</option>
              <option value="Serene Grace"> dicha</option>
              <option value="Shed Skin">Mudar</option>
              <option value="Shield Dust">Polvo escudo</option>
              <option value="Soundproof">Insonorizar</option>
              <option value="Static">Electricidad estática</option>
              <option value="Stench">Hedor</option>
              <option value="Sturdy">Robustez</option>
              <option value="Swarm">Enjambre</option>
              <option value="Swift Swim">Nado veloz</option>
              <option value="Synchronize"> sincronía</option>
              <option value="Thick Fat">Sebo</option>
              <option value="Torrent">Torrente</option>
              <option value="Trace">Rastro</option>
              <option value="Volt Absorb">Absorbe electricidad</option>
              <option value="Water Absorb">Absorbe agua</option>
              <option value="Wonder Guard">Superguarda</option>
            </select>

            <fieldset>
              <legend>¿Tiene evolución?</legend>
              <label for="pokemon-has-evolution-yes">
                <input type="radio" id="pokemon-has-evolution-yes" name="pokemon-has-evolution" value="true" required />
                Sí
              </label>
              <label for="pokemon-has-evolution-no">
                <input type="radio" id="pokemon-has-evolution-no" name="pokemon-has-evolution" value="false" required />
                No
              </label>
            </fieldset>

            <label for="pokemon-evolution">Evolución:</label>
            <input type="text" id="pokemon-evolution" />

            <label for="pokemon-evolution-level">Nivel de evolución:</label>
            <input type="number" id="pokemon-evolution-level" min="1" />

            <label for="pokemon-rarity">Rareza:</label>
            <select id="pokemon-rarity" required>
              <option value="" disabled selected>Seleccioná una rareza</option>
              <option value="Común">Común</option>
              <option value="Raro">Raro</option>
              <option value="Legendario">Legendario</option>
              <option value="Mítico">Mítico</option>
              <option value="Singular">Singular</option>
            </select>

            <label for="pokemon-image">Imagen (URL):</label>
            <input type="text" id="pokemon-image" required />

            <label for="pokemon-sound">Sonido (URL):</label>
            <input type="text" id="pokemon-sound" required />

            <label for="pokemon-shiny">¿Es shiny?</label>
            <input type="checkbox" id="pokemon-shiny" />

            <label for="pokemon-shiny-image">Imagen shiny (URL):</label>
            <input type="text" id="pokemon-shiny-image" />

            <button type="submit">Agregar Pokémon</button>
            <p id="mensaje-pokemon" class="form-message" role="status"></p>
          </form>
        </section>`;

// ==========================================
// 8. LANDING INICIAL
// ==========================================
cargarLanding();
