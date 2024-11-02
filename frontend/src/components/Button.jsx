import React from 'react'
import '../index.css'
function Button({clickFonction, title}){
  return (
    <button onClick={clickFonction}>
      {title}
    </button>
  )
}
export default Button
