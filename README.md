# # Blog-NodeJS/Hapi

Este proyecto es para crear un Blog web para poner a prueba mis conocimientos adquiridos usando NodeJS y Hapi.

## Poner a funcionar la aplicación

### Requisitos

- Node.JS

### Instrucciones

## Apuntes del curso

### ¿Qué es Hapi?

Hapi es uno de los frameworks más usados en el ecosistema de NodeJS. Está diseñado pensando en aplicativos modularizados de grandes dimensiones. Contempla la separación de la configuración de la lógica del negocio y utiliza su propia forma de hacer las cosas.

Es usado para crear: Aplicativos Web, APIs REST, APIs en GraphQL, Proxies HTTP e Integrador de múltiples Backends, entre otros.

**Prerrequisitos del curso**

- Conocimientos básicos de NodeJS
- Conocimientos generales de
  arquitectura MVC
- Y opcionalmente, conocimientos básicos de: Express,
  Asincronía en Node con async / await y Firebase

### Breve historia y estado actual

_Hapi_ fue creado por _Eran Hammer_, el mismo desarrollador y creador de la especificación _OAuth_, quien, siendo líder del equipo de Mobile en _Walmart_, se vió en la necesidad de buscar una solución a los problemas relacionados con el tráfico del sitio web durante los días cercanos al BlackFriday.

Junto a su equipo crea _Hapi_, como un middleware de _Express_, ya que éste no les ofrecía solución a los problemas que estaban enfrentando. Luego de probar diferentes combinaciones de soluciones, decidieron crear todo el framework desde cero sobre la base del principio: _“mejor configuración que código”,_ e inspirados en _Express_ y _Director_. Así que crearon un concepto nuevo con el que lograron soluciones más eficientes para su problema.

Recientemente Hapi (en su versión más reciente 17.x) fue rediseñado para aprovechar toda la funcionalidad y potencialidad que ofrece el trabajo asincrónico con Async / Wait de NodeJS.

### Conceptos principales de Hapi y creación de nuestro primer servidor

El _servidor_ es la unidad básica y principal de los aplicativos web.
Para crear un servidor con **Hapi**, sólo basta con requerir el módulo y luego ejecutar la función _server_:

```js
const Hapi = require("@hapi/hapi");

const server = Hapi.server({
  port: 3000,
  host: "localhost",
});
```

Luego es necesario definir los puntos de interacción mediante una _ruta_:

```js
server.route({
  method: "GET",
  path: "/",
  handler: (request, h) => {
    return "Hola mundo!";
  },
});
```

La propiedad _method_ indica si el request esperado es de tipo _GET_ o _POST_, y el _path_ es la url relativa asociada a esta ruta definida. El _handler_ es la función que manejará la respuesta que se enviará al navegador.
