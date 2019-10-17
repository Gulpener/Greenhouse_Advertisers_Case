import React, { Component } from 'react';
import moment from 'moment';

class AdvertiserComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {      
      items: [
        {name: "Advertiser 1",createdAt: "2018-04-15T06:27:46.058Z", "campaignIds": [ 4,7,8 ]},
        {name: "Advertiser 2",createdAt: "2018-03-13T21:50:10.926Z", "campaignIds": [ 1 ]},
        {name: "Advertiser 3",createdAt: "2018-06-01T06:53:56.638Z", "campaignIds": [ 9, 5, 2, 3, 4 ]}
      ]
    };
  }


    render() {
      const { items } = this.state;
      return (
        <div>
          <h1>Overview of advertisers</h1>
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Creation date</th>
                <th># of campaigns</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{this.formatDate(item.createdAt)}</td>
                  <td>{item.campaignIds.length}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>);
    }

    formatDate(string){
      return new moment(string).format("DD-MM-YYYY");
    }
  }

  export default AdvertiserComponent;