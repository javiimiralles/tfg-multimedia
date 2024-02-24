const { Schema, model } = require('mongoose');

const FotoProgresoSchema = Schema(
    {
        fecha: {
            type: Date,
            require: true
        },
        url: {
            type: String,
            require: true
        },
        idCloudinary: {
            type: String,
            require: true
        },
        idUsuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            require: true
        }
    }, { collection: 'fotos_progreso' }
);

FotoProgresoSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    
    object.uid = _id;
    return object;
});

module.exports = model('FotoProgreso', FotoProgresoSchema);