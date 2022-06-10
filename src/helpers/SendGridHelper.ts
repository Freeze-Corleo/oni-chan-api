import Locals from '../providers/Local';
import Log from '../middlewares/Log';

/**
 *
 * @author Pierre FORQUES <pierre.forques@viacesi.fr>
 */
class Mail {
    private sgMail = require('@sendgrid/mail');
    private emailFrom = 'estebanlcn@outlook.fr';
    private emailDest = '';

    constructor() {
        this.sgMail.setApiKey(Locals.config().sendGridKey);
    }

    /**
     *
     * @param email
     * @param metaDatas
     * @param templateId
     */
    public sendEmail(email, metaDatas, templateId): void {
        this.emailDest = email;

        const msg = {
            to: this.emailDest,
            from: this.emailFrom,
            templateId: templateId,
            dynamic_template_data: metaDatas
        };
        console.log(msg);
        this.sgMail
            .send(msg)
            .then(() => {
                Log.info('SENDGRID :: mail sent');
            })
            .catch((error) => {
                Log.error(`SENDGRID :: error while sending email: ${error}`);
            });
    }
}

export default new Mail();
