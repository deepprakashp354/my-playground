import React from 'react';
import EditableDiv from './../EditableDiv';
import Arrow from './../Arrow';
import './index.css';

export default class TextEditor extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            images : this.props.data !== undefined ? this.props.data : [],
            containerProps : {
                center : [],
                size : []
            },
            editState : null,
            activeState : null,
            dragElement : null,
            sizeDragElement : null,
            mouseDirection : {},
            // extra value
            yCoeff : 42,
            xCoeff : 3.5,
            containerId : this.props.containerId !== undefined ? this.props.containerId : "",
            allowInput : null
        }

        this.closeEditImage = this.closeEditImage.bind(this);
        this.move = this.move.bind(this);
        this.resize = this.resize.bind(this);
    }

    componentDidMount(){
        this.init();
    }

    componentWillReceiveProps(nextProps){
        if(this.props.data !== nextProps.data){
            this.setState({
                images : nextProps.data
            })
        }

        if(this.props.containerId !== nextProps.containerId){
            this.setState({
                containerId : nextProps.containerId
            })
        }
    }

    // initialize editor defaults
    init(){
        var containerProps = Object.assign({}, this.state.containerProps);
        var container = document.getElementById(this.state.containerId)
        var width = container.offsetWidth;
        var height = container.offsetHeight;
        var center = [width/2, height/2];

        containerProps.center = center;
        containerProps.size = [width, height];

        this.setState({
            containerProps : containerProps
        })
    }

    // add image object
    addImageObject(){
        var allImages = Object.assign([], this.state.images);
        var obj = this.getImageObject();
        allImages.push(obj);
        this.setState({
            images : allImages
        }, () => {
            this.props.updatedImagesInSlide(this.state.images)
        })
    }

    // get image Object
    getImageObject(){
        var imageWrapperSize = [300, 50];

        var containerProps = Object.assign({}, this.state.containerProps);
        var containerSize = containerProps.size;

        // getting the position
        var left = (containerSize[0]/2) - (imageWrapperSize[0]/2);
        var top = (containerSize[1]/2) - (imageWrapperSize[1]/2);

        return {
            label : "Double Click To Add",
            image : null,
            coord : [left, top],
            size : imageWrapperSize
        }
    }

    // get all images
    getAllImages(){
        return this.state.Images;
    }

    // open edit image
    editImage(key){
        this.setState({
            allowInput : key
        }, () => {
            document.addEventListener('click', this.closeEditImage);
        })
        // this.setState({
        //     editState : key
        // }, () => {
        //     document.addEventListener('click', this.closeEditImage);
        //     // focus to div
        //     document.getElementById("ppt_editable_div_"+key).focus();
        // })
    }

    // close edit image
    closeEditImage(e){
        var key = this.state.allowInput;


        var elem = this.refs["draggble_image_"+key];
        var arr = [
            "left_size_image_dragger_"+key,
            "right_size_image_dragger_"+key,
            "top_size_image_dragger_"+key,
            "bottom_size_image_dragger_"+key
        ]

        if(e.target.id === elem.id || arr.indexOf(e.target.id) !== -1) return;

        this.setState({
            // editState : null,
            allowInput : null
        }, () => {
            document.removeEventListener('click', this.closeEditImage);

            // update sizer positions
            this.setSizerPosition("vertical", key);
            this.setSizerPosition("horizontal", key);
        })
    }

    // update image
    inputFile(key, e){
        if(Object.keys(e.target.files).length === 0) return false;

        var file = e.target.files[0];
        
        var images = Object.assign([], this.state.images);
        var field = Object.assign({}, images[key]);

        field.image = URL.createObjectURL(file);

        this.getImageDimension(field.image).then((result) => {
            var height = 100;
            var imageHeight = result.height;
            var imageWidth = result.width;
            var per = (height/imageHeight)*100;
            var width = (imageWidth*per)/100;

            field.size = [width, height];
            
            var newField = Object.assign({}, field);
            images[key] = Object.assign({}, newField);
            var newImages = Object.assign([], images);

            this.setState({
                images : newImages
            }, () => {
                this.props.updatedImagesInSlide(this.state.images);

                // update sizer positions
                this.setSizerPosition("vertical", key);
                this.setSizerPosition("horizontal", key);
            })
        }).catch((error) => {
            console.log(error);
        })
    }

    // drag active
    dragActive(k, e){
        var arr = [
            "left_size_image_dragger_"+k,
            "right_size_image_dragger_"+k,
            "top_size_image_dragger_"+k,
            "bottom_size_image_dragger_"+k
        ]

        if(arr.indexOf(e.target.id) !== -1) return;

        var element = this.refs["draggble_image_"+k];
        
        this.setState({
            dragElement : {
                k : k,
                element : element,
                clickPos : [e.clientX, e.clientY]
            }
        }, () => {
            this.bindDragToContainer();
        })
    }

    // bind drag to container
    bindDragToContainer(){
        var container = document.getElementById(this.state.containerId);
        container.addEventListener('mousemove', this.move);
    }

    // unbind drag to container
    unBindDragFromContainer(){
        var container = document.getElementById(this.state.containerId);
        container.removeEventListener('mousemove', this.move);

        this.unBindResizer();
    }

    // move
    move(e){
        var dragElement = Object.assign({}, this.state.dragElement);
        var clickPos = dragElement.clickPos;
        var element = dragElement.element;

        // get position
        var left = element.offsetLeft - (clickPos[0] - e.clientX);
        var top = element.offsetTop - (clickPos[1] - e.clientY);

        var images = Object.assign([], this.state.images);
        images[dragElement["k"]].coord = [left, top];

        var newImages = Object.assign([], images);

        var newDragElement = Object.assign({}, dragElement);
        newDragElement.clickPos = [e.clientX, e.clientY];

        this.setState({
            images : newImages,
            dragElement : newDragElement
        }, () => {
            this.props.updatedImagesInSlide(this.state.images)
        })
    }

    // bind resizer
    bindResizer(k, direction, e){
        var container = document.getElementById(this.state.containerId);
        var arr = [
            "left_size_image_dragger_"+k,
            "right_size_image_dragger_"+k,
            "top_size_image_dragger_"+k,
            "bottom_size_image_dragger_"+k
        ]

        if(arr.indexOf(e.target.id) === -1) return;

        var element = this.refs["draggble_image_"+k];
        this.setState({
            sizeDragElement : {
                k : k,
                element : element,
                clickPos : [e.clientX, e.clientY],
                mousePos : [e.pageX, e.pageY],
                originalCoord : [element.getBoundingClientRect().left, element.getBoundingClientRect().top],
                direction : direction,
                pivots : [e.pageY, e.pageX+element.offsetWidth - this.state.xCoeff, e.pageY+element.offsetHeight - this.state.yCoeff, e.pageX]
            }
        }, () => {
            
            // bind resizer to container
            container.addEventListener('mousemove', this.resize);
        })
    }

    // remove resizer
    unBindResizer(){
        var container = document.getElementById(this.state.containerId);
        container.removeEventListener('mousemove', this.resize)
    }

    // resizer
    resize(e){
        var dragElement = Object.assign({}, this.state.sizeDragElement);
        var pivots = dragElement.pivots;
        var element = dragElement.element;
        var direction = dragElement.direction;

        // set size
        switch(direction){
            case "left" : {
                var width = pivots[1] - e.pageX;
                var left = pivots[1] - width - document.getElementById(this.state.containerId).getBoundingClientRect().left;

                // update image
                var imageObj = this.getImage(dragElement.k);
                imageObj.size[0] = width;
                imageObj.coord[0] = left;
                this.updateText(dragElement.k, imageObj);

                // reposition sizer
                this.setSizerPosition("horizontal")

                break;
            }

            case "right" : {
                // update image
                var imageObj = this.getImage(dragElement.k);
                imageObj.size[0] = e.pageX - element.getBoundingClientRect().left;
                this.updateText(dragElement.k, imageObj);

                // reposition sizer
                this.setSizerPosition("horizontal")

                break;
            }

            case "top" : {
                var offset = pivots[2] - e.pageY + this.state.yCoeff;
                var top = pivots[2] - offset;

                // update image
                var imageObj = this.getImage(dragElement.k);
                imageObj.size[1] = offset;
                imageObj.coord[1] = top;
                this.updateText(dragElement.k, imageObj);

                // reposition sizer
                this.setSizerPosition("vertical")

                break;
            }

            case "bottom" : {
                // update image
                var imageObj = this.getImage(dragElement.k);
                imageObj.size[1] = e.pageY - element.getBoundingClientRect().top;
                this.updateText(dragElement.k, imageObj);

                // reposition sizer
                this.setSizerPosition("vertical")
                break;
            }
        }
    }
    
    // get editor ref
    getImage(key){
        var allImages = Object.assign([], this.state.images);
        return allImages[key];
    }

    // update text editor payload
    updateText(key, obj){
        var allText = Object.assign([], this.state.texts);
        allText[key] = Object.assign({}, obj);

        var newTextObj = Object.assign([], allText);

        this.setState({
            texts : newTextObj
        })
    }

    // set sizer at horizontal and vertical center
    setSizerPosition(type, key = null){
        var dragElement = {};
        var element = {};

        // when resizing started
        if(key === null){
            dragElement = Object.assign({}, this.state.sizeDragElement);
            element = dragElement.element;
        }
        // when never resized
        else{
            dragElement = {
                k : key
            };

            element = document.getElementById("ppt_noneditable_div_"+key);
        }

        switch(type){
            case "horizontal" : {
                // setting sizer's position
                var topSizeDragger = document.getElementById('top_size_image_dragger_'+dragElement.k);
                var bottomSizeDragger = document.getElementById('bottom_size_image_dragger_'+dragElement.k);

                topSizeDragger.style.left = ((element.offsetWidth/2) - (topSizeDragger.offsetWidth/2))+"px";
                bottomSizeDragger.style.left = ((element.offsetWidth/2) - (bottomSizeDragger.offsetWidth/2))+"px";
                break;
            }

            case "vertical" : {
                // setting sizer's position
                var leftSizeDragger = document.getElementById('left_size_image_dragger_'+dragElement.k);
                var rightSizeDragger = document.getElementById('right_size_image_dragger_'+dragElement.k);

                leftSizeDragger.style.top = ((element.offsetHeight/2) - (leftSizeDragger.offsetHeight/2))+"px";
                rightSizeDragger.style.top = ((element.offsetHeight/2) - (rightSizeDragger.offsetHeight/2))+"px";
                break;
            }
        }
    }

    // get mouse movement direction
    getMouseDirection(e){
        var mouseDirection = Object.assign({}, this.state.mouseDirection)
        var oldX = mouseDirection.x;
        var oldY = mouseDirection.y;
        var xDirection = null;
        var yDirection = null;

        //deal with the horizontal case
        if (oldX < e.pageX)
            xDirection = "right";
        else
            xDirection = "left";
    
        //deal with the vertical case
        if (oldY < e.pageY)
            yDirection = "down";
        else
            yDirection = "up";
    
        oldX = e.pageX;
        oldY = e.pageY;

        this.setState({
            mouseDirection : {
                x : oldX,
                y : oldY
            }
        })
        
        return {
            x : xDirection,
            y : yDirection
        }
    }

    // get image dimension
    getImageDimension(url){
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.src = url;

            img.onload = () => {
                resolve({
                    width : img.width,
                    height : img.height
                })
            }
        })
    }

    render(){
        return(
            <React.Fragment>
                {
                    this.state.images.map((v, k) => {
                        var style = {
                            position : "absolute",
                            left : v.coord[0]+"px",
                            top : v.coord[1]+"px",
                            display : "table",
                            width : v.size[0],
                            height : v.size[1],
                            cursor : "move",
                            userSelect : "none",
                            transformOrigin: "center center",
                            boxSizing : "border-box",
                        }

                        var carets = {
                            display : "none"
                        }

                        if(this.state.allowInput == k){
                            style["borderStyle"] = "dashed";
                            style["borderColor"] = "lightgray";
                            style["borderWidth"] = "1px";
                            style["userSelect"] = "none";

                            carets = {}
                        }

                        var cellClassName = {
                            display : "table-cell",
                            position : "relative",
                            verticalAlign : "middle",
                            textAlign : "center",
                            whiteSpace: "pre-wrap"
                        }

                        if(v.image){
                            cellClassName["backgroundImage"] = "url('"+v.image+"')";
                            cellClassName["backgroundRepeat"] = "no-repeat";
                            cellClassName["backgroundPosition"] = "center";
                            cellClassName["backgroundSize"] = "100% 100%";
                        }

                        return (
                            <div 
                                key = {v.label+"_editor_"+k}
                                style = {style}
                                ref = {"draggble_image_"+k}
                                id = {"draggble_image_"+k}
                                className = "ppt-editor-image-editor-container"
                                onClick = {this.editImage.bind(this, k)}
                                onMouseDown = {this.dragActive.bind(this, k)}
                                onMouseUp = {this.unBindDragFromContainer.bind(this)}>
                                
                                <div style = {cellClassName} id = {"ppt_noneditable_div_"+k}>
                                    <div 
                                        className = "ppt-editor-drag-left"
                                        id = {"left_size_image_dragger_"+k}
                                        style = {carets}
                                        onMouseDown = {this.bindResizer.bind(this, k, "left")}
                                        onMouseUp = {this.unBindResizer.bind(this)}>
                
                                    </div>
                                    <div 
                                        className = "ppt-editor-drag-right"
                                        id = {"right_size_image_dragger_"+k}
                                        style = {carets}
                                        onMouseDown = {this.bindResizer.bind(this, k, "right")}
                                        onMouseUp = {this.unBindResizer.bind(this)}>
                                        
                                    </div>
                                    <div 
                                        className = "ppt-editor-drag-top"
                                        id = {"top_size_image_dragger_"+k}
                                        style = {carets}
                                        onMouseDown = {this.bindResizer.bind(this, k, "top")}
                                        onMouseUp = {this.unBindResizer.bind(this)}>
                                        
                                    </div>
                                    <div 
                                        className = "ppt-editor-drag-bottom"
                                        id = {"bottom_size_image_dragger_"+k}
                                        style = {carets}
                                        onMouseDown = {this.bindResizer.bind(this, k, "bottom")}
                                        onMouseUp = {this.unBindResizer.bind(this)}>
                                        
                                    </div>
                                    
                                    {v.image === null ? v.label : null}
                                    
                                    <input 
                                        type = "file"
                                        id = {"draggble_image_"+k}
                                        onChange = {this.inputFile.bind(this, k)}
                                        className = {this.state.allowInput == k ? "ppt-add-image-input" : "ppt-add-image-input ppt-add-image-readonly"}/>
                                </div>
                            </div>
                        )
                    })
                }
            </React.Fragment>
        )
    }
}