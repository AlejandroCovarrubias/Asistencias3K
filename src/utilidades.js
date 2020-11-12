var fs = require('fs');

// Funcion de nuevo ID en una coleccion
exports.siguienteID = (x) => {

    // Verifica que mandaste array
    if (typeof x != "undefined"
        && x != null
        && x.length != null) {
        // Si esta vacia manda un 1
        if (x.length == 0) {
            return 1;
        }
        var grandest = -2;
        // Itera por la coleccion
        x.forEach(el => {
            if (+el.id > +grandest) {
                grandest = +el.id;
            }
        })
        return +grandest + +1;
    } else {
        return -1;
    }
}

// Lee archivo
exports.leerArchivo = (archivo) => {
        //console.log("ARCHIVO:" +archivo)

        // Encuentra la fecha
        var reg = /\d{4}-\d{2}-\d{2}/
        var index = archivo.search(reg)
        var fecha = archivo.substr(index, 10)
        //console.log(fecha)
        // Quita la primeras cinco lineas (no se por que se ocupan tantas pero nomas asi me deja con los nombres)
        for (var i in [0, 1, 2, 3, 4, 5]) {
            var linea = archivo.indexOf('\n')
            if (linea == 0)
                linea = +1;
            console.log(linea)
            archivo = archivo.substr(linea)
        }
        //console.log(archivo)
        // Convertir a arreglo
        const arregloFinal = [];
        // La neta nomas nos importan los nombres
        // Dividimos lo que sobra por saltos de linea
        var arreglo = archivo.split('\n')
        //console.log(arreglo)
        // Le quitamos todo el chuche para que nomas queden nombres en cada uno y los agregamos al final
        arreglo.forEach(el => {
            var index = el.indexOf('\t')
            arregloFinal.push(el.substring(0, index))
        })
        //console.log(arregloFinal)

        // regresa el arreglo
        return [arregloFinal, fecha];
    }
    



// Combinar arreglos sin repeticiones
exports.combinarArreglos = (...arreglos) => {
    var arregloFinal = [];
    // Agrega todo a uno
    arreglos.forEach(arreglo => {
        arreglo.forEach(elemento =>{
            arregloFinal.push(elemento)
        })
    })
    // Lo convierte en set y despues en arreglo
    return Array.from(new Set([arregloFinal]))
}