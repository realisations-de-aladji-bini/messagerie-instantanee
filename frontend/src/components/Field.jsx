import React from 'react'
import Button from './Button'
import '../css/Field.css'

function Field({title, children, handleSubmit, errorMessage,className}){
  
  return (
    // if no className guard
    <fieldset className={`${className || ''}`}> 
      <legend>{title}</legend>
      {children}
      <Button clickFonction={handleSubmit} title={'OK'}/>
      <div style={{color:"red"}}> {errorMessage}</div>
    </fieldset>
  )

}
export default Field
