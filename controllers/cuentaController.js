import CuentaAhorro from '../models/cuenta.js';

// **Listar los datos de una cuenta (GET)**
export async function getCuentaAhorro(req, res) {
    const { numeroCuenta } = req.params;

    try {
        // Buscar la cuenta por número de cuenta
        const cuentaAhorro = await CuentaAhorro.findOne({ numeroCuenta });
        
        if (!cuentaAhorro) {
            return res.status(404).json({ message: 'Cuenta de ahorro no encontrada' });
        }
        
        res.status(200).json(cuentaAhorro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// **Crear una nueva cuenta de ahorro (POST)**
export async function createCuentaAhorro(req, res) {
    const { documentoCliente, fechaApertura, saldo, claveAcceso } = req.body;

    try {
        // Obtener el siguiente número de cuenta autoincremental
        const numeroCuenta = await CuentaAhorro.getNextNumeroCuenta();

        // Crear una nueva instancia de CuentaAhorro
        const cuentaAhorro = new CuentaAhorro({ numeroCuenta, documentoCliente, fechaApertura, saldo, claveAcceso });
        
        // Guardar la cuenta en la base de datos
        await cuentaAhorro.save();
        
        res.status(201).json({ message: 'Cuenta de ahorro creada con éxito', cuentaAhorro });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// **Consignar dinero en la cuenta (POST)**
export async function consignarDinero(req, res) {
    const { numeroCuenta } = req.params;
    const { monto, claveAcceso } = req.body;

    try {
        // Buscar la cuenta por número de cuenta
        const cuentaAhorro = await CuentaAhorro.findOne({ numeroCuenta });
        
        if (!cuentaAhorro) {
            return res.status(404).json({ message: 'Cuenta de ahorro no encontrada' });
        }

        // Verificar la clave de acceso
        const isValidClaveAcceso = await cuentaAhorro.verifyClaveAcceso(claveAcceso);
        if (!isValidClaveAcceso) {
            return res.status(401).json({ message: 'Clave de acceso incorrecta' });
        }

        // Validar monto
        if (monto <= 0) {
            return res.status(400).json({ message: 'El monto a consignar debe ser positivo' });
        }

        // Actualizar el saldo
        cuentaAhorro.saldo += monto;
        await cuentaAhorro.save();
        
        res.status(200).json({ message: 'Dinero consignado con éxito', cuentaAhorro });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// **Retirar dinero de la cuenta (POST)**
export async function retirarDinero(req, res) {
    const { numeroCuenta } = req.params;
    const { monto, claveAcceso } = req.body;

    try {
        // Buscar la cuenta por número de cuenta
        const cuentaAhorro = await CuentaAhorro.findOne({ numeroCuenta });
        
        if (!cuentaAhorro) {
            return res.status(404).json({ message: 'Cuenta de ahorro no encontrada' });
        }

        // Verificar la clave de acceso
        const isValidClaveAcceso = await cuentaAhorro.verifyClaveAcceso(claveAcceso);
        if (!isValidClaveAcceso) {
            return res.status(401).json({ message: 'Clave de acceso incorrecta' });
        }

        // Validar monto
        if (monto <= 0) {
            return res.status(400).json({ message: 'El monto a retirar debe ser positivo' });
        }

        // Verificar si el saldo es suficiente
        if (monto > cuentaAhorro.saldo) {
            return res.status(400).json({ message: 'Saldo insuficiente' });
        }

        // Actualizar el saldo
        cuentaAhorro.saldo -= monto;
        await cuentaAhorro.save();
        
        res.status(200).json({ message: 'Dinero retirado con éxito', cuentaAhorro });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// **Eliminar una cuenta (DELETE)**
export async function deleteCuentaAhorro(req, res) {
    const { numeroCuenta } = req.params;

    try {
        // Buscar la cuenta por número de cuenta
        const cuentaAhorro = await CuentaAhorro.findOne({ numeroCuenta });
        
        if (!cuentaAhorro) {
            return res.status(404).json({ message: 'Cuenta de ahorro no encontrada' });
        }

        // Verificar si el saldo es cero
        if (cuentaAhorro.saldo > 0) {
            return res.status(400).json({ message: 'No se puede eliminar una cuenta con saldo positivo' });
        }

        // Eliminar la cuenta
        await CuentaAhorro.deleteOne({ numeroCuenta });
        
        res.status(200).json({ message: 'Cuenta de ahorro eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
