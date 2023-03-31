import React from 'react'
import "./buttonsCustom.css"

const ButtonsCustom = ({ nameClass, titleButton, onClick, count }: any) => {
    return (

        <button className={nameClass} onClick={onClick}>
            <span className="button-title">{titleButton}</span>
            {count > 0 && <span className="count">{count}</span>}
        </button>

    )
}

export default ButtonsCustom
