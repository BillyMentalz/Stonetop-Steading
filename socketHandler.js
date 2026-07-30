import {createOperation, syncOperation, updateOperation, deleteOperation } from "./data/queries.js"

export function registerSocketHandlers(io) {
    io.on('connection', (socket) => {
        socket.on('checkSync', (checkSync)=> {
            const updates = syncOperation(checkSync);
            socket.emit('checkSync', updates)
        });
        socket.on('create', (create) => {
            const creation = createOperation(create);
            io.emit('create', creation);
        });
        socket.on('update', (update) => {
            const signature = updateOperation(update);
            io.emit('update', signature)
        });
        socket.on('delete', (deleted) => {
            const deleteRecord = deleteOperation(deleted);
            io.emit('delete', deleteRecord)
        });
    })
}

