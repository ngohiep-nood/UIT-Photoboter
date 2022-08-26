import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import {
  Typography,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ProcessContextDispatch, ProcessContextState } from "../../App";

const AutoFillEmail = (props) => {
  // props = {getData, setData}
  const handleClick = (e) => {
    let currentText = props.getData();

    if (currentText !== "" && currentText.includes("@")) {
      currentText = currentText.split("@")[0];
    }

    if (e.target.innerText === "@uit") {
      if (/^[\d]*[\d*]$/.test(currentText)) {
        props.setData(currentText + "@gm.uit.edu.vn");
      }
      if (/^[\D]*[\D*]$/.test(currentText)) {
        props.setData(currentText + "@uit.edu.vn");
      }
    }

    if (e.target.innerText === "@gmail") {
      if (/^\w/.test(currentText)) {
        props.setData(currentText + "@gmail.com");
      }
    }
  };
  return (
    <div
      style={{
        width: "100px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="caption"
        onClick={handleClick}
        sx={{ textDecoration: "underline", color: '#000', fontSize: '15px' }}
      >
        @uit
      </Typography>

      <Typography
        variant="caption"
        onClick={handleClick}
        sx={{ textDecoration: "underline", color: '#000', fontSize: '15px' }}
      >
        @gmail
      </Typography>
    </div>
  );
};

const TextEditor = (props, ref) => {
  const dispatch = useContext(ProcessContextDispatch);
  const context = useContext(ProcessContextState).current;
  const [edit, toggleEdit] = useState(false);
  const [data, setData] = useState(props.firstVal || "");

  const UpdateData = (val) => {
    let dataList;
    if (props.isGuest === true) {
      dataList = context.messageOptions.current.guestList;
    } else {
      dataList = context.messageOptions.current.userList;
    }
    // console.log(dataList[props.index]);
    if (props.label === "Name") {
      dataList[props.index].name = val;
    } else {
      dataList[props.index].email = val;
    }
    if (props.isGuest === true) {
      dispatch.setMessageOptions({
        ...context.messageOptions.current,
        guestList: dataList,
      });
    } else {
      dispatch.setMessageOptions({
        ...context.messageOptions.current,
        userList: dataList,
      });
    }
    setData(val);
  };
  useImperativeHandle(ref, () => ({
    toggleEdit: (value) => toggleEdit(value),
    getData: () => data,
    setData: UpdateData,
  }));

  const HandleChange = (e) => {
    UpdateData(e.target.value);
  };

  return (
    <>
      {edit ? (
        props.label === "Name" ? (
          <FormControl sx={{ width: "370px" }}>
            <InputLabel htmlFor="name-input">{props.label}</InputLabel>
            <OutlinedInput
              id="name-input"
              label={props.label}
              onChange={HandleChange}
              size="small"
              value={data}
              sx={{ my: 1 }}
            />
          </FormControl>
        ) : (
          <FormControl sx={{ width: "370px" }}>
            <InputLabel htmlFor="email-input">{props.label}</InputLabel>
            <OutlinedInput
              id="email-input"
              label={props.label}
              onChange={HandleChange}
              size="small"
              value={data}
              sx={{ my: 1 }}
              endAdornment={
                <InputAdornment position="end">
                  <AutoFillEmail setData={setData} getData={() => data} />
                </InputAdornment>
              }
            />
          </FormControl>
        )
      ) : (
        <Typography
          variant={props.label === "Name" ? "h6" : "caption"}
          color={props.label === "Name" ? "text.primary" : "text.secondary"}
          sx={{ maxWidth: "400px" }}
        >
          {data}
        </Typography>
      )}
    </>
  );
};

export default forwardRef(TextEditor);
