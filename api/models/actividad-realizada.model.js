const { Schema, model } = require('mongoose');

const ActividadRealizadaSchema = Schema(
    {
        fecha: {
            type: Date,
            require: true
        },
        caloriasGastadas: {
            type: Number,
            require: true
        },
        duracion: {
            type: Number,
            require: true
        },
        notas: {
            type: String,
        },
        idActividadFisica: {
            type: Schema.Types.ObjectId,
            ref: 'ActividadFisica',
            require: true
        },
        idUsuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            require: true
        }
    }, { collection: 'actividades_realizadas' }
);

ActividadRealizadaSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    
    object.uid = _id;
    return object;
});

module.exports = model('ActividadRealizada', ActividadRealizadaSchema);