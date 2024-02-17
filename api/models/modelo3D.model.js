const { Schema, model } = require('mongoose');

const Modelo3DSchema = Schema(
    {
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
    }, { collection: 'modelos3D' }
);

Modelo3DSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    
    object.uid = _id;
    return object;
});

module.exports = model('Modelo3D', Modelo3DSchema);