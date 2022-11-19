import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import avatar from "../../assert/avatar.png";
import { observer } from "mobx-react";
import stores from "../../store";
import { initProvide } from "../../utils/ether";
import { useNavigate } from "react-router-dom";
import { Toast } from "antd-mobile";

function ConnectWallet() {
  let navigate = useNavigate();
  const user = stores.user;

  const connectButton = async () => {
    initProvide()
      .then(async ({ web3Provider }) => {
        if (web3Provider) {
          const accounts = await web3Provider.send("eth_requestAccounts", []);
          console.log("accounts", accounts);
          await user.setUser({ address: accounts[0] });
          localStorage.setItem("walletAddress", accounts[0]);
          navigate("/list");
        }
      })
      .catch((err) => {
        Toast.show({
          icon: "fail",
          content: "请安装metamask钱包",
        });
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.connectContainer}>
        <div className={styles.title}>Connet your Wallet</div>
        <div className={styles.avatarWrapper}>
          <img className={styles.avatar} src={avatar} />
          <div className={styles.description}>MetaMask</div>
        </div>
        <div className={styles.horizon}></div>
        <div onClick={connectButton}>
          <div className={styles.connectTxt}>Click to authorize</div>
        </div>
      </div>
    </div>
  );
}

export default observer(ConnectWallet);
