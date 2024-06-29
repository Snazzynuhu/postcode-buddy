document.addEventListener("DOMContentLoaded", () => {
    const postcode1 = document.getElementById("postcode1");
    const postcode2 = document.getElementById("postcode2");
    const distanceForm = document.getElementById("distance-form");
    const distanceResult = document.getElementById("distance-result");
    const postcodeInfoDiv = document.getElementById("postcode-info");
  
    const postcodesToLookup = [
          "SW1A1AA",
          "EC1A1BB",
          "AB101XG",
          "AB106RN",
          "AB107JB",
          "AB115QN",
          "AB116UL",
          "AB118RQ",
          "AB123FJ",
          "AB124NA",
          "AB125GL",
          "AB129SP",
          "AB140TQ",
          "AB155HB",
          "AB156NA",
          "AB158UF",
          "AB159SE",
          "AB165ST",
          "AB166SZ",
          "AB167NX",
          "CH14BJ",
      ];
  
      fetch("https://api.postcodes.io/postcodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postcodes: postcodesToLookup }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const postcodes = data.result;
          postcodes.forEach((postcode) => {
            const option1 = document.createElement("option");
            option1.value = postcode.query;
            option1.textContent = postcode.query;
            postcode1.appendChild(option1);
  
            const option2 = document.createElement("option");
            option2.value = postcode.query;
            option2.textContent = postcode.query;
            postcode2.appendChild(option2);
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    
  
    if (distanceForm) {
      distanceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const p1 = postcode1.value;
        const p2 = postcode2.value;
  
        const twoPostCodes = [p1, p2];
  
        fetch("https://api.postcodes.io/postcodes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postcodes: twoPostCodes }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            const postcodeLatitude1 = data.result[0].result.latitude;
            const postcodeLongitude1 = data.result[0].result.longitude;
            const postcodeLatitude2 = data.result[1].result.latitude;
            const postcodeLongitude2 = data.result[1].result.longitude;
  
            const distance = calculateDistance(
              postcodeLatitude1,
              postcodeLongitude1,
              postcodeLatitude2,
              postcodeLongitude2
            );
            distanceResult.textContent = `Distance: ${distance} meters`;
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
  
        function toRadians(degrees) {
          return (degrees * Math.PI) / 180;
        }
  
        function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
          const R = 6371000; // Radius of the Earth in meters
          latitude1 = toRadians(latitude1);
          longitude1 = toRadians(longitude1);
          latitude2 = toRadians(latitude2);
          longitude2 = toRadians(longitude2);
  
          const dLat = latitude2 - latitude1;
          const dLon = longitude2 - longitude1;
  
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latitude1) *
              Math.cos(latitude2) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
  
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;
          return distance.toFixed(2);
        }
      });
    }
  
    if (postcodeInfoDiv) {
      const urlParams = new URLSearchParams(window.location.search);
      const postcode = urlParams.get("postcode");
      if (postcode) {
        fetch(`https://api.postcodes.io/postcodes/${postcode}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            const postcodeData = data.result;
            const info = `
                          <p><strong>Postcode:</strong> ${postcodeData.postcode}</p>
                          <p><strong>Country:</strong> ${postcodeData.country}</p>
                          <p><strong>Region:</strong> ${postcodeData.region}</p>
                          <p><strong>Admin District:</strong> ${postcodeData.admin_district}</p>
                          <p><strong>Parliamentary Constituency:</strong> ${postcodeData.parliamentary_constituency}</p>
                          <p><strong>Latitude:</strong> ${postcodeData.latitude}</p>
                          <p><strong>Longitude:</strong> ${postcodeData.longitude}</p>
                      `;
            postcodeInfoDiv.innerHTML = info;
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    }
  });
  