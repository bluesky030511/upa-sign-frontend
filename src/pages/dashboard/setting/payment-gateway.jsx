import React, { useEffect, useState } from 'react';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from 'react-hook-form';
import { useUI } from '../../../context/ui.context';
import PrimaryInput from '../../../components/inputs/primary-input';
import PrimaryButton from '../../../components/buttons/primary-button';
import ErrorAlert from '../../../components/alerts/error-alert';
import styled from "styled-components";
import { colors, fonts } from "../../../utils/theme";
import { useGetPaymentGateway, useUpdatePaymentGateway } from '../../../hooks/data-hook';
import { useToast } from '../../../context/toast.context';

const schema = yup.object({
  client_id: yup.string().required('Please enter client id'),
  client_secret: yup.string().required('please enter client secret')
})

const PaymentGateway = () => {
  const { showSuccessToast, showErrorToast } = useToast();
  const {
    mutate: UpdatePaymentGateway,
    isLoading,
    error,
    isError
  } = useUpdatePaymentGateway();

  const { data, isSuccess } = useGetPaymentGateway()
  
  const onSubmit = async ({ client_id, client_secret }) => {
    UpdatePaymentGateway({
      client_id,
      client_secret
    }, {
      onSuccess: () => {
        showSuccessToast('Payment gateway updated');
      },
      onError: (error) => {
        showErrorToast('Can\'t update payment gateway');
      }
    })
  }

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      client_id: '',
      client_secret: ''
    },
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if(isSuccess) {
      setValue('client_id', data.client_id)
      setValue('client_secret', data.client_secret)
    }
  }, [isSuccess])

  return (
    <Wrapper>
      <form className="inner-box" onSubmit={handleSubmit(onSubmit)}>
        <h3>Payment Gateway</h3>
        <div className="input-box">
          <Controller
            name="client_id"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                placeholder="Client ID"
                spaced={false}
                type="text"
                {...field}
                error={fieldState.error && fieldState.error.message}
              />
            )}
          />
          <Controller
            name="client_secret"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                placeholder="Client Secret"
                type="text"
                {...field}
                error={fieldState.error && fieldState.error.message}
              />
            )}
          />
          <div className="btn-container">
            <PrimaryButton isLoading={isLoading} type="submit">
              Update
            </PrimaryButton>
          </div>
          <ErrorAlert
            show={isError}
            error={error}
            message="Can't update payment gateway settings right now"
          />
        </div>
      </form>
    </Wrapper>
  )
}

export default PaymentGateway;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  .inner-box {
    max-width: 510px;
    padding: 54px 76px;
    background-color: ${colors.white};
    border-radius: 18px;
    box-shadow: 0px 4px 25px -4px rgba(0, 0, 0, 0.25);
    h3 {
      color: ${colors.black};
      font-family: ${fonts.semibold};
      font-size: 32px;
      margin-bottom: 35px;
      text-align: center;
    }
    .btn-container {
      margin-top: 40px;
    }
  }

  @media screen and (max-width: 600px) {
    .inner-box {
      border-radius: 8px;
      padding: 12px;
      h3 {
        font-size: 24px;
        margin-bottom: 24px;
      }
      .btn-container {
        margin-top: 24px;
      }
    }
  }
`;
