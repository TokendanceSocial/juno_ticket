import React, { useEffect } from 'react';
import querystring from 'query-string'
import styles from './index.module.scss';
import InviteAvatar from '../../assert/invite_avatar.png';
import Avatar from '../../assert/invite-avatar.png';
export default function Invite () {
  const search = querystring.parse(window.location.href.split('?')[1]);
  const cid = search.cid;
  const tid = search.tid;
  useEffect(() => {
    
  })
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <img src={InviteAvatar} alt="" />
          <img src={Avatar} alt="" />
        </div>
      </div>
      <p className={styles.address}>{13232321313123}</p>
    <p className={styles.tip}>
    You can click the invite button to invite 2 people to the conference
    </p>
  </div>
  )
}
