import React from 'react'
import Button from './Button'
import '../css/Field.css'

function Field({title, children, handleSubmit, errorMessage,className}){
  
  return (
    // if no className guard
    <fieldset className={`${className || ''}`}> 
      <h3 className="field-title">{title}</h3>
      {children}
      <Button clickFonction={handleSubmit} title={'Soumettre ma requête'}/>
      <div style={{color:"red"}}> {errorMessage}</div>
    </fieldset>
  )

}
export default Field
