import React from 'react';
import Container from 'components/UI/Container/Container';
import Heading from 'components/UI/Heading/Heading';
import PageWrapper from './Privacy.style';

export default function Privacy() {
  return (
    <PageWrapper>
      <Container>
        <Heading as="h2" content="Políticas de privacidad" />
        <p>
          <strong>Última actualización:</strong> 26 de octubre de 2023
        </p>
        <p>
          Bienvenido a la aplicación APP Colombia Accesible, un servicio en
          línea que facilita la búsqueda de lugares públicos accesibles para
          personas con discapacidad y la identificación de barreras arquitectónicas en la ciudad de Bogotá, Colombia.
          En la APP Colombia Accesible, valoramos y respetamos tu privacidad, y estamos
          comprometidos a proteger tus datos personales. Esta Política de Privacidad
          explica cómo recopilamos, utilizamos y protegemos la información que
          recopilamos de nuestros usuarios.
        </p>
        <Heading as="h2" content="Información que Recopilamos" />
        <p>
          <strong>1. Datos de Usuario:</strong> Cuando te registras en este sitio web, recopilamos información personal que
          puede incluir tu nombre, dirección de correo electrónico, contraseña, fecha
          de nacimiento, discapacidad (opcional) y sexo. Esta información es necesaria
          para crear y gestionar tu cuenta.
        </p>
        <p>
          <strong>2. Datos de Establecimientos Públicos:</strong> Los usuarios pueden proporcionar información sobre lugares públicos accesibles,
          incluyendo el nombre del establecimiento, dirección, información de contacto,
          horarios y otros detalles relevantes. Esta información se utiliza para crear
          una base de datos de lugares accesibles.
        </p>
        <p>
          <strong>3. Datos sobre Elementos Inclusivos y Barreras Arquitectónicas:</strong> Los usuarios pueden registrar elementos inclusivos, como rampas y ascensores,
          y también reportar barreras arquitectónicas, como puentes dañados o andenes
          intransitables. Estos datos se utilizan para mejorar la accesibilidad y la
          información compartida en la aplicación.
        </p>
        <p>
          <strong>4. Opiniones de Usuarios:</strong> Los usuarios pueden proporcionar opiniones y comentarios sobre los lugares y
          elementos inclusivos que han visitado. Estas opiniones pueden ser vistas por
          otros usuarios y contribuyen a la comunidad de este sitio web.
        </p>
        <Heading as="h2" content="Uso de la Información" />
        <p>Utilizamos la información recopilada de las siguientes maneras:</p>
        <ol>
          <li>• Para proporcionarte acceso y gestionar tu cuenta en este sitio web.</li>
          <li>• Para permitir la búsqueda y visualización de lugares accesibles y barreras arquitectónicas.</li>
          <li>• Para mejorar la calidad y la precisión de la información en la aplicación.</li>
          <li>• Para permitir a los usuarios compartir opiniones y experiencias.</li>
          <li>• Para fines de administración, seguridad y cumplimiento de nuestras políticas.</li>
        </ol>
        <Heading as="h2" content="Compartir Información" />
        <ol>
          <li>• La información sobre lugares públicos accesibles y barreras arquitectónicas se comparte públicamente en este sitio web.</li>
          <li>• La información de usuario no se comparte con terceros, excepto con fines de administración y seguridad, y para cumplir con las regulaciones legales aplicables.</li>
          <li>• Para mejorar la calidad y la precisión de la información en la aplicación.</li>
          <li>• Para permitir a los usuarios compartir opiniones y experiencias.</li>
          <li>• Para fines de administración, seguridad y cumplimiento de nuestras políticas.</li>
        </ol>
        <Heading as="h2" content="Gestión de la Información" />
        <ol>
          <li>• Los usuarios pueden gestionar y actualizar su información de perfil en este sitio web.</li>
          <li>• Los usuarios administradores pueden gestionar y validar la información de lugares públicos accesibles y barreras arquitectónicas.</li>
        </ol>
        <Heading as="h2" content="Seguridad de los Datos" />
        <ol>
          <li>• Implementamos medidas de seguridad para proteger la información contra el acceso no autorizado y el uso indebido.</li>
        </ol>
        <Heading as="h2" content="Cambios en la Política de Privacidad" />
        <p>
          Nos reservamos el derecho de modificar o actualizar esta política de
          privacidad en cualquier momento. Cualquier cambio se publicará en
          esta página con una fecha de "última actualización" revisada. Te
          recomendamos que revises esta política periódicamente para estar al
          tanto de cualquier cambio.
        </p>
        <Heading as="h2" content="Preguntas y contacto" />
        <p>
          Si tienes alguna pregunta o comentario sobre nuestra política de privacidad,
          no dudes en contactarnos a través de <strong>appcolombiaaccesible@gmail.com</strong> o <strong>direccion@funservir.org</strong>.
        </p>
      </Container>
    </PageWrapper>
  );
}
