import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { profileEditSchema } from '../../../settings/validation-schemes';

import { TextField } from '../../../components/text-field/text-field';
import { Button } from '../../../components/button/button';

import styles from './profile-form.module.scss';

export const ProfileForm = ({ onSubmit, setIsEdit, user, isEdit }) => {
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors, isValid, isDirty },
    trigger,
    setValue,
  } = useForm({
    resolver: yupResolver(profileEditSchema),
    defaultValues: {
      password: '',
    },
    criteriaMode: 'all',
    mode: 'all',
  });

  useEffect(() => {
    if (user) {
      reset({
        login: user?.username,
        password: '2312247Vla',
        firstName: user?.firstName,
        lastName: user?.lastName,
        phone: user?.phone,
        email: user?.email,
      });
    }
  }, [user, reset]);

  const sendForm = () => {
    const values = getValues();

    const dataValues = {
      username: values.username,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      email: values.email,
    };
    onSubmit(dataValues);
  };

  const fieldValues = getValues();

  return (
    <form className={styles.root} data-test-id='profile-form'>
      <div className={styles.input}>
        <Controller
          name='login'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder='Логин'
              disabled={!isEdit}
              name='login'
              ref={null}
              control={control}
              description={
                fieldValues.login?.length > 0
                  ? `Используйте для логина <span className=${styles.unhinted}>латинский алфавит</span> и <span className=${styles.unhinted}>цифры</span>`
                  : 'Поле не может быть пустым'
              }
            />
          )}
        />
      </div>
      <div className={styles.input}>
        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              ref={null}
              placeholder='Пароль'
              name='password'
              passShowDone={false}
              disabled={!isEdit}
              type='password'
              control={control}
              description={
                fieldValues.password?.length > 0
                  ? `Пароль <span className=${styles.unhinted}>не менее 8 символов</span>, с <span className=${styles.unhinted}>заглавной буквой</span> и <span className=${styles.unhinted}>цифрой</span>`
                  : 'Поле не может быть пустым'
              }
            />
          )}
        />
      </div>
      <div className={styles.input}>
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
              disabled={!isEdit}
              control={control}
            />
          )}
        />
      </div>
      <div className={styles.input}>
        <Controller
          name='lastName'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              ref={null}
              placeholder='Фамилия'
              disabled={!isEdit}
              description={errors.lastName && 'Поле не может быть пустым'}
              name='lastName'
              control={control}
            />
          )}
        />
      </div>
      <div className={styles.input}>
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
              disabled={!isEdit}
            />
          )}
        />
      </div>
      <div className={styles.input}>
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              ref={null}
              placeholder='E-mail'
              description={
                fieldValues.email?.length > 0
                  ? errors.email && 'Введите корректный e-mail'
                  : 'Поле не может быть пустым'
              }
              name='email'
              control={control}
              disabled={!isEdit}
            />
          )}
        />
      </div>
      <div className={styles.btns}>
        <Button dataTest='edit-button' btnType='outlined' onClick={() => setIsEdit((prev) => !prev)} height='52px'>
          Редактировать
        </Button>
        <Button onClick={sendForm} dataTest='save-button' btnType='main' disabled={!isEdit} height='52px'>
          Сохранить изменения
        </Button>
      </div>
    </form>
  );
};
