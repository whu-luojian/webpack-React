import React from 'react';
import './hello.css';
// css引入图片可写相对路径，组件中需要导入，否则不会被打包
import react_jpg from 'static/images/react.jpg'

class Hello extends React.Component {
    render(){
        return (
            <div className="app">
                <span className="app-content">Hello World</span>
                <div className="app-image"></div>
                <img className="app-img" src={react_jpg}/>
            </div>
        )
    }
}

export default Hello;