# PokeApp - TP 9

PokeApp es una Pokédex hecha con HTML, CSS y JavaScript. Se pueden buscar Pokémon, ver sus fichas, crear una cuenta y jugar una batalla. El administrador también puede agregar Pokémon.

## Cómo funciona el código

`index.html` tiene el menú y el espacio `#app`. Cuando hacés clic en una opción del menú, `js/app.js` cambia lo que aparece en ese espacio. Ahí se muestran la Pokédex, las fichas, los formularios y la batalla.

La Pokédex lee la lista de Pokémon y arma una tarjeta por cada uno. Si escribís algo en el buscador, muestra los nombres que contienen ese texto. Cada botón de detalles tiene el número del Pokémon. Con ese número, el código busca sus datos y muestra la ficha con la imagen, los tipos, las estadísticas y el sonido.

`js/persistencia.js` guarda los Pokémon y las cuentas en `localStorage` como texto en formato JSON. La primera vez usa los datos de `js/db`. Al registrarte se agrega una cuenta común y, al iniciar sesión, se comparan el usuario y la contraseña con los guardados. Si la cuenta tiene `admin: true`, aparece el formulario de alta. Al enviarlo se revisa que el número esté libre y se guarda el Pokémon para que aparezca en la Pokédex.

En la batalla elegís un Pokémon y la app sortea un rival. Las situaciones y sus opciones están en `js/db/game.js`. Cada botón indica qué situación mostrar después. Cuando se llega a una situación sin opciones, aparece el resultado y se puede volver a elegir.

## Cómo hice el trabajo

Partí de la PokeApp que dio el profesor. Primero revisé cómo se abrían las pantallas y completé las partes que faltaban para navegar, buscar y abrir una ficha. Después completé los datos de los Pokémon y agregué las imágenes shiny. Dejé los datos iniciales en los módulos de `js/db` y usé `localStorage` para guardar lo que se agrega desde la app.

Luego completé el registro, el inicio de sesión y el formulario de administrador. Para la batalla armé dos turnos en los que las decisiones llevan a finales distintos. También le puse el sello «Cuaderno de entrenador» a la pantalla de inicio.

Para comprobar que funcionara, se probaron en Chrome la búsqueda con y sin resultados, la ficha con una imagen demorada y el audio cuando carga y cuando falla. Se verificó que no se pueda registrar dos veces el mismo usuario, entrar con una contraseña incorrecta ni agregar un Pokémon con un número repetido. Se agregó un Magikarp de prueba, se cerró la pestaña y se volvió a abrir en la misma dirección para ver si el Pokémon y la cuenta seguían guardados. En la batalla se probaron los cuatro recorridos posibles.

## Cómo abrirlo

Abrí la carpeta en VS Code y ejecutá `index.html` con Live Server. Para entrar como administrador usá `1234` como usuario y contraseña. Para probar una cuenta común, entrá en **Registrarse**.
