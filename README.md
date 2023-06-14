# Orbil_App_Movil

### Este proyecto es un App Movil creado con [Ionic 6](https://ionicframework.com/docs/v6/) y [Angular](https://angular.io/)

  La intención de este proyecto fue sistematizar el proceso de prestamos e inventariado de la biblioteca de la institución,
  siendo este unicamente la parte del cliente donde el tendra acceso a los diferetes elementos de la biblioteca y donde
  la encargada podra llevar un proceso mas facil de lo que se realiza actualmente.

### Configuración para admición del Servidor

```java
  <manifest-android
  android:screenOrientation="portrait"
  android:networkSecurityConfig="@xml/netwok_security_config">

  <?xml version="1.0" encoding="utf-8" ?>
  <network-security-config>
    <base-config cleartextTrafficPermitted="true">
      <trust-anchors>
        <certificates src="system"/>
      </trust-anchors>
    </base-config>
  </network-security-config>
```

### Respuesta estandar el ApiRest

  Aqui un ejemplo de la respuesta estandar que responde el servidor al realizar algún tipo de petición

```javascript

  response = {
    confirm: true | false,
    msj: "Mensaje de ejemplo de respuesta del servidor"
    datos: []
  }

```
