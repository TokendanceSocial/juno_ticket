# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`    

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## 使用技术栈
react typescript mobx sass etherjs metamask.js , [antd-mobile](https://mobile.ant.design/components/button)


## 模块
util 通用功能
config 项目配置
pages 页面
store 本地存储
components 通用组件
assert 资源

## 合约地址
https://github.com/TokendanceSocial/juno_ticket/tree/master/abi/pretty/contracts

```js
const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
// 创建合约  => IJunoabi => 创建了合约工厂的链接
const contract = new ethers.Contract(address: string, abi: sting[], web3Provider)
// 拿到票的地址
contract.Holds(uid) => Promise<string[]> => ticket_address[]

// 创建票据合约  => INymphabi => 创建了票据的链接
const contract = new ethers.Contract(ticket_address: string, abi: sting[], web3Provider)



    // 获取ticket的ipfs地址
    const ipfsUri = await contract?.tokenURI?.(1)
    // 去获取ticket的源信息
    const { data } = await axios.get(ipfsUri)
    // 获取ticket的举办时间
    const time = await contract?.HoldTime();
    // 获取票的主办者
    const owner = await contract?.owner();



### 优化

> Abdulla 

--- 地址展示
-- 图片展示

- 盖章

- 列表不能只展示一个