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

### El objeto h, response y sus herramientas

El objeto **h**, es el segundo argumento que recibe la función _handler_ de una ruta definida.

Contiene una colección de utilidades y propiedades relativas a la información de respuesta que se va a enviar al cliente, al navegador.

Métodos básicos del objeto h:

- h.**response**(): Crea un objeto de respuesta.
- h.**redirect**(): Redirecciona una petición.

El objeto **Response** (creado con el método _h.response_), permite definir las propiedades de la respuesta. A través de este objeto se pueden especificar las cabeceras, tipo de documento y código de respuesta devuelto al cliente, mediante los métodos: .header(), .type() y .code()

### Uso de plugins - Contenido estático

Los **plugins** son módulos o archivos de Javascript creados generalmente por terceros, que le adicionan funcionalidades al framework base de **Hapi**.
Para implementar un _plugin_ nuevo a nuestro proyecto, lo primero es importarlo en el index.js con la función **requier()** de NodeJS. Luego es necesario registrarlo con `await server.register(plugin)`.
Por el momento, incluiremos en nuestro proyecto los plugins de **Inert** y **Path**

```js
const inert = require("inert");
const path = require("path");
```

El plugin **Inert** extiende los métodos disponibles en el _objeto h_, y **Path** nos permite definir una ubicación relativa para todos los **routes** de nuestro proyecto, entre otras cosas.
