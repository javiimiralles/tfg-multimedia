const { Schema, model } = require('mongoose');

const AlimentoSchema = Schema(
    {
        nombre: {
            type: String,
            require: true
        },
        marca: {
            type: String,
        },
        cantidadReferencia: {
            type: Number,
            require: true
        },
        unidadMedida: {
            type: String,
            require: true
        },
        calorias: {
            type: Number,
            require: true
        },
        carbohidratos: {
            type: Number,
            require: true
        },
        proteinas: {
            type: Number,
            require: true
        },
        grasas: {
            type: Number,
            require: true
        },
        idUsuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            require: true
        }
    }, { collection: 'alimentos' }
);

AlimentoSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    
    object.uid = _id;
    return object;
});

module.exports = model('Alimento', AlimentoSchema);