import { makeObservable, observable, action } from 'mobx';

interface UserInfo {
  address: string
}

class User {
  @observable userInfo: UserInfo = { address: '' };

  constructor() {
    makeObservable(this);
  }

  @action
  setUser(info: UserInfo) {
    this.userInfo = {
      ...info
    }
  }
}

export default User;
