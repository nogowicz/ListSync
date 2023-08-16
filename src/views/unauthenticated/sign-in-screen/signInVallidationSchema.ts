import { IntlShape } from 'react-intl';
import { object, string } from 'yup';

export const schema = (intl: IntlShape) =>
  object({
    email: string()
      .email(
        intl.formatMessage({
          id: 'views.unauthenticated.error.email-invalid',
          defaultMessage: 'Email is not valid',
        }),
      )
      .required(
        intl.formatMessage({
          id: 'views.unauthenticated.error.email-required',
          defaultMessage: 'Please provide your email',
        }),
      ),
    password: string()
      .min(
        6,
        intl.formatMessage({
          id: 'views.unauthenticated.error.password.too-short',
          defaultMessage: 'Password must be at least 6 characters',
        }),
      )
      .required(
        intl.formatMessage({
          id: 'views.unauthenticated.error.password-required',
          defaultMessage: 'Please provide your password',
        }),
      ),
  }).required();
