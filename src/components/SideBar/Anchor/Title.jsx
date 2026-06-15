import ReactIcon from '../../../assets/svg/react.svg'

function Title() {
  return(
    <a href="/" className="title">
      <img src={ReactIcon} alt="" />
      <span>Sonoro</span>
    </a>
  )
}

export default Title