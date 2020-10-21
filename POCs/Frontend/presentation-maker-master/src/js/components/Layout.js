import React from 'react';
import connect from 'redux-connect-decorator';
import NestedRouter from './master/NestedRouter/NestedRouter';
// import PptEditor from './master/PptEditor';
import PresentationMaker from './master/PresentationMaker/Index';

@connect((store) => {
    return {
        // testData : store.test.testData
    }
})

export default class Layout extends React.Component{
    constructor(props){
        super(props);

        this.state = {

        }
        this.redirect=this.redirect.bind(this)
    }

    componentDidMount(){
        // this.redirect("/auth");
    }
    
    redirect(path){
        this.props.history.push({
            pathname : path
        })
    }

    render(){
        return(
            <React.Fragment>
                <div style = {{width:"100%", height:"789px"}}>
                    {/* <NestedRouter routes = {this.props.routes} /> */}
                    <PresentationMaker />
                </div>
            </React.Fragment>
        )
    }
}