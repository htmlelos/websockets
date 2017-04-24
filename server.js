const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const createStore = require('redux').createStore
const chalk = require('chalk')

const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT': return state + 1
        case 'DECREMENT': return state - 1
        default: return state
    }
}

const app = express()
app.get('/', (request, response) => {
    // console.log('PATH--', __dirname);
    response.sendFile(__dirname + '/index.html')
})

const server = http.createServer(app)
const io = socketIO.listen(server, { log: false })
io.sockets.on('connection', socket => {
    store = createStore(counter)

    const render = () => {
        console.log(chalk.green('ESTADO--', store.getState()));
        socket.emit('show', store.getState())
    }

    store.subscribe(render)

    socket.on('increment', value => {
        console.log(chalk.blue('Se recibio el comando: ' + value))
        store.dispatch({ type: value })
    })
    socket.on('decrement', value => {
        console.log(chalk.blue('Se recibio el comando: ' + value))
        store.dispatch({ type: value })
    })

})

server.listen(3000, () => {
    console.log(chalk.gray('Servidor ejecutandose en el puerto 3000'));
    
})