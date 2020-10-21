import React from 'react';
import './index.css';

export default class Arrow extends React.Component{
    constructor(props){
        super(props);

        this.state = {

        }
    }

    render(){
        var style = {
            border: "solid black",
            borderWidth: "0 3px 3px 0",
            display: "inline-block",
            padding: "3px"
        }

        var type = "right";
        if(this.props.style) 
            style = {
                ...this.props.style
            }

        if(this.props.type)
            type = this.props.type;
        
        return(
            <React.Fragment>
                <i className={type} style = {style}></i>
            </React.Fragment>
        )
    }
}