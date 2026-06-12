
import './Anchor.scss'

function Anchor({ Image, text }) {
  return(
    <a className='nav-item'>  
      <Image />
      <span>{text}</span>
    </a>
  )
}

export default Anchor