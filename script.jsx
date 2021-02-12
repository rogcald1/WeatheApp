class WeatherApp extends React.Component {
    constructor(props) {
      super(props);
      this.loadForecast = this.loadForecast.bind(this);
      this.statusOne = this.statusOne.bind(this);
      this.statusTwo = this.statusTwo.bind(this);
      this.reloadPage = this.reloadPage.bind(this);
      this.changeLoad = this.changeLoad.bind(this);
      this.state = {
        forecast: [],
        region: [],
        isLoading: false,
        error: 'none',
        errorMessage: '',
        firstLoad: true
      };
    }

    statusOne(res) {
            this.setState({
                error: 'gridpoint',
                errorMessage: res.status + ' ' + res.statusText
            })
    }

    statusTwo(res) {
            this.setState({
                error: 'forecast',
                errorMessage: res.title + ' ' + res.statusText
            })
    }

    reloadPage() {
        location.reload();
    }

    changeLoad = () => {
        this.setState({firstLoad: false})
    }
  
    loadForecast() {
      console.log('Loading Forecast');
      let x = document.getElementById('lat').value
      let y = document.getElementById('long').value
        this.setState({
            isLoading: true
        })
      
      fetch(`https://api.weather.gov/points/${x},${y}`)
          .then ((res) => {
              if (res.ok) {
                  return res.json();
              } else {
                  this.statusOne(res)
              }
          })
          .catch(error => {
              console.log('error')
          })
        .then((data) => {
               let office = data.properties.gridId;
            let gridx = data.properties.gridX;
            let gridy = data.properties.gridY;
          
          {console.log(office, gridx, gridy)};
          
          this.setState({
          
              region: data.properties,
            city: data.properties.relativeLocation.properties.city,
            usState: data.properties.relativeLocation.properties.state
              
          });
          
          return fetch(`https://api.weather.gov/gridpoints/${office}/${gridx},${gridy}/forecast`);
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    this.statusTwo(res)
                }
            })  
            .catch(error => {
                return Promise.reject()
            })
            .then((site) => {
            
            this.setState({
                
                forecast: site.properties.periods,
                isLoading: false
   
            });

          })
          document.getElementById('lat').value = '';
          document.getElementById('long').value = '';
     }
        
    
    render() {  
        let content = <Loader error={this.state.error} errorMessage={this.state.errorMessage} reloadPage={this.reloadPage} />;
        if (!this.state.isLoading) {
            content = (
                <WeatherCard loadForecast={this.loadForecast} forecast={this.state.forecast} city={this.state.city} usState={this.state.usState} changeLoad={this.changeLoad} firstLoad={this.state.firstLoad}> </WeatherCard>
            ) 
        } 
      return ( 
          <div>
            {content}
        </div>
      )};
  }
  
  class WeatherCard extends React.Component {
      constructor(props) {
        super(props);
        this.onClickEvent = this.onClickEvent.bind(this);
    }
    
    onClickEvent() {

        this.props.loadForecast();
        this.props.changeLoad();

    }

    render() {
        let content; 

        if (this.props.firstLoad) {

        content = (
                <div>
          <h2>Weather Forecast</h2>
          <label>Latitude: </label>
          <input type='text' id="lat" key="lat" placeholder='example: 40.65'></input>
          <br />
          <label>Longitude: </label>
          <input type='text' id= "long" key="long" placeholder='example: -73.95'></input>
          <br />
          <button onClick={this.onClickEvent}> Click to Load Weather </button>
          
          <p className='regName'>Region: {this.props.city} {this.props.usState}</p>
           
          {this.props.forecast.map((item, index) => (
                  <div className="weathers" key={index}> 
            <p className="info">{item.name}: {item.temperature}F || Wind Speed: {item.windSpeed} || {item.shortForecast}</p>
          </div>
        ))}
  
          </div>
            )

        } else if (!this.props.firstLoad) {
            content = (
                <div>
          <h2>Weather Forecast</h2>
          <label>Latitude: </label>
          <input type='text' id="lat" key="lat" ></input>
          <br />
          <label>Longitude: </label>
          <input type='text' id= "long" key="long" ></input>
          <br />
          <button onClick={this.onClickEvent}> Click to Load Weather </button>
          
          <p className='regName'>Region: {this.props.city} {this.props.usState}</p>
           
          {this.props.forecast.map((item, index) => (
                  <div className="weathers" key={index}> 
            <p className="info">{item.name}: {item.temperature}F || Wind Speed: {item.windSpeed} || {item.shortForecast}</p>
          </div>
        ))}
  
          </div>
            )   
        }
          
        return (
            <div>
         {content} 
         </div> 
      )
    }
  }
  
class Loader extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let content;
 
        if (this.props.error === 'none') {
            content = (
            <div>
            <h2>Weather Forecast</h2>
            <label>Latitude: </label>
            <input type='text' id="lat" key="lat" defaultValue='40.65'></input>
            <br />
            <label>Longitude: </label>
            <input type='text' id= "long" key="long" defaultValue='-73.95'></input>
            <br />
            <button> Loading! </button>

            <p className='regName'>Region: {this.props.city} {this.props.usState}</p>
            </div>
            )
        } else if (this.props.error === 'forecast'){
            content = (
                <div>
                <h2>Weather Forecast</h2>
                <label>Latitude: </label>
                <input type='text' id="lat" key="lat" defaultValue='40.65'></input>
                <br />
                <label>Longitude: </label>
                <input type='text' id= "long" key="long" defaultValue='-73.95'></input>
                <br />
                <button onClick={this.props.reloadPage}> Reload </button>
    
                 <p className='regName'>Region: {this.props.city} {this.props.usState}</p>
                
                 <p>Error Code: "{this.props.errorMessage}"</p>
                 <p>Something went wrong :/</p>
                 <p>Please reload the site and try again.</p>
                </div>
                )
            } else if (this.props.error === 'gridpoint'){
                content = (
                <div>
                <h2>Weather Forecast</h2>
                <label>Latitude: </label>
                <input type='text' id="lat" key="lat" defaultValue='40.65'></input>
                <br />
                <label>Longitude: </label>
                <input type='text' id= "long" key="long" defaultValue='-73.95'></input>
                <br />
                <button onClick={this.props.reloadPage}> Reload </button>
    
                 <p className='regName'>Region: {this.props.city} {this.props.usState}</p>
    
                 <p>Error Code: "{this.props.errorMessage}" </p>
                 <p>Something may have gone wrong with the latitude or longitude that was provided :(</p>
                 <p>Please reload the site and try again.</p>
                </div>
                )
            } 

        return (
            <div>{content}</div>   
        )}
}
  
ReactDOM.render(<WeatherApp /> ,document.getElementById('react-app'));
  