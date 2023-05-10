import './index.css';
import { useState, useEffect } from 'react';
import { useMemo } from "react";
import { GoogleMap, useLoadScript,  MarkerF} from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox"
import "@reach/combobox/styles.css";

const MapOfGoogleMaps = ({ latlng, setLatLng }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        libraries: ["places"],
    });

    if (!isLoaded) return <div>...</div>
    return <Map latlng={latlng} setLatLng={setLatLng} />
}

const Map = ({ latlng, setLatLng}) => {
    const [selected, setSelected] = useState( isNaN(parseFloat(latlng.lat)) ? { lat: 4.641440, lng: -74.097518 } : {"lat": parseFloat(latlng.lat), "lng": parseFloat(latlng.lng)} );
    const center = useMemo(() => ( selected ), []);

    useEffect(() => {
        setLatLng(selected);
    }, [selected]);

    return (
        <>
            <div className='places-container'>
                <PlacesAutocomplete setSelected={setSelected} />
            </div>

            <GoogleMap
                center={center}
                zoom={ isNaN(parseFloat(latlng.lat)) ? 10 : 16}
                mapContainerClassName="map-container"
            >
                {selected && <MarkerF position={selected} />}
            </GoogleMap>
            {/* <div>
                Latitud: {selected.lat}, Longitud: {selected.lng}
            </div> */}
        </>
    )
}

const PlacesAutocomplete = ({ setSelected }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions
    } = usePlacesAutocomplete();

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        setSelected({ lat, lng });
    }

    return (
        <Combobox onSelect={handleSelect}>
            <ComboboxInput 
                value={value}
                onChange={e => setValue(e.target.value)}
                disabled={!ready}
                className="combobox-input"
                placeholder="Ingresar lugar o dirección"
                />
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" && data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} />)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}

export default MapOfGoogleMaps;