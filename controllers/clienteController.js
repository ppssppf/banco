import Cliente from "../models/cliente.js";

export async function createCliente(req, res) {
    const { documentoCliente, nombreCompleto, celular, fechaNacimiento } = req.body;

    try {
        const cliente = new Cliente({ documentoCliente, nombreCompleto, celular, fechaNacimiento });
        await cliente.save();
        res.status(201).json({ message: 'Cliente creado con éxito', cliente });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Enviar detalles del error de validación
            return res.status(400).json({ message: 'Error de validación', errors: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
}

// **Obtener todos los clientes (GET)**
export async function getClientes(req, res) {
    try {
        // Obtener todos los clientes de la base de datos
        const clientes = await Cliente.find();
        
        res.status(200).json({clientes});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// **Actualizar un cliente por documentoCliente (PUT)**
export async function updateCliente(req, res) {
    const { documentoCliente } = req.params;
    const updates = req.body;

    try {
        // Buscar y actualizar el cliente por documentoCliente
        const cliente = await Cliente.findOneAndUpdate({ documentoCliente }, updates, { new: true });

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json({ message: 'Cliente actualizado con éxito', cliente });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// **Eliminar un cliente por documentoCliente (DELETE)**
export async function deleteCliente(req, res) {
    const { documentoCliente } = req.params;

    try {
        // Buscar y eliminar el cliente por documentoCliente
        const cliente = await Cliente.findOneAndDelete({ documentoCliente });

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json({ message: 'Cliente eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}