// Tanzania GeoJSON data for mapping
export const tanzaniaRegions = {
  "type": "FeatureCollection" as const,
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Dar es Salaam",
        "region": "Dar es Salaam",
        "population": 4364541,
        "delivery_zones": ["Kinondoni", "Ilala", "Temeke", "Ubungo", "Kigamboni"]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [39.0758, -6.6731], [39.3621, -6.6731], 
          [39.3621, -6.9756], [39.0758, -6.9756], 
          [39.0758, -6.6731]
        ]]
      }
    },
    {
      "type": "Feature", 
      "properties": {
        "name": "Arusha",
        "region": "Arusha",
        "population": 1694310,
        "delivery_zones": ["Arusha City", "Meru", "Karatu", "Monduli"]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [36.4840, -3.1674], [37.5585, -3.1674],
          [37.5585, -3.6663], [36.4840, -3.6663],
          [36.4840, -3.1674]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Mwanza", 
        "region": "Mwanza",
        "population": 2772509,
        "delivery_zones": ["Mwanza City", "Nyamagana", "Ilemela", "Sengerema"]
      },
      "geometry": {
        "type": "Polygon", 
        "coordinates": [[
          [32.5988, -2.3258], [33.1641, -2.3258],
          [33.1641, -2.7884], [32.5988, -2.7884],
          [32.5988, -2.3258]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Dodoma",
        "region": "Dodoma", 
        "population": 2083588,
        "delivery_zones": ["Dodoma City", "Chamwino", "Bahi", "Kondoa"]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [35.5122, -5.7893], [36.2695, -5.7893],
          [36.2695, -6.4516], [35.5122, -6.4516],
          [35.5122, -5.7893]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Mbeya",
        "region": "Mbeya",
        "population": 2707410,
        "delivery_zones": ["Mbeya City", "Chunya", "Kyela", "Rungwe"]
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [32.6396, -8.5411], [34.0234, -8.5411],
          [34.0234, -9.6758], [32.6396, -9.6758],
          [32.6396, -8.5411]
        ]]
      }
    }
  ]
};

export const tanzaniaBoundary = {
  "type": "Feature",
  "properties": {
    "name": "United Republic of Tanzania",
    "iso_code": "TZ"
  },
  "geometry": {
    "type": "Polygon", 
    "coordinates": [[
      [29.340, -1.056], [40.444, -1.056], [40.444, -11.761],
      [29.340, -11.761], [29.340, -1.056]
    ]]
  }
};

// Major cities coordinates for delivery tracking
export const tanzaniaCities = {
  "Dar es Salaam": [-6.7924, 39.2083],
  "Arusha": [-3.3869, 36.6830], 
  "Mwanza": [-2.5164, 32.9175],
  "Dodoma": [-6.1722, 35.7419],
  "Mbeya": [-8.9094, 33.4607],
  "Tanga": [-5.0685, 39.0982],
  "Morogoro": [-6.8235, 37.6606],
  "Tabora": [-5.0167, 32.8333],
  "Kigoma": [-4.8780, 29.6267],
  "Iringa": [-7.7667, 35.6917]
};

// Delivery zones with boundaries in Dar es Salaam
export const darEsSalaamZones = [
  {
    name: "Kinondoni",
    center: [-6.7731, 39.2394],
    boundary: [
      [39.1500, -6.6500], [39.3500, -6.6500],
      [39.3500, -6.8500], [39.1500, -6.8500],
      [39.1500, -6.6500]
    ]
  },
  {
    name: "Ilala", 
    center: [-6.8162, 39.2794],
    boundary: [
      [39.2000, -6.7500], [39.3500, -6.7500],
      [39.3500, -6.9000], [39.2000, -6.9000],
      [39.2000, -6.7500]
    ]
  },
  {
    name: "Temeke",
    center: [-6.8631, 39.2639],
    boundary: [
      [39.1500, -6.8000], [39.3500, -6.8000],
      [39.3500, -6.9500], [39.1500, -6.9500],
      [39.1500, -6.8000]
    ]
  },
  {
    name: "Ubungo",
    center: [-6.7500, 39.2167],
    boundary: [
      [39.1000, -6.7000], [39.2500, -6.7000],
      [39.2500, -6.8000], [39.1000, -6.8000],
      [39.1000, -6.7000]
    ]
  }
];