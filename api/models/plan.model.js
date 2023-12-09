const { Schema, model } = require('mongoose');

const PlanSchema = Schema(
    {
        idUsuario: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            require: true
        },
        tipo: {
            type: String,
            require: true
        },
        caloriasDiarias: {
            type: Number,
        },
        carbosDiarios: {
            type: Number,
        },
        proteinasDiarias: {
            type: Number,
        },
        grasasDiarias: {
            type: Number,
        }
    }, { collection: 'planes' }
);

PlanSchema.method('toJSON', function(){
    const { __v, _id, ...object } = this.toObject();
    
    object.uid = _id;
    return object;
});

module.exports = model('Plan', PlanSchema);