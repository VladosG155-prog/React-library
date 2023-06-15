import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
// eslint-disable-next-line
import { checkStatus } from '../../utils/check-book-btn-status';
import classNames from 'classnames';
import { Thumbs, FreeMode, Navigation, Pagination } from 'swiper';
import bookImgFree from '../../assets/image-empty.svg';
import { Calendar } from '../../components/calendar/calendar';
import { Loader } from '../../components/loader/loader';
import { Modal } from '../../components/modal/modal';
import { Button } from '../../components/button/button';
import { setToast, setUser } from '../../store/slices/global-slice';
import { StarRating } from '../../components/star-rating/star-rating';
import { screens, useMediaQuery } from '../../hooks/use-media-query';
import { CommentCard } from './comment-card/comment-card';
import { Icon } from '../../components/icon/icon';
import { StarRatingReview } from './star-rating-review/star-rating-review';
import { useAuthMeQuery } from '../../store/api/auth-api';
import {
  useSendBookReviewMutation,
  useSendBookingRequestMutation,
  useSendUnbookingRequestMutation,
  useSendChangeBookingRequestMutation,
  useGetBookByIdQuery,
  useGetBookCategoriesQuery,
  useSendChangeBookReviewMutation,
} from '../../store/api/books-actions-api';
import { baseApiUrl } from '../../settings/api';
import { Alert } from '../../components/alert/alert';

import './book-page.scss';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import { TOAST_MESSAGES_ERROR, TOAST_MESSAGES_SUCCESS } from '../../settings/toast-messages';

export const BookPage = () => {
  const isTablet = useMediaQuery(screens.tablet);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [showComments, setShowComments] = useState(true);
  const [isAddedReview, setIsAddedReview] = useState(false);

  const [bookingDate, setBookingDate] = useState(null);

  const [isBooking, setIsBooking] = useState(false);

  const [requestUnBooking, responseUnBooking] = useSendUnbookingRequestMutation();
  const [requestChangeBooking, responseChangeBooking] = useSendChangeBookingRequestMutation();
  const { id, type } = useParams();

  const { refetch: refetchCategories, data: categoriesData } = useGetBookCategoriesQuery();
  const { data, error, isLoading, refetch, isFetching } = useGetBookByIdQuery(id);

  const { data: user, refetch: refetchUser } = useAuthMeQuery();

  const dispatch = useDispatch();

  const { categoriesList, activeCategory } = useSelector((state) => state.books);

  const [sendReview, response] = useSendBookReviewMutation();
  const [requestBooking, responseBooking] = useSendBookingRequestMutation();
  const [requestChangeReview, responseChangeReview] = useSendChangeBookReviewMutation();

  const findedCategory =
    activeCategory === 'all' ? 'Все книги' : categoriesList?.find((category) => category?.path === type).name || '';

  const isExpiredYourComment = data?.comments?.find((comment) => comment.user?.commentUserId === Number(user?.id));

  const toggleShowComments = () => {
    setShowComments((prev) => !prev);
  };

  const toast = useSelector((state) => state.global.toast);

  useEffect(() => {
    refetchCategories();
    refetchUser();
    // eslint-disable-next-line
  }, []);

  const isExistBookComment = user?.comments?.find((comment) => comment?.bookId === data?.id);
  const [reviewText, setReviewText] = useState(isExistBookComment?.text ? isExistBookComment?.text : '');
  const [reviewRating, setReviewRating] = useState(isExistBookComment?.rating ? isExistBookComment?.rating : 5);

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
      book: String(id),
      user: String(user.id || user.user.id),
    };
    setReviewText('');
    if (isExistBookComment) {
      const res = await requestChangeReview({ commentId: isExistBookComment.id, data: info });

      if (res) {
        dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_CHANGE_REVIEW_SUCCESS, show: true }));
        refetch();
      }

      if (res.error) {
        dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_CHANGE_REVIEW_ERROR, show: true }));
      }
    } else {
      const res = await sendReview(info);
      if (res) {
        dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_REVIEW_SUCCESS, show: true }));
        refetch();
      }

      if (res.error) {
        dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_REVIEW_ERROR, show: true }));
      }
    }
    setIsAddedReview(false);
  };

  const sendBookingRequest = async () => {
    const dataBooking = {
      order: true,
      dateOrder: bookingDate,
      book: String(data?.id),
      customer: String(user?.id || user?.user?.id),
    };
    if (data.booking) {
      const { id } = data.booking;
      const res = await requestChangeBooking({ data: dataBooking, id });

      if (res) {
        dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_CHANGE_BOOKING_SUCCESS, show: true }));
      }

      if (res.error) {
        dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_CHANGE_BOOKING_ERROR, show: true }));
      }

      if (!responseChangeBooking.isError) {
        refetch();
      }
      if (!isFetching) {
        setIsBooking(false);
      }
    } else {
      const res = await requestBooking(dataBooking);
      if (res) {
        dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_BOOKING_SUCCESS, show: true }));
        refetch();
      }

      if (res.error) {
        dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_BOOKING_ERROR, show: true }));
      }

      if (!isFetching) {
        setIsBooking(false);
      }
    }
    if (!isFetching) {
      setIsBooking(false);
    }
  };

  const sendUnBookingRequest = async () => {
    const res = await requestUnBooking(data.booking?.id);

    if (res) {
      dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_UNBOOKING_SUCCESS, show: true }));

      refetch();
    }
    if (res.error) {
      dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_UNBOOKING_ERROR, show: true }));
    }

    if (!isLoading) {
      setIsBooking(false);
    }
  };

  const sortedComments =
    data?.comments?.length > 0
      ? [...data.comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : null;

  const checkStatusArgs = {
    // eslint-disable-next-line
    data: data,
    onClick: () => setIsBooking(true),
    userId: user?.id || user?.user?.id,
  };

  const isDisabledBookingButton = data?.booking?.dateOrder === bookingDate || bookingDate === null;

  return (
    <section className='book-page'>
      {(response.isLoading || responseBooking.isLoading || isFetching) && <Loader />}
      {!isFetching && <Alert open={toast.show} type={toast.type} title={toast.text} />}
      {error ? (
        <>
          <Alert type='rejected' open={error} title='Что-то пошло не так. Обновите страницу через некоторое время.' />
          <nav>
            <div className='container'>
              <span className='nav-links'>
                <Link data-test-id='breadcrumbs-link' to={`/books/${activeCategory}`}>
                  {findedCategory}
                </Link>
                {findedCategory} / <span data-test-id='book-name'>{data?.title}</span>
              </span>
            </div>
          </nav>
        </>
      ) : (
        <nav>
          {isBooking && (
            <Modal
              onClose={() => setIsBooking(false)}
              title={data.booking ? 'Изменение даты бронирования' : 'Выбор даты бронирования'}
            >
              <div>
                <Calendar value={data?.booking?.dateOrder || ''} onChange={setBookingDate} />
                <div className='booking-btns'>
                  <Button
                    onClick={sendBookingRequest}
                    disabled={isDisabledBookingButton}
                    fullwidth={true}
                    btnType='main'
                    dataTest='booking-button'
                  >
                    забронировать
                  </Button>
                  {data.booking && (
                    <Button
                      dataTest='booking-cancel-button'
                      onClick={sendUnBookingRequest}
                      btnType='outlined'
                      fullwidth={true}
                    >
                      отменить бронь
                    </Button>
                  )}
                </div>
              </div>
            </Modal>
          )}
          <div className='container'>
            <span className='nav-links'>
              <Link data-test-id='breadcrumbs-link' to={`/books/${activeCategory}`}>
                {findedCategory}
              </Link>
              / <span data-test-id='book-name'>{data?.title}</span>
            </span>
          </div>
        </nav>
      )}
      {!error && (
        <div className='container'>
          <div className='book-page-main'>
            {isAddedReview && (
              <Modal dataTest='modal-rate-book' onClose={() => setIsAddedReview(false)} title='Оцените книгу'>
                <div className='reviewModal'>
                  <p>Ваша оценка</p>
                  <StarRatingReview
                    value={isExistBookComment ? isExistBookComment.rating : reviewRating}
                    onChange={setReviewRating}
                  />
                  <textarea
                    value={reviewText}
                    data-test-id='comment'
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder='Комментарий'
                  />
                  <Button
                    dataTest='button-comment'
                    onClick={onSendReview}
                    height='52px'
                    fullwidth={true}
                    btnType='main'
                  >
                    {isExistBookComment ? 'изменить оценку' : 'оценить'}
                  </Button>
                </div>
              </Modal>
            )}

            <div className='book-page-slider'>
              {data?.images?.length ? (
                <>
                  <Swiper
                    thumbs={{ swiper: thumbsSwiper }}
                    slidesPerView='1'
                    pagination={isTablet ? { clickable: true } : false}
                    loop={true}
                    data-test-id='slide-big'
                    modules={[Thumbs, FreeMode, Pagination]}
                    spaceBetween={20}
                  >
                    {data.images?.map(({ url }) => (
                      <SwiperSlide className='slide-top'>
                        <img src={`${url}`} alt='' />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  {data?.images?.length > 1 && !isTablet && (
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      navigation={true}
                      slidesPerView={6}
                      loop={true}
                      modules={[Thumbs, Navigation]}
                      spaceBetween={30}
                    >
                      {data?.images?.map(({ url }) => (
                        <SwiperSlide data-test-id='slide-mini' className='slide'>
                          <img src={`${url}`} alt='' />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </>
              ) : (
                <img src={bookImgFree} alt='' />
              )}
            </div>
            <div className='book-page-info'>
              <h3 data-test-id='book-title'>{data?.title}</h3>
              <span>{data?.authors?.map((author) => author)}</span>
              <div className='btn'>{checkStatus(checkStatusArgs)}</div>
              {!isTablet && (
                <div className='book-page-info-about'>
                  <h5>О книге</h5>
                  <p>{data?.description}</p>
                </div>
              )}
            </div>
          </div>
          {isTablet && (
            <div className='book-page-info-about'>
              <h5>О книге</h5>
              <div dangerouslySetInnerHTML={{ __html: data?.about }} />
            </div>
          )}
          <div className='book-page-score'>
            <div className='book-page-info-section'>
              <h5>Рейтинг</h5>
              <hr />
            </div>
            <div className='book-page-score-block'>
              <StarRating score={data?.rating} />
              <h5>{data?.rating}</h5>
            </div>
            <div className='book-page-more-info'>
              <div className='book-page-info-section'>
                <h5>Подробная информация</h5>
                <hr />
              </div>
              <div className='more-info-block-wrapper'>
                <div className='more-info-block-section'>
                  <div className='more-info-block'>
                    <p>Издательство</p>
                    <span>{data?.publish}</span>
                  </div>
                  <div className='more-info-block'>
                    <p>Год издания</p>
                    <span>{data?.issueYear}</span>
                  </div>

                  <div className='more-info-block'>
                    <p>Страниц</p>
                    <span>{data?.pages}</span>
                  </div>
                  <div className='more-info-block'>
                    <p>Переплёт</p>
                    <span>{data?.cover}</span>
                  </div>

                  <div className='more-info-block'>
                    <p>Формат</p>
                    <span>{data?.format}</span>
                  </div>
                </div>
                <div className='more-info-block-section'>
                  <div className='more-info-block'>
                    <p>Жанр</p>
                    <span>{data?.categories?.length > 0 && data?.categories[0]}</span>
                  </div>
                  <div className='more-info-block'>
                    <p>Вес</p>
                    <span>{data?.weight} г</span>
                  </div>

                  <div className='more-info-block'>
                    <p>ISBN</p>
                    <span>{data?.ISBN}</span>
                  </div>
                  <div className='more-info-block'>
                    <p>Изготовитель</p>
                    <span>{data?.producer}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='book-page-comments'>
              <div className='book-page-info-section'>
                <button
                  data-test-id='button-hide-reviews'
                  onClick={toggleShowComments}
                  className={classNames('', {
                    active: showComments,
                  })}
                  type='button'
                >
                  Отзывы <span>{data?.comments?.length}</span>
                  <Icon name='angleDown' />
                </button>
                <hr />
              </div>
              {showComments && (
                <div className='reviews' data-test-id='reviews'>
                  {sortedComments &&
                    sortedComments?.map((comment) => (
                      <CommentCard
                        avatar={comment.user.avatarUrl}
                        name={`${comment.user.firstName} ${comment.user.lastName}`}
                        date={comment.createdAt}
                        text={comment.text}
                        rating={comment.rating}
                      />
                    ))}

                  <div className='btn'>
                    <Button
                      dataTest='button-rate-book'
                      onClick={() => setIsAddedReview(true)}
                      btnType={isExpiredYourComment ? 'outlined' : 'main'}
                      fullwidth={true}
                    >
                      {isExpiredYourComment ? 'Изменить оценку' : ' Оценить книгу'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
