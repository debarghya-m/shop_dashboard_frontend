import React, { useState, useEffect } from "react";
import "./home.css";
import ClockLoader from "react-spinners/ClipLoader";
import axios from "axios";
const Home = () => {
  const [tab, setTab] = useState("recharge");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterUser, setFilterUser] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [details, setDetails] = useState("");
  const fetchUsers = () => {
    axios.get("http://13.235.247.105:3000/users").then(
      (data) => {
        setUsers(data.data.reverse());
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const fetchTransactions = () => {
    axios.get("http://13.235.247.105:3000/transactions").then(
      (data) => {
        setTransactionDetails(data.data.reverse());
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const setId = (id) => {
    if (details === id) {
      setDetails("");
    } else {
      setDetails(id);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchTransactions();
  }, []);
  const filterFunction = () => {
    let input, filter, li, i, div, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    li = div.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      txtValue = li[i].textContent || li[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };
  const filterUserByName = () => {
    let input = document.getElementById("search-name");
    if (input.value) {
      setSearchKey(input.value);
      let data = users.filter((user) => {
        return user.name.toLowerCase().includes(input.value.toLowerCase());
      });
      setFilterUser(data);
    }
  };
  const [form, setForm] = useState({
    name: "",
    boxId: "",
    area: "",
    dueAmount: "",
    mobile: "",
    status: true,
  });
  const [transaction, setTransaction] = useState({
    boxId: "",
    amount: "",
    date_time: "",
    userId: "",
    name: "",
  });

  const onUpdateField = (e) => {
    const nextFormState = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(nextFormState);
  };
  const onUpdateTransaction = (e) => {
    const nextFormState = {
      ...transaction,
      [e.target.name]: e.target.value,
    };
    setTransaction(nextFormState);
  };
  const selectBoxId = (boxId, index) => {
    let input = document.getElementById("myInput");
    input.value = boxId;
    let data = users[index];
    const nextFormState = {
      ...transaction,
      ["boxId"]: boxId,
      ["name"]: data.name,
      ["userId"]: data._id,
      ["date_time"]: new Date().toISOString(),
    };
    setTransaction(nextFormState);
  };
  const onSubmitTransaction = (e) => {
    e.preventDefault();
    if (transaction.boxId === "") {
      alert("Please enter correct details !");
    } else if (document.getElementById("myInput").value !== transaction.boxId) {
      setLoading(true);
      let value = document.getElementById("myInput").value;
      let data = users.filter((user) => {
        return user.boxId === value;
      });
      if (data.length === 0) {
        alert("Please enter correct details !");
        return;
      }
      console.log(data[0]);
      transaction["amount"] = transaction.amount;
      transaction["boxId"] = data[0].boxId;
      transaction["name"] = data[0].name;
      transaction["userId"] = data[0]._id;
      transaction["date_time"] = new Date().toISOString();
      axios.post("http://13.235.247.105:3000/transactions", transaction).then(
        (res) => {
          console.log(res);
          let updatedData = {
            lastRecharge: transaction.date_time,
          };
          let input = document.getElementById("myInput");
          input.value = "";
          setTransaction({
            boxId: "",
            amount: "",
            date_time: "",
            userId: "",
            name: "",
          });
          if (data.length > 0) {
            axios
              .patch(
                "http://13.235.247.105:3000/users/" + data[0]._id,
                updatedData
              )
              .then(
                (res) => {
                  console.log(res);
                  fetchUsers();
                },
                (err) => {
                  console.log(err);
                }
              );
          }
          setLoading(false);
          fetchTransactions();
          alert("Recharge Saved Successfully !");
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      setLoading(true);
      axios.post("http://13.235.247.105:3000/transactions", transaction).then(
        (res) => {
          console.log(res);
          let updatedData = {
            lastRecharge: transaction.date_time,
          };
          let data = users.filter((user) => {
            return user.boxId === transaction.boxId;
          });
          let input = document.getElementById("myInput");
          input.value = "";
          setTransaction({
            boxId: "",
            amount: "",
            date_time: "",
            userId: "",
            name: "",
          });
          if (data.length > 0) {
            axios
              .patch(
                "http://13.235.247.105:3000/users/" + data[0]._id,
                updatedData
              )
              .then(
                (res) => {
                  console.log(res);
                  fetchUsers();
                },
                (err) => {
                  console.log(err);
                }
              );
          }
          setLoading(false);
          fetchTransactions();
          alert("Recharge Saved Successfully !");
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  const onSubmitForm = (e) => {
    e.preventDefault();
    if (form.name === "" || form.boxId === "") {
      alert("Please enter correct details !");
    } else {
      setLoading(true);
      axios.post("http://13.235.247.105:3000/users", form).then(
        (res) => {
          console.log(res);
          e.target.area.value = "";
          setForm({
            name: "",
            boxId: "",
            area: "",
            dueAmount: "",
            mobile: "",
            status: true,
          });
          setLoading(false);
          fetchUsers();
          alert("Customer Added Successfully !");
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };
  return (
    <>
      <div className="home">
        {loading ? (
          <div className="loader">
            <ClockLoader className="spinner" color="#3b5998" />
          </div>
        ) : null}

        <span className="home__welcome">Welcome, Disha Cable Network</span>
        <ul className="home__nav">
          <li
            className={tab === "recharge" ? "nav-item active" : "nav-item"}
            onClick={() => setTab("recharge")}
          >
            Recharge
          </li>
          <li
            className={tab === "customers" ? "nav-item active" : "nav-item"}
            onClick={() => setTab("customers")}
          >
            Customers
          </li>
          <li
            className={tab === "transactions" ? "nav-item active" : "nav-item"}
            onClick={() => setTab("transactions")}
          >
            Transactions
          </li>
        </ul>
        {tab === "recharge" ? (
          <form className="home__form" onSubmit={onSubmitTransaction}>
            <div id="myDropdown" className="home__form-field">
              <label className="form-lable">Box ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search Box ID"
                id="myInput"
                onKeyUp={filterFunction}
              />
              <ul className="form-dropdown">
                {users?.map((user, index) => (
                  <li
                    onClick={() => selectBoxId(user.boxId, index)}
                    key={index}
                  >
                    {user.boxId} ({user.name})
                  </li>
                ))}
              </ul>
            </div>
            <div className="home__form-field">
              <label className="form-lable">Amount</label>
              <input
                className="form-input"
                type="text"
                placeholder="Amount"
                name="amount"
                value={transaction.amount}
                onChange={onUpdateTransaction}
              />
            </div>
            <div className="home__form-btn-grp">
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </div>
          </form>
        ) : null}
        {tab === "customers" ? (
          <div>
            <form className="home__form" onSubmit={onSubmitForm}>
              <div className="home__form-field">
                <label className="form-lable">Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Customer Name"
                  name="name"
                  value={form.name}
                  onChange={onUpdateField}
                />
              </div>
              <div className="home__form-field">
                <label className="form-lable">Box Id</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Box Id"
                  name="boxId"
                  value={form.boxId}
                  onChange={onUpdateField}
                />
              </div>
              <div className="home__form-field">
                <label className="form-lable">Area</label>
                <select
                  className="form-input"
                  name="area"
                  onChange={onUpdateField}
                >
                  <option value="" disabled>
                    Select Area
                  </option>
                  <option value="Bhandari Para">Bhandari Para</option>
                  <option value="Muslim Para">Muslim Para</option>
                  <option value="Bazar">Bazar</option>
                  <option value="Ghosh Para">Ghosh Para</option>
                </select>
              </div>
              <div className="home__form-field">
                <label className="form-lable">Mobile no</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="Mobile No"
                  name="mobile"
                  value={form.mobile}
                  onChange={onUpdateField}
                />
              </div>
              <div className="home__form-field">
                <label className="form-lable">Due Amount</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="Due Amount"
                  name="dueAmount"
                  value={form.dueAmount}
                  onChange={onUpdateField}
                />
              </div>
              <div className="home__form-btn-grp">
                <button className="btn btn-primary" type="submit">
                  Login
                </button>
              </div>
            </form>
            <div className="home__search">
              <label className="form-lable">Search</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search By Name"
                id="search-name"
                onChange={filterUserByName}
              />
            </div>
            <table className="home__table">
              <thead className="table-head">
                <tr className="table-row">
                  <th>Name</th>
                  <th>Box Id</th>
                </tr>
              </thead>
              {searchKey === "" &&
                users?.map((user, index) => (
                  <tbody className="table-body" key={index}>
                    <tr className="table-row" onClick={() => setId(user._id)}>
                      <td>{user.name}</td>
                      <td>{user.boxId}</td>
                    </tr>
                    {details === user._id ? (
                      <tr className="table-row" id={user._id}>
                        <td colSpan={8}>
                          <ul className="table-view">
                            <li>
                              <span>Name:</span>
                              <span>{user.name ? user.name : "NA"}</span>
                            </li>
                            <li>
                              <span>Box ID:</span>{" "}
                              <span>{user.boxId ? user.boxId : "NA"}</span>
                            </li>
                            <li>
                              <span>Area:</span>{" "}
                              <span>{user.area ? user.area : "NA"}</span>
                            </li>
                            <li>
                              <span>Mobile:</span>{" "}
                              <span>{user.mobile ? user.mobile : "NA"}</span>
                            </li>
                            <li>
                              <span>Status:</span>{" "}
                              <span>{user.status ? "Active" : "Closed"}</span>
                            </li>
                            <li>
                              <span>Last Recharge:</span>
                              <span>
                                {user.lastRecharge ? user.lastRecharge : "NA"}
                              </span>
                            </li>
                            <li>
                              <span>Due:</span>{" "}
                              <span>
                                {user.dueAmount ? user.dueAmount : "0"}
                              </span>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                ))}
              {searchKey !== "" &&
                filterUser?.map((user, index) => (
                  <tbody className="table-body" key={index}>
                    <tr className="table-row" onClick={() => setId(user._id)}>
                      <td>{user.name}</td>
                      <td>{user.boxId}</td>
                    </tr>
                    {details === user._id ? (
                      <tr className="table-row" id={user._id}>
                        <td colSpan={8}>
                          <ul className="table-view">
                            <li>
                              <span>Name:</span>
                              <span>{user.name ? user.name : "NA"}</span>
                            </li>
                            <li>
                              <span>Box ID:</span>{" "}
                              <span>{user.boxId ? user.boxId : "NA"}</span>
                            </li>
                            <li>
                              <span>Area:</span>{" "}
                              <span>{user.area ? user.area : "NA"}</span>
                            </li>
                            <li>
                              <span>Mobile:</span>{" "}
                              <span>{user.mobile ? user.mobile : "NA"}</span>
                            </li>
                            <li>
                              <span>Status:</span>{" "}
                              <span>{user.status ? "Active" : "Closed"}</span>
                            </li>
                            <li>
                              <span>Last Recharge:</span>
                              <span>
                                {user.lastRecharge ? user.lastRecharge : "NA"}
                              </span>
                            </li>
                            <li>
                              <span>Due:</span>{" "}
                              <span>
                                {user.dueAmount ? user.dueAmount : "0"}
                              </span>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                ))}
            </table>
          </div>
        ) : null}
        {tab === "transactions" ? (
          <div>
            <table className="home__table">
              <thead className="table-head">
                <tr className="table-row">
                  <th>Name</th>
                  <th>Box Id</th>
                </tr>
              </thead>
              {transactionDetails?.map((data, index) => (
                <tbody className="table-body" key={index}>
                  <tr className="table-row" onClick={() => setId(data._id)}>
                    <td>{data.name}</td>
                    <td>{data.boxId}</td>
                  </tr>
                  {details === data._id ? (
                    <tr className="table-row" id={data._id}>
                      <td colSpan={8}>
                        <ul className="table-view">
                          <li>
                            <span>Name:</span>
                            <span>{data.name ? data.name : "NA"}</span>
                          </li>
                          <li>
                            <span>Box ID:</span>{" "}
                            <span>{data.boxId ? data.boxId : "NA"}</span>
                          </li>
                          <li>
                            <span>Amount:</span>
                            <span>{data.amount ? data.amount : "NA"}</span>
                          </li>
                          <li>
                            <span>Date:</span>{" "}
                            <span>
                              {data.date_time ? data.date_time : "NA"}
                            </span>
                          </li>
                        </ul>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              ))}
            </table>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Home;
