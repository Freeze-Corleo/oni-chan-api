class Mail {
    private sgMail = require('@sendgrid/mail')
    private emailFrom = 'delponleo@gmail.com';

    constructor(){
        this.sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    /**
     * Send email using sendgrid
     * @param {{ [key: string]: string | string }} message {to, subject, text}
     * @returns {any} sgMail.send
     */
    public sendEmail(msg: { [key: string]: string | string }): any{
        msg['from'] = this.emailFrom;

        return this.sgMail.send(msg).then((response)=>{
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        }).catch((error)=>{
            console.error(error);
        });
    }
}

export default new Mail; 