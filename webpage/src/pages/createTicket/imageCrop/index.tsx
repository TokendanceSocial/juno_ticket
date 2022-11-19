import { useEffect, useRef, RefObject, useState } from 'react';
import {
  Button,
  Mask
} from 'antd-mobile'
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css'
import styles from './index.module.scss';
type ImageCropProps = {
  confirmCb: Function;
  url: string;
}
const ImageCrop = (props: ImageCropProps) => {
  const {confirmCb, url} = props;
  const [cropper, setCropper] = useState<Cropper>();
  useEffect(() => {
    const image = document.getElementById('js__image-crop') as HTMLImageElement;
    const _cropper = new Cropper(image, {
      autoCrop: false,
      aspectRatio: 1,
      dragMode: 'move',
      // minCropBoxWidth: 10,
      // minCropBoxHeight: 10,
      cropBoxResizable: false,
      // aspectRatio: 16 / 9,
      ready() {
        // Do something here
        // ...
    
        // And then
        _cropper.crop();
        _cropper.setCropBoxData({
          width: 100,
          height: 100
        })
      },
      crop(event) {
        // console.log(event.detail.x);
        // console.log(event.detail.y);
        // console.log(event.detail.width);
        // console.log(event.detail.height);
        // console.log(event.detail.rotate);
        // console.log(event.detail.scaleX);
        // console.log(event.detail.scaleY);
      },
    });
    setCropper(_cropper);
  }, [])
  const confirmClick = function(cropper: Cropper | undefined) {
    console.log(cropper);
    if(cropper) {
      const test = cropper.getCroppedCanvas({
        width: 100,
        height: 100,
        // minWidth: 100,
        // minHeight: 100,
        // maxWidth: 100,
        // maxHeight: 100,
        fillColor: '#fff',
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'high',

      })
      .toBlob((blob) => {
        confirmCb(blob);
      })
    }
  }
  return (
    <Mask opacity={1}>
      <div className={styles.container}>
        
        <img
          id="js__image-crop"
          // src="https://bafkreigrg7pqsr7mduf65f5lvfrhssp4wtb3p4qfpt7zopbjokfmiz2phi.ipfs.nftstorage.link/"
          src={url}
          alt=""
          style={{
            display: "block",
            maxWidth: "100%"
          }}
        />
        <div
          className={styles.button}
          onClick={() => confirmClick(cropper)}
        >
          <Button  block color='primary' size='large'>
            确定
          </Button>
          
        </div>
      </div>
    </Mask>
  )
    
}

export default ImageCrop;