const express = require('express');
const fs = require('fs').promises;
const app = express();

app.use(express.json()); 

// Ruta al archivo JSON
const productsFilePath = 'products.json';

// Obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const productsData = await fs.readFile(productsFilePath);
        const products = JSON.parse(productsData);
        res.json(products);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos', error: error });
    }
});

// Obtener producto por ID
app.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const productsData = await fs.readFile(productsFilePath);
        const products = JSON.parse(productsData);
        const product = products.find(product => product.id === id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el producto', error: error });
    }
});

// Crear nuevo producto
app.post('/products', async (req, res) => {
    try {
        const requiredFields = ['id', 'title', 'description', 'price', 'image', 'stock'];
        const newProduct = req.body;

        const missingFields = requiredFields.filter(field => !(field in newProduct));
        if (missingFields.length > 0) {
            return res.status(400).json({ mensaje: 'Faltan campos requeridos', camposFaltantes: missingFields });
        }

        const productsData = await fs.readFile(productsFilePath);
        const products = JSON.parse(productsData);
        products.push(newProduct);
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
        res.status(201).json({ mensaje: 'Producto creado exitosamente', producto: newProduct });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el producto', error: error });
    }
});

// Actualizar un producto por ID
app.put('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedFields = req.body;

        const productsData = await fs.readFile(productsFilePath);
        let products = JSON.parse(productsData);
        const index = products.findIndex(product => product.id === id);

        if (index !== -1) {
            products[index] = { ...products[index], ...updatedFields };
            console.log(products[index])

            await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
            return res.json({ mensaje: 'Producto actualizado exitosamente', producto: products[index] });
        } else {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al actualizar el producto', error: error });
    }
});


// Eliminar Producto
app.delete('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const productsData = await fs.readFile(productsFilePath);
        let products = JSON.parse(productsData);
        const index = products.findIndex(product => product.id === id);

        if (index !== -1) {
            const deletedProduct = products.splice(index, 1)[0];
            await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
            return res.json({ mensaje: 'Producto eliminado exitosamente', producto: deletedProduct });
        } else {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al eliminar el producto', error: error });
    }
});


const PORT = 3004;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});