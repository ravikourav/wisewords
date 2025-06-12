import { HashLoader } from "react-spinners";

function Loading() {
  return (
    <div style={{display: 'flex', alignContent: 'center' , justifyItems: 'center' , alignItems: 'center' ,height: '100%' , width: '100%', justifyContent: 'center'}}>
      <HashLoader
        size={50}
        color="#63b6ff"
      />
    </div>
  )
}

export default Loading;