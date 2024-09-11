import React from "react";
import Layout from "../components/Layout/Layout";
import { message, Modal } from "antd";
import { useState, useEffect } from "react";
import { Form, Input, Select, Table } from "antd";
import {UnorderedListOutlined, AreaChartOutlined} from '@ant-design/icons';
import axios from "axios";
import Spinner from "../components/Spinner";
import moment from "moment";
import { DatePicker } from "antd";
const {RangePicker} = DatePicker;


const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); //loading state
  const [allTransactions, setAllTransactions] = useState([]); //all transactions state
  const [frequency , setFrequency] = useState('7'); //frequency state
  const [selectedDate, setSelectedDate] = useState([]); //selected date state
  const [type, setType] = useState('all'); //type state

  // table data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },

    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  
  //useEffect
  useEffect(() => {
    //get All transactions
  const getAllTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        console.error("User data:", user); // Debugging line
        return message.error("User not logged in or invalid user data");
      }
      setLoading(true);
      const response = await axios.post(`/transactions/get-transaction`, {
        userid: user.id,
        frequency,
        selectedDate,
        type
      });
      console.log("All transactions:", response.data);
      
      const transactions = Array.isArray(response.data.transactions) 
      ? response.data.transactions.map((transaction, index) => ({
          ...transaction,
          key: transaction._id, // Ensure each transaction has a unique key
        }))
      : [];

      setLoading(false);
      setAllTransactions(transactions);
    } catch (err) {
      console.error("Error during transactions fetch:", err);
      message.error(err.message);
      setLoading(false);
    }
  };

    getAllTransactions();
  }, [frequency, selectedDate, type]);

  //form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        console.error("User data:", user); // Debugging line
        return message.error("User not logged in or invalid user data");
      }
      setLoading(true);
      const payload = { ...values, userid: user.id };
      await axios.post("/transactions/add-transaction", payload);
      setLoading(false);
      message.success("Transaction added successfully");
      setShowModal(false);
    } catch (err) {
      console.error("Error during transaction submission:", err);
      message.error(err.message);
      setLoading(false);
    }
  };
  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values)=>{setFrequency(values)}}>
            <Select.Option value='7'>Last 1 Week</Select.Option>
            <Select.Option value='30'>Last 1 Month</Select.Option>
            <Select.Option value='365'>Last 1 Year</Select.Option>
            <Select.Option value ='custom'>Custom</Select.Option>
          </Select>
          {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values)=>{setSelectedDate(values)}}/>}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values)=>{setType(values)}}>
            <Select.Option value='all'>ALL</Select.Option>
            <Select.Option value='income'>INCOME</Select.Option>
            <Select.Option value='expense'>EXPENSE</Select.Option>
          </Select>
        </div>
        <div>
          <div>
            <UnorderedListOutlined style={{fontSize: '20px'}}/>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add new
          </button>
        </div>
      </div>
      <div className="content">
        <Table columns={columns} dataSource={allTransactions} />
      </div>
      <Modal
        title="Add Transaction"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="foods">Foods</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="fees">Fees</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
