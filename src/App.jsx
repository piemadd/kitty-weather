import { useEffect, useState } from "react";

import mappings from "./iconMappings";
import gradients from "./skyGradients";

const redirectToSelector = () => window.location.replace("/selector");

const App = () => {
  const [currentHour, setCurrentHour] = useState(0);
  const [bg, setBg] = useState(gradients[currentHour].bg);
  const [fg, setFg] = useState(gradients[currentHour].fg);
  const [cardBG, setCardBG] = useState(gradients[currentHour].cardBG);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date());
  const [gridID, setGridID] = useState(null);
  const [gridX, setGridX] = useState(null);
  const [gridY, setGridY] = useState(null);
  const [timeZone, setTimeZone] = useState("America/Chicago");
  const [temperatureUnit, setTemperatureUnit] = useState("F");
  const [locationName, setLocationName] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherDataLong, setWeatherDataLong] = useState(null);

  const [currentTemp, setCurrentTemp] = useState(null);
  const [highTemp, setHighTemp] = useState(100);
  const [lowTemp, setLowTemp] = useState(0);

  const search = window.location.search;
  const params = new URLSearchParams(search);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: timeZone,
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZone: timeZone,
  });

  const timeFormatterShort = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    timeZone: timeZone,
  });

  const hourFormatter24 = new Intl.DateTimeFormat("en-UK", {
    hour: "numeric",
    timeZone: timeZone,
  });

  const convertTemp = (celcius) => {
    if (temperatureUnit === "C") return celcius;

    return (celcius * 9) / 5 + 32;
  };

  useEffect(() => {
    if (params.has("gridId")) {
      setGridID(params.get("gridId"));
    } else redirectToSelector();

    if (params.has("gridX")) {
      setGridX(params.get("gridX"));
    } else redirectToSelector();

    if (params.has("gridY")) {
      setGridY(params.get("gridY"));
    } else redirectToSelector();

    if (params.has("timeZone")) {
      setTimeZone(params.get("timeZone"));
    } else redirectToSelector();

    if (params.has("name")) {
      setLocationName(params.get("name"));
    } else redirectToSelector();

    if (params.has("temperatureUnit")) {
      setTemperatureUnit(params.get("temperatureUnit"));
    } else redirectToSelector();
  }, []);

  useEffect(() => {
    const fetchWeatherData = () => {
      fetch(
        `https://api.weather.gov/gridpoints/${gridID}/${gridX},${gridY}/forecast`,
        {
          method: "GET",
          headers: {
            "Feature-Flags": "forecast_temperature_qv",
            "User-Agent": "(Kitty Weather, kw@piemadd.com)",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (data.status && data.status === 404) {
            setError("Invalid coordinates. Ensure they are located in the US.");
          } else if (data.status && data.status === 500) {
            setError("Internal server error. Please try again later.");
          } else {
            setWeatherDataLong(
              data.properties.periods.map((period) => {
                const iconSplit = period.icon.split("/icons/")[1].split("/");
                const icon = `/icons/weather/${
                  mappings["land"][iconSplit[1]][
                    iconSplit[2].split(",")[0].split("?")[0]
                  ].alt
                }.svg`;
                const desc =
                  mappings["land"][iconSplit[1]][
                    iconSplit[2].split(",")[0].split("?")[0]
                  ].description;
                //console.log(icon);
                return {
                  ...period,
                  desc: desc,
                  icon: icon,
                };
              })
            );
          }
        });

      fetch(
        `https://api.weather.gov/gridpoints/${gridID}/${gridX},${gridY}/forecast/hourly`,
        {
          method: "GET",
          headers: {
            "Feature-Flags": "forecast_temperature_qv",
            "User-Agent": "(Kitty Weather, kw@piemadd.com)",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (data.status && data.status === 404) {
            setError("Invalid coordinates. Ensure they are located in the US.");
          } else if (data.status && data.status === 500) {
            setError("Internal server error. Please try again later.");
          } else {
            setWeatherData(
              data.properties.periods
                .filter((period, i) => {
                  //this really only applies for the first 1 or 2 periods
                  if (i > 1) return true;

                  const periodDate = new Date(period.startTime);

                  if (periodDate > now) return true;
                  return false;
                })
                .map((period) => {
                  const iconSplit = period.icon.split("/icons/")[1].split("/");
                  const icon = `/icons/weather/${
                    mappings["land"][iconSplit[1]][
                      iconSplit[2].split(",")[0].split("?")[0]
                    ].alt
                  }.svg`;
                  //console.log(icon);
                  return {
                    ...period,
                    icon: icon,
                  };
                })
            );

            //this is goofy cuz i need to account for time zones
            const tempCurrentHour = Number(
              hourFormatter24
                .format(new Date(data.properties.periods[0].startTime))
                .split(" ")[0]
            );

            console.log("tempCurrentHour", tempCurrentHour);

            setCurrentHour(tempCurrentHour);
            setBg(gradients[tempCurrentHour].bg);
            setFg(gradients[tempCurrentHour].fg);
            setCardBG(gradients[tempCurrentHour].cardBG);

            let tempLow = 100;
            let tempHigh = 0;

            data.properties.periods.forEach((period) => {
              //see if period is today
              const periodDate = new Date(period.startTime);

              //if is within the next 24 hours
              if (periodDate.valueOf() <= now.valueOf() + 1000 * 60 * 60 * 24) {
                if (period.temperature.value > tempHigh) {
                  tempHigh = period.temperature.value;
                }

                if (period.temperature.value < tempLow) {
                  tempLow = period.temperature.value;
                }
              }
            });

            setHighTemp(Math.floor(convertTemp(tempHigh)));
            setLowTemp(Math.floor(convertTemp(tempLow)));

            setIsLoading(false);
          }
        });
    };

    if (gridID && gridX && gridY) {
      fetchWeatherData();

      setInterval(() => {
        fetchWeatherData();
      }, 1000 * 60 * 15);
    }
  }, [gridID, gridX, gridY]);

  useEffect(() => {
    setNow(new Date());

    setInterval(() => {
      setNow(new Date());
    }, 1000 * 60);
  }, []);

  //redirectToSelector();

  /*
  useEffect(() => {
    console.log('useEffect called')
    //random number
    const id = Math.floor(Math.random() * 1000000000);
    setInterval(() => {
      console.log(id, currentGradient);

      //increasing gradient
      currentGradient += 1;

      if (currentGradient === 24) {
        //resetting
        currentGradient = 0;
      }

      setBg(gradients[currentGradient].bg);
      setFg(gradients[currentGradient].fg);
    }, 1000);
  }, []);
  */

  return isLoading || weatherData === null || weatherDataLong === null ? (
    <>
      <p>Loading app...</p>
      {error ? <p>{error}</p> : null}
    </>
  ) : (
    <main
      className='main'
      style={{
        background: bg,
        color: fg,
      }}
    >
      <section
        className='topHorizonal'
        style={{
          background: cardBG,
        }}
      >
        <div className='location'>
          <div className='current'>
            <img
              src={weatherData[0].icon}
              alt={weatherData[0] + " icon"}
              style={{
                width: "64px",
              }}
            />
            <p
              style={{
                fontWeight: "600",
                marginLeft: "8px",
              }}
            >
              {weatherData[0].shortForecast}
            </p>
          </div>
          <div className='snapshot'>
            <p>{locationName}</p>
            &nbsp;
            <p>
              &uarr;&nbsp;{highTemp}&deg;{temperatureUnit}
            </p>
            &nbsp;
            <p>
              &darr;&nbsp;{lowTemp}&deg;{temperatureUnit}
            </p>
            &nbsp;
            <img
              src={"/icons/weather/umbrella.svg"}
              alt='umbrella (chance of rain) icon'
              style={{
                width: "40px",
                marginLeft: "-4px",
              }}
            />
            <p>
              {Math.floor(weatherData[0].probabilityOfPrecipitation.value)}%
            </p>
            &nbsp;
            <img
              src={"/icons/weather/humidity.svg"}
              alt='humidity icon'
              style={{
                width: "40px",
                marginLeft: "-4px",
              }}
            />
            <p>{Math.floor(weatherData[0].relativeHumidity.value)}%</p>
          </div>
          <div className='locationInfo'>
            <p>
              {dateFormatter.format(now)} &sdot; {timeFormatter.format(now)}{" "}
              &sdot; NWS Data
            </p>
          </div>
        </div>
        <div className='currentTemp'>
          <p>
            {Math.floor(convertTemp(weatherData[0].temperature.value))}
            &deg;{temperatureUnit}
          </p>
        </div>
      </section>
      <section className='bottomHorizontal'>
        {weatherData.map((hour, index) => {
          const containerWidth = window.innerWidth - 32;

          // if object width will be less than 200px, dont render
          if (containerWidth / (index + 1) < 250) {
            return null;
          }

          return (
            <div
              className='hour'
              style={{
                background: cardBG,
              }}
              key={index}
            >
              <p
                style={{
                  fontWeight: "500",
                  fontSize: "32px",
                }}
              >
                {timeFormatterShort.format(new Date(hour.startTime))}
              </p>
              <span>
                <img
                  src={hour.icon}
                  alt={hour.icon + " icon"}
                  style={{
                    width: "64px",
                  }}
                />
                <p>{hour.shortForecast}</p>
              </span>
              <span className='horzSpan'>
                <img
                  src={"/icons/weather/umbrella.svg"}
                  alt='umbrella (chance of rain) icon'
                  style={{
                    width: "40px",
                    marginLeft: "-4px",
                    marginRight: "-4px",
                  }}
                />
                <p>{Math.floor(hour.probabilityOfPrecipitation.value)}%</p>
                &nbsp;
                <img
                  src={"/icons/weather/humidity.svg"}
                  alt='humidity icon'
                  style={{
                    width: "40px",
                    marginLeft: "-4px",
                    marginRight: "-4px",
                  }}
                />
                <p>{Math.floor(hour.relativeHumidity.value)}%</p>
              </span>
              <p>
                {Math.floor(convertTemp(hour.temperature.value))}&deg;
                {temperatureUnit}
              </p>
            </div>
          );
        })}
      </section>
      <section className='bottomHorizontal'>
        {weatherDataLong.map((hour, index) => {
          const containerWidth = window.innerWidth - 32;

          // if object width will be less than 200px, dont render
          if (containerWidth / (index + 1) < 250) {
            return null;
          }

          return (
            <div
              className='hour'
              style={{
                background: cardBG,
              }}
              key={index}
            >
              <p
                style={{
                  fontWeight: "500",
                  fontSize: "32px",
                }}
              >
                {hour.name}
              </p>
              <span>
                <img
                  src={hour.icon}
                  alt={hour.icon + " icon"}
                  style={{
                    width: "64px",
                  }}
                />
                <p>{hour.desc}</p>
              </span>
              <span className='horzSpan'>
                <img
                  src={"/icons/weather/umbrella.svg"}
                  alt='umbrella (chance of rain) icon'
                  style={{
                    width: "40px",
                    marginLeft: "-4px",
                    marginRight: "-4px",
                  }}
                />
                <p>{Math.floor(hour.probabilityOfPrecipitation.value)}%</p>
                &nbsp;
                <img
                  src={"/icons/weather/humidity.svg"}
                  alt='humidity icon'
                  style={{
                    width: "40px",
                    marginLeft: "-4px",
                    marginRight: "-4px",
                  }}
                />
                <p>{Math.floor(hour.relativeHumidity.value)}%</p>
              </span>
              <p>
                {Math.floor(convertTemp(hour.temperature.value))}&deg;
                {temperatureUnit}
              </p>
            </div>
          );
        })}
      </section>
    </main>
  );
};

export default App;
