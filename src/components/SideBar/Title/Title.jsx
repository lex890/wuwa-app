import ReactIcon from '../../../assets/react.svg'
import './Title.scss'

function Title() {
  return(
    <a href="/">
      <img src={ReactIcon} alt="" />
      <span>Sonoro</span>
    </a>
  )
}

export default Title