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
        for(var i = 0; i < 5; i++){
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
            // Pasa el nombre todo a mayusculas para evitar repeticiones por eso
            var nombreNuevo = el.substring(0, index).toUpperCase();
            // Si esta vacio se va a la verch
            if(nombreNuevo != "")
                arregloFinal.push(nombreNuevo);
            else
                console.log("Parece que tenemos un pintero.");
        })
        //console.log(arregloFinal)

        // regresa el arreglo
        console.log("FECHA:"+fecha)
        return {
            arregloFinal,
            fecha
        }
    }
    



// Combinar arreglos sin repeticiones
exports.combinarArreglos = (primero, segundo) => {
    var arregloFinal = [];
    // Agrega todo a uno
    primero.forEach(elemento => {
        arregloFinal.push(elemento)
    });
    segundo.forEach(elemento => {
        arregloFinal.push(elemento)
    })
    // Lo convierte en set y despues en arreglo
    return [...new Set(arregloFinal)];
}