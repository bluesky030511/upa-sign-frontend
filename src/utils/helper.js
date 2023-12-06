import React from "react";
import { Link } from "react-router-dom";
import { useUI } from "../context/ui.context";

export const isComplete = (user) => {
  if (user) {
    if (
      user.phoneNumber !== null ||
      user.address !== null ||
      user.city !== null ||
      user.country !== null ||
      user.gender !== null
    ) {
      return true;
    }
    return false;
  }
};

export const renderError = (error, message) => {
  if (error) {
    if (error.response) {
      if (error.response.data) {
        if (error.response.data.message) {
          return error.response.data.message;
        } else {
          return message ? message : "Something went wrong";
        }
      } else {
        return message ? message : "Something went wrong";
      }
    } else {
      return message ? message : "Something went wrong";
    }
  }
};

export const isSubscribed = (value) => {
  if (value === "UNPAID" || value === "EXPIRED") return false;
  return true;
};

export const getRem = (px) => {
  return `${px / 16}rem`;
};

export const handlePricing = (user, planKey, navigate) => () => {
  if (user) {
    if (user.loggedIn) {
      navigate(`/documents?plan=${planKey}`);
    } else {
      navigate(`/auth/register?plan=${planKey}`);
    }
  }
};

export const PricingLink = ({ children, pricingKey }) => {
  const { user } = useUI();

  let redirectedRoute = "/auth/register";
  if (user.loggedIn) {
    redirectedRoute = "/documents";
  }

  return <Link to={`${redirectedRoute}?plan=${pricingKey}`}>{children}</Link>;
};

export function getRandomNumbersWithExclusion(min, max, excludedNumber) {
  if (max - min < 2) {
    throw new Error("Range must have at least two distinct values.");
  }

  var numbers = [];

  while (numbers.length < 2) {
    var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (randomNumber !== excludedNumber && !numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }

  return numbers;
}
