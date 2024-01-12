const { Schema, model } = require('mongoose');

const RegistroPesoSchema = Schema(
    {
        fecha: {
            type: Date,
            require: true
        },
        peso: {
            type: Number,
            require: true
        },
        idUsuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            require: true
        }
    }, { collection: 'registros-peso' }
);

RegistroPesoSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    
    object.uid = _id;
    return object;
});

module.exports = model('RegistroPeso', RegistroPesoSchema);