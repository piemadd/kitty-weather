import { useEffect, useState } from "react";
import Fuse from "fuse.js";

const options = {
  includeScore: true,
};

const Selector = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);
  const [zips, setZips] = useState({});
  const [query, setQuery] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [nickName, setNickName] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState("F");

  useEffect(() => {
    fetch("/cities.json")
      .then((res) => res.json())
      .then((data) => {
        setCities(data);
        console.log(data);

        let tempZips = {};

        data.forEach((city) => {
          city.zipCodes.forEach((zip) => {
            if (!tempZips[zip])
              tempZips[zip] = {
                name: city.name,
                coordinates: city.coordinates,
                population: city.population,
                zip: zip,
              };

            if (tempZips[zip].population <= city.population)
              tempZips[zip] = {
                name: city.name,
                coordinates: city.coordinates,
                population: city.population,
                zip: zip,
              };
          });
        });

        //console.log(tempZips[60616]);
        setZips(tempZips);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className='selectorPage'>
      <h1>Kitty Weather</h1>
      <h2>Location Selector</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <span>
            <label htmlFor='zipCode'>Enter a zip code:</label>
            &nbsp;&nbsp;
            <input
              type='text'
              id='zipCode'
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </span>
          <p>- or -</p>
          <span>
            <label htmlFor='query'>
              Enter a city name (may not be accurate, a zip code is
              recommended):
            </label>
            &nbsp;&nbsp;
            <input
              type='text'
              id='query'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </span>
          <p>- or -</p>
          <span>
            <label htmlFor='lat'>Enter some coordinates (lat, lon):</label>
            &nbsp;&nbsp;
            <input
              type='text'
              id='lat'
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            &nbsp;&nbsp;
            <input
              type='text'
              id='lon'
              value={lon}
              onChange={(e) => setLon(e.target.value)}
            />
          </span>
          <h2>Other Options</h2>
          <span>
            <label htmlFor='nickname'>
              Add a name override (optional, but recommended):
            </label>
            &nbsp;&nbsp;
            <input
              type='text'
              id='nickname'
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
            />
          </span>
          <span>
            <label htmlFor='temperatureUnit'>
              Select a temperature unit (optional, defaults to Fahrenheit):
            </label>
            &nbsp;&nbsp;
            <select
              id='temperatureUnit'
              onChange={(e) => {
                setTemperatureUnit(e.target.value);
              }}
            >
              <option value='F'>Fahrenheit</option>
              <option value='C'>Celsius</option>
            </select>
          </span>
          <br />
          <button
            onClick={() => {
              // handling zip code input
              if (zipCode) {
                console.log("zip code");
                if (!zips[zipCode]) {
                  setError("Invalid zip code");
                }

                fetch(
                  `https://api.weather.gov/points/${zips[
                    zipCode
                  ].coordinates.join(",")}`,
                  {
                    method: "GET",
                    headers: {
                      "User-Agent": "(Kitty Weather, kw@piemadd.com)",
                    },
                  }
                )
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.status && data.status === 404) {
                      setError(
                        "The coordinates for this zip code are invalid. Please try another method of input."
                      );
                    }

                    return (window.location.href = `/?name=${
                      nickName || zips[zipCode].name.split(", ")[0]
                    }&gridId=${data.properties.gridId}&gridX=${
                      data.properties.gridX
                    }&gridY=${data.properties.gridY}&timeZone=${
                      data.properties.timeZone
                    }&temperatureUnit=${temperatureUnit}`);
                  })
                  .catch((err) => {
                    console.log(err);
                    setError(
                      "There was an error with your request. Please check your inputs and try again later."
                    );
                  });
              } else if (query) {
                console.log("query");
                const fuse = new Fuse(cities, {
                  keys: ["name"],
                });

                const results = fuse.search(query);

                if (results.length === 0) {
                  setError("Invalid city name");
                }

                console.log(results[0].item);

                fetch(
                  `https://api.weather.gov/points/${results[0].item.coordinates.join(
                    ","
                  )}`,
                  {
                    method: "GET",
                    headers: {
                      "User-Agent": "(Kitty Weather, kw@piemadd.com)",
                    },
                  }
                )
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.status && data.status === 404) {
                      setError(
                        "The coordinates for this city are invalid. Please try another method of input."
                      );
                    }

                    //return;

                    return (window.location.href = `/?name=${
                      nickName || results[0].item.name.split(", ")[0]
                    }&gridId=${data.properties.gridId}&gridX=${
                      data.properties.gridX
                    }&gridY=${data.properties.gridY}&timeZone=${
                      data.properties.timeZone
                    }&temperatureUnit=${temperatureUnit}`);
                  })
                  .catch((err) => {
                    console.log(err);
                    setError(
                      "There was an error with your request. Please check your inputs and try again later."
                    );
                  });
              } else if (lat && lon) {
                console.log("lat and lon");
                fetch(`https://api.weather.gov/points/${lat},${lon}`, {
                  method: "GET",
                  headers: {
                    "User-Agent": "(Kitty Weather, kw@piemadd.com)",
                  },
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.status && data.status === 404) {
                      setError(
                        "Invalid coordinates. Ensure they are located in the US."
                      );
                    }

                    if (data.properties) {
                      return (window.location.href = `/?name=${
                        nickName ||
                        data.properties.relativeLocation.properties.city
                      }&gridId=${data.properties.gridId}&gridX=${
                        data.properties.gridX
                      }&gridY=${data.properties.gridY}&timeZone=${
                        data.properties.timeZone
                      }&temperatureUnit=${temperatureUnit}`);
                    }
                  });
              } else {
                setError(
                  "Your inputs are invalid. Ensure at least one is filled out."
                );
              }
            }}
          >
            Go!
          </button>
        </>
      )}
    </div>
  );
};

export default Selector;
