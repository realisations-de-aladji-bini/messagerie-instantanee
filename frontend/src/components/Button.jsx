import React from 'react'
import '../index.css'
function Button({clickFonction, title, disabled}){
  return (
    <button onClick={clickFonction} disabled={disabled}>
      {title}
    </button>
  )
}
export default Button
