import { styled } from "@mui/material";
import { HashLoader } from "react-spinners";

function Loading(props) {
  const loaderStyle = {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: props.height ? props.height : '100vh',
    width: '100%',
  };
  return (
    <div style={loaderStyle}>
      <HashLoader
        size={props.size ? props.size : 40}
        color="#63b6ff"
      />
    </div>
  )
}

export default Loading;