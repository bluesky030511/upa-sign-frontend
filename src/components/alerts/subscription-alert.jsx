import React, { useState, useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

import { isSubscribed } from "../../utils/helper";
import { useUI } from "../../context/ui.context";
import { useSubscription } from "../../context/subscription.context";
import { fonts } from "../../utils/theme";
import PrimaryButton from "../buttons/primary-button";
import { Link } from "react-router-dom";
import { SHOWN } from "../../utils/variables";

const renderStatus = (subscription, plan) => {
  if (subscription === "UNPAID") return "You're not subscribed to UPA Sign.";
  if (subscription === "EXPIRED") return "Your subscription is expired.";
  if (subscription === "SUBSCRIBED") {
    if (Boolean(plan)) return `You're currently subscribed for ${plan} plan.`;
    else return "You're currently subscribed to UPA Sign.";
  }
};

const SubscriptionAlert = () => {
  const [warning, setWarning] = useState(false);
  const { user } = useUI();
  const { subscription, plan } = useSubscription();

  useEffect(() => {
    setTimeout(() => {
      if (!sessionStorage.getItem(SHOWN)) {
        setWarning(true);
        sessionStorage.setItem(SHOWN, true);
      }
    }, 1000);
  }, []);

  return (
    <>
      {user.isAgent && (
        <Collapse in={warning}>
          <Alert
            severity={isSubscribed(subscription) ? "success" : "warning"}
            sx={{
              px: { xs: 1, sm: 2 },
              mb: 2,
              fontFamily: fonts.medium,
              bgcolor:
                subscription === "UNPAID"
                  ? "#FFEED2"
                  : subscription === "EXPIRED"
                  ? "#FFE1DF"
                  : "#DAFFDB",
              justifyContent: "space-between",
              alignItems: "center",

              "& .MuiAlert-action": {
                ml: 0,
              },

              "& .MuiAlert-message": {
                flex: 1,
              },
            }}
            onClose={() => {
              setWarning(false);
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                flexWrap: "wrap",
              }}
            >
              {renderStatus(subscription, plan)}
              {!isSubscribed(subscription) && (
                <Link to="/plans-pricing" state={{ section: "plans" }}>
                  <PrimaryButton
                    sx={{
                      width: { xs: 104, sm: 150 },
                      py: "6px",
                      ml: { xs: 0, sm: 2 },
                      mt: { xs: "4px", sm: 0 },
                      borderRadius: "6px",
                      fontSize: { xs: 12, sm: 15 },
                    }}
                  >
                    {subscription === "UNPAID" ? "Subscribe" : "Resubscribe"}
                  </PrimaryButton>
                </Link>
              )}
            </Box>
          </Alert>
        </Collapse>
      )}
    </>
  );
};

export default SubscriptionAlert;
