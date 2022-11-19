import React, { useEffect } from 'react';
import styles from './index.module.scss';
import avatar from '../../assert/avatar.png';

function WaitingTicken() {
    const connectWallet = () => {
        console.log("connectWallet");
    }

    return (
        <div className={styles.container}>
             <div className={styles.title}>New Ticken！</div> 
             <div className={styles.connectContainer}>
                Your ticken is coming…
            </div>
        </div>
    );
}

export default WaitingTicken;
