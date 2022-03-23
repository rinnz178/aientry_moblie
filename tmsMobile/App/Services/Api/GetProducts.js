import { Platform } from 'react-native';
import Config from 'react-native-config';
import api from './Api';

/**
 * Will get the product identifiers from the server.
 *
 * @return Object
 */
export function getProducts() {
  return new Promise((resolve, reject) => {
    api('/api/features/', 'GET', true) // route not yet finalized.
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}

/**
 * Will validate receipt after purchasing the product.
 * @param {Array} receipt
 *
 * @return Object.
 */
export function validateReceipt(receipt) {
  const body = {
    os: Platform.OS.toUpperCase(), // Will get device OS
    endpoint: Config.ENDPOINT,
    product_identifier: receipt.productId,
    transaction_id: receipt.transactionId,
    transaction_date: receipt.transactionDate,
    transaction_receipt: Platform.OS === 'ios' ? receipt.transactionReceipt : receipt.purchaseToken,
    amount: receipt.amount,
    currency: receipt.currency,
  };
  return new Promise((resolve, reject) => {
    api('/api/feature/validate-receipt', 'POST', true, body)
      .then((response) => {
        if (!response.ok) { throw response; }
        return response.json();
      })
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
}
