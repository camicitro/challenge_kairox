# challenge_kairox
# API de Gestión de Afiliados

## Descripción del Proyecto

Este proyecto consiste en una API REST desarrollada con Node.js y TypeScript para gestionar el procesamiento de archivos de los pagos de afiliados. El objetivo principal es manejar la información de los pagos mensuales realizados por los afiliados, detectar aquellos que han dejado de pagar por 3 meses consecutivos y notificarles vía correo electrónico, además de proceder a su baja.

## Características Principales

- *Carga de Archivos:* Endpoint para la carga y procesamiento de archivos de texto que contienen información sobre los pagos de los afiliados. 
- *Procesamiento de Pagos:* Servicio que marca como "pagado" el mes correspondiente para los afiliados presentes en el archivo, y como "impago" para aquellos que no aparezcan.
- *Notificación por Correo:* Funcionalidad para detectar a los afiliados que han dejado de aparecer en el archivo durante 3 meses consecutivos y notificarles mediante un correo electrónico, indicando que se procederá a su baja, luego darlos de baja.
- *Evitar Duplicados:* El sistema debe asegurar que un archivo no sea procesado más de una vez, independientemente del orden en que se carguen los archivos.
- *Consulta del Estado de Cuenta (Bonus):* Endpoint que permite consultar el estado de cuenta de un afiliado, mostrando los meses pagados y no pagados.
- *Filtrado de Afiliados con Deuda Prolongada (Bonus):* Endpoint para filtrar a los afiliados con más de 3 meses consecutivos de deuda, indicando los meses específicos con deuda.