Guía para abrir y configurar el proyecto:

- Abrir el proyecto en Visual Studio Code

- Instalar las dependencias del proyecto:
   
   Abrir la terminal integrada (Ctrl + ` o desde Terminal > Nueva Terminal).

   Ejecutar el siguiente comando:

   "npm install"

   Esto descargará e instalará todas las dependencias definidas en 
   el archivo package.json, necesarias para que la aplicación funcione 
   correctamente.


- Configurar variables de entorno:
  
  Dentro de la raíz del proyecto, localizar el archivo .env. 

  Modificar el valor de la variable de conexión a la base de datos:


  "DATABASE=mongodb+srv://<usuario>:<contraseña>@cluster0.xxx.mongodb.net/proyectservices"

  Reemplazar <usuario>, <contraseña> y el resto de la URL con los datos de acceso de su 
  propia cuenta de MongoDB Atlas.
  Este paso es indispensable para que el backend de la aplicación se conecte correctamente
  a la base de datos.


El proyecto está listo para ejecutarse

 Una vez completados estos pasos, el entorno estará configurado correctamente para desarrollo o evaluación. 
 Desde la terminal se puede iniciar el servidor con:

  "npm run dev"

