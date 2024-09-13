import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new Schema({
    nombreUsuario: {
        type: String,
        required: [true, 'El nombre de usuario es requerido'],
        unique: true, // Suponiendo que el nombre de usuario debe ser único
        minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
        maxlength: [50, 'El nombre de usuario no debe tener más de 50 caracteres']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo'], // Enumerar los posibles valores de estado
        default: 'activo'
    }
})

usuarioSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Método para comparar la contraseña ingresada con la almacenada
usuarioSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

export default model("Usuario", usuarioSchema)
