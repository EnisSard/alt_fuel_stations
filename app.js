require(["esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer", "esri/widgets/Expand"], 
function (Map, MapView, FeatureLayer, Expand) {

    const map = new Map({
        basemap: "streets-navigation-vector"
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-98, 39],
        zoom: 4
    });

    const fuelTypes = [
      { value: "ELEC", label: "Electric", color: "blue" },
      { value: "E85", label: "Ethanol (E85)", color: "green" },
      { value: "LPG", label: "Propane (LPG)", color: "orange" },
      { value: "CNG", label: "Compressed Natural Gas (CNG)", color: "purple" },
      { value: "BD", label: "Biodiesel (B20+)", color: "brown" },
      { value: "RD", label: "Renewable Diesel (R20+)", color: "gold" },
      { value: "HY", label: "Hydrogen", color: "red" },
      { value: "LNG", label: "Liquefied Natural Gas (LNG)", color: "cyan" }
    ];

    const fuelLayer = new FeatureLayer({
      url: "https://services9.arcgis.com/RHVPKKiFTONKtxq3/arcgis/rest/services/Alternate_Fuel/FeatureServer/0",
      renderer: {
        type: "unique-value",
        field: "Fuel_Type",
        uniqueValueInfos: fuelTypes.map(f => ({
          value: f.value,
          symbol: { type: "simple-marker", color: f.color, size: 6 }
        }))
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

    // Build the checkbox sidebar HTML
    const filterDiv = document.createElement("div");
    filterDiv.style.padding = "10px";
    filterDiv.style.background = "white";
    filterDiv.style.maxHeight = "300px";
    filterDiv.style.overflowY = "auto";

    fuelTypes.forEach(f => {
      const row = document.createElement("label");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.marginBottom = "6px";
      row.style.cursor = "pointer";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.value = f.value;
      checkbox.style.marginRight = "8px";
      checkbox.addEventListener("change", updateFilter);

      const swatch = document.createElement("span");
      swatch.style.width = "12px";
      swatch.style.height = "12px";
      swatch.style.background = f.color;
      swatch.style.display = "inline-block";
      swatch.style.marginRight = "6px";
      swatch.style.borderRadius = "50%";

      row.appendChild(checkbox);
      row.appendChild(swatch);
      row.appendChild(document.createTextNode(f.label));
      filterDiv.appendChild(row);
    });

    function updateFilter() {
      const checked = Array.from(filterDiv.querySelectorAll("input[type=checkbox]:checked"))
        .map(cb => `'${cb.value}'`);

      if (checked.length === 0) {
        fuelLayer.definitionExpression = "1=0"; // show nothing
      } else {
        fuelLayer.definitionExpression = `Fuel_Type IN (${checked.join(",")})`;
      }
    }

    const filterExpand = new Expand({
      view: view,
      content: filterDiv,
      expandTooltip: "Show/hide fuel types",
      expanded: false
    });

    view.ui.add(filterExpand, "top-right");

});