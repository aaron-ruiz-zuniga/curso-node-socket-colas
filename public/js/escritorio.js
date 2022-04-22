
//refrencias HTML
const lblEscritorio = document.querySelector('h1');   //el primer h1 que encuentre
const btnAtender =  document.querySelector('button');   //el primer button que encuentre
const lblTicket =   document.querySelector('small'); //small, lo manejamos como lbl "atendiendo a"
const divAlerta =   document.querySelector('.alert'); //la primera clase que encuentre con el alert
const lblPendientes = document.querySelector('#lblPendientes'); //

//leer los parametros del url
const searchParams = new URLSearchParams( window.location.search );

if ( !searchParams.has('escritorio') ) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none';

const socket = io();



socket.on('connect', () => {
    btnAtender.disabled = false;    
});

socket.on('disconnect', () => {
    btnAtender.disabled= true;    
});

socket.on('ultimo-ticket', (ultimo) => {
   // lblNuevoTicket.innerText = 'Ticket'+ ultimo;
 })

//emitido desde sockets/controller
socket.on('total-tickes-pendientes', ( totalTickesPend) => {
    if( totalTickesPend === 0 ) {
        lblPendientes.style.display = 'none';
        divAlerta.style.display = '';
    }else{
        lblPendientes.style.display = '';        
        lblPendientes.innerText = totalTickesPend; 
        divAlerta.style.display = 'none';   
    }
    
  })

btnAtender.addEventListener( 'click', () => {


    //escuchado en sockets/controller, asigna el ticket al escritorio/lo elimina de los pendientes
    //lo agrega a los ultimos 4 y re-emite el evento a la pantalla de publico.html para
    //actualizarle las etiquetas
socket.emit( 'atender-sig-ticket', { escritorio }, ( {ok, ticket, msg, totalTicketsPendientes } ) =>{
        if( !ok ) {
            lblTicket.innerText= 'Nadie.';
            return divAlerta.style.display ='';
        }

        //si no hay error hay un ticket, se puede mostrar
        lblTicket.innerText= `Ticket ${ ticket.numero }`;

        //actualizo el total de tickets pendientes
        lblPendientes.innerText = totalTicketsPendientes;

        
});
  
   

});


 