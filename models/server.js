import express from 'express';
import "dotenv/config";
import dbConnection from '../database/config.js';
import cors from "cors"
import {getClientes,updateCliente,createCliente,deleteCliente} from "../controllers/clienteController.js"

import {getCuentaAhorro, createCuentaAhorro, consignarDinero, retirarDinero, deleteCuentaAhorro} from '../controllers/cuentaController.js'

import {createUsuario,getUsuarios, updateUsuario, deleteUsuario} from '../controllers/usuarioController.js'

export default class Server {
    constructor() {
        this.app = express()
        this.listen()
        this.dbConnect()
        this.pathUsuario = "/api/usuario"
        this.pathCuenta = "/api/cuenta"
        this.pathCliente = "/api/cliente"
        this.routes()
    }

    listen() { // Método para escuchar el puerto
        this.app.listen(process.env.PORT, () => {
            console.log(`El servidor está corriendo en ${process.env.PORT}`);
        });
    }

    async dbConnect() { // Llamada al método dbConnection para conectarse a MongoDB
        await dbConnection();
    }

    routes() {
        this.app.use(cors({
            origin: 'http://localhost:5173', // Permitir solo ese origen
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
            allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
        }));

        this.app.use(express.json())

        // **Rutas para Clientes**
        this.app.post(`${this.pathCliente}`, createCliente); // Crear cliente
        this.app.get(`${this.pathCliente}`, getClientes); // Obtener todos los clientes
        this.app.put(`${this.pathCliente}/:documentoCliente`, updateCliente); // Actualizar cliente
        this.app.delete(`${this.pathCliente}/:documentoCliente`, deleteCliente); // Eliminar cliente

        // **Rutas para Cuentas de Ahorro**
        this.app.get(`${this.pathCuenta}/:numeroCuenta`, getCuentaAhorro); // Obtener cuenta de ahorro
        this.app.post(`${this.pathCuenta}`, createCuentaAhorro); // Crear cuenta de ahorro
        this.app.post(`${this.pathCuenta}/:numeroCuenta/consignar`, consignarDinero); // Consignar dinero
        this.app.post(`${this.pathCuenta}/:numeroCuenta/retirar`, retirarDinero); // Retirar dinero
        this.app.delete(`${this.pathCuenta}/:numeroCuenta`, deleteCuentaAhorro); // Eliminar cuenta

        // **Rutas para Usuarios**
        this.app.post(`${this.pathUsuario}`, createUsuario); // Crear usuario
        this.app.get(`${this.pathUsuario}`, getUsuarios); // Obtener todos los usuarios
        this.app.put(`${this.pathUsuario}/:nombreUsuario`, updateUsuario); // Actualizar usuario
        this.app.delete(`${this.pathUsuario}/:nombreUsuario`, deleteUsuario); // Eliminar usuario
    }
}
