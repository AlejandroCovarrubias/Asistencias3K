
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