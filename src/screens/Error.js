import './css/Error.css';
import Header from '../components/Header';

function Error() {
  return (
    <div className='page-root'>
        <Header />
        <div className='error-container'>
            <img className='error-logo' src='/logo512.png' alt=''/>
            <p className='error-title'>Oops! Lost in the Words</p>
            <p className='error-body'>It seems like you've ventured into the unknown.</p>
            <p className='error-body'>But don’t worry, even the wisest of us occasionally get lost in the labyrinth of thoughts and musings. How about diving into some inspiring quotes or sharing your own wisdom instead?</p>
        </div>
    </div>
  )
}

export default Error;