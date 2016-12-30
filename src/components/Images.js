import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import sha1 from 'sha1'
import superagent from 'superagent'

class Images extends Component {

  constructor(){
    super()
    this.state = {
        images: []
    }
  }

  // http://cloudinary.com/documentation/upload_images#uploading_with_a_direct_call_to_the_api
  // Prepare request from cloudinary
  uploadFile(files) {
    console.log('uploadFile:  ')
    const image = files[0]

    const cloudName = 'doxkrmgtw'
    const url = 'https://api.cloudinary.com/v1_1/'+cloudName+'/image/upload'

    const timestamp = Date.now()/1000
    const uploadPreset = 'sp2hg8cu'

    const paramsStr = 'timestamp='+timestamp+'&upload_preset='+uploadPreset+'hlsekain48oS7u8NB7bccvWXPVs'

    const signature = sha1(paramsStr)
    const params = {
      'api_key': '633564199531762',
      'timestamp': timestamp,
      'upload_preset': uploadPreset,
      'signature': signature
    }
// superagent makes api calls on our behalf

// Sending POST request
    let uploadRequest = superagent.post(url)
    uploadRequest.attach('file', image)

    Object.keys(params).forEach((key) => {
      uploadRequest.field(key, params[key])
    })

    uploadRequest.end((err, resp) => {
      if (err){
          alert(err)
          return
      }

      console.log('UPLOAD COMPLETE: '+JSON.stringify(resp.body))
      const uploaded = resp.body

      let updatedImages = Object.assign([], this.state.images)
      updatedImages.push(uploaded)

      // trigger a re-render -- "refresh" the component
      this.setState({
        images: updatedImages
      })
    })
  }

  removeImage(event){
    event.preventDefault()
    console.log('removeImage: '+event.target.id)

    let updatedImages = Object.assign([], this.state.images)
    updatedImages.splice(event.target.id, 1)

    this.setState({
      images: updatedImages
    })
  }

  render(){
    const list = this.state.images.map((image, i) => {
      return (
        <li key={i}>
          <img style={{width:72}}   src={image.secure_url} />
          <br /><a id={i} onClick={this.removeImage.bind(this)} href="#">remove</a>
        </li>
      )
    })

    return (
      <div>
        Images Components
        <Dropzone onDrop={this.uploadFile.bind(this)} />
        <ol>
          { list }
        </ol>
      </div>
    )
  }
}

export default Images
