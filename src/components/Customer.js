import React from 'react'

class Customer extends React.Component{
    render (){
        return (
            <div>
                <CustomerProfile img = {this.props.img} />
                <CustomerInfo name = {this.props.name} age = {this.props.age} job = {this.props.job}/>
            </div>
        )
    }
}

class CustomerProfile extends React.Component{
    render (){
        return(
            <div>
                <p>{this.props.img}</p>
            </div>
        )
    }
}

class CustomerInfo extends React.Component{
    render (){
        return(
            <div>
                <p>{this.props.name}</p>
                <p>{this.props.age}</p>
                <p>{this.props.job}</p>
            </div>
        )
    }
}

export default Customer