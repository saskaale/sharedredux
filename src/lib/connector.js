import socketio from 'socket.io-client';

class ClientConnector{
    constructor(...args){
        this.remotes = {};
        this.connecting = false;

        this._connect(...args);
    }
    get socket(){
        return this._socket;
    }
    _connect(params, seed, changestatus){
        const {URL, PATH} = params;
        this.connecting = true;

        this._socket = socketio(URL, {path: PATH});

        this._socket.on('connect', (socket) => {
            this.connecting = false;
            changestatus({connected: true});
            this._socket.emit('initseed', seed);
        });
        this._socket.on('disconnect', function(socket){
            this.connecting = false;
            changestatus({connected: false});
        });
    }
}
export default ClientConnector;
