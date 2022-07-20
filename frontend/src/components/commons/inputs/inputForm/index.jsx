import React from 'react';
import styles from './styles.module.css';

const TextField = (props) => {

    return (
        <div className='Login'>
            <input placeholder={props.placeholder} className={styles.TextField} type="text" />
        </div>
    );

}

export default TextField;