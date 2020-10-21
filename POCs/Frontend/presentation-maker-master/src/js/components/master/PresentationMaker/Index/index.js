import React from 'react';
import PptxGenJS from 'pptxgenjs';
import PptEditor from './../PptEditor';
import Thumbnail from './../Thumbnail';
import ColorPicker from './../ColorPicker';
import './index.css'

export default class PresentationMaker extends React.Component{
    constructor(props){
        super(props);

        this.state= {
            slideList : [],
            activeSlide : {},
            editorProp : {
                width : 800,
                height : 540
            },
            ppt : null,
            editorContainerId : "editor_container",
            fonts : [
                "Arial",
                "Arial Black",
                "Bodoni 72 Smallcaps",
                "Bradley Hand",
                "Comic Sans MS",
                "Courier New",
                "Georgia",
                "Gill Sans",
                "Impact",
                "Papyrus",
                "Tahoma",
                "Times New Roman",
                "Trebuchet MS"
            ]
        }
    }

    componentDidMount(){
        // add first slide
        this.addSlide("active");

        var ppt = new PptxGenJS();
        this.setState({
            ppt : ppt
        })
    }

    // get slide object
    getSlideObject(){
        return {
            texts : [],
            images : [],
            properties : {}
        }
    }

    // add new slide
    addSlide(opt){
        var arr = Object.assign([], this.state.slideList);
        var slideObj = this.getSlideObject();

        arr.push(slideObj);

        this.setState({
            slideList : arr
        }, () => {
            if(opt == "active")
                this.editSlide(this.state.slideList[0], 0);
        })
    }

    // edit slide
    editSlide(v, k){
        this.setState({
            activeSlide : {
                slide : v,
                key : k
            }
        })
    }

    // update text in slide
    updatedTextInSlide(data){
        var activeSlide = Object.assign({}, this.state.activeSlide);
        var slideList = Object.assign([], this.state.slideList);

        var obj = Object.assign({}, slideList[activeSlide.key]);
        obj.texts = Object.assign([], data);

        slideList[activeSlide.key]= Object.assign({}, obj);

        var newSlideList = Object.assign([], slideList);

        this.setState({
            slideList : newSlideList
        })
    }

    // update images in slide
    updatedImagesInSlide(data){
        var activeSlide = Object.assign({}, this.state.activeSlide);
        var slideList = Object.assign([], this.state.slideList);

        var obj = Object.assign({}, slideList[activeSlide.key]);
        obj.images = Object.assign([], data);

        slideList[activeSlide.key]= Object.assign({}, obj);

        var newSlideList = Object.assign([], slideList);

        this.setState({
            slideList : newSlideList
        })
    }

    // execute tool operation
    execute(type, e){
        switch(type){
            case "addText" : {
                this.refs["slide_powerpoint_editor"].addText();
                break;
            }

            case "addImage" : {
                this.refs["slide_powerpoint_editor"].addImage();
                break;
            }

            case "fontFamily" : {
                this.refs["slide_powerpoint_editor"].setFontFamily(e.target.value)
                break;
            }

            case "bold" : {
                this.refs["slide_powerpoint_editor"].bold();
                break;
            }

            case "italic" : {
                this.refs["slide_powerpoint_editor"].italic();
                break;
            }

            case "underline" : {
                this.refs["slide_powerpoint_editor"].underline();
                break;
            }

            case "generate" : {
                this.generatePPT();
                break;
            }
        }
    }

    // size change
    changeSizeInput(e){
        var fontSize = parseInt(e.target.value);

        this.refs["slide_powerpoint_editor"].setFontSize(fontSize);
    }

    //input file
    inputFile(e){
        if(Object.keys(e.target.files).length === 0) return false;

        var file = e.target.files[0];
        
        var slideList = Object.assign([], this.state.slideList);
        var activeSlide = Object.assign({}, this.state.activeSlide);
        
        var slideObj = slideList[activeSlide.key];
        slideObj.properties.backgroundImage = URL.createObjectURL(file);

        // update slide
        this.updateSlide(activeSlide.key, slideObj)
    }

    // update slide
    updateSlide(key, obj){
        var slideList = Object.assign([], this.state.slideList);

        slideList[key] = Object.assign({}, obj);

        var newSlideList = Object.assign([], slideList);

        this.setState({
            slideList : newSlideList
        })
    }

    // generate ppt
    generatePPT(){
        var ppt = this.state.ppt;
        // create slides
        var slides = {};
        this.state.slideList.map((v, k) => {
            var masterSlide = "MASTER_SLIDE_"+k;
            // create master slide
            this.createMasterSlide(masterSlide, v.properties);

            // add slide
            slides["slide"+k] = ppt.addNewSlide(masterSlide);
            
            // add texts to this slide
            this.addTexts(slides["slide"+k], v.texts);

            // add images to this slide
            this.addImages(slides["slide"+k], v.images);
        })

        ppt.save('test');
    }

    // create background image master slide
    createMasterSlide(name, properties){
        var ppt = this.state.ppt;
        var options = {
            title: name
        }

        // background image
        if(properties.hasOwnProperty('backgroundImage'))
            options["bkgd"] = {
                path : properties.backgroundImage
            }
        
        // background color
        if(properties.hasOwnProperty('backgroundColor'))
            options["bkgd"] = properties.backgroundColor

        ppt.defineSlideMaster(options);
    }

    // add texts to slide
    addTexts(slide, texts){
        texts.map((v, k) => {
            var xCoord = this.getPercentValue(v.coord[0], "horizontal");
            var yCoord = this.getPercentValue(v.coord[1], "vertical");
            var w = this.getPercentValue(v.size[0], "horizontal");
            var h = this.getPercentValue(v.size[1], "vertical");

            var textFormatting = this.formatText(v.text);
            
            // ## fonts :
            // "Arial",
            // "Arial Black",
            // "Bodoni 72 Smallcaps",
            // "Bradley Hand",
            // "Comic Sans MS",
            // "Courier New",
            // "Georgia",
            // "Gill Sans",
            // "Impact",
            // "Papyrus",
            // "Tahoma",
            // "Times New Roman",
            // "Trebuchet MS"

            var option = {
                x: xCoord+"%",
                y: yCoord+"%",
                w: w+"%",
                h: h+"%",
                align : "center",
                bold : textFormatting.b,
                italic : textFormatting.i,
                underline : textFormatting.u,
                color : v.props.color.replace("#", ""),
                fontFace : v.props.fontFamily,
                // fontFace : "Calibri",
                fontSize : v.props.fontSize
            }

            slide.addText(textFormatting.text, option);         
        })
    }

    // add images
    addImages(slide, images){
        images.map((v, k) => {
            var xCoord = this.getPercentValue(v.coord[0], "horizontal");
            var yCoord = this.getPercentValue(v.coord[1], "vertical");
            var w = this.getPercentValue(v.size[0], "horizontal");
            var h = this.getPercentValue(v.size[1], "vertical");

            var option = {
                path : v.image,
                x: xCoord+"%",
                y: yCoord+"%",
                w: w+"%",
                h: h+"%"
            }

            slide.addImage(option);         
        })
    }

    // get percent values
    getPercentValue(v, dirn){
        if(dirn == "horizontal")
            return (v/this.state.editorProp.width)*100;
        else return (v/this.state.editorProp.height)*100;
    }

    // format text
    formatText(text){
        var obj = {
            text : text,
            b : false,
            i : false,
            u : false
        }

        if(this.isBold(text)){
            obj.b = true;
            obj.text = obj.text.replace("<b>", "").replace("</b>", "");
        }

        if(this.isItalic(text)){
            obj.i = true;
            obj.text = obj.text.replace("<i>", "").replace("</i>", "");
        }

        if(this.isUnderlined(text)){
            obj.u = true;
            obj.text = obj.text.replace("<u>", "").replace("</u>", "");
        }

        return obj;
    }

    // on color
    onColor(type, color){
        if(type == "font")
            this.refs["slide_powerpoint_editor"].setFontColor(color);
        else if(type == "background"){
            var slideList = Object.assign([], this.state.slideList);
            var activeSlide = Object.assign({}, this.state.activeSlide);
            
            var slideObj = slideList[activeSlide.key];
            slideObj.properties.backgroundColor = color;

            this.updateSlide(activeSlide.key, slideObj);
        }
    }

    // is bold
    isBold(text){
        if(text.indexOf('<b>') !== -1 && text.indexOf('</b>') !== -1) return true;
        else return false; 
    }

    // is italic
    isItalic(text){
        if(text.indexOf('<i>') !== -1 && text.indexOf('</i>') !== -1) return true;
        else return false; 
    }

    // is isUnderlined
    isUnderlined(text){
        if(text.indexOf('<u>') !== -1 && text.indexOf('</u>') !== -1) return true;
        else return false; 
    }

    render(){
        return(
            <React.Fragment>
                <div className = "ppt-editor-container">
                    {/* toolbar */}
                    <div className = "ppt-editor-tool-bar">
                        <div className = "ppt-editor-tools">
                            {/* add text */}
                            <div className = "ppt-editor-toolbox-item">
                                <div
                                    id = "add_text_editor" 
                                    className = "ppt-editor-tool-button"
                                    onClick = {this.execute.bind(this, "addText")}>
                                    <b>T</b>
                                </div>
                            </div>
                            {/* add image */}
                            <div className = "ppt-editor-toolbox-item">
                                <div 
                                    id = "add_image_editor"
                                    className = "ppt-editor-tool-button"
                                    onClick = {this.execute.bind(this, "addImage")}>
                                    IC
                                </div>
                            </div>
                            {/* font family */}
                            <div 
                                className = "ppt-editor-toolbox-item"
                                style = {{
                                    width : "200px"
                                }} >
                                <div 
                                    className = "ppt-editor-tool-button"
                                    style = {{
                                        width : "100%",
                                        margin : "0px"
                                    }}
                                    onClick = {this.execute.bind(this, )}>
                                    <select 
                                        id = "change_font_family"
                                        style = {{
                                            float : "left",
                                            width : "100%"
                                        }}
                                        onChange = {this.execute.bind(this, "fontFamily")}>
                                        <option>Regular</option>
                                        {
                                            this.state.fonts.map((v, k) => {
                                                return <option style = {{fontFamily : v}}>{v}</option>
                                            })
                                        }
                                        {/* <option style = {{fontFamily : "Caveat"}}>Caveat</option>
                                        <option style = {{fontFamily : "HomemadeApple"}}>HomemadeApple</option>
                                        <option style = {{fontFamily : "Lemonada"}}>Lemonada</option>
                                        <option style = {{fontFamily : "Sansita"}}>Sansita</option>
                                        <option style = {{fontFamily : "TheMix"}}>TheMix</option> */}
                                    </select>
                                </div>
                            </div>
                            {/* font size */}
                            <div className = "ppt-editor-toolbox-item">
                                <div 
                                    className = "ppt-editor-tool-button"
                                    onClick = {this.execute.bind(this, "fontSize")}>
                                    <input 
                                        id = "change_font_size"
                                        type = "text"
                                        onChange = {this.changeSizeInput.bind(this)}
                                        style = {{width:"30px",height:"100%"}}/>
                                </div>
                            </div>
                            {/* bold */}
                            <div className = "ppt-editor-toolbox-item">
                                <div 
                                    id = "make_text_bold"
                                    className = "ppt-editor-tool-button"
                                    onClick = {this.execute.bind(this, "bold")}>
                                    <b>B</b>
                                </div>
                            </div>
                            {/* italic */}
                            <div className = "ppt-editor-toolbox-item">
                                <div 
                                    id = "make_text_italic"
                                    className = "ppt-editor-tool-button"
                                    onClick = {this.execute.bind(this, "italic")}>
                                    <i>I</i>
                                </div>
                            </div>
                            {/* underline */}
                            <div className = "ppt-editor-toolbox-item">
                                <div 
                                    id = "make_text_underline"
                                    className = "ppt-editor-tool-button"
                                    onClick = {this.execute.bind(this, "underline")}>
                                    <u>U</u>
                                </div>
                            </div>
                            {/* Add Background */}
                            <div className = "ppt-editor-toolbox-item">
                                <div 
                                    className = "ppt-editor-tool-button ppt-add-background-image-input"
                                    style = {{width : "38px"}}
                                    onClick = {this.execute.bind(this, "bg")}>
                                    BG

                                    <input 
                                        type = "file"
                                        onChange = {this.inputFile.bind(this)}
                                        className = "ppt-add-image-input"/>
                                </div>
                            </div>
                            {/* Generate PPT */}
                            <div className = "ppt-editor-toolbox-item">
                                <div 
                                    className = "ppt-editor-tool-button"
                                    style = {{width : "38px"}}
                                    onClick = {this.execute.bind(this, "generate")}>
                                    PPT
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* body */}
                    <div className = "ppt-editor-body">
                        {/* trackbar */}
                        <div className = "ppt-editor-trackbar">
                            <div 
                                className = "ppt-editor-trackbar-addslide-button"
                                onClick = {this.addSlide.bind(this)}>
                                Add Slide
                            </div>
                            <div className = "ppt-editor-trackbar-slide-thumbnail-container">
                                {/* slides */}
                                {
                                    this.state.slideList.map((v, k) => {
                                        var active = {}

                                        if(this.state.activeSlide.key == k)
                                            active = {
                                                backgroundColor : "#576574"
                                            }

                                        return(
                                            <div 
                                                key = {"presentation_maker_slide_"+k}
                                                className = "ppt-editor-trackbar-slide-thumbnail-wrapper"
                                                onClick = {this.editSlide.bind(this, v, k)}
                                                style = {active}>
                                                <div className = "ppt-editor-trackbar-slide-thumbnail-cell ppt-editor-trackbar-slide-thumbnail-sno">
                                                    {(k+1)+"."}
                                                </div>
                                                <div className = "ppt-editor-trackbar-slide-thumbnail-cell">
                                                    <div className = "ppt-editor-trackbar-slide-thumbnail-item">
                                                        <Thumbnail 
                                                            id = {"ppt_trackbar_element_"+k}
                                                            editorContainerId = {this.state.editorContainerId}
                                                            data = {v}/>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>

                        {/* customizer */}
                        <div className = "ppt-editor-slide-customizer">
                            <div className = "ppt-editor-slide-canvas">
                                <PptEditor
                                    slide = {this.state.activeSlide.slide}
                                    slideProps = {this.state.slideList[this.state.activeSlide.key]}
                                    updatedTextInSlide = {this.updatedTextInSlide.bind(this)}
                                    updatedImagesInSlide = {this.updatedImagesInSlide.bind(this)}
                                    ref = "slide_powerpoint_editor"
                                    editorContainerId = {this.state.editorContainerId}/>
                            </div>
                        </div>
                    </div>
                    {/* slide editor */}
                    <div className = "ppt-editor-slide-editor">
                        <div 
                            id = "font_color_picker" 
                            style = {{
                                height : "30px"
                            }}>
                            <div id = "font_color_picker"  style = {{
                                display : "table",
                                marginTop : "10px"
                            }}>
                                <div id = "font_color_picker"  style = {{
                                    display : "table-cell",
                                    width : "30px",
                                    height : "30px",
                                    verticalAlign : "middle",
                                }}>
                                    <ColorPicker
                                        id = "font_color_picker" 
                                        selected = "#ffffff"
                                        onColor = {this.onColor.bind(this, "background")}/>
                                </div>
                                <div id = "font_color_picker"  style = {{
                                    display : "table-cell",
                                    height : "30px",
                                    color : "#ffffff",
                                    paddingLeft : "14px",
                                    paddingRight : "14px",
                                    paddingTop : "2px"
                                }}>
                                    Background
                                </div>
                        
                                <div id = "font_color_picker"  style = {{
                                    display : "table-cell",
                                    width : "30px",
                                    height : "30px",
                                    verticalAlign : "middle"
                                }}>
                                    <ColorPicker 
                                        id = "font_color_picker" 
                                        selected = "#000000"
                                        onColor = {this.onColor.bind(this, "font")}/>
                                </div>
                                <div id = "font_color_picker"  style = {{
                                    display : "table-cell",
                                    height : "30px",
                                    color : "#ffffff",
                                    paddingLeft : "14px",
                                    paddingRight : "14px",
                                    paddingTop : "2px"
                                }}>
                                    Font
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}