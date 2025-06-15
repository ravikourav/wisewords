import { ReactComponent as ProfileIcon } from '../assets/icon/profile.svg';

function RenderProfileImage({source , className}) {
  return (
    source ?
    <img src={source} alt='' className={className} />
    :
    <ProfileIcon stroke="0" fill='#ccc' className={className} alt="User" />
  )
}

export default RenderProfileImage;