import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setProjectId } from '@/store/actions/project';

class Welcome extends Component{

    componentWillMount(){
        const id = this.props.match.params.id;
        let { setProjectId } = this.props;
        setProjectId(id);
    }

    render(){
        return(
            <div>
                <p style={{fontSize: 24, fontWeight: 'bold'}}>Welcome to Devops</p>
            </div>
        )
    }
}

export default connect(state => {
    return{
        //
    }
}, { setProjectId })(Welcome);
