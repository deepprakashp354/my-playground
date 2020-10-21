import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import NestedRouter from './../master/NestedRouter/NestedRouter';
import swal from 'sweetalert';

export default class Router extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            routes : this.props.routes !== undefined ? this.props.routes : []
		}
    }

    componentWillReceiveProps(nextProps){
        // if route config changed dynamically
        if(this.props.routes !== nextProps.routes){
            this.setState({
                routes : nextProps.routes
			})
        }
    }

    componentDidMount() {
        const script = document.createElement("script");

        let apiKey = process.env.REACT_APP_MAPS_KEY;
        // console.log("PROCESS IS ", process.env.MAPS_KEY);
        if (apiKey && apiKey.length > 0) {
            script.src = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=places";
            script.async = true;

            document.head.appendChild(script);
        } 
    }

    render(){
        return(
            <div>
                <BrowserRouter>
                    <Switch>
                        <NestedRouter routes = {this.state.routes} />
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}