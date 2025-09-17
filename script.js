let numeroRegistro = 1;
let pedidoActual = [];
let historialVentas = [];

const listaPedidoEl = document.getElementById('lista-pedido');
const totalPedidoEl = document.getElementById('total-pedido');
const numeroRegistroEl = document.getElementById('numero-registro');
const tablaVentasEl = document.querySelector('#tabla-ventas tbody');
const selectProductoEl = document.getElementById('select-producto');

function agregarProducto() {
    const valorSeleccionado = selectProductoEl.value;

    if (!valorSeleccionado) {
        alert("Por favor, selecciona un producto.");
        return;
    }

    const [nombre, precioStr] = valorSeleccionado.split('-');
    const precio = parseFloat(precioStr);

    pedidoActual.push({ nombre, precio });
    actualizarPedido();
}

function actualizarPedido() {
    listaPedidoEl.innerHTML = '';
    let total = 0;
    pedidoActual.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - $${item.precio.toFixed(2)}`;
        listaPedidoEl.appendChild(li);
        total += item.precio;
    });
    totalPedidoEl.textContent = total.toFixed(2);
}

function procesarPedido() {
    if (pedidoActual.length === 0) {
        alert("El pedido está vacío.");
        return;
    }

    const total = parseFloat(totalPedidoEl.textContent);
    const fecha = new Date().toLocaleDateString();
    const productos = pedidoActual.map(item => item.nombre).join(', ');

    const nuevoPedido = {
        registro: numeroRegistro,
        fecha: fecha,
        productos: productos,
        total: total
    };
    historialVentas.push(nuevoPedido);
    actualizarHistorial();

    imprimirTicket(nuevoPedido);

    pedidoActual = [];
    numeroRegistro++;
    numeroRegistroEl.textContent = numeroRegistro;
    actualizarPedido();
}

function limpiarPedido() {
    pedidoActual = [];
    actualizarPedido();
}

function actualizarHistorial() {
    tablaVentasEl.innerHTML = '';
    historialVentas.forEach(venta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${venta.registro}</td>
            <td>${venta.fecha}</td>
            <td>${venta.productos}</td>
            <td>$${venta.total.toFixed(2)}</td>
            <td><button onclick="imprimirTicket(${JSON.stringify(venta)})">Imprimir</button></td>
        `;
        tablaVentasEl.appendChild(tr);
    });
}

function imprimirTicket(pedido) {
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(`
        <html>
        <head>
            <title>Ticket de Venta</title>
            <style>
                body { font-family: sans-serif; text-align: center; }
                h1 { border-bottom: 1px solid #000; padding-bottom: 5px; }
                p { margin: 5px 0; }
                ul { list-style: none; padding: 0; }
                li { padding: 3px 0; }
            </style>
        </head>
        <body>
            <h1>Ticket de Venta</h1>
            <p><strong>Registro:</strong> ${pedido.registro}</p>
            <p><strong>Fecha:</strong> ${pedido.fecha}</p>
            <hr>
            <h2>Productos</h2>
            <ul>
                ${pedido.productos.split(', ').map(p => `<li>${p}</li>`).join('')}
            </ul>
            <hr>
            <h3>Total: $${pedido.total.toFixed(2)}</h3>
            <p>¡Gracias por su compra!</p>
        </body>
        </html>
    `);
    ventanaImpresion.document.close();
    ventanaImpresion.print();
}

function descargarExcel() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Registro,Fecha,Productos,Total\n";

    historialVentas.forEach(venta => {
        const fila = [
            venta.registro,
            venta.fecha,
            `"${venta.productos}"`,
            venta.total.toFixed(2)
        ].join(",");
        csvContent += fila + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ventas_dia_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}