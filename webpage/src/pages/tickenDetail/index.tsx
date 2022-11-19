import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useNavigate, useLocation } from "react-router-dom";
import icon from "../../assert/icon.png";
import stores from "../../store";
import { handleAddress } from "../../utils/ether";
import whereIcon from "../../assert/where.png";
import whenIcon from "../../assert/when.png";
import axios from "axios";
import { IJunoabi, INymphabi } from "../../utils/ether";
import { ethers } from "ethers";
import { objType } from "../../types";

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function List() {
  let navigate = useNavigate();
  const user = stores.user;
  let query = useQuery();
  const [tickenDetail, setTickenDetail] = useState<objType>();
  const web3Provider = new ethers.providers.Web3Provider(window.ethereum);

  let obj = {
    主链: "-",
    Creator: "tokenDance.eth",
    "Token Standard": "ERC721",
    "Asset contract": "0x49cF----A28B",
    "Token id": 1324567,
  };

  useEffect(() => {
    const tid = query.get("tid");
    const cid = query.get("cid");
    const hid = query.get("hid");

    const getDetail = async () => {
      const contract = new ethers.Contract(
        tid as string,
        INymphabi,
        web3Provider
      );
      console.log("contract", contract);
      console.log("tid", tid);
      // 获取ticket的ipfs地址
      const ipfsUri = await contract.tokenURI(1);
      // 去获取ticket的源信息
      const { data } = await axios.get(ipfsUri);
      // 获取ticket的举办时间
      const time = await contract?.HoldTime();
      // 获取票的主办者
      const owner = await contract?.owner();
      console.log("data", data);
      setTickenDetail({ ...data, owner, time });
    };
    getDetail();
  }, []);

  return (
    <div className={styles.container}>
      {tickenDetail && (
        <div className={styles.overlay}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <img
                className={styles.headerIcon}
                src={tickenDetail.image}
                alt="icon"
              />
              <div className={styles.headerDesc}>
                <div className={styles.headerDescTitle}>
                  {tickenDetail.name}
                </div>
                <div className={styles.headerDescText}>
                  {tickenDetail.description}
                </div>
              </div>
            </div>
            <div className={styles.headerInfo}>
              <div className={styles.where}>
                <img className={styles.icon} src={whereIcon} alt="whereicon" />
                <div className={styles.title}>Where</div>
                <div className={styles.text}>{tickenDetail.location}</div>
              </div>
              <div className={styles.when}>
                <img className={styles.icon} src={whenIcon} alt="whenicon" />
                <div className={styles.title}>When</div>
                <div className={styles.text}>{tickenDetail.time._hex}</div>
              </div>
            </div>
          </div>
          <div className={styles.horizon}></div>
          <div className={styles.content}>
            {Object.entries(obj).map(([key, value], index) => {
              return (
                <div className={styles.item} key={index}>
                  <div className={styles.itemKey}>{key}</div>
                  <div className={styles.itemValue}>{value}</div>
                </div>
              );
            })}
          </div>
          <div className={styles.horizon}></div>
          <div className={styles.invitation}>
            <div className={styles.inviteCircleWrap}>
              <div className={styles.inviteCircle}>
                <div className={styles.inviteIcon}>+</div>
                <div className={styles.inviteText}>invite</div>
              </div>
              <div className={styles.inviteCircle}>
                <div className={styles.inviteIcon}>+</div>
                <div className={styles.inviteText}>invite</div>
              </div>
            </div>
            <div className={styles.inviteFBI}>
              You can click the invite button to invite 2 people to the
              conference
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default List;
