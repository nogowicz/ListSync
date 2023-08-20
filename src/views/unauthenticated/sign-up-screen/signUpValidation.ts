import { object, string, ref } from 'yup';

const nameRegex =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

export const schema = object({
  firstName: string()
    .max(25, 'Your first name is too long')
    .matches(nameRegex, 'Please enter valid first name')
    .required('Please provide your first name'),
  lastName: string()
    .max(25, 'Your last name is too long')
    .matches(nameRegex, 'Please enter valid last name')
    .required('Please provide your last name'),
  email: string()
    .email('Email is not valid')
    .required('Please provide your email'),
  password: string()
    .min(6, 'Password must be at least 6 characters')
    .required('Please provide your password'),
  confirmPassword: string()
    .min(6, 'Password must be at least 6 characters')
    .oneOf([ref('password')], 'Password must match')
    .required('Password must match'),
}).required();
