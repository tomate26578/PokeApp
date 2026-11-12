# PokeApp - TP 9

PokeApp es una Pokédex hecha con HTML, CSS y JavaScript. Se pueden buscar Pokémon, ver sus fichas, crear una cuenta y jugar una batalla. Con la cuenta de administrador también se pueden agregar Pokémon.

## Cómo abrir la app

Abrí la carpeta en VS Code y ejecutá `index.html` con Live Server. Para entrar como administrador, usá `1234` como usuario y contraseña. Para probar una cuenta común, entrá en Registrarse.

## Pruebas

Las siete pruebas se hicieron en Chrome con Playwright y pasaron.

1. **Búsqueda.** La Pokédex mostró 10 tarjetas al inicio. Al buscar `BULB` apareció solo Bulbasaur con sus dos tipos. También se buscó un nombre que no existía para comprobar que apareciera un aviso.
2. **Ficha.** Se retrasó la imagen shiny de Bulbasaur para ver qué pasaba si tardaba en cargar. El nombre y la evolución se podían leer, y el buscador seguía funcionando. Cuando llegó el archivo, apareció la imagen.
3. **Sonido.** Se reprodujo el audio de Bulbasaur y se comprobó que avanzara el reproductor. Después se bloqueó el archivo de Charmander para ver qué pasaba si fallaba el pedido. El sonido no arrancó, pero se pudo volver a la Pokédex.
4. **Usuarios.** Se creó una cuenta común y se probó registrar la misma cuenta otra vez e iniciar sesión con una contraseña incorrecta. La app rechazó ambos intentos. Con la contraseña correcta se pudo entrar y cerrar sesión. El formulario para agregar Pokémon solo apareció con la cuenta de administrador.
5. **Alta de Pokémon.** Se probó agregar un Pokémon con el número `1`, que ya estaba ocupado. Después se guardó un Magikarp de prueba con el número `129` y apareció su ficha en la Pokédex. Se revisó que el peso `10.01` se guardara como número y que los tipos quedaran en un arreglo.
6. **Datos guardados.** Se cerró la pestaña y se volvió a abrir la app en la misma dirección. Magikarp seguía en la Pokédex y la cuenta de prueba podía iniciar sesión. Así se comprobó que los datos quedaron en `localStorage`.
7. **Batalla.** Se probaron los cuatro caminos posibles de los dos turnos. Cada uno llegó al final esperado y, tanto al ganar como al perder, se pudo volver a elegir un Pokémon.

Para repetir el alta, usá el número `129` si está libre, el nombre `Magikarp`, el tipo `Agua` y una descripción de prueba. Podés usar `./assets/img/Magikarp.png` como imagen y `./assets/sound/magikarp.mp3` como sonido.

## Qué parte es asíncrona

Cuando hacés clic en un Pokémon, JavaScript busca sus datos y arma la ficha en ese momento. El navegador pide la imagen y el audio por separado. Por eso la ficha se puede usar mientras un archivo todavía está cargando. La opción `preload="none"` le pide al navegador que evite precargar el audio antes de reproducirlo.

`addEventListener()` deja preparada una función para cuando ocurra un clic o se envíe un formulario. Una vez que se ejecuta esa función, buscar en un arreglo, cambiar el contenido de la página y guardar en `localStorage` son operaciones síncronas. El código de PokeApp usa los controles del navegador para el audio y no usa `fetch`, promesas explícitas ni `async/await`. El `await` que se usó en Playwright sirve para que la prueba espere un resultado, como la aparición de una imagen.

Para mostrarlo en clase, abrí la pestaña **Red** de Chrome con `F12`, desactivá la caché y elegí una conexión lenta. Entrá a la ficha de Bulbasaur y buscá el pedido de `bulbasaur-shiny.png`. Después apretá reproducir y fijate cuándo aparece el pedido de `bulbasaur.mp3`.

Este ejemplo es para practicar en la consola con una ficha abierta. `play()` devuelve una promesa. `await` espera dentro de la función hasta que empieza el sonido o falla la reproducción.

```js
async function probarSonido() {
  const audio = document.querySelector(".pokemon-detail audio");

  try {
    await audio.play();
    console.log("El sonido empezó");
  } catch (error) {
    console.log("No se pudo reproducir el sonido", error.message);
  }
}

probarSonido();
```