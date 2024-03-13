import nodemailer from 'nodemailer'

const registerEmail = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    
    const {email, name, token} = data  
    
    await transport.sendMail({
        from: "BienesRaices.com",
        to: email,
        subject: "Confirma tu Cuenta en Bienesraices.com",
        text: "Confirma tu Cuenta en Bienesraices.com",
        html: `
            <p>Hola ${name}, confirma tu cuenta en BienesRaices.com</p>
            
            <p>Tu cuenta ya esta lista, solo debes confirmar tu correo en el siguiente enlace: 
            <a href='${process.env.BACKEND_URL}:${process.env.PORT || 3000}/auth/confirm/${token}'>Confirmar Cuenta</a> </p>
            
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>`
    })
}

const changePassEmail = async (data) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  
  const {email, name, token} = data  
  
  await transport.sendMail({
      from: "BienesRaices.com",
      to: email,
      subject: "Recupera el Acceso a tu cuenta en Bienesraices.com",
      text: "Recupera el Acceso a tu cuenta",
      html: `
          <p>Hola ${name} al parecer haz olvidado tu contraseña de acceso, sigue las instrucciones para recuperarla.</p>
          
          <p>Haz Click en el siguiente enlace y llena el formulario para recupera el acceso a tu cuenta: 
          <a href='${process.env.BACKEND_URL}:${process.env.PORT || 3000}/auth/pass-recover/${token}'>Cambiar Contraseñá</a> </p>
          
          <p>Si tu no solicitaste esta acción puedes ignorar el mensaje</p>`
  })
}



export {
    registerEmail,
    changePassEmail
}