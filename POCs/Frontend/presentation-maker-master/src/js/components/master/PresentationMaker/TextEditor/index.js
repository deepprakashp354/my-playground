import React from 'react';
import EditableDiv from './../EditableDiv';
import Arrow from './../Arrow';
import './index.css';
import './../../../../../css/fonts.css';

export default class TextEditor extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            texts : this.props.data !== undefined ? this.props.data : [],
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
            selection : {}
        }

        this.closeEditText = this.closeEditText.bind(this);
        this.textInactive = this.textInactive.bind(this)
        this.move = this.move.bind(this);
        this.resize = this.resize.bind(this);
    }

    componentDidMount(){
        this.init();
    }

    componentWillReceiveProps(nextProps){
        if(this.props.data !== nextProps.data){
            this.setState({
                texts : nextProps.data
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

    // add text object
    addTextObject(){
        var allText = Object.assign([], this.state.texts);
        var obj = this.getTextObject();
        allText.push(obj);
        this.setState({
            texts : allText
        }, () => {
            this.props.updatedTextInSlide(this.state.texts);
        })
    }

    // get text Object
    getTextObject(){
        var textWrapperSize = [300, 50];

        var containerProps = Object.assign({}, this.state.containerProps);
        var containerSize = containerProps.size;

        // getting the position
        var left = (containerSize[0]/2) - (textWrapperSize[0]/2);
        var top = (containerSize[1]/2) - (textWrapperSize[1]/2);

        return {
            text : "Add Text Here",
            coord : [left, top],
            size : textWrapperSize,
            key : null,
            tmpEl : {
                innerHTML : "Add Text Here"
            },
            props : {
                fontSize : 14,
                fontFamily : null,
                color : "#000000"
            }
        }
    }

    // get all texts
    getAllTexts(){
        return this.state.texts;
    }

    // open edit text
    editText(key){
        this.setState({
            editState : key
        }, () => {
            document.addEventListener('click', this.closeEditText);
            // focus to div
            this.refs["ppt_editable_div_"+key].getInput().focus();
        })
    }

    // active input
    activeInput(key){
        this.setState({
            activeState : key
        }, () => {
            document.addEventListener('click', this.textInactive);
        })
    }

    // make the input inactive
    textInactive(e){
        var k = this.state.activeState;
        var clickedOnTools = false;

        var arr = [
            "make_text_bold",
            "make_text_italic",
            "make_text_underline",
            "change_font_size",
            "add_text_editor",
            "add_image_editor",
            "change_font_family",
            "font_color_picker"
        ];
        
        // find a better solution for this condition
        if(arr.indexOf(e.target.id) !== -1){
            clickedOnTools = true
        }

        if(e.target.id == "ppt_noneditable_div_"+k || e.target.parentNode.id == "ppt_noneditable_div_"+k || clickedOnTools) return;

        this.setState({
            activeState : null
        }, () => {
            document.removeEventListener('click', this.textInactive);
        })
    }

    // close edit text
    closeEditText(e){
        var key = this.state.editState;

        var clickedOnTools = false;

        var arr = [
            "make_text_bold",
            "make_text_italic",
            "make_text_underline",
            "change_font_size",
            "add_text_editor",
            "add_image_editor",
            "change_font_family",
            "font_color_picker"
        ];
        
        // find a better solution for this condition
        if(arr.indexOf(e.target.id) !== -1){
            clickedOnTools = true
        }

        if(clickedOnTools || e.target.id === "ppt_editable_div_"+key) return;

        this.setState({
            editState : null
        }, () => {
            document.removeEventListener('click', this.closeEditText);

            // update sizer positions
            this.setSizerPosition("vertical", key);
            this.setSizerPosition("horizontal", key);
        })
    }

    // update text
    textUpdated(key, value){
        var texts = Object.assign([], this.state.texts);
        var field = Object.assign({}, texts[key]);

        field.text = value;
        field.key = key;

        var el = document.createElement('div');
        el.innerHTML = value;

        field.tmpEl = el;
        
        var newField = Object.assign({}, field);
        texts[key] = Object.assign({}, newField);
        var newTexts = Object.assign([], texts);

        this.setState({
            texts : newTexts
        }, () => {
            this.props.updatedTextInSlide(this.state.texts);
        })
    }

    // drag active
    dragActive(k, e){
        var arr = [
            "left_size_dragger_"+k,
            "right_size_dragger_"+k,
            "top_size_dragger_"+k,
            "bottom_size_dragger_"+k
        ]

        if(arr.indexOf(e.target.id) !== -1) return;

        var element = this.refs["draggble_text_"+k];
        
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

        var texts = Object.assign([], this.state.texts);
        texts[dragElement["k"]].coord = [left, top];

        var newTexts = Object.assign([], texts);

        var newDragElement = Object.assign({}, dragElement);
        newDragElement.clickPos = [e.clientX, e.clientY];

        this.setState({
            texts : newTexts,
            dragElement : newDragElement
        }, () => {
            this.props.updatedTextInSlide(this.state.texts);
        })
    }

    // bind resizer
    bindResizer(k, direction, e){
        var container = document.getElementById(this.state.containerId);
        var arr = [
            "left_size_dragger_"+k,
            "right_size_dragger_"+k,
            "top_size_dragger_"+k,
            "bottom_size_dragger_"+k
        ]

        if(arr.indexOf(e.target.id) === -1) return;

        var element = this.refs["draggble_text_"+k];

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

                // update text
                var textObj = this.getText(dragElement.k);
                textObj.size[0] = width;
                textObj.coord[0] = left;
                this.updateText(dragElement.k, textObj);

                // reposition sizer
                this.setSizerPosition("horizontal")

                break;
            }

            case "right" : {
                // update text
                var textObj = this.getText(dragElement.k);
                textObj.size[0] = e.pageX - element.getBoundingClientRect().left;
                this.updateText(dragElement.k, textObj);

                // reposition sizer
                this.setSizerPosition("horizontal")

                break;
            }

            case "top" : {
                var offset = pivots[2] - e.pageY + this.state.yCoeff;
                var top = pivots[2] - offset;

                // update text
                var textObj = this.getText(dragElement.k);
                textObj.size[1] = offset;
                textObj.coord[1] = top;
                this.updateText(dragElement.k, textObj);

                // reposition sizer
                this.setSizerPosition("vertical")

                break;
            }

            case "bottom" : {
                // update text
                var textObj = this.getText(dragElement.k);
                textObj.size[1] = e.pageY - element.getBoundingClientRect().top;
                this.updateText(dragElement.k, textObj);

                // reposition sizer
                this.setSizerPosition("vertical")
                break;
            }
        }
    }
    
    // get editor ref
    getText(key){
        var allText = Object.assign([], this.state.texts);
        return allText[key];
    }

    // update text editor payload
    updateText(key, obj){
        var allText = Object.assign([], this.state.texts);
        allText[key] = Object.assign({}, obj);

        var newTextObj = Object.assign([], allText);

        this.setState({
            texts : newTextObj
        }, () => {
            this.props.updatedTextInSlide(this.state.texts);
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
                var topSizeDragger = document.getElementById('top_size_dragger_'+dragElement.k);
                var bottomSizeDragger = document.getElementById('bottom_size_dragger_'+dragElement.k);

                topSizeDragger.style.left = ((element.offsetWidth/2) - (topSizeDragger.offsetWidth/2))+"px";
                bottomSizeDragger.style.left = ((element.offsetWidth/2) - (bottomSizeDragger.offsetWidth/2))+"px";

                break;
            }

            case "vertical" : {
                // setting sizer's position
                var leftSizeDragger = document.getElementById('left_size_dragger_'+dragElement.k);
                var rightSizeDragger = document.getElementById('right_size_dragger_'+dragElement.k);

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

    // text formating
    onSelect(type){
        var selection = window.getSelection();

        var baseNode = selection.baseNode;
        var range = null;
        try {
            range = selection.getRangeAt(0);
        } catch(e){
            console.warn("please select something first.")
            return;
        }

        var start = range.startOffset;
        var end = range.endOffset;
        if(start !== end){
            var selectedValue = baseNode.textContent.substring(start, end);
            var obj = {
                start : start,
                end : end,
                value : selectedValue,
                selection : selection,
                key : this.state.editState
            }

            this.setState({
                selection : obj
            }, () => {
                var editor = this.refs["ppt_editable_div_"+this.state.editState];
                editor[type](this.state.selection);
            })
        }
    }

    // bold
    bold(){
        this.onSelect("bold");
    }

    // italic
    italic(){
        this.onSelect("italic");
    }

    // undeline
    underline(){
        this.onSelect("underline");
    }

    // set font size
    setFontSize(size){
        var key = this.state.editState || this.state.activeState;
        var texts = Object.assign([], this.state.texts);
        var obj = texts[key];
        obj.props.fontSize = size;
        
        this.updateText(key, obj);
    }

    // set font color
    setFontColor(color){
        var key = this.state.editState || this.state.activeState;
        var texts = Object.assign([], this.state.texts);
        var obj = texts[key];
        obj.props.color = color;
        
        this.updateText(key, obj);
    }

    // set font family
    setFontFamily(family){
        var key = this.state.editState || this.state.activeState;
        var texts = Object.assign([], this.state.texts);
        var obj = texts[key];
        obj.props.fontFamily = family;
        
        this.updateText(key, obj);
    }

    render(){
        return(
            <React.Fragment>
                {
                    this.state.texts.map((v, k) => {
                        var editActive = this.state.editState !== null && this.state.editState == k;

                        var style = {
                            position : "absolute",
                            left : v.coord[0]+"px",
                            top : v.coord[1]+"px",
                            display : "table",
                            width : v.size[0],
                            height : v.size[1],
                            cursor : editActive ? "auto" : "move",
                            userSelect : "none",
                            transformOrigin: "center center",
                            boxSizing : "border-box"
                        }

                        var carets = {
                            display : "none"
                        }

                        if(this.state.activeState == k){
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
                            whiteSpace: "pre-wrap",
                            fontSize : v.props.fontSize+"px",
                            fontFamily : v.props.fontFamily,
                            color : v.props.color
                        }

                        var inputStyle = {
                            width : "100%",
                            height : "100%"
                        }

                        return (
                            <div 
                                key = {v.text+"_editor_"+k}
                                style = {style}
                                ref = {"draggble_text_"+k}
                                className = "ppt-editor-text-editor-container"
                                onClick = {this.activeInput.bind(this, k)}
                                onDoubleClick = {editActive ? () => {} : this.editText.bind(this, k)}
                                onMouseDown = {editActive ? () => {} : this.dragActive.bind(this, k)}
                                onMouseUp = {this.unBindDragFromContainer.bind(this)}>
                                {
                                    editActive ? (
                                        <div style = {cellClassName}>
                                            <EditableDiv style = {inputStyle}
                                                ref = {"ppt_editable_div_"+k}
                                                id = {"ppt_editable_div_"+k}
                                                value = {v.tmpEl}
                                                onChange = {this.textUpdated.bind(this, k)}/>
                                        </div>
                                    ) : (
                                        <div style = {cellClassName} id = {"ppt_noneditable_div_"+k}>
                                            <div 
                                                className = "ppt-editor-drag-left"
                                                id = {"left_size_dragger_"+k}
                                                style = {carets}
                                                onMouseDown = {this.bindResizer.bind(this, k, "left")}
                                                onMouseUp = {this.unBindResizer.bind(this)}>
                        
                                            </div>
                                            <div 
                                                className = "ppt-editor-drag-right"
                                                id = {"right_size_dragger_"+k}
                                                style = {carets}
                                                onMouseDown = {this.bindResizer.bind(this, k, "right")}
                                                onMouseUp = {this.unBindResizer.bind(this)}>
                                                
                                            </div>
                                            <div 
                                                className = "ppt-editor-drag-top"
                                                id = {"top_size_dragger_"+k}
                                                style = {carets}
                                                onMouseDown = {this.bindResizer.bind(this, k, "top")}
                                                onMouseUp = {this.unBindResizer.bind(this)}>
                                                
                                            </div>
                                            <div 
                                                className = "ppt-editor-drag-bottom"
                                                id = {"bottom_size_dragger_"+k}
                                                style = {carets}
                                                onMouseDown = {this.bindResizer.bind(this, k, "bottom")}
                                                onMouseUp = {this.unBindResizer.bind(this)}>
                                                
                                            </div>
                                            {/* {v.text} */}
                                            <div dangerouslySetInnerHTML = {{__html : v.tmpEl.innerHTML}}>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                }
            </React.Fragment>
        )
    }
}