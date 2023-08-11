const mappings = {
  land: {
    day: {
      skc: {
        description: 'Clear',
        alt: 'clear-day'
      },
      few: {
        description: 'A Few Clouds',
        alt: 'clear-day'
      },
      sct: {
        description: 'Partly Cloudy',
        alt: 'partly-cloudy-day',
      },
      bkn: {
        description: 'Mostly Cloudy',
        alt: 'cloudy'
      },
      ovc: {
        description: 'Overcast',
        alt: 'overcast-day'
      },
      wind_skc: {
        description: 'Clear and Windy',
        alt: 'wind'
      },
      wind_few: {
        description: 'Some Clouds and Windy',
        alt: 'wind'
      },
      wind_sct: {
        description: 'Partly Cloudy and Windy',
        alt: 'partly-cloudy-day'
      },
      wind_bkn: {
        description: 'Mostly Cloudy and Windy',
        alt: 'cloudy'
      },
      wind_ovc: {
        description: 'Overcast and Windy',
        alt: 'overcast-day'
      },
      snow: {
        description: 'Snow',
        alt: 'snow'
      },
      rain_snow: {
        description: 'Sleet',
        alt: 'sleet'
      },
      rain_sleet: {
        description: 'Sleet',
        alt: 'sleet'
      },
      snow_sleet: {
        description: 'Snow',
        alt: 'snow'
      },
      fzra: {
        description: 'Freezing Rain',
        alt: 'rain'
      },
      rain_fzra: {
        description: 'Freezing Rain',
        alt: 'rain'
      },
      snow_fzra: {
        description: 'Freezing Sleet',
        alt: 'sleet'
      },
      sleet: {
        description: 'Sleet',
        alt: 'sleet'
      },
      rain: {
        description: 'Rain',
        alt: 'rain'
      },
      rain_showers: {
        description: 'Rain Showers',
        alt: 'partly-cloudy-day-rain'
      },
      rain_showers_hi: {
        description: 'Rain Showers',
        alt: 'partly-cloudy-day-rain'
      },
      tsra: {
        description: 'Thunderstorms',
        alt: 'thunderstorms-day-rain'
      },
      tsra_sct: {
        description: 'Thunderstorms',
        alt: 'thunderstorms-day-rain'
      },
      tsra_hi: {
        description: 'Thunderstorms',
        alt: 'thunderstorms-day-rain'
      },
      tornado: {
        description: 'Tornadoes',
        alt: 'tornado'
      },
      hurricane: {
        description: 'Hurricane',
        alt: 'hurricane'
      },
      tropical_storm: {
        description: 'Tropical Storm',
        alt: 'extreme-day-rain'
      },
      dust: {
        description: 'Dust',
        alt: 'dust-day'
      },
      smoke: {
        description: 'Smoke',
        alt: 'smoke'
      },
      haze: {
        description: 'Haze',
        alt: 'haze-day'
      },
      hot: {
        description: 'Hot',
        alt: 'thermometer-warmer'
      },
      cold: {
        description: 'Cold',
        alt: 'thermometer-colder'
      },
      blizzard: {
        description: 'Blizzard',
        alt: 'extreme-day-snow'
      },
      fog: {
        description: 'Fog',
        alt: 'fog-day'
      }
    },
    night: {
      skc: {
        description: 'Clear',
        alt: 'clear-night'
      },
      few: {
        description: 'A Few Clouds',
        alt: 'clear-night'
      },
      sct: {
        description: 'Partly Cloudy',
        alt: 'partly-cloudy-night',
      },
      bkn: {
        description: 'Mostly Cloudy',
        alt: 'cloudy'
      },
      ovc: {
        description: 'Overcast',
        alt: 'overcast-night'
      },
      wind_skc: {
        description: 'Clear and Windy',
        alt: 'wind'
      },
      wind_few: {
        description: 'Some Clouds and Windy',
        alt: 'wind'
      },
      wind_sct: {
        description: 'Partly Cloudy and Windy',
        alt: 'partly-cloudy-night'
      },
      wind_bkn: {
        description: 'Mostly Cloudy and Windy',
        alt: 'cloudy'
      },
      wind_ovc: {
        description: 'Overcast and Windy',
        alt: 'overcast-night'
      },
      snow: {
        description: 'Snow',
        alt: 'snow'
      },
      rain_snow: {
        description: 'Sleet',
        alt: 'sleet'
      },
      rain_sleet: {
        description: 'Sleet',
        alt: 'sleet'
      },
      snow_sleet: {
        description: 'Snow',
        alt: 'snow'
      },
      fzra: {
        description: 'Freezing Rain',
        alt: 'rain'
      },
      rain_fzra: {
        description: 'Freezing Rain',
        alt: 'rain'
      },
      snow_fzra: {
        description: 'Freezing Sleet',
        alt: 'sleet'
      },
      sleet: {
        description: 'Sleet',
        alt: 'sleet'
      },
      rain: {
        description: 'Rain',
        alt: 'rain'
      },
      rain_showers: {
        description: 'Rain Showers',
        alt: 'partly-cloudy-night-rain'
      },
      rain_showers_hi: {
        description: 'Rain Showers',
        alt: 'partly-cloudy-night-rain'
      },
      tsra: {
        description: 'Thunderstorms',
        alt: 'thunderstorms-night-rain'
      },
      tsra_sct: {
        description: 'Thunderstorms',
        alt: 'thunderstorms-night-rain'
      },
      tsra_hi: {
        description: 'Thunderstorms',
        alt: 'thunderstorms-night-rain'
      },
      tornado: {
        description: 'Tornadoes',
        alt: 'tornado'
      },
      hurricane: {
        description: 'Hurricane',
        alt: 'hurricane'
      },
      tropical_storm: {
        description: 'Tropical Storm',
        alt: 'extreme-night-rain'
      },
      dust: {
        description: 'Dust',
        alt: 'dust-night'
      },
      smoke: {
        description: 'Smoke',
        alt: 'smoke'
      },
      haze: {
        description: 'Haze',
        alt: 'haze-night'
      },
      hot: {
        description: 'Hot',
        alt: 'thermometer-warmer'
      },
      cold: {
        description: 'Cold',
        alt: 'thermometer-colder'
      },
      blizzard: {
        description: 'Blizzard',
        alt: 'extreme-night-snow'
      },
      fog: {
        description: 'Fog',
        alt: 'fog-night'
      }
    }
  }
};

export default mappings;