import { margin } from "@mui/system";
import { HashLoader } from "react-spinners";

function Loading(props) {
  const loaderStyle = {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '40px',
    height: '100%',
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