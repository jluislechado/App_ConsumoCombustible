

//Variables Globales
var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();
var map = null;
var distancia;
var tiempo;
var coches;

//----------FUNCIONES-----------------------------------------------------------

//Funcion para inicializar el mapa, punto donde se carga, zoom, tipo de mapa
// y servicios que carga. 

function inicio() {
    var myLatlng = new google.maps.LatLng(37.178056, -3.600833);
    var myOptions = {
        zoom: 13,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var divMapa = document.getElementById('map_canvas')
    map = new google.maps.Map(divMapa, myOptions);
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();
    
    //Creamos un array de coches
    coches=new Array();
    //Creamos los coches uno a uno y los añadimos al array
    //Coches Seat
    var ibizaDiesel75=new Coche('seat','ibiza','diesel',75,3.4);
    coches[0]=ibizaDiesel75;
    var ibizaDiesel90=new Coche('seat','ibiza','diesel',90,3.6);
    coches[1]=ibizaDiesel90;
    var ibizaDiesel105=new Coche('seat','ibiza','diesel',105,3.8);
    coches[2]=ibizaDiesel105;
    var ibizaGasolina75=new Coche('seat','ibiza','gasolina',75,4.2);
    coches[3]=ibizaGasolina75;
    var ibizaGasolina90=new Coche('seat','ibiza','gasolina',90,4.4);
    coches[4]=ibizaGasolina90;
    var ibizaGasolina110=new Coche('seat','ibiza','gasolina',105,4.6);
    coches[5]=ibizaGasolina110;
    var alteaDiesel140=new Coche('seat','altea','diesel',140,6);
    coches[6]=alteaDiesel140;
    var alteaDiesel105=new Coche('seat','altea','diesel',105,4.5);
    coches[7]=alteaDiesel105;
    var alteaGasolina105=new Coche('seat','altea','gasolina',105,5.7);
    coches[8]=alteaGasolina105;
    var alteaGasolina125=new Coche('seat','altea','gasolina',125,6.5);
    coches[9]=alteaGasolina125;
    var leonDiesel90=new Coche('seat','leon','diesel',90,4.1);
    coches[10]=leonDiesel90;
    var leonDiesel150=new Coche('seat','leon','diesel',150,5);
    coches[11]=leonDiesel150;
    var leonGasolina110=new Coche('seat','leon','gasolina',110,5.7);
    coches[12]=leonGasolina110;
    var leonGasolina150=new Coche('seat','leon','gasolina',150,6);
    coches[13]=leonGasolina150;
    var toledoGasolina102=new Coche('seat','toledo','gasolina',102,7.7);
    coches[14]=toledoGasolina102;
    var toledoGasolina150=new Coche('seat','toledo','gasolina',150,8.4);
    coches[15]=toledoGasolina150;
    var toledoDiesel105=new Coche('seat','toledo','diesel',105,5.4);
    coches[16]=toledoDiesel105;
    var toledoDiesel140=new Coche('seat','toledo','diesel',140,5.8);
    coches[17]=toledoDiesel140;
}


//Obtiene las direcciones y calcula la ruta entre el punto de origen y destino.


function getDirections() {
    var origen = document.getElementById('origen').value;
    var destino = document.getElementById('destino').value;
    var tipoS = document.getElementById('tipo_sistema').value;
    var panel = document.getElementById('panel_ruta');
    var marcaCoche=document.getElementById('marca').value;
    var modeloCoche=document.getElementById('modelo').value;
    var potenciaCoche=document.getElementById('potencia').value;
    var combustibleCoche=document.getElementById('combustible').value;

    if (!origen || !destino) {
        //alert("El origen y el destino son obligatorios");
        var divDetalles=document.getElementById('detalles');
        divDetalles.textContent='DETALLES DEL VIAJE';
        var divDistancia=document.getElementById('detallesDistancia');
        divDistancia.textContent='El origen y el destino son obligatorios';
        return;
    }

//request-> variable con las opciones con las que se va a solicitar la información al objeto DirectionsServices.
    var request = {
        origin: origen,
        destination: destino,

        travelMode: "DRIVING",
        //unitSystem se refiere al tipo de unidades que se utilizarán para mostrar distancias, obteniendo el valor del tipo_sistema
        unitSystem: google.maps.DirectionsUnitSystem[tipoS],
        provideRouteAlternatives: true
    };  

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setMap(map);
           // directionsDisplay.setPanel(panel);
            directionsDisplay.setDirections(response);
            //obtenemos la distancia en metros de la primera ruta en metros
            distancia=(response.routes[0].legs[0].distance.value)/1000;
            //obtenemos el tiempo en segundos de la primera ruta
            tiempo=response.routes[0].legs[0].duration.value;
            coche=buscarCoche(marcaCoche,modeloCoche,combustibleCoche,potenciaCoche);
            if(coche==null){
                //alert('No existen coches con los parametros especificados');
                var divDetalles=document.getElementById('detalles');
                divDetalles.textContent='DETALLES DEL VIAJE';
                var divDistancia=document.getElementById('detallesDistancia');
                divDistancia.textContent='No existen coches con los parametros especificados';
            }else{
                var precioC=document.getElementById('precioC').value;
                if(precioC==""||precioC<0||precioC>2){
                    var divDetalles=document.getElementById('detalles');
                    divDetalles.textContent='DETALLES DEL VIAJE';
                    var divDistancia=document.getElementById('detallesDistancia');
                    divDistancia.textContent='Introduce un precio correcto de combustible';
                }else{
                    var dinero=(calcularConsumo(coche,distancia,precioC)).toFixed(2);
                    var gastoCombustible=(calcularCombustible(coche,distancia)).toFixed(2);
                    var divDetalles=document.getElementById('detalles');
                    divDetalles.textContent='DETALLES DEL VIAJE';
                    var divDistancia=document.getElementById('detallesDistancia');
                    divDistancia.textContent='Distancia: '+distancia+' km';
                    var divConsumo=document.getElementById('detallesConsumo');
                    divConsumo.textContent='Consumo: '+gastoCombustible+' litros';
                    var divCosto=document.getElementById('detallesCosto');
                    divCosto.textContent='Costo: '+dinero+' euros';
                    var divDespedida=document.getElementById('despedida');
                    divDespedida.textContent='BON VOYAGE!!!!!!';
                    var cuadro=document.getElementById('cuadro');
                    cuadro.setAttribute('class','marco');
                }
            }
        } else {
            alert("No existen rutas entre ambos puntos");
        }
    });

}




map = new google.maps.Map(map_canvas, {
    mapTypeId: 'IGN',
    scaleControl: true,
    streetViewControl: true,
    panControl: true,
    mapTypeControl: true,
    overviewMapControl: true,
    overviewMapControlOptions: {
        opened: true,
        position: google.maps.ControlPosition.BOTTOM_CENTER
    },


    mapTypeControlOptions: {
        mapTypeIds: [
      'IGN', 'IGNScanExpress',
      google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.ROADMAP
    ],
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
    },
    center: new google.maps.LatLng(47, 3),
    zoom: 6,
    draggableCursor: "crosshair"
});



var input = document.getElementById("origen");
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);


var input2 = document.getElementById("destino");
var searchBox2 = new google.maps.places.SearchBox(input2);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input2);


// Bias the SearchBox results towards current map's viewport.
map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
});

var markers = [];
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener('places_changed', predicciones, false);
searchBox2.addListener('places_changed', predicciones, false);


function predicciones() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
        return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
        marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
        var icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        /* Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          title: place.name,
          animation: google.maps.Animation.BOUNCE,
          position: place.geometry.location
        }));*/

        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
    });
    map.fitBounds(bounds);
}

//Función que calcula el coste de combustible total
function calcularConsumo(coche,dist,precio){
    var consumo=coche.consumo;
    var costo=((consumo*dist)/100)*precio;
    return costo;
}

function calcularCombustible(coche,dist){
    var consumo=coche.consumo;
    var comb=(consumo*dist)/100;
    return comb;
}

//Función que busca el tipo de coche introducido por el usuario en el array
function buscarCoche(marca,modelo,combustible,potencia){
    for(var i=0;i<coches.length;i++){
                if(coches[i].marca==marca&&coches[i].modelo==modelo&&coches[i].combustible==combustible&&coches[i].potencia==potencia){
                return coches[i];  
            }
    }
    return null;
}

//---------------MANEJADORES DE EVENTOS-----------------------------------------
var buscar = document.getElementById('buscar');
//Evento controla boton buscar. JQUERY: .on() ==addEventListener();
buscar.addEventListener('click', function () {
    getDirections();
});

//---------------OBJETOS-----------------------------------------
//Función constructora del Objeto Coche
function Coche(marca, modelo,combustible,potencia, consumo){
    this.marca=marca;
    this.modelo=modelo;
    this.combustible=combustible;
    this.potencia=potencia;
    this.consumo=consumo;
}


//Evento controla selects de transporte y medida. 
//('.opciones_ruta').on('change', function() {
//  getDirections();
//});




//--------------INICIO----------------------------------------------------------
//Funcion inicio
window.onload = inicio();
