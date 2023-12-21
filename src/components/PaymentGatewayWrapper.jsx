import React, { useEffect, useState } from 'react';
import { useGetPaymentGatewayClient } from '../hooks/data-hook';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export const PaymentGatewayWrapper = ({ children }) => {
  
  const { isSuccess, data } = useGetPaymentGatewayClient();
  const [ client_id, setClientId ] = useState('');

  const [paypalOptions, setPaypalOptions] = useState({});

  useEffect(() => {
    if(isSuccess) {
      setClientId(data.client_id)
      setPaypalOptions({
        "client-id":
          data.client_id,
        currency: "USD",
        "disable-funding": "credit,venmo",
      })
    }
  }, [isSuccess])

  return(
    client_id != '' ? <PayPalScriptProvider options={paypalOptions}>{children} </PayPalScriptProvider> : ''
  ) 
}