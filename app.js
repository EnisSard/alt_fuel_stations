require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer"], function (Map, MapView, FeatureLayer) {

    const map = new Map({
        basemap: "streets-navigation-vector"
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-98, 39],
        zoom: 4
    });

const fuelLayer = new FeatureLayer({
  url: "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Alternate_Fuel/FeatureServer/0",
  renderer: {
    type: "unique-value",
    field: "Fuel_Type",
    uniqueValueInfos: [
      { value: "ELEC", symbol: { type: "simple-marker", color: "blue", size: 6 } },
      { value: "E85", symbol: { type: "simple-marker", color: "green", size: 6 } },
      { value: "LPG", symbol: { type: "simple-marker", color: "orange", size: 6 } },
      { value: "CNG", symbol: { type: "simple-marker", color: "purple", size: 6 } },
      { value: "BD", symbol: { type: "simple-marker", color: "brown", size: 6 } },
      { value: "RD", symbol: { type: "simple-marker", color: "gold", size: 6 } },
      { value: "HY", symbol: { type: "simple-marker", color: "red", size: 6 } },
      { value: "LNG", symbol: { type: "simple-marker", color: "cyan", size: 6 } }
    ]
  },
  popupTemplate: {
    title: "{Station_Name}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          { fieldName: "Fuel_Type", label: "Fuel Type" },
          { fieldName: "City", label: "City" },
          { fieldName: "Current_Status", label: "Status" }
        ]
      }
    ]
  }
});
    map.add(fuelLayer);

});