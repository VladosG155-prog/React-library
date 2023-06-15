import * as yup from 'yup';

export const profileEditSchema = yup.object({
  login: yup
    .string()
    .matches(/^[A-Za-z0-9]+$/g, 'латинский алфавит')
    .matches(/[0-9]/g, 'цифры')
    .required('Поле не может быть пустым'),
  password: yup
    .string()

    .min(8, 'не менее 8 символов')
    .matches(/^(?=.*[A-Z])/, 'заглавной буквой')
    .matches(/[0-9]/g, 'цифрой')
    .required('Поле не может быть пустым'),
  firstName: yup.string().min(3).required('Поле не может быть пустым'),
  lastName: yup.string().min(3).required('Поле не может быть пустым'),
  phone: yup
    .string()
    .matches(/^\+375(\s+)?\(?(25|29|33|44)\)?(\s+)?[0-9]{3}-[0-9]{2}-[0-9]{2}$/, 'В формате +375 (xx) xxx-xx-xx'),
  email: yup
    .string()
    .matches(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Введите корректный e-mail')
    .required('Поле не может быть пустым'),
});

export const registerSchema = yup.object({
  username: yup
    .string()
    .matches(/^[A-Za-z0-9]+$/g, 'латинский алфавит')
    .matches(/[0-9]/g, 'цифры')
    .required('Поле не может быть пустым'),
  password: yup
    .string()

    .min(8, 'не менее 8 символов')
    .matches(/^(?=.*[A-Z])/, 'заглавной буквой')
    .matches(/[0-9]/g, 'цифрой')
    .required(),
  firstName: yup.string().min(3).required('Поле не может быть пустым'),
  lastName: yup.string().min(3).required('Поле не может быть пустым'),
  phone: yup
    .string()
    .matches(/^\+375(\s+)?\(?(25|29|33|44)\)?(\s+)?[0-9]{3}-[0-9]{2}-[0-9]{2}$/, 'В формате +375 (xx) xxx-xx-xx'),
  email: yup.string().matches(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Введите корректный e-mail'),
});

export const forgotPassFirstScheme = yup.object({
  email: yup.string().matches(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g, 'Введите корректный e-mail'),
});

export const forgotPassSecondScheme = yup.object({
  password: yup
    .string()

    .min(8, 'не менее 8 символов')
    .matches(/^(?=.*[A-Z])/, 'заглавной буквой')
    .matches(/[0-9]/g, 'цифрой')
    .required(),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], 'Пароли не совпадают'),
});
