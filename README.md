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

### Enrutamiento avanzado - respondiendo una pregunta

Para crear la funcionalidad de respuesta, creamos un método nuevo en el modelo de preguntas llamado `answer`. Este método nos permitirá insertar con _push_ el objeto con la respuesta individual para una pregunta que será almacenada en un arreglo _child_ llamado _answers_.

Luego definimos el método respectivo en el controlador de las preguntas y creamos la ruta que manejará el envío de las respuestas desde el formulario.

Es importante tener en cuenta que el ID de la pregunta que estamos respondiendo, corresponde a un _input_ de tipo _hidden_ en la vista, por lo que debemos asignar apropiadamente su valor a partir del _key_ recibido en la ruta.

Finalmente, actualizamos la vista de detalles de pregunta, recordando que las respuestas son un arreglo en la base de datos de Firebase, por lo que deberemos recorrerlo igualmente con la instrucción `{#each ... } ... {/each}` de _handlebars_.

Para el conteo de las respuestas crearemos un _helper_ personalizado de _handlebars_ y lo registraremos en el `index.js` con el método **.registerHelper( ‘<nombre helper>’, <función helper> )**. Los _helpers_ son funciones de JavaScript que están disponibles globalmente en la aplicación para ser incluídas en cualquiera de las vistas.

### Generando la lógica de la plantilla según si es creador o contribuidor

En esta clase agregaremos la funcionalidad de marcado de las respuestas como correctas, para esto nos apoyaremos en otro _helper_ de _handlebars_ por lo que haremos primero una refactorización creando un archivo que contenga todos los _helpers_ en una función que retornará el objeto _handlebars_ personalizado.

El tag `{#if}{/if}` de _handlebars_ no soporte comparar múltiples condiciones, por lo que tendremos que crear un helper de tipo _método de bloque_, que tiene una estructura parecida a la siguiente:

```
handlebars.registerHelper('nombreHelper', ( params..., options ) => {
	if( <condición> ) {
		// --- renderiza el contenido
		return options.fn( this )
	}
	// --- no renderiza el contenido
	return options.inverse( this )
})

```

Un método de bloque es en esencia un _tag_ personalizado en _handlebars_, de tipo bloque `{#miHelper} ... {/miHelper}`, similar a `{#if}{/if}`, `{#with}{/with}`, `{#each}{/each}`, etc.

### Métodos de servidor - respuesta correcta

Los **métodos del servidor** en Hapi, son _métodos o funciones_ que pueden ser accedidos desde cualquier ruta de la aplicación de manera global.

Lo primero que haremos será crear el método estándar en el modelo. En nuestro caso, el modelo de las preguntas.

Luego creamos un archivo que contendrá los métodos del servidor y lo guardamos como `/lib/methods.js`. En este archivo requerimos el modelo donde hemos creado el método estándar y lo asociamos a un método propio, transladando todos los argumentos del método original.

Finalmente requerimos en el script principal de la aplicación el archivo con los métodos del servidor y registramos cada m[etodo en el _server_ con la instrucción `server.method( '<nombre del método>', methods.<metodo creado> )`, ya luego en el código podremos acceder a estos métodos a través del objeto _request_ de Hapi.

### Usando métodos de servidor

Usar los métodos de servidor que creamos en la clase pasada es tan simple como acceder a `req.server.methods`:

```
req.server.methods.<nombre método>( args )

```

Esto lo hacemos en el controlador y de allí continuamos el ciclo normal de las rutas como hemos visto hasta ahora.

### Manejo del caché - Agregando el home al caché

Internamente Hapi maneja el caché de las aplicaciones usando un módulo llamado **CatBox** que ya viene integrado en el _core_ del _framework_. Este módulo utiliza varios modos de _caching_; por defecto, Hapi implementa el _caché_ de memoria.

También es posible ampliar las funcionalidades del uso de _caché_ en nuestras aplicaciones instalando y configurando otros módulos disponibles como: Redis, MemCache, etc.

Para habilitar el uso de _caching_ **del lado del cliente** con Hapi basta con agregar la propiedad **options** en la definición de cada ruta y definir el tiempo de expiración con **expiresIn** y el tipo de privacidad con **privacy**.

```
'options': {
  'expiresIn': <duracion>, // en milisegundos
  'privacy'  : <tipo privacidad>
}

```

Nos apoyaremos en los métodos de servidor que aprendimos en clases anteriores para definir el uso de _caché_ en el _backend_ de nuestra aplicación, ya que Hapi permite hacer _caching_ del resultados de este tipo de métodos al momento de registrarlos en el script principal:

```
server.method( '<nombre método>', methods.<metodo>, {
'cache': {
  'expiresIn': <duracion>,
  'generateTimeout': <timeout>
}
```

### Procesamiento de archivos - Aceptando imágenes

En esta clase aprenderemos el manejo de archivos con Hapi. Agregaremos la posibilidad de anexar imágenes a las preguntas. Para esto será necesario modificar el método _create_ del modelo _questions.js_ para que guarde en la base de datos de Firebase el nombre de archivo.

Será necesario también requerir algunos módulos adicionales, o algunas funciones desde esos módulos:

```js
const { writeFile } = require("fs");
const { promisify } = require("util");
const { join } = require("path");
```

Instalaremos y usaremos el módulo `uuid` en su versión `v1` para manejar nuestros propios nombres de archivo internamente y evitar la duplicidad.

En el controlador de las preguntas incorporamos la lógica del manejo de archivos cuando se ha identificado la presencia del dato _image_ en el _buffer_ del con

```
Buffer.isBuffer( request.payload.image )

```

Este campo _image_ debemos incluirlo en el formulario, en la vista con el formulario de respuesta. Finalmente, al recibir el archivo a través del _buffer_ tendremos que escribirlo en el _filesystem_ del servidor, para lo cual usaremos la función _writeFile_ que hemos convertido en promesa y llamado `write( args )` con los argumentos correspondientes. Ya para mostrar la imagen en la vista cuando se haya recuperado, sólo bastará con incorporar la etiqueta `<img />` con la referencia al archivo almacenado.

### Logging con Good - Monitoreando el servidor

El proceso de registrar los eventos que suceden internamente en nuestra aplicación, también conocido como _logging_, es un aspecto técnico bastante habitual en entornos de producción de la vida real.

Hapi incluye un método `.log( args )` tanto en el objeto `server`, como en `request` y en `response` que nos permiten un registro muy básico de eventos; sin embargo, la práctica recomendada es hacer _logging_ con un módulo adicional llamado **Good** y una dependencia para el manejo de transporters llamada **good-console**.

Al igual que hemos hecho antes, una vez instalado el paquete de Good, será necesario requerirlo y registrarlo debidamente en el _script_ principal, pero en este caso lo haremos de una manera ligeramente diferente:

```py
...
await server.register({
  'plugin': good,
  'options': {
    'reporters': {
      'console': [
        {
          'module': 'good-console'
        },
        'stdout' // --- salida estándard
      ]
    }
  }
})
...

```

Luego de configurado el paquete, la implementación es tan simple como ejecutar la misma instrucción `server.log( '<etiqueta o tag>', <mensaje> )`, donde `<mensaje>` puede ser una cadena de texto o un objeto. Recuerda que el método log también está disponible en los objetos `request` y `response`.

### Creación de plugins - Teoría

Habiendo completado toda la funcionalidad básica de nuestra aplicación, podemos pensar en extender algunas de estas funcionalidades para que otros desarrolladores puedan tener acceso desde sitios externos e integrarse con nuestro proyecto. Por lo general la solución más conveniente es ofrecer una _API REST_ a través de un **plugin** personalizado.

En Hapi, un **plugin** es un Objeto que tiene básicamente la siguiente estructura:

```js
const plugin = {
  'name'    : 'miPlugin', // --- requerido
  'version' : '1.0.0', // --- opcional
  'register': function (server, options) {
    ...
  }
}

```

- En `server` se indica la referencia de cuál servidor se la añadirán las responsabilidades asociadas a este _plugin_.
- En `opciones` se pueden colocar parámetros externos como credenciales, condiciones especiales, entre otras.

### Creación de plugins - Implementando un API REST

Partiremos de la estructura que vimos en la clase anterior para desarrollar nuestra API REST.

En el método `register` del _plugin_ definiremos tanto las rutas necesarias para acceder a nuestra API, como el _handler_ que hace las veces de método del controlador para cada ruta. Además, en lugar de preparar y devolver una vista, devolveremos simplemente la salida por defecto de Hapi que es de formato _JSON_.

Luego de tener definidas todas las rutas, los _handlers_ con los parámetros esperados, las validaciones con Joi y las salidas de posibles errores con Boom, estamos listos para requerir y registrar nuestro _plugin_ en el _script_ principal de nuestra aplicación.

Adicionalmente, modificaremos la función `fileNotFound(...)` en el controlador de sitio para evitar que los errores `404` de nuestra API, se visualicen a través de la vista y en cambio lo hagan con _JSON_ que es la salida por defecto.

### Estrategías de autenticación - Asegurando el API REST

Con el objeto de restringir el acceso a nuestra API para que solo los usuarios registrados en nuestra base de datos puedan hacer usa de ella, implementaremos una estrategia de autenticación básica de Hapi, para lo cual será necesario instalar un módulo adicional llamado `hapi-auth-basic`.

Una vez instalado, requerido y registrado el módulo `hapi-auth-basic` en el _script_ de nuestro _plugin_ de API REST, debemos implementarlo de la siguiente manera:

```js
server.auth.strategy("simple", "basic", { validate: validateAuth });
```

Donde `simple` es el nombre de la estrategia de autenticación, `basic` es el tipo (asociado al módulo que instalamos) y `validateAuth` es el método en el que definiremos la lógica de validación de los usuarios. Este último de forma muy similar a como lo hicimos antes en el método _validate_ del modelo `users` en nuestra aplicación.

De esta manera, cuando se intente acceder a cualquiera de las rutas definidas para nuestra API REST, el navegador solicitará los datos de autenticación `usuario` y `password` y solo devolverá resultados útiles cuando las credenciales obtenidas de la autenticación sean válidas.

### Seguridad básica - Asegurando el servidor contra CSRF

Una de las vulnerabilidades más comunes en cualquier servidor o sitio web, es la Falsificación de Petición en Sitios Cruzados o **CSRF** por sus sigles del inglés Cross-site request forgery, que es un tipo de ataque en el que son transmitidos comandos no autorizados por un usuario del sitio web en el que deberíamos confiar.

Para atender y corregir esta vulnerabilidad incorporaremos a nuestro proyecto un módulo adicional de Hapi llamado **crumb** que utiliza un _token_ de validación para cada una de las rutas accedidas por los usuarios.

**Implementación**

Una vez instalado con `npm i crumb -S` procedemos a registrarlo en el scrip principal, de la misma manera que hemos hecho antes con _good_.

```
const crumb = require('crumb')
...

await server.register({
  'plugin': crumb,
  'options': {
    'cookieOptions': {
      'isSecure': process.env.NODE_ENV === 'prod'
    }
  }
})
...

```

**Crumb** utiliza una cookie para realizar la validación del _token_ en cada una de las rutas de nuestra aplicación y la contrasta con el valor de un _input_ de tipo _hidden_ y de nombre **crumb**, que debe estar presente en cada una de las vistas.

La propiedad `isSecure` estaría entonces activa (en _true_) cuando estemos en el entorno de producción e inactiva (en _false_) mientras estemos en el entorno de desarrollo. Cuando no está presente el _input_ de validación o su valor no es el correcto, el servidor devuelve un código de error `403` al browser, indicando que el acceso está prohibido o no está autorizado.

### Seguridad básica - Asegurando el servidor contra XSS

Otra de las vulnerabilidades que es muy común es **XSS** o Cross-site scripting, que es un tipo de ataque de seguridad por inyección en el que un atacante inyecta datos o algún _script_ o códio malicioso desde otro sitio web diferente.

Para manejar y corregir esta vulnerabilidad en la seguridad de nuestra aplicación implementaremos la estrategia de **CSP** o Content Security Policy para definir específicamente los orígenes desde los cuales vamos a permitir la ejecución de _scripts_ o el acceso a recursos desde y hacia nuestra aplicación. Para esto usaremos un par de _plugins_ adicionales: **Blankie** y **scooter** (scooter por ser dependencia de blankie).

Instalamos ambos desde la terminal: `npm i blankie scooter -S` y requerimos ambos en nuestro _script principal_.

Al igual que los _plugins_ anteriores, registramos **blankie** con las siguientes opciones:

```py
await server.register ([ scooter, {
  'plugin': blankie,
  'options': {
    'defaultSrc': `'self' 'unself-inline' <urls adicionales>`,
    'styleSrc': `'self' 'unself-inline' <urls adicionales>`,
    'fontSrc': `'self' 'unself-inline' <urls adicionales>`,
    'scriptSrc': `'self' 'unself-inline' <urls adicionales>`,
    'generateNonces': false
  }
}])

```

Finalmente, al acceder a nuestra aplicación, notaremos que sólo serán permitidos los _scripts_ y _recursos_ que provengan desde las fuentes explícitamente definidas en las opciones indicadas al registrar el plugin, de lo contrario simplemente no se cargarán.

_Si quieres aprender más sobre temas de Seguridad en la web, te invito a ver luego el [Curso de Análisis de Vulnerabilidades Web con OWASP](https://platzi.com/cursos/seguridad/)._

### Depuración del proyecto

Para depurar el código del proyecto solo hace falta iniciar el servidor de `node` con la siguiente instrucción:

```
node --inspect index.js

```

Se lanzará el servidor como de costumbre, pero adicionalmente se creará un servidor para la interfaz de depuración que podemos acceder desde el navegador _Google Chrome_.

Específicamente se podrá ver un icono de NodeJS al inicio de la barra de menú del _Inspector de elementos_, y al hacer clic sobre este, se abrirá una consola de _DevTools_ dedicada para la depuración de Node. Agregamos luego el proyecto al _workspace_ y estamos listos para iniciar la depuración.

Una alternativa a las DevTools de _Google Chrome_ es la funcuionalidad de depuración que viene integrada con el editor de _Microsoft_ VisualStudio Code. Esta funcionalidad está representada por un ícono particular en la barra de herramientas que asemeja un _bug_ con un círculo tachado. Al hacer clic sobre este icono, se habilita el panel con las opciones de configuración y ejecución de la depuración. Luego en la terminal integrada del editor se puede ver la consola de depuración.

En ambas herramientas es posible establecer _breakpoints_, _run_ paso a paso, inspección de variables y otras funciones de depuración.

Una tercera alternativa es mediante la implementación del módulo **hapi-dev-errors** dentro del propio código de la aplicación. Este módulo se instala, requiere y registra de la misma manera que Good y los otros módulos que hemos visto, pero en las opciones de registro indicaremos la propiedad: `showErrors`, a la que asignaremos un valor buleano de acuerdo con la variable de entorno `process.env.NODE_ENV` para asegurarnos de que los mensajes de depuración solo sean visibles en el entorno de desarrollo, no en producción. Con este módulo, los errores serán capturados y mostrados directamente en el navegador de una forma amigable y con algunos detalles para su depuración.

### Ecosistema de Hapi

En el sitio web de Hapi, hay una sección llamada Plugins en la que están organizados una gran cantidad de complementos según su funcionalidad de los cuales te menciono algunos que conozco y que pudieran serte de utilidad:

- **Hapi pal**: permite hacer un _scafolding_ (o estructura de archivos base) de la cual partir en el desarrollo de tus proyectos.
- **Apollo server**: permite crear una API de _GraphQL_
- **Bell**: para el manejo simplificado de autenticación con redes sociales, Slack, Github, Dropbox, DigitalOcean, y muchos más.
- **Lab**: permite hacer _tests_ del proyecto.
- **Lout**: es un generador de documentación para Hapi.
- **Hapi Swagger**: permite generar documentación de APIs compatible con _OpenAPI_.

Te invito a completar tu proyecto y compertirlo con tus compañeros para intercambiar experiencias.  
Recuerda que puedes dejarme tus comentarios, dudas y sugerencias en la sección de deiscusiones, o contactarme a través de mis redes sociales para cualquier consulta sobre cualquiera de los temas aprendidos en este curso.

¡Felicidades!  
De esta manera hemos llegado al final del curso de Hapi, ya puedes seguir adelante y tomar el examen.
