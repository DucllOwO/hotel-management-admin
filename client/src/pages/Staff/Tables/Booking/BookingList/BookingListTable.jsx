import React, { useEffect, useState } from "react";
import "../../index.css";
import { Table, Button, Modal, Form, Input, DatePicker } from "antd";
import "./bookingListtable.css";
import dayjs from "dayjs";
import BookingListExpand from "../../../../../components/ExpandedTable/BookingListExpand";
import ErrorAlert from "../../../../../components/Error/Alert/ErrorAlert";
import SuccessAlert from "../../../../../components/Success/SusscessAlert.jsx/SuccessAlert";
import {
  createReceipt,
  getInventory,
  getRoomByBookingID,
  updateBookingStatus,
  updateRoomStatus,
} from "../../../../../api/BookingListAPI";
import DetailForm from "../../../../../components/Form/DetailForm/DetailForm";
import CheckButton from "../../../../../components/IconButton/CheckButton/CheckButton";
import CancelButton from "../../../../../components/IconButton/CancelButton/CancelButton";
import { useContext } from "react";
import { AppContext } from "../../../../../context/AppContext";
import BookingListForm from "../../../../../components/Form/BookingListForm";
import { fetchEmployeeByUsername } from "../../../../../api/EmployeeAPI";
import { getReceiptByBookingID, updateReceipt } from "../../../../../api/receiptAPI";

const DATE_FORMAT_FULL = "HH:mm DD-MM-YYYY";
const DATE_FORMAT = "DD-MM-YYYY";

const BookingListTable = ({
  booking,
  setBooking,
  setStatus,
  status,
  isLoading,
}) => {
  const [bookingSearchDay, setBookingSearchDay] = useState(
    booking.map((value) => value)
  );
  useEffect(() => {
    setBookingSearchDay(booking.map((value) => value));
  }, [booking]);

  const [isCheckout, setIsCheckout] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [selectedBooking, setSelectedBooking] = useState({});
  const [usedRoom, setUsedRoom] = useState([]);
  const [usedService, setUsedService] = useState([]);
  const [currentReceipt, setCurrentReceipt] = useState({});
  // const [form] = Form.useForm();
  const [infoForm] = Form.useForm();
  const { user } = useContext(AppContext);
  const [searchedText, setSearchedText] = useState("");
  // const [isShowReceipt, setShowReceipt] = useState(false);

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
      align: "center",
      sorter: (a, b) => a.id - b.id,
    },
    {
      key: "2",
      title: "Kh??ch h??ng",
      // width: "20%",
      align: "center",
      filteredValue: [searchedText],
      // sorter: (a, b) => a.customer_id.localeCompare(b.customer_id),
      sorter: (a, b) => a.customer_id - b.customer_id,
      onFilter: (value, record) => {
        return (
          String(record.id)
            .toLocaleLowerCase()
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
            .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
            .replace(/??|??|???|???|??/g, "i")
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
            .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
            .replace(/???|??|???|???|???/g, "y")
            .replace(/??/g, "d")
            .includes(value.toLocaleLowerCase()) ||
          String(record.customer_id)
            .toLocaleLowerCase()
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
            .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
            .replace(/??|??|???|???|??/g, "i")
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
            .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
            .replace(/???|??|???|???|???/g, "y")
            .replace(/??/g, "d")
            .includes(value.toLocaleLowerCase()) ||
          String(record.book_from)
            .toLocaleLowerCase()
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
            .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
            .replace(/??|??|???|???|??/g, "i")
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
            .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
            .replace(/???|??|???|???|???/g, "y")
            .replace(/??/g, "d")
            .includes(value.toLocaleLowerCase()) ||
          String(record.book_to)
            .toLocaleLowerCase()
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
            .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
            .replace(/??|??|???|???|??/g, "i")
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
            .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
            .replace(/???|??|???|???|???/g, "y")
            .replace(/??/g, "d")
            .includes(value.toLocaleLowerCase()) ||
          String(record.room_id)
            .toLocaleLowerCase()
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
            .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
            .replace(/??|??|???|???|??/g, "i")
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
            .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
            .replace(/???|??|???|???|???/g, "y")
            .replace(/??/g, "d")
            .includes(value.toLocaleLowerCase())
        );
      },
      dataIndex: "customer_id",
      render: (text, record) => {
        return <p>{text}</p>;
      },
    },
    {
      key: "3",
      title: "T??? ng??y",
      dataIndex: "book_from",
      // width: "20%",
      align: "center",
      sorter: (a, b) => a.book_from.localeCompare(b.book_from),
      render: (text, record) => {
        return (
          dayjs(convertToValidDateString(text))
            // .startOf("day")
            .format(DATE_FORMAT_FULL)
        );
      },
    },
    {
      key: "4",
      title: "?????n ng??y",
      dataIndex: "book_to",
      // width: "20%",
      align: "center",
      sorter: (a, b) => a.book_to.localeCompare(b.book_to),
      render: (text, record) => {
        return dayjs(convertToValidDateString(text)).format(DATE_FORMAT_FULL);
      },
    },
    {
      key: "6",
      title: "Thao t??c",
      render: (_, record) => {
        if (status === "0")
          return (
            <>
              <div className="btnWrap">
                <CheckButton
                  title="Nh???n ph??ng"
                  onCheckButton={async () => {
                    setSelectedBooking(record);
                    onCheckInButtonHandle(record);
                  }}
                ></CheckButton>
                <CancelButton
                  title="H???y"
                  onCancelButton={() => {
                    setSelectedBooking(record);
                    onCancelButtonHandle(record);
                  }}
                ></CancelButton>
              </div>
            </>
          );
        else if (status === "1")
          return (
            <>
              <div className="btnWrap">
                <CheckButton
                  title="Tr??? ph??ng"
                  onCheckButton={() => {
                    setSelectedBooking(record);
                    onCheckOutButtonHandle(record);
                  }}
                ></CheckButton>
              </div>
            </>
          );
        else return <></>;
      },
    },
  ];

  const columnsNoAction = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
      align: "center",
      sorter: (a, b) => a.id - b.id,
    },
    {
      key: "2",
      title: "Kh??ch h??ng",
      align: "center",
      filteredValue: [searchedText],
      // sorter: (a, b) => a.customer_id.localeCompare(b.customer_id),
      sorter: (a, b) => a.customer_id - b.customer_id,
      onFilter: (value, record) => {
        return (
          String(record.id)
            .toLocaleLowerCase()
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
            .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
            .replace(/??|??|???|???|??/g, "i")
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
            .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
            .replace(/???|??|???|???|???/g, "y")
            .replace(/??/g, "d")
            .includes(value.toLocaleLowerCase()) ||
          String(record.customer_id)
            .toLocaleLowerCase()
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
            .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
            .replace(/??|??|???|???|??/g, "i")
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
            .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
            .replace(/???|??|???|???|???/g, "y")
            .replace(/??/g, "d")
            .includes(value.toLocaleLowerCase()) ||
          String(record.book_from)
            .toLocaleLowerCase()
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
            .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
            .replace(/??|??|???|???|??/g, "i")
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
            .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
            .replace(/???|??|???|???|???/g, "y")
            .replace(/??/g, "d")
            .includes(value.toLocaleLowerCase()) ||
          String(record.book_to)
            .toLocaleLowerCase()
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
            .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
            .replace(/??|??|???|???|??/g, "i")
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
            .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
            .replace(/???|??|???|???|???/g, "y")
            .replace(/??/g, "d")
            .includes(value.toLocaleLowerCase()) ||
          String(record.room_id)
            .toLocaleLowerCase()
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
            .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
            .replace(/??|??|???|???|??/g, "i")
            .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
            .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
            .replace(/???|??|???|???|???/g, "y")
            .replace(/??/g, "d")
            .includes(value.toLocaleLowerCase())
        );
      },
      dataIndex: "customer_id",
      render: (text, record) => {
        return <p>{text}</p>;
      },
    },
    {
      key: "3",
      title: "T??? ng??y",
      dataIndex: "book_from",
      align: "center",
      sorter: (a, b) => a.book_from.localeCompare(b.book_from),
      render: (text, record) => {
        return dayjs(convertToValidDateString(text)).format(DATE_FORMAT_FULL);
      },
    },
    {
      key: "4",
      title: "?????n ng??y",
      dataIndex: "book_to",
      align: "center",
      sorter: (a, b) => a.book_to.localeCompare(b.book_to),
      render: (text, record) => {
        return dayjs(convertToValidDateString(text)).format(DATE_FORMAT_FULL);
      },
    },
  ];

  const onCheckOutButtonHandle = (record) => {
    Modal.confirm({
      title: "X??c nh???n kh??ch tr??? ph??ng?",
      okText: "????ng",
      okType: "danger",
      onOk: () => {
        setIsCheckout(true);
        // setSelectedBooking(record);
        // updateBookingStatus(user?.position, "2", record.id)
        //   .then((data) => {
        //     SuccessAlert("Tr??? ph??ng th??nh c??ng");
        //     setBooking((prev) =>
        //       prev.filter((value) => {return value.id !== record.id})
        //     )
        //   })
        //   .catch((value) => {
        //     ErrorAlert("Tr??? ph??ng th???t b???i");
        //     throw value;
        //   })
      },
    });
  };
  
  const onCancelButtonHandle = (record) => {
    Modal.confirm({
      title: "B???n c?? ch???c mu???n hu??? phi???u ?????t ph??ng n??y?",
      okText: "????ng",
      okType: "danger",
      onOk: () => {
        updateBookingStatus(user?.position, "3", record.id)
          .then((data) => {
            SuccessAlert("Hu??? ?????t ph??ng th??nh c??ng");
            setBooking((prev) =>
              prev.filter((value) => {
                return value.id !== record.id;
              })
            );
          })
          .catch((value) => {
            ErrorAlert("Hu??? ?????t ph??ng th???t b???i");
            throw value;
          });
      },
    });
  };
  const onCheckInButtonHandle = (record) => {
    Modal.confirm({
      title: "X??c nh???n kh??ch nh???n ph??ng?",
      okText: "????ng",
      okType: "danger",
      onOk: async () => {
        let rentCost = 0;
        let tempEmployee;
        
        fetchEmployeeByUsername(user?.position, user?.account.username)
        .then((data) => {
          setCurrentEmployee(data.data);
          console.log(data.data);
          tempEmployee = JSON.parse(JSON.stringify(data.data));
        })
        .catch(() => {
          ErrorAlert("L???y d??? li???u nh??n vi??n kh??ng th??nh c??ng");
        });

        getRoomByBookingID(user?.position, record.id).then(
          (data) => {
            console.log(data.data);
            const rentRoomArray = calcCheckInRentCost(data.data, record);
            console.log(rentRoomArray);
            rentRoomArray.forEach((value) => {
              console.log(value);
              rentCost = rentCost + value.price;
              updateRoomStatus(user?.position, value.id, {status: "1"})
              .catch(()=> {
                ErrorAlert("Thay ?????i tr???ng th??i ph??ng kh??ng th??nh c??ng")
              });
            });
            setUsedRoom(rentRoomArray);
            createReceiptFunc(rentCost, tempEmployee, record);
          }
        ).catch(() => {
          ErrorAlert("L???y d??? li???u ph??ng kh??ng th??nh c??ng")
        });

        updateBookingStatus(user?.position, "1", record.id)
          .then((data) => {
            SuccessAlert("Nh???n ph??ng th??nh c??ng");
            setBooking((prev) =>
              prev.filter((value) => {
                return value.id !== record.id;
              })
            );
          })
          .catch((value) => {
            ErrorAlert("Nh???n ph??ng th???t b???i");
            throw value;
          });
      },
    });
  };
  
  const createReceiptFunc = async (
    rentCost,
    currentEmployeeTemp,
    booking
  ) => {
    const newReceipt = {
      established_date: dayjs(Date.now()),
      checkin_time: dayjs(Date.now()),
      surcharge: 0,
      service_cost: 0,
      rent_cost: rentCost,
      total_cost: rentCost,
    };
    await createReceipt(
      user?.position,
      newReceipt,
      booking,
      currentEmployeeTemp
    )
      .then((data) => {
        console.log(data.data);
        SuccessAlert("T???o ho?? ????n th??nh c??ng");
        setBooking((prev) =>
          prev.filter((value) => value !== booking)
        );
        // setIsCheckout(false);
        // setShowReceipt(true);
        // infoForm.resetFields();
        updateBookingStatus(user?.position, "1", booking.id);
        // console.log(usedRoom);
        // console.log(usedService);
      })
      .catch((error) => {
        ErrorAlert("???? x???y ra l???i khi t???o ho?? ????n");
        throw error;
      });
  };
  const calcCheckInRentCost = (usedRoom, booking) => {
    return usedRoom.map((value) => {
      if (dayjs(booking.book_from).hour() === 14) 
        {
          if(dayjs(Date.now()) < dayjs(booking.book_from))
          {
            console.log("gi?? ng??y s???m");
            const price =
              Math.ceil(
                dayjs(booking.book_from).diff(dayjs(Date.now()), "hour", true)
              ) * value.hour_price +
              Math.ceil(
                dayjs(booking.book_to).diff(
                  dayjs(booking.book_from),
                  "day"
                )
              ) *
                value.one_day_price;
            return {
              id: value.id,
              room_name: value.room_name,
              room_type: value.room_type,
              area: value.area,
              price: price,
            };
          }
          else{
            console.log("gi?? ng??y ????ng");
            // const a = Math.ceil(
            //   dayjs(booking.book_to).diff(
            //     dayjs(booking.book_from),
            //     "day"
            //   )
            // )
            const price =
              Math.ceil(
                dayjs(booking.book_to).diff(
                  dayjs(booking.book_from),
                  "day"
                )
              ) *
                value.one_day_price;
            return {
              id: value.id,
              room_name: value.room_name,
              room_type: value.room_type,
              area: value.area,
              price: price,
            };
          } 
      }
      else if(dayjs(booking.book_from).hour() === 21)
      {
        if(dayjs(Date.now()) < dayjs(booking.book_from))
        {
          console.log("gi?? ????m s???m");
          const price =
            Math.ceil(
              dayjs(booking.book_from).diff(dayjs(Date.now()), "hour", true)
            ) * value.hour_price +
            value.overnight_price;
          return {
            id: value.id,
            room_name: value.room_name,
            room_type: value.room_type,
            area: value.area,
            price: price,
          };
        }
        else
        {
          console.log("gi?? ????m");
          const price = value.overnight_price;
          return {
            id: value.id,
            room_name: value.room_name,
            room_type: value.room_type,
            area: value.area,
            price: price,
          };
        }
      }
      else {
        console.log("gi?? gi???");
        const price = value.first_hour_price +
          (dayjs(booking.book_to).diff(dayjs(booking.book_from), "hour") -
            1) *
            value.hour_price;
        console.log(price);
        return {
          id: value.id,
          room_name: value.room_name,
          room_type: value.room_type,
          area: value.area,
          price: price,
        };
      }
    })
  }
  const handleOKModal = async () => {
    //Fetch employee information
    let serviceCost = 0;
    // console.log(selectedBooking);
    //fetch service used
    await getInventory(user?.position, selectedBooking.id)
      .then(async (data) => {
        console.log(data.data);
        if (data.data) {
          data.data.forEach((value) => {
            value.inventory_detail.forEach((item) => {
              const newServiceCost = item.price * item.amount;
              serviceCost = serviceCost + newServiceCost;
              return {
                item_name: item.item_id.name,
                amount: item.amount,
                price: item.price,
                total_cost: newServiceCost,
              };
            })
          })
        }
      })
      .catch(() => {
        ErrorAlert("L???y d??? li???u d???ch v??? th???t b???i");
      });
    updateReceiptFunc(serviceCost);

    
  };
  const updateReceiptFunc = async (serviceCost) => {
    let rentCost = 0;
    let totalCost = 0;
    let receiptID
    let newReceipt;
    
    getReceiptByBookingID(
      user?.position, 
      selectedBooking.id)
      .then((data) => {
        setCurrentReceipt(data.data);
        totalCost = data.data.total_cost;
        rentCost = data.data.rent_cost;
        receiptID = data.data.id
        getRoomByBookingID(user?.position, selectedBooking.id).then(
          (data) => {
            console.log(data.data);
            const rentRoomArray = calcCheckOutRentCost(data.data);
            console.log(rentRoomArray);
            console.log(serviceCost);
            rentRoomArray.forEach((value) => {
              console.log(value);
              rentCost = rentCost + value.additionPrice;
              updateRoomStatus(user?.position, value.id, {status: "0"});
            });
            setUsedRoom(rentRoomArray);
            infoForm.validateFields()
              .then(async (data) => {
                if (data.surcharge) totalCost = rentCost + data.surcharge;
                  newReceipt = {
                  payment_method: data.method,
                  checkout_time: dayjs(Date.now()),
                  note: data.note,
                  surcharge: data.surcharge,
                  service_cost: serviceCost,
                  rent_cost: rentCost,
                  total_cost: totalCost,
                };
                updateReceipt(  
                  user?.position,
                  receiptID,
                  newReceipt,
                )
                  .then((data) => {
                    console.log(data.data);
                    SuccessAlert("Tr??? ph??ng th??nh c??ng");
                    setBooking((prev) =>
                      prev.filter((value) => value !== selectedBooking)
                    );
                    setIsCheckout(false);
                    // setShowReceipt(true);
                    infoForm.resetFields();
                    updateBookingStatus(user?.position, "2", selectedBooking.id);
                    // console.log(usedRoom);
                    // console.log(usedService);
                  })
                  .catch((error) => {
                    ErrorAlert("???? x???y ra l???i khi t???o ho?? ????n");
                    throw error;
                  });
              }).catch(() => {
                ErrorAlert("Vui l??ng nh???p c??c th??ng tin c??n thi???u");
              })
          }).catch(() => 
          {
            ErrorAlert("L???y d??? li???u ph??ng s??? d???ng kh??ng th??nh c??ng");
        })
      })
      .catch(()=>{
        ErrorAlert("L???y d??? li???u ho?? ????n kh??ng th??nh c??ng")
    })
    
    
    
    
  }
  
  
  const calcCheckOutRentCost = (usedRoom) => {
    return usedRoom.map((value) => {
      if (dayjs(selectedBooking.book_from).hour() === 14) 
      {
        if (
              dayjs(Date.now()) >= dayjs(selectedBooking.book_to) &&
              dayjs(Date.now()).hour() < 17
            ) 
        {
          console.log("gi?? ng??y checkout tr??? ph??? thu");
          const additionPrice =
            Math.ceil(dayjs(Date.now()).diff(dayjs(selectedBooking.book_to), "hour", true)) * value.hour_price;
          return {
            id: value.id,
            room_name: value.room_name,
            room_type: value.room_type,
            area: value.area,
            additionPrice: additionPrice,
          };
        }
        else if (
          dayjs(Date.now()) >= dayjs(selectedBooking.book_to) &&
          dayjs(Date.now()).hour() >= 17)
        {
          console.log("gi?? ng??y checkout tr??? th??m 1 ng??y");
          const additionPrice = value.one_day_price;
              return {
                id: value.id,
                room_name: value.room_name,
                room_type: value.room_type,
                area: value.area,
                additionPrice: additionPrice,
              };
        }
      }
      else if (dayjs(selectedBooking.book_from).hour() === 21)  
      {
        if (
          dayjs(Date.now()) >= dayjs(selectedBooking.book_to) &&
          dayjs(Date.now()).hour() < 17
        ) {
          console.log("tr??? tr??? ph??? thu");
          const additionPrice = Math.ceil(dayjs(Date.now()).diff(dayjs(selectedBooking.book_to), "hour", true)) * value.hour_price;
          return {
            id: value.id,
            room_name: value.room_name,
            room_type: value.room_type,
            area: value.area,
            additionPrice: additionPrice,
          };
        }
            //night checkout late become 1 day
        else {
          console.log("tr??? tr??? 1 ng??y");

          const additionPrice = value.one_day_price;
          return {
            id: value.id,
            room_name: value.room_name,
            room_type: value.room_type,
            area: value.area,
            additionPrice: additionPrice,
          };
        }
      }           
    });
  };

  const handleCancelModal = () => {
    setUsedRoom([]);
    setUsedService([]);
    setIsCheckout(false);
    // setShowReceipt(false);
  };
  function modalJSX() {
    return (
      <Modal
        title="Tr??? ph??ng"
        open={true}
        okText="X??c nh???n"
        cancelText="H???y"
        onOk={handleOKModal}
        onCancel={handleCancelModal}
        width="40%"
      >
        <BookingListForm form={infoForm} />
      </Modal>
    );
  }
  // function receiptJSX() {
  //   return (
  //     <Modal
  //       title="Ho?? ????n"
  //       open={true}
  //       footer={null}
  //       onOk={handleCancelModal}
  //       onCancel={handleCancelModal}
  //       width="60%"
  //     >
  //       <DetailForm
  //         receipt={receipt}
  //         usedRoom={usedRoom}
  //         usedService={usedService}
  //         rowIndex={0}
  //       />
  //     </Modal>
  //   );
  // }

  return (
    <div className="table">
      <>{isCheckout ? modalJSX() : null}</>
      {/* <>{isShowReceipt ? receiptJSX() : null}</> */}
      {/* <Button onClick={onAddButton} type='primary'>Add</Button> */}
      <div className="buttonContainer">
        <div className="headerButtons">
          <Button
            type={status === "0" ? "primary" : "default"}
            className="headerBtn"
            onClick={() => {
              setStatus("0");
            }}
          >
            ??ang ?????i
          </Button>
          <Button
            type={status === "1" ? "primary" : "default"}
            className="headerBtn"
            onClick={() => {
              setStatus("1");
            }}
          >
            ??ang ph???c v???
          </Button>
          <Button
            type={status === "2" ? "primary" : "default"}
            className="headerBtn"
            onClick={() => {
              setStatus("2");
            }}
          >
            Ho??n th??nh
          </Button>
          <Button
            type={status === "3" ? "primary" : "default"}
            className="headerBtn"
            onClick={() => {
              setStatus("3");
            }}
          >
            ???? hu???
          </Button>
        </div>
        <div>
          {/* <Button
            onClick={() => {
              console.log(status === "2");
            }}
          ></Button> */}
          <DatePicker
            placeholder="Ch???n th???i gian"
            onChange={(dayjsObj) => {
              console.log(bookingSearchDay);
              console.log(dayjsObj);
              if (dayjsObj)
                setBookingSearchDay(
                  booking.filter((value) => {
                    const startOfDay = dayjsObj.startOf("day");
                    const endOfDay = dayjsObj.endOf("day");
                    const dayToCampare = dayjs(value.book_to);
                    console.log(dayToCampare.isBetween(startOfDay, endOfDay));
                    if (dayToCampare.isBetween(startOfDay, endOfDay))
                      return true;
                    return false;
                  })
                );
              else setBookingSearchDay(booking);
            }}
            picker="date"
            format={DATE_FORMAT}
            style={{ marginRight: "5px" }}
          ></DatePicker>
          <Input.Search
            onSearch={(value) => {
              setSearchedText(value);
            }}
            onChange={(e) => {
              setSearchedText(e.target.value);
            }}
            placeholder="T??m ki???m"
            className="searchInput"
            style={{ width: 264 }}
          />
          {/* <Button
            onClick={() => {}}
            className="addButton"
            type="primary"
            ghost
            icon={<PlusOutlined />}
          >
            T???o m???i
          </Button> */}
        </div>
      </div>
      <Table
        loading={isLoading}
        rowKey={(row) => row.id}
        showSorterTooltip={false}
        columns={status === "2" || status === "3" ? columnsNoAction : columns}
        dataSource={bookingSearchDay}
        scroll={{ y: "60vh", x: "100%" }}
        expandable={{
          expandedRowRender: (record) => {
            return <BookingListExpand roomTypeSource={record.room_type} />;
          },
        }}
      ></Table>
    </div>
  );

  function convertToValidDateString(date) {
    return date.replace("T", " ");
  }
};

export default BookingListTable;
