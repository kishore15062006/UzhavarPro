// StatusBadge Component
import Badge from './Badge.jsx';
import { ORDER_STATUS, DELIVERY_STATUS, PAYMENT_STATUS } from '../constants/index.js';

export const StatusBadge = ({ status, type = 'order' }) => {
  const getStatusColor = (status, type) => {
    const orderStatusMap = {
      [ORDER_STATUS.PENDING]: 'warning',
      [ORDER_STATUS.CONFIRMED]: 'info',
      [ORDER_STATUS.PROCESSING]: 'info',
      [ORDER_STATUS.READY_FOR_PICKUP]: 'info',
      [ORDER_STATUS.SHIPPED]: 'info',
      [ORDER_STATUS.DELIVERED]: 'success',
      [ORDER_STATUS.CANCELLED]: 'danger',
      [ORDER_STATUS.REJECTED]: 'danger',
    };

    const deliveryStatusMap = {
      [DELIVERY_STATUS.PENDING]: 'warning',
      [DELIVERY_STATUS.ASSIGNED]: 'info',
      [DELIVERY_STATUS.PICKED]: 'info',
      [DELIVERY_STATUS.OUT_FOR_DELIVERY]: 'info',
      [DELIVERY_STATUS.DELIVERED]: 'success',
      [DELIVERY_STATUS.FAILED]: 'danger',
      [DELIVERY_STATUS.CANCELLED]: 'danger',
    };

    const paymentStatusMap = {
      [PAYMENT_STATUS.PENDING]: 'warning',
      [PAYMENT_STATUS.COMPLETED]: 'success',
      [PAYMENT_STATUS.FAILED]: 'danger',
      [PAYMENT_STATUS.REFUNDED]: 'info',
    };

    const maps = {
      order: orderStatusMap,
      delivery: deliveryStatusMap,
      payment: paymentStatusMap,
    };

    return maps[type]?.[status] || 'gray';
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Badge variant={getStatusColor(status, type)} size="sm">
      {formatStatus(status)}
    </Badge>
  );
};

export default StatusBadge;
