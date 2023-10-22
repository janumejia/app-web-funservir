import React from 'react';
import Container from 'components/UI/Container/Container';
import Heading from 'components/UI/Heading/Heading';
import PageWrapper from './Privacy.style';

export default function Privacy() {
  return (
    <PageWrapper>
      <Container>
        <Heading as="h2" content="Política de Cookies" />
        <p>
          <strong>Última actualización:</strong> 26 de octubre de 2023
        </p>
        <p>
          Esta política de cookies explica cómo el sitio web utiliza cookies y
          tecnologías similares cuando visitas nuestro sitio web. Al utilizar
          nuestro sitio web, aceptas el uso de cookies de acuerdo con esta política.
          Si no estás de acuerdo con el uso de cookies, te recomendamos que
          ajustes la configuración de tu navegador o que dejes de utilizar
          nuestro sitio web.
        </p>
        <Heading as="h2" content="¿Qué son las cookies?" />
        <p>
          Las cookies son pequeños archivos de texto que se almacenan en tu
          dispositivo cuando visitas un sitio web. Estos archivos contienen
          información que se utiliza para mejorar la experiencia del usuario,
          como recordar tus preferencias y mantener tu sesión activa.
        </p>
        <Heading as="h2" content="¿Qué tipos de cookies utilizamos?" />
        <p>
          En este sitio web utilizamos cookies de sesión. Estas cookies son
          temporales y se eliminan de tu dispositivo una vez que cierras tu
          navegador. Su único propósito es mantener tu sesión activa mientras
          estás en nuestro sitio web y facilitar el acceso a tu cuenta si has
          iniciado sesión.
        </p>
        <Heading as="h2" content="¿Cómo puedes gestionar las cookies?" />
        <p>
          Puedes configurar tu navegador para que acepte, rechace o elimine
          cookies. Ten en cuenta que la desactivación de las cookies puede
          afectar la funcionalidad de nuestro sitio web y, en particular,
          la capacidad de mantener tu sesión activa. Consulta la sección de
          ayuda de tu navegador para obtener instrucciones sobre cómo gestionar
          las cookies.
        </p>
        <Heading as="h2" content="Cambios en nuestra política de cookies" />
        <p>
          Nos reservamos el derecho de modificar o actualizar esta política de
          cookies en cualquier momento. Cualquier cambio se publicará en esta
          página con una fecha de "última actualización" revisada. Te recomendamos
          que revises esta política periódicamente para estar al tanto de
          cualquier cambio en el uso de cookies en el sitio web.
        </p>
        <Heading as="h2" content="Preguntas y contacto" />
        <p>
          Si tienes alguna pregunta o comentario sobre nuestra política de cookies, 
          no dudes en contactarnos a través de <strong>appcolombiaaccesible@gmail.com</strong> o <strong>direccion@funservir.org</strong>.
        </p>
      </Container>
    </PageWrapper>
  );
}
