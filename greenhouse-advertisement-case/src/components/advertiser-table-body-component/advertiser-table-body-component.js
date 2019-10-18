import React from 'react';
import moment from 'moment';

class AdvertiserTableBodyComponent extends React.Component {
    constructor(props) {
      super(props);

    }

    render(){
        const { data, isAdvertisersLoading, isAdvertisersError, sort } = this.props;         
        if(isAdvertisersError)
        {
          return (<tr><td>Could not load data :(</td><td></td><td></td><td></td><td></td></tr>)
        }
        else if(isAdvertisersLoading)
        {
          return (<tr><td>Loading...</td><td></td><td></td><td></td><td></td></tr>)
        }
        else if(data)
        {
          let advertisers = data; 
          if(sort)
          {
            advertisers = data.sort(this.valueComparer(sort.orderBy, sort.order))
          }
          return(
            advertisers.map(advertiser => (
            <tr key={advertiser.name}>
              <td>{advertiser.name}</td>
              <td>{this.formatDate(advertiser.createdAt)}</td>
              <td>{advertiser.campaigns}</td>
              <td>{advertiser.impressions ? advertiser.impressions : "n/a"}</td>
              <td>{advertiser.clicks ? advertiser.clicks : "n/a"}</td>
            </tr>
          )));
        } 

        return <div></div>;
    }

    formatDate(string){
        return new moment(string).format("DD-MM-YYYY");
      }

      valueComparer(key, order='asc') {
        return function(a, b) {
          if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {          
            return 0;
          }
  
          const varA = (typeof a[key] === 'string') ?
            a[key].toUpperCase() : a[key];
          const varB = (typeof b[key] === 'string') ?
            b[key].toUpperCase() : b[key];
  
          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return (
            (order === 'desc') ? (comparison * -1) : comparison
          );
        };
      }
}

export default AdvertiserTableBodyComponent;