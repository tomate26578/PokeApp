import { usuariosDefecto as usuarios } from "./db/usuarios.js";

const formularioLogin = document.querySelector("#form-login");

formularioLogin?.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  let encontrado = false;
  for (let usuario of usuarios) {
    if (usuario.username === username && usuario.password === password) {
      alert("Bienvenido " + usuario.nombre);
      encontrado = true;
      break;
    } else {
      encontrado = false;
    }
  }
  if (!encontrado) {
    alert("Usuario o contraseña incorrectos");
  }
});

//Ejemplo de cómo capturar el evento submit del formulario de login
// formularioLogin.addEventListener("submit", function (juanCarlos) {
//   jua|nCarlos.preventDefault();
//   //   console.log(juanCarlos);
//   //   console.log(juanCarlos.target);
//   //   console.log(juanCarlos.target.username.value);
//   //   console.log(juanCarlos.target.password.value);
//   const username = document.querySelector("#username");
//   const password = document.querySelector("#password");
//   console.log("Usuario: " + username.value);
//   console.log("Contraseña: " + password.value);
// });
