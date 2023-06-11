import {useEffect} from "react";
import {useHistory} from "react-router-dom";

export default function blank() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const history = useHistory();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        history.push("/login/messagelogin")
    },[])
}