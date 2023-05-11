import { NotificationOutlined } from "@ant-design/icons"; // Sacados de: https://ant.design/components/icon
import { Badge, Popover } from "antd";
import { useEffect, useState } from "react";
import axios from '../../api/axios';
import { useNavigate } from "react-router-dom";
import "./main.css";


const UncheckedSitesNotification = ({filtrarSitios}) => {

    const [amount, setAmount] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
       axios('/notification', { headers: { 'token': localStorage.getItem("token") } }).then((res) => {
            setAmount(res.data);
        })
    },[amount])
    
    const testFucn = () =>{
        if(amount>0) filtrarSitios(true);
        const str = window.location.href;
        const page = str.split("/")
        if(page[page.length - 1] !== 'inclusiveSites')navigate("/dashboard/inclusiveSites");
    }
    
    return (
            <Popover placement="bottom" title='Sitios inclusivos por revisar' content={<div><button className='link' onClick={testFucn}>{`Tiene ${amount} sitio(s) por revisar`}</button></div>} trigger="click">
                <Badge className="notification" size="small" count={amount}>
                    <NotificationOutlined
                        style={{
                            fontSize: 20,
                            color: 'white'
                        }}
                    />
                </Badge>
            </Popover>
    )
}

export default UncheckedSitesNotification;