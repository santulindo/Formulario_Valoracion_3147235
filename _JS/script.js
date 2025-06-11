const formulario = document.getElementById('formularioAvanzado');
const campos = formulario.querySelectorAll('input, textarea, select');
const btnEnviar = document.getElementById('btnEnviar');

let estadoValidacion = {};

campos.forEach((campo) => {
  estadoValidacion[campo.name] = false;
});

// 🎯 VALIDACIONES

// Nombre
document.getElementById('Nombre').addEventListener('input', function () {
  const valor = this.value.trim();
  const nombres = valor.split(' ').filter((nombre) => nombre.length > 0);

  if (valor.length < 3) {
    mostrarError('errorNombre', 'El nombre debe tener al menos 3 caracteres');
    marcarCampo(this, false);
  } else if (nombres.length < 1) {
    mostrarError('errorNombre', 'Ingresa al menos 2 nombres');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoNombre', '✓ Nombre válido');
    marcarCampo(this, true);
  }
});

// Apellido
const inputApellido = document.getElementById('apellido');
const errorApellido = document.getElementById('error-apellido');

inputApellido.addEventListener('input', function () {
  const valor = inputApellido.value.trim();
  const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s'-]{2,}$/;

  if (regex.test(valor)) {
    inputApellido.classList.add('valido');
    inputApellido.classList.remove('invalido');
    errorApellido.style.display = 'none';
    marcarCampo(this, true);
  } else {
    inputApellido.classList.add('invalido');
    inputApellido.classList.remove('valido');
    errorApellido.style.display = 'block';
    marcarCampo(this, false);
  }
});

// Correo y Confirmar Correo
const inputCorreo = document.getElementById('correo');
const errorCorreo = document.getElementById('error-correo');

const inputConfirmarCorreo = document.getElementById('confirmarCorreo');
const errorConfirmar = document.getElementById('error-confirmar');

inputCorreo.addEventListener('input', validarCorreo);
inputConfirmarCorreo.addEventListener('input', validarCorreo);

function validarCorreo() {
  const correo = inputCorreo.value.trim();
  const confirmar = inputConfirmarCorreo.value.trim();
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (regexCorreo.test(correo)) {
    inputCorreo.classList.add('valido');
    inputCorreo.classList.remove('invalido');
    errorCorreo.style.display = 'none';
    marcarCampo(inputCorreo, true);
  } else {
    inputCorreo.classList.add('invalido');
    inputCorreo.classList.remove('valido');
    errorCorreo.style.display = 'block';
    marcarCampo(inputCorreo, false);
  }

  if (correo && confirmar && correo === confirmar) {
    inputConfirmarCorreo.classList.add('valido');
    inputConfirmarCorreo.classList.remove('invalido');
    errorConfirmar.style.display = 'none';
    marcarCampo(inputConfirmarCorreo, true);
  } else if (confirmar) {
    inputConfirmarCorreo.classList.add('invalido');
    inputConfirmarCorreo.classList.remove('valido');
    errorConfirmar.style.display = 'block';
    marcarCampo(inputConfirmarCorreo, false);
  }
}

// Contraseña
document.getElementById('password').addEventListener('input', function () {
  const password = this.value;
  const fortaleza = calcularFortalezaPassword(password);
  actualizarBarraFortaleza(fortaleza);

  if (password.length < 8) {
    mostrarError('errorPassword', 'La contraseña debe tener al menos 8 caracteres');
    marcarCampo(this, false);
  } else if (fortaleza.nivel < 2) {
    mostrarError('errorPassword', 'Contraseña muy débil. Añade números y símbolos');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoPassword', `✓ Contraseña ${fortaleza.texto}`);
    marcarCampo(this, true);
  }

  const confirmar = document.getElementById('confirmarPassword');
  if (confirmar.value) {
    confirmar.dispatchEvent(new Event('input'));
  }
});

// Confirmar contraseña
document.getElementById('confirmarPassword').addEventListener('input', function () {
  const password = document.getElementById('password').value;
  if (this.value !== password) {
    mostrarError('errorConfirmar', 'Las contraseñas no coinciden');
    marcarCampo(this, false);
  } else if (this.value.length > 0) {
    mostrarExito('exitoConfirmar', '✓ Contraseñas coinciden');
    marcarCampo(this, true);
  }
});

// Teléfono
document.getElementById('telefono').addEventListener('input', function () {
  let valor = this.value.replace(/\D/g, '');
  if (valor.length >= 6) {
    valor = valor.substring(0, 3) + '-' + valor.substring(3, 6) + '-' + valor.substring(6, 10);
  } else if (valor.length >= 3) {
    valor = valor.substring(0, 3) + '-' + valor.substring(3);
  }
  this.value = valor;

  const telefonoRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  if (!telefonoRegex.test(valor)) {
    mostrarError('errorTelefono', 'Formato: 300-123-4567');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoTelefono', '✓ Teléfono válido');
    marcarCampo(this, true);
  }
});

// Fecha nacimiento
document.getElementById('fechaNacimiento').addEventListener('change', function () {
  const fechaNacimiento = new Date(this.value);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

  if (edad < 18) {
    mostrarError('errorFecha', 'Debes ser mayor de 18 años');
    marcarCampo(this, false);
  } else if (edad > 100) {
    mostrarError('errorFecha', 'Fecha no válida');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoFecha', `✓ Edad: ${edad} años`);
    marcarCampo(this, true);
  }
});

// Comentarios
document.getElementById('comentarios').addEventListener('input', function () {
  const contador = document.getElementById('contadorComentarios');
  contador.textContent = this.value.length;

  if (this.value.length > 450) {
    contador.style.color = '#dc3545';
  } else if (this.value.length > 400) {
    contador.style.color = '#ffc107';
  } else {
    contador.style.color = '#666';
  }

  marcarCampo(this, true);
});

// Términos
document.getElementById('terminos').addEventListener('change', function () {
  if (!this.checked) {
    mostrarError('errorTerminos', 'Debes aceptar los términos y condiciones');
    marcarCampo(this, false);
  } else {
    ocultarMensaje('errorTerminos');
    marcarCampo(this, true);
  }
});

// FUNCIONES AUXILIARES

function mostrarError(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  elemento.textContent = mensaje;
  elemento.style.display = 'block';
  ocultarMensaje(idElemento.replace('error', 'exito'));
}

function mostrarExito(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  elemento.textContent = mensaje;
  elemento.style.display = 'block';
  ocultarMensaje(idElemento.replace('exito', 'error'));
}

function ocultarMensaje(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) elemento.style.display = 'none';
}

function marcarCampo(campo, esValido) {
  estadoValidacion[campo.name] = esValido;
  if (esValido) {
    campo.classList.remove('invalido');
    campo.classList.add('valido');
  } else {
    campo.classList.remove('valido');
    campo.classList.add('invalido');
  }
  actualizarProgreso();
  actualizarBotonEnvio();
}

function calcularFortalezaPassword(password) {
  let puntos = 0;
  if (password.length >= 8) puntos++;
  if (password.length >= 12) puntos++;
  if (/[a-z]/.test(password)) puntos++;
  if (/[A-Z]/.test(password)) puntos++;
  if (/[0-9]/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++;

  const niveles = ['muy débil', 'débil', 'media', 'fuerte', 'muy fuerte'];
  const nivel = Math.min(Math.floor(puntos / 1.2), 4);

  return { nivel, texto: niveles[nivel], puntos };
}

function actualizarBarraFortaleza(fortaleza) {
  const barra = document.getElementById('strengthBar');
  const clases = ['strength-weak', 'strength-weak', 'strength-medium', 'strength-strong', 'strength-very-strong'];
  barra.className = 'password-strength ' + clases[fortaleza.nivel];
}

function actualizarProgreso() {
  const totalCampos = Object.keys(estadoValidacion).length;
  const camposValidos = Object.values(estadoValidacion).filter(valido => valido).length;
  const porcentaje = Math.round((camposValidos / totalCampos) * 100);

  document.getElementById('barraProgreso').style.width = porcentaje + '%';
  document.getElementById('porcentajeProgreso').textContent = porcentaje + '%';
}

function actualizarBotonEnvio() {
  const todosValidos = Object.values(estadoValidacion).every(valido => valido);
  btnEnviar.disabled = !todosValidos;
}

// Envío
formulario.addEventListener('submit', function (e) {
  e.preventDefault();

  const datosFormulario = new FormData(this);
  let resumenHTML = '';

  for (let [campo, valor] of datosFormulario.entries()) {
    if (valor && valor.trim() !== '') {
      const nombreCampo = obtenerNombreCampo(campo);
      resumenHTML += `
        <div class="dato-resumen">
          <span class="etiqueta-resumen">${nombreCampo}:</span> ${valor}
        </div>`;
    }
  }

  document.getElementById('contenidoResumen').innerHTML = resumenHTML;
  document.getElementById('resumenDatos').style.display = 'block';
  document.getElementById('resumenDatos').scrollIntoView({ behavior: 'smooth' });

  console.log('📊 Formulario enviado con validación completa:', Object.fromEntries(datosFormulario));
});

function obtenerNombreCampo(campo) {
  const nombres = {
    nombreCompleto: 'Nombre completo',
    apellido: 'Apellido',
    correo: 'Correo electrónico',
    confirmarCorreo: 'Confirmación de correo',
    password: 'Contraseña',
    confirmarPassword: 'Confirmación de contraseña',
    telefono: 'Teléfono',
    fechaNacimiento: 'Fecha de nacimiento',
    comentarios: 'Comentarios',
    terminos: 'Términos aceptados',
  };
  return nombres[campo] || campo;
}

function reiniciarFormulario() {
  formulario.reset();
  document.getElementById('resumenDatos').style.display = 'none';

  Object.keys(estadoValidacion).forEach((campo) => {
    estadoValidacion[campo] = false;
  });

  campos.forEach((campo) => {
    campo.classList.remove('valido', 'invalido');
  });

  document.querySelectorAll('.mensaje-error, .mensaje-exito').forEach((mensaje) => {
    mensaje.style.display = 'none';
  });

  actualizarProgreso();
  actualizarBotonEnvio();
  document.getElementById('strengthBar').className = 'password-strength';
}
