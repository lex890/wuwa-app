
import './Anchor.scss'

function Anchor({ Image, text }) {
  return(
    <a className='nav-item'>  
      <div className="icon-container">
        <Image />
      </div>
      <span>{text}</span>
    </a>
  )
}

export default Anchor