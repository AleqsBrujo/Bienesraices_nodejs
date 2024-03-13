(function() {


    const lat = document.querySelector('#lat').value || 20.7492851;
    const lng = document.querySelector('#lng').value || -103.4040704;
    //'L.map('mapa') declara el ID del div con el que se invocara el mapa en HTML'
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    
    let marker;

    //Utilizar Provider y Geocoder para acceder a la informacion del PIN en mapa
    const geocodeService = L.esri.Geocoding.geocodeService()

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)
    
    //Detectar el movimiento del PIN para autocentrar el mapa
    marker.on('moveend', function(e){
        marker = e.target
        const position = marker.getLatLng()
        const {lat, lng} = position

        mapa.panTo(new L.LatLng(lat, lng))

        //Obtener informacion de las calles al sotlar el PIN
        geocodeService.reverse().latlng([lat, lng]).run(function(error, result){
            
            //Mostrando PopUp sobre Pun de Mapa con Info de la direccion
            marker.bindPopup( result.address.LongLabel )

            //Llenar los campos en la Vista
            document.querySelector('.street').textContent =  result?.address?.Address ?? ''
            document.querySelector('#street').value = result?.address?.Address ?? ''
            document.querySelector('#lat').value = result?.latlng?.lat ?? ''
            document.querySelector('#lng').value = result?.latlng?.lng ?? ''

        })

    })    

})()

