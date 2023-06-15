import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { URLS } from '../../settings/urls';
import { checkStatus } from '../../utils/check-book-btn-status';
import bookImgFree from '../../assets/image-empty.svg';
import { Button } from '../button/button';
import { Icon } from '../icon/icon';
import { StarRating } from '../star-rating/star-rating';
import { useAuthMeQuery } from '../../store/api/auth-api';
import './product-card.scss';
import { baseApiUrl } from '../../settings/api';

export const ProductCard = ({
  authors,
  delivery,
  image,
  booking,
  title,
  rating,
  id,
  view,
  onClick,
  searchValue,
  fullWidth,
  obj,
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const text = view === 'lists' ? title : title?.length > 35 ? `${title?.slice(0, 53)}...` : title;

  const { categoriesList, activeCategory } = useSelector((state) => state.books);

  const { data: user } = useAuthMeQuery();

  const { pathname } = useLocation();

  useEffect(() => {
    const text = `<h2>${title?.length > 25 ? `${title?.slice(0, 53)}...` : title}</h2>`;
    const regexp = new RegExp(searchValue, 'ig');
    const newStr = text.replace(regexp, `<span className='red' data-test-id=highlight-matches>$&</span>`);
    setNewTitle(newStr);
  }, [searchValue, title]);

  const isHaveCommentByUser = user?.comments?.find((comment) => comment?.bookId === id);

  const today = new Date(Date.now());

  const isExpiredBooking = today.getTime() > new Date(booking?.dateOrder).getTime();

  const isExpiredDelivery = today.getTime() > new Date(delivery?.dateHandedTo).getTime();

  const checkStatusArgs = {
    data: obj,
    // eslint-disable-next-line
    onClick: onClick,
    userId: user?.id || user?.user?.id,
  };

  return (
    <div
      style={fullWidth ? { width: '100%' } : null}
      className={classNames(`product-card ${view}`, {
        fullwidth: fullWidth,
      })}
      data-test-id='card'
    >
      {pathname === URLS.profile && (isExpiredBooking || isExpiredDelivery) && (
        <div data-test-id='expired' className='errorCard'>
          {isExpiredBooking && (
            <>
              <h2>
                Дата бронирования
                <br /> книги истекла
              </h2>
              <p>Через 24 часа книга будет доступна всем</p>
            </>
          )}
          {isExpiredDelivery && (
            <>
              <h2>
                Вышел срок <br /> пользования книги
              </h2>
              <p>Верните книгу, пожалуйста</p>
            </>
          )}
        </div>
      )}
      <Link to={`/books/${activeCategory}/${id}`}>
        <div className='product-image'>
          <img src={image ? `${baseApiUrl}${image.url || image}` : bookImgFree} alt='' />
        </div>
        <div className={view === 'rows' ? 'row-card-wrap' : 'list-card-wrap'}>
          {view === 'rows' && <StarRating score={rating} />}
          {searchValue?.length > 0 ? (
            <div className='title-wrapper' dangerouslySetInnerHTML={{ __html: newTitle }} />
          ) : (
            <h2>{text}</h2>
          )}
          <p className='product-card-published'>{authors?.map((author) => author)}</p>
          {view === 'lists' && (
            <div className='list-style-wrap'>
              <StarRating score={rating} />
              {pathname !== URLS.profile && <div className='btn-list'>{checkStatus(checkStatusArgs)}</div>}
              {pathname === URLS.profile && booking && !delivery && (
                <Button
                  dataTest='cancel-booking-button'
                  onClick={(e) => {
                    e.preventDefault();
                    onClick();
                  }}
                  btnType='main'
                >
                  Отменить бронь
                </Button>
              )}
              {pathname === URLS.profile && delivery && !booking && (
                <h2 className='handedTo'>Возврат {moment(delivery.dateHandedTo).format('DD.MM')}</h2>
              )}
            </div>
          )}
        </div>
      </Link>
      {view === 'rows' &&
        (pathname === URLS.profile ? (
          isHaveCommentByUser ? (
            <div className='btn'>
              <Button dataTest='history-review-button' onClick={onClick} btnType='outlined' fullwidth={true}>
                изменить оценку
              </Button>
            </div>
          ) : (
            <div className='btn'>
              <Button btnType='main' onClick={onClick} dataTest='history-review-button' fullwidth={true}>
                Оставить отзыв
              </Button>
            </div>
          )
        ) : (
          <div className='btn'>{checkStatus(checkStatusArgs)}</div>
        ))}
    </div>
  );
};
