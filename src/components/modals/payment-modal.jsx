import React from "react";
import { Divider } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Controller, useForm } from "react-hook-form";
import { PayPalButtons } from "@paypal/react-paypal-js";
import * as yup from "yup";

import { useToast } from "../../context/toast.context";
import PrimaryInput from "../inputs/primary-input";
import PrimaryButton from "../buttons/primary-button";
import ErrorAlert from "../alerts/error-alert";
import { useSubscription } from "../../context/subscription.context";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUI } from "../../context/ui.context";
import { usePostSubscription } from "../../hooks/user-hook";
import { PLANCODE, PLAN_KEYS, PLAN_PRICING } from "../../utils/variables";

const style = {
  layout: "vertical",
  color: "blue",
};

const schema = yup.object({
  couponCode: yup.string().required("Please enter coupon code"),
});

const PaymentModal = (props) => {
  const { user } = useUI();
  const { open, handleClose, plan } = props;
  const { showErrorToast, showSuccessToast } = useToast();
  const { setSubscription, setPlan } = useSubscription();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      couponCode: plan === PLAN_KEYS.free ? "FREE" : "",
    },
    resolver: yupResolver(schema),
  });
  const {
    mutate: Subscribe,
    isLoading,
    isError,
    error,
  } = usePostSubscription();

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: PLAN_PRICING[plan],
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      Subscribe(
        {
          agentId: user.id,
          transactionId: details.id,
          price: PLAN_PRICING[plan],
          status: "RUNNING",
          type: "PAID",
          subscriptionPlan: PLANCODE[plan],
        },
        {
          onSuccess: (data) => {
            showSuccessToast("You're subscribed successfully");
            setSubscription("SUBSCRIBED");
            setPlan(data.subscriptionPlan);
          },
          onError: () => {
            showErrorToast("Oops! There might be some problem. Try again");
          },
        }
      );
      handleClose();
    } catch (error) {
      console.log("Paypal error -> ", error);
    }
  };

  const onSubmit = (values) => {
    Subscribe(
      {
        agentId: user.id,
        price: "0.00",
        status: "RUNNING",
        type: "PAID",
        subscriptionPlan: plan === PLAN_KEYS.free ? "FREE" : "COUPONCODE",
        couponCode: values.couponCode,
      },
      {
        onSuccess: (data) => {
          showSuccessToast("You're subscribed successfully");
          setSubscription("SUBSCRIBED");
          setPlan(data.subscriptionPlan);
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "400px",
          borderRadius: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="couponCode"
            control={control}
            render={({ field, fieldState }) => (
              <PrimaryInput
                {...field}
                placeholder="Coupon code"
                spaced={false}
                size={13}
                helperText={fieldState.error && fieldState.error.message}
              />
            )}
          />
          <PrimaryButton type="submit" sx={{ mt: 2 }} isLoading={isLoading}>
            Apply
          </PrimaryButton>
          <ErrorAlert
            show={isError}
            error={error}
            message="Can't apply coupon code."
          />
        </form>
        {plan !== PLAN_KEYS.free && (
          <>
            <Divider sx={{ my: 1 }} light>
              OR
            </Divider>
            <PayPalButtons
              style={style}
              createOrder={createOrder}
              onApprove={onApprove}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
