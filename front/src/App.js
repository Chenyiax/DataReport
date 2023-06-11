import './App.css';
import { BrowserRouter , Route, Switch } from 'react-router-dom'
import login from './views/Login/Login'
import main from './views/Main/Main'
import information from "./views/Information/Information";
import React, {useState} from "react";
import blank from "./views/blank";

export const MyContext = React.createContext('');

export function App() {
    const [userInfo, setUserInfo] = useState({phone: '', name: '', mail: '', sex: '', head_img: '', pssword: '', unit: '', position: '', id: 0, selectedKeys: '/main/home'});

    return (
        <MyContext.Provider value={{ userInfo, setUserInfo }}>
            <BrowserRouter>
                <Switch>
                    <div className="App">
                        <Route path="/" component={blank}></Route>
                        <Route path="/login" component={login}></Route>
                        <Route path="/main" component={main}></Route>
                        <Route path="/information" component={information}></Route>
                    </div>
                </Switch>
            </BrowserRouter>
        </MyContext.Provider>
    );
}