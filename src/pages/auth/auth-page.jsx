import { Controller, useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Button } from '../../components/button/button';
import { TextField } from '../../components/text-field/text-field';
import { setUser } from '../../store/slices/global-slice';
import styles from './auth-page.module.scss';
import { useLoginMutation } from '../../store/api/auth-api';
import { Loader } from '../../components/loader/loader';
import { Icon } from '../../components/icon/icon';
import { AuthWrapper } from '../../components/auth-wrapper/auth-wrapper';

export const AuthPage = () => {
  const {
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      identifier: '',
      password: '',
    },
    criteriaMode: 'all',
    mode: 'all',
  });

  const [loginUser, response] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { identifier, password } = watch();
  useEffect(() => {
    if (errors && !response.isLoading) {
      clearErrors('root.serverError');
    }
  }, [identifier, password, errors, clearErrors, response.isLoading]);

  if (localStorage.getItem('jwt')) {
    return <Navigate to='/books/all' />;
  }

  const onSubmit = async (data) => {
    const res = await loginUser(data);
    if (res.error) {
      setError('root.serverError', {
        type: res.error.status,
      });
    } else {
      if (res.data && res.data.jwt) {
        localStorage.setItem('jwt', res.data.jwt);
        dispatch(setUser({ ...res.data.user, token: res.data.jwt }));
      }

      if (localStorage.getItem('jwt')) {
        navigate('/books/all');
      }
    }
  };
  return (
    <div className={styles.root}>
      {response.isLoading && <Loader />}
      <h3>Cleverland</h3>
      {errors.root && errors.root?.serverError?.type !== 400 ? (
        <AuthWrapper dataTest='auth'>
          <div data-test-id='status-block' className={styles.modalWrap}>
            <h4>Вход не выполнен</h4>
            <p>Что-то пошло не так. Попробуйте ещё раз</p>
            <Button btnType='main' fullwidth={true} onClick={handleSubmit(onSubmit)} height='52px'>
              повторить
            </Button>
          </div>
        </AuthWrapper>
      ) : (
        <AuthWrapper dataTest='auth'>
          <h4>Вход в личный кабинет</h4>
          <form data-test-id='auth-form'>
            <Controller
              name='identifier'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder='Логин'
                  dataTest='input'
                  name='identifier'
                  ref={null}
                  control={control}
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
                  dataTest='pass-input'
                  name='password'
                  type='password'
                  control={control}
                />
              )}
            />
            {errors.root && errors.root?.serverError?.type === 400 && (
              <p data-test-id='hint' className={styles.pass}>
                Неверный логин или пароль! <br /> <Link to='/forgot-pass'>Восстановить?</Link>
              </p>
            )}
            {!errors.root && (
              <div className={styles.forgot}>
                <Link to='/forgot-pass'>Забыли логин или пароль?</Link>
              </div>
            )}
            <Button
              disabled={errors.root}
              submit={true}
              btnType='main'
              onClick={handleSubmit(onSubmit)}
              fullwidth={true}
              height='52px'
            >
              вход
            </Button>
          </form>

          <div className={styles.ref}>
            Нет учётной записи?
            <Link to='/registration'>
              Регистрация <Icon name='arrowRight' />
            </Link>
          </div>
        </AuthWrapper>
      )}
    </div>
  );
};
