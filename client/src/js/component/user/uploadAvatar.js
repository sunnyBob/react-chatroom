import React from 'react';
import { browserHistory } from 'react-router';
import Cropper from 'cropperjs';
import { Card } from '../common';
import { toast } from 'react-toastify';

import '../../../../node_modules/cropperjs/dist/cropper.min.css';
import './user.less';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previewUrl: '',
    };
  }

  handleImage = (e) => {
    const file = e.target.files[0];
    if(!/image\/\w+/.test(file.type)) {
      toast.error('请确保文件类型为图像类型', toastOption);
      return;
    }
    if(typeof FileReader == 'undefined') {
      toast.error('抱歉，你的浏览器不支持FileReader, 无法裁剪头像', toastOption);
      return;
    } else {
      const reader = new FileReader();
      const self = this;
      reader.readAsDataURL(file);
      reader.onload = function() {
        self.img.setAttribute("src", this.result);
        const minAspectRatio = 0.5;
        const maxAspectRatio = 1.5;
        const cropper = new Cropper(self.img, {
          ready () {
            const cropper = this.cropper;
            const containerData = cropper.getContainerData();
            const cropBoxData = cropper.getCropBoxData();
            const aspectRatio = cropBoxData.width / cropBoxData.height;
            if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
              const newCropBoxWidth = cropBoxData.height * ((minAspectRatio + maxAspectRatio) / 2);
              cropper.setCropBoxData({
                left: (containerData.width - newCropBoxWidth) / 2,
                width: newCropBoxWidth
              });
            }
          },
          cropend() {
            self.setState({
              previewUrl: cropper.getCroppedCanvas().toDataURL("image/png"),
            });
          },
          cropmove () {
            const cropper = this.cropper;
            const cropBoxData = cropper.getCropBoxData();
            const aspectRatio = cropBoxData.width / cropBoxData.height;
            if (aspectRatio < minAspectRatio) {
              cropper.setCropBoxData({
                width: cropBoxData.height * minAspectRatio
              });
            } else if (aspectRatio > maxAspectRatio) {
              cropper.setCropBoxData({
                width: cropBoxData.height * maxAspectRatio
              });
            }
          }
        });
      }
    }
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleImage}/>
        <div className="crop-box">
          <img ref={img => { this.img = img }}/>
        </div>
        {
          this.state.previewUrl && <div className="preview">
            <span>预览:</span>
            <img src={this.state.previewUrl}/>
          </div>
        }
      </div>
    );
  }
}
