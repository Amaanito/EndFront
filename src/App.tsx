import './App.css';
import{BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import { App} from './webShop';
import Payment from './Payment';
import Confirm from './Confirm';
import Checkout from './Checkout';

function RunApp() {

  return (
      <Router>
        <Switch>

          <Route exact path="/">
            <App />
          </Route>


          <Route path="/checkout">
            <Checkout />
          </Route>


          <Route path="/payment">
            <Payment />
          </Route>

      

          <Route path="/confirm">
            <Confirm />
          </Route>

        </Switch>
      </Router>
  );
}
export default RunApp;
