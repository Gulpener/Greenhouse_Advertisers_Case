import React from 'react';
import moment from 'moment';
import './advertiser-component.css';

class AdvertiserComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {      
      items: [],
      isAdvertisersLoading: false,
      isAdvertisersError: false,
    };
  }
  
  componentDidMount() {   
    this.loadAdvertisers();     
  }

  loadAdvertisers()
  {
    this.setState({      
      isAdvertisersLoading: true,       
    });
    fetch("https://5b87a97d35589600143c1424.mockapi.io/api/v1/advertisers?")
      .then(res => res.json())
      .then(
        (result) => {                   
          if(Array.isArray(result))
          {
            this.setState({            
              items: result,
              isAdvertisersLoading: false,              
            });
            this.loadAdvertiserStatistics();
          }
          else
          {
            console.error(result);
            this.setState({                          
              isAdvertisersLoading: false,
              isAdvertisersError: true
            }); 
          }
        },
        (error) => {    
          console.error(error);      
          this.setState({                        
            isAdvertisersLoading: false,
            isAdvertisersError: true
          });          
        }
      )
  }

  loadAdvertiserStatistics()
  {
    fetch("https://5b87a97d35589600143c1424.mockapi.io/api/v1/advertiser-statistics")
      .then(res => res.json())
      .then(
        (result) => {                   
          if(Array.isArray(result))
          {                        
            this.setState({            
              items: this.enrichAdvertisers(this.state.items, result),
            });          
          }
          else
          {
            console.error(result);
          }
        },
        (error) => {          
          console.error(error);
        }
      )
  }

  enrichAdvertisers(items, statistics)
  {
      items.forEach(function(item){
          let statistic = statistics.find(x=>x.advertiserId === item.id);          
          if(statistic)
          {
            item.clicks = statistic.clicks;
            item.impressions = statistic.impressions;
          }
      });

      return items;
  }


    render() {
      const { items, isAdvertisersLoading, isAdvertisersError } = this.state;      
      let tableContent;
      if(isAdvertisersError)
      {
        tableContent = (<tr><td>Could not load data :(</td><td></td><td></td></tr>)
      }
      else if(isAdvertisersLoading)
      {
        tableContent = (<tr><td>Loading...</td><td></td><td></td></tr>)
      }
      else if(items)
      {
        tableContent = (
          items.map(item => (
          <tr key={item.name}>
            <td>{item.name}</td>
            <td>{this.formatDate(item.createdAt)}</td>
            <td>{item.campaignIds.length}</td>
            <td>{item.impressions ? item.impressions : "n/a"}</td>
            <td>{item.clicks ? item.clicks : "n/a"}</td>
          </tr>
        )));
      }      
      return (
        <div className="content">
          <h1>Overview of Advertisers</h1>
          <table className="tabel">
            <thead>
              <tr>
                <th>Advertiser</th>
                <th>Creation date</th>
                <th># campaigns</th>
                <th>Impressions</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {
                tableContent
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