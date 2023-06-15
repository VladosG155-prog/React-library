import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import avatar from '../../assets/avatar.png';
import { Modal } from '../../components/modal/modal';
import { StarRatingReview } from '../book/star-rating-review/star-rating-review';
import { TextField } from '../../components/text-field/text-field';
import { Alert } from '../../components/alert/alert';
import { useAuthMeQuery } from '../../store/api/auth-api';
import styles from './profile-page.module.scss';
import { Loader } from '../../components/loader/loader';
import { Button } from '../../components/button/button';
import { baseApiUrl } from '../../settings/api';
import { Icon } from '../../components/icon/icon';
import { useChangeUserDataMutation, useChangeUserPhotoMutation } from '../../store/api/user-api';
import { ProductCard } from '../../components/product-card/product-card';
import {
  useGetAllBooksQuery,
  useGetBookByIdQuery,
  useGetBookCategoriesQuery,
  useSendBookReviewMutation,
  useSendChangeBookReviewMutation,
  useSendUnbookingRequestMutation,
} from '../../store/api/books-actions-api';

import 'swiper/css';
import 'swiper/css/pagination';
import { screens, useMediaQuery } from '../../hooks/use-media-query';
import { setToast } from '../../store/slices/global-slice';
import { TOAST_MESSAGES_ERROR, TOAST_MESSAGES_SUCCESS } from '../../settings/toast-messages';
import { ProfileForm } from './profile-form/profile-form';

export const ProfilePage = () => {
  const isMobile = useMediaQuery(screens.mobile);
  const isTablet = useMediaQuery(screens.tablet);

  const toast = useSelector((state) => state.global.toast);

  const { data: user, refetch, isFetching } = useAuthMeQuery();
  const { data: categories, refetch: categoriesRefetch } = useGetBookCategoriesQuery();
  const { data: books } = useGetAllBooksQuery();

  const [isEdit, setIsEdit] = useState(false);
  const [isAddedReview, setIsAddedReview] = useState(false);

  const [bookData, setBookData] = useState();
  const { data: book } = useGetBookByIdQuery(bookData?.id, { skip: !bookData?.id });
  const [requestUnbooking, responseUnbooking] = useSendUnbookingRequestMutation();

  useEffect(() => {
    categoriesRefetch();

    // eslint-disable-next-line
  }, []);

  const dispatch = useDispatch();

  const [requestChangePhoto, response] = useChangeUserPhotoMutation();
  const [sendReview, reponseSendReview] = useSendBookReviewMutation();
  const [requestChangeUserData, responseChangeUserData] = useChangeUserDataMutation();
  const [requestChangeReview, responseChangeReview] = useSendChangeBookReviewMutation();

  const changePhoto = async (image) => {
    const res = await requestChangePhoto(image);

    if (res) {
      refetch();
      dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_PHOTO_SUCCESS, show: true }));
    }

    if (res.error) {
      dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_PHOTO_ERROR, show: true }));
    }
  };

  const sendUnBookingRequest = async () => {
    const res = await requestUnbooking(user.booking.id);
    if (res) {
      dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_UNBOOKING_SUCCESS, show: true }));
      refetch();
    }

    if (res.error) {
      dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_UNBOOKING_ERROR, show: true }));
    }
  };

  const saveChanges = async (dataValues) => {
    const res = await requestChangeUserData({ userId: user.id, data: dataValues });
    refetch();
    if (res) {
      dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_CHANGE_USER_DATA_SUCCESS, show: true }));
    }

    if (res.error) {
      dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_ERROR.SEND_CHANGE_USER_DATA_ERROR, show: true }));
    }
  };

  const isExistBookComment = user?.comments.find((comment) => comment?.bookId === bookData?.id);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (isExistBookComment?.text) {
      setReviewText(isExistBookComment?.text);
      setReviewRating(isExistBookComment?.rating);
    }
  }, [isExistBookComment]);

  const onSendReview = async () => {
    const info = {
      rating: Number(reviewRating),
      text: reviewText,
      book: String(bookData.id),
      user: String(user.id || user.user.id),
    };
    if (isExistBookComment) {
      const res = await requestChangeReview({ commentId: isExistBookComment.id, data: info });

      if (res) {
        dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_CHANGE_REVIEW_SUCCESS, show: true }));
      }
      refetch();
      if (res.error) {
        dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_CHANGE_REVIEW_ERROR, show: true }));
      }

      setIsAddedReview(false);
    } else {
      const res = await sendReview(info);
      if (res) {
        dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_REVIEW_SUCCESS, show: true }));
      }
      refetch();
      if (res.error) {
        dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_REVIEW_ERROR, show: true }));
      }

      setIsAddedReview(false);
    }
  };

  const countSlidesByScreenSize = isMobile ? '1' : isTablet ? '3' : '4';

  if (!user || response.isLoading || responseChangeUserData.isLoading) return <Loader />;

  return (
    <div className='container'>
      {isAddedReview && (
        <Modal dataTest='modal-rate-book' onClose={() => setIsAddedReview(false)} title='Оцените книгу'>
          <div className='reviewModal'>
            <p>Ваша оценка</p>
            <StarRatingReview
              value={isExistBookComment ? isExistBookComment.rating : reviewRating}
              onChange={setReviewRating}
            />
            <textarea
              data-test-id='comment'
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder='Комментарий'
            />
            <Button dataTest='button-comment' onClick={onSendReview} height='52px' fullwidth={true} btnType='main'>
              {isExistBookComment ? 'изменить оценку' : 'оценить'}
            </Button>
          </div>
        </Modal>
      )}

      {!isFetching && <Alert open={toast.show} type={toast.type} title={toast.text} />}

      <div className={styles.root}>
        <div className={styles.avatarEdit} data-test-id='profile-avatar'>
          <div className={styles.avatar}>
            <input
              type='file'
              onChange={(e) => {
                changePhoto(e.target.files[0]);
              }}
            />
            <img src={user.avatar ? `${baseApiUrl}${user.avatar}` : avatar} alt='' />

            <button type='button'>
              <Icon name='addPhoto' />
            </button>
          </div>
          <h1>
            {user.lastName}
            <br />
            {user.firstName}
          </h1>
        </div>
        <div className={styles.profileBlock}>
          <h4>Учётные данные</h4>
          <p>Здесь вы можете отредактировать информацию о себе</p>
          <ProfileForm user={user} isEdit={isEdit} setIsEdit={setIsEdit} onSubmit={saveChanges} />
        </div>
        <div className={styles.profileBlock}>
          <h4>Забронированная книга</h4>
          <p>Здесь вы можете просмотреть забронированную книгу, а так же отменить бронь</p>
          {user.booking.id ? (
            <ProductCard
              id={user.booking.book.id}
              authors={user.booking.book.authors}
              title={user.booking.book.title}
              booking={user.booking}
              issueYear={user.booking.book.issueYear}
              rating={user.booking.book.rating}
              view='lists'
              image={user.booking.book.image}
              onClick={sendUnBookingRequest}
            />
          ) : (
            <div data-test-id='empty-blue-card' className={styles.noDataWrap}>
              <h3>
                Забронируйте книгу <br /> и она отобразится{' '}
              </h3>
            </div>
          )}
        </div>
        <div className={styles.profileBlock}>
          <h4>Книга которую взяли</h4>
          <p>Здесь можете просмотреть информацию о книге и узнать сроки возврата</p>
          {user.delivery.id ? (
            <ProductCard
              id={user.delivery.book.id}
              authors={user.delivery.book.authors}
              title={user.delivery.book.title}
              issueYear={user.delivery.book.issueYear}
              rating={user.delivery.book.rating}
              view='lists'
              image={user.delivery.book.image}
              delivery={user.delivery}
            />
          ) : (
            <div data-test-id='empty-blue-card' className={styles.noDataWrap}>
              <h3>
                Прочитав книгу, <br /> она отобразится в истории{' '}
              </h3>
            </div>
          )}
        </div>
        <div className={styles.profileBlock} data-test-id='history'>
          <h4>История</h4>
          <p>Список прочитанных книг</p>
          {user.history?.books ? (
            <Swiper
              modules={[Pagination]}
              spaceBetween={25}
              pagination={{ clickable: true }}
              slidesPerView={countSlidesByScreenSize}
            >
              {user.history?.books?.map((book) => (
                <SwiperSlide key={book.id} data-test-id='history-slide'>
                  <ProductCard
                    id={book.id}
                    fullWidth={true}
                    authors={book.authors}
                    title={book.title}
                    rating={book.rating}
                    issueYear={book.issueYear}
                    view='rows'
                    onClick={() => {
                      setIsAddedReview(true);
                      setBookData(book);
                    }}
                    image={book.image}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div data-test-id='empty-blue-card' className={styles.noDataWrap}>
              <h3>
                Вы не читали книг <br />
                из нашей библиотеки
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
