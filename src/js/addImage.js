import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')


Dropzone.options.images = {
    dictDefaultMessage: 'Sube tus imágenes aquí',
    acceptedFiles: '.png, .jpg, jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'Solo puedes subír una Imagen',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'propImage',
    init: function() {
        const dropzone = this
        const btnUpload = document.querySelector('#uploadimg')
        
        btnUpload.addEventListener('click', function(){
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function() {
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href = '/my-properties'
            }

        })

    }
}

