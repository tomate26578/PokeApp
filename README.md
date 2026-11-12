# PokeApp - TP 9

PokeApp es una Pokédex hecha con HTML, CSS y JavaScript. Se pueden buscar Pokémon, ver sus fichas, crear una cuenta y jugar una batalla. El administrador también puede agregar Pokémon.

## Cómo funciona el código

`index.html` tiene el menú y el espacio `#app`. Al hacer clic en una opción del menú, `js/app.js` cambia lo que aparece en ese espacio. Ahí se muestran la Pokédex, las fichas, los formularios y la batalla.

La Pokédex lee la lista de Pokémon y arma una tarjeta por cada uno. El buscador muestra los nombres que contienen el texto ingresado. Cada botón de detalles tiene el número del Pokémon. Con ese número, el código busca sus datos y muestra la ficha con la imagen, los tipos, las estadísticas y el sonido.

`js/persistencia.js` guarda los Pokémon y las cuentas en `localStorage` como texto en formato JSON. La primera vez usa los datos de `js/db`. El registro crea una cuenta común y el inicio de sesión compara el usuario y la contraseña con los guardados. Si la cuenta tiene `admin: true`, aparece el formulario de alta. Al enviarlo se revisa que el número esté libre y se guarda el Pokémon para que aparezca en la Pokédex.

Al elegir un Pokémon para la batalla, la app sortea un rival. Las situaciones y sus opciones están en `js/db/game.js`. Cada botón indica qué situación mostrar después. Cuando se llega a una situación sin opciones, aparece el resultado y se puede volver a elegir.

## Cómo se hizo el trabajo

El punto de partida fue la versión base de PokeApp. Primero se revisó cómo se abrían las pantallas y se completaron la navegación, el buscador y las fichas. Después se ampliaron los datos de los Pokémon y se agregaron las imágenes shiny. Los datos iniciales quedaron en los módulos de `js/db` y los cambios hechos desde la app se guardan en `localStorage`.

Luego se completaron el registro, el inicio de sesión y el formulario de administrador. La batalla quedó armada con dos turnos en los que las decisiones llevan a finales distintos. A la pantalla de inicio se le agregó el sello «Cuaderno de entrenador».

Para comprobar que funcionara, se probaron en Chrome la búsqueda con y sin resultados, la ficha con una imagen demorada y el audio cuando carga y cuando falla. Se verificó que no se pueda registrar dos veces el mismo usuario, entrar con una contraseña incorrecta ni agregar un Pokémon con un número repetido. Se agregó un Magikarp de prueba, se cerró la pestaña y se volvió a abrir en la misma dirección para ver si el Pokémon y la cuenta seguían guardados. En la batalla se probaron los cuatro recorridos posibles.

## Cómo abrirlo

Para abrir la app, se puede ejecutar `index.html` con Live Server desde VS Code. La cuenta de administrador usa `1234` como usuario y contraseña. Las cuentas comunes se crean desde **Registrarse**.
