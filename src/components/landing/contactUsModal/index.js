import React, { useState } from "react";
import { Form, Input, Modal, Button, Tabs, Divider } from "antd";
import { InlineWidget } from "react-calendly";
import { SendOutlined } from "@ant-design/icons";
import { toast } from "utils/Toast";
import { getFunctions, httpsCallable } from "firebase/functions";

const ContactUsModal = ({ isOpen, handleToggleModal }) => {
  // Component State
  const [isSubmitProcess, setIsSubmitProcess] = useState(false);

  const onFinish = (values) => {
    setIsSubmitProcess(true);

    const functions = getFunctions();
    const contactUsForm = httpsCallable(functions, "contactUsForm");

    contactUsForm(values)
      .then(() => {
        toast.success("We will contact you within 6 hours");
        setIsSubmitProcess(false);
        handleToggleModal();
      })
      .catch(() => {
        setIsSubmitProcess(false);
        toast.error("Please check the details");
      });
  };

  const onFinishFailed = () => {
    toast.error("Please check the details");
  };

  const { TabPane } = Tabs;

  return (
    <Modal
      title="Contact Us"
      visible={isOpen}
      onCancel={handleToggleModal}
      footer={null}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Schedule a Call" key="1">
          <InlineWidget
            url="https://calendly.com/requestly-enterprise/requestly-premium-support"
            pageSettings={{
              hideEventTypeDetails: true,
              hideLandingPageDetails: true,
            }}
          />
        </TabPane>

        <TabPane tab="Email Us" key="3">
          <center>
            <p>
              Please write to{" "}
              <a
                target="_blank"
                href="mailto:sachin@requestly.io"
                rel="noreferrer"
              >
                sachin@requestly.io
              </a>
            </p>
          </center>

          <Divider plain>or fill the form here</Divider>

          <Form
            name="contact-us-enterprise"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input type={"email"} />
            </Form.Item>

            <Form.Item
              name="message"
              label="Message"
              rules={[
                { required: false, message: "Please input your message!" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={isSubmitProcess}
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ContactUsModal;
