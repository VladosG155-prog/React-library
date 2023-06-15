import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../../components/button/button';
import { TextField } from '../../components/text-field/text-field';
import styles from './register-page.module.scss';
import { useRegisterMutation } from '../../store/api/auth-api';
import { Loader } from '../../components/loader/loader';
import { Icon } from '../../components/icon/icon';
import { AuthWrapper } from '../../components/auth-wrapper/auth-wrapper';
import { registerSchema } from '../../settings/validation-schemes';

export const RegisterPage = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
    },
    criteriaMode: 'all',
    mode: 'all',
  });

  const [registerUser, response] = useRegisterMutation();

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [respStatus, setRespStatus] = useState(0);

  if (localStorage.getItem('jwt')) {
    return <Navigate to='/books/all' />;
  }

  const onSubmit = async (data) => {
    const res = await registerUser(data);
    if (!res.error) {
      setRespStatus(201);
    } else {
      setRespStatus(res.error.status);
    }
  };

  const backToRegistration = () => {
    setStep(1);
    setRespStatus(0);
    reset();
  };

  return (
    <div className={styles.root}>
      <h3>Cleverland</h3>
      {response.isLoading && <Loader />}
      {respStatus === 400 && (
        <AuthWrapper>
          <div data-test-id='status-block' className={styles.modalWrap}>
            <h4>Данные не сохранились</h4>
            <p>
              Такой логин или e-mail уже записан в системе. Попробуйте зарегистрироваться по другому логину или e-mail.
            </p>
            <Button btnType='main' fullwidth={true} onClick={backToRegistration} height='52px'>
              назад к регистрации
            </Button>
          </div>
        </AuthWrapper>
      )}
      {respStatus !== 400 && respStatus !== 0 && respStatus !== 201 && (
        <AuthWrapper>
          <div data-test-id='status-block' className={styles.modalWrap}>
            <h4>Данные не сохранились</h4>
            <p>Что-то пошло не так и ваша регистрация не завершилась. Попробуйте ещё раз</p>
            <Button btnType='main' fullwidth={true} onClick={handleSubmit(onSubmit)} height='52px'>
              повторить
            </Button>
          </div>
        </AuthWrapper>
      )}
      {respStatus === 201 && (
        <AuthWrapper>
          <div data-test-id='status-block' className={styles.modalWrap}>
            <h4>Регистрация успешна</h4>
            <p>Регистрация прошла успешно. Зайдите в личный кабинет, используя свои логин и пароль</p>
            <Button btnType='main' fullwidth={true} onClick={() => navigate('/auth')} height='52px'>
              вход
            </Button>
          </div>
        </AuthWrapper>
      )}

      {respStatus === 0 && (
        <AuthWrapper dataTest='auth'>
          <h4>Регистрация</h4>
          <p>шаг {step} из 3</p>

          <form data-test-id='register-form'>
            {step === 1 && (
              <>
                <Controller
                  name='username'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder='Придумайте логин для входа'
                      name='username'
                      ref={null}
                      control={control}
                      description={`Используйте для логина <span className=${styles.unhinted}>латинский алфавит</span> и <span className=${styles.unhinted}>цифры</span>`}
                    />
                  )}
                />
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      ref={null}
                      placeholder='Пароль'
                      name='password'
                      type='password'
                      control={control}
                      description={`Пароль <span className=${styles.unhinted}>не менее 8 символов</span>, с <span className=${styles.unhinted}>заглавной буквой</span> и <span className=${styles.unhinted}>цифрой</span>`}
                    />
                  )}
                />
                <Button
                  btnType='main'
                  disabled={errors.password || errors.username}
                  onClick={async () => {
                    const resp = await trigger(['username', 'password']);
                    if (resp) {
                      setStep((prev) => prev + 1);
                    }
                  }}
                  fullwidth={true}
                  height='52px'
                >
                  следующий шаг
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <Controller
                  name='firstName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder='Имя'
                      description={errors.firstName && 'Поле не может быть пустым'}
                      name='firstName'
                      ref={null}
                      control={control}
                    />
                  )}
                />
                <Controller
                  name='lastName'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      ref={null}
                      placeholder='Фамилия'
                      description={errors.lastName && 'Поле не может быть пустым'}
                      name='lastName'
                      control={control}
                    />
                  )}
                />
                <Button
                  onClick={async () => {
                    const resp = await trigger(['firstName', 'lastName']);
                    if (resp) {
                      setStep((prev) => prev + 1);
                    }
                  }}
                  btnType='main'
                  disabled={errors.firstName || errors.lastName}
                  fullwidth={true}
                  height='52px'
                >
                  последний шаг
                </Button>
              </>
            )}
            {step === 3 && (
              <>
                <Controller
                  name='phone'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      ref={null}
                      placeholder='Номер телефона'
                      description='В формате +375 (xx) xxx-xx-xx'
                      name='phone'
                      control={control}
                    />
                  )}
                />
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      ref={null}
                      placeholder='E-mail'
                      description={errors.email && 'Введите корректный e-mail'}
                      name='email'
                      control={control}
                    />
                  )}
                />
                <Button
                  btnType='main'
                  disabled={errors.phone || errors.email}
                  onClick={async () => {
                    const resp = await trigger(['tel', 'email']);
                    if (resp) {
                      handleSubmit(onSubmit)();
                    }
                  }}
                  fullwidth={true}
                  height='52px'
                >
                  зарегистрироваться
                </Button>
              </>
            )}
          </form>

          <div className={styles.ref}>
            Есть учётная запись?
            <Link to='/auth'>
              войти <Icon name='arrowRight' />
            </Link>
          </div>
        </AuthWrapper>
      )}
    </div>
  );
};
