import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import icon from "../../assert/icon.png";
import stores from "../../store";
import { handleAddress } from "../../utils/ether";
import TickenCard from "../../components/tickenCard";
import { ethers } from "ethers";
import { IJunoabi, INymphabi } from "../../utils/ether";
import { unitAndunique } from "../../utils/list";
import Settings from "../../config/app";
import axios from "axios";
import { resolve } from "node:path/win32";
import { objType } from "../../types/index";
import InviteAvatar from "../../assert/invite_avatar.png";
import Avatar from "../../assert/invite-avatar.png";
import { Toast } from "antd-mobile";

function List() {
  let navigate = useNavigate();
  const user = stores.user;
  const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
  let uniqueMeetings: string[] = [];
  const [list, setList] = useState<objType[]>();

  const getTickensList = async () => {
    const contract = new ethers.Contract(
      Settings.CONTRACT_ADRESS,
      IJunoabi,
      web3Provider
    );
    const userAddress =
      user.userInfo.address || localStorage.getItem("walletAddress");
    console.log("user address", userAddress);
    const meetings = await contract.Meetings(userAddress);
    console.log("user meeting", meetings);
    // uniqueMeetings = unitAndunique(holds, meetings);
    getTicken(meetings);
  };

  const getTicken = async (arr: string[]) => {
    const dataArr: objType[] = [];
    for (let item of arr) {
      const contract = new ethers.Contract(item, INymphabi, web3Provider);
      // 获取ticket的ipfs地址
      const ipfsUri = await contract.tokenURI(1);
      // 去获取ticket的源信息
      const { data } = await axios.get(ipfsUri);
      // 获取ticket的举办时间
      const time = await contract?.HoldTime();
      console.log("time", time.toNumber());
      // 获取票的主办者
      const owner = await contract?.owner();
      dataArr.push({
        ...data,
        time,
        owner,
        tickenAdress: item,
      });
    }
    setList(dataArr);
  };

  useEffect(() => {
    getTickensList();
  }, []);

  const copyData = async () => {
    const copyData =
      user.userInfo.address || localStorage.getItem("walletAddress");

    try {
      await navigator.clipboard.writeText(copyData as string);
      Toast.show({
        icon: "success",
        content: "复制成功!",
      });
    } catch (err) {
      Toast.show({
        icon: "fail",
        content: "复制失败!",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src={InviteAvatar} alt="" />
          <img src={Avatar} alt="" />
        </div>
        {user.userInfo.address ? (
          <div onClick={copyData} className={styles.address}>
            {handleAddress(user.userInfo.address)}
          </div>
        ) : (
          <div onClick={copyData} className={styles.address}>
            {handleAddress(localStorage.getItem("walletAddress") as string)}
          </div>
        )}
      </div>
      <div className={styles.content}>
        {list &&
          list.map((item, index) => <TickenCard item={item} key={index} />)}
      </div>
    </div>
  );
}

export default List;
