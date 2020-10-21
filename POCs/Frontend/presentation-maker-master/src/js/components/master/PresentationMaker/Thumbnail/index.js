import React from 'react';
import './index.css';

export default class Thumbnail extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            id : this.props.id ? this.props.id : "thumnail_id",
            data : this.props.data ? this.props.data : {},
            editorContainerId : this.props.editorContainerId ? this.props.editorContainerId : "editor_container",
            clone : null
        }
    }

    componentDidMount(){
        // this.createThumbnail();
    }

    componentWillReceiveProps(nextProps){
        if(this.props.id !== nextProps.id){
            this.setState({
                id : nextProps.id
            })
        }

        if(this.props.data !== nextProps.data){
            this.setState({
                data : nextProps.data
            }, () => {
                this.createThumbnail()
            })
        }

        if(this.props.editorContainerId !== nextProps.editorContainerId){
            this.setState({
                editorContainerId : nextProps.editorContainerId
            })
        }
    }

    // create Thumbnail
    createThumbnail(){
        var element = document.getElementById(this.state.editorContainerId);
        var thumb = document.getElementById(this.state.id);

        this.removeChild(this.state.id);

        var clone = element.cloneNode(true);
        clone.id = "duplicate_editor_container_"+new Date();
        clone.style['zoom'] = "21%";
        
        // append the clone
        thumb.appendChild(clone);
    }

    // remove child
    removeChild(id){
        var element = document.getElementById(id);
        var childNodes = element.childNodes;

        for(var i = 0; i < childNodes.length ; i++){
            element.removeChild(childNodes[i]);
        }
    }

    render(){
        return(
            <div id = {this.state.id} style = {{width : "100%", height : "100%"}}>
                
            </div>
        )
    }
}