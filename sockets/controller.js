
const { Socket } = require('socket.io');
const TicketControl = require('../models/ticket-control');

const ticketControl = new TicketControl();


const socketController = (socket) => {

    //los sig eventos se disparan cuando un cliente se conecta
    socket.emit( 'ultimo-ticket', ticketControl.ultimo); //escuchado nuevo-ticket.html(lblNuevoTicket)
    socket.emit( 'ultimos4', ticketControl.ultimos4 );  //escuchado publico.html (lblTickeN y lbEscritorioN)--> al cargar pagina
    
    //escuchado en escritorio.hmtl(lblPendientes) -->al cargar pagina
    socket.emit( 'total-tickes-pendientes', ticketControl.tickets.length );
    
    socket.on('siguiente-ticket', ( payload, callback ) => { //emitido desde nuevo-ticket.html
                                                             // al dar clic en boton de generar nuevo ticket
         //payload no se va usar pero se mantiene
         //el callback es para regresar el ticket siguiente a la pantalla de nuevo-ticket.html
        
         const siguiente = ticketControl.siguiente();
         callback( siguiente );

        //TODO: Notificar que hay un nuevo ticket pendiente de asignar
        //esuchado en escritorio.html (lblPendientes)--> al dar clic
        // en el boton "Generar nuevo ticket" de nuevo-ticket.html
        socket.broadcast.emit( 'total-tickes-pendientes', ticketControl.tickets.length );  

    })

    socket.on('atender-sig-ticket', ( {escritorio } , callback )=>{ //emitido desde escritorio.html
                                                                    //al dar clic en boton de AtenderSiguienteTicket
        //si el escritorio no viene, return msg
        if( !escritorio) {
            return callback({
                ok: false,
                msg: 'El Esciritorio es obligatorio'
            });
        }

        const ticket = ticketControl.atenderTicket( escritorio );

        //TODO: actualizar-notificar cambio en los ultimos4
        //esuchado en publico.html (lblTickeN y lbEscritorioN)--> al dar clic
        //en el boton Atender siguiente ticket de escritorio.html
        socket.broadcast.emit( 'ultimos4', ticketControl.ultimos4 );  
                                                                        

        //esuchado en escritorio.html (lblPendientes)--> al dar clic
        // en el boton Atender siguiente ticket de escritorio.html
        socket.broadcast.emit( 'total-tickes-pendientes', ticketControl.tickets.length );  
        
                                                                                
        if( !ticket) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'

            })
        }else {
            callback({
                ok: true,
                ticket,
                totalTicketsPendientes: ticketControl.tickets.length
            })            
        }
    })

}



module.exports = {
    socketController
}

