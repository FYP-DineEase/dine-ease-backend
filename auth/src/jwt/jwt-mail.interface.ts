import { EmailTokenTypes } from 'src/utils/enums/email-token.enum';

export interface EmailTokenPayload {
  email: string;
  tokenType: EmailTokenTypes;
  expiresIn: string;
}
