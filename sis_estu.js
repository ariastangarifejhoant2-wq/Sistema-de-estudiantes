
// Recuperar registros guardados en este navegador
let estudiantes = [];

try {
    const guardados = JSON.parse(
        localStorage.getItem("estudiantes")
    );

    if (Array.isArray(guardados)) {
        estudiantes = guardados;
    }
} catch (error) {
    estudiantes = [];
}

const formulario = document.getElementById("formulario");
const tabla = document.getElementById("tablaEstudiantes");
const mensajeVacio = document.getElementById("mensajeVacio");

const total = document.getElementById("total");
const totalAprobados = document.getElementById("totalAprobados");
const totalReprobados = document.getElementById("totalReprobados");

const botonLimpiar = document.getElementById("limpiar");

// Guardar en el navegador
function guardarEstudiantes() {
    localStorage.setItem(
        "estudiantes",
        JSON.stringify(estudiantes)
    );
}

// Crear una celda con texto seguro
function crearCelda(fila, contenido) {
    const celda = document.createElement("td");
    celda.textContent = contenido;
    fila.appendChild(celda);
    return celda;
}

// Mostrar todos los registros
function mostrarEstudiantes() {
    tabla.replaceChildren();

    let aprobados = 0;
    let reprobados = 0;

    estudiantes.forEach((estudiante, indice) => {
        const fila = document.createElement("tr");

        crearCelda(fila, indice + 1);
        crearCelda(fila, estudiante.nombre);
        crearCelda(fila, estudiante.grado);
        crearCelda(fila, Number(estudiante.nota).toFixed(1));

        const celdaEstado = document.createElement("td");
        const estado = document.createElement("span");

        estado.classList.add("estado");

        if (estudiante.nota >= 3.0) {
            estado.textContent = "Aprobado";
            estado.classList.add("aprobado");
            aprobados++;
        } else {
            estado.textContent = "Reprobado";
            estado.classList.add("reprobado");
            reprobados++;
        }

        celdaEstado.appendChild(estado);
        fila.appendChild(celdaEstado);

        const celdaAccion = document.createElement("td");
        const boton = document.createElement("button");

        boton.textContent = "Eliminar";
        boton.classList.add("eliminar");
        boton.type = "button";

        boton.addEventListener("click", () => {
            eliminarEstudiante(estudiante.id);
        });

        celdaAccion.appendChild(boton);
        fila.appendChild(celdaAccion);

        tabla.appendChild(fila);
    });

    total.textContent = estudiantes.length;
    totalAprobados.textContent = aprobados;
    totalReprobados.textContent = reprobados;

    mensajeVacio.style.display =
        estudiantes.length === 0 ? "block" : "none";
}

// Agregar estudiante
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const grado = document.getElementById("grado").value.trim();
    const notaTexto = document.getElementById("nota").value;
    const nota = Number(notaTexto);

    if (
        nombre === "" ||
        grado === "" ||
        notaTexto === "" ||
        !Number.isFinite(nota) ||
        nota < 0 ||
        nota > 5
    ) {
        alert("Completa los datos correctamente. La nota debe estar entre 0 y 5.");
        return;
    }

    const estudiante = {
        id: crypto.randomUUID(),
        nombre: nombre,
        grado: grado,
        nota: nota
    };

    estudiantes.push(estudiante);

    guardarEstudiantes();
    mostrarEstudiantes();
    formulario.reset();
    document.getElementById("nombre").focus();
});

// Eliminar estudiante
function eliminarEstudiante(id) {
    estudiantes = estudiantes.filter(
        estudiante => estudiante.id !== id
    );

    guardarEstudiantes();
    mostrarEstudiantes();
}

// Eliminar todos los registros
botonLimpiar.addEventListener("click", function () {
    if (estudiantes.length === 0) {
        return;
    }

    const confirmar = confirm(
        "¿Seguro que deseas eliminar todos los estudiantes?"
    );

    if (confirmar) {
        estudiantes = [];
        guardarEstudiantes();
        mostrarEstudiantes();
    }
});

// Mostrar registros al cargar la página
mostrarEstudiantes();
