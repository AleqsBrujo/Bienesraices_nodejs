import path from 'path'

export default {
    mode: 'development',
    entry: {
        map: './src/js/map.js',
        addImage: './src/js/addImage.js',
        mapPreview: '/src/js/mapPreview.js',
        homeMap: '/src/js/homeMap.js',
        changeState: '/src/js/changeState.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }

}