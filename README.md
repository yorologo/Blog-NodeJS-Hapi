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

### Plantillas con Handlebars

Las _plantillas_ son generalmente archivos _html_ con marcadores particulares que permiten la inserción de variables y la ejecución de algunas instrucciones de programación, antes de ser renderizados. Esta interpretación previa la realiza un plugin conocido como **motor de plantillas**, como es el caso de **Handlebars**.

Para incluir variables o instrucciones de código con **Handlebars** es necesario el uso de dobles llaves (o _curly braces_). Un bloque de _html_ con **Handlebars** sería algo como lo siguiente:

```js
<div class=""post"">
  <h1>Author: {{fullName author}}</h1>
  <div class=""body"">{{body}}</div>

  <h1>Comments</h1>

  {{#each comments}}
  <h2>By {{fullName author}}</h2>
  <div class=""body"">{{body}}</div>
  {{/each}}
</div>
```

Los _bloques de instrucción_ en **Handlebars** comienzan con **#** y se cierran con **/**.

Para más información, recuerda consultar la documentación oficial en [http://handlebarsjs.com/](http://handlebarsjs.com/) y así conocer mucho más de las opciones que te brinda este potente motor de plantillas.

### Renderizado de vistas - Layout y template del home

En **Hapi** podemos usar la arquitectura _MVC (Modelo-Vista-Controlador)_ para organizar la lógica de nuestras aplicaciones. Para implementar el uso de _vistas_ es necesario instalar el plugin **Vision** y configurarlo de la siguiente manera:

```js
server.views({
  engines: {              // Hapi puede usar diferentes engines
    hbs: handlebars,      // Asociamos el plugin al tipo de archivos
  },
  relativeTo: __dirname,  // Para que las vistas las busque fuera de /public
  path: "views",          // Directorio donde colocaremos las vistas dentro de nuestro proyecto
  layout: true,           // Indica que usaremos layouts
  layoutPath: "views",    // Ubicación de los layouts
});
```

Al crear el archivo **layout.hbs** evitaremos repetir las mismas secciones de html en cada una de las vistas, remplazando sólo lo relativo al contenido que cambiará según las rutas definidas en nuestra aplicación.

En la definición de las rutas, tendremos que cambiar la respuesta devuelta en _handler_ para que invoque a **h.view()** en lugar de **h.file()**, con los parámetros esperados por el layout.

Para poder incorporar el html de las vistas dentro del _layout.hbs_, es necesario usar **triples llaves** en lugar de **dobles**, ya que por defecto Handlebars escapa el código _html_ convirtiéndolo en su equivalente texto plano.

### Recibiendo parámetros en una ruta POST - Creación del registro

El objeto **request** nos permite obtener datos de la petición recibida desde el cliente. El método pasado como parámetro para la creación de este objeto define si trabajaremos con GET o POST.

Proipiedades del **request**:

- request.path
- request.method
- request.get
- request.payload: es en esta propiedad donde recibimos los datos enviados con el método POST.

Ciclo de vida del objeto **request**, se refiere a los eventos que suceden durante la carga, existencia y descarga del objeto:

- OnRequest
- OnPreAuth
- OnCredentials
- OnPostAuth
- OnPreHandler
- OnPostHandler
- OnPreResponse

Más información sobre el ciclo de vida del objeto **request** en el repositorio oficial del proyecto: [Hapi repository](https://github.com/hapijs/hapi/blob/master/API.md#request-lifecycle)

### Definir una mejor estructura con buenas prácticas en Hapi

Con el fin de tener una mejor organización de los archivos de nuestro proyecto, y considerando que estamos trabajando con la arquitectura _MVC_, haremos una primera refactorización del código.

Creamos el directorio `/controllers` para colocar los _controladores site y user_ de nuestro proyecto. Pasamos la definición de las rutas a su propio módulo `routes.js` como un arreglo que exportaremos más adelante. Distribuímos los _handlers_ asociados a cada _vista_ en la definición de las _rutas_ hacia el archivo del _controlador_ para cada contexto, ya sea _site_ o _user_. Requerimos los controladores desde el módulo de rutas, y fnalmente importamos la definición de rutas desde el `index.js` y las asociamos al _server_ con `server.route(routes)`.

### Validando la información - Implementando Joi

La validación de los datos suministrados por el usuario puede hacerse tanto en el _frontend_ como en el _backend_, incluso puede hacerse en ambos lados, lo cual se recomienda.

Para hacer la validación de información en el _backend_, Hapi cuenta con un módulo llamado **Joi** que ofrece múltiples condiciones de validación, como: tipo de dato, mínimos y máximos, condiciones personalizadas, etc.

**Joi** nos permite generar validación de un esquema específico en Hapi en el mismo momento en que se definen las _rutas_.

Luego de instalar y requerir el módulo en el arhivo _routes.js_ será necesario agregar la propiedad _options_ que contiene a su vez _validate_ y luego _payload_, en esta caso porque los datos serán recibidos por POST, allí definimos entonces las condiciones de validación para cada dato esperado.

### Introducción a Firebase

Ya teniendo validada la información que recibimos del usuario, el siguiente paso es almacenarla para su posterior recuperación. Para esto haremos uso del servicio de base de datos de **Firebase / Storage** con una configuración básica.

El proceso de creación y configuración de la base de datos se hace a través del sitio web [https://firebase.google.com](https://firebase.google.com/) mediante la consola de administración, accediendo con una cuenta Google y creando un proyecto nuevo. En la sección de Configuración / Cuentas de Servicio, generamos las credenciales de acceso para NodeJS en formato json, que usaremos en nuestro proyecto, en la siguiente clase.

### Creando un modelo y guardando en firebase

Para implementar el uso de la base de datos de Firebase en nuestro proyecto, crearemos el directorio `/config` para guardar el archivo _json_ con las credenciales de acceso al servicio, y el directorio `/models` con los modelos asociados a las diferentes entidades que requiere nuestra aplicación. Instalamos desde la terminal el módulo `firebase-admin` con npm. Requerimos el módulo en el index.js del directorio `/models` e invocamos el método `firebase.initializeApp()`

### Implementando el login y validación del usuario

Teniendo el modelo de Usuario ya definido, podemos pasar a la implementación del Login, para lo cual creamos una nueva vista y agregaremos un método en el controlador, además de las rutas correspondientes para el login y la validación de usuarios.

Al hacer un _query_ sobre los registros almacenados en Firebase, el resultado devuelto es un objeto JSON con los resultados, en los que las keys de cada elemento corresponden con los IDs de cada usuario. Aún cuando el resultado devuelto es sólo un registro, la estructura es la misma.

Es importante tener en cuenta que al recuperar los datos desde Firebase, la contraseña viene cifrada, por lo que la validación debe hacerse comparando ambos datos con _bcrypt_.

### Autenticación de usuarios - Cookies y estado

Hay diferentes maneras de mantener el estado de autenticación de un usuario en un sistema. Para este proyecto usaremos la forma más sencilla que es a través de una _cookie_ y usando el _state_ de Hapi.

Con la función `server.state( '<nombre de la cookie>', { <opciones> } )` definimos las características de la _ cookie_ que usaremos en la ruta definida para hacer la validación. Luego asignaremos los datos propios de la autenticación a esta _cookie_ en el controlador, en la misma instrucción en la que hacemos el _redirect_ al Home, luego de validado el usuario.

Habiendo guardado el estado de la autenticación, podemos definir entonces diferentes opciones en el _Layout_ que nos permitan por ejemplo, hacer _Logout_ y mostrar la información del usuario, entre otras cosas.

### Manejando errores

Para el manejo general de errores con Hapi usamos la instrucción `process.on( '<tipo de error>', ( <error> ) => { <callback> } )` en el script principal. En el _callback_ de la función, **error** devuelve un objeto con los detalles del error capturado. Los tipos de errores que vamos a manejar en el proyecto son: `unhandledRejection` y `unhandledException`. Estos dos tipos de errores son los más comunes y los que se aconseja manejar como mínimo en cualquier aplicación.

Luego definimos el método `failActions` en las rutas en las que haremos las validaciones. Este método hará referencia a su vez al método del controlador en el cual se procesará el manejo de los errores.

Para mostrar los mensajes de error en la aplicación de una manera más amigable y controlada, usaremos el módulo _boom_, que está integrado en el core de Hapi.

### Visualización de errores

Hasta ahora hemos estado mostrando un texto básico con los detalles de cada error capturado, pero en lo que se refiere a la apariencia, esta no es la forma más amigable de hacerlo ya que no le estamos dando mayor feedback al usuario sobre lo que ha pasado con su operación y lo estamos dejando en una calle sin salida.

Lo que haremos en esta clase será utilizar una vista a la que pasaremos la información del error y la mostraremos de una manera que sea visualmente más amigable para los usuarios. Para esto, sustituiremos los llamados a `h.response( '<mensaje>' ).code( <código-error> )` por `h.view( '<ruta>', { <variables> } )`

Para la visualización del `error 404`, incorporamos un nuevo layout, con su respectiva vista `404.hbs` y definimos una nueva ruta para los llamados a urls que no estén definidas en nuestra aplicación con `/{any*}`. Esta ruta se coloca al final de las definiciones para que solo se tome en cuenta si ninguna de las rutas anteriores se corresponde con el _request_. Al hacer el llamado a la vista en el controlador del sitio, debemos recordar indicar en el tercer argumento de la función view, el objeto con la propiedad _layout_ para indicar el nuevo _layou_ que mostrará el error.

### Controlar el error 404 en inert y el error de validación

El error 404 que ya estamos controlando es el que está relacionado con las rutas de nuestra aplicación, sin embargo, falta controlar la visualización de este mismo tipo de error para los archivos estáticos que usamos en nuestra interfaz y que estamos cargando con _inert_. Para esto haremos una nueva función en el controlador del sitio para el manejo de _not found_ de los archivos estáticos.

Básicamente lo que haremos será interceptar el error de _boom_ devuelto por _inert_ con `response.isBoom` y analizar si su código es 404 para redireccionar entonces a la vista apropiada. Para poder hacer la intercepción del error y alterar el _life cycle_ del request, es necesario indicar la siguiente instrucción `server.ext( 'onPreResponse', handler )` antes de la definición de las rutas en el _script_ principal.

Cuando interceptamos el _life cycle_ de un _request_, debemos hacer un `.takeover()` para forzar la finalización del ciclo, y esto lo hacemos luego del `code(n)` en el llamado a la vista.

### Repaso - Creación del modelo y controlador para preguntas

En esta clase tomaremos la sección de preguntas de nuestro proyecto para hacer un repaso de lo aprendido hasta ahora.

- A partir del _html_, tomamos el contenido del tag

```html
<main>...</main>
```

y lo extraemos a un archivo de _handlebars_ en la carpeta `/vistas`

```js
class MiModelo {
  constructor(db) {
    this.db = db;
    this.ref = this.db.ref("/");
    this.collection = this.ref.child("entidad");
  }
  async miMetodo(args) {
    // --- instrucciones
    return key;
  }
}
module.exports = MiModelo;
```

### Listar las últimas preguntas en el home

Para listar las últimas preguntas creadas en la base de datos de Firebase, agregamos un nuevo método en el modelo de las preguntas y usamos la función

```js
this.collection.limitToLast(n).once("value");
```

para obtener los **n** últimos registros al final de los datos.

Luego debemos incluir el llamado al método anterior desde el controlador que maneja las rutas en la aplicación. Y finalmente sustituimos el bloque que renderiza las preguntas en la plantilla del _home_, `index.hbs`, por una nueva estructura de _handlebars_ llamada `{#each ... } ... {/each}`

### Enrutamiento avanzado - visualizando una pregunta

A través del enrutamiento avanzado de Hapi, recibiendo parámetros en el _request_, podemos tener una vista específica para mostrar los detalles de cada pregunta. Partimos de un archivo _html_ y creamos un método en el modelo de preguntas que ya teníamos antes. Este método nos permitirá obtener el objeto con los detalles de la pregunta individual según su ID.

Al igual que en oportunidades anteriores, creamos una función en el controlador del sitio que maneje la ruta para la nueva vista. Creamos la plantilla con _handlebars_ trasladando el contenido del _tag_ main, desde la vista html original e incluimos las variables que recibimos desde el modelo.

Definimos una nueva ruta en el archivo `routes.js`, indicando en la propiedad **path** los parámetros que esperamos recibir desde el controlador, es aquí donde estamos utilizando el enrutamiento avanzado. Finalmente actualizamos los enlaces en el layout principal colocando en _href_ la nueva ruta creada con la variable _key_ que dispones en cada iteración del ciclo `each` para las preguntas recientes.
