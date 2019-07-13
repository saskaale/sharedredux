import React, {useState, useEffect} from 'react';
import {connect, useSelector, useDispatch} from 'react-redux';
//import logo from './logo.svg';
import {addInteger} from '../../actions/container';
import {select} from '../../actions/app';
import './index.css';

/*
<div className="App">
<header className="App-header">
  <img src={logo} className="App-logo" alt="logo" />
  <p>
    Edit <code>src/App.js</code> and save to reload.
  </p>
  <a
    className="App-link"
    href="https://reactjs.org"
    target="_blank"
    rel="noopener noreferrer"
  >
    Learn React
  </a>
</header>
</div>
*/



function App({value, increment}) {
  const [updating, changeUpdating] = useState(false);
  const container_key = useSelector((state) => state.app.selectedcontainer)
  const dispatch = useDispatch();

  useEffect(() => {
    const int = setInterval(() => {
      if(updating){
        increment();
      }
    }, 500);

    return () => {
      clearInterval(int);
    }
  });

  let containers = [];
  for(let i = 0; i < 10; ++i) containers.push(i);

  return (
    <div className="App">
      <select 
        type='checkbox' 
        onChange={(event) => dispatch(select(event.target.value))} 
        defaultValue={container_key}
        >
        {containers.map(id=>(<option key={id} value={id} >Container {id}</option>))}
      </select>
      <div> value: {value}</div>
      <div onClick={() => increment()}>manual increment</div>
      <div>
        <input 
          type='checkbox' 
          checked={updating} 
          onChange={(event) => changeUpdating(event.target.checked)} 
          />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  value: state.container.value
});

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch(addInteger(1))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
