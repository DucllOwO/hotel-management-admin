import React, { useState } from "react";
import "../index.css";
import { Table, Button, Modal, Form, Input, Slider, Select } from "antd";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import RoomTypeForm from "../../../../components/Form/RoomTypeForm";
import EditButton from "../../../../components/IconButton/EditButton/EditButton";
import DeleteButton from "../../../../components/IconButton/DeleteButton/DeleteButton";
import RoomTypeExpand from "../../../../components/ExpandedTable/RoomTypeExpand";
import {
  createRoomType,
  hideRoomType,
  updateRoomType,
} from "../../../../api/RoomTypeAPI";
import ErrorAlert from "../../../../components/Error/Alert/ErrorAlert";
import LocalStorage from "../../../../Utils/localStorage";
import {
  createRoomFeaturesByRoomTypeID,
  getRoomUtilsByRoomTypeID,
  updateRoomFeaturesByRoomTypeID,
} from "../../../../api/hasRoomFeatures";
import SuccessAlert from "../../../../components/Success/SusscessAlert.jsx/SuccessAlert";

const RoomTypeTable = ({
  roomTypes,
  setRoomTypes,
  positionUser,
  isLoading,
}) => {
  const [isModalVisible, setIsModalVisible] = useState();

  const [roomUtils, setRoomUtils] = useState(
    createUtilsCheckArr(LocalStorage.getItem("utils") || [])
  );

  const [oldRoomUtils, setOldRoomUtils] = useState([]);

  const [isUtilEmpty, setIsUtilEmpty] = useState(false);

  const [currentSelectedID, setCurrentSelectedID] = useState(null);

  const [form] = Form.useForm();

  const [searchedText, setSearchedText] = useState("");

  const [customerfilter, setCustomerFilter] = useState(null);
  const [bedfilter, setBedFilter] = useState(null);
  const [areaFilter, setAreaFilter] = useState(null);

  const [priceFilter, setPriceFilter] = useState("");
  const [sliderFilter, setSliderFilter] = useState([0, 5000000]);

  const maxCustomer = Math.max(
    ...roomTypes.map((roomTypes) => roomTypes.max_customers)
  );
  const bedAmount = Math.max(
    ...roomTypes.map((roomTypes) => roomTypes.bed_amount)
  );
  const area = Math.max(...roomTypes.map((roomTypes) => roomTypes.area));
  const price =
    priceFilter === "Qua ????m"
      ? Math.max(...roomTypes.map((roomTypes) => roomTypes.overnight_price))
      : priceFilter === "Gi??? ?????u ti??n"
      ? Math.max(...roomTypes.map((roomTypes) => roomTypes.first_hour_price))
      : priceFilter === "Gi??? ti???p theo"
      ? Math.max(...roomTypes.map((roomTypes) => roomTypes.hour_price))
      : Math.max(...roomTypes.map((roomTypes) => roomTypes.one_day_price));

  const minCustomer = Math.min(
    ...roomTypes.map((roomTypes) => roomTypes.max_customers)
  );
  const minBedAmount = Math.min(
    ...roomTypes.map((roomTypes) => roomTypes.bed_amount)
  );
  const minArea = Math.min(...roomTypes.map((roomTypes) => roomTypes.area));
  const minPrice =
    priceFilter === "Qua ????m"
      ? Math.min(...roomTypes.map((roomTypes) => roomTypes.overnight_price))
      : priceFilter === "Gi??? ?????u ti??n"
      ? Math.min(...roomTypes.map((roomTypes) => roomTypes.first_hour_price))
      : priceFilter === "Gi??? ti???p theo"
      ? Math.min(...roomTypes.map((roomTypes) => roomTypes.hour_price))
      : Math.min(...roomTypes.map((roomTypes) => roomTypes.one_day_price));

  const items = [
    {
      label: "M???t ng??y",
      value: "M???t ng??y",
    },
    {
      label: "Qua ????m",
      value: "Qua ????m",
    },
    {
      label: "Gi??? ?????u ti??n",
      value: "Gi??? ?????u ti??n",
    },
    {
      label: "Gi??? ti???p theo",
      value: "Gi??? ti???p theo",
    },
  ];

  const maxCustomerMark = {
    [maxCustomer]: maxCustomer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    [minCustomer]: minCustomer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  };
  const bedAmountMark = {
    [minBedAmount]: minBedAmount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    [bedAmount]: bedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  };
  const areaMark = {
    [minArea]: minArea.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    [area]: area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  };

  const priceMark = {
    [minPrice]: minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "??",
    [price]: price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "??",
  };

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
      width: "5%",
      align: "center",
      fixed: "left",
      sorter: (a, b) => a.id - b.id,
    },
    {
      key: "2",
      title: "T??n lo???i ph??ng",
      filteredValue: [searchedText],
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: "20%",
      align: "center",
      onFilter: (value, record) => {
        return String(record.name)
          .toLocaleLowerCase()
          .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a")
          .replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e")
          .replace(/??|??|???|???|??/g, "i")
          .replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o")
          .replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u")
          .replace(/???|??|???|???|???/g, "y")
          .replace(/??/g, "d")
          .includes(value.toLocaleLowerCase());
      },
      dataIndex: "name",
      // filterDropdown: () => {
      //   return (
      //     <>
      //       <div className="filterContainer">
      //         <div>
      //           <Select
      //             style={{ width: "170px" }}
      //             size="medium"
      //             options={items}
      //             filterOption={(input, option) =>
      //               (option?.label ?? "")
      //                 .toLowerCase()
      //                 .includes(input.toLowerCase())
      //             }
      //             optionFilterProp="children"
      //             showSearch
      //             placeholder="Ch???n lo???i ph??ng"
      //             onChange={filterRoomType}
      //           />
      //         </div>
      //         <Button
      //           type="primary"
      //           style={{ marginTop: "10px" }}
      //           onClick={() => {}}
      //         >
      //           Reset
      //         </Button>
      //       </div>
      //     </>
      //   );
      // },
      // filterIcon: () => {
      //   return <FilterOutlined />;
      // },
    },
    {
      key: "3",
      title: "S??? l?????ng kh??ch",
      dataIndex: "max_customers",
      align: "center",
      render: (text, record) => {
        return <p>{text}</p>;
      },
      sorter: (a, b) => a.max_customers - b.max_customers,
      filteredValue: customerfilter !== null ? [customerfilter] : null,
      filterDropdown: ({ clearFilters }) => {
        return (
          <>
            <div className="filterContainer">
              <Slider
                range
                max={maxCustomer}
                min={minCustomer}
                defaultValue={[1, 3]}
                marks={maxCustomerMark}
                onChange={(e) => {
                  setCustomerFilter("");
                  setCustomerFilter(e);
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  setCustomerFilter(null);
                  clearFilters({ closeDropdown: true });
                }}
              >
                Reset
              </Button>
            </div>
          </>
        );
      },
      filterIcon: () => {
        return <FilterOutlined />;
      },
      onFilter: (value, record) => {
        console.log(customerfilter);
        if (customerfilter === null) {
          return record.max_customers;
        } else {
          return (
            record.max_customers >= value[0] && record.max_customers <= value[1]
          );
        }
      },
    },
    {
      key: "4",
      title: "S??? gi?????ng",
      dataIndex: "bed_amount",
      align: "center",
      render: (text, record) => {
        return <p>{text}</p>;
      },
      filteredValue: bedfilter !== null ? [bedfilter] : null,
      sorter: (a, b) => a.bed_amount - b.bed_amount,
      filterDropdown: ({ clearFilters }) => {
        return (
          <>
            <div className="filterContainer">
              <Slider
                range
                defaultValue={[1, 2]}
                max={bedAmount}
                min={minBedAmount}
                marks={bedAmountMark}
                onChange={(e) => {
                  setBedFilter(null);
                  setBedFilter(e);
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  setBedFilter(null);
                  clearFilters({ closeDropdown: true });
                }}
              >
                Reset
              </Button>
            </div>
          </>
        );
      },
      filterIcon: () => {
        return <FilterOutlined />;
      },
      onFilter: (value, record) => {
        console.log(bedfilter);
        if (bedfilter === null) {
          return record.bed_amount;
        } else {
          return record.bed_amount >= value[0] && record.bed_amount <= value[1];
        }
      },
    },
    {
      key: "5",
      title: "Di???n t??ch (m2)",
      dataIndex: "area",
      align: "center",
      sorter: (a, b) => a.area - b.area,
      filteredValue: areaFilter !== null ? [areaFilter] : null,
      filterDropdown: ({ clearFilters }) => {
        return (
          <>
            <div className="filterContainer">
              <Slider
                range
                max={area}
                min={minArea}
                step={10}
                marks={areaMark}
                defaultValue={[10, 30]}
                onChange={(e) => {
                  setAreaFilter(null);
                  setAreaFilter(e);
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  setAreaFilter(null);
                  clearFilters({ closeDropdown: true });
                }}
              >
                Reset
              </Button>
            </div>
          </>
        );
      },
      filterIcon: () => {
        return <FilterOutlined />;
      },
      onFilter: (value, record) => {
        if (areaFilter === null) {
          return record.area;
        } else {
          return record.area >= value[0] && record.area <= value[1];
        }
      },
    },

    {
      key: "6",
      title:
        priceFilter !== "" ? "Gi?? " + priceFilter + " (??)" : "Gi?? M???t ng??y (??)",
      dataIndex:
        priceFilter === "Qua ????m"
          ? "overnight_price"
          : priceFilter === "Gi??? ?????u ti??n"
          ? "first_hour_price"
          : priceFilter === "Gi??? ti???p theo"
          ? "hour_price"
          : "one_day_price",
      filteredValue: priceFilter !== "" ? [priceFilter] : null,
      align: "center",
      width: "20%",
      // sorter: (a, b) => a.total_cost - b.total_cost,
      sorter: (a, b) =>
        priceFilter === "Qua ????m"
          ? a.overnight_price - b.overnight_price
          : priceFilter === "Gi??? ?????u ti??n"
          ? a.first_hour_price - b.first_hour_price
          : priceFilter === "Gi??? ti???p theo"
          ? a.hour_price - b.hour_price
          : a.one_day_price - b.one_day_price,
      filterDropdown: ({ confirm, clearFilters }) => {
        return (
          <>
            <div className="filterContainer">
              <div className="priceSlider">
                <Select
                  style={{ width: 300 }}
                  size="medium"
                  options={items}
                  showSearch
                  defaultValue="M???t ng??y"
                  placeholder="Ch???n ph??n lo???i gi??"
                  onChange={(e) => {
                    setPriceFilter(e);
                  }}
                />
                <Slider
                  tipFormatter={(value) => {
                    return `${value < 0 ? "-" : ""} ${Math.abs(value)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
                  }}
                  step={10000}
                  width={0.8}
                  range
                  min={minPrice}
                  max={price}
                  marks={priceMark}
                  defaultValue={[0, 300000]}
                  onChange={(value) => {
                    setSliderFilter(value);
                    if (priceFilter === "") {
                      setPriceFilter("M???t ng??y");
                    } else {
                      const temp = priceFilter;
                      setPriceFilter("");
                      setPriceFilter(temp);
                    }
                  }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    setPriceFilter("");
                    clearFilters({ closeDropdown: true });
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </>
        );
      },
      filterIcon: () => {
        return <FilterOutlined />;
      },
      onFilter: (value, record) => {
        switch (priceFilter) {
          case "" || "M???t ng??y":
            return (
              record.one_day_price >= sliderFilter[0] &&
              record.one_day_price <= sliderFilter[1]
            );
          case "Qua ????m":
            return (
              record.overnight_price >= sliderFilter[0] &&
              record.overnight_price <= sliderFilter[1]
            );
          case "Gi??? ?????u ti??n":
            return (
              record.first_hour_price >= sliderFilter[0] &&
              record.first_hour_price <= sliderFilter[1]
            );
          case "Gi??? ti???p theo":
            return (
              record.hour_price >= sliderFilter[0] &&
              record.hour_price <= sliderFilter[1]
            );
          default:
            return (
              record.one_day_price >= sliderFilter[0] &&
              record.one_day_price <= sliderFilter[1]
            );
        }
        // if (priceFilter === null) {
        //   return record.one_day_price;
        // } else {
        //   return record.area >= value[0] && record.area <= value[1];
        // }
      },
    },
    {
      key: "7",
      title: "Thao t??c",
      width: "15%",
      render: (_, record) => {
        return (
          <>
            <div className="btnWrap">
              <EditButton
                onEditButton={() => onOpenModalEdit(record)}
              ></EditButton>
              <DeleteButton
                onDeleteButton={() => onDeleteButton(record)}
              ></DeleteButton>
            </div>
          </>
        );
      },
    },
  ];

  const onOpenModalEdit = (record) => {
    setIsModalVisible("edit");
    setCurrentSelectedID(record.id);
    form.setFieldsValue({ ...record });
    getRoomUtilsByRoomTypeID(positionUser, record.id)
      .then(({ data }) => {
        const tempUtilArr = createUtilsCheckEditArr(
          LocalStorage.getItem("utils"),
          data
        );
        setRoomUtils(tempUtilArr);
        setOldRoomUtils(tempUtilArr);
      })
      .catch((error) => {
        console.log(error);
        ErrorAlert("L???y d??? li???u ti???n ??ch c???a lo???i ph??ng th???t b???i!!");
      });
  };

  const handleOkModalAdd = () => {
    if (checkUtilArrEmpty(roomUtils)) {
      form
        .validateFields()
        .then((values) => {
          createRoomType(positionUser, values)
            .then(({ data }) => {
              setRoomTypes((prev) => [...prev, data]);
              createRoomFeaturesByRoomTypeID(
                positionUser,
                data.id,
                getCheckUtil(roomUtils)
              )
                .then((res) => {
                  SuccessAlert("T???o lo???i ph??ng th??nh c??ng");
                  resetAllValue();
                })
                .catch((err) => {
                  console.log(err);
                  ErrorAlert("T???o ti???n ??ch cho lo???i ph??ng th???t b???i!");
                });
            })
            .catch((error) => {
              console.log(error);
              ErrorAlert("T???o lo???i ph??ng th???t b???i!!");
            });
        })
        .catch((error) => console.log(error));
    } else setIsUtilEmpty(true);
  };

  const modalEdit = () => {
    return (
      <Modal
        title="Ch???nh s???a th??ng tin lo???i ph??ng"
        open={true}
        onOk={handleOkModalEdit}
        onCancel={handleCancelModal}
        okText="X??c nh???n"
        cancelText="H???y"
        width="50vw"
      >
        <RoomTypeForm
          form={form}
          utils={roomUtils}
          setUtils={setRoomUtils}
          isUtilEmpty={isUtilEmpty}
        ></RoomTypeForm>
      </Modal>
    );
  };

  const handleOkModalEdit = () => {
    if (checkUtilArrEmpty(roomUtils)) {
      form
        .validateFields()
        .then((values) => {
          updateRoomType(positionUser, currentSelectedID, values)
            .then(({ data }) => {
              // filter old roomtype with new ones
              const [checkUtils, unCheckUtils] = compareUtilCheckArray(
                roomUtils,
                oldRoomUtils
              );
              updateRoomFeaturesByRoomTypeID(
                positionUser,
                currentSelectedID,
                checkUtils,
                unCheckUtils
              )
                .then((res) => {
                  SuccessAlert("C???p nh???t lo???i ph??ng th??nh c??ng");
                  resetAllValue();
                })
                .catch((err) => {
                  ErrorAlert(
                    "C???p nh???t d??? li???u ti???n ??ch c???a lo???i ph??ng th???t b???i!!"
                  );
                });
              setRoomTypes((prev) =>
                prev.map((roomType) => {
                  if (roomType.id == currentSelectedID) return { ...data };
                  return roomType;
                })
              );
            })
            .catch((err) => {
              console.log(err);
              ErrorAlert("C???p nh???t d??? li???u lo???i ph??ng th???t b???i!!");
            });
        })
        .catch((error) => console.log(error));
    } else setIsUtilEmpty(true);
  };

  const modalAdd = () => {
    return (
      <Modal
        title="T???o m???i lo???i ph??ng"
        open={true}
        onOk={handleOkModalAdd}
        onCancel={handleCancelModal}
        okText="X??c nh???n"
        cancelText="H???y"
        width="50vw"
      >
        <RoomTypeForm
          form={form}
          utils={roomUtils}
          setUtils={setRoomUtils}
          isUtilEmpty={isUtilEmpty}
        ></RoomTypeForm>
      </Modal>
    );
  };

  return (
    <div className="table">
      <>
        {isModalVisible === "add" ? modalAdd() : null}
        {isModalVisible === "edit" ? modalEdit() : null}
      </>
      <div className="buttonContainer">
        <div></div>
        <div>
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
          <Button
            onClick={(e) => showModalAdd()}
            className="addButton"
            type="primary"
            ghost
            icon={<PlusOutlined />}
          >
            T???o m???i
          </Button>
        </div>
      </div>
      <Table
        loading={isLoading}
        showSorterTooltip={false}
        columns={columns}
        dataSource={roomTypes}
        scroll={{ y: "60vh", x: "90vw" }}
        rowKey={(row) => row.id}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <RoomTypeExpand
                utils={record.utils}
                firstHourPrice={record.first_hour_price}
                overNightPrice={record.overnight_price}
                oneDayPrice={record.one_day_price}
                hourPrice={record.hour_price}
              />
            );
          },
          onExpand: (expanded, record) => {
            getRoomUtilsByRoomTypeID(positionUser, record.id)
              .then(({ data }) => {
                setRoomTypes((prev) => {
                  return prev.map((roomType) => {
                    if (record.name === roomType.name) {
                      return { ...roomType, utils: data };
                    }
                    return roomType;
                  });
                });
              })
              .catch((error) => {
                console.log(error);
                ErrorAlert("L???y d??? li???u ti???n ??ch c???a lo???i ph??ng th???t b???i!!");
              });
          },
        }}
        pagination={false}
      ></Table>
    </div>
  );

  function getCheckUtil(utils) {
    return utils.filter((util) => util.checked === true);
  }

  // check to ensure util array has at least 1 util is check
  function checkUtilArrEmpty(roomUtils) {
    let hasCheck = false;
    for (const util of roomUtils) {
      if (util.checked) {
        setIsUtilEmpty(false);
        hasCheck = true;
        break;
      }
    }
    return hasCheck;
  }

  function onDeleteButton(record) {
    Modal.confirm({
      title: "B???n c?? ch???c mu???n xo?? d??? li???u?",
      okText: "OK",
      okType: "danger",
      onOk: () => {
        hideRoomType(positionUser, record.id)
          .then((res) => {
            setRoomTypes((pre) => {
              return pre.filter((data) => data.id !== record.id);
            });
            SuccessAlert("X??a th??ng tin lo???i ph??ng th??nh c??ng.");
          })
          .catch((err) => {
            console.log(err);
            ErrorAlert("X??a th??ng tin lo???i ph??ng th???t b???i!!");
          });
      },
    });
  }

  function handleCancelModal() {
    resetAllValue();
  }

  function resetAllValue() {
    setIsModalVisible(false);
    form.resetFields();
    setRoomUtils(createUtilsCheckArr(LocalStorage.getItem("utils")));
    setOldRoomUtils([]);
    setCurrentSelectedID(null);
  }

  function showModalAdd() {
    setIsModalVisible("add");
  }
};

function createUtilsCheckArr(utils = []) {
  return utils.map((util) => {
    return { ...util, checked: false };
  });
}
function createUtilsCheckEditArr(utilsDefault = [], utilsOfRoom = []) {
  return utilsDefault.map((util) => {
    const index = utilsOfRoom.findIndex(
      (utilOfRoom) => utilOfRoom.room_feature.id === util.id
    );

    if (index >= 0) return { ...util, checked: true };
    else return { ...util, checked: false };
  });
}

function compareUtilCheckArray(utils, oldUtils) {
  let checkArr = [];
  let unCheckArr = [];

  utils.forEach((util, index) => {
    if (util.checked === true && oldUtils[index].checked === false)
      checkArr.push(util);
    if (util.checked === false && oldUtils[index].checked === true)
      unCheckArr.push(util);
  });

  return [checkArr, unCheckArr];
}

export default RoomTypeTable;
