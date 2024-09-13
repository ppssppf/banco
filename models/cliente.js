import { Schema, model } from "mongoose";

const clienteSchema = new Schema({
    documentoCliente: {
        type: String,
        required: [true, 'El documento del cliente es requerido'],
        unique: true, 
        minlength: [5, 'El documento debe tener al menos 5 caracteres'],
        maxlength: [20, 'El documento no debe tener más de 20 caracteres']
    },
    nombreCompleto: {
        type: String,
        required: [true, 'El nombre completo es requerido'],
        minlength: [3, 'El nombre completo debe tener al menos 3 caracteres']
    },
    celular: {
        type: String,
        required: [true, 'El celular es requerido'],
        minlength: [10, 'El celular debe tener al menos 10 caracteres'],
        maxlength: [15, 'El celular no debe tener más de 15 caracteres']
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es requerida']
    }
})

export default model("Cliente",clienteSchema)

