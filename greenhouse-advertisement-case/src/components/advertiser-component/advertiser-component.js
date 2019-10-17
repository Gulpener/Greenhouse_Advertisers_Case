import React, { Component } from 'react';
import moment from 'moment';

class AdvertiserComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {      
      items: []
    };
  }

  
  componentDidMount() {
    fetch("https://5b87a97d35589600143c1424.mockapi.io/api/v1/advertisers")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({            
            items: result
          });
        },
        (error) => {
          console.log(error);
        }
      )
  }


    render() {
      const { items } = this.state;
      let tableItems;
      if(items)
      {
        tableItems = (
          items.map(item => (
          <tr key={item.name}>
            <td>{item.name}</td>
            <td>{this.formatDate(item.createdAt)}</td>
            <td>{item.campaignIds.length}</td>
          </tr>
      )));
      }
      return (
        <div>
          <h1>Overview of advertisers</h1>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Creation date</th>
                <th># of campaigns</th>
              </tr>
            </thead>
            <tbody>
              {
                tableItems
              }
            </tbody>
          </table>
        </div>);
    }

    formatDate(string){
      return new moment(string).format("DD-MM-YYYY");
    }
  }

  export default AdvertiserComponent;