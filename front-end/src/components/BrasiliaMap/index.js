import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet'
import "./style.css"
import { FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material"
import { React, useState } from 'react'
import nomesJson from "../../names.json"
import dists from "../../dists.json"
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Graph, Node } from '../../utils/graph_tools'

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

function BrasiliaMap() {

    const position = [-15.82, -47.85]
    const [menorCaminho, setMenorCaminho] = useState();
    const [origem, setOrigem] = useState(1);
    const [destino, setDestino] = useState(1);
    const [originPosition, setOriginPosition] = useState([15.82, 47.85]);
    const [destinationPosition, setDestinationPosition] = useState([15.82, 47.85]);
    const [polyline, setPolyline] = useState([
        [15.84129, 48.02767],
        [15.83342, 48.05658],
        [15.81750, 48.10504],
    ]);
    const limeOptions = { color: 'lime' }

    const handleChangeOrigem = (event) => {
        setOrigem(event.target.value);
    };

    const handleChangeDestino = (event) => {
        setDestino(event.target.value);
    };

    const search = () => {
        setOriginPosition(cities[origem - 1].localizacao);
        setDestinationPosition(cities[destino - 1].localizacao);
        let response = graph.dijkstra(`${origem}`, `${destino}`);
        response[0] = response[0].slice(1);
        
        let oi = response[0].map((id)=> cities[id-1].localizacao);
        console.log(oi);
        setPolyline(oi);
        setMenorCaminho(response[1]);
    }

    const cities = Object.keys(nomesJson.Nome).map((ite) => {
        return {
            nome: nomesJson.Nome[ite],
            id: nomesJson.RA_Id[ite],
            localizacao: nomesJson.Localizacao[ite],
        }
    });

    let graph = new Graph();
    for (let k = 0; k < 33; ++k) {
        let eid = nomesJson.RA_Id[`${k}`]
        let enode = new Node(nomesJson.RA_Id[`${k}`], nomesJson.Nome[`${k}`])
        dists[eid].forEach(element => {
            enode.adjList.push(element)
        });

        graph.addNode(enode)
    }

    

    return (
        <div className='home'>

            <div className="menu">

                <h1>Rolê em Brasilia</h1>
                <FormControl fullWidth sx={{ mt: 4, mb: 4 }}>
                    <InputLabel variant="filled" className='formControl' htmlFor="uncontrolled-native">
                        Origem:
                    </InputLabel>
                    <Select
                        defaultValue={1}
                        inputProps={{
                            name: 'origem',
                            id: 'uncontrolled-native',
                        }}
                        onChange={handleChangeOrigem}
                    >
                        {cities.map((name) => (
                            <MenuItem
                                key={name.id}
                                value={name.id}
                            >
                                {name.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 4, }}>
                    <InputLabel variant="filled" htmlFor="uncontrolled-native">
                        Destino:
                    </InputLabel>
                    <Select
                        defaultValue={1}
                        inputProps={{
                            name: 'destino',
                            id: 'uncontrolled-native',
                        }}
                        onChange={handleChangeDestino}
                    >
                        {cities.map((name) => (
                            <MenuItem
                                key={name.id}
                                value={name.id}
                            >
                                {name.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button onClick={search} variant="contained" className="Button">Buscar Rota</Button>
                {menorCaminho == null ? ""
                    : <h5>Menor Caminho = {menorCaminho} Km</h5>
                }
            </div>


            <MapContainer center={position} zoom={11} scrollWheelZoom={false} className="map">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline pathOptions={limeOptions} positions={polyline} />
                <Marker position={originPosition}>
                </Marker>
                <Marker position={destinationPosition}>
                </Marker>

            </MapContainer>
        </div>

    )
}


export default BrasiliaMap;