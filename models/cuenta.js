import mongoose, { model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Crear un esquema para la cuenta de ahorro
const cuentaAhorroSchema = new mongoose.Schema({
    numeroCuenta: {
        type: Number,
        unique: true,
        required: [true, 'El número de cuenta es requerido'],
        min: [1, 'El número de cuenta debe ser un número positivo']
    },
    documentoCliente: {
        type: String,
        required: [true, 'El documento del cliente es requerido']
    },
    fechaApertura: {
        type: Date,
        required: [true, 'La fecha de apertura es requerida']
    },
    saldo: {
        type: Number,
        required: [true, 'El saldo es requerido'],
        min: [0, 'El saldo no puede ser negativo']
    },
    claveAcceso: {
        type: String,
        required: [true, 'La clave de acceso es requerida']
    }
});

// Middleware para encriptar la clave de acceso antes de guardar la cuenta
cuentaAhorroSchema.pre('save', async function(next) {
    if (this.isModified('claveAcceso')) {
        this.claveAcceso = await bcrypt.hash(this.claveAcceso, 10);
    }
    next();
});

// Método para verificar la clave de acceso
cuentaAhorroSchema.methods.verifyClaveAcceso = async function(claveAcceso) {
    return bcrypt.compare(claveAcceso, this.claveAcceso);
};

// Crear un índice para el número de cuenta único y autoincremental
cuentaAhorroSchema.statics.getNextNumeroCuenta = async function() {
    const lastCuenta = await this.findOne().sort({ numeroCuenta: -1 });
    return lastCuenta ? lastCuenta.numeroCuenta + 1 : 1;
};

export default model ("CuentaAhorro", cuentaAhorroSchema)

