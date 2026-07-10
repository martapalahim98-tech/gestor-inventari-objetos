// estructura de dades
const inventari = [];

// importar prompt sync
const prompt = require('prompt-sync')();

/**
 * Mostra el menú principal i demana a l'usuari que seleccioni una opció.
 * @returns {number} L'opció seleccionada per l'usuari.
 */
function mostrarMenu(){
    console.log('\n ==== Menu de opciones ====');
    console.log('1. Afegir producte');
    console.log('2. Mostrar inventari');
    console.log('3. Buscar producte');
    console.log('4. Mostrar stock baix');
    console.log('5. Aplicar descompte');
    console.log('6. Eliminar producte');
    console.log('7. Sortir');

    return Number(prompt('Elija una opción: '));
}

/**
 * Afegeix un nou producte a l'inventari.
 * Demana el nom, stock i preu al usuari.
 * @returns {string} Missatge de confirmació o error.
 */
function afegirProducte(){
    let nom = prompt('Nom del producte: ')?.trim() ?? '';
    let stock = Number(prompt('Stock del producte: ')?.trim() ?? '');
    let preu = Number(prompt('Preu del producte: ')?.trim() ?? '');

    if (nom === '') return 'El nom no pot estar buit';

    // Corregido el operador de bitwise '|' por el operador lógico '||'
    if (isNaN(stock) || isNaN(preu) || stock <= 0 || preu <= 0){
        return 'Stock o preu no vàlids';
    }

    const nouProducte = {nom, stock, preu};
    inventari.push(nouProducte); // Corregido: era inventari, no inventario

    return 'Producte afegit correctament!';
}

/**
 * Mostra el llistat complet de productes amb el seu stock i preu.
 * @returns {string} Llistat formatat de productes o missatge d'inventari buit.
 */
function mostrarInventari(){
    if (inventari.length === 0) return 'Inventari buit'; // Corregido: era inventari, no noms

    const llistatProductes = inventari
        // Corregido: stock y preu en singular
        .map((producte, i) => `${i + 1}. ${producte.nom} - Stock: ${producte.stock} - Preu: ${producte.preu}€`)
        .join('\n');

    return `==== LListat de productes ===\n${llistatProductes}`;
}

/**
 * Busca un producte per nom (case-insensitive).
 * @returns {string} Missatge indicant si el producte s'ha trobat o no.
 */
function buscarProducte(){
    if (inventari.length === 0) return 'Inventari buit';

    let nomBuscat = prompt('Nom del producte a buscar: ')?.trim() ?? '';

    const producteTrobat = inventari.find(
        producte => producte.nom.toLowerCase() === nomBuscat.toLowerCase() // Corregido: producte.nom
    );

    if (producteTrobat){
        return `Producte trobat: ${producteTrobat.nom} - Stock: ${producteTrobat.stock} - Preu: ${producteTrobat.preu}€`;
    } else {
        return 'Producte no trobat';
    }
}

/**
 * Mostra els productes que tienen stock per sota de 5 unitats.
 * @returns {string} Llistat de productes amb stock baix o missatge de confirmació.
 */
function mostrarStockBaix(){
    if (inventari.length === 0) return 'Inventari buit';

    const productesStockBaix = inventari
        .filter(producte => producte.stock < 5)
        .map(producte => `${producte.nom} (Stock: ${producte.stock})`) // Corregido el parámetro del map
        .join(`\n`);

    if (!productesStockBaix) return 'No hi ha productes amb stock baix';

    return `==== Productes amb stock baix ===\n${productesStockBaix}`;
}

/**
 * Aplica un percentatge de descompte a tots els productes de l'inventari.
 * @returns {string} Llistat de productes amb els preus descomptats.
 */
function aplicarDescompte(){
    if (inventari.length === 0) return 'Inventari buit';

    let percentatge = Number(prompt('Percentatge de descompte: ')?.trim() ?? '');

    if (isNaN(percentatge) || percentatge <= 0 || percentatge >= 100 || percentatge === ''){
        return 'Percentatge no vàlid!';
    }

    const llistatDescompte = inventari
        .map((producte, i) => {
            const preuAmbDescompte = producte.preu - (producte.preu * percentatge / 100);
            return `${i + 1}. ${producte.nom} - Stock: ${producte.stock} - Preu rebixat: ${preuAmbDescompte.toFixed(2)}€`; // Corregido typo prodyce
        }) // Corregido: Faltaba cerrar el paréntesis de map antes del join
        .join('\n');
    
    return `==== Llistat de productes amb descompte ====\n${llistatDescompte}`;
}

/**
 * Elimina un producte de l'inventari según la posició indicada per l'usuari.
 * @returns {string} Missatge de confirmació o error de l'operació.
 */
function eliminarProducte(){
    if (inventari.length === 0) return 'Inventari buit';
    
    console.log(mostrarInventari());

    let posicio = Number(prompt('Posició del producte a eliminar: ')?.trim() ?? '');

    if (isNaN(posicio) || posicio === '') return 'Posició no vàlida!';

    let index = posicio - 1;

    if (index >= 0 && index < inventari.length){
        inventari.splice(index, 1);
        return 'Producte eliminat!';
    } else {
        return 'Posició no vàlida!';
    }
}

/**
 * Funció principal que executa el loop del programa.
 * Mostra el menú i procesa les opcions seleccionades pel usuari.
 * @returns {boolean} Retorna false quan l'usuari tria sortir.
 */
function main(){
    let opcio;

    while (true){
        opcio = mostrarMenu();
        switch (opcio){
            case 1:
                console.log(afegirProducte());
                break;
            case 2:
                console.log(mostrarInventari());
                break;
            case 3:
                console.log(buscarProducte());
                break;
            case 4:
                console.log(mostrarStockBaix());
                break;
            case 5:
                console.log(aplicarDescompte());
                break;
            case 6:
                console.log(eliminarProducte());
                break;
            case 7:
                console.log('Sortint del programa...');
                return false;
            default:
                console.log('Opció no vàlida!');
        }
    }
}

main();