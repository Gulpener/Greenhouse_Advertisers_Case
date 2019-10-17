import React from 'react';
import moment from 'moment';

class AdvertiserComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {      
      items: [],
      isLoading: false,
      isError: false,
    };
  }
  
  componentDidMount() {
    this.setState({
      items: [],
      isLoading: true,
      isError: false    
    });
    fetch("https://5b87a97d35589600143c1424.mockapi.io/api/v1/advertisers")
      .then(res => res.json())
      .then(
        (result) => {          
          if(Array.isArray(result))
          {
            this.setState({            
              items: result,
              isLoading: false,
              isError: false
            });
          }
          else
          {
            this.setState({            
              items: [],
              isLoading: false,
              isError: true
            }); 
          }
        },
        (error) => {          
          this.setState({            
            items: [],
            isLoading: false,
            isError: true
          });          
        }
      )
  }


    render() {
      const { items, isLoading, isError } = this.state;      
      let tableContent;
      if(isError)
      {
        tableContent = (<tr><td>Could not load data :(</td><td></td><td></td></tr>)
      }
      else if(isLoading)
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