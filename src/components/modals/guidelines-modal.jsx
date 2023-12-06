import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import styled from "styled-components";
import { colors, fonts } from "../../utils/theme";
import Slide from "@mui/material/Slide";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GuideLinesModal = ({ open, handleClose }) => {
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          maxWidth: { xs: "100%", sm: "500px" },
          borderRadius: { xs: 2, sm: 4 },
          mx: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogContent>
        <SuccessContent>
          <h4>Guidelines</h4>
          <p>
            *Please refer to these sample documents while uploading your
            template. Make sure to follow the guidelines for your contracts to
            work properly.
          </p>
          <div className="sample-container">
            <a
              href="https://docs.google.com/document/d/1bdxBQT2k65xK2_tfL2EK1lES0hd0_26QjnK71rk-xLE/edit"
              target="_blank"
              className="documents"
              rel="noopener noreferrer"
            >
              <DescriptionRoundedIcon
                sx={{ fontSize: { xs: 48, sm: 84 }, color: colors.themeBlue }}
              />
              <h5 className="document-name">Sample</h5>
            </a>
            <a
              href="https://docs.google.com/document/d/1vBimLJkM2yj_fIlsHuxRkMpiVwUhCaxTh4uqA-vvvOU/edit"
              target="_blank"
              className="documents"
              rel="noopener noreferrer"
            >
              <DescriptionRoundedIcon
                sx={{ fontSize: { xs: 48, sm: 84 }, color: colors.themeBlue }}
              />
              <h5 className="document-name">Placeholder</h5>
            </a>
          </div>
        </SuccessContent>
      </DialogContent>
    </Dialog>
  );
};

export default GuideLinesModal;

const SuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon-circle {
    width: 96px;
    height: 96px;
    background-color: #ffe3e3;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h4 {
    font-family: ${fonts.semibold};
    font-size: 28px;
    color: ${colors.themeBlue};
    margin-bottom: 12px;
  }
  p {
    font-family: ${fonts.regular};
    color: ${colors.foreBlack};
    font-size: 12px;
  }
  .sample-container {
    margin-top: 18px;
    display: flex;
    margin-left: -36px;

    .documents {
      margin-left: 36px;
      width: 144px;
      height: 144px;
      background-color: ${colors.translucentBlue};
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      transition: transform 0.2s ease;
      box-shadow: 0px 0px 10px 0px rgb(178 178 178 / 38%);
      &:hover {
        transform: scale(0.95);
      }
      .document-name {
        margin-top: 8px;
        font-family: ${fonts.regular};
        color: ${colors.foreBlack};
      }
    }
  }

  @media screen and (max-width: 600px) {
    .sample-container {
      .documents {
        width: 108px;
        height: 108px;
        .document-name {
          font-size: 12px;
        }
      }
    }
  }
`;
