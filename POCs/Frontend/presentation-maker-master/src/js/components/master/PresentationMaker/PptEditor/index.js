import React from 'react';
import TextEditor from './../TextEditor';
import ImagePicker from './../ImagePicker';
import './index.css';

export default class PptEditor extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            editorContainerId : this.props.editorContainerId ? this.props.editorContainerId : "editor_container",
            slide : this.props.slide ? this.props.slide : {
                texts : [],
                images : [],
                properties : {}
            },
            slideProps : this.props.slideProps ? this.props.slideProps : {},
            backgroundColor : "#ffffff"
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.slide !== nextProps.slide){
            this.setState({
                slide : nextProps.slide
            })
        }

        if(this.props.slideProps !== nextProps.slideProps){
            this.setState({
                slideProps : nextProps.slideProps
            })
        }

        if(this.props.editorContainerId !== nextProps.editorContainerId){
            this.setState({
                editorContainerId : nextProps.editorContainerId
            })
        }
    }

    // add text field
    addText(){
        this.refs["text_editors"].addTextObject();
    }

    // add image
    addImage(){
        this.refs["image_editors"].addImageObject();
    }

    // unbind drag from container
    unBindDragFromContainer(e){
        this.refs["text_editors"].unBindDragFromContainer();
        this.refs["image_editors"].unBindDragFromContainer();
    }

    // bold
    bold(){
        this.refs["text_editors"].bold();
    }

    // italic
    italic(){
        this.refs["text_editors"].italic();
    }

    // underline
    underline(){
        this.refs["text_editors"].underline();
    }

    // set font size
    setFontSize(size){
        this.refs["text_editors"].setFontSize(size);
    }

    // set font family
    setFontFamily(family){
        this.refs["text_editors"].setFontFamily(family);
    }

    // set font color
    setFontColor(color){
        this.refs["text_editors"].setFontColor(color);
    }

    // set editor backgroundColor
    setEditorBackgroundColor(color){
        this.setState({
            backgroundColor : color
        })
    }

    render(){
        var slideStyle = {};

        if(this.state.slideProps.properties && this.state.slideProps.properties.backgroundImage){
            slideStyle = {
                backgroundImage : "url('"+this.state.slideProps.properties.backgroundImage+"')",
                backgroundRepeat : "no-repeat",
                backgroundPosition : "center center",
                backgroundSize : "100% 100%"
            }
        }

        if(this.state.slideProps.properties && this.state.slideProps.properties.backgroundColor){
            slideStyle = {
                backgroundColor : this.state.slideProps.properties.backgroundColor
            }
        }

        return(
            <React.Fragment>
                <div className = "ppt-editor-wrapper">
                    <div 
                        className = "ppt-editor-container"
                        id = {this.state.editorContainerId}
                        style = {slideStyle}
                        onMouseUp = {this.unBindDragFromContainer.bind(this)}>

                        <TextEditor
                            ref = "text_editors"
                            data = {this.state.slide.texts}
                            updatedTextInSlide = {this.props.updatedTextInSlide}
                            containerId = {this.state.editorContainerId}
                        />

                        <ImagePicker
                            ref = "image_editors"
                            data = {this.state.slide.images}
                            updatedImagesInSlide = {this.props.updatedImagesInSlide}
                            containerId = {this.state.editorContainerId}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}