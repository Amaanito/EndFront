import './App.css';
import { App} from './webShop';
import{BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Confirm from './Confirm';

function RunApp() {

  return (
    <Router>
       <div>
        <App/>
        <Switch>
            <Route exact path='/'>
            </Route>

            <Route path="/confirm">
              <Confirm/>

            </Route>
          </Switch>
        </div>
        

    </Router>
  );
}
export default RunApp;
