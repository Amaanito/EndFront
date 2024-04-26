import './App.css';
import{BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import { App2} from './webShop';
import Confirm from './Confirm';
import Checkout from './Checkout';

function RunApp() {

  return (
      <Router>
        <Switch>

          <Route exact path="/">
            <App2 />
          </Route>


          <Route path="/checkout">
            <Checkout />
          </Route>


          <Route path="/confirm">
            <Confirm />
          </Route>

        </Switch>
      </Router>
  );
}
export default RunApp;
