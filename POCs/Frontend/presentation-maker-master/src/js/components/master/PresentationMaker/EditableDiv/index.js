import React from 'react';

export default class EditableDiv extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            style : this.props.style !== undefined ? this.props.style : {},
            value : this.props.value !== undefined ? this.props.value : "Add Text Here",
            id : this.props.id !== undefined ? this.props.id : "",
            element : null,
            selection : this.props.selection !== undefined ? this.props.selection : {}
        }
    }

    componentDidMount(){
        var element = this.refs[this.state.id];
        element.innerHTML = this.state.value.innerHTML;
        
        this.setState({
            element : element
        }, () => {
            this.setCaretAtEnd()
        })
    }

    componentWillReceiveProps(nextProps){
        if(this.props.style !== nextProps.style){
            this.setState({
                style : nextProps.style
            })
        }

        if(this.props.value !== nextProps.value){
            this.setState({
                value : nextProps.value
            }, () => {
                this.setText(this.state.value);
            })
        }

        if(this.props.id !== nextProps.id){
            this.setState({
                id : nextProps.id
            }, () => {
                this.setState({
                    element : this.refs[this.state.id]
                })
            })
        }

        if(this.props.selection !== nextProps.selection){
            this.setState({
                selection : nextProps.selection
            })
        }
    }

    // get input
    onInput(e){
        var value = e.target.innerHTML;

        // set input text
        this.setText(value);

        // sent to parent
        this.props.onChange(value);
    }

    // set text
    setText(value){
        var element = this.refs[this.state.id]; 
        element.innerHTML = value.innerHTML;

        // set caret at the end
        this.setCaretAtEnd()
    }

    // set inner html
    setInnerHtml(tags, element){
        tags.map((v, k) => {
            element.appendChild(v);
        })
    }

    // get all html element
    getAllHtmlElement(element){
        return element.childNodes;
    }

    // set caret at the end
    setCaretAtEnd(){
        var el = this.state.element;
        if(el === null) return;

        el.focus();
        if(typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();

            sel.addRange(range);
        } else if(typeof document.body.createTextRange !== "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    // bold
    bold(selection){
        var element = this.refs[this.state.id];
        
        element.innerHTML = element.innerHTML.replace(selection.value, "<b>"+selection.value+"</b>");
        this.props.onChange(element.innerHTML);

    }

    // italic
    italic(selection){
        var element = this.refs[this.state.id];

        element.innerHTML = element.innerHTML.replace(selection.value, "<i>"+selection.value+"</i>");
        this.props.onChange(element.innerHTML);
    }

    // underline
    underline(selection){
        var element = this.refs[this.state.id];

        element.innerHTML = element.innerHTML.replace(selection.value, "<u>"+selection.value+"</u>");
        this.props.onChange(element.innerHTML);
    }

    // set font size
    setFontSize(size){
        var element = this.refs[this.state.id];

        element.innerHTML = "<span style = 'font-size:"+size+"px'>"+element.innerHTML+"</span>";
        this.props.onChange(element.innerHTML);
    }

    // set font family
    setFontFamily(family){
        var element = this.refs[this.state.id];

        element.innerHTML = "<span style = 'font-family:"+family+"'>"+element.innerHTML+"</span>";
        this.props.onChange(element.innerHTML);
    }

    // set font color
    setFontColor(color){
        var element = this.refs[this.state.id];

        element.innerHTML = "<span style = 'color:"+color+"'>"+element.innerHTML+"</span>";
        this.props.onChange(element.innerHTML);
    }

    // get node id
    getNodeId(tags, selection){
        var nodeId = null;
        Object.keys(tags).map((v, k) => {
            var strAtSelection = tags[v].textContent.substring(selection.start, selection.end);
            if(strAtSelection === selection.value){
                nodeId = v;
            }
        })

        return nodeId;
    }

    // get input
    getInput(){
        return this.refs[this.state.id];
    }

    render(){
        var containerStyle = {
            display : "table",
            ...this.state.style
        }

        var wrapperStyle = {
            display : "table-cell",
            verticalAlign : "middle",
            textAlign : "center",
            outline : "none"
        }

        return(
            <div style = {containerStyle}>
                <div 
                    ref = {this.state.id}
                    style = {wrapperStyle}
                    contentEditable = {true}
                    onInput = {this.onInput.bind(this)}
                >
                    
                </div>
            </div>
        )
    }
}