(function(){
   
    const changeStateButton = document.querySelectorAll('.change-state')
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    changeStateButton.forEach( button => {
        button.addEventListener('click', changePropertieState)
    })
    
    async function changePropertieState(e){
        const {propertieId: id} = e.target.dataset      
        

        try {
            const url = `/properties/${id}`
            const response = await fetch(url, {   
                method: 'PUT',
                headers: {
                'CSRF-Token': token
                }          
            })
            
            const { result } = await response.json()
          
            if(result){
                if(e.target.classList.contains('bg-yellow-100')){
                    e.target.classList.add('bg-green-100', 'text-green-800')                    
                    e.target.classList.remove('bg-yellow-100', 'text-red-800')
                    e.target.textContent = 'Publicado'
                } else {
                    e.target.classList.remove('bg-green-100', 'text-green-800')                    
                    e.target.classList.add('bg-yellow-100', 'text-red-800')
                    e.target.textContent = 'No Publicado'
                }
            

            }
        } catch (error) {
            console.log(error)
        }
        
    }

    

})()