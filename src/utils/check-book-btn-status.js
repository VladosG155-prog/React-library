import moment from 'moment';
import { store } from '../store';
import { Button } from '../components/button/button';

export const checkStatus = ({ data, onClick, userId }) => {
  let btn = null;
  btn = data?.booking ? (
    Number(data.booking?.customerId) !== Number(userId) ? (
      <Button dataTest='booking-button' btnType='outlined' disabled={true} onClick={onClick} fullwidth={true}>
        Забронирована
      </Button>
    ) : (
      <Button dataTest='booking-button' btnType='outlined' onClick={onClick} fullwidth={true}>
        Забронирована
      </Button>
    )
  ) : (
    <Button dataTest='booking-button' btnType='main' onClick={onClick} fullwidth={true}>
      Забронировать
    </Button>
  );

  if (data?.delivery) {
    btn = (
      <Button btnType='main' dataTest='booking-button' onClick={onClick} disabled={true} fullwidth={true}>
        {`занята до ${moment(data?.delivery?.dateHandedTo).format('DD.MM')} `}
      </Button>
    );
  }

  return btn;
};
