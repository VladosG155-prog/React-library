import { Suspense, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useParams, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Aside } from '../../components/aside/aside';
import { Button } from '../../components/button/button';

import { Icon } from '../../components/icon/icon';
import { Input } from '../../components/input/input';
import { ProductCard } from '../../components/product-card/product-card';
import { screens, useMediaQuery } from '../../hooks/use-media-query';

import styles from './main-page.module.scss';
import { useAuthMeQuery } from '../../store/api/auth-api';
import {
  useSendChangeBookingRequestMutation,
  useSendUnbookingRequestMutation,
  useGetAllBooksQuery,
  useSendBookingRequestMutation,
  useGetBookCategoriesQuery,
} from '../../store/api/books-actions-api';
import { Loader } from '../../components/loader/loader';
import { Alert } from '../../components/alert/alert';
import { filterBooksByCategory, setBooks, setCategory } from '../../store/slices/books-slice';
import { Calendar } from '../../components/calendar/calendar';
import { setToast, setUser } from '../../store/slices/global-slice';
import { Modal } from '../../components/modal/modal';
import { TOAST_MESSAGES_ERROR, TOAST_MESSAGES_SUCCESS } from '../../settings/toast-messages';

export const MainPage = () => {
  const [viewType, setViewType] = useState('rows');

  const [viewButotns, setViewButtons] = useState([
    {
      iconName: 'menu',
      type: 'rows',
      dataType: 'button-menu-view-window',
    },
    {
      iconName: 'burger',
      type: 'lists',
      dataType: 'button-menu-view-list',
    },
  ]);

  const [isShowSearch, setIsShowSearch] = useState(false);
  const [ratingSort, setRatingSort] = useState('down');

  const [inputValue, setInputValue] = useState('');

  const isMobile = useMediaQuery(screens.mobile);
  const isTablet = useMediaQuery(screens.tablet);
  const { type } = useParams();

  const dispatch = useDispatch();

  const toast = useSelector((state) => state.global.toast);

  const { filteredBooks, categoriesList } = useSelector((state) => state.books);

  const { isFullfiled } = useGetBookCategoriesQuery();
  const { data, error, isLoading, refetch, isFetching } = useGetAllBooksQuery();
  const { data: user, refetch: userRefetch } = useAuthMeQuery();
  const [bookingDate, setBookingDate] = useState(user?.booking?.dateOrder || null);
  const [showLoader, setShowLoader] = useState(false);

  const [requestBooking, responseBooking] = useSendBookingRequestMutation();
  const [requestUnBooking, responseUnBooking] = useSendUnbookingRequestMutation();
  const [requestChangeBooking, responseChangeBooking] = useSendChangeBookingRequestMutation();
  const [isBooking, setIsBooking] = useState({ active: false, bookId: null });

  useEffect(() => {
    refetch();
    userRefetch();
    //  eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isFetching && !isLoading) {
      dispatch(setBooks(data));
    }
  }, [isFetching, data, dispatch, isLoading]);

  useEffect(() => {
    const category = categoriesList?.find((category) => category.path === type);
    dispatch(setCategory(type));
    dispatch(filterBooksByCategory({ type: category?.name, ratingSort, search: inputValue }));
  }, [type, dispatch, categoriesList, ratingSort, inputValue, data]);

  const toggleShowSearch = () => {
    setIsShowSearch((prev) => !prev);
  };

  const toggleDropdownSort = () => {
    if (ratingSort === 'down') {
      setRatingSort('up');
    } else {
      setRatingSort('down');
    }
  };

  const viewTypeClassName = viewType === 'rows' ? `${styles.booksWrapLists}` : `${styles.booksWrapRows}`;

  const sendBookingRequest = async () => {
    setShowLoader(true);

    const data = {
      order: true,
      dateOrder: bookingDate,
      book: String(isBooking.bookId),
      customer: String(user.id || user.user.id),
    };
    if (isBooking.booking) {
      const { id } = isBooking.booking;
      const res = await requestChangeBooking({ data, id });
      if (res) {
        refetch();
        dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_CHANGE_BOOKING_SUCCESS, show: true }));
        setShowLoader(false);
      }

      if (res.error) {
        dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_CHANGE_BOOKING_ERROR, show: true }));
      }

      if (!isFetching) {
        setIsBooking({ active: false });
      }
    } else {
      const res = await requestBooking(data);

      if (res) {
        setShowLoader(false);
        dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_BOOKING_SUCCESS, show: true }));
        refetch();
      }
      if (res.error) {
        dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_BOOKING_ERROR, show: true }));
      }

      if (!isFetching) {
        setIsBooking({ active: false });
      }
    }
  };

  const sendUnBookingRequest = async () => {
    const res = await requestUnBooking(isBooking.booking.id);
    if (res) {
      dispatch(setToast({ type: 'success', text: TOAST_MESSAGES_SUCCESS.SEND_UNBOOKING_SUCCESS, show: true }));
      refetch();
    }

    if (res.error) {
      dispatch(setToast({ type: 'rejected', text: TOAST_MESSAGES_ERROR.SEND_UNBOOKING_ERROR, show: true }));
    }

    if (!isLoading) {
      setIsBooking({ active: false, bookId: null });
    }
  };

  const searchBook = (value) => {
    setInputValue(value);
  };

  const isDisabledBookingButton = isBooking?.booking?.dateOrder === bookingDate || bookingDate === null;

  return (
    <div className='container'>
      <section className={styles.root}>
        {!isTablet && <Aside />}
        {(responseBooking.isLoading ||
          isFetching ||
          responseUnBooking.isLoading ||
          responseChangeBooking.isLoading ||
          showLoader) && <Loader />}

        {!isFetching && <Alert open={toast.show} type={toast.type} title={toast.text} />}

        {error && (
          <Alert open={error} type='rejected' title='Что-то пошло не так. Обновите страницу через некоторое время.' />
        )}

        {isBooking.active && (
          <Modal
            onClose={() => setIsBooking({ ...isBooking, active: false })}
            title={isBooking.booking ? 'Изменение даты бронирования' : 'Выбор даты бронирования'}
          >
            <Calendar value={isBooking.booking ? isBooking.booking?.dateOrder : ''} onChange={setBookingDate} />
            <div className={styles.btns}>
              <Button
                onClick={sendBookingRequest}
                disabled={isDisabledBookingButton}
                fullwidth={true}
                btnType='main'
                dataTest='booking-button'
              >
                забронировать
              </Button>
              {isBooking.booking && (
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
          </Modal>
        )}
        {!error && (
          <div className={styles.mainPageWrap}>
            <div className={styles.topMenu}>
              <div className={styles.topMenuFirst}>
                {!isMobile ? (
                  <div className={styles.mainPageInput}>
                    <Input
                      iconName='search'
                      onChange={searchBook}
                      value={inputValue}
                      iconPosition='left'
                      placeholder='Поиск книги или автора…'
                    />
                  </div>
                ) : (
                  !isShowSearch && (
                    <div className={styles.button} data-test-id='button-search-open'>
                      <Button onClick={toggleShowSearch} rounded={true}>
                        <Icon name='search' />
                      </Button>
                    </div>
                  )
                )}

                {isMobile && (
                  <div
                    className={classNames(styles.inputMobile, {
                      [styles.active]: isShowSearch,
                      [styles.hidden]: !isShowSearch,
                    })}
                  >
                    <Input
                      iconName='close'
                      iconAction={toggleShowSearch}
                      iconPosition='right'
                      onChange={searchBook}
                      value={inputValue}
                      placeholder='Поиск книги или автора…'
                    />
                  </div>
                )}

                {!isShowSearch && (
                  <Button onClick={toggleDropdownSort} dataTest='sort-rating-button' rounded={isMobile ? true : false}>
                    <div
                      className={classNames(styles.dropDownIcon, {
                        [styles.active]: ratingSort === 'up',
                      })}
                    >
                      <Icon name='dropDown' />
                    </div>
                    {!isMobile && <span style={{ marginLeft: '8px' }}>По рейтингу</span>}
                  </Button>
                )}
              </div>
              {!isShowSearch && (
                <div className={styles.topMenuLast}>
                  {viewButotns.map((button) => (
                    <Button
                      key={button.iconName}
                      rounded={true}
                      className={viewType === button.type ? 'active' : ''}
                      onClick={() => setViewType(button.type)}
                      dataTest={button.dataType}
                    >
                      <Icon name={button.iconName} />
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div data-test-id='content' className={viewTypeClassName}>
              {filteredBooks?.length > 0 ? (
                filteredBooks?.map((book) => (
                  <ProductCard
                    obj={book}
                    key={book.id}
                    id={book.id}
                    searchValue={inputValue}
                    authors={book.authors}
                    histories={book.histories}
                    title={book.title}
                    rating={book.rating}
                    booking={book.booking}
                    categories={book.categories}
                    issueYear={book.issueYear}
                    delivery={book.delivery}
                    view={viewType}
                    image={book.image}
                    score={book.score}
                    onClick={() => {
                      setIsBooking({ active: true, bookId: book.id, booking: book.booking });
                    }}
                  />
                ))
              ) : inputValue.length > 0 ? (
                <h2 className={styles.errorTitle} data-test-id='search-result-not-found'>
                  По запросу ничего не найдено
                </h2>
              ) : (
                <h2 className={styles.errorTitle} data-test-id='empty-category'>
                  В этой категории книг ещё нет
                </h2>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
