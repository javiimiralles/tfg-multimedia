const { Schema, model } = require('mongoose');

const PesoHistoricoSchema = Schema(
    {
        idUsuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            require: true
        },
        pesoMedio: {
            type: Number,
        },
        pesoMaximo: {
            type: Number,
        },
        pesoMinimo: {
            type: Number,
        }
    }, { collection: 'pesos-historicos' }
);

PesoHistoricoSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    
    object.uid = _id;
    return object;
});

module.exports = model('PesoHistorico', PesoHistoricoSchema);