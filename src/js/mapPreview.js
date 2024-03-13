(function() {
    const lat = document.querySelector('#lat').textContent
    const lng = document.querySelector('#lng').textContent
    const titulo = document.querySelector('#titulo').textContent
    const calle = document.querySelector('#calle').textContent


    const map = L.map('map', {
        center: [lat, lng],
        zoom: 16,
        dragging: false
    });

    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    L.marker([lat, lng]).addTo(map).bindPopup(`${titulo}   ${calle}`)
    



})()