const express = require('express');
const fs = require('fs').promises;
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json()); 

// Ruta al archivo JSON
const productsFilePath = 'products.json';

// Función para obtener el próximo ID autoincremental
function getNextId(products) {
    const lastId = products.reduce((maxId, product) => {
        const productId = parseInt(product.id);
        return productId > maxId ? productId : maxId;
    }, 0);

    return String(lastId + 1).padStart(2, '0');
}


// Función para filtrar productos según los parámetros de consulta
function filterProductsByQueryParams(products, queryParams) {
    let filteredProducts = [...products];

    Object.keys(queryParams).forEach(param => {
        const paramValue = queryParams[param];
        filteredProducts = filteredProducts.filter(product => {
            if (typeof product[param] === 'string' && typeof paramValue === 'string') {
                return product[param].toLowerCase().includes(paramValue.toLowerCase());
            } else if (typeof product[param] === 'number' && !isNaN(parseFloat(paramValue))) {
                return product[param] === parseFloat(paramValue);
            } else {
                return product[param] === paramValue;
            }
        });
    });

    return filteredProducts;
}

// Endpoint para mostrar endpoints disponibles
app.get('/', (req, res) => {
    const endpoints = {
        endpoints: [
            { 
                method: 'GET',
                endpoint: '/products',
                description: 'Obtener todos los productos o filtrar productos por cualquier parámetro'
            },
            {
                method: 'GET',
                endpoint: '/products/:id',
                description: 'Obtener producto por ID'
            },
            {
                method: 'POST',
                endpoint: '/products',
                description: 'Crear nuevo producto'
            },
            {
                method: 'PUT',
                endpoint: '/products/:id',
                description: 'Actualizar un producto por ID'
            },
            {
                method: 'DELETE',
                endpoint: '/products/:id',
                description: 'Eliminar Producto por ID'
            }
        ]
    };
    res.json(endpoints);
});

// Obtener todos los productos o filtrar productos por cualquier parámetro
app.get('/products', async (req, res) => {
    try {
        const queryParams = req.query;
        const productsData = await fs.readFile(productsFilePath);
        const products = JSON.parse(productsData);

        if (Object.keys(queryParams).length > 0) {
            const filteredProducts = filterProductsByQueryParams(products, queryParams);
            return res.json(filteredProducts);
        } else {
            return res.json(products);
        }
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener los productos', error: error });
    }
});

// Obtener producto por ID o filtrar productos por cualquier parámetro
app.get('/products/:id', async (req, res) => {
    try {
        const idOrQueryParams = req.params.id;
        const productsData = await fs.readFile(productsFilePath);
        const products = JSON.parse(productsData);

        if (idOrQueryParams) {
            const product = products.find(product => product.id === idOrQueryParams);
            if (product) {
                return res.json(product);
            } else {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }
        } else {
            const queryParams = req.query;
            const filteredProducts = filterProductsByQueryParams(products, queryParams);
            return res.json(filteredProducts);
        }
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener el producto', error: error });
    }
});

// Crear nuevo producto
app.post('/products', async (req, res) => {
    try {
        const requiredFields = ['title', 'description', 'price', 'image', 'stock'];
        const newProduct = req.body;

        // Obtén todos los productos para calcular el próximo ID
        const productsData = await fs.readFile(productsFilePath);
        const products = JSON.parse(productsData);

        // Asigna un ID autoincremental al nuevo producto
        newProduct.id = getNextId(products);

        const missingFields = requiredFields.filter(field => !(field in newProduct));
        if (missingFields.length > 0) {
            return res.status(400).json({ mensaje: 'Faltan campos requeridos', camposFaltantes: missingFields });
        }

        products.push(newProduct);
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
        res.status(201).json({ mensaje: 'Producto creado exitosamente', producto: newProduct });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el producto', error: error });
    }
});


// Actualizar un producto por ID o filtrar productos por cualquier parámetro
app.put('/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedFields = req.body;

        const productsData = await fs.readFile(productsFilePath);
        let products = JSON.parse(productsData);
        
        if (id) {
            const index = products.findIndex(product => product.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedFields };
                await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
                return res.json({ mensaje: 'Producto actualizado exitosamente', producto: products[index] });
            } else {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }
        } else {
            const queryParams = req.query;
            const filteredProducts = filterProductsByQueryParams(products, queryParams);
            return res.json(filteredProducts);
        }
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al actualizar el producto', error: error });
    }
});

// Eliminar Producto por ID
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