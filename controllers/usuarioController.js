import Usuario from "../models/usuario.js";

export async function createUsuario(req, res) {
    const { nombreUsuario, password, estado } = req.body;

    try {
        // Crear una nueva instancia de Usuario
        const usuario = new Usuario({ nombreUsuario, password, estado });
        
        // Guardar el usuario en la base de datos
        await usuario.save();
        
        res.status(201).json({ message: 'Usuario creado con éxito', usuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// **Obtener todos los usuarios (GET)**
export async function getUsuarios(req, res) {
    try {
        // Obtener todos los usuarios de la base de datos
        const usuarios = await Usuario.find();
        
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateUsuario(req, res) {
    const { nombreUsuario } = req.params;
    const updates = req.body;

    try {
        // Buscar y actualizar el usuario por nombreUsuario
        const usuario = await Usuario.findOneAndUpdate({ nombreUsuario }, updates, { new: true });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado con éxito', usuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteUsuario(req, res) {
    const { nombreUsuario } = req.params;

    try {
        // Buscar y eliminar el usuario por nombreUsuario
        const usuario = await Usuario.findOneAndDelete({ nombreUsuario });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}