import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { useNavigate } from "react-router-dom";

function GetTicken() {
    let navigate = useNavigate();

    const goToList = () => {
        navigate("/list"); 
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}></div>
            <div className={styles.overlay}>
                <div className={styles.imageContainer}>
                </div>
                <div className={styles.imageText}>TokenDance 2022</div>
            </div>
            <div className={styles.getItBtnWrapper}>
                <div className={styles.getItBtn} onClick={goToList}></div>
            </div>
        </div>
    );
}

export default GetTicken;
