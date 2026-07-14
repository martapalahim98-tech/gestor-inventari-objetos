/**/
const inventari = [
    { nom: 'Portàtil', stock: 5, preu: 800 },
    { nom: 'Ratolí', stock: 20, preu: 25 },
    { nom: 'Monitor', stock: 3, preu: 180 },
    { nom: 'Teclat', stock: 12, preu: 45 }
];

// Referencias al DOM
const inputNom = document.querySelector('#inputNom');
const inputStock = document.querySelector('#inputStock');
const inputPreu = document.querySelector('#inputPreu');
const inputBuscar = document.querySelector('#inputBuscar');
const btnAfegir = document.querySelector('#btnAfegir');
const btnBuscar = document.querySelector('#btnBuscar');
const btnStockBaix = document.querySelector('#btnStockBaix');

const llistaInventari = document.querySelector('#llistaInventari');
const estadistiques = document.querySelector('#estadistiques');
const formulari = document.querySelector('#formulari');

let mostrarNomesStockBaix = false;

function renderitzarInventari() {

    let productesMostrar = inventari;

    if (mostrarNomesStockBaix) {
        productesMostrar = inventari.filter(producte => producte.stock < 5);
    }

    if (productesMostrar.length === 0) {

        const missatge = mostrarNomesStockBaix
            ? 'No hi ha productes amb stock baix'
            : "L'inventari està buit";

        llistaInventari.innerHTML = `<li class="buit">${missatge}</li>`;
        return;
    }

    const html = productesMostrar
        .map((producte) => {

            const index = inventari.indexOf(producte);

            return `
            <li class="producte">

                <div class="info">
                    <span class="nom">${producte.nom}</span>
                    <span class="stock">Stock: ${producte.stock}</span>
                    <span class="preu">${producte.preu.toFixed(2)} €</span>
                </div>

                <div class="accions">
                    <button class="btn-descompte" data-index="${index}">
                        💲 Descompte
                    </button>

                    <button class="btn-eliminar" data-index="${index}">
                        🗑 Eliminar
                    </button>
                </div>

            </li>
        `;
        })
        .join('');

    llistaInventari.innerHTML = html;
}

// Renderitzar estadistiques
function renderitzarEstadistiques() {

    const totalProductes = inventari.length;

    const stockBaix = inventari.filter(producte => producte.stock < 5).length;

    const valorInventari = inventari.reduce((total, producte) => {
        return total + (producte.stock * producte.preu);
    }, 0);

    estadistiques.innerHTML = `
        <p>Productes <br><strong>${totalProductes}</strong></p>
        <p>Stock baix <br><strong>${stockBaix}</strong></p>
        <p>Valor inventari <br><strong>${valorInventari.toFixed(2)} €</strong></p>
    `;
}

// Afegir producte
function afegirProducte() {

    const nom = inputNom.value.trim();

    const stock = Number(inputStock.value);

    const preu = Number(inputPreu.value);

    if (nom === '' || isNaN(stock) || isNaN(preu) || stock <= 0 || preu <= 0) {
        alert('Introduiu dades vàlides');
        return;
    }

    const duplicat = inventari.find(
        producte => producte.nom.toLowerCase() === nom.toLowerCase()
    );

    if (duplicat) {
        alert('Aquest producte ja existeix');
        return;
    }

    inventari.push({ nom, stock, preu });

    formulari.reset();
    inputNom.focus();

    mostrarNomesStockBaix = false;
    btnStockBaix.textContent = '📉 Stock baix';

    renderitzarInventari();
    renderitzarEstadistiques();
}

// Buscar producte
function buscarProducte() {

    const nomBuscat = inputBuscar.value.trim().toLowerCase();

    if (nomBuscat === '') {
        alert('Introduïu un nom de producte');
        inputBuscar.focus();
        return;
    }

    const producteTrobat = inventari.find(
        producte => producte.nom.toLowerCase() === nomBuscat
    );

    if (!producteTrobat) {
        alert('Producte no trobat');
        return;
    }

    alert(`Producte trobat

Nom: ${producteTrobat.nom}
Stock: ${producteTrobat.stock}
Preu: ${producteTrobat.preu.toFixed(2)} €
`);
}

// Mostrar només stock baix
function mostrarStockBaix() {

    mostrarNomesStockBaix = !mostrarNomesStockBaix;

    inputBuscar.value = '';

    btnStockBaix.textContent = mostrarNomesStockBaix
        ? 'Mostrar tots'
        : '📉 Stock baix';

    renderitzarInventari();
    renderitzarEstadistiques();
}

// Eliminar producte
function eliminarProducte(index) {

    if (index < 0 || index >= inventari.length) return;

    if (!confirm('Voleu eliminar aquest producte?')) return;

    inventari.splice(index, 1);

    renderitzarInventari();
    renderitzarEstadistiques();
}

// Aplicar descompte
function aplicarDescompte(index) {

    if (index < 0 || index >= inventari.length) return;

    const percentatge = Number(
        prompt('Percentatge de descompte:')?.trim() ?? '0'
    );

    if (
        isNaN(percentatge) ||
        percentatge <= 0 ||
        percentatge >= 100
    ) return;

    inventari[index].preu -= inventari[index].preu * percentatge / 100;

    renderitzarInventari();
    renderitzarEstadistiques();
}

// Eventos

btnAfegir.addEventListener('click', afegirProducte);

btnBuscar.addEventListener('click', buscarProducte);

inputBuscar.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        buscarProducte();
    }
});

btnStockBaix.addEventListener('click', mostrarStockBaix);

// Delegación de eventos

llistaInventari.addEventListener('click', event => {

    const botoEliminar = event.target.closest('.btn-eliminar');
    const botoDescompte = event.target.closest('.btn-descompte');

    if (botoEliminar) {
        eliminarProducte(Number(botoEliminar.dataset.index));
        return;
    }

    if (botoDescompte) {
        aplicarDescompte(Number(botoDescompte.dataset.index));
    }

});

// Inicialització

document.addEventListener('DOMContentLoaded', () => {

    renderitzarInventari();
    renderitzarEstadistiques();

});