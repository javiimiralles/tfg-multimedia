const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema(
    {
        nombre: {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true,
            unique: true
        },
        password: {
            type: String,
            require: true
        },
        sexo: {
            type: String,
            require: true
        },
        altura: {
            type: Number,
            require: true
        },
        edad: {
            type: Number,
            require: true
        },
        pesoInicial: {
            type: Number,
            require: true
        },
        idPesosHistoricos: {
            type: Schema.Types.ObjectId,
            ref: 'PesoHistorico'
        },
        idPlan: {
            type: Schema.Types.ObjectId,
            ref: 'Plan'
        },
        distribucionComidas: {
            type: [String],
            default: ['Desayuno', 'Almuerzo', 'Comida', 'Merienda', 'Cena']
        },
        configuracion: {
            tema: {
                type: String,
                default: 'CLARO'
            }
        }
    }, { collection: 'usuarios' }
);

UsuarioSchema.method('toJSON', function(){
    const { __v, _id, password, ...object } = this.toObject();
    
    object.uid = _id;
    return object;
});

module.exports = model('Usuario', UsuarioSchema);