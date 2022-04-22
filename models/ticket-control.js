const path = require('path'); //para poder contstruir el path donde lo quiero grabar
const fs = require('fs');  //filesuystem para poder grabar informacion a archivo

class Ticket { //modelo del ticket
    constructor( numero, escritorio ) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {

    constructor() {
        this.ultimo = 0; // Ultimo ticket que se esta atendiendo
        this.hoy =  new Date().getDate(); //El dia de hoy
        this.tickets = []; //Tickets que estan pendientes
        this.ultimos4 = [];  // los ultimos 4 (pantalla publico html): 0 --> ticket central...

        this.init();
    }

    get toJson() {
        return {
            ultimo:  this.ultimo, 
            hoy: this.hoy,
            tickets: this.tickets, 
            ultimos4: this.ultimos4
        }
    }

    init() {
        const { hoy, tickets, ultimo, ultimos4} = require('../db/data.json');        
        if( hoy === this.hoy ){
            //entrar aqui significa:
            //que se esta trabajando en el mismo y se esta recargando el servidor
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimos4 = ultimos4;
        } else{
            //es otro dia
            this.guardarDB();
        }
        

    }

    guardarDB() {
        const dbPath = path.join( __dirname, '../db/data.json' );
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson)); // JSON.stringify convierte un objeto json a su representacion en string


    }

    siguiente(){
        this.ultimo += 1; //acumulador
        const ticket = new Ticket( this.ultimo, null );
        this.tickets.push( ticket );

        this.guardarDB();
        return  'Ticket ' +  ticket.numero;
    }

    atenderTicket( escritorio ) {//Asigna el ticket al escritorio, lo elimina de tickets pendientes
        // y lo agrega a ultimos4 y actualiza la DB

        //no tenemos tickets
        if( this.tickets.length === 0 ){
            return null;
        }

        //si si hay tickets, cual numero es
        //se elimina el primer ticket
         const ticket = this.tickets.shift();//this.tickets[0];

         ticket.escritorio = escritorio;

         this.ultimos4.unshift( ticket ); // añadir un elmento al inicio del arreglo

         //validar que siempre sean 4
         if ( this.ultimos4.length > 4) {
             this.ultimos4.splice( -1,1); // -1: es la ultima posicion del arreglo, 1: corta uno; es decir que
                                            //es decir que elimina el ultimo

         }

         this.guardarDB();

         return ticket; // returna el ticket que el escritorio tiene que atender 
                        //o nulo si no hay tickets que atender

         

    }

}

module.exports = TicketControl;