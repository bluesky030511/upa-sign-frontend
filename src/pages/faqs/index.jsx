import React, { useEffect } from "react";
import styled from "styled-components";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled as muiStyled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import Layout from "../../components/layout";
import { colors, fonts } from "../../utils/theme";
import { getRem } from "../../utils/helper";
import { useToast } from "../../context/toast.context";
import { useContactUs } from "../../hooks/user-hook";
import ErrorAlert from "../../components/alerts/error-alert";
import PrimaryInput from "../../components/inputs/primary-input";
import PrimaryButton from "../../components/buttons/primary-button";
import Footer from "../../components/footer";
import { useLocation } from "react-router-dom";

const Accordion = muiStyled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: "none",
  borderRadius: "3px",
  backgroundColor: colors.translucentBlue,
  boxShadow: "0px 4px 11px -3px rgba(0, 0, 0, 0.25)",
  padding: "0 17px",
  marginTop: "27px",
  "&:first-of-type": {
    marginTop: 0,
  },
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = muiStyled((props) => (
  <MuiAccordionSummary {...props} />
))(() => ({
  padding: 0,
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-content": {
    margin: 0,
    padding: "16px 8px",
    "& p": {
      color: colors.foreBlack,
      fontFamily: fonts.medium,
      fontSize: "20px",
    },
  },
}));

const AccordionDetails = muiStyled(MuiAccordionDetails)(() => ({
  margin: "0px 24px 17px",
  padding: "9px 0 0 0",
  borderTop: "2px solid rgba(50, 96, 241, 0.09)",
  "& p": {
    fontFamily: fonts.regular,
    color: colors.foreBlack,
    fontSize: "16px",
    lineHeight: "24px",
  },
}));

const faqs = [
  {
    id: 0,
    title: "What is e-signature software?",
    description:
      "E-signature software enables the signing of documents electronically, eliminating the need for physical paperwork. It allows users to securely sign, send, and manage documents digitally, offering convenience, efficiency, and legal validity.",
  },
  {
    id: 1,
    title: "Are electronic signatures legally binding?",
    description:
      "Yes, electronic signatures are legally binding in most jurisdictions worldwide, including the United States. E-signature software adheres to various legal frameworks, such as the U.S. Electronic Signatures in Global and National Commerce (ESIGN) Act and the European Union's eIDAS Regulation, ensuring the validity and enforceability of electronically signed documents.",
  },
  {
    id: 2,
    title: "How secure is the e-signature software?",
    description:
      "We prioritize the security of your documents and data. Our e-signature software employs advanced security measures, including encryption, tamper-proof audit trails, and compliance with industry-standard security protocols. Rest assured that your information is protected throughout the signing process.",
  },
  {
    id: 3,
    title: "Can I sign documents on any device?",
    description:
      "Absolutely! Our e-signature software is designed to be accessible on various devices, including desktops, laptops, tablets, and smartphones. Whether you're in the office or on the go, you can conveniently sign documents from any device with an internet connection.",
  },
  {
    id: 4,
    title: "Have more questions?",
    description:
      "Feel free to reach out to our support team, and we'll be happy to assist you!",
  },
  {
    id: 5,
    title:
      "How long does it take to get started with the e-signature software?",
    description:
      " Getting started is quick and easy! Simply sign up for an account, and you can start using the e-signature software immediately. No extensive installations or technical expertise required.",
  },
  {
    id: 6,
    title: "Can I customize the signing experience with my branding?",
    description:
      " Yes, we understand the importance of maintaining your brand identity. Our e-signature software offers customization options, allowing you to add your company logo, colors, and personalized email templates, creating a consistent and professional signing experience for your recipients",
  },
  {
    id: 7,
    title: "Does the software integrate with other business tools?",
    description:
      " Absolutely! Our e-signature software offers seamless integration capabilities with popular business tools, such as CRM systems, document management platforms, and cloud storage services. This ensures a smooth workflow and eliminates the need for manual data entry",
  },
  {
    id: 8,
    title: "How can I track the progress of my documents?",
    description:
      "Our e-signature software provides real-time tracking and notifications. You can monitor the progress of your documents, track who has signed or viewed them, and receive notifications when actions are taken, ensuring you stay informed throughout the signing process.",
  },
  {
    id: 9,
    title: "Is customer support available if I need assistance?",
    description:
      " Absolutely! We provide dedicated customer support to assist you with any questions or concerns. Our support team is available via email, chat, or phone during business hours to ensure you have a smooth and successful experience with our e-signature software.",
  },
  {
    id: 10,
    title: "Can I try the software before committing to a plan?",
    description:
      "Yes, we offer a free trial period so you can experience the benefits of our e-signature software firsthand. Sign up for a trial and explore the features and functionalities to determine if it meets your specific needs before making a commitment.",
  },
];

const schema = yup.object({
  name: yup.string().required("Please enter name"),
  email: yup
    .string()
    .required("Please enter email")
    .email("Please enter valid email"),
  message: yup.string().required("Please enter your message"),
});

const Faqs = () => {
  const { state } = useLocation();
  const [expanded, setExpanded] = React.useState(0);
  const { showSuccessToast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    resolver: yupResolver(schema),
  });

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const { mutate: ContactUs, isLoading, isError, error } = useContactUs();

  const onSubmit = (values) => {
    ContactUs(values, {
      onSuccess: () => {
        showSuccessToast("Message sent!");
        reset();
      },
    });
  };

  useEffect(() => {
    if (state) {
      const target = window.document.getElementById(state.section);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <>
      <Layout>
        <FAQWrapper>
          <h1 id="faqs">Frequently Asked Questions (FAQs)</h1>
          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={handleChange(index)}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
                expandIcon={
                  expanded === index ? (
                    <RemoveIcon
                      sx={{ fontSize: "24px", color: colors.themeBlue }}
                    />
                  ) : (
                    <AddIcon
                      sx={{ fontSize: "24px", color: colors.themeBlue }}
                    />
                  )
                }
              >
                <p>{faq.title}</p>
              </AccordionSummary>
              <AccordionDetails>
                <p>{faq.description}</p>
              </AccordionDetails>
            </Accordion>
          ))}
          <h4 className="disclaimer">
            Have more questions? Feel free to reach out to our support team, and
            we'll be happy to assist you!
          </h4>

          <h1 id="contact">Contact us</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <PrimaryInput
                  {...field}
                  placeholder="Enter your name"
                  spaced={false}
                  size={14}
                  helperText={fieldState.error && fieldState.error.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <PrimaryInput
                  {...field}
                  placeholder="Enter your email"
                  size={14}
                  helperText={fieldState.error && fieldState.error.message}
                />
              )}
            />
            <textarea {...register("message")} placeholder="Message"></textarea>
            <span className="error-text">
              {errors.message && errors.message.message}
            </span>
            <div className="btn-wrap">
              <PrimaryButton
                type="submit"
                sx={{
                  textTransform: "none",
                  borderRadius: "5px",
                  py: "10px",
                }}
                isLoading={isLoading}
              >
                Send
              </PrimaryButton>
            </div>
            <ErrorAlert
              show={isError}
              error={error}
              message="Not able to contact right now"
            />
          </form>
        </FAQWrapper>
      </Layout>
      <Footer />
    </>
  );
};

export default Faqs;

const FAQWrapper = styled.section`
  padding-top: 85px;

  h1 {
    margin-top: ${getRem(64)};
    margin-bottom: ${getRem(32)};
    font-family: ${fonts.semibold};
    font-size: ${getRem(40)};
    color: ${colors.black};
  }

  h4 {
    margin-top: ${getRem(24)};
    margin-bottom: ${getRem(26)};
    font-family: ${fonts.medium};
    font-size: ${getRem(18)};
    color: ${colors.foreBlack};
  }

  form {
    width: 100%;
    max-width: 512px;
    textarea {
      width: 100%;
      border-radius: 7px;
      background-color: ${colors.translucentBlue};
      border: none;
      padding: 17px 20px;
      margin-top: 25px;
      font-family: ${fonts.medium};
      font-size: 14px;
      color: ${colors.foreBlack};
      height: 147px;
      resize: none;
      &::placeholder {
        font-family: ${fonts.medium};
        color: ${colors.fadeBlack};
      }
    }
    .btn-wrap {
      width: 126px;
      margin-top: 25px;
    }
    .error-text {
      font-family: ${fonts.regular};
      font-size: 0.75rem;
      color: red;
      margin-left: 8px;
    }
  }
`;
