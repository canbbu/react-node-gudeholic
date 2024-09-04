import React from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell';

class Customer extends React.Component{
    render (){
        console.log("id "+ this.props.id)
        console.log("id "+ this.props.image)
        console.log("id "+ this.props.birthday)
        return (
            <TableRow>
                <TableCell>{this.props.id}</TableCell>
                <TableCell>{this.props.image}</TableCell>
                <TableCell>{this.props.name}</TableCell>
                <TableCell>{this.props.birthday}</TableCell>
                <TableCell>{this.props.gender}</TableCell>
                <TableCell>{this.props.job}</TableCell>
            </TableRow>
        )
    }
}


export default Customer