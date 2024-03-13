(function() {
    const lat =  20.7492851;
    const lng =  -103.4040704;
    
    let properties = []

    const map = L.map('homeMap', {
        center: [lat, lng],
        zoom: 12,
        dragging: false
    });

    let markers = new L.FeatureGroup().addTo(map)

    //Filtro
    const filters = {
        category: "",
        price: ''
    }
    
    const categorySelect = document.querySelector('#categories')
    const priceSelect = document.querySelector('#prices')
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)


    //Filtrando Categorias y Precios
        categorySelect.addEventListener('change', e => {
            filters.category = +e.target.value
            filtrarPropiedades(filters.category)
            
            
        })

        priceSelect.addEventListener("change", e => {
            filters.price = +e.target.value
            filtrarPropiedades(filters.price)
            
        })

        
        

    const gettingProperties = async () => {
        try {
            const url = '/api/properties'
            const resp = await fetch(url)
            properties = await resp.json()
            
            showProperties(properties)
            
        } catch (error) {
            console.log(error)
        }


    }

    const showProperties = propertieDB => {

        //Limpiar markers previos
        markers.clearLayers()

        propertieDB.forEach(propertie => {
            const marker = new L.marker([propertie?.lat, propertie?.lng], {
                autoPan: true
            })
            .addTo(map)
            .bindPopup(`
                <p class='text-black font-bold'>${propertie?.Category.name}</p>
                <h1 class='text-xl font-extrabold uppercase my-2'>${propertie?.title}</h1>
                <img src="/uploads/${propertie?.image}" alt='Imagen de la propiedad ${propertie?.title}'/>
                <p class='text-gray-600 font-bold text-center'>${propertie?.Price.name}</p>
                <a href='/properties/${propertie.id}' class='bg-black block p-2 text-center font-bold uppercase rounded  '>Ver Propiedad</a>
            `)

            markers.addLayer(marker)
        })
        
    }

    const filtrarPropiedades = () => {
        const result = properties.filter(categoriesFilter).filter(priceFilter)
        
        showProperties(result)
    }

    const categoriesFilter = prop => filters.category ? prop.CategoryId === filters.category : prop

    const priceFilter = prop => filters.price ? prop.PriceId === filters.price : prop
    
    
    gettingProperties()
    



})()