import React, { useEffect, useState } from 'react'
import querystring from 'query-string'
import { observer } from 'mobx-react';
import { Toast } from 'antd-mobile'
import stores from '../../store'
import styles from './index.module.scss';
import Where from '../../assert/where.png'
import When from '../../assert/when.png'
export default observer(() => {
    const search = querystring.parse(window.location.href.split('?')[1]);
    const cid = search.cid;
    const tid = search.tid;
    useEffect(() => {
        if (tid && cid) {
          // 去读列表，读取票信息，显示扫码信息，确认是否入会
          console.log(tid, cid)
          if (stores.tickets.ticketsInfo.length === 0) {
            // 拉去会议列表
            Toast.show({
                icon: 'success',
                content: '保存成功',
              })
            stores.tickets.setTicket([{
                a: 111
            }])
          }
        }
    }, [])

    const check = () => {
        const _cid = localStorage.getItem(tid?.toString() || '')
        if(_cid && _cid === cid) {
            // 重复入场了
        }
        if (!_cid) {
            localStorage.setItem(tid?.toString() || '', (cid || '').toString());
        }

    }
    return (
        <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Ticket Check</h1>
          </div>
        </div>
        <div className={styles.meetInfo}>
          <div style={{ marginBottom: '12px'}} className={styles.infoItem}>
            <label>
              <img width={21} height={21} src={Where} alt="" />
              Where
            </label>
            <span>
                这是一个地方
            </span>
          </div>
  
          <div className={styles.infoItem}>
            <label>
              <img width={21} height={21} src={When} alt="" />
              When
            </label>
            <span>
                这是一个地方
            </span>
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.tokenInfo}>
          <p>
            <label>主链</label><span>-</span>
          </p>
          <p>
            <label>主链</label><span>-</span>
          </p>
          <p>
            <label>主链</label><span>-</span>
          </p>
          <p>
            <label>主链</label><span>-</span>
          </p>
          <p>
            <label>主链</label><span>2</span>
          </p>
        </div>
        <div className={styles.line}></div>
  
        <div onClick={check} className={styles.invite}>
          <div className={styles.add}>
            invite
          </div>
        </div>
        <p className={styles.tip}>
        You can click the invite button to invite 2 people to the conference
        </p>
      </div>
    )
});