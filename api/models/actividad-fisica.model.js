const { Schema, model } = require('mongoose');

const ActividadFisicaSchema = Schema(
    {
        nombre: {
            type: String,
            require: true
        },
        calorias: {
            type: Number,
            require: true
        },
        tiempoReferencia: {
            type: Number,
            require: true
        },
        predeterminada: {
            type: Boolean,
            default: false
        },
        idUsuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            require: true
        }
    }, { collection: 'actividades_fisicas' }
);

ActividadFisicaSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    
    object.uid = _id;
    return object;
});

module.exports = model('ActividadFisica', ActividadFisicaSchema);