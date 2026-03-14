import { test, expect } from '@playwright/test';
import Ajv from 'ajv';

// Remove import of 'describe' (not needed in Playwright)
// Use 'test.describe' instead of global 'describe'

test.describe('FakeStoreAPI Product Endpoint @smoke', () => {

    test('GET /products/1 - validate response and schema', async ({ request }) => {
        const endpoint = 'https://fakestoreapi.com/products/1';
        const response = await request.get(endpoint);
        expect(response.status()).toBe(200);

        const body = await response.json();
        // Check required keys
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('title');
        expect(body).toHaveProperty('price');
        expect(body).toHaveProperty('category');
        expect(body).toHaveProperty('description');

        // Optional: Validate data types using Ajv
        const schema = {
            type: 'object',
            properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                price: { type: 'number' },
                category: { type: 'string' },
                description: { type: 'string' },
            },
            required: ['id', 'title', 'price', 'category', 'description'],
        };
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(body);
        expect(valid, JSON.stringify(validate.errors)).toBe(true);

        // Log product title and price
        console.log(`Product Title: ${body.title}`);
        console.log(`Product Price: ${body.price}`);
    });

    test('GET /products/2 - validate response and schema', async ({ request }) => {
        const endpoint = 'https://fakestoreapi.com/products/2';
        const response = await request.get(endpoint);
        expect(response.status()).toBe(200);

        const body = await response.json();
        // Check required keys
        expect(body).toHaveProperty('id');
        expect(body).toHaveProperty('title');
        expect(body).toHaveProperty('price');
        expect(body).toHaveProperty('category');
        expect(body).toHaveProperty('description');

        // Optional: Validate data types using Ajv
        const schema = {
            type: 'object',
            properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                price: { type: 'number' },
                category: { type: 'string' },
                description: { type: 'string' },
            },
            required: ['id', 'title', 'price', 'category', 'description'],
        };
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(body);
        expect(valid, JSON.stringify(validate.errors)).toBe(true);

        // Log product title and price
        console.log(`Product Title: ${body.title}`);
        console.log(`Product Price: ${body.price}`);
    });
});
