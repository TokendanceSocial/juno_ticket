export interface Etherabi {
  // 举办会议
  HoldMeeting?: (
    name: string,
    symbol: string,
    personLimit: number,
    holdTime: number,
    metaInfo: string,
    template: number
  ) => number;
  // 某人举办的会议
  Holds?: (hostAddress: string) => Array<any>;
  // 某人参加的会议
  Meetings?: (memberAddress: string) => Array<any>;
  // 能否邀请
  CanInvite?: () => Boolean;
  // 正在举办的会议
  HoldingMeetings?: () => Array<any>;
  // 能否签到
  CanSign?: (ownerAddress: string) => Boolean;

  // 签到
  Sign?: (ownerAddress: string) => Promise<number>;
  IsSign?: (ownerAddress: string) => Boolean;
  // 开会时间
  HoldTime?: () => number;
  // 主办方批量给白名单用户mint
  _batchMint?: (whites: string[]) => void;
  // 裂变的mint方法
  _fissionMint?: (originAddress: string) => Promise<void>;
  GetValue?: () => number;
  tokenURI?: (id: 0 | 1) => string;
  balanceOf?: (address: string) => Promise<number>;
  owner?: () => Promise<string>;
}

export interface objType {
  description: string;
  external_url: string;
  image: string;
  location: string;
  name: string;
  time: {
    _hex: string;
    _isBigNumber: boolean;
    toNumber(): number;
  };
  owner: string;
  tickenAdress: string;
}
