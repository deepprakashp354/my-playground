import React from 'react';
import './index.css';

export default class ColorPicker extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            colors : [
                "#00a8ff",
                "#9c88ff",
                "#fbc531",
                "#4cd137",
                "#487eb0",
                "#c23616",
                "#f5f6fa",
                "#7f8fa6",
                "#192a56",
                "#353b48"
            ],
            selected : this.props.selected ? this.props.selected : null,
            showColors : false,
            id : this.props.id ? this.props.id : null
        }

        this.hideColors = this.hideColors.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.selected !== nextProps.selected){
            this.setState({
                selected : nextProps.selected
            })
        }

        if(this.props.id !== nextProps.id){
            this.setState({
                id : nextProps.id
            })
        }
    }

    // show colors
    showColors(){
        this.setState({
            showColors : true
        }, () => {
            document.addEventListener('click', this.hideColors);
        })
    }

    // hide colors
    hideColors(){
        this.setState({
            showColors : false
        }, () => {
            document.removeEventListener('click', this.hideColors);
        })
    }

    // hide colors
    select(v){
        this.setState({
            selected : v
        }, () => {
            this.props.onColor(v);
        })
    }

    render(){
        var actionButton = {
            width : "100%",
            height : "100%",
            backgroundColor : this.state.selected !== null ? this.state.selected : "#ffffff",
            cursor : "pointer",
            userSelect : "none",
            color : this.state.selected !== null ? this.state.selected : "#ffffff",
            borderStyle : "solid",
            borderColor : "#000000",
            borderWidth : "1px"
        }

        return(
            <React.Fragment>
                <div 
                    id = "font_color_picker" 
                    className = "color-picker-container">
                    <div className = "color-picker-wrapper">
                        <div 
                            id = "font_color_picker" 
                            style = {actionButton}
                            onClick = {this.showColors.bind(this)}>
                            .
                        </div>
                        {
                            this.state.showColors ? (
                                <div className = "color-picker-colors">
                                    {
                                        this.state.colors.map((v, k) => {
                                            var style = {
                                                backgroundColor : v,
                                                color : v,
                                                userSelect : "none",
                                                cursor : "pointer"
                                            }

                                            return(
                                                <div 
                                                id = "font_color_picker" 
                                                    key = {v+"_"+k}
                                                    className = "color-picker-button"
                                                    style = {style}
                                                    onClick = {this.select.bind(this, v)}>
                                                    {"."}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}