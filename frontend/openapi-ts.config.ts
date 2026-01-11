import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:5032/openapi/v1.json',
  output: 'src/client',
  plugins: [
   {
    name: '@tanstack/react-query',
   } 
  ]
});