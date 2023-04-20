class Usuario {
    constructor(nombre, apellido, libros = [], mascotas = []) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }
    getFullName() {
        return `${this.nombre} ${this.apellido}`;
    }
    addMascotas(mascota) {
        this.mascotas.push(mascota);
    }
    countMascotas() {
        return this.mascotas.length;
    }
    addBook(titulo, autor) {
        this.libros.push({ titulo: titulo, autor: autor });
    }
    getBookNames() {
        return this.libros.map((book) => book.titulo);
    }
}


const usuario1 = new Usuario('Ezequiel','Sanz Zima',[{titulo: 'Spy x Family', autor: 'Tatsuya Endō'}], ['Perro marron','Perro negro', 'Gato']);
const usuario2 = new Usuario('Diego','Papa',[{titulo: 'Los Pichiciegos', autor: 'Rodolfo Fogwill'}], ['Gato','Perro']);

console.log(usuario1.getFullName());
console.log({ cantidad: usuario1.countMascotas() });
usuario1.addBook('Chainsaw Man','Tatsuki Fujimoto');
console.log(usuario1.getBookNames());

console.log(usuario2.getFullName());
console.log({ cantidad: usuario2.countMascotas() });
usuario2.addBook('El tiempo de las moscas','Claudia Piñero');
console.log(usuario2.getBookNames());