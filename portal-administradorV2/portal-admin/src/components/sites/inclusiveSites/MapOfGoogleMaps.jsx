import './index.css';
import { useState } from 'react';
import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox"
import "@reach/combobox/styles.css";

const MapOfGoogleMaps = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        libraries: ["places"],
    });

    if (!isLoaded) return <div>...</div>
    return <Map />
}

const Map = () => {
    const center = useMemo(() => ({ lat: 4.641440, lng: -74.097518 }), []);
    const [selected, setSelected] = useState(null);

    console.log(selected)
    return (
        <>
            <div className='places-container'>
                <PlacesAutocomplete setSelected={setSelected} />
            </div>

            <GoogleMap
                zoom={12}
                center={center}
                mapContainerClassName="map-container"
            >
                {selected && <Marker position={selected} />}
            </GoogleMap>
            <div>
                Latitud: {selected.lat}, logitud: {selected.lng}
            </div>
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
            <ComboboxInput value={value} onChange={e => setValue(e.target.value)} disabled={!ready} className="combobox-input"
                placeholder="Buscar lugar o dirección" />
            <ComboboxPopover>
                <ComboboxList>
                    {status === "OK" && data.map(({ place_id, description }) => <ComboboxOption key={place_id} value={description} />)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    );
}

export default MapOfGoogleMaps;