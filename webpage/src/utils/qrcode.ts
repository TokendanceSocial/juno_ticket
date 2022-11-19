export const genQr = (dom: HTMLElement , data: string) => {
  let QRCode = (window as any).QRCode;
  new QRCode(dom, {
    text: data,//扫描二维码后的内容
    colorDark: "#000000",//二维码线条颜色
    colorLight: "#ffffff",//二维码背景颜色
    correctLevel: QRCode.CorrectLevel.H    //二维码等级
})
}