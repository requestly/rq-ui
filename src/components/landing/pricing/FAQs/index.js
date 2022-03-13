import React from "react";
import { Collapse } from "antd";
// import { useMediaQuery } from "react-responsive";

// Constants
import { CONSTANTS as GLOBAL_CONSTANTS } from "git@github.com:requestly/requestly.git";
import { getFunctions, httpsCallable } from "firebase/functions";

const { Panel } = Collapse;

const handleTemp = (e) => {};

const PricingFAQs = () => {
  // const md = useMediaQuery({ minWidth: 768 });
  const FAQs = [
    {
      ques: <React.Fragment>Do you offer any trial period?</React.Fragment>,
      answer: (
        <React.Fragment>
          No, but we offer <strong>15-days Guarantee Period</strong>. If you are
          not happy with your premium subscription, you may cancel your
          subscription from Account Settings or by reaching out our support.
        </React.Fragment>
      ),
    },
    {
      ques: (
        <React.Fragment>
          Is there any discount for an annual subscription?
        </React.Fragment>
      ),
      answer: (
        <React.Fragment>
          Yes, we offer discounts if you choose annual subscription for any
          plan. Please check annual pricing for details.
        </React.Fragment>
      ),
    },
    {
      ques: (
        <React.Fragment>Does unlimited really mean unlimited?</React.Fragment>
      ),
      answer: (
        <React.Fragment>
          For most of the intents and purposes, <strong>yes</strong>. It serves
          the purpose for most of our users. Further, some things might be
          restricted due to storage or performance reasons. Please contact us in
          case it happens and we'll look into it.
        </React.Fragment>
      ),
    },
    {
      ques: (
        <React.Fragment>
          Can I upgrade from personal subscription to a Team subscription?
        </React.Fragment>
      ),
      answer: (
        <React.Fragment>
          Yes. Cancel your personal subscription after activating a Team
          subscription and we'll refund the adjusted amount of personal
          subscription.
        </React.Fragment>
      ),
    },
    {
      ques: (
        <React.Fragment>Which payment methods do you accept?</React.Fragment>
      ),
      answer: (
        <React.Fragment>
          We are using <strong>Stripe</strong> as our payment processor. Stripe
          supports majority of credit and debit card networks including{" "}
          <strong>Visa &#38; Mastercard</strong>. American Express and Discover
          card users need to contact us at{" "}
          <a
            className="has-no-text-decoration"
            href={`mailto:${GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>{GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}</strong>
          </a>
          .
        </React.Fragment>
      ),
    },
    {
      ques: (
        <React.Fragment>
          Do you offer discounts for open-source project maintainers?
        </React.Fragment>
      ),
      answer: (
        <React.Fragment>
          Yes, we do offer discounts for <b>open-source</b> project maintainers
          on a case-by-case basis. Please send an email to{" "}
          <a
            className="has-no-text-decoration"
            href={`mailto:${GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>{GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}</strong>
          </a>{" "}
          with a description of your project and we'll review.
        </React.Fragment>
      ),
    },
    {
      ques: (
        <React.Fragment> Do you offer discounts for students?</React.Fragment>
      ),
      answer: (
        <React.Fragment>
          Yes, we offer one year free subscription of Requestly Premium to
          current <b>students</b>. Please share your details at{" "}
          <a
            className="has-no-text-decoration"
            href={`mailto:${GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>{GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}</strong>
          </a>
          .
        </React.Fragment>
      ),
    },
    {
      ques: <React.Fragment>I have another query...</React.Fragment>,
      answer: (
        <React.Fragment>
          We are happy to help you. You can live chat with us during our office
          hours or write to us at{" "}
          <a
            className="has-no-text-decoration"
            href={`mailto:${GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>{GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL}</strong>
          </a>
          .
        </React.Fragment>
      ),
    },
  ];
  return (
    <div>
      <br />
      <h1 style={{ textAlign: "center", fontSize: "1.6rem" }}>
        Pricing <span onClick={handleTemp}>&</span> limits FAQ
      </h1>
      <br />
      <div
        style={{
          margin: "0px 5%",
        }}
      >
        <Collapse accordion>
          {FAQs.map((faq, idx) => (
            <Panel header={faq.ques} key={idx}>
              <p>{faq.answer}</p>
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default PricingFAQs;
