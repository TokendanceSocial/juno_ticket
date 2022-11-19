import React, { useEffect, FC } from "react";
import styles from "./index.module.scss";
import { useNavigate, createSearchParams } from "react-router-dom";
import icon from "../../assert/icon.png";
import whereIcon from "../../assert/where.png";
import whenIcon from "../../assert/when.png";
import { objType } from "../../types/index";
import stores from "../../store";
import { url } from "node:inspector";
import dayjs from "dayjs";

const TickenCard: FC<{ item: objType }> = ({ item }) => {
  let navigate = useNavigate();
  const user = stores.user;

  const params = {
    tid: item.tickenAdress,
    cid: user.userInfo.address,
    hid: item.owner,
    mode: "ticket",
  };

  const handleClick = () => {
    navigate({
      pathname: "/qrcode",
      search: `?${createSearchParams(params)}`,
    });
  };

  if (item.image.startsWith("ipfs://")) {
    const idReg = /\/\/.*\//g;
    const match = item.image!.match(idReg);
    if (match) {
      const idMatch = match[0];
      const id = idMatch.slice(2, idMatch.length - 1);
      const nameIndex = item.image.lastIndexOf("/");
      const name = item.image.slice(nameIndex + 1);
      item.image = `https://${id}.ipfs.nftstorage.link/${name}`;
    }
  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.header}>
        <div
          className={styles.img}
          style={{ backgroundImage: `url(${item.image})` }}
        ></div>
        <div className={styles.content}>
          <div className={styles.title}>{item.name}</div>
          <div className={styles.arrow}>{">"}</div>
        </div>
      </div>
      <div className={styles.description}>
        <div className={styles.where}>
          <img className={styles.icon} src={whereIcon} alt="whereicon" />
          <div className={styles.title}>Where</div>
          <div className={styles.text}>{item.location}</div>
        </div>
        <div className={styles.when}>
          <img className={styles.icon} src={whenIcon} alt="whenicon" />
          <div className={styles.title}>When</div>
          <div className={styles.text}>
            {dayjs.unix(Number(item.time)).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TickenCard;
