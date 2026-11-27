/* =========================================================
   YOSHI TECH — Script compartido
   Cada bloque solo actúa si su elemento existe en la página,
   así el mismo archivo sirve para index y para las internas.

   El marco (index) y las páginas del iframe se hablan con
   postMessage. Así funciona igual con Live Server y abriendo
   el archivo con doble clic (file://).
   ========================================================= */

const raiz = document.documentElement;
const enIframe = window.parent !== window;
const visor = document.querySelector('.visor');


// --- 1. TEMA CLARO / OSCURO (Material Design 3) ---

function temaActual() {
    if (raiz.dataset.tema) return raiz.dataset.tema;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
}

function aplicarTema(tema) {
    raiz.dataset.tema = tema;
    const boton = document.getElementById('btn-tema');
    if (boton) boton.selected = tema === 'oscuro';
}

const botonTema = document.getElementById('btn-tema');
if (botonTema) {
    botonTema.selected = temaActual() === 'oscuro';

    // md-icon-button con "toggle" dispara "input" al cambiar
    botonTema.addEventListener('input', function () {
        const tema = botonTema.selected ? 'oscuro' : 'claro';
        aplicarTema(tema);
        try { localStorage.setItem('yoshiTema', tema); } catch (e) {}
        enviarTemaAlIframe();
    });
}

function enviarTemaAlIframe() {
    if (visor && visor.contentWindow) {
        visor.contentWindow.postMessage({ tipo: 'tema', tema: temaActual() }, '*');
    }
}


// --- 2. MARCO: resaltar la opción activa del menú ---

const enlacesMenu = document.querySelectorAll('.menu-link');

function marcarActivo(pagina) {
    enlacesMenu.forEach(function (enlace) {
        const esActivo = enlace.dataset.pagina === pagina;
        enlace.classList.toggle('activo', esActivo);
        if (esActivo) {
            enlace.setAttribute('aria-current', 'page');
        } else {
            enlace.removeAttribute('aria-current');
        }
    });
}

document.querySelectorAll('[target="contenido"]').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
        marcarActivo(enlace.dataset.pagina);
    });
});

if (visor) {
    // Cada vez que carga una página en el iframe, le pasamos el tema
    visor.addEventListener('load', enviarTemaAlIframe);

    // La página del iframe nos avisa cuál es (ej. si se usó "Ver servicios")
    window.addEventListener('message', function (evento) {
        if (evento.source !== visor.contentWindow) return;
        if (evento.data && evento.data.tipo === 'pagina') {
            marcarActivo(evento.data.pagina);
        }
    });
}

// Páginas internas: avisar al marco y escuchar el tema
if (enIframe) {
    window.parent.postMessage({ tipo: 'pagina', pagina: document.body.dataset.pagina }, '*');

    window.addEventListener('message', function (evento) {
        if (evento.source !== window.parent) return;
        if (evento.data && evento.data.tipo === 'tema') {
            aplicarTema(evento.data.tema);
        }
    });
}


// --- 3. INICIO: overclock con doble clic ---

function activarOverclock(elemento) {
    const caja = document.getElementById('rendimiento');
    elemento.textContent = '¡Overclock activado ⚡!';
    caja.classList.add('overclock');
    caja.querySelector('md-linear-progress').value = 1;
}


// --- 4. SERVICIOS: mostrar / ocultar el detalle ---

function toggleDetalle(boton) {
    const tarjeta = boton.closest('.service-card');
    const abierto = tarjeta.classList.toggle('abierto');
    boton.firstChild.textContent = abierto ? 'Ocultar detalle' : 'Ver detalle';
}

// Chips de filtro: se puede marcar más de uno; ninguno = todos
const filtros = document.getElementById('filtros');
if (filtros) {
    filtros.addEventListener('click', function () {
        const elegidos = Array.from(filtros.querySelectorAll('md-filter-chip'))
            .filter(function (chip) { return chip.selected; })
            .map(function (chip) { return chip.dataset.filtro; });

        let visibles = 0;
        document.querySelectorAll('.service-card').forEach(function (tarjeta) {
            const mostrar = elegidos.length === 0 || elegidos.includes(tarjeta.dataset.categoria);
            tarjeta.hidden = !mostrar;
            if (mostrar) visibles++;
        });
        document.getElementById('sin-resultados').hidden = visibles > 0;
    });
}


// --- 5. GALERÍA: ver foto en grande (md-dialog) ---

const dialogo = document.getElementById('visor-imagen');

function abrirImagen(boton) {
    const figura = boton.closest('figure');
    if (!dialogo || figura.classList.contains('sin-imagen')) return;

    const img = figura.querySelector('img');
    const imgGrande = dialogo.querySelector('img');
    imgGrande.src = img.src;
    imgGrande.alt = img.alt;
    // el último nodo del figcaption es el texto (el primero es el icono)
    dialogo.querySelector('.visor-titulo').textContent = figura.querySelector('figcaption').lastChild.textContent.trim();
    dialogo.show();
}

// Si una foto no carga, se muestra un aviso en vez de la imagen rota
document.querySelectorAll('.galeria img').forEach(function (img) {
    function marcarFaltante() {
        img.closest('figure').classList.add('sin-imagen');
    }
    if (img.complete && img.naturalWidth === 0) {
        marcarFaltante();
    } else {
        img.addEventListener('error', marcarFaltante);
    }
});


// --- 6. CONTACTO: formulario con componentes Material ---

const formulario = document.getElementById('form-contacto');

if (formulario) {
    // Si viene de "Cotizar" (contacto.html?servicio=laptop) se preselecciona
    const servicioUrl = new URLSearchParams(location.search).get('servicio');
    const campoServicio = document.getElementById('campo-servicio');
    if (servicioUrl && campoServicio) {
        customElements.whenDefined('md-outlined-select').then(function () {
            return campoServicio.updateComplete;
        }).then(function () {
            campoServicio.value = servicioUrl;
        });
    }

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        // Cada campo Material muestra su "error-text" cuando error = true
        const campos = formulario.querySelectorAll('[required]');
        let valido = true;
        campos.forEach(function (campo) {
            campo.error = !campo.checkValidity();
            if (campo.error) valido = false;
        });
        if (!valido) {
            mostrarSnackbar('Revisa los campos marcados en rojo.');
            return;
        }

        const datos = new FormData(formulario);
        const barra = document.getElementById('enviando');
        barra.hidden = false;

        // Simulación de envío (no hay servidor en este proyecto)
        setTimeout(function () {
            barra.hidden = true;
            formulario.reset();
            mostrarResumen(datos);
            mostrarSnackbar('¡Listo, ' + datos.get('nombre').split(' ')[0] + '! Te contactaremos pronto.');
        }, 1200);
    });

    // Al corregir un campo se quita su error
    formulario.addEventListener('input', function (evento) {
        if (evento.target.error && evento.target.checkValidity()) evento.target.error = false;
    });
    formulario.addEventListener('change', function (evento) {
        if (evento.target.error && evento.target.checkValidity()) evento.target.error = false;
    });

    formulario.addEventListener('reset', function () {
        document.getElementById('resumen').hidden = true;
        formulario.querySelectorAll('[required]').forEach(function (campo) { campo.error = false; });
    });
}

function mostrarResumen(datos) {
    const nombres = {
        laptop: 'Reparación de laptops', mantenimiento: 'Mantenimiento de PCs',
        ensamblaje: 'Ensamblaje de PC', software: 'Formateo y optimización', soporte: 'Soporte técnico',
    };
    document.getElementById('resumen-texto').textContent =
        datos.get('nombre') + ', registramos tu pedido de "' + nombres[datos.get('servicio')] +
        '". Te escribiremos al +51 ' + datos.get('celular') + '.';

    const chips = document.getElementById('resumen-chips');
    chips.innerHTML = '';
    const etiquetas = ['Contacto: ' + datos.get('medio'), 'Equipo de ' + datos.get('antiguedad') + ' años'];
    if (datos.get('recojo')) etiquetas.push('Recojo a domicilio');
    if (datos.get('urgente')) etiquetas.push('Urgente');
    etiquetas.forEach(function (texto) {
        const chip = document.createElement('md-assist-chip');
        chip.label = texto;
        chips.appendChild(chip);
    });
    document.getElementById('resumen').hidden = false;
}

let temporizadorSnackbar;

function mostrarSnackbar(texto) {
    const snackbar = document.getElementById('snackbar');
    document.getElementById('snackbar-texto').textContent = texto;
    snackbar.classList.add('visible');
    clearTimeout(temporizadorSnackbar);
    temporizadorSnackbar = setTimeout(ocultarSnackbar, 4000);
}

function ocultarSnackbar() {
    document.getElementById('snackbar').classList.remove('visible');
}
