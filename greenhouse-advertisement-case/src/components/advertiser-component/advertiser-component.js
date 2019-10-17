import React from 'react';
import moment from 'moment';
import QueryString from 'query-string'
import './advertiser-component.css';

class AdvertiserComponent extends React.Component {
  constructor(props) {
    super(props);
    
    let sort = { order: "", orderBy: "" };

    if(this.props.location.search)
    {
      const parsedQueryString = QueryString.parse(this.props.location.search);
      sort = {order: parsedQueryString.order, orderBy: parsedQueryString.orderby};      
    }

    this.state = {      
      items: [],
      isAdvertisersLoading: false,
      isAdvertisersError: false,
      sort: sort
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
            let advertisers = [];
            result.forEach(function(item){              
              advertisers.push(
                {
                  id: item.id,
                  name: item.name,
                  createdAt: item.createdAt,
                  campaigns: item.campaignIds.length
                }
              )
            });

            this.setState({            
              items: advertisers,
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
              items: this.enrichAdvertisersWithStatistics(this.state.items, result),
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

  enrichAdvertisersWithStatistics(items, statistics)
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
      const { items, isAdvertisersLoading, isAdvertisersError, sort } = this.state;          
      let tableContent;
      if(isAdvertisersError)
      {
        tableContent = (<tr><td>Could not load data :(</td><td></td><td></td><td></td><td></td></tr>)
      }
      else if(isAdvertisersLoading)
      {
        tableContent = (<tr><td>Loading...</td><td></td><td></td><td></td><td></td></tr>)
      }
      else if(items)
      {
        let advertisers = items; 
        if(sort)
        {
          advertisers = items.sort(this.valueComparer(sort.orderBy, sort.order))
        }
        tableContent = (
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
      return (            
        <div className="content">
          <h1>Overview of Advertisers</h1>
          <table>
            <thead>
              <tr>
                {this.createCollumnHeader("name", "Advertiser", sort)}
                {this.createCollumnHeader("createdAt", "Creation date", sort)}
                {this.createCollumnHeader("campaigns", "# campaigns", sort)}
                {this.createCollumnHeader("impressions", "Impressions", sort)}
                {this.createCollumnHeader("clicks", "Clicks", sort)}
              </tr>
            </thead>
            <tbody>
              {
                tableContent
              }
            </tbody>
          </table>
        </div>
        );
    }

    createSortArrow(collumnName, sort)
    {
      if(sort)
      {
        if(collumnName === sort.orderBy)
        {
          let icon;
          if(sort.order === "asc")
          {
            icon = "^";
          }
          else
          {
            icon = "v";
          }          
          return <span className="orderIcon">{icon}</span>;
        }
      }
      return;
    }

    createCollumnHeader(collumnName, displayName, sort)
    {
      return (<th onClick={() => this.handleClick(collumnName)}>{displayName}{this.createSortArrow(collumnName, sort)}</th>);  
    }

    handleClick(collumn)
    {
      if(this.state.sort.orderBy === collumn)
      {          
          let parsed = { 
            orderby: this.state.sort.orderBy,
            order: this.state.sort.order === "asc" ? "desc" : "asc"
          };
          const stringified = QueryString.stringify(parsed);          
          window.open(`/?${stringified}`, "_self")
          /*
          this.setState({
            sort: { 
              orderBy: this.state.sort.orderBy,
              order: this.state.sort.order === "asc" ? "desc" : "asc"
            } 
          });*/
          
      }
      else
      {
        let parsed = { 
          orderby: collumn,
          order: this.state.sort.order
        };
        const stringified = QueryString.stringify(parsed);
        window.open(`/?${stringified}`, "_self")
        /*
        this.setState({
          sort: { 
            orderBy: collumn,
            order: this.state.sort.order
          } 
        });*/
      }
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

  export default AdvertiserComponent;