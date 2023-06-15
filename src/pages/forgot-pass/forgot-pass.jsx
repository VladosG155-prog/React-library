import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../../components/button/button';
import { TextField } from '../../components/text-field/text-field';

import styles from './forgot-pass.module.scss';
import { useRecoverPassMutation, useResetPassMutation } from '../../store/api/auth-api';
import { Loader } from '../../components/loader/loader';
import { Icon } from '../../components/icon/icon';
import { AuthWrapper } from '../../components/auth-wrapper/auth-wrapper';
import { forgotPassFirstScheme, forgotPassSecondScheme } from '../../settings/validation-schemes';

export const ForgotPass = () => {
  const {
    handleSubmit,
    control,
    formState: { errors: errors1 },
  } = useForm({
    resolver: yupResolver(forgotPassFirstScheme),
    defaultValues: {
      email: '',
    },
    criteriaMode: 'all',
    mode: 'all',
  });
  const {
    handleSubmit: handleSumbitSecond,
    control: controlSecond,
    formState: { errors: errors2 },
  } = useForm({
    resolver: yupResolver(forgotPassSecondScheme),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
    criteriaMode: 'all',
    mode: 'all',
  });

  const [sendMail, response] = useRecoverPassMutation();
  const [isMessageSended, setIsMessageSended] = useState(false);
  const [isChangedPass, setIsChangedPass] = useState(false);
  const [changedError, setChangedError] = useState(false);
  const [sendNewPass, responsePass] = useResetPassMutation();

  const [isBluredConfirmation, setIsBluredConfirmation] = useState(false);

  const { search } = useLocation();
  const navigate = useNavigate();

  if (localStorage.getItem('jwt')) {
    return <Navigate to='/books/all' />;
  }

  const onSubmitMail = async (data) => {
    const res = await sendMail(data);

    setIsMessageSended(true);
  };

  const onSubmitPass = async (data) => {
    const searchCode = search.replace('?code=', '');
    const res = await sendNewPass({ ...data, code: searchCode });
    setIsChangedPass(true);
    if (res.error) {
      setChangedError(true);
    } else {
      setChangedError(false);
    }
  };

  return (
    <div className={styles.root}>
      {response.isLoading && <Loader />}
      <h3>Cleverland</h3>

      {!search ? (
        <div>
          {isMessageSended ? (
            <AuthWrapper>
              <div data-test-id='status-block' className={styles.modalWrap}>
                <h4>Письмо выслано</h4>
                <p style={{ color: 'rgb(244, 44, 79)' }} data-test-id='hint'>
                  error
                </p>
                <p>Перейдите в вашу почту, чтобы воспользоваться подсказками по восстановлению пароля</p>
              </div>
            </AuthWrapper>
          ) : (
            <AuthWrapper dataTest='auth'>
              {!search && (
                <Link to='/auth' className={styles.header}>
                  <Icon name='arrowLeft' />
                  вход в личный кабинет
                </Link>
              )}

              <h4 style={search ? { marginTop: '0px' } : { marginTop: '60px' }}>Восстановление пароля</h4>
              <form data-test-id='send-email-form'>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder='Email'
                      description={
                        errors1.email
                          ? 'Введите корректный e-mail'
                          : 'На это email  будет отправлено письмо с инструкциями по восстановлению пароля'
                      }
                      name='email'
                      ref={null}
                      control={control}
                    />
                  )}
                />

                <Button btnType='main' onClick={handleSubmit(onSubmitMail)} fullwidth={true} height='52px'>
                  восстановить
                </Button>
              </form>

              <div className={styles.ref}>
                Нет учётной записи?
                <Link to='/registration'>
                  регистрация <Icon name='arrowRight' />
                </Link>
              </div>
            </AuthWrapper>
          )}
        </div>
      ) : (
        <div>
          {responsePass.isLoading && <Loader />}
          {isChangedPass ? (
            <AuthWrapper dataTest='auth'>
              {changedError ? (
                <div data-test-id='status-block' className={styles.modalWrap}>
                  <h4>Данные не сохранились</h4>
                  <p>Что-то пошло не так. Попробуйте ещё раз</p>
                  <Button btnType='main' fullwidth={true} height='52px' onClick={handleSumbitSecond(onSubmitPass)}>
                    повторить
                  </Button>
                </div>
              ) : (
                <div data-test-id='status-block' className={styles.modalWrap}>
                  <h4>Новые данные сохранены</h4>
                  <p>Зайдите в личный кабинет, используя свои логин и новый пароль</p>
                  <Button btnType='main' fullwidth={true} height='52px' onClick={() => navigate('/auth')}>
                    вход
                  </Button>
                </div>
              )}
            </AuthWrapper>
          ) : (
            <AuthWrapper dataTest='auth'>
              <h4>Восстановление пароля</h4>

              <form data-test-id='reset-password-form'>
                <Controller
                  name='password'
                  control={controlSecond}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      ref={null}
                      placeholder='Новый пароль'
                      name='password'
                      type='password'
                      control={controlSecond}
                      description={`Пароль <span className=${styles.unhinted}>не менее 8 символов</span>, с <span className=${styles.unhinted}>заглавной буквой</span> и <span className=${styles.unhinted}>цифрой</span>`}
                    />
                  )}
                />
                <Controller
                  name='passwordConfirmation'
                  control={controlSecond}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      onBlurP={() => setIsBluredConfirmation(true)}
                      onFocusP={() => setIsBluredConfirmation(false)}
                      ref={null}
                      placeholder='Повторите пароль'
                      name='passwordConfirmation'
                      type='password'
                      control={controlSecond}
                    />
                  )}
                />
                {errors2.passwordConfirmation && isBluredConfirmation && (
                  <h2 data-test-id='hint' className={styles.hint}>
                    Пароли не совпадают
                  </h2>
                )}
                <Button
                  btnType='main'
                  disabled={errors2.passwordConfirmation && isBluredConfirmation}
                  onClick={handleSumbitSecond(onSubmitPass)}
                  fullwidth={true}
                  height='52px'
                >
                  сохранить изменения
                </Button>
              </form>

              <div className={styles.ref}>После сохранения войдите в библиотеку, используя новый пароль</div>
            </AuthWrapper>
          )}
        </div>
      )}
    </div>
  );
};
